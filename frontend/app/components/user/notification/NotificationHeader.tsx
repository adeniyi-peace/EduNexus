import { CheckCircle2, Filter } from "lucide-react";
import type { NotificationType } from "~/types/notification";

interface HeaderProps {
    activeFilter: NotificationType | 'all';
    setFilter: (f: NotificationType | 'all') => void;
    onMarkAllRead: () => void;
    unreadCount: number;
}

export const NotificationHeader = ({ activeFilter, setFilter, onMarkAllRead, unreadCount }: HeaderProps) => {
    const filters = [
        { id: 'all', label: 'All' },
        { id: 'mention', label: 'Mentions' },
        { id: 'course_update', label: 'Course Updates' },
        { id: 'grade', label: 'Grades' },
    ];

    return (
        <div className="sticky top-0 z-10 backdrop-blur-md pb-4 pt-2 border-b border-base-content/5 mb-6">
            <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4 mb-4">
                <div>
                    <h1 className="text-2xl font-black flex items-center gap-2">
                        Inbox 
                        {unreadCount > 0 && <span className="badge badge-primary badge-lg">{unreadCount}</span>}
                    </h1>
                    <p className="text-sm opacity-60">Stay updated with your learning journey.</p>
                </div>
                <button 
                    onClick={onMarkAllRead}
                    className="btn btn-sm btn-ghost text-primary font-bold gap-2 hover:bg-primary/10"
                    disabled={unreadCount === 0}
                >
                    <CheckCircle2 size={16} /> Mark all read
                </button>
            </div>

            {/* Scrollable Filters */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
                <Filter size={16} className="opacity-40 shrink-0 mx-2" />
                {filters.map((f) => (
                    <button
                        key={f.id}
                        onClick={() => setFilter(f.id as any)}
                        className={`btn btn-sm rounded-full shrink-0 border-none transition-all
                            ${activeFilter === f.id 
                                ? 'bg-base-content text-base-100 hover:bg-base-content/80' 
                                : 'bg-base-200 text-base-content/60 hover:bg-base-300'}`}
                    >
                        {f.label}
                    </button>
                ))}
            </div>
        </div>
    );
};