import { Link, useLoaderData } from "react-router";

// --- SVG COMPONENTS ---
const DashboardIcons = {
    Mentor: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
    ),
    System: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m12 14 4-4 4 4"/><path d="M3.34 19a10 10 0 1 1 17.32 0"/></svg>
    ),
    XP: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
    ),
    Lab: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10 2v7.5"/><path d="M14 2v7.5"/><path d="M8.5 2h7"/><path d="M14 14.5c2.9 0 5.2 2.3 5.2 5.2 0 .2-.1.3-.2.3H5c-.1 0-.2-.1-.2-.3 0-2.9 2.3-5.2 5.2-5.2V9.5h4z"/></svg>
    ),
    Flame: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>
    ),
    Rank: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 15l-3 3.5V5l3 3 3-3v13.5l-3-3.5z"/></svg>
    ),
    Clock: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
    )
};

export async function loader() {
    return {
        enrolledCourses: [
            { id: 1, title: "Advanced Distributed Systems", progress: 72, totalLessons: 24, lastAccessed: "2 hours ago", color: "bg-primary" },
            { id: 2, title: "Cloud Architecture & Scalability", progress: 45, totalLessons: 18, lastAccessed: "Yesterday", color: "bg-secondary" },
            { id: 3, title: "Next.js 15: Production Patterns", progress: 10, totalLessons: 40, lastAccessed: "3 days ago", color: "bg-accent" },
        ],
        notifications: [
            { id: 1, type: "mentor", text: "Dr. Aris Thorne replied to your code review.", time: "10m ago" },
            { id: 2, type: "system", text: "New module: 'Serverless Edge Functions' is live.", time: "4h ago" },
        ],
        deadlines: [
            { id: 1, task: "Distributed Systems Lab 04", due: "Tomorrow", priority: "high" },
            { id: 2, task: "Cloud Scalability Quiz", due: "In 3 days", priority: "medium" },
        ],
        achievements: [
            { id: '1', name: 'Nexus Pioneer', icon: 'ShieldCheck', color: 'text-blue-400' },
            { id: '2', name: 'Logic Master', icon: 'Code', color: 'text-primary' },
            { id: '3', name: 'Data Architect', icon: 'Database', color: 'text-purple-400' },
            { id: '4', name: 'Speed Runner', icon: 'Flame', color: 'text-orange-400' },
        ],
    };
}

