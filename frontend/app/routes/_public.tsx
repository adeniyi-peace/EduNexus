import { Outlet, NavLink, Link, useRouteLoaderData, useNavigation } from "react-router";
import { ThemeToggle } from "~/components/ThemeToggle";
import type { Route as RootRoute } from "./+types/root";

export default function PublicLayout() {
    const rootData = useRouteLoaderData("root") as RootRoute.ComponentProps["loaderData"];
    // Ensure we fall back to a valid theme name
    const currentTheme = rootData?.theme ?? "edunexus";
    const navigation = useNavigation();

    const isNavigating = navigation.state === "loading";

    return (
        /* FIX: Added data-theme here so DaisyUI knows which variables to inject.
           FIX: Added text-base-content to the root so all text inherits the correct color.
        */
        <div 
            data-theme={currentTheme}
            className="min-h-screen flex flex-col bg-base-100 text-base-content transition-colors duration-500 ease-in-out"
        >
            {isNavigating && (
                <div className="fixed top-0 left-0 right-0 z-[100] h-1 bg-linear-to-r from-primary via-secondary to-accent animate-pulse" />
            )}

            {/* --- STICKY NAVBAR --- */}
            <header className="sticky top-0 z-50 w-full border-b border-base-content/10 bg-base-100/70 backdrop-blur-xl">
                <nav className="navbar container mx-auto px-4 md:px-8 h-20">
                    <div className="navbar-start">
                        <div className="dropdown">
                            <label 
                                tabIndex={0} 
                                className="btn btn-ghost lg:hidden hover:bg-primary/10 transition-colors" 
                                aria-label="Open Menu"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
                                </svg>
                            </label>
                            <ul tabIndex={0} className="menu menu-md dropdown-content mt-4 z-1 p-3 shadow-2xl bg-base-100 rounded-2xl w-64 border border-base-content/10 animate-fade-in text-base-content">
                                <li><NavLink to="/courses">Explore Courses</NavLink></li>
                                <li><NavLink to="/mentors">Meet Mentors</NavLink></li>
                                <li><NavLink to="/how-it-works">Methodology</NavLink></li>
                                <div className="divider opacity-10"></div>
                                <li><NavLink to="/support" className="text-sm opacity-70">Support & FAQ</NavLink></li>
                            </ul>
                        </div>
                        
                        <Link to="/" className="flex items-center gap-3 group px-2">
                            <div className="relative w-11 h-11 bg-primary rounded-2xl flex items-center justify-center text-primary-content font-black text-2xl shadow-lg shadow-primary/25 group-hover:rotate-[-8deg] group-hover:scale-110 transition-all duration-300">
                                N
                            </div>
                            <span className="text-2xl font-black tracking-tight hidden sm:block">
                                {/* FIX: Explicitly applied text-base-content here */}
                                <span className="text-base-content">Edu</span>
                                <span className="bg-clip-text text-transparent bg-linear-to-br from-primary via-secondary to-primary bg-[length:200%_auto] animate-gradient-x">Nexus</span>
                            </span>
                        </Link>
                    </div>

                    <div className="navbar-center hidden lg:flex">
                        <ul className="flex items-center gap-2 p-1 bg-base-300/30 rounded-full border border-base-content/5">
                            <NavTab to="/courses" label="Courses" />
                            <NavTab to="/mentors" label="Mentors" />
                            <NavTab to="/how-it-works" label="Methodology" />
                        </ul>
                    </div>

                    <div className="navbar-end gap-3">
                        <ThemeToggle currentTheme={currentTheme} /> 
                        
                        <div className="hidden sm:flex items-center gap-1">
                            <Link 
                                to="/login" 
                                className="btn btn-ghost btn-sm px-5 rounded-full text-base-content/80 hover:text-base-content transition-all"
                            >
                                Log in
                            </Link>
                            <Link 
                                to="/register" 
                                className="btn btn-primary btn-sm px-6 rounded-full text-primary-content shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
                            >
                                Join Now
                            </Link>
                        </div>
                    </div>
                </nav>
            </header>

            <main className="grow animate-fade-in">
                <Outlet context={{ currentTheme }} />
            </main>

            <footer className="bg-base-200/50 text-base-content border-t border-base-content/5">
                <div className="container mx-auto px-4 md:px-8 py-20">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12">
                        
                        <div className="lg:col-span-4 space-y-6">
                            <Link to="/" className="flex items-center gap-2 group w-fit text-base-content">
                                <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center text-primary-content font-bold text-lg">N</div>
                                <span className="text-xl font-black tracking-tighter uppercase">EduNexus</span>
                            </Link>
                            <p className="max-w-xs text-base-content/60 leading-relaxed text-sm md:text-base">
                                Scaling human potential through structured digital mentorship and industry-grade curriculum.
                            </p>
                            {/* Social buttons use base-content icons */}
                            <div className="flex gap-3">
                                <SocialButton icon="𝕏" label="Twitter" />
                                <SocialButton icon="in" label="LinkedIn" />
                                <SocialButton icon="gh" label="GitHub" />
                            </div>
                        </div>

                        <FooterColumn title="Platform" links={[
                            { to: "/courses", label: "Browse Catalog" },
                            { to: "/mentors", label: "Find Mentors" },
                            { to: "/how-it-works", label: "How It Works" }
                        ]} />

                        <FooterColumn title="Resources" links={[
                            { to: "/about", label: "Our Story" },
                            { to: "/support", label: "Help Center" },
                            { to: "/contact", label: "Partner with Us" }
                        ]} />

                        <div className="lg:col-span-4 space-y-4">
                            <h4 className="font-bold text-sm tracking-widest uppercase text-primary">Stay Updated</h4>
                            <p className="text-sm text-base-content/60">Get the latest course drops and tech insights.</p>
                            <div className="flex gap-2">
                                <input 
                                    type="email" 
                                    placeholder="email@example.com" 
                                    className="input input-bordered input-sm grow rounded-lg bg-base-100 text-base-content focus:border-primary" 
                                />
                                <button className="btn btn-primary btn-sm px-4 rounded-lg text-primary-content">Go</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-base-content/5 bg-base-300/30">
                    <div className="container mx-auto px-4 md:px-8 py-8 flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex flex-wrap justify-center gap-6 text-xs font-medium text-base-content/50 uppercase tracking-tighter">
                            <Link to="/terms" className="hover:text-primary transition-colors">Terms</Link>
                            <Link to="/privacy" className="hover:text-primary transition-colors">Privacy</Link>
                        </div>
                        
                        <p className="text-xs text-base-content/40 font-medium">
                            © 2026 EDUNEXUS INC.
                        </p>

                        <div className="flex items-center gap-2 px-3 py-1 bg-success/10 rounded-full border border-success/20">
                            <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                            <span className="text-[10px] font-bold text-success uppercase tracking-widest">Global Systems Nominal</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

function NavTab({ to, label }: { to: string; label: string }) {
    return (
        <li>
            <NavLink 
                to={to} 
                className={({ isActive }) => `
                    relative px-5 py-2 text-sm font-semibold transition-all duration-300 rounded-full
                    ${isActive 
                        ? "text-primary-content bg-primary shadow-md shadow-primary/20 scale-105" 
                        : "text-base-content/70 hover:text-primary hover:bg-primary/5"
                    }
                `}
            >
                {label}
            </NavLink>
        </li>
    );
}

function FooterColumn({ title, links }: { title: string; links: { to: string, label: string }[] }) {
    return (
        <div className="lg:col-span-2 space-y-5">
            <h4 className="font-bold text-sm tracking-widest uppercase text-primary">{title}</h4>
            <ul className="space-y-3">
                {links.map(link => (
                    <li key={link.label}>
                        <Link to={link.to} className="text-sm text-base-content/60 hover:text-primary hover:translate-x-1 transition-all inline-block">
                            {link.label}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}

function SocialButton({ icon, label }: { icon: string; label: string }) {
    return (
        <button 
            className="w-10 h-10 rounded-xl bg-base-content/5 hover:bg-primary hover:text-primary-content text-base-content flex items-center justify-center transition-all duration-300 group active:scale-90"
            aria-label={label}
        >
            <span className="font-bold group-hover:scale-110 transition-transform">{icon}</span>
        </button>
    );
}