import { Globe, Search, Mail, Share2 } from "lucide-react";

export const TrafficSources = () => {
    const sources = [
        { label: "Google Search", percent: 45, icon: Search, color: "bg-blue-500" },
        { label: "Direct / Email", percent: 25, icon: Mail, color: "bg-purple-500" },
        { label: "Social Media", percent: 20, icon: Share2, color: "bg-pink-500" },
        { label: "Referrals", percent: 10, icon: Globe, color: "bg-green-500" },
    ];

    return (
        <div className="card border border-base-content/5 shadow-sm p-6 h-full">
            <h3 className="font-bold text-lg mb-6">Traffic Sources</h3>
            <div className="space-y-6">
                {sources.map((source, i) => (
                    <div key={i} className="group">
                        <div className="flex justify-between items-center mb-2 text-xs font-bold">
                            <div className="flex items-center gap-2 opacity-70">
                                <source.icon size={14} />
                                <span>{source.label}</span>
                            </div>
                            <span>{source.percent}%</span>
                        </div>
                        <div className="w-full bg-base-200 rounded-full h-2 overflow-hidden">
                            <div 
                                className={`h-full rounded-full ${source.color} opacity-80 group-hover:opacity-100 transition-all duration-500`} 
                                style={{ width: `${source.percent}%` }}
                            ></div>
                        </div>
                    </div>
                ))}
            </div>
            
            <div className="mt-auto pt-6">
                <div className="alert bg-base-200/50 border-none text-xs">
                    <Search size={16} className="text-primary" />
                    <span className="opacity-70">Most students find you via <b>Organic Search</b>. Consider optimizing your course SEO titles.</span>
                </div>
            </div>
        </div>
    );
};