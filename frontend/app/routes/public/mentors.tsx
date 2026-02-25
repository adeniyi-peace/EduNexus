import { useState } from "react";
import { 
    Star, 
    Users, 
    Briefcase, 
    ArrowUpRight, 
    Cpu, 
    CheckCircle, 
    Search 
} from "lucide-react";
import { SectionHeader } from "~/components/ui/SectionHeader";

export default function MentorsPage() {
    const [filter, setFilter] = useState("All");

    const mentors = [
        {
            id: 1,
            name: "Dr. Aris Thorne",
            role: "Lead System Architect",
            company: "ex-Google",
            expertise: ["Distributed Systems", "Go", "Cloud"],
            bio: "Building global-scale infrastructure for over 15 years. Specialized in high-concurrency patterns and fault-tolerant design.",
            avatar: "https://i.pravatar.cc/150?u=aris",
            rating: 5.0,
            students: "12k+",
            verified: true
        },
        {
            id: 2,
            name: "Sarah Jenkins",
            role: "Senior Frontend Engineer",
            company: "ex-Meta",
            expertise: ["React", "TypeScript", "UI/UX"],
            bio: "Obsessed with performance and accessibility. Helping engineers master the modern frontend stack with deep architectural insights.",
            avatar: "https://i.pravatar.cc/150?u=sarah",
            rating: 4.9,
            students: "8k+",
            verified: true
        },
        {
            id: 3,
            name: "Marcus Chen",
            role: "Full Stack Developer",
            company: "Netflix",
            expertise: ["Node.js", "Python", "Database Design"],
            bio: "Specialist in real-time streaming architectures and complex relational database optimization for high-traffic environments.",
            avatar: "https://i.pravatar.cc/150?u=marcus",
            rating: 4.9,
            students: "5k+",
            verified: true
        }
    ];

    const tags = ["All", "Distributed Systems", "React", "Python", "Cloud", "UI/UX"];

    const filteredMentors = filter === "All" 
        ? mentors 
        : mentors.filter(m => m.expertise.includes(filter));

    return (
        <div className="pb-32 bg-base-100">
            {/* --- HERO SECTION --- */}
            <section className="relative bg-neutral py-24 lg:py-32 overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#3B35B8_1.5px,transparent_1.5px)] bg-size-[48px_48px]" />
                </div>
                
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <SectionHeader 
                        title="Learn from the Best" 
                        subtitle="Our mentors aren't just teachers; they are active leaders in the world's top engineering teams."
                        centered
                    />
                    
                    {/* Filter Pills */}
                    <div className="flex flex-wrap justify-center gap-3 mt-16 max-w-3xl mx-auto">
                        <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10 mr-2">
                            <Search size={14} className="text-white/40" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Filter</span>
                        </div>
                        {tags.map((tag) => (
                            <button
                                key={tag}
                                onClick={() => setFilter(tag)}
                                className={`btn btn-sm rounded-xl px-6 transition-all duration-300 font-bold tracking-tight ${
                                    filter === tag 
                                    ? "btn-primary shadow-xl shadow-primary/20 scale-105" 
                                    : "bg-white/5 text-white/60 border-white/10 hover:bg-white/10"
                                }`}
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- MENTOR GRID --- */}
            <section className="container mx-auto px-4 -mt-12 relative z-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredMentors.map((mentor) => (
                        <div key={mentor.id} className="group relative">
                            {/* Animated Background Glow */}
                            <div className="absolute -inset-1 bg-linear-to-r from-primary/20 to-secondary/20 rounded-[2.5rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            
                            <div className="card bg-base-100 relative h-full border border-base-content/5 shadow-2xl rounded-4xl overflow-hidden transition-all duration-500 group-hover:border-primary/30 group-hover:-translate-y-2">
                                <div className="card-body p-8 space-y-6">
                                    {/* Top Bar: Avatar & Company */}
                                    <div className="flex justify-between items-start">
                                        <div className="relative">
                                            <div className="avatar">
                                                <div className="w-24 h-24 rounded-3xl ring-4 ring-base-200 group-hover:ring-primary/20 transition-all duration-500">
                                                    <img src={mentor.avatar} alt={mentor.name} className="object-cover" />
                                                </div>
                                            </div>
                                            {mentor.verified && (
                                                <div className="absolute -bottom-2 -right-2 bg-primary text-white p-1.5 rounded-full shadow-lg">
                                                    <CheckCircle size={14} fill="currentColor" className="text-white" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex flex-col items-end gap-2">
                                            <div className="badge border-none bg-secondary/10 text-secondary font-black text-[10px] tracking-widest p-3 rounded-lg uppercase">
                                                {mentor.company}
                                            </div>
                                            <div className="flex items-center gap-1 text-primary">
                                                <Star size={14} fill="currentColor" />
                                                <span className="text-sm font-black">{mentor.rating}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Identity */}
                                    <div className="space-y-1">
                                        <h3 className="text-2xl font-black group-hover:text-primary transition-colors tracking-tighter">
                                            {mentor.name}
                                        </h3>
                                        <div className="flex items-center gap-2 opacity-50">
                                            <Briefcase size={12} />
                                            <p className="text-xs font-bold uppercase tracking-widest">{mentor.role}</p>
                                        </div>
                                    </div>

                                    <p className="text-base-content/60 leading-relaxed font-medium line-clamp-3">
                                        {mentor.bio}
                                    </p>

                                    {/* Expertise Tags */}
                                    <div className="flex flex-wrap gap-2">
                                        {mentor.expertise.map((exp) => (
                                            <span key={exp} className="text-[9px] font-black uppercase px-3 py-1.5 bg-base-200 text-base-content/70 rounded-lg border border-base-content/5">
                                                {exp}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="pt-4 mt-auto border-t border-base-content/5 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="w-10 h-10 rounded-full bg-base-200 flex items-center justify-center text-primary">
                                                <Users size={18} />
                                            </div>
                                            <div>
                                                <p className="text-lg font-black leading-none">{mentor.students}</p>
                                                <p className="text-[9px] font-bold uppercase opacity-40">Architects Led</p>
                                            </div>
                                        </div>
                                        <button className="btn btn-primary btn-square rounded-2xl group/btn overflow-hidden w-14 h-14">
                                            <ArrowUpRight size={20} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* --- CTA SECTION --- */}
            <section className="container mx-auto px-4 py-32">
                <div className="relative rounded-[4rem] bg-neutral p-12 lg:p-24 overflow-hidden border border-white/5">
                    {/* Background Visuals */}
                    <div className="absolute top-0 right-0 w-125 h-125 bg-primary/20 rounded-full blur-[120px] -mr-64 -mt-64" />
                    <Cpu size={300} className="absolute -bottom-20 -left-20 text-white/5 -rotate-12" />
                    
                    <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-16">
                        <div className="max-w-2xl text-center lg:text-left space-y-8">
                            <h2 className="text-5xl lg:text-7xl font-black text-white tracking-tighter leading-none">
                                Are you a <br />
                                <span className="text-secondary italic">Master</span> of your craft?
                            </h2>
                            <p className="text-xl text-neutral-content/50 leading-relaxed font-medium">
                                Join the Nexus faculty. We provide the infrastructure and the brightest minds—you provide the mental models. Help us shape the next generation of systems engineers.
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-6 w-full lg:w-auto">
                            <button className="btn btn-secondary btn-lg h-20 px-12 rounded-2xl font-black uppercase tracking-widest text-xs shadow-2xl shadow-secondary/20 transition-transform hover:scale-105">
                                Apply to Faculty
                            </button>
                            <button className="btn btn-outline border-white/20 text-white btn-lg h-20 px-12 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-white hover:text-black">
                                Faculty FAQ
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}