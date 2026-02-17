import { 
    LayoutDashboard, 
    Users, 
    BookOpenCheck, 
    ShieldAlert, 
    CreditCard, 
    Settings, 
    BarChart3,
    LogOut,
    LibraryBig
} from "lucide-react";
import { NavLink } from "react-router";

const ADMIN_LINKS = [
    { label: "Overview", href: "/admin", icon: LayoutDashboard },
    { label: "User Management", href: "/admin/users", icon: Users },
    { label: "Courses", href: "/admin/courses", icon: LibraryBig },
    { label: "Course Approval", href: "/admin/courses-approval", icon: BookOpenCheck },
    { label: "Content Moderation", href: "/admin/moderation", icon: ShieldAlert },
    { label: "Revenue & Payouts", href: "/admin/finance", icon: CreditCard },
    { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
    { label: "System Settings", href: "/admin/settings", icon: Settings },
];

export const AdminSidebar = () => {
    return (
        <div className="flex flex-col h-full bg-base-100 border-r border-base-content/5 w-64">
            {/* Logo Area */}
            <div className="p-6">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-content font-black">
                        E
                    </div>
                    <span className="font-black text-xl tracking-tighter">EduNexus <span className="text-[10px] uppercase opacity-50 block leading-none">Admin</span></span>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 space-y-1">
                {ADMIN_LINKS.map((link) => (
                    <NavLink
                        key={link.href}
                        to={link.href}
                        end={link.href === "/admin"}
                        className={({ isActive }) => `
                            flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all
                            ${isActive 
                                ? 'bg-primary text-primary-content shadow-lg shadow-primary/20' 
                                : 'hover:bg-base-200 text-base-content/70'}
                        `}
                    >
                        <link.icon size={18} />
                        {link.label}
                    </NavLink>
                ))}
            </nav>

            {/* Admin Profile Mini-Card */}
            <div className="p-4 border-t border-base-content/5">
                <div className="bg-base-200/50 rounded-2xl p-3 flex items-center gap-3">
                    <div className="avatar">
                        <div className="w-10 rounded-full">
                            <img src="https://i.pravatar.cc/100?u=admin" alt="Admin" />
                        </div>
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <p className="text-xs font-black truncate">Super Admin</p>
                        <p className="text-[10px] opacity-50 truncate">admin@edunexus.com</p>
                    </div>
                    <button className="btn btn-ghost btn-xs btn-square text-error">
                        <LogOut size={14} />
                    </button>
                </div>
            </div>
        </div>
    );
};