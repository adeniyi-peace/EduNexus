import { 
    Plus, 
    MessageSquare, 
    BookOpen, 
    Award, 
    Clock, 
    ChevronRight, 
    MoreVertical,
    Zap,
    Users,
    DollarSign,
    Loader2,
    RefreshCw
} from "lucide-react";
import { useInstructorDashboard } from "~/hooks/instructor/useInstructorDashboard";
import type { InstructorDashboardData } from "~/types/instructor";

const IconMap: Record<string, React.ReactNode> = {
    DollarSign: <DollarSign size={18} />,
    Users: <Users size={18} />,
    Zap: <Zap size={18} />,
};

export default function CMSDashboard() {
    const { data, isLoading, isError, refetch } = useInstructorDashboard();
    
    // Safeguard against missing data
    const quickStats = data?.quickStats || [];
    const myCourses = data?.myCourses || [];
    const activityFeed = data?.activityFeed || [];
    const instructorName = data?.instructorName || "Instructor";

    // Loading state
    if (isLoading) {
        return (
            <div className="min-h-screen p-4 lg:p-8 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="animate-spin text-primary" size={48} />
                    <p className="text-base-content/60 font-medium">Loading workspace...</p>
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
                    <h3 className="font-black text-lg">Failed to load dashboard</h3>
                    <p className="text-sm opacity-60 max-w-xs">Something went wrong while fetching your workspace data.</p>
                    <button onClick={() => refetch()} className="btn btn-primary btn-sm gap-2">
                        <RefreshCw size={14} /> Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-10 p-4 lg:p-8 animate-in fade-in slide-in-from-top-4 duration-700">
            
            {/* --- HERO SECTION --- */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-base-content">
                        Instructor_<span className="text-primary">Workspace</span>
                    </h1>
                    <p className="text-sm opacity-50 mt-1 font-medium italic">
                        Good morning, {instructorName}. Your courses are performing <span className="text-success font-bold">above average</span> this week.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="btn btn-primary rounded-2xl shadow-xl shadow-primary/20 px-6 gap-2">
                        <Plus size={18} />
                        <span>Create New Course</span>
                    </button>
                </div>
            </div>

            {/* --- QUICK KPI GRID --- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {quickStats.map((stat, i) => (
                    <div key={i} className="bg-base-200 border border-base-content/5 rounded-3xl p-6 flex items-center gap-5 hover:border-primary/20 transition-all cursor-default group">
                        <div className={`p-4 rounded-2xl ${stat.color} group-hover:scale-110 transition-transform`}>
                            {IconMap[stat.icon] || <Zap size={18} />}
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-0.5">{stat.label}</p>
                            <h2 className="text-2xl font-bold">{stat.value}</h2>
                        </div>
                    </div>
                ))}
            </div>

            {/* --- MAIN WORKSPACE GRID --- */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                
                {/* COURSE MANAGEMENT (Active Work) */}
                <div className="xl:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="font-black text-lg uppercase tracking-tight flex items-center gap-2">
                            <BookOpen size={20} className="text-primary" />
                            My_Deployments
                        </h3>
                        <button className="btn btn-link btn-xs no-underline font-bold opacity-40 hover:opacity-100">See All Courses</button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {myCourses.map((course) => (
                            <div key={course.id} className="bg-base-200 border border-base-content/5 rounded-[2rem] p-6 hover:shadow-2xl hover:shadow-primary/5 transition-all group">
                                <div className="flex justify-between items-start mb-4">
                                    <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase ${
                                        course.status === 'Published' || course.status === 'Active' ? 'bg-success/10 text-success' : 'bg-base-300 text-base-content/50'
                                    }`}>
                                        {course.status}
                                    </div>
                                    <button className="text-base-content/20 hover:text-primary transition-colors">
                                        <MoreVertical size={16} />
                                    </button>
                                </div>
                                <h4 className="font-bold text-base mb-1 group-hover:text-primary transition-colors cursor-pointer">{course.title}</h4>
                                <p className="text-[10px] font-mono opacity-30 mb-6 uppercase tracking-wider">{course.id}</p>
                                
                                <div className="flex items-center justify-between text-[11px] font-black opacity-60 uppercase mb-2">
                                    <span>Completion Rate</span>
                                    <span>{course.progress}%</span>
                                </div>
                                <div className="w-full h-1.5 bg-base-300 rounded-full overflow-hidden mb-6">
                                    <div 
                                        className="h-full bg-primary transition-all duration-1000" 
                                        style={{ width: `${course.progress}%` }} 
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-3 pt-4 border-t border-base-content/5">
                                    <div className="text-center">
                                        <p className="text-[9px] font-bold opacity-30 uppercase">Students</p>
                                        <p className="font-bold">{course.students.toLocaleString()}</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-[9px] font-bold opacity-30 uppercase">Revenue</p>
                                        <p className="font-bold">{course.revenue}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {myCourses.length === 0 && (
                            <div className="col-span-full py-12 text-center opacity-30 border-2 border-dashed border-base-content/10 rounded-3xl">
                                <p className="text-sm font-bold uppercase tracking-widest">No courses found</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* ACTIVITY & TOOLS (The Pulse) */}
                <div className="space-y-8">
                    {/* Live Feed */}
                    <div className="bg-base-200 border border-base-content/5 rounded-[2.5rem] p-8 flex flex-col h-75 lg:h-125">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="font-black text-sm uppercase tracking-widest italic flex items-center gap-2">
                                <Zap size={16} className="text-warning animate-pulse" />
                                Student_Pulse
                            </h3>
                            <div className="w-2 h-2 rounded-full bg-success animate-ping" />
                        </div>

                        <div className="space-y-6 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                            {activityFeed.map((item) => (
                                <div key={item.id} className="flex gap-4 group">
                                    <div className="w-8 h-8 rounded-xl bg-base-300 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                                        <Clock size={14} className="opacity-40" />
                                    </div>
                                    <div>
                                        <p className="text-xs leading-relaxed">
                                            <span className="font-black text-base-content">{item.user}</span>
                                            <span className="opacity-50"> {item.action} </span>
                                            <span className="font-bold text-primary">{item.target}</span>
                                        </p>
                                        <p className="text-[10px] font-mono opacity-30 mt-1 uppercase">{item.time}</p>
                                    </div>
                                </div>
                            ))}
                            {activityFeed.length === 0 && (
                                <p className="text-[10px] text-center opacity-20 uppercase font-black py-10">No recent activity</p>
                            )}
                        </div>

                        <button className="mt-8 w-full btn btn-sm btn-ghost rounded-xl text-[10px] font-black uppercase opacity-40 hover:opacity-100">
                            View All Activity
                            <ChevronRight size={12} />
                        </button>
                    </div>

                    {/* Instructor Toolkit */}
                    <div className="bg-primary/5 border border-primary/10 rounded-[2.5rem] p-8">
                        <h3 className="font-black text-sm uppercase tracking-widest italic mb-6">Toolkit</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <button className="flex flex-col items-center justify-center p-4 rounded-3xl bg-base-100 border border-base-content/5 hover:border-primary/30 transition-all gap-2 group">
                                <Award className="text-primary group-hover:scale-110 transition-transform" size={20} />
                                <span className="text-[9px] font-black uppercase opacity-60">Certs</span>
                            </button>
                            <button className="flex flex-col items-center justify-center p-4 rounded-3xl bg-base-100 border border-base-content/5 hover:border-primary/30 transition-all gap-2 group">
                                <Clock className="text-secondary group-hover:scale-110 transition-transform" size={20} />
                                <span className="text-[9px] font-black uppercase opacity-60">Schedule</span>
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}