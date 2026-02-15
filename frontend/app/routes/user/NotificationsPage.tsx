import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BellOff } from "lucide-react";
import type { NotificationItem, NotificationType } from "~/types/notification";
import { NotificationHeader } from "~/components/user/notification/NotificationHeader";
import { NotificationCard } from "~/components/user/notification/NotificationCard";

// Mock Data Generator
const MOCK_DATA: NotificationItem[] = [
    {
        id: "1", type: "mention", title: "New Reply", message: "Hey! I think you missed the dependency array in that useEffect hook example.",
        timestamp: new Date(Date.now() - 1000 * 60 * 5), isRead: false, link: "/discussion/123",
        actor: { id: "u1", name: "Sarah Dev", role: "student", avatar: "https://i.pravatar.cc/150?u=sarah" }
    },
    {
        id: "2", type: "grade", title: "Assignment Graded", message: "Great job on the API integration task!",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), isRead: false, link: "/assignments/456",
        meta: { grade: 92, courseName: "Advanced Node.js" },
        actor: { id: "sys", name: "AutoGrader", role: "system" }
    },
    {
        id: "3", type: "course_update", title: "New Module Released", message: "Module 4: Server Components is now live.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), isRead: true, link: "/course/nextjs-mastery",
        actor: { id: "i1", name: "Instructor Alex", role: "instructor", avatar: "https://i.pravatar.cc/150?u=alex" }
    }
];

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState<NotificationItem[]>(MOCK_DATA);
    const [filter, setFilter] = useState<NotificationType | 'all'>('all');

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