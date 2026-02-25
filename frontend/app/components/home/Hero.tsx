import { Link } from "react-router";

export function Hero() {
    return (
        <section className="relative overflow-hidden bg-base-100 py-8 lg:py-12 border-b border-base-content/5">
            {/* Animated Blobs */}
            <div className="absolute top-0 -left-20 w-96 h-96 bg-primary/20 rounded-full blur-[100px] animate-pulse" />
            <div className="absolute bottom-0 -right-20 w-125 h-125 bg-secondary/10 rounded-full blur-[120px]" />

            <div className="container mx-auto px-4 relative z-10 flex flex-col lg:flex-row items-center gap-16">
                <div className="lg:w-1/2 text-center lg:text-left space-y-8">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest animate-fade-in">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                        </span>
                        Next Generation Learning
                    </div>
                    
                    <h1 className="text-6xl lg:text-8xl font-black leading-[1.1] tracking-tight">
                        Master the <br />
                        <span className="bg-clip-text text-transparent bg-linear-to-r from-primary via-secondary to-primary bg-size-[200%_auto] animate-gradient-x italic">
                            Nexus
                        </span> 
                        of Tech.
                    </h1>
                    
                    <p className="text-xl text-base-content/60 max-w-xl leading-relaxed">
                        Join 50,000+ creators building the future through project-based learning and direct industry mentorship.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                        <Link to="/courses" className="btn btn-primary btn-lg px-10 rounded-2xl shadow-2xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all">
                            Explore Catalog
                        </Link>
                        <Link to="/register" className="btn btn-ghost btn-lg px-10 rounded-2xl border border-base-content/10 hover:bg-base-content/5 transition-all">
                            Start Teaching
                        </Link>
                    </div>
                </div>
                
                <div className="lg:w-1/2 relative group animate-slide-up">
                    <div className="relative z-10 rounded-[2.5rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] border-12 border-base-100 transform lg:rotate-2 group-hover:rotate-0 transition-all duration-1000">
                        <img 
                            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80" 
                            alt="Students collaborating" 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                        />
                    </div>
                    
                    {/* Floating Badge (Glassmorphism) */}
                    <div className="absolute -bottom-10 -left-10 z-20 bg-base-100/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/20 hidden md:block group-hover:-translate-y-4 transition-transform duration-700">
                        <div className="text-4xl font-black text-primary">4.9/5</div>
                        <div className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50">Student Success Rate</div>
                    </div>
                </div>
            </div>
        </section>
    );
}