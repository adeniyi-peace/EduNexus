import { Users, Clock, BookOpen, Zap } from "lucide-react";
import type { AdminAnalyticsKpis } from "~/types/admin";

interface Props {
    kpis?: AdminAnalyticsKpis;
}

export const EngagementCards = ({ kpis }: Props) => {
    const METRICS = [
        { label: "Total Platform Users", value: kpis?.totalUsers?.toLocaleString() ?? "...", change: "+12%", icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
        { label: "Total Enrollments", value: kpis?.totalEnrollments?.toLocaleString() ?? "...", change: "+2%", icon: Zap, color: "text-purple-500", bg: "bg-purple-500/10" },
        { label: "Published Courses", value: kpis?.totalPublishedCourses?.toLocaleString() ?? "...", change: "Stable", icon: BookOpen, color: "text-green-500", bg: "bg-green-500/10" },
        { label: "Platform Rating", value: kpis ? `${kpis.avgPlatformRating.toFixed(1)}/5` : "...", change: "+0.1", icon: Zap, color: "text-orange-500", bg: "bg-orange-500/10" },
    ];

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