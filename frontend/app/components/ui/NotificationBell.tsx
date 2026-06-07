import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router";
import { 
    Bell, Check, MessageSquare, Award, MonitorPlay, 
    Calendar, FileBadge, Info 
} from "lucide-react";
import { useNotificationStore } from "~/hooks/useNotificationSocket";
import type { NotificationItem } from "~/hooks/useNotificationSocket";
import "./NotificationBell.css";

export const NotificationBell = () => {
    const { notifications, unreadCount, markAsRead, markAllRead } = useNotificationStore();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const location = useLocation();

    let basePath = "/dashboard";
    if (location.pathname.startsWith("/cms")) {
        basePath = "/cms";
    } else if (location.pathname.startsWith("/admin")) {
        basePath = "/admin";
    }

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen]);

    const getIconForType = (type: string) => {
        switch (type) {
            case "chat_message":
            case "mentor_reply":
                return <MessageSquare size={16} className="text-info" />;
            case "achievement":
                return <Award size={16} className="text-warning" />;
            case "course_update":
                return <MonitorPlay size={16} className="text-primary" />;
            case "deadline":
                return <Calendar size={16} className="text-error" />;
            case "certificate":
                return <FileBadge size={16} className="text-success" />;
            default:
                return <Info size={16} className="text-base-content/50" />;
        }
    };

    const handleNotificationClick = (notification: NotificationItem) => {
        if (!notification.is_read) {
            markAsRead(notification.id);
        }
        setIsOpen(false);
        if (notification.link) {
            navigate(notification.link);
        }
    };

    // Show only top 8 notifications in the dropdown
    const displayNotifications = notifications.slice(0, 8);

    return (
        <div className="relative" ref={dropdownRef}>
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="btn btn-ghost btn-circle btn-sm relative hover:bg-primary/10 hover:text-primary transition-colors"
                aria-label="Notifications"
            >
                <Bell size={20} />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-error rounded-full ring-2 ring-base-100 flex items-center justify-center">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-error opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-error"></span>
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="notification-dropdown absolute right-0 mt-2 w-80 sm:w-96 bg-base-100/95 backdrop-blur-xl border border-base-content/10 rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col max-h-[85vh]">
                    {/* Header */}
                    <div className="p-4 border-b border-base-content/10 flex items-center justify-between shrink-0 bg-base-100">
                        <h3 className="font-bold text-sm tracking-tight">Notifications</h3>
                        {unreadCount > 0 && (
                            <button 
                                onClick={(e) => { e.stopPropagation(); markAllRead(); }}
                                className="text-xs text-primary hover:text-primary-focus font-medium flex items-center gap-1 transition-colors"
                            >
                                <Check size={14} />
                                Mark all as read
                            </button>
                        )}
                    </div>

                    {/* Notification List */}
                    <div className="overflow-y-auto notification-scroll flex-1 p-2">
                        {displayNotifications.length === 0 ? (
                            <div className="py-12 text-center flex flex-col items-center justify-center gap-3 opacity-50">
                                <div className="w-12 h-12 rounded-full bg-base-content/5 flex items-center justify-center">
                                    <Bell size={24} className="opacity-50" />
                                </div>
                                <p className="text-sm font-medium">No notifications yet</p>
                            </div>
                        ) : (
                            <div className="space-y-1">
                                {displayNotifications.map((notif) => (
                                    <button
                                        key={notif.id}
                                        onClick={() => handleNotificationClick(notif)}
                                        className={`notification-item w-full text-left p-3 rounded-xl flex gap-3 ${
                                            !notif.is_read ? 'unread' : ''
                                        }`}
                                    >
                                        <div className="shrink-0 mt-0.5 w-8 h-8 rounded-full bg-base-100 flex items-center justify-center shadow-sm border border-base-content/5">
                                            {getIconForType(notif.type)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2 mb-1">
                                                <p className={`text-sm truncate font-bold ${!notif.is_read ? 'text-base-content' : 'text-base-content/80'}`}>
                                                    {notif.title}
                                                </p>
                                                {!notif.is_read && (
                                                    <span className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1.5" />
                                                )}
                                            </div>
                                            <p className="text-xs text-base-content/60 line-clamp-2 leading-relaxed mb-2">
                                                {notif.text}
                                            </p>
                                            <p className="text-[10px] text-base-content/40 font-mono tracking-wider uppercase">
                                                {notif.time}
                                            </p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="p-3 border-t border-base-content/10 shrink-0 bg-base-100/50">
                        <Link 
                            to={`${basePath}/notifications`} 
                            onClick={() => setIsOpen(false)}
                            className="btn btn-ghost btn-sm btn-block text-xs uppercase tracking-widest font-black"
                        >
                            View All Notifications
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
};
