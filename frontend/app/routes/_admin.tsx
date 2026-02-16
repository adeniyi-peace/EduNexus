import { Outlet, useRouteLoaderData } from "react-router";
import { AdminSidebar } from "~/components/admin/AdminSidebar";
import { AdminTopNav } from "~/components/admin/AdminTopNav";

export default function AdminLayout() {
    // Get the theme from your root loader (defined in root.tsx)
    const { theme } = useRouteLoaderData("root") as { theme: string };

    return (
        <div className="drawer lg:drawer-open min-h-screen bg-base-200/50 font-sans">
            <input id="admin-drawer" type="checkbox" className="drawer-toggle" />
            
            {/* PAGE CONTENT */}
            <div className="drawer-content flex flex-col">
                {/* Global Admin Header */}
                <AdminTopNav currentTheme={theme} />
                
                {/* Main Viewport */}
                <main className="p-4 md:p-8 flex-1">
                    {/* We wrap the Outlet in a motion div if you want page transitions later */}
                    <div className="max-w-(--breakpoint-2xl) mx-auto">
                        <Outlet />
                    </div>
                </main>

                {/* Footer / Copyright */}
                <footer className="p-6 text-center opacity-30 text-[10px] font-bold uppercase tracking-widest">
                    EduNexus Management System v1.0.4 • 2026
                </footer>
            </div> 

            {/* SIDEBAR DRAWER */}
            <div className="drawer-side z-40">
                <label htmlFor="admin-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
                <AdminSidebar />
            </div>
        </div>
    );
}