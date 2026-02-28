import { DollarSign, Users, Star, Clock } from "lucide-react";
import { StatCard } from "~/components/cms/analytics/AnalyticsStats";
import { DeviceStats } from "~/components/cms/analytics/DeviceStats";
import { EngagementHeatmap } from "~/components/cms/analytics/EngagementHeatmap";
import { RetentionFunnel } from "~/components/cms/analytics/RetentionFunnel";
import { RevenueChart } from "~/components/cms/analytics/RevenueChart";
import { TopPerformingCourses } from "~/components/cms/analytics/TopPerformingCourses";
import { TrafficSources } from "~/components/cms/analytics/TrafficSources";
export default function InstructorAnalyticsPage() {
    return (
        <div className=" min-h-screen space-y-6 p-4 lg:p-8">
            
            {/* Page Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-2">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-base-content">Analytics</h1>
                    <p className="text-sm opacity-60 mt-1">
                        Overview of your performance for <span className="font-bold text-base-content">Feb 2026</span>
                    </p>
                </div>
            </div>

            {/* Level 1: KPI Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard 
                    title="Total Revenue" 
                    value="$24,500" 
                    trend="+12.5%" 
                    trendDirection="up" 
                    icon={DollarSign} 
                    color="text-primary bg-primary/10 text-primary"
                />
                <StatCard 
                    title="Active Students" 
                    value="1,240" 
                    trend="+8.2%" 
                    trendDirection="up" 
                    icon={Users} 
                    color="text-secondary bg-secondary/10 text-secondary"
                />
                <StatCard 
                    title="Avg. Rating" 
                    value="4.8" 
                    trend="0.0%" 
                    trendDirection="neutral" 
                    icon={Star} 
                    color="text-warning bg-warning/10 text-warning"
                />
                <StatCard 
                    title="Hours Watched" 
                    value="854h" 
                    trend="-2.4%" 
                    trendDirection="down" 
                    icon={Clock} 
                    color="text-info bg-info/10 text-info"
                />
            </div>

            {/* Level 2: Charts & Traffic */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Main Chart (Takes up 2 cols on huge screens, full width on smaller) */}
                <div className="xl:col-span-2">
                    <RevenueChart />
                </div>
                {/* Traffic Sources (Takes up 1 col) */}
                <div className="h-full">
                    <TrafficSources />
                </div>
            </div>

            {/* NEW: Learning Behavior Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                <RetentionFunnel />
                <EngagementHeatmap />
                <DeviceStats />
            </div>

            {/* Level 3: Detailed Tables */}
            <div className="grid grid-cols-1">
                <TopPerformingCourses />
            </div>
        </div>
    );
}