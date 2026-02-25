import { 
    Fingerprint, 
    Network, 
    Terminal, 
    Award, 
    CheckCircle2, 
    ArrowRight,
    Zap
} from "lucide-react";
import { SectionHeader } from "~/components/ui/SectionHeader";
import { Link } from "react-router";

export default function HowItWorks() {
    const steps = [
        { 
            id: "01", 
            phase: "INITIALIZE",
            title: "Architect Your Profile", 
            text: "Define your current stack and career goals. Our system analyzes your 'Knowledge Gaps' to suggest the most efficient path forward.",
            details: ["Skill Assessment", "Interest Mapping", "Goal Setting"],
            icon: <Fingerprint size={20} className="text-primary" />,
            image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&q=80"
        },
        { 
            id: "02", 
            phase: "CONNECT",
            title: "Join a Learning Node", 
            text: "Select a curated path led by industry veterans. You aren't just watching videos; you're joining a cohort of peers and mentors.",
            details: ["Mentor Selection", "Curriculum Access", "Community Integration"],
            icon: <Network size={20} className="text-secondary" />,
            image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80"
        },
        { 
            id: "03", 
            phase: "EXECUTE",
            title: "Build Production Systems", 
            text: "Move past 'Hello World.' Tackle complex architectural challenges with real-time feedback loops and automated code reviews.",
            details: ["Project-Based", "Code Reviews", "Pair Programming"],
            icon: <Terminal size={20} className="text-accent" />,
            image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&q=80"
        },
        { 
            id: "04", 
            phase: "DEPLOY",
            title: "Verify & Propel", 
            text: "Complete your final capstone and earn your Nexus Certification. Gain exclusive access to our partner network job boards.",
            details: ["Certification", "Portfolio Review", "Hiring Network"],
            icon: <Award size={20} className="text-success" />,
            image: "https://images.unsplash.com/photo-1521791136364-798a7bc0d262?w=800&q=80"
        }
    ];

    return (
        <div className="pb-32 bg-base-100">
            {/* --- HERO HEADER --- */}
            <header className="relative bg-neutral pt-32 pb-24 overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#3B35B8_1.5px,transparent_1.5px)] bg-size-[40px_40px]" />
                </div>
                <div className="container mx-auto px-4 relative z-10">
                    <SectionHeader 
                        title="The Nexus Methodology" 
                        subtitle="A systematic approach to mastering industry-level engineering through four critical phases."
                        centered 
                    />
                </div>
            </header>

            {/* --- STEPS SECTION --- */}
            <div className="container mx-auto px-4 py-24 relative">
                {/* Vertical Connector Line */}
                <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-linear-to-b from-primary via-secondary to-accent -translate-x-1/2 opacity-20" />
                
                {/* Animated "Data Flow" pulse */}
                <div className="hidden lg:block absolute left-1/2 top-0 w-0.5 h-32 bg-linear-to-b from-transparent via-primary to-transparent -translate-x-1/2 animate-[bounce_3s_infinite] blur-sm" />

                <div className="space-y-40 lg:space-y-64">
                    {steps.map((step, index) => (
                        <div key={step.id} className={`flex flex-col lg:flex-row items-center gap-16 lg:gap-32 ${index % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}>
                            
                            {/* Visual/Image Side */}
                            <div className="w-full lg:w-1/2 group relative">
                                <div className="absolute -inset-1 bg-linear-to-r from-primary/20 to-secondary/20 rounded-[3rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                                <div className="relative p-2 bg-base-100 rounded-[2.5rem] border border-base-content/5 shadow-2xl">
                                    <img 
                                        src={step.image} 
                                        alt={step.title} 
                                        className="rounded-4xl aspect-video object-cover grayscale group-hover:grayscale-0 transition-all duration-1000" 
                                    />
                                    {/* Floating Phase Badge */}
                                    <div className="absolute -top-6 -left-6 bg-neutral text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-white/10">
                                        {step.icon}
                                        <span className="text-[10px] font-black tracking-[0.2em] uppercase">{step.phase}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Text Content Side */}
                            <div className="w-full lg:w-1/2 space-y-8 text-center lg:text-left">
                                <div className="space-y-4">
                                    <span className="text-8xl font-black opacity-5 block leading-none select-none">
                                        {step.id}
                                    </span>
                                    <h2 className="text-4xl lg:text-5xl font-black tracking-tighter -mt-8">
                                        {step.title}
                                    </h2>
                                    <p className="text-xl text-base-content/60 leading-relaxed max-w-xl mx-auto lg:mx-0 font-medium">
                                        {step.text}
                                    </p>
                                </div>
                                
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    {step.details.map((detail) => (
                                        <div key={detail} className="flex items-center gap-2 px-4 py-3 rounded-xl bg-base-200/50 border border-base-content/5 transition-colors hover:border-primary/30 group">
                                            <CheckCircle2 size={14} className="text-primary opacity-40 group-hover:opacity-100" />
                                            <span className="text-[10px] font-black uppercase tracking-wider opacity-70 group-hover:opacity-100">{detail}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* --- FINAL ACTION --- */}
            <div className="container mx-auto px-4 mt-40">
                <div className="max-w-4xl mx-auto bg-neutral p-12 lg:p-20 rounded-[4rem] shadow-3xl relative overflow-hidden text-center group">
                    {/* Decorative Background Element */}
                    <Zap size={200} className="absolute -bottom-10 -right-10 text-white/5 -rotate-12 group-hover:scale-110 transition-transform duration-1000" />
                    
                    <div className="relative z-10 space-y-10">
                        <h3 className="text-4xl lg:text-6xl font-black text-white tracking-tighter">
                            Ready to initiate <br /><span className="text-primary italic">Connection?</span>
                        </h3>
                        <p className="text-white/50 text-xl max-w-xl mx-auto">
                            Join the next generation of engineers building production-grade architecture. Your node is waiting.
                        </p>
                        <Link to="/register" className="btn btn-primary btn-lg h-20 px-12 rounded-2xl group/btn flex items-center justify-between max-w-xs mx-auto shadow-xl shadow-primary/20">
                            <span className="font-black uppercase tracking-widest text-sm">Get Started</span>
                            <ArrowRight className="group-hover/btn:translate-x-2 transition-transform" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}