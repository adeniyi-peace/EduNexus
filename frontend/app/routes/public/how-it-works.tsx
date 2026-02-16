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
            image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&q=80"
        },
        { 
            id: "02", 
            phase: "CONNECT",
            title: "Join a Learning Node", 
            text: "Select a curated path led by industry veterans. You aren't just watching videos; you're joining a cohort of peers and mentors.",
            details: ["Mentor Selection", "Curriculum Access", "Community Integration"],
            image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80"
        },
        { 
            id: "03", 
            phase: "EXECUTE",
            title: "Build Production Systems", 
            text: "Move past 'Hello World.' Tackle complex architectural challenges with real-time feedback loops and automated code reviews.",
            details: ["Project-Based", "Code Reviews", "Pair Programming"],
            image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&q=80"
        },
        { 
            id: "04", 
            phase: "DEPLOY",
            title: "Verify & Propel", 
            text: "Complete your final capstone and earn your Nexus Certification. Gain exclusive access to our partner network job boards.",
            details: ["Certification", "Portfolio Review", "Hiring Network"],
            image: "https://images.unsplash.com/photo-1521791136364-798a7bc0d262?w=800&q=80"
        }
    ];

    return (
        <div className="pb-24">
            {/* Header Hero */}
            <header className="bg-base-200 pt-24 pb-16">
                <div className="container mx-auto px-4">
                    <SectionHeader 
                        title="The Nexus Methodology" 
                        subtitle="A systematic approach to mastering industry-level engineering."
                        centered 
                    />
                </div>
            </header>

            {/* Steps Section */}
            <div className="container mx-auto px-4 py-20 relative">
                {/* Vertical Connector Line (Desktop Only) */}
                <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-linear-to-b from-primary/50 via-secondary/50 to-transparent -translate-x-1/2" />

                <div className="space-y-32">
                    {steps.map((step, index) => (
                        <div key={step.id} className={`flex flex-col lg:flex-row items-center gap-12 lg:gap-24 ${index % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}>
                            
                            {/* Image Side */}
                            <div className="w-full lg:w-1/2 group">
                                <div className="relative p-4">
                                    <div className="absolute inset-0 bg-primary/10 rounded-4xl rotate-3 group-hover:rotate-0 transition-transform duration-500" />
                                    <img 
                                        src={step.image} 
                                        alt={step.title} 
                                        className="relative z-10 rounded-4xl shadow-2xl object-cover aspect-video grayscale hover:grayscale-0 transition-all duration-700" 
                                    />
                                    {/* Floating Step Number */}
                                    <div className="absolute -top-6 -right-6 lg:-right-10 w-24 h-24 bg-base-100 rounded-full flex items-center justify-center shadow-xl border border-base-content/5 z-20">
                                        <span className="text-4xl font-black bg-clip-text text-transparent bg-linear-to-tr from-primary to-secondary">
                                            {step.id}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Content Side */}
                            <div className="w-full lg:w-1/2 space-y-6 text-center lg:text-left">
                                <div className="inline-block py-1 px-4 bg-primary/10 rounded-full text-primary text-xs font-black tracking-widest uppercase">
                                    Phase: {step.phase}
                                </div>
                                <h2 className="text-4xl font-black tracking-tight">{step.title}</h2>
                                <p className="text-xl text-base-content/60 leading-relaxed">
                                    {step.text}
                                </p>
                                
                                <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                                    {step.details.map((detail) => (
                                        <div key={detail} className="flex items-center gap-2 text-sm font-bold opacity-80">
                                            <div className="w-1.5 h-1.5 rounded-full bg-secondary" />
                                            {detail}
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom Final Action */}
            <div className="container mx-auto px-4 mt-32 text-center">
                <div className="max-w-2xl mx-auto bg-neutral text-neutral-content p-12 rounded-[3rem] shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 rounded-full blur-3xl" />
                    <h3 className="text-3xl font-black mb-6">Ready to initiate?</h3>
                    <p className="opacity-70 mb-8">Join the thousands of engineers building the next generation of the web.</p>
                    <Link to="/register" className="btn btn-primary btn-lg px-12 rounded-full">
                        Create Your Account
                    </Link>
                </div>
            </div>
        </div>
    );
}