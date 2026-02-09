import { SectionHeader } from "~/components/ui/SectionHeader";

export default function AboutPage() {
    const values = [
        {
            title: "Architecture First",
            desc: "We don't just teach syntax. We teach how systems breathe, scale, and evolve.",
            icon: "🏗️"
        },
        {
            title: "Mentor-Driven",
            desc: "Every course is guided by industry veterans, not just content creators.",
            icon: "🤝"
        },
        {
            title: "Project Reality",
            desc: "No 'Hello World' fluff. You build production-grade software from day one.",
            icon: "🚀"
        }
    ];

    return (
        <div className="pb-20">
            {/* --- HERO SECTION --- */}
            <section className="relative bg-neutral py-24 lg:py-32 overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#3B35B8_1px,transparent_1px)] [background-size:40px_40px]" />
                </div>
                
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <h1 className="text-5xl lg:text-7xl font-black text-white mb-8 tracking-tighter">
                        Bridging the gap between <br />
                        <span className="text-primary italic">Curiosity</span> and <span className="text-secondary">Expertise</span>.
                    </h1>
                    <p className="text-xl text-neutral-content/70 max-w-3xl mx-auto leading-relaxed">
                        Founded in 2026, EduNexus was built by engineers who were tired of "Tutorial Hell." 
                        We created a sanctuary for those who want to master the craft, not just pass a quiz.
                    </p>
                </div>
            </section>

            {/* --- CORE VALUES --- */}
            <section className="container mx-auto px-4 py-24">
                <SectionHeader 
                    title="Our Core Philosophy" 
                    subtitle="The principles that guide every lesson we ship."
                    centered
                />
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-16">
                    {values.map((value) => (
                        <div key={value.title} className="group p-8 rounded-3xl bg-base-200/50 border border-base-content/5 hover:border-primary/20 transition-all duration-500">
                            <div className="text-5xl mb-6 group-hover:scale-110 transition-transform block">
                                {value.icon}
                            </div>
                            <h3 className="text-2xl font-black mb-4">{value.title}</h3>
                            <p className="text-base-content/60 leading-relaxed">
                                {value.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* --- THE ORIGIN STORY --- */}
            <section className="bg-base-200 py-24">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        <div className="lg:w-1/2">
                            <div className="relative">
                                <div className="absolute -top-4 -left-4 w-full h-full border-2 border-primary rounded-3xl" />
                                <img 
                                    src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800" 
                                    alt="Our team collaborating" 
                                    className="relative rounded-3xl shadow-2xl z-10"
                                />
                            </div>
                        </div>
                        <div className="lg:w-1/2 space-y-6">
                            <h2 className="text-4xl font-black italic">Why we started.</h2>
                            <p className="text-lg text-base-content/70">
                                In a world flooded with $10 courses, true mentorship became a luxury. We realized that watching a video isn't the same as understanding a system.
                            </p>
                            <p className="text-lg text-base-content/70">
                                EduNexus was born as a <strong>Nexus</strong>—a connection point—where the world's most talented engineers share their mental models directly with the next generation.
                            </p>
                            <div className="pt-4">
                                <div className="stats shadow-sm bg-base-100 border border-base-content/5">
                                    <div className="stat">
                                        <div className="stat-title">Instructors</div>
                                        <div className="stat-value text-primary">200+</div>
                                        <div className="stat-desc">Top 1% of industry</div>
                                    </div>
                                    <div className="stat">
                                        <div className="stat-title">Retention</div>
                                        <div className="stat-value text-secondary">94%</div>
                                        <div className="stat-desc">Student completion</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- CTA --- */}
            <section className="container mx-auto px-4 py-24 text-center">
                <div className="bg-linear-to-r from-primary to-secondary p-12 lg:p-20 rounded-[3rem] text-white shadow-2xl shadow-primary/20">
                    <h2 className="text-4xl lg:text-6xl font-black mb-8">Ready to join the Nexus?</h2>
                    <p className="text-xl opacity-90 mb-10 max-w-2xl mx-auto">
                        Whether you're looking to learn or looking to teach, there's a place for you in our community.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button className="btn btn-lg bg-white text-primary border-none hover:bg-base-200">
                            Explore Courses
                        </button>
                        <button className="btn btn-lg btn-outline border-white text-white hover:bg-white hover:text-primary">
                            Become a Mentor
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}