import { Search, Bell, Menu } from "lucide-react";
import { ThemeToggle } from "~/components/ThemeToggle";

interface AdminTopNavProps {
    currentTheme: string;
}

export const AdminTopNav = ({ currentTheme }: AdminTopNavProps) => {
    return (
        <header className="h-16 border-b border-base-content/5 bg-base-100/80 backdrop-blur-md sticky top-0 z-30 px-4 flex items-center justify-between">
            {/* Left: Mobile Menu Trigger & Search */}
            <div className="flex items-center gap-4 flex-1">
                <label htmlFor="admin-drawer" className="btn btn-ghost btn-circle lg:hidden">
                    <Menu size={20} />
                </label>
                
                <div className="relative max-w-md w-full hidden md:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 opacity-30" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search users, courses, or transactions..." 
                        className="input input-bordered w-full pl-10 bg-base-200/50 border-none focus:bg-base-100"
                    />
                </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2">
                <ThemeToggle currentTheme={currentTheme} />
                
                <button className="btn btn-ghost btn-circle relative">
                    <Bell size={20} />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full ring-2 ring-base-100"></span>
                </button>
                
                <div className="divider divider-horizontal mx-1"></div>
                
                <div className="hidden sm:block text-right mr-2">
                    <p className="text-xs font-black">Admin Mode</p>
                    <p className="text-[10px] opacity-50 uppercase font-bold tracking-tighter text-success">System Online</p>
                </div>
            </div>
        </header>
    );
};