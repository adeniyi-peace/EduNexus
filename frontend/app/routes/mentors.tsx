import { useState } from "react";
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
            bio: "Building global-scale infrastructure for over 15 years. Specialized in high-concurrency patterns.",
            avatar: "https://i.pravatar.cc/150?u=aris",
            rating: 5.0,
            students: "12k+"
        },
        {
            id: 2,
            name: "Sarah Jenkins",
            role: "Senior Frontend Engineer",
            company: "ex-Meta",
            expertise: ["React", "TypeScript", "UI/UX"],
            bio: "Obsessed with performance and accessibility. Helping engineers master the modern frontend stack.",
            avatar: "https://i.pravatar.cc/150?u=sarah",
            rating: 4.9,
            students: "8k+"
        },
        {
            id: 3,
            name: "Marcus Chen",
            role: "Full Stack Developer",
            company: "Netflix",
            expertise: ["Node.js", "Python", "Database Design"],
            bio: "Specialist in real-time streaming architectures and complex relational database optimization.",
            avatar: "https://i.pravatar.cc/150?u=marcus",
            rating: 4.9,
            students: "5k+"
        }
    ];

    const tags = ["All", "Distributed Systems", "React", "Python", "Cloud", "UI/UX"];

    return (
        <div className="pb-24">
            {/* --- HERO SECTION --- */}
            <section className="bg-base-200 py-20 lg:py-28">
                <div className="container mx-auto px-4 text-center">
                    <SectionHeader 
                        title="Learn from the Best" 
                        subtitle="Our mentors aren't just teachers; they are active leaders in the world's top engineering teams."
                        centered
                    />
                    
                    {/* Filter Pills */}
                    <div className="flex flex-wrap justify-center gap-3 mt-12">
                        {tags.map((tag) => (
                            <button
                                key={tag}
                                onClick={() => setFilter(tag)}
                                className={`btn btn-sm rounded-full px-6 transition-all ${
                                    filter === tag 
                                    ? "btn-primary shadow-lg shadow-primary/30" 
                                    : "btn-ghost bg-base-100 border-base-content/10"
                                }`}
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- MENTOR GRID --- */}
            <section className="container mx-auto px-4 -mt-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {mentors.map((mentor) => (
                        <div key={mentor.id} className="card bg-base-100 shadow-2xl border border-base-content/5 group hover:-translate-y-2 transition-all duration-500">
                            <div className="card-body p-8">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="avatar">
                                        <div className="w-20 h-20 rounded-2xl ring ring-primary/20 ring-offset-base-100 ring-offset-2">
                                            <img src={mentor.avatar} alt={mentor.name} />
                                        </div>
                                    </div>
                                    <div className="badge badge-secondary font-black text-[10px] tracking-widest p-3">
                                        {mentor.company}
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <h3 className="text-2xl font-black group-hover:text-primary transition-colors">{mentor.name}</h3>
                                    <p className="text-sm font-bold opacity-50 uppercase tracking-widest">{mentor.role}</p>
                                </div>

                                <p className="text-base-content/70 my-6 leading-relaxed line-clamp-2">
                                    {mentor.bio}
                                </p>

                                <div className="flex flex-wrap gap-2 mb-8">
                                    {mentor.expertise.map((exp) => (
                                        <span key={exp} className="text-[10px] font-black uppercase px-2 py-1 bg-base-200 rounded-md">
                                            {exp}
                                        </span>
                                    ))}
                                </div>

                                <div className="divider opacity-5 my-0" />

                                <div className="flex items-center justify-between pt-4">
                                    <div className="flex items-center gap-4">
                                        <div className="text-center">
                                            <p className="text-xs opacity-40 font-bold uppercase">Rating</p>
                                            <p className="font-black text-primary">★ {mentor.rating}</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-xs opacity-40 font-bold uppercase">Students</p>
                                            <p className="font-black">{mentor.students}</p>
                                        </div>
                                    </div>
                                    <button className="btn btn-primary btn-md rounded-xl shadow-lg shadow-primary/20">
                                        View Path
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* --- CTA SECTION --- */}
            <section className="container mx-auto px-4 py-32">
                <div className="relative rounded-[3rem] bg-neutral p-12 lg:p-20 overflow-hidden">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-[120px] -mr-48 -mt-48" />
                    
                    <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
                        <div className="max-w-xl text-center lg:text-left">
                            <h2 className="text-4xl lg:text-5xl font-black text-white mb-6">Are you a <span className="text-secondary italic">Master</span> of your craft?</h2>
                            <p className="text-lg text-neutral-content/60 leading-relaxed">
                                Join the Nexus faculty. We provide the platform, the audience, and the tools—you provide the expertise. Help us shape the engineers of tomorrow.
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                            <button className="btn btn-secondary btn-lg px-10 rounded-2xl font-black">
                                Apply as Mentor
                            </button>
                            <button className="btn btn-ghost btn-lg text-white border-white/20 px-10 rounded-2xl">
                                Faculty FAQ
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}