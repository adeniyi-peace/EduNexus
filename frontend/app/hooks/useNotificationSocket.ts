import { create } from "zustand";
import { useEffect, useRef, useCallback } from "react";
import api from "~/utils/api.client";
import { ACCESS_TOKEN } from "~/utils/constants";
import { useUserContext } from "./useUserContext";

export interface NotificationItem {
    id: number;
    type: string;
    title: string;
    text: string;
    is_read: boolean;
    link: string;
    time: string;
    sender_name?: string;
}

interface NotificationState {
    notifications: NotificationItem[];
    unreadCount: number;
    isConnected: boolean;
    setNotifications: (notifications: NotificationItem[]) => void;
    setUnreadCount: (count: number) => void;
    addNotification: (notification: NotificationItem) => void;
    markAsRead: (id: number) => Promise<void>;
    markAllRead: () => Promise<void>;
    fetchInitial: () => Promise<void>;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
    notifications: [],
    unreadCount: 0,
    isConnected: false,

    setNotifications: (notifications) => set({ notifications }),
    
    setUnreadCount: (count) => set({ unreadCount: count }),
    
    addNotification: (notification) => set((state) => {
        // Prevent duplicates
        if (state.notifications.some(n => n.id === notification.id)) {
            return state;
        }
        return {
            notifications: [notification, ...state.notifications],
            unreadCount: state.unreadCount + 1
        };
    }),

    markAsRead: async (id) => {
        // Optimistic update
        set((state) => ({
            notifications: state.notifications.map(n => 
                n.id === id ? { ...n, is_read: true } : n
            ),
            unreadCount: Math.max(0, state.unreadCount - 1)
        }));

        try {
            await api.patch(`/users/notifications/${id}/mark_read/`);
        } catch (error) {
            console.error("Failed to mark notification as read:", error);
            // Revert optimistic update could be implemented here
        }
    },

    markAllRead: async () => {
        // Optimistic update
        set((state) => ({
            notifications: state.notifications.map(n => ({ ...n, is_read: true })),
            unreadCount: 0
        }));

        try {
            await api.patch('/users/notifications/mark_all_read/');
        } catch (error) {
            console.error("Failed to mark all as read:", error);
        }
    },

    fetchInitial: async () => {
        try {
            const [notifRes, countRes] = await Promise.all([
                api.get('/users/notifications/'),
                api.get('/users/notifications/unread_count/')
            ]);
            set({ 
                notifications: notifRes.data,
                unreadCount: countRes.data.unread_count
            });
        } catch (error) {
            console.error("Failed to fetch initial notifications:", error);
        }
    }
}));

export const useNotificationSocket = () => {
    const { isAuthenticated } = useUserContext();
    const { 
        fetchInitial, 
        addNotification, 
        setUnreadCount 
    } = useNotificationStore();
    
    const socketRef = useRef<WebSocket | null>(null);
    const reconnectAttempts = useRef(0);
    const reconnectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const maxReconnectAttempts = 5;

    const connect = useCallback(() => {
        if (!isAuthenticated) return;

        const token = localStorage.getItem(ACCESS_TOKEN);
        if (!token) return;

        const apiHost = import.meta.env.VITE_BACKEND_API_HOST || "http://localhost:8000";
        const wsProtocol = apiHost.startsWith("https") ? "wss" : "ws";
        const wsHost = apiHost.replace(/^https?:\/\//, "").replace(/\/$/, "");
        const wsUrl = `${wsProtocol}://${wsHost}/ws/notifications/?token=${token}`;

        const ws = new WebSocket(wsUrl);
        socketRef.current = ws;

        ws.onopen = () => {
            useNotificationStore.setState({ isConnected: true });
            reconnectAttempts.current = 0;
            // Fetch initial state via REST to ensure we didn't miss anything while disconnected
            fetchInitial();
        };

        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);

                if (data.type === 'initial_state' || data.type === 'unread_count_update') {
                    setUnreadCount(data.unread_count);
                } else if (data.type === 'new_notification') {
                    addNotification(data.notification);
                }
            } catch (error) {
                console.error("Failed to parse notification WS message");
            }
        };

        ws.onclose = (event) => {
            useNotificationStore.setState({ isConnected: false });
            
            // Reconnect unless auth failed
            if (event.code !== 4001 && event.code !== 4003 && event.code !== 1000) {
                attemptReconnect();
            }
        };

        ws.onerror = () => {
            useNotificationStore.setState({ isConnected: false });
        };
    }, [isAuthenticated, fetchInitial, addNotification, setUnreadCount]);

    const attemptReconnect = useCallback(() => {
        if (reconnectAttempts.current >= maxReconnectAttempts) return;

        const delay = Math.pow(2, reconnectAttempts.current) * 1000;
        reconnectAttempts.current += 1;

        reconnectTimer.current = setTimeout(() => {
            connect();
        }, delay);
    }, [connect]);

    useEffect(() => {
        if (isAuthenticated) {
            connect();
        }

        return () => {
            if (reconnectTimer.current) {
                clearTimeout(reconnectTimer.current);
            }
            if (socketRef.current) {
                socketRef.current.close(1000);
                socketRef.current = null;
            }
        };
    }, [isAuthenticated, connect]);
};
