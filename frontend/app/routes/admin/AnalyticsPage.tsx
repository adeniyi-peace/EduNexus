import { useAdminAnalytics } from "~/hooks/admin/useAdminAnalytics";
import { AnalyticsHeader } from "~/components/admin/analytics/AnalyticsHeader";
import { EngagementCards } from "~/components/admin/analytics/EngagementCards";
import { TopCourses } from "~/components/admin/analytics/TopCourses";
import { AnalyticsChart } from "~/components/admin/analytics/AnalyticsChart";
import { EngagementLineChart } from "~/components/admin/analytics/EngagementLineChart";
import { DeviceDonutChart } from "~/components/admin/analytics/DeviceDonutChart";
import { AdminStatSkeleton, AdminTableSkeleton, AdminErrorState } from "~/components/admin/shared/AdminTableSkeleton";

export default function AnalyticsPage() {
    const { data, isLoading, isError, refetch } = useAdminAnalytics();

    if (isError) {
        return (
            <div className="max-w-7xl mx-auto py-8">
                <AdminErrorState message="Could not load platform analytics." onRetry={refetch} />
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Controls */}
            <AnalyticsHeader />

            {/* 1. High-Level KPI Metrics */}
            {isLoading ? (
                <AdminStatSkeleton count={4} />
            ) : (
                <EngagementCards kpis={data?.kpis} />
            )}

            {/* 2. Main Analytics Grid — User Growth + Top Courses */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left: User Growth Chart */}
                <div className="lg:col-span-2">
                    <AnalyticsChart
                        title="User Growth"
                        subtitle="New Students vs. Instructors joining per month"
                    >
                        {isLoading ? (
                            <div className="h-full bg-base-300/50 rounded-xl animate-pulse" />
                        ) : (
                            <div className="flex items-end justify-between h-full w-full gap-2 px-4 pb-2">
                                {data?.userGrowth.map((point) => {
                                    const maxVal = Math.max(
                                        ...data.userGrowth.map(p => p.students + p.instructors), 1
                                    );
                                    const studentH = Math.max((point.students / maxVal) * 100, 4);
                                    const instructorH = Math.max((point.instructors / maxVal) * 100, 4);
                                    return (
                                        <div key={point.name} className="flex-1 flex flex-col items-center gap-1">
                                            <div className="w-full flex gap-0.5 items-end" style={{ height: "100%" }}>
                                                <div className="flex-1 bg-primary/30 hover:bg-primary rounded-t-sm transition-all" style={{ height: `${studentH}%` }} title={`Students: ${point.students}`} />
                                                <div className="flex-1 bg-secondary/30 hover:bg-secondary rounded-t-sm transition-all" style={{ height: `${instructorH}%` }} title={`Instructors: ${point.instructors}`} />
                                            </div>
                                            <span className="text-[9px] font-bold opacity-40">{point.name}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </AnalyticsChart>
                </div>

                {/* Right: Top Courses */}
                <div className="lg:col-span-1 h-100 lg:h-auto">
                    {isLoading ? (
                        <AdminTableSkeleton rows={5} columns={3} />
                    ) : (
                        <TopCourses courses={data?.topCourses ?? []} />
                    )}
                </div>
            </div>

            {/* 3. Category Distribution */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <AnalyticsChart title="Category Distribution" subtitle="Published courses by category">
                    {isLoading ? (
                        <div className="h-full bg-base-300/50 rounded-xl animate-pulse" />
                    ) : (
                        <div className="space-y-3 w-full max-w-xs mx-auto">
                            {data?.categoryDistribution.slice(0, 5).map((cat, i) => {
                                const maxCount = Math.max(...(data.categoryDistribution.map(c => c.courses)), 1);
                                const pct = Math.round((cat.courses / maxCount) * 100);
                                const colors = ['progress-primary', 'progress-secondary', 'progress-accent', 'progress-info', 'progress-warning'];
                                return (
                                    <div key={cat.name}>
                                        <div className="flex justify-between text-xs font-bold mb-1">
                                            <span>{cat.name}</span><span>{cat.courses} courses</span>
                                        </div>
                                        <progress className={`progress ${colors[i % colors.length]} w-full`} value={pct} max="100" />
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </AnalyticsChart>

                <AnalyticsChart title="Geographic Distribution" subtitle="Top 5 active regions">
                    <div className="space-y-4 w-full max-w-xs mx-auto">
                        <div className="flex justify-between text-xs font-bold"><span>🇺🇸 USA</span><span>45%</span></div>
                        <progress className="progress progress-primary w-full" value="45" max="100" />
                        <div className="flex justify-between text-xs font-bold"><span>🇬🇧 UK</span><span>20%</span></div>
                        <progress className="progress progress-secondary w-full" value="20" max="100" />
                        <div className="flex justify-between text-xs font-bold"><span>🇮🇳 India</span><span>15%</span></div>
                        <progress className="progress progress-accent w-full" value="15" max="100" />
                    </div>
                </AnalyticsChart>
            </div>

            {/* 4. Engagement Line Chart + Device Donut */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 card bg-base-100 border border-base-content/5 p-6 shadow-sm">
                    <div className="mb-6">
                        <h3 className="text-lg font-black tracking-tight">Student Engagement</h3>
                        <p className="text-xs opacity-50 font-bold uppercase">Monthly Enrollments</p>
                    </div>
                    {isLoading ? (
                        <div className="h-48 bg-base-300 rounded-xl animate-pulse" />
                    ) : (
                        <EngagementLineChart data={data?.engagementChart ?? []} />
                    )}
                </div>
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