// app/components/chat/useChatSocket.ts
// WebSocket hook with JWT authentication, reconnection, typing indicators,
// and connection state tracking.

import { useEffect, useRef, useState, useCallback } from "react";
import { ACCESS_TOKEN } from "~/utils/constants";
import type { ChatMessage, ConnectionStatus, WSEvent } from "~/types/chat";

interface UseChatSocketOptions {
    roomId: string | null;
    roomType: "room" | "dm";
    onMessage?: (msg: ChatMessage) => void;
}

interface TypingUser {
    userId: number;
    username: string;
}

export const useChatSocket = ({ roomId, roomType, onMessage }: UseChatSocketOptions) => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>("disconnected");
    const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);

    const socketRef = useRef<WebSocket | null>(null);
    const reconnectAttempts = useRef(0);
    const reconnectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const typingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const maxReconnectAttempts = 5;

    // Clear messages when room changes
    useEffect(() => {
        setMessages([]);
        setTypingUsers([]);
    }, [roomId, roomType]);

    const connect = useCallback(() => {
        if (!roomId) return;

        const token = localStorage.getItem(ACCESS_TOKEN);
        if (!token) {
            setConnectionStatus("error");
            return;
        }

        // Determine the WebSocket base URL from the API host
        const apiHost = import.meta.env.VITE_BACKEND_API_HOST || "http://localhost:8000";
        const wsProtocol = apiHost.startsWith("https") ? "wss" : "ws";
        const wsHost = apiHost.replace(/^https?:\/\//, "");
        const wsUrl = `${wsProtocol}://${wsHost}/ws/chat/${roomType}/${roomId}/?token=${token}`;

        setConnectionStatus("connecting");

        const ws = new WebSocket(wsUrl);
        socketRef.current = ws;

        ws.onopen = () => {
            setConnectionStatus("connected");
            reconnectAttempts.current = 0;
        };

        ws.onmessage = (event) => {
            try {
                const data: WSEvent = JSON.parse(event.data);

                if (data.type === "chat_message") {
                    const newMsg: ChatMessage = {
                        message_id: data.message_id,
                        sender: data.sender,
                        content: data.content,
                        message_type: data.message_type as ChatMessage["message_type"],
                        attachment_url: data.attachment_url || undefined,
                        attachment_name: data.attachment_name || undefined,
                        attachment_type: data.attachment_type || undefined,
                        is_read: false,
                        is_me: data.is_me,
                        created_at: data.created_at,
                    };

                    setMessages((prev) => [...prev, newMsg]);
                    onMessage?.(newMsg);

                    // Clear any typing indicator from this sender
                    setTypingUsers((prev) =>
                        prev.filter((u) => u.userId !== data.sender.id)
                    );
                } else if (data.type === "typing") {
                    if (data.is_typing) {
                        setTypingUsers((prev) => {
                            if (prev.some((u) => u.userId === data.user_id)) return prev;
                            return [...prev, { userId: data.user_id, username: data.username }];
                        });
                        // Auto-remove typing indicator after 4 seconds
                        setTimeout(() => {
                            setTypingUsers((prev) =>
                                prev.filter((u) => u.userId !== data.user_id)
                            );
                        }, 4000);
                    } else {
                        setTypingUsers((prev) =>
                            prev.filter((u) => u.userId !== data.user_id)
                        );
                    }
                }
                // user_event (join/leave) could be handled here for presence
            } catch {
                console.error("Failed to parse WebSocket message");
            }
        };

        ws.onclose = (event) => {
            setConnectionStatus("disconnected");

            // Only reconnect on unexpected close (not auth failures)
            if (event.code !== 4001 && event.code !== 4003 && event.code !== 1000) {
                attemptReconnect();
            }
        };

        ws.onerror = () => {
            setConnectionStatus("error");
        };
    }, [roomId, roomType, onMessage]);

    const attemptReconnect = useCallback(() => {
        if (reconnectAttempts.current >= maxReconnectAttempts) {
            setConnectionStatus("error");
            return;
        }

        // Exponential backoff: 1s, 2s, 4s, 8s, 16s
        const delay = Math.pow(2, reconnectAttempts.current) * 1000;
        reconnectAttempts.current += 1;

        reconnectTimer.current = setTimeout(() => {
            connect();
        }, delay);
    }, [connect]);

    // Connect/disconnect on room change
    useEffect(() => {
        connect();

        return () => {
            if (reconnectTimer.current) {
                clearTimeout(reconnectTimer.current);
            }
            if (socketRef.current) {
                socketRef.current.close(1000);
                socketRef.current = null;
            }
        };
    }, [connect]);

    // Send a chat message via WebSocket
    const sendMessage = useCallback(
        (
            message: string,
            attachment?: { url: string; type: string; name: string }
        ) => {
            if (socketRef.current?.readyState === WebSocket.OPEN) {
                socketRef.current.send(
                    JSON.stringify({
                        type: "chat_message",
                        message,
                        attachment_url: attachment?.url,
                        attachment_type: attachment?.type,
                        attachment_name: attachment?.name,
                    })
                );
            }
        },
        []
    );

    // Send typing indicator
    const sendTyping = useCallback((isTyping: boolean) => {
        if (socketRef.current?.readyState === WebSocket.OPEN) {
            socketRef.current.send(
                JSON.stringify({
                    type: "typing",
                    is_typing: isTyping,
                })
            );
        }
    }, []);

    // Debounced typing handler — call this on input change
    const handleTyping = useCallback(() => {
        sendTyping(true);

        if (typingTimerRef.current) {
            clearTimeout(typingTimerRef.current);
        }
        typingTimerRef.current = setTimeout(() => {
            sendTyping(false);
        }, 2000);
    }, [sendTyping]);

    return {
        messages,
        setMessages,
        connectionStatus,
        typingUsers,
        sendMessage,
        handleTyping,
    };
};