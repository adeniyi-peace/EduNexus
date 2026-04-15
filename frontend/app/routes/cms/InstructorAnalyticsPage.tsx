import { DollarSign, Users, Star, Clock, Loader2, RefreshCw } from "lucide-react";
import { StatCard } from "~/components/cms/analytics/AnalyticsStats";
import { RatingAnalysis } from "~/components/cms/analytics/RatingAnalysis";
import { RevenueChart } from "~/components/cms/analytics/RevenueChart";
import { StudentDistribution } from "~/components/cms/analytics/StudentDistribution";
import { TopPerformingCourses } from "~/components/cms/analytics/TopPerformingCourses";
import { useInstructorAnalytics } from "~/hooks/instructor/useInstructorAnalytics";

const EMPTY_STATS = {
    totalRevenue: "$0",
    activeStudents: "0",
    avgRating: "0.0",
    hoursWatched: "0h",
    revenueTrend: "0.0%",
    revenueTrendDirection: "neutral" as const,
    studentsTrend: "0.0%",
    studentsTrendDirection: "neutral" as const,
    ratingTrend: "0.0%",
    ratingTrendDirection: "neutral" as const,
    hoursTrend: "0.0%",
    hoursTrendDirection: "neutral" as const,
};

const EMPTY_QUICK_STATS = {
    newEnrollments: 0,
    certificates: 0,
    refundRate: 0,
    completionRate: 0,
};

export const meta = () => {
  return [
    { title: "Instructor Analytics | EduNexus" },
    { name: "description", content: "Instructor Analytics Page" },
  ];
};

export default function InstructorAnalyticsPage() {
    const { data, isLoading, isError, refetch } = useInstructorAnalytics();

    const stats = data?.stats || EMPTY_STATS;
    const quickStats = data?.quickStats || EMPTY_QUICK_STATS;

    // Loading state
    if (isLoading) {
        return (
            <div className="min-h-screen p-4 lg:p-8 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="animate-spin text-primary" size={48} />
                    <p className="text-base-content/60">Loading analytics...</p>
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
                    <h3 className="font-black text-lg">Failed to load analytics</h3>
                    <p className="text-sm opacity-60 max-w-xs">Something went wrong while fetching analytics data.</p>
                    <button onClick={() => refetch()} className="btn btn-primary btn-sm gap-2">
                        <RefreshCw size={14} /> Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className=" min-h-screen space-y-6 p-4 lg:p-8">
            
            {/* Page Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-2">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-base-content">Analytics</h1>
                    <p className="text-sm opacity-60 mt-1">
                        Overview of your performance for <span className="font-bold text-base-content">{new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                    </p>
                </div>
            </div>

            {/* Level 1: KPI Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard 
                    title="Total Revenue" 
                    value={stats.totalRevenue}
                    trend={stats.revenueTrend}
                    trendDirection={stats.revenueTrendDirection}
                    icon={DollarSign} 
                    color="text-primary bg-primary/10 text-primary"
                />
                <StatCard 
                    title="Active Students" 
                    value={stats.activeStudents}
                    trend={stats.studentsTrend}
                    trendDirection={stats.studentsTrendDirection}
                    icon={Users} 
                    color="text-secondary bg-secondary/10 text-secondary"
                />
                <StatCard 
                    title="Avg. Rating" 
                    value={stats.avgRating}
                    trend={stats.ratingTrend}
                    trendDirection={stats.ratingTrendDirection}
                    icon={Star} 
                    color="text-warning bg-warning/10 text-warning"
                />
                <StatCard 
                    title="Hours Watched" 
                    value={stats.hoursWatched}
                    trend={stats.hoursTrend}
                    trendDirection={stats.hoursTrendDirection}
                    icon={Clock} 
                    color="text-info bg-info/10 text-info"
                />
            </div>

            {/* Level 2: Revenue & Student Progress */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Main Chart (Takes up 2 cols on huge screens, full width on smaller) */}
                <div className="xl:col-span-2">
                    <RevenueChart data={data?.revenueChart || []} />
                </div>
                {/* Student Progress Distribution (Takes up 1 col) */}
                <div className="h-full">
                    <StudentDistribution data={data?.studentDistribution || []} />
                </div>
            </div>

            {/* Level 3: Rating Analysis & Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <RatingAnalysis ratings={data?.ratingAnalysis || []} averageRating={stats.avgRating} />
                <div className="card bg-base-100 border border-base-content/5 shadow-sm h-full">
                    <div className="card-body p-6">
                        <h3 className="font-black text-lg text-base-content">Quick Stats</h3>
                        <div className="grid grid-cols-2 gap-4 mt-4">
                            <div className="stat bg-base-200 rounded-lg p-3">
                                <div className="stat-title text-xs opacity-60">New Enrollments</div>
                                <div className="stat-value text-xl font-black text-primary">+{quickStats.newEnrollments}</div>
                                <div className="stat-desc text-[10px] opacity-50">this week</div>
                            </div>
                            <div className="stat bg-base-200 rounded-lg p-3">
                                <div className="stat-title text-xs opacity-60">Certificates</div>
                                <div className="stat-value text-xl font-black text-secondary">{quickStats.certificates}</div>
                                <div className="stat-desc text-[10px] opacity-50">issued this month</div>
                            </div>
                            <div className="stat bg-base-200 rounded-lg p-3">
                                <div className="stat-title text-xs opacity-60">Refund Rate</div>
                                <div className="stat-value text-xl font-black text-accent">{quickStats.refundRate}%</div>
                                <div className="stat-desc text-[10px] opacity-50">last 30 days</div>
                            </div>
                            <div className="stat bg-base-200 rounded-lg p-3">
                                <div className="stat-title text-xs opacity-60">Completion Rate</div>
                                <div className="stat-value text-xl font-black text-info">{quickStats.completionRate}%</div>
                                <div className="stat-desc text-[10px] opacity-50">course finish</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Level 3: Detailed Tables */}
            <div className="grid grid-cols-1">
                <TopPerformingCourses courses={data?.topCourses || []} />
            </div>
        </div>
    );
}