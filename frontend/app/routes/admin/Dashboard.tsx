import { Users, GraduationCap, DollarSign, BookCheck } from "lucide-react";
import { ActivityFeed } from "~/components/admin/dashboard/ActivityFeed";
import { PendingApprovals } from "~/components/admin/dashboard/PendingApprovals";
import { StatCard } from "~/components/admin/dashboard/StatCard";

export default function AdminDashboard() {
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                <StatCard 
                    title="Active Students" 
                    value="12,840" 
                    trend={+8.2} 
                    icon={Users} 
                    description="Since last month" 
                />
                <StatCard 
                    title="Total Revenue" 
                    value="$42,390" 
                    trend={+14.5} 
                    icon={DollarSign} 
                    description="Current billing cycle" 
                />
                <StatCard 
                    title="Course Completions" 
                    value="1,204" 
                    trend={-2.1} 
                    icon={GraduationCap} 
                    description="Daily average" 
                />
                <StatCard 
                    title="Pending Approvals" 
                    value="18" 
                    trend={0} 
                    icon={BookCheck} 
                    description="Items in queue" 
                />
            </div>

            {/* 3. Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                {/* Left: Pending Table & Analytics Placeholder */}
                <div className="lg:col-span-2 space-y-8">
                    <PendingApprovals />
                    
                    {/* Mock Chart Area */}
                    <div className="card bg-base-100 border border-base-content/5 shadow-sm p-6 h-80 flex flex-col justify-center items-center text-center opacity-40">
                        <div className="w-16 h-16 rounded-full border-4 border-dashed border-primary mb-4 animate-spin-slow" />
                        <p className="font-black text-sm uppercase tracking-widest">Revenue Analytics Chart</p>
                        <p className="text-xs font-medium">Connect Recharts or Chart.js here</p>
                    </div>
                </div>

                {/* Right: Activity Feed */}
                <div className="lg:col-span-1">
                    <ActivityFeed />
                </div>
            </div>
        </div>
    );
}