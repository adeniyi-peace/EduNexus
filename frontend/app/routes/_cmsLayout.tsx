import { Outlet, NavLink, Link, useLocation, useRouteLoaderData } from "react-router";
import { useState, useEffect } from "react";
import type { Route as RootRoute } from "./+types/root";
import { 
    LayoutDashboard, 
    Layers, 
    Users, 
    BarChart3, 
    FolderKanban, 
    Settings, 
    Menu, 
    Search, 
    Bell, 
    Eye,
    PlusCircle,
    Sun,
    Moon
} from "lucide-react";
import { ThemeToggle } from "~/components/ThemeToggle";

export default function CMSLayout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const location = useLocation();

    const rootData = useRouteLoaderData("root") as RootRoute.ComponentProps["loaderData"];
    // Ensure we fall back to a valid theme name
    const currentTheme = rootData?.theme ?? "edunexus";

    // Close mobile menu on route change
    useEffect(() => {
        setIsMobileOpen(false);
    }, [location]);

    const adminLinks = [
        { to: "/cms", label: "Control Center", icon: <LayoutDashboard size={20} /> },
        { to: "/cms/builder", label: "Course Builder", icon: <Layers size={20} /> },
        { to: "/cms/library", label: "Asset Library", icon: <FolderKanban size={20} /> },
        { to: "/cms/students", label: "User Engine", icon: <Users size={20} /> },
        { to: "/cms/analytics", label: "Performance", icon: <BarChart3 size={20} /> },
    ];

    const Sidebar = () => (
        // Changed bg-slate-950 to bg-base-200, border-white/5 to border-base-content/10
        <div className="h-full flex flex-col bg-base-200 border-r border-base-content/10 transition-all duration-300">
            {/* CMS Branding */}
            <div className="h-20 flex items-center px-6 shrink-0">
                <div className="flex items-center gap-3">
                    {/* Changed bg-white text-black to primary colors to pop in both themes */}
                    <div className="w-10 h-10 bg-primary text-primary-content rounded-xl flex items-center justify-center font-black shadow-primary/20 shadow-xl">
                        C
                    </div>
                    {isSidebarOpen && (
                        <div className="flex flex-col animate-in fade-in slide-in-from-left-2">
                            <span className="font-black text-lg tracking-tighter leading-none text-base-content">Nexus_CMS</span>
                            <span className="text-[9px] font-mono text-primary uppercase tracking-[0.2em] mt-1">Admin_Level_01</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Quick Action: New Course */}
            <div className="px-4 mb-4">
                <button className={`btn btn-primary btn-block rounded-2xl gap-2 ${!isSidebarOpen ? 'px-0' : ''}`}>
                    <PlusCircle size={18} />
                    {isSidebarOpen && <span className="text-xs font-black uppercase">New Project</span>}
                </button>
            </div>

            <nav className="flex-1 px-4 py-2 space-y-1.5 overflow-y-auto custom-scrollbar">
                {adminLinks.map((link) => (
                    <NavLink
                        key={link.to}
                        to={link.to}
                        end
                        className={({ isActive }) => `
                            flex items-center gap-4 px-4 py-3.5 rounded-2xl font-bold transition-all group
                            ${isActive 
                                // Used semantic colors that work in both themes
                                ? "bg-primary/10 text-primary shadow-inner" 
                                : "text-base-content/60 hover:text-base-content hover:bg-base-content/5"}
                        `}
                    >
                        <div className="shrink-0">{link.icon}</div>
                        {isSidebarOpen && (
                            <span className="text-sm tracking-tight truncate">{link.label}</span>
                        )}
                    </NavLink>
                ))}
            </nav>

            {/* Sidebar Bottom Actions */}
            <div className="p-4 space-y-2 border-t border-base-content/10">
                <Link to="/dashboard" className="btn btn-ghost btn-sm btn-block justify-start gap-4 rounded-xl text-primary hover:bg-primary/10">
                    <Eye size={16} />
                    {isSidebarOpen && <span className="text-[10px] font-black uppercase tracking-widest">Student View</span>}
                </Link>
                <button 
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="btn btn-ghost btn-sm btn-block justify-start gap-4 rounded-xl opacity-50 hover:opacity-100 hidden lg:flex text-base-content"
                >
                    <div className={`transition-transform duration-500 ${!isSidebarOpen ? 'rotate-180' : ''}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                    </div>
                    {isSidebarOpen && <span className="text-[10px] font-black uppercase tracking-widest">Collapse</span>}
                </button>
            </div>
        </div>
    );

    return (
        // Changed bg-black text-slate-200 to bg-base-100 text-base-content
        <div className="drawer lg:drawer-open min-h-screen bg-base-100 text-base-content selection:bg-primary/30">
            <input id="cms-drawer" type="checkbox" className="drawer-toggle" checked={isMobileOpen} onChange={() => setIsMobileOpen(!isMobileOpen)} />
            
            <div className="drawer-content flex flex-col min-w-0">
                {/* CMS Top Bar */}
                {/* Changed bg-black/80 border-white/5 to base-100/80 and base-content/10 */}
                <header className="h-20 bg-base-100/80 backdrop-blur-md border-b border-base-content/10 flex items-center justify-between px-4 lg:px-8 z-30">
                    <div className="flex items-center gap-4">
                        <label htmlFor="cms-drawer" className="btn btn-ghost btn-circle lg:hidden">
                            <Menu size={20} />
                        </label>
                        <div className="hidden sm:block">
                            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-base-content/40">
                                Management / <span className="text-primary">{location.pathname.split('/').pop() || 'Root'}</span>
                            </h2>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="relative hidden md:block">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" size={14} />
                            <input 
                                type="text" 
                                placeholder="FIND_ASSET_ID..." 
                                className="input input-sm bg-base-content/5 border-base-content/10 rounded-xl pl-10 w-64 focus:border-primary/50 text-xs font-mono placeholder:text-base-content/30"
                            />
                        </div>
                        
                        {/* --- Theme Toggle Button --- */}
                        <ThemeToggle currentTheme={currentTheme} />

                        <button className="btn btn-ghost btn-circle btn-sm relative text-base-content/70 hover:text-primary">
                            <Bell size={18} />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full animate-pulse" />
                        </button>

                        <div className="w-10 h-10 rounded-xl bg-linear-to-br from-primary to-accent p-px">
                            <div className="w-full h-full bg-base-100 rounded-[11px] flex items-center justify-center overflow-hidden">
                                <img src="https://i.pravatar.cc/150?u=admin" alt="Admin" />
                            </div>
                        </div>
                    </div>
                </header>

                {/* CMS Viewport */}
                <main className="flex-1 overflow-y-auto custom-scrollbar">
                    <div className="max-w-400 mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>

            {/* Mobile Sidebar Wrapper */}
            <div className="drawer-side z-100">
                <label htmlFor="cms-drawer" className="drawer-overlay"></label>
                <div className={`h-full ${isSidebarOpen ? 'w-64' : 'w-20'} transition-all duration-300`}>
                    <Sidebar />
                </div>
            </div>
        </div>
    );
}