import { 
    Layers, 
    Users, 
    Terminal, 
    Cpu, 
    TrendingUp, 
    ArrowRight, 
    Shield 
} from "lucide-react";
import { SectionHeader } from "~/components/ui/SectionHeader";

export default function AboutPage() {
    const values = [
        {
            title: "Architecture First",
            desc: "We don't just teach syntax. We teach how systems breathe, scale, and evolve across the stack.",
            icon: <Layers className="text-primary" size={32} />,
            color: "bg-primary/10"
        },
        {
            title: "Mentor-Driven",
            desc: "Every course is guided by industry veterans who have shipped code at global scale.",
            icon: <Users className="text-secondary" size={32} />,
            color: "bg-secondary/10"
        },
        {
            title: "Project Reality",
            desc: "No 'Hello World' fluff. You build production-grade software using professional CI/CD workflows.",
            icon: <Terminal className="text-accent" size={32} />,
            color: "bg-accent/10"
        }
    ];

    return (
        <div className="pb-20 overflow-x-hidden">
            {/* --- HERO SECTION --- */}
            <section className="relative bg-neutral py-8 lg:py-12 overflow-hidden">
                {/* Architectural Grid Background */}
                <div className="absolute inset-0 opacity-[0.15]">
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#3B35B8_1.5px,transparent_1.5px)]bg-size-[48px_48px]" />
                </div>
                
                <div className="container mx-auto px-4 relative z-10 text-center animate-slide-up">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/60 text-[10px] font-black uppercase tracking-[0.3em] mb-10">
                        <Shield size={12} className="text-primary" />
                        Engineering Excellence
                    </div>
                    <h1 className="text-6xl lg:text-8xl font-black text-white mb-10 tracking-tighter leading-[0.85]">
                        Bridging the gap between <br />
                        <span className="bg-clip-text text-transparent bg-linear-to-r from-primary via-secondary to-accent italic">Curiosity</span> and <span className="text-white">Expertise</span>.
                    </h1>
                    <p className="text-xl lg:text-2xl text-neutral-content/60 max-w-3xl mx-auto leading-relaxed font-medium">
                        Founded in 2026, EduNexus was built for engineers tired of "Tutorial Hell." 
                        We created a sanctuary for those who want to master the craft.
                    </p>
                </div>
            </section>

            {/* --- CORE VALUES --- */}
            <section className="container mx-auto px-4 py-32">
                <SectionHeader 
                    title="Our Core Philosophy" 
                    subtitle="The engineering principles that guide every node we ship."
                    centered
                />
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
                    {values.map((value) => (
                        <div key={value.title} className="group p-10 rounded-[2.5rem] bg-base-200/50 border border-base-content/5 hover:border-primary/20 hover:bg-base-100 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5">
                            <div className={`w-16 h-16 rounded-2xl ${value.color} flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
                                {value.icon}
                            </div>
                            <h3 className="text-2xl font-black mb-4 tracking-tight">{value.title}</h3>
                            <p className="text-base-content/50 leading-relaxed font-medium">
                                {value.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* --- THE ORIGIN STORY --- */}
            <section className="bg-base-200/50 py-32 border-y border-base-content/5">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col lg:flex-row items-center gap-20">
                        <div className="lg:w-1/2 relative">
                            <div className="absolute -inset-4 bg-linear-to-br from-primary to-secondary rounded-[3rem] blur-2xl opacity-20 animate-pulse" />
                            <div className="relative group">
                                <div className="absolute -top-6 -left-6 w-32 h-32 border-t-4 border-l-4 border-primary rounded-tl-3xl z-20" />
                                <img 
                                    src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1200" 
                                    alt="Engineering collaboration" 
                                    className="relative rounded-[2.5rem] shadow-2xl z-10 grayscale hover:grayscale-0 transition-all duration-700"
                                />
                                <div className="absolute -bottom-6 -right-6 w-32 h-32 border-b-4 border-r-4 border-secondary rounded-br-3xl z-20" />
                            </div>
                        </div>

                        <div className="lg:w-1/2 space-y-8 animate-fade-in">
                            <h2 className="text-5xl font-black tracking-tighter italic">The Nexus Protocol.</h2>
                            <p className="text-xl text-base-content/70 leading-relaxed">
                                In a world flooded with automated content, <span className="text-base-content font-bold underline decoration-primary/30">true mentorship</span> became a luxury. We realized that watching a video isn't the same as understanding a system.
                            </p>
                            <p className="text-xl text-base-content/70 leading-relaxed">
                                EduNexus was born as a connection point—where the world's most talented engineers share their mental models directly with the next generation of builders.
                            </p>
                            
                            <div className="pt-6">
                                <div className="flex flex-wrap gap-6">
                                    <div className="flex items-center gap-4 bg-base-100 p-6 rounded-2xl border border-base-content/5 shadow-sm">
                                        <Cpu className="text-primary" size={24} />
                                        <div>
                                            <p className="text-2xl font-black leading-none">200+</p>
                                            <p className="text-[10px] font-black uppercase opacity-40 tracking-widest mt-1">Lead Instructors</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 bg-base-100 p-6 rounded-2xl border border-base-content/5 shadow-sm">
                                        <TrendingUp className="text-secondary" size={24} />
                                        <div>
                                            <p className="text-2xl font-black leading-none">94%</p>
                                            <p className="text-[10px] font-black uppercase opacity-40 tracking-widest mt-1">Completion Rate</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- CTA --- */}
            <section className="container mx-auto px-4 py-32">
                <div className="bg-neutral p-12 lg:p-24 rounded-[4rem] text-center relative overflow-hidden group">
                    {/* Animated Gradient Background */}
                    <div className="absolute inset-0 bg-linear-to-r from-primary/20 via-transparent to-secondary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                    
                    <div className="relative z-10">
                        <h2 className="text-5xl lg:text-7xl font-black text-white mb-8 tracking-tighter">
                            Ready to join <br />the Nexus?
                        </h2>
                        <p className="text-xl text-white/50 mb-12 max-w-xl mx-auto font-medium">
                            Join a global network of engineers pushing the boundaries of what's possible. No fluff, just craft.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-6 justify-center">
                            <button className="btn btn-lg bg-white text-black border-none hover:bg-primary hover:text-white px-10 rounded-2xl font-black uppercase tracking-widest text-xs h-20 shadow-xl shadow-white/5">
                                Explore Courses
                            </button>
                            <button className="btn btn-lg btn-outline border-white/20 text-white hover:bg-white hover:text-black px-10 rounded-2xl font-black uppercase tracking-widest text-xs h-20 flex items-center gap-3 group/btn">
                                <span>Become a Mentor</span>
                                <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}