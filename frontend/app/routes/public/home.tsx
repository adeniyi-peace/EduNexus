import type { Route } from "../+types/home";
import { Hero } from "~/components/home/Hero";
import { SectionHeader } from "~/components/ui/SectionHeader";
import { CourseCard } from "~/components/ui/CourseCard";
import { DUMMY_COURSES } from "~/utils/mockData";

export default function HomePage() {
    return (
        <div className="space-y-0">
            <Hero />

            <section className="container mx-auto px-4 py-24">
                <SectionHeader
                    title="Featured Learning Paths"
                    subtitle="Hand-picked courses by industry veterans to take you from zero to senior."
                    centered
                />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
                    {/* Senior Tip: Use slice to only show the most relevant courses on Home */}
                    {DUMMY_COURSES.slice(0, 3).map((course) => (
                        <CourseCard key={course.id} {...course} />
                    ))}
                </div>

                <div className="mt-16 text-center">
                    <button className="btn btn-outline btn-wide border-2 hover:btn-primary transition-all duration-300">
                        View All Courses
                    </button>
                </div>
            </section>

            {/* Social Proof / Stats Section */}
            <section className="bg-neutral py-20 relative overflow-hidden">
                {/* Decorative background element */}
                <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 -skew-x-12 transform translate-x-1/2" />
                
                <div className="container mx-auto px-4 relative z-10">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 text-center">
                        <div className="space-y-2">
                            <div className="text-5xl font-black text-secondary tracking-tight">12k+</div>
                            <div className="uppercase tracking-widest text-xs font-bold text-base-200y opacity-70">
                                Active Lessons
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="text-5xl font-black text-secondary tracking-tight">50k+</div>
                            <div className="uppercase tracking-widest text-xs font-bold text-base-200y opacity-70">
                                Global Students
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="text-5xl font-black text-secondary tracking-tight">200+</div>
                            <div className="uppercase tracking-widest text-xs font-bold text-base-200y opacity-70">
                                Expert Mentors
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="text-5xl font-black text-secondary tracking-tight">100%</div>
                            <div className="uppercase tracking-widest text-xs font-bold text-base-200y opacity-70">
                                Online Learning
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}