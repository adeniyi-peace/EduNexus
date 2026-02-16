import { AnalyticsChart } from "~/components/admin/analytics/AnalyticsChart";
import { AnalyticsHeader } from "~/components/admin/analytics/AnalyticsHeader";
import { DeviceDonutChart } from "~/components/admin/analytics/DeviceDonutChart";
import { EngagementCards } from "~/components/admin/analytics/EngagementCards";
import { EngagementLineChart } from "~/components/admin/analytics/EngagementLineChart";
import { TopCourses } from "~/components/admin/analytics/TopCourses";


export default function AnalyticsPage() {
    return (
        <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            
            {/* Header Controls */}
            <AnalyticsHeader />

            {/* 1. High-Level Metrics */}
            <EngagementCards />

            {/* 2. Main Analytics Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Left: Main Traffic Chart (Span 2) */}
                <div className="lg:col-span-2">
                    <AnalyticsChart 
                        title="User Retention & Growth" 
                        subtitle="New signups vs. Returning students over time"
                    >
                         {/* Example of how to structure a CSS-only chart if you don't have Recharts yet.
                            Remove this block when you install a chart library.
                         */}
                         <div className="flex items-end justify-between h-full w-full gap-2 px-4 pb-2">
                             {[35, 50, 45, 60, 75, 55, 80, 70, 90, 65, 85, 95].map((h, i) => (
                                 <div key={i} className="w-full bg-primary/20 hover:bg-primary rounded-t-md transition-all relative group" style={{ height: `${h}%` }}>
                                     <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-base-300 text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                         {h}%
                                     </div>
                                 </div>
                             ))}
                         </div>
                    </AnalyticsChart>
                </div>

                {/* Right: Top Content (Span 1) */}
                <div className="lg:col-span-1 h-100 lg:h-auto">
                    <TopCourses />
                </div>
            </div>

            {/* 3. Secondary Grid (Demographics / Devices) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <AnalyticsChart title="Device Breakdown" subtitle="Mobile vs Desktop usage">
                     <div className="flex items-center justify-center h-full">
                         <div className="w-32 h-32 rounded-full border-8 border-primary border-r-secondary border-b-accent opacity-80" />
                     </div>
                </AnalyticsChart>
                
                <AnalyticsChart title="Geographic Distribution" subtitle="Top 5 active regions">
                    <div className="space-y-4 w-full max-w-xs mx-auto">
                        <div className="flex justify-between text-xs font-bold"><span>🇺🇸 USA</span><span>45%</span></div>
                        <progress className="progress progress-primary w-full" value="45" max="100"></progress>
                        
                        <div className="flex justify-between text-xs font-bold"><span>🇬🇧 UK</span><span>20%</span></div>
                        <progress className="progress progress-secondary w-full" value="20" max="100"></progress>
                        
                        <div className="flex justify-between text-xs font-bold"><span>🇮🇳 India</span><span>15%</span></div>
                        <progress className="progress progress-accent w-full" value="15" max="100"></progress>
                    </div>
                </AnalyticsChart>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Real Line Chart */}
                <div className="lg:col-span-2 card bg-base-100 border border-base-content/5 p-6 shadow-sm">
                    <div className="mb-6">
                        <h3 className="text-lg font-black tracking-tight">Student Engagement</h3>
                        <p className="text-xs opacity-50 font-bold uppercase">Daily Active Users (last 30 days)</p>
                    </div>
                    <EngagementLineChart />
                </div>

                {/* Real Donut Chart */}
                <div className="lg:col-span-1 card bg-base-100 border border-base-content/5 p-6 shadow-sm">
                    <div className="mb-6">
                        <h3 className="text-lg font-black tracking-tight">Device Distribution</h3>
                        <p className="text-xs opacity-50 font-bold uppercase">Traffic by platform</p>
                    </div>
                    <DeviceDonutChart />
                </div>
            </div>
        </div>
    );
}