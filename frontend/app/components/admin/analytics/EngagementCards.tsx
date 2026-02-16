import { Users, Clock, BookOpen, Zap } from "lucide-react";

const METRICS = [
    { label: "Daily Active Users", value: "1,240", change: "+12%", icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Avg. Watch Time", value: "42m", change: "+5%", icon: Clock, color: "text-purple-500", bg: "bg-purple-500/10" },
    { label: "Lesson Completion", value: "68%", change: "-2%", icon: BookOpen, color: "text-green-500", bg: "bg-green-500/10" },
    { label: "Engagement Rate", value: "High", change: "Stable", icon: Zap, color: "text-orange-500", bg: "bg-orange-500/10" },
];

export const EngagementCards = () => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {METRICS.map((m, i) => (
                <div key={i} className="card bg-base-100 border border-base-content/5 shadow-sm p-5 hover:border-primary/20 transition-all">
                    <div className="flex justify-between items-start mb-4">
                        <div className={`p-2 rounded-lg ${m.bg} ${m.color}`}>
                            <m.icon size={20} />
                        </div>
                        <span className={`badge badge-sm font-bold border-none ${m.change.startsWith('+') ? 'bg-success/10 text-success' : 'bg-base-200 text-base-content/60'}`}>
                            {m.change}
                        </span>
                    </div>
                    <div>
                        <h3 className="text-2xl font-black tracking-tight">{m.value}</h3>
                        <p className="text-xs font-bold opacity-40 uppercase tracking-wide">{m.label}</p>
                    </div>
                    
                    {/* Simulated Sparkline (Visual decoration) */}
                    <div className="flex items-end gap-1 h-6 mt-4 opacity-20">
                        {[40, 70, 45, 90, 60, 75, 50, 80].map((h, idx) => (
                            <div key={idx} className="w-full bg-current rounded-t-sm" style={{ height: `${h}%` }} />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};