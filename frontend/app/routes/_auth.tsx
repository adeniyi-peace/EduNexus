import { Outlet, Link } from "react-router";
import { Terminal, ShieldCheck, Activity, Users } from "lucide-react";

export default function AuthLayout() {
    return (
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-base-100 selection:bg-primary/30">
            {/* --- LEFT SIDE: BRANDING & SYSTEM STATS (7 cols) --- */}
            <div className="hidden lg:flex lg:col-span-7 flex-col justify-between p-16 bg-neutral text-neutral-content relative overflow-hidden">
                
                {/* 1. Animated Background Layer */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-secondary/10 rounded-full blur-[100px]" />
                    {/* Architectural Grid Pattern */}
                    <div 
                        className="absolute inset-0 opacity-[0.03]" 
                        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }}
                    />
                </div>

                {/* 2. Top Navigation / Logo */}
                <Link to="/" className="flex items-center gap-3 relative z-10 group w-fit">
                    <div className="relative">
                        <div className="absolute inset-0 bg-primary blur-md opacity-40 group-hover:opacity-80 transition-opacity" />
                        <div className="relative w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-primary-content font-black text-2xl shadow-2xl transition-transform group-hover:-rotate-6">
                            N
                        </div>
                    </div>
                    <div>
                        <span className="text-2xl font-black tracking-tighter text-white block leading-none">EduNexus</span>
                        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">System v3.0</span>
                    </div>
                </Link>

                {/* 3. Hero Copy */}
                <div className="relative z-10 max-w-xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/50 text-xs font-medium mb-8">
                        <Activity size={14} className="text-primary" />
                        Live session: 4,281 engineers coding now
                    </div>
                    <h2 className="text-6xl xl:text-7xl font-black leading-[0.9] mb-8 tracking-tighter">
                        Architect the <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary italic">impossible.</span>
                    </h2>
                    <p className="text-xl opacity-60 leading-relaxed font-medium">
                        The elite ecosystem for senior engineers to master distributed systems, high-frequency architecture, and lead production-ready teams.
                    </p>
                </div>

                {/* 4. Enhanced Social Proof Widget */}
                <div className="relative z-10 grid grid-cols-2 gap-6">
                    {/* Testimonial Card */}
                    <div className="p-8 bg-white/[0.03] rounded-[2.5rem] border border-white/10 backdrop-blur-md shadow-2xl col-span-2 xl:col-span-1">
                        <p className="text-lg font-medium italic opacity-90 mb-6 leading-snug">
                            "The methodology here isn't just theory—it's industrial-grade system design. It bridge the gap between 'knowing' and 'leading'."
                        </p>
                        <div className="flex items-center gap-4">
                            <div className="avatar ring-2 ring-primary ring-offset-base-100 ring-offset-2 rounded-full w-12 h-12">
                                <img src="https://i.pravatar.cc/150?u=jordan" alt="Jordan Dax" className="rounded-full" />
                            </div>
                            <div>
                                <p className="font-bold text-white tracking-tight">Jordan Dax</p>
                                <p className="text-[10px] font-black uppercase tracking-widest text-primary">Staff Engineer @ TechFlow</p>
                            </div>
                        </div>
                    </div>

                    {/* Stats Module */}
                    <div className="hidden xl:flex flex-col justify-center p-8 bg-primary/10 rounded-[2.5rem] border border-primary/20 backdrop-blur-sm">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-primary rounded-2xl text-primary-content shadow-lg shadow-primary/20">
                                <Users size={20} />
                            </div>
                            <span className="text-2xl font-black italic tracking-tighter">50K+</span>
                        </div>
                        <p className="text-xs font-bold uppercase tracking-[0.2em] opacity-60">Engineers Enrolled</p>
                    </div>
                </div>
            </div>

            {/* --- RIGHT SIDE: CLEAN AUTH INTERFACE (5 cols) --- */}
            <main className="lg:col-span-5 flex items-center justify-center p-8 lg:p-20 bg-base-100 relative overflow-hidden">
                {/* Background Ambient Glow for Right Side */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
                
                {/* Mobile Header Overlay */}
                <div className="lg:hidden absolute top-8 left-8 right-8 flex justify-between items-center">
                    <Link to="/" className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-primary-content font-black shadow-lg">N</div>
                        <span className="font-black tracking-tighter text-xl">EduNexus</span>
                    </Link>
                    <div className="p-2 bg-base-200 rounded-lg text-primary">
                        <ShieldCheck size={20} />
                    </div>
                </div>
                
                <div className="w-full max-w-sm animate-in fade-in slide-in-from-bottom-4 duration-700">
                    {/* The Outlet remains clean to allow forms to shine */}
                    <Outlet />
                    
                    <footer className="mt-12 pt-8 border-t border-base-content/5 text-center">
                        <p className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-30 flex items-center justify-center gap-2">
                            <ShieldCheck size={12} />
                            Military Grade Encryption Active
                        </p>
                    </footer>
                </div>
            </main>
        </div>
    );
}