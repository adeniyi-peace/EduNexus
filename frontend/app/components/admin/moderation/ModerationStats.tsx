import { AlertTriangle, ShieldAlert, MessageSquareX, UserMinus } from "lucide-react";

export const ModerationStats = () => {
    const STATS = [
        { label: "High Priority", value: "14", icon: ShieldAlert, color: "text-error", bg: "bg-error/10" },
        { label: "Reported Comments", value: "42", icon: MessageSquareX, color: "text-warning", bg: "bg-warning/10" },
        { label: "Flagged Profiles", value: "5", icon: UserMinus, color: "text-primary", bg: "bg-primary/10" },
        { label: "Resolved Today", value: "128", icon: AlertTriangle, color: "text-success", bg: "bg-success/10" },
    ];

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {STATS.map((stat, i) => (
                <div key={i} className="card bg-base-100 border border-base-content/5 p-4 flex-row items-center gap-4">
                    <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color}`}>
                        <stat.icon size={24} />
                    </div>
                    <div>
                        <p className="text-2xl font-black tracking-tighter">{stat.value}</p>
                        <p className="text-[10px] font-black uppercase opacity-40 tracking-widest">{stat.label}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};