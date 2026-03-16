import { useState } from "react";
import { Users, GraduationCap, DollarSign, BookCheck } from "lucide-react";
import { ActivityFeed } from "~/components/admin/dashboard/ActivityFeed";
import { PendingApprovals } from "~/components/admin/dashboard/PendingApprovals";
import { StatCard } from "~/components/admin/dashboard/StatCard";
import { useAdminDashboard } from "~/hooks/admin/useAdminDashboard";
import { AdminStatSkeleton, AdminErrorState } from "~/components/admin/shared/AdminTableSkeleton";

const STAT_ICONS = [Users, DollarSign, GraduationCap, BookCheck];

export default function AdminDashboard() {
    const { data, isLoading, isError, refetch } = useAdminDashboard();

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* 1. Header Hero */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter">Dashboard</h1>
                    <p className="text-base-content/50 font-medium">Welcome back, Chief. Here is what's happening today.</p>
                </div>
                <div className="flex gap-2">
                    <button className="btn btn-sm btn-outline border-base-content/10">Download Report</button>
                    <button className="btn btn-sm btn-primary">Global Settings</button>
                </div>
            </div>

            {/* 2. KPI Grid */}
            {isLoading ? (
                <AdminStatSkeleton count={4} />
            ) : isError ? (
                <AdminErrorState message="Could not load platform stats." onRetry={refetch} />
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    {data?.kpiStats.map((stat, i) => (
                        <StatCard
                            key={stat.title}
                            title={stat.title}
                            value={stat.value}
                            trend={stat.trend}
                            icon={STAT_ICONS[i] ?? BookCheck}
                            description={stat.description}
                        />
                    ))}
                </div>
            )}

            {/* 3. Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                {/* Left: Pending Table & Revenue Chart */}
                <div className="lg:col-span-2 space-y-8">
                    <PendingApprovals
                        items={data?.pendingApprovals ?? []}
                        isLoading={isLoading}
                    />

                    {/* Revenue Mini Chart */}
                    <div className="card bg-base-100 border border-base-content/5 shadow-sm p-6">
                        <h3 className="font-black text-sm uppercase tracking-widest mb-4 opacity-60">Revenue Trends (6 months)</h3>
                        {isLoading ? (
                            <div className="h-48 bg-base-300 rounded-xl animate-pulse" />
                        ) : (
                            <div className="flex items-end justify-between h-48 w-full gap-2">
                                {data?.revenueChart.map((point) => {
                                    const maxVal = Math.max(...(data.revenueChart.map(p => p.revenue)), 1);
                                    const heightPct = Math.max((point.revenue / maxVal) * 100, 4);
                                    return (
                                        <div key={point.name} className="flex-1 flex flex-col items-center gap-1 group">
                                            <div
                                                className="w-full bg-primary/20 hover:bg-primary rounded-t-md transition-all relative"
                                                style={{ height: `${heightPct}%` }}
                                            >
                                                <span className="absolute -top-7 left-1/2 -translate-x-1/2 text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity bg-base-300 px-1 py-0.5 rounded whitespace-nowrap">
                                                    ${point.revenue.toFixed(0)}
                                                </span>
                                            </div>
                                            <span className="text-[10px] font-bold opacity-40">{point.name}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right: Activity Feed */}
                <div className="lg:col-span-1">
                    <ActivityFeed
                        items={data?.activityFeed ?? []}
                        isLoading={isLoading}
                    />
                </div>
            </div>
        </div>
    );
}