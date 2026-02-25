import type { Route } from "../+types/home";
import { Hero } from "~/components/home/Hero";
import { SectionHeader } from "~/components/ui/SectionHeader";
import { CourseCard } from "~/components/ui/CourseCard";
import { DUMMY_COURSES } from "~/utils/mockData";
import { Link } from "react-router";

export default function HomePage() {
    return (
        <div className="space-y-0 overflow-x-hidden">
            <Hero />

            {/* --- FEATURED COURSES --- */}
            <section className="container mx-auto px-4 py-32 relative">
                {/* Subtle background glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-primary/5 blur-[120px] -z-10" />
                
                <div className="animate-slide-up">
                    <SectionHeader
                        title="Featured Learning Paths"
                        subtitle="Hand-picked courses by industry veterans to take you from zero to senior."
                        centered
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16 animate-fade-in [animation-delay:200ms]">
                    {DUMMY_COURSES.slice(0, 3).map((course) => (
                        <CourseCard key={course.id} {...course} />
                    ))}
                </div>

                <div className="mt-20 text-center animate-fade-in [animation-delay:400ms]">
                    <Link 
                        to="/courses" 
                        className="btn btn-outline btn-wide border-2 hover:bg-primary hover:border-primary transition-all duration-500 group"
                    >
                        View All Courses
                        <span className="group-hover:translate-x-2 transition-transform duration-300">→</span>
                    </Link>
                </div>
            </section>

            {/* --- SOCIAL PROOF / STATS --- */}
            <section className="bg-neutral text-neutral-content py-24 relative overflow-hidden">
                {/* Modern Grid Overlay */}
                <div className="absolute inset-0 opacity-10 mask-[radial-gradient(ellipse_at_center,black,transparent)] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[40px_40px]" />
                
                <div className="container mx-auto px-4 relative z-10">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 text-center">
                        <StatItem value="12k+" label="Active Lessons" />
                        <StatItem value="50k+" label="Global Students" />
                        <StatItem value="200+" label="Expert Mentors" />
                        <StatItem value="100%" label="Success Rate" />
                    </div>
                </div>
            </section>
        </div>
    );
}

function StatItem({ value, label }: { value: string; label: string }) {
    return (
        <div className="space-y-3 group cursor-default">
            <div className="text-5xl lg:text-6xl font-black text-secondary tracking-tighter group-hover:scale-110 transition-transform duration-500">
                {value}
            </div>
            <div className="uppercase tracking-[0.2em] text-[10px] font-bold opacity-60">
                {label}
            </div>
        </div>
    );
}