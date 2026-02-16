import { Maximize2, MoreHorizontal } from "lucide-react";

interface Props {
    title: string;
    subtitle?: string;
    children: React.ReactNode;
}

export const AnalyticsChart = ({ title, subtitle, children }: Props) => {
    return (
        <div className="card bg-base-100 border border-base-content/5 shadow-sm p-6 h-full flex flex-col">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h3 className="font-black text-lg">{title}</h3>
                    {subtitle && <p className="text-xs opacity-50 font-medium">{subtitle}</p>}
                </div>
                <div className="flex gap-1">
                    <button className="btn btn-ghost btn-xs btn-square opacity-50 hover:opacity-100">
                        <Maximize2 size={14} />
                    </button>
                    <button className="btn btn-ghost btn-xs btn-square opacity-50 hover:opacity-100">
                        <MoreHorizontal size={14} />
                    </button>
                </div>
            </div>
            
            {/* Chart Area */}
            <div className="flex-1 w-full min-h-62.5 relative bg-base-200/30 rounded-xl border border-dashed border-base-content/10 flex items-center justify-center group overflow-hidden">
                {/* Replace this 'children' with your <ResponsiveContainer> from Recharts 
                   or <Line /> from react-chartjs-2 
                */}
                <div className="absolute inset-0 p-4 opacity-50 group-hover:opacity-100 transition-opacity">
                    {children}
                </div>
                
                {/* Fallback visual if no chart is passed */}
                {!children && (
                    <span className="text-xs font-bold opacity-30 uppercase tracking-widest">
                        Chart Visualization
                    </span>
                )}
            </div>
        </div>
    );
};