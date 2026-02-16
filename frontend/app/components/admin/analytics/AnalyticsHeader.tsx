import { Calendar, Download, RefreshCw } from "lucide-react";

export const AnalyticsHeader = () => {
    return (
        <div className="flex flex-col md:flex-row justify-between items-end gap-4 mb-8">
            <div>
                <h1 className="text-3xl font-black tracking-tight">Platform Analytics</h1>
                <p className="text-base-content/50 font-medium">
                    Monitor student engagement, retention, and content performance.
                </p>
            </div>
            
            <div className="flex items-center gap-2 bg-base-100 p-1 rounded-xl border border-base-content/5 shadow-sm">
                <button className="btn btn-sm btn-ghost gap-2 text-xs font-bold">
                    <Calendar size={14} /> Last 30 Days
                </button>
                <div className="w-px h-4 bg-base-content/10"></div>
                <button className="btn btn-sm btn-ghost btn-square" title="Refresh Data">
                    <RefreshCw size={14} />
                </button>
                <button className="btn btn-sm btn-primary gap-2 text-xs">
                    <Download size={14} /> Export Report
                </button>
            </div>
        </div>
    );
};