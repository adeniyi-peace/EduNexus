import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { MessageCircle, BookOpen, GraduationCap, Bell, Check, Trash2, ShieldAlert } from "lucide-react";
import { Link } from "react-router"; // Use React Router v7 Link
import type { NotificationItem } from "~/types/notification";

interface NotificationCardProps {
    notification: NotificationItem;
    onMarkRead: (id: string) => void;
    onDelete: (id: string) => void;
}

const IconMap = {
    mention: { icon: MessageCircle, color: "text-blue-500", bg: "bg-blue-500/10" },
    course_update: { icon: BookOpen, color: "text-purple-500", bg: "bg-purple-500/10" },
    grade: { icon: GraduationCap, color: "text-green-500", bg: "bg-green-500/10" },
    enrollment: { icon: Bell, color: "text-orange-500", bg: "bg-orange-500/10" },
    system: { icon: ShieldAlert, color: "text-base-content", bg: "bg-base-300" },
};

export const NotificationCard = ({ notification, onMarkRead, onDelete }: NotificationCardProps) => {
    const { icon: Icon, color, bg } = IconMap[notification.type] || IconMap.system;
    
    return (
        <motion.div 
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className={`group relative p-4 mb-3 rounded-2xl border transition-all duration-200 
                ${notification.isRead 
                    ? 'border-base-content/5 opacity-80 hover:opacity-100' 
                    : 'border-primary/30 shadow-sm shadow-primary/5'}`}
        >
            <div className="flex gap-4">
                {/* 1. Icon / Avatar Area */}
                <div className="shrink-0 relative">
                    {notification.actor.avatar ? (
                        <div className="avatar">
                            <div className="w-12 h-12 rounded-full ring ring-base-200 ring-offset-2 ring-offset-base-100">
                                <img src={notification.actor.avatar} alt={notification.actor.name} />
                            </div>
                        </div>
                    ) : (
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${bg} ${color}`}>
                            <Icon size={20} />
                        </div>
                    )}
                    
                    {/* Tiny Icon Badge if Avatar is used */}
                    {notification.actor.avatar && (
                        <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full ${bg} ${color} flex items-center justify-center border-2 border-base-100`}>
                            <Icon size={12} />
                        </div>
                    )}
                </div>

                {/* 2. Content Area */}
                <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                        <div>
                             <h4 className={`text-sm ${notification.isRead ? 'font-bold' : 'font-black text-base-content'}`}>
                                {notification.title}
                            </h4>
                            <p className="text-xs opacity-60 font-medium mt-0.5">
                                {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
                            </p>
                        </div>
                        
                        {/* Actions (Hover only on desktop) */}
                        <div className="flex gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                            {!notification.isRead && (
                                <button 
                                    onClick={() => onMarkRead(notification.id)}
                                    className="btn btn-circle btn-xs btn-ghost text-primary tooltip tooltip-left"
                                    data-tip="Mark as read"
                                >
                                    <Check size={14} />
                                </button>
                            )}
                            <button 
                                onClick={() => onDelete(notification.id)}
                                className="btn btn-circle btn-xs btn-ghost text-error/60 hover:text-error tooltip tooltip-left"
                                data-tip="Dismiss"
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>
                    </div>

                    <Link to={notification.link} className="block mt-2 group-hover:bg-base-200/50 p-2 -ml-2 rounded-lg transition-colors">
                        <p className="text-sm opacity-80 line-clamp-2 leading-relaxed">
                            <span className="font-bold text-base-content">{notification.actor.name}: </span>
                            {notification.message}
                        </p>
                        {notification.type === 'grade' && notification.meta?.grade && (
                            <div className="mt-2 badge badge-success badge-outline font-bold gap-1">
                                Score: {notification.meta.grade}%
                            </div>
                        )}
                        {notification.type === 'course_update' && (
                            <div className="mt-2 text-xs font-bold text-primary flex items-center gap-1">
                                View Content →
                            </div>
                        )}
                    </Link>
                </div>
                
                {/* 3. Unread Dot Indicator */}
                {!notification.isRead && (
                    <div className="absolute top-1/2 -translate-y-1/2 left-0 w-1 h-8 bg-primary rounded-r-full" />
                )}
            </div>
        </motion.div>
    );
};