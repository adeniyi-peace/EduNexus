import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BellOff } from "lucide-react";
import type { NotificationItem, NotificationType } from "~/types/notification";
import { NotificationHeader } from "~/components/user/notification/NotificationHeader";
import { NotificationCard } from "~/components/user/notification/NotificationCard";
import { useEffect } from "react";
import api from "~/utils/api.client";

// Data transformer to match NotificationItem interface
const transformNotification = (data: any): NotificationItem => ({
    id: String(data.id),
    type: data.type as NotificationType,
    title: data.title || "Notification",
    message: data.text || data.message,
    timestamp: new Date(data.time || data.created_at),
    isRead: data.is_read,
    link: data.link || "#",
    actor: {
        id: "sys",
        name: "EduNexus",
        role: "system"
    }
});

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);
    const [filter, setFilter] = useState<NotificationType | 'all'>('all');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const res = await api.get("/users/notifications/");
                const data = Array.isArray(res.data) ? res.data : (res.data.results || []);
                setNotifications(data.map(transformNotification));
            } catch (err) {
                console.error("Failed to fetch notifications", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchNotifications();
    }, []);

    // Filter Logic
    const filteredNotifications = notifications.filter(n => 
        filter === 'all' ? true : n.type === filter
    );

    // Actions
    const handleMarkRead = (id: string) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    };

    const handleMarkAllRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    };

    const handleDelete = (id: string) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    const unreadCount = notifications.filter(n => !n.isRead).length;

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <span className="loading loading-dots loading-lg text-primary"></span>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            <div className="max-w-2xl mx-auto">
                <NotificationHeader 
                    activeFilter={filter} 
                    setFilter={setFilter} 
                    onMarkAllRead={handleMarkAllRead}
                    unreadCount={unreadCount}
                />

                <div className="space-y-2">
                    <AnimatePresence mode="popLayout">
                        {filteredNotifications.length > 0 ? (
                            filteredNotifications.map((notification) => (
                                <NotificationCard 
                                    key={notification.id} 
                                    notification={notification} 
                                    onMarkRead={handleMarkRead}
                                    onDelete={handleDelete}
                                />
                            ))
                        ) : (
                            <motion.div 
                                initial={{ opacity: 0 }} 
                                animate={{ opacity: 1 }}
                                className="flex flex-col items-center justify-center py-20 text-center opacity-50"
                            >
                                <div className="w-20 h-20 bg-base-200 rounded-full flex items-center justify-center mb-4">
                                    <BellOff size={32} />
                                </div>
                                <h3 className="font-black text-lg">No notifications</h3>
                                <p className="text-sm">You're all caught up! Enjoy your day.</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}