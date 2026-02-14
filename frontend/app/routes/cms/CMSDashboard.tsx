import { 
    TrendingUp, 
    Users, 
    Star, 
    DollarSign, 
    ArrowUpRight, 
    ArrowDownRight,
    Activity,
    BookOpen
} from "lucide-react";

export default function CMSDashboard() {
    // Mock data for the high-level metrics
    const stats = [
        { 
            label: "Total Revenue", 
            value: "$42,850.12", 
            trend: "+12.5%", 
            isPositive: true, 
            icon: <DollarSign size={24} />,
            color: "text-emerald-400"
        },
        { 
            label: "Active Students", 
            value: "1,248", 
            trend: "+8.2%", 
            isPositive: true, 
            icon: <Users size={24} />,
            color: "text-blue-400"
        },
        { 
            label: "Avg. Course Rating", 
            value: "4.85", 
            trend: "-0.2%", 
            isPositive: false, 
            icon: <Star size={24} />,
            color: "text-amber-400"
        }
    ];

    const topCourses = [
        { id: "NX-01", title: "Advanced Distributed Systems", students: 450, revenue: "$12,400", rating: 4.9 },
        { id: "NX-02", title: "Cloud Architecture Masterclass", students: 380, revenue: "$9,500", rating: 4.8 },
        { id: "NX-03", title: "Next.js 15: Deep Dive", students: 210, revenue: "$5,200", rating: 4.7 },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* --- HEADER --- */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tighter italic uppercase">
                        Control_<span className="text-primary">Center</span>
                    </h1>
                    <p className="text-white/40 font-mono text-xs mt-1 uppercase tracking-widest">
                        System Status: Optimal // Data Sync: Realtime
                    </p>
                </div>
                <div className="flex gap-2">
                    <select className="select select-sm bg-white/5 border-white/10 rounded-xl text-[10px] font-black uppercase">
                        <option>Last 30 Days</option>
                        <option>Last 90 Days</option>
                        <option>All Time</option>
                    </select>
                    <button className="btn btn-sm btn-primary rounded-xl text-[10px] font-black uppercase px-4">
                        Export Report
                    </button>
                </div>
            </div>

            {/* --- TOP LEVEL METRICS --- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-white/5 border border-white/5 rounded-[2rem] p-8 relative overflow-hidden group hover:border-white/10 transition-all">
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                            {stat.icon}
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mb-2">
                            {stat.label}
                        </p>
                        <div className="flex items-end gap-3">
                            <h2 className="text-3xl font-bold tracking-tight text-white">
                                {stat.value}
                            </h2>
                            <div className={`flex items-center text-[10px] font-black px-2 py-1 rounded-lg mb-1 ${
                                stat.isPositive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                            }`}>
                                {stat.isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                                {stat.trend}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* --- MAIN ANALYTICS GRID --- */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Performance Chart Placeholder */}
                <div className="lg:col-span-2 bg-white/5 border border-white/5 rounded-[2.5rem] p-8 min-h-[400px] flex flex-col">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <Activity className="text-primary" size={20} />
                            <h3 className="font-black text-sm uppercase tracking-widest italic">Revenue_Flow</h3>
                        </div>
                        <div className="flex gap-4 text-[10px] font-black uppercase opacity-40">
                            <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-primary"/> Current</span>
                            <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-white/20"/> Previous</span>
                        </div>
                    </div>
                    {/* Chart logic would go here (Recharts / Chart.js) */}
                    <div className="flex-1 border-t border-dashed border-white/5 flex items-center justify-center text-white/10 italic text-sm">
                        [ Graph Visualization Node: Active ]
                    </div>
                </div>

                {/* Course Leaderboard */}
                <div className="bg-white/5 border border-white/5 rounded-[2.5rem] p-8">
                    <div className="flex items-center gap-3 mb-8">
                        <BookOpen className="text-primary" size={20} />
                        <h3 className="font-black text-sm uppercase tracking-widest italic">Top_Deployments</h3>
                    </div>
                    <div className="space-y-6">
                        {topCourses.map((course) => (
                            <div key={course.id} className="flex flex-col gap-2 group">
                                <div className="flex justify-between items-start">
                                    <h4 className="text-xs font-bold truncate pr-4 group-hover:text-primary transition-colors cursor-pointer">
                                        {course.title}
                                    </h4>
                                    <span className="text-[10px] font-mono text-white/30">{course.id}</span>
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                    <div className="bg-white/[0.02] p-2 rounded-lg text-center">
                                        <p className="text-[8px] uppercase font-black opacity-20">Sales</p>
                                        <p className="text-[10px] font-bold">{course.revenue}</p>
                                    </div>
                                    <div className="bg-white/[0.02] p-2 rounded-lg text-center">
                                        <p className="text-[8px] uppercase font-black opacity-20">Users</p>
                                        <p className="text-[10px] font-bold">{course.students}</p>
                                    </div>
                                    <div className="bg-white/[0.02] p-2 rounded-lg text-center">
                                        <p className="text-[8px] uppercase font-black opacity-20">Rate</p>
                                        <p className="text-[10px] font-bold text-amber-400">{course.rating}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}