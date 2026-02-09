import { Outlet, NavLink, Link, useRouteLoaderData } from "react-router";
import { ThemeToggle } from "~/components/ThemeToggle";
import type { Route as RootRoute } from "./+types/root"; 

export default function PublicLayout() {
    const rootData = useRouteLoaderData("root") as RootRoute.ComponentProps["loaderData"];
    const currentTheme = rootData?.theme ?? "edunexus";

    return (
        <div className="min-h-screen flex flex-col bg-base-100 transition-colors duration-300">
            {/* --- STICKY NAVBAR --- */}
            <header className="sticky top-0 z-50 w-full border-b border-base-content/10 bg-base-100/80 backdrop-blur-md">
                <div className="navbar container mx-auto px-4 md:px-8">
                    <div className="navbar-start">
                        {/* Mobile Menu */}
                        <div className="dropdown">
                            <label tabIndex={0} className="btn btn-ghost lg:hidden" aria-label="Menu">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
                                </svg>
                            </label>
                            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-1 p-2 shadow bg-base-100 rounded-box w-52 border border-base-content/10">
                                <li><NavLink to="/courses">Courses</NavLink></li>
                                <li><NavLink to="/mentors">Mentors</NavLink></li>
                                <li><NavLink to="/how-it-works">How It Works</NavLink></li>
                                <li><NavLink to="/pricing">Pricing</NavLink></li>
                                <div className="divider my-1"></div>
                                <li><NavLink to="/support">Help Center</NavLink></li>
                            </ul>
                        </div>
                        
                        {/* Logo */}
                        <Link to="/" className="flex items-center gap-2 group">
                            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-primary-content font-bold text-xl group-hover:rotate-12 transition-transform shadow-lg shadow-primary/20">
                                N
                            </div>
                            <span className="text-2xl font-black tracking-tight bg-clip-text text-transparent bg-linear-to-r from-primary to-secondary">
                                EduNexus
                            </span>
                        </Link>
                    </div>

                    <div className="navbar-center hidden lg:flex">
                        <ul className="menu menu-horizontal px-1 gap-2 font-medium">
                            <li>
                                <NavLink 
                                    to="/courses" 
                                    className={({ isActive }) => 
                                        `hover:text-primary transition-colors ${isActive ? "text-primary font-bold" : ""}`
                                    }
                                >
                                    Explore Courses
                                </NavLink>
                            </li>
                            <li>
                                <NavLink 
                                    to="/mentors"
                                    className={({ isActive }) => 
                                        `hover:text-primary transition-colors ${isActive ? "text-primary font-bold" : ""}`
                                    }
                                >
                                    Find Mentors
                                </NavLink>
                            </li>
                            <li>
                                <NavLink 
                                    to="/how-it-works"
                                    className={({ isActive }) => 
                                        `hover:text-primary transition-colors ${isActive ? "text-primary font-bold" : ""}`
                                    }
                                >
                                    Methodology
                                </NavLink>
                            </li>
                            <li>
                                <NavLink 
                                    to="/pricing"
                                    className={({ isActive }) => 
                                        `hover:text-primary transition-colors ${isActive ? "text-primary font-bold" : ""}`
                                    }
                                >
                                    Pricing
                                </NavLink>
                            </li>
                        </ul>
                    </div>

                    <div className="navbar-end gap-2">
                        <ThemeToggle currentTheme={currentTheme} /> 
                        
                        <Link to="/login" className="btn btn-ghost hidden sm:inline-flex">Log in</Link>
                        <Link to="/register" className="btn btn-accent text-white shadow-lg shadow-accent/20 hover:scale-105 active:scale-95 transition-all">
                            Join Now
                        </Link>
                    </div>
                </div>
            </header>

            {/* --- MAIN CONTENT --- */}
            <main className="grow">
                <Outlet context={{ currentTheme }} />
            </main>

            {/* --- RESPONSIVE FOOTER --- */}
            <footer className="bg-base-200 text-base-content border-t border-base-content/5">
                <div className="container mx-auto px-4 md:px-8 py-12">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-12">
                    
                        {/* Branding Column */}
                        <div className="sm:col-span-2 lg:col-span-2 space-y-4">
                            <Link to="/" className="flex items-center gap-2 group w-fit">
                                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-primary-content font-bold text-xl group-hover:rotate-12 transition-transform">
                                    N
                                </div>
                                <span className="text-2xl font-black tracking-tight bg-clip-text text-transparent bg-linear-to-r from-primary to-secondary">
                                    EduNexus
                                </span>
                            </Link>
                            <p className="max-w-xs text-base-content/70 leading-relaxed">
                                The nexus of world-class education and industry expertise. 
                                Empowering the next generation of digital architects through project-based learning.
                            </p>
                            <div className="flex gap-4 pt-2">
                                <button className="btn btn-ghost btn-sm btn-circle bg-base-100" aria-label="Twitter">𝕏</button>
                                <button className="btn btn-ghost btn-sm btn-circle bg-base-100" aria-label="LinkedIn">in</button>
                                <button className="btn btn-ghost btn-sm btn-circle bg-base-100" aria-label="GitHub">gh</button>
                            </div>
                        </div>

                        {/* Nav Column 1: Platform */}
                        <div>
                            <header className="footer-title text-primary opacity-100 font-bold mb-4">Platform</header> 
                            <ul className="space-y-3">
                                <li><Link to="/courses" className="link link-hover text-base-content/80 hover:text-primary transition-colors">Browse Catalog</Link></li>
                                <li><Link to="/mentors" className="link link-hover text-base-content/80 hover:text-primary transition-colors">Find Mentors</Link></li>
                                <li><Link to="/how-it-works" className="link link-hover text-base-content/80 hover:text-primary transition-colors">How It Works</Link></li>
                                <li><Link to="/pricing" className="link link-hover text-base-content/80 hover:text-primary transition-colors">Plans & Pricing</Link></li>
                            </ul>
                        </div>

                        {/* Nav Column 2: Company */}
                        <div>
                            <header className="footer-title text-primary opacity-100 font-bold mb-4">Company</header> 
                            <ul className="space-y-3">
                                <li><Link to="/about" className="link link-hover text-base-content/80 hover:text-primary transition-colors">About us</Link></li>
                                <li><Link to="/contact" className="link link-hover text-base-content/80 hover:text-primary transition-colors">Contact</Link></li>
                                <li><Link to="/support" className="link link-hover text-base-content/80 hover:text-primary transition-colors">Help Center</Link></li>
                                <li><a className="link link-hover text-base-content/80 hover:text-primary transition-colors">Careers</a></li>
                            </ul>
                        </div>

                        {/* Nav Column 3: Legal */}
                        <div>
                            <header className="footer-title text-primary opacity-100 font-bold mb-4">Legal</header> 
                            <ul className="space-y-3">
                                <li><Link to="/terms" className="link link-hover text-base-content/80 hover:text-primary transition-colors">Terms of Service</Link></li>
                                <li><Link to="/privacy" className="link link-hover text-base-content/80 hover:text-primary transition-colors">Privacy Policy</Link></li>
                                <li><a className="link link-hover text-base-content/80 hover:text-primary transition-colors">Cookie Policy</a></li>
                                <li><a className="link link-hover text-base-content/80 hover:text-primary transition-colors">Licensing</a></li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-base-content/10 bg-base-300/50">
                    <div className="container mx-auto px-4 md:px-8 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-sm opacity-60 text-center md:text-left">
                            © 2026 EduNexus Inc. All rights reserved. Built with precision for the future of learning.
                        </p>
                        <div className="flex items-center gap-6 text-sm font-medium opacity-60">
                            <span className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                                System Status: Operational
                            </span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}