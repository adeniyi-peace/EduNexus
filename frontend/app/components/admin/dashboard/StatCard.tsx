import { ArrowUpRight, ArrowDownRight, type LucideIcon } from "lucide-react";

interface StatCardProps {
    title: string;
    value: string;
    trend: number; // e.g., +12.5 or -3.2
    icon: LucideIcon;
    description: string;
}

export const StatCard = ({ title, value, trend, icon: Icon, description }: StatCardProps) => {
    const isPositive = trend > 0;

    return (
        <div className="card bg-base-100 border border-base-content/5 shadow-sm p-6 overflow-hidden relative group transition-all hover:border-primary/20">
            {/* Background Accent Decor */}
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors" />
            
            <div className="flex justify-between items-start relative z-10">
                <div className="space-y-1">
                    <p className="text-xs font-black uppercase tracking-widest opacity-50">{title}</p>
                    <h2 className="text-3xl font-black tracking-tighter">{value}</h2>
                </div>
                <div className={`p-3 rounded-2xl ${isPositive ? 'bg-success/10 text-success' : 'bg-error/10 text-error'}`}>
                    <Icon size={24} />
                </div>
            </div>

            <div className="mt-4 flex items-center gap-2 relative z-10">
                <div className={`flex items-center text-xs font-black px-2 py-1 rounded-lg ${isPositive ? 'bg-success/10 text-success' : 'bg-error/10 text-error'}`}>
                    {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                    {Math.abs(trend)}%
                </div>
                <span className="text-[10px] font-bold opacity-40 uppercase">{description}</span>
            </div>
        </div>
    );
};