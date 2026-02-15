import { ArrowUpRight, ArrowDownRight, ArrowRight, type LucideIcon } from "lucide-react";

interface StatCardProps {
    title: string;
    value: string;
    trend: string;
    trendDirection: 'up' | 'down' | 'neutral';
    icon: LucideIcon;
    color: string; // Tailwind text color class
}

export const StatCard = ({ title, value, trend, trendDirection, icon: Icon, color }: StatCardProps) => (
    <div className="card  border border-base-content/5 shadow-sm hover:shadow-md transition-shadow">
        <div className="card-body p-5">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-50 mb-1">{title}</p>
                    <h3 className="text-2xl font-black tracking-tight">{value}</h3>
                </div>
                <div className={`p-2.5 rounded-xl bg-base-200/50 ${color}`}>
                    <Icon size={20} />
                </div>
            </div>
            
            <div className="mt-4 flex items-center gap-2 text-xs font-bold">
                <span className={`flex items-center gap-1 ${
                    trendDirection === 'up' ? 'text-success' : 
                    trendDirection === 'down' ? 'text-error' : 'text-warning'
                }`}>
                    {trendDirection === 'up' ? <ArrowUpRight size={14} /> : 
                     trendDirection === 'down' ? <ArrowDownRight size={14} /> : <ArrowRight size={14} />}
                    {trend}
                </span>
                <span className="opacity-40 font-medium">vs last period</span>
            </div>
        </div>
    </div>
);