export default function StudentDashboard() {
    const { enrolledCourses, notifications, deadlines, achievements } = useLoaderData<typeof loader>();
    const continueLearning = enrolledCourses[0];

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-1000">
            
            {/* --- TOP SECTION: WELCOME & NOTIFICATIONS --- */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Welcome & Continue Shortcut */}
                <div className="lg:col-span-2 bg-neutral text-neutral-content rounded-[2.5rem] p-10 relative overflow-hidden shadow-2xl shadow-neutral/20 border border-white/5">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 rounded-full blur-[80px] -mr-20 -mt-20" />
                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
                        <div className="text-center md:text-left">
                            <h1 className="text-4xl font-black mb-4 tracking-tight">Hello, <span className="text-primary italic">Developer</span>.</h1>
                            <p className="opacity-60 max-w-sm mb-6 font-medium leading-relaxed">
                                You have 3 active training paths. Your current streak is 5 days.
                            </p>
                            <Link to={`/dashboard/courses/${continueLearning.id}`} className="btn btn-primary rounded-2xl px-8 h-14 font-black text-lg group shadow-lg shadow-primary/20">
                                Continue Learning
                                <span className="group-hover:translate-x-1 transition-transform ml-2">→</span>
                            </Link>
                        </div>
                        <div className="hidden md:block bg-base-100/10 backdrop-blur-md p-6 rounded-3xl border border-white/10 w-64">
                            <p className="text-[10px] font-black uppercase opacity-50 tracking-widest mb-2 text-primary">Current Module</p>
                            <p className="font-bold text-sm mb-4 truncate">{continueLearning.title}</p>
                            <progress className="progress progress-primary w-full h-2" value={continueLearning.progress} max="100" />
                        </div>
                    </div>
                </div>

                {/* Notifications & Deadlines Stack */}
                <div className="space-y-6">
                    {/* Notifications */}
                    <div className="bg-base-100 rounded-[2rem] p-6 border border-base-content/5">
                        <h3 className="font-black text-[10px] uppercase tracking-[0.2em] mb-4 opacity-40 text-center">System Feed</h3>
                        <div className="space-y-3">
                            {notifications.map((n) => (
                                <div key={n.id} className="flex gap-3 p-3 bg-base-200/50 rounded-xl border border-transparent hover:border-primary/10 transition-all cursor-pointer group">
                                    <div className="text-primary opacity-60 group-hover:opacity-100 transition-opacity">
                                        {n.type === 'mentor' ? <DashboardIcons.Mentor /> : <DashboardIcons.System />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[11px] font-bold leading-tight truncate">{n.text}</p>
                                        <p className="text-[9px] opacity-40 font-black mt-1 uppercase tracking-tighter">{n.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Deadlines */}
                    <div className="bg-base-100 rounded-[2rem] p-6 border border-base-content/5">
                        <h3 className="font-black text-[10px] uppercase tracking-[0.2em] mb-4 opacity-40 text-center">Upcoming Deadlines</h3>
                        <div className="space-y-3">
                            {deadlines.map((d) => (
                                <div key={d.id} className="flex items-center justify-between p-3 bg-base-200/50 rounded-xl">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-1.5 h-1.5 rounded-full ${d.priority === 'high' ? 'bg-error' : 'bg-warning'}`} />
                                        <p className="text-[11px] font-bold">{d.task}</p>
                                    </div>
                                    <div className="flex items-center gap-1 opacity-40">
                                        <DashboardIcons.Clock />
                                        <span className="text-[9px] font-black uppercase">{d.due}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* --- ENROLLED COURSES --- */}
            <section>
                <div className="flex justify-between items-end mb-8 px-2">
                    <div>
                        <h2 className="text-3xl font-black tracking-tight italic">Active Training</h2>
                        <p className="text-sm opacity-50 font-medium">Monitoring {enrolledCourses.length} active deployments.</p>
                    </div>
                    <Link to="/dashboard/courses" className="text-[10px] font-black uppercase tracking-widest opacity-40 hover:opacity-100 hover:text-primary transition-all">View Catalog →</Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {enrolledCourses.map((course) => (
                        <div key={course.id} className="group bg-base-100 p-6 rounded-[2rem] border border-base-content/5 hover:border-primary/30 transition-all flex flex-col justify-between h-64">
                            <div>
                                <div className={`w-12 h-12 ${course.color} rounded-2xl flex items-center justify-center text-white font-black shadow-lg mb-4`}>
                                    {course.title.charAt(0)}
                                </div>
                                <h3 className="text-xl font-black leading-tight group-hover:text-primary transition-colors">{course.title}</h3>
                                <p className="text-[10px] opacity-40 font-black mt-2 uppercase tracking-widest">{course.lastAccessed}</p>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-primary">
                                    <span>Sync Status</span>
                                    <span>{course.progress}%</span>
                                </div>
                                <progress className="progress progress-primary w-full h-1.5 bg-base-200" value={course.progress} max="100" />
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* --- NEW: ACHIEVEMENT SHOWCASE --- */}
            <section className="animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
                <div className="flex justify-between items-end mb-6 px-2">
                    <div>
                        <h2 className="text-2xl font-black tracking-tight italic">Achievement <span className="text-primary">Node</span></h2>
                        <p className="text-xs opacity-50 font-medium font-mono uppercase tracking-widest">Unlocked Milestones</p>
                    </div>
                    <Link 
                        to="/dashboard/achievements" 
                        className="text-[10px] font-black uppercase tracking-widest text-primary hover:tracking-[0.2em] transition-all flex items-center gap-2 group"
                    >
                        View Full Gallery <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </Link>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {achievements.slice(0, 5).map((badge) => (
                        <div 
                            key={badge.id} 
                            className="bg-base-100 border border-base-content/5 p-4 rounded-3xl hover:border-primary/40 transition-all duration-500 group relative overflow-hidden flex items-center gap-4"
                        >
                            {/* Background Glow */}
                            <div className="absolute -right-2 -bottom-2 w-12 h-12 bg-primary/5 blur-xl group-hover:bg-primary/20 transition-all" />
                            
                            <div className="w-12 h-12 rounded-2xl bg-base-200 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-black transition-all duration-500 shrink-0 shadow-lg">
                                {/* Reusing icons or specific badge SVGs */}
                                <DashboardIcons.XP /> 
                            </div>
                            
                            <div className="min-w-0">
                                <p className="text-[11px] font-black uppercase tracking-tight truncate">{badge.name}</p>
                                <p className="text-[9px] opacity-30 font-bold truncate">Verified Achievement</p>
                            </div>
                        </div>
                    ))}
                    
                    {/* Quick "Empty Slot" or "More" card for UX */}
                    <Link 
                        to="/dashboard/achievements"
                        className="hidden lg:flex bg-base-100/30 border border-dashed border-base-content/10 p-4 rounded-3xl items-center justify-center group hover:bg-base-100 transition-all"
                    >
                        <p className="text-[10px] font-black opacity-20 group-hover:opacity-100 uppercase tracking-[0.2em]">+ {achievements.length > 5 ? achievements.length - 5 : 0} More</p>
                    </Link>
                </div>
            </section>

            {/* --- STATS SUMMARY --- */}
            <section className="bg-base-100 rounded-[2.5rem] border border-base-content/5 p-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {[
                        { label: "XP Points", val: "12.4k", icon: <DashboardIcons.XP /> },
                        { label: "Labs Cleared", val: "42", icon: <DashboardIcons.Lab /> },
                        { label: "Active Streak", val: "05", icon: <DashboardIcons.Flame /> },
                        { label: "Rank", val: "Senior", icon: <DashboardIcons.Rank /> }
                    ].map((stat, i) => (
                        <div key={stat.label} className={`flex flex-col items-center text-center ${i !== 3 ? 'md:border-r border-base-content/5' : ''}`}>
                            <div className="text-primary mb-3 opacity-80">{stat.icon}</div>
                            <p className="text-2xl font-black tracking-tighter">{stat.val}</p>
                            <p className="text-[9px] font-black opacity-30 uppercase tracking-[0.2em] mt-1">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}