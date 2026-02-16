import { UserPlus, CreditCard, ShieldAlert, GraduationCap } from "lucide-react";

const ACTIVITIES = [
    { id: 1, type: 'signup', user: 'David O.', msg: 'registered as an instructor', time: '2m ago', icon: UserPlus, color: 'text-info' },
    { id: 2, type: 'sale', user: 'Sarah K.', msg: 'purchased "React 19 Deep Dive"', time: '15m ago', icon: CreditCard, color: 'text-success' },
    { id: 3, type: 'flag', user: 'System', msg: 'flagged a comment in "Python Basics"', time: '1h ago', icon: ShieldAlert, color: 'text-error' },
];

export const ActivityFeed = () => {
    return (
        <div className="card bg-base-100 border border-base-content/5 shadow-sm overflow-hidden h-full">
            <div className="p-6 border-b border-base-content/5 flex justify-between items-center">
                <h3 className="font-black text-lg tracking-tight">System Live Feed</h3>
                <span className="badge badge-primary badge-outline badge-sm font-bold uppercase">Live</span>
            </div>
            
            <div className="divide-y divide-base-content/5">
                {ACTIVITIES.map((item) => (
                    <div key={item.id} className="p-4 hover:bg-base-200/50 transition-colors flex gap-4 items-start">
                        <div className={`p-2 rounded-xl bg-base-200 ${item.color}`}>
                            <item.icon size={18} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold leading-none">
                                <span className="text-base-content">{item.user} </span>
                                <span className="opacity-60 font-medium">{item.msg}</span>
                            </p>
                            <p className="text-[10px] font-black uppercase opacity-30 mt-1">{item.time}</p>
                        </div>
                    </div>
                ))}
            </div>
            <button className="btn btn-ghost btn-block btn-sm rounded-none border-t border-base-content/5 opacity-50 text-xs">View All Logs</button>
        </div>
    );
};