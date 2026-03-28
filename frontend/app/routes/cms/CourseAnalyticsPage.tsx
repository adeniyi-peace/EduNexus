import { useParams, Link } from "react-router";
import {
    DollarSign,
    Users,
    Star,
    ChevronLeft,
    TrendingUp,
    Download,
    Loader2,
    RefreshCw
} from "lucide-react";
import { StatCard } from "~/components/cms/analytics/AnalyticsStats";
import { RetentionFunnel } from "~/components/cms/analytics/RetentionFunnel";
import { RevenueChart } from "~/components/cms/analytics/RevenueChart";
import { StudentDistribution } from "~/components/cms/analytics/StudentDistribution";
import { RatingAnalysis } from "~/components/cms/analytics/RatingAnalysis";
import { useCourseAnalytics } from "~/hooks/instructor/useCourseAnalytics";

export default function CourseAnalyticsPage() {
    const { id } = useParams();
    const { data, isLoading, isError, refetch } = useCourseAnalytics(id);

    const courseTitle = data?.courseTitle || "Course Analytics";

    // Loading state
    if (isLoading) {
        return (
            <div className="min-h-screen p-4 lg:p-8 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="animate-spin text-primary" size={48} />
                    <p className="text-base-content/60">Loading course analytics...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (isError) {
        return (
            <div className="min-h-screen p-4 lg:p-8 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4 text-center">
                    <div className="w-16 h-16 rounded-full bg-error/10 flex items-center justify-center">
                        <RefreshCw size={28} className="text-error" />
                    </div>
                    <h3 className="font-black text-lg">Failed to load course analytics</h3>
                    <p className="text-sm opacity-60 max-w-xs">Could not fetch analytics for this course.</p>
                    <button onClick={() => refetch()} className="btn btn-primary btn-sm gap-2">
                        <RefreshCw size={14} /> Try Again
                    </button>
                </div>
            </div>
        );
    }

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

            {/* KPI Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Course Revenue"
                    value={data?.stats?.revenue || "$0"}
                    trend="+15.2%"
                    trendDirection="up"
                    icon={DollarSign}
                    color="text-primary bg-primary/10"
                />
                <StatCard
                    title="Active Students"
                    value={data?.stats?.students || "0"}
                    trend="+5.4%"
                    trendDirection="up"
                    icon={Users}
                    color="text-secondary bg-secondary/10"
                />
                <StatCard
                    title="Course Rating"
                    value={data?.stats?.rating || "0.0"}
                    trend="+0.1"
                    trendDirection="up"
                    icon={Star}
                    color="text-warning bg-warning/10"
                />
                <StatCard
                    title="Completion Rate"
                    value={data?.stats?.completion || "0%"}
                    trend="-2%"
                    trendDirection="down"
                    icon={TrendingUp}
                    color="text-success bg-success/10"
                />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="xl:col-span-2">
                    <RevenueChart data={data?.revenueChart || []} />
                </div>
                <div className="h-full">
                    <StudentDistribution data={data?.progressDistribution || []} />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                <RetentionFunnel data={data?.funnelData || []} />
                <RatingAnalysis ratings={data?.ratingAnalysis || []} averageRating={data?.stats?.rating} courseId={id} />
                
                {/* Lesson Dropout Rates */}
                <div className="card bg-base-100 border border-base-content/5 shadow-sm p-6">
                    <h3 className="text-xl font-black mb-6">Module Retention</h3>
                    <div className="space-y-4">
                        {(data?.dropoutRates || []).map((module) => (
                            <div key={module.id} className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-base-200 rounded-xl flex items-center justify-center font-black text-sm">
                                    {module.id}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-sm font-bold truncate">{module.name}</span>
                                        <span className="text-[10px] font-mono opacity-40 whitespace-nowrap ml-2">{module.completed} completed</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-base-200 rounded-full overflow-hidden">
                                        <div className="h-full bg-primary" style={{ width: `${100 - module.dropout}%` }}></div>
                                    </div>
                                </div>
                                <div className="text-xs font-black text-error">-{module.dropout}%</div>
                            </div>
                        ))}
                        {(!data?.dropoutRates || data.dropoutRates.length === 0) && (
                            <p className="text-xs opacity-50 italic">No module data available yet.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
