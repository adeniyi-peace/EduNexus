import { UserPlus, CreditCard, ShieldAlert, GraduationCap, Clock } from "lucide-react";
import type { AdminActivityItem } from "~/types/admin";

interface Props {
    items: AdminActivityItem[];
    isLoading?: boolean;
}

const getIcon = (type: string) => {
    switch (type) {
        case 'enrollment': return GraduationCap;
        case 'payment': return CreditCard;
        case 'review': return ShieldAlert;
        default: return Clock;
    }
}
const getColor = (type: string) => {
    switch (type) {
        case 'enrollment': return 'text-info';
        case 'payment': return 'text-success';
        case 'review': return 'text-warning';
        default: return 'text-neutral';
    }
}

export const ActivityFeed = ({ items, isLoading }: Props) => {
    return (
        <div className="card bg-base-100 border border-base-content/5 shadow-sm overflow-hidden h-full">
            <div className="p-6 border-b border-base-content/5 flex justify-between items-center">
                <h3 className="font-black text-lg tracking-tight">System Live Feed</h3>
                <span className="badge badge-primary badge-outline badge-sm font-bold uppercase">Live</span>
            </div>
            
            <div className="divide-y divide-base-content/5">
                {items.length === 0 ? (
                    <div className="p-4 text-center opacity-50 font-bold text-sm">No recent activity</div>
                ) : items.map((item) => {
                    const Icon = getIcon(item.type);
                    return (
                        <div key={item.id} className="p-4 hover:bg-base-200/50 transition-colors flex gap-4 items-start">
                            <div className={`p-2 rounded-xl bg-base-200 ${getColor(item.type)}`}>
                                <Icon size={18} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold leading-none">
                                    <span className="text-base-content">{item.user} </span>
                                    <span className="opacity-60 font-medium">{item.action} </span>
                                    <span className="italic">'{item.target}'</span>
                                </p>
                                <p className="text-[10px] font-black uppercase opacity-30 mt-1">{new Date(item.time).toLocaleTimeString()}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
            <button className="btn btn-ghost btn-block btn-sm rounded-none border-t border-base-content/5 opacity-50 text-xs">View All Logs</button>
        </div>
    );
};