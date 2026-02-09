import { Outlet, NavLink, Link } from "react-router";
import { useState } from "react";

// --- SVG ICON COMPONENTS ---
const Icons = {
    Overview: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>
    ),
    Courses: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M8 7h6"/><path d="M8 11h8"/></svg>
    ),
    Paths: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
    ),
    Mentors: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
    ),
    Forum: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
    ),
    Search: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
    ),
    Bell: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
    )
};

export default function DashboardLayout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const navLinks = [
        { to: "/dashboard", label: "Overview", icon: <Icons.Overview /> },
        { to: "/dashboard/courses", label: "My Courses", icon: <Icons.Courses /> },
        { to: "/dashboard/paths", label: "Learning Paths", icon: <Icons.Paths /> },
        { to: "/dashboard/mentors", label: "My Mentors", icon: <Icons.Mentors /> },
        { to: "/dashboard/community", label: "Nexus Forum", icon: <Icons.Forum /> },
    ];

    return (
        <div className="min-h-screen bg-base-200 flex overflow-hidden">
            {/* --- SIDEBAR --- */}
            <aside 
                className={`bg-base-100 border-r border-base-content/5 transition-all duration-300 flex flex-col z-30
                ${isSidebarOpen ? "w-64" : "w-24"}`}
            >
                {/* Logo Area */}
                <div className="h-20 flex items-center px-6">
                    <Link to="/" className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-primary-content font-black shadow-lg shadow-primary/20 shrink-0">
                            N
                        </div>
                        {isSidebarOpen && (
                            <span className="font-black text-xl tracking-tighter animate-in fade-in duration-500">
                                EduNexus
                            </span>
                        )}
                    </Link>
                </div>

                {/* Navigation Nodes */}
                <nav className="flex-1 px-4 py-4 space-y-2">
                    {navLinks.map((link) => (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            end
                            className={({ isActive }) => `
                                flex items-center gap-4 px-4 py-3.5 rounded-2xl font-bold transition-all group
                                ${isActive 
                                    ? "bg-primary text-primary-content shadow-xl shadow-primary/20" 
                                    : "hover:bg-base-200 text-base-content/50 hover:text-primary"}
                            `}
                        >
                            <div className="shrink-0">{link.icon}</div>
                            {isSidebarOpen && (
                                <span className="truncate text-sm tracking-tight animate-in fade-in slide-in-from-left-2">
                                    {link.label}
                                </span>
                            )}
                        </NavLink>
                    ))}
                </nav>

                {/* Sidebar Footer */}
                <div className="p-4 border-t border-base-content/5">
                    <button 
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="btn btn-ghost btn-block justify-start gap-4 rounded-2xl opacity-40 hover:opacity-100 hover:bg-base-200 transition-all"
                    >
                        <div className={`transition-transform duration-500 ${!isSidebarOpen ? 'rotate-180' : ''}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                        </div>
                        {isSidebarOpen && <span className="text-[10px] uppercase font-black tracking-widest">Collapse</span>}
                    </button>
                </div>
            </aside>

            {/* --- MAIN INTERFACE --- */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Top Utility Bar */}
                <header className="h-20 bg-base-100/50 backdrop-blur-xl border-b border-base-content/5 flex items-center justify-between px-8 z-20">
                    <div className="flex items-center gap-4">
                        <h2 className="font-black text-[10px] opacity-30 uppercase tracking-[0.2em] hidden md:block">
                            System / Dashboard
                        </h2>
                    </div>

                    <div className="flex items-center gap-6">
                        {/* Search Node */}
                        <div className="relative hidden sm:block group">
                            <input 
                                type="text" 
                                placeholder="Search modules..." 
                                className="input input-sm bg-base-200 rounded-xl pl-10 w-64 focus:ring-2 focus:ring-primary/20 border-none transition-all placeholder:text-[10px] placeholder:font-black placeholder:uppercase placeholder:opacity-30" 
                            />
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 opacity-20 group-focus-within:opacity-100 transition-opacity">
                                <Icons.Search />
                            </span>
                        </div>

                        {/* Notifications */}
                        <button className="btn btn-ghost btn-circle btn-sm relative hover:bg-primary/10 hover:text-primary transition-colors">
                            <Icons.Bell />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full ring-2 ring-base-100" />
                        </button>

                        {/* User Uplink */}
                        <div className="dropdown dropdown-end">
                            <label tabIndex={0} className="btn btn-ghost btn-circle avatar hover:ring-2 hover:ring-primary/50 transition-all">
                                <div className="w-10 rounded-xl ring-2 ring-primary/20 ring-offset-base-100 ring-offset-2">
                                    <img src="https://i.pravatar.cc/150?u=user" alt="Profile" />
                                </div>
                            </label>
                            <ul tabIndex={0} className="mt-4 z-[1] p-3 shadow-2xl menu menu-sm dropdown-content bg-base-100 rounded-[1.5rem] w-60 border border-base-content/5 space-y-1">
                                <li className="menu-title text-[10px] font-black uppercase opacity-30 px-4 py-2">Account Node</li>
                                <li><Link className="rounded-xl py-2.5 font-bold" to="/dashboard/settings">Profile Settings</Link></li>
                                <li><Link className="rounded-xl py-2.5 font-bold" to="/dashboard/billing">Access & Billing</Link></li>
                                <div className="divider opacity-5 my-1" />
                                <li><button className="text-error font-black rounded-xl py-2.5">Terminate Session</button></li>
                            </ul>
                        </div>
                    </div>
                </header>

                {/* Content Area */}
                <main className="flex-1 overflow-y-auto p-8 scroll-smooth bg-base-200/50">
                    <div className="max-w-7xl mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}