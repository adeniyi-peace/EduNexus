import { useParams, Link } from "react-router";
import {
    DollarSign,
    Users,
    Star,
    Clock,
    ChevronLeft,
    TrendingUp,
    Download
} from "lucide-react";
import { StatCard } from "~/components/cms/analytics/AnalyticsStats";
import { DeviceStats } from "~/components/cms/analytics/DeviceStats";
import { EngagementHeatmap } from "~/components/cms/analytics/EngagementHeatmap";
import { RetentionFunnel } from "~/components/cms/analytics/RetentionFunnel";
import { RevenueChart } from "~/components/cms/analytics/RevenueChart";
import { TrafficSources } from "~/components/cms/analytics/TrafficSources";

export default function CourseAnalyticsPage() {
    const { id } = useParams();

    // In a real app, you'd fetch course details here based on 'id'
    const courseTitle = "Advanced React Patterns"; // Mock title

    return (
        <div className="min-h-screen space-y-6 p-4 lg:p-8">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
                <div className="flex flex-col gap-1">
                    <Link
                        to="/cms/library"
                        className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary hover:gap-3 transition-all mb-2"
                    >
                        <ChevronLeft size={16} /> Back to Library
                    </Link>
                    <h1 className="text-3xl font-black tracking-tight text-base-content flex items-center gap-3">
                        {courseTitle} <span className="text-sm font-bold opacity-30 mt-2">#{id}</span>
                    </h1>
                    <p className="text-sm opacity-60">
                        Performance metrics and student insights for this course node.
                    </p>
                </div>

                <div className="flex gap-2">
                    <button className="btn btn-neutral btn-sm gap-2 rounded-xl">
                        <Download size={14} /> Report
                    </button>
                    <select className="select select-bordered select-sm rounded-xl font-bold">
                        <option>Last 30 Days</option>
                        <option>Last 90 Days</option>
                        <option>All Time</option>
                    </select>
                </div>
            </div>

            {/* KPI Grid - Reusing global components */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Course Revenue"
                    value="$8,240"
                    trend="+15.2%"
                    trendDirection="up"
                    icon={DollarSign}
                    color="text-primary bg-primary/10"
                />
                <StatCard
                    title="Active Students"
                    value="420"
                    trend="+5.4%"
                    trendDirection="up"
                    icon={Users}
                    color="text-secondary bg-secondary/10"
                />
                <StatCard
                    title="Course Rating"
                    value="4.9"
                    trend="+0.1"
                    trendDirection="up"
                    icon={Star}
                    color="text-warning bg-warning/10"
                />
                <StatCard
                    title="Completion Rate"
                    value="68%"
                    trend="-2%"
                    trendDirection="down"
                    icon={TrendingUp}
                    color="text-success bg-success/10"
                />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="xl:col-span-2">
                    <RevenueChart />
                </div>
                <div className="h-full">
                    <TrafficSources />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                <RetentionFunnel />
                <EngagementHeatmap />
                <DeviceStats />
            </div>

            {/* Video Engagement / Section Specific metrics could go here */}
            <div className="card bg-base-100 border border-base-content/5 shadow-sm p-6">
                <h3 className="text-xl font-black mb-6">Lesson Dropout Rates</h3>
                <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-base-200 rounded-xl flex items-center justify-center font-black">
                                {i}
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-sm font-bold">Module {i}: Core Concepts</span>
                                    <span className="text-xs font-mono opacity-40">240 views</span>
                                </div>
                                <div className="w-full h-2 bg-base-200 rounded-full overflow-hidden">
                                    <div className="h-full bg-primary" style={{ width: `${100 - (i * 10)}%` }}></div>
                                </div>
                            </div>
                            <div className="text-xs font-black text-error">-{i * 10}%</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
