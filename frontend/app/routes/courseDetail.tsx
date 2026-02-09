import { useLoaderData } from "react-router";
import { api } from "~/utils/api.client";
import { Syllabus } from "~/components/course/Syllabus";
import { InstructorBio } from "~/components/course/InstructorBio";
import { ReviewSection } from "~/components/course/ReviewSection";
import { EnrollmentCard } from "~/components/course/EnrollmentCard";

export async function loader({ params }: { params: { id: string } }) {
    try {
        // Placeholder for future Django API call
        // const res = await api.get(`/courses/${params.id}/preview/`);
        // return res.data;

        // Dummy Data Fallback
        return {
            id: params.id,
            title: "Advanced Full-Stack Engineering with Django & React",
            subtitle: "Master the architecture of scalable web applications using the Nexus methodology.",
            description: "This isn't just a coding course. It's a deep dive into system design, database optimization, and modern frontend patterns.",
            price: 199.99,
            lastUpdated: "February 2026",
            language: "English",
            studentCount: 1542,
            rating: 4.9,
            instructor: {
                name: "Dr. Aris Thorne",
                title: "Ex-Google Engineer & System Architect",
                bio: "Aris has spent 15 years building distributed systems. He now focuses on bridging the gap between junior syntax and senior architecture.",
                avatar: "https://i.pravatar.cc/150?u=aris",
            },
            syllabus: [
                { title: "Foundation & Architecture", lessons: ["Monolith vs Microservices", "Database Schema Design"] },
                { title: "Advanced Backend with Django", lessons: ["Custom Middleware", "Query Optimization"] },
            ],
            reviews: [
                { id: 1, user: "Sarah L.", rating: 5, comment: "The best architectural breakdown I've ever seen." },
            ]
        };
    } catch (error) {
        throw new Response("Not Found", { status: 404 });
    }
}

export default function CourseLandingPage() {
    const course = useLoaderData<typeof loader>();

    return (
        <div className="bg-base-100 min-h-screen pb-20">
            {/* Dark Hero Header */}
            <section className="bg-neutral text-neutral-content py-16 lg:py-24">
                <div className="container mx-auto px-4 lg:px-8">
                    <div className="max-w-4xl">
                        <div className="flex gap-2 mb-4">
                            <span className="badge badge-secondary font-bold">Best Seller</span>
                            <span className="badge badge-outline">Updated {course.lastUpdated}</span>
                        </div>
                        <h1 className="text-4xl lg:text-6xl font-black mb-6 leading-tight">
                            {course.title}
                        </h1>
                        <p className="text-xl opacity-80 mb-8 max-w-2xl">
                            {course.subtitle}
                        </p>
                        <div className="flex flex-wrap gap-6 items-center text-sm font-medium">
                            <div className="flex items-center gap-1">
                                <span className="text-warning text-lg">★</span>
                                <span className="font-bold">{course.rating}</span>
                                <span className="opacity-60">(428 ratings)</span>
                            </div>
                            <div>{course.studentCount.toLocaleString()} students</div>
                            <div>Created by <span className="text-secondary link link-hover">{course.instructor.name}</span></div>
                        </div>
                    </div>
                </div>
            </section>

            <div className="container mx-auto px-4 lg:px-8 mt-12">
                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Left Column: Content */}
                    <div className="flex-1 space-y-16">
                        <section>
                            <h2 className="text-3xl font-black mb-6">Course Description</h2>
                            <p className="text-lg text-base-content/70 leading-relaxed">
                                {course.description}
                            </p>
                        </section>

                        <Syllabus modules={course.syllabus} />
                        
                        <InstructorBio instructor={course.instructor} />

                        <ReviewSection reviews={course.reviews} />
                    </div>

                    {/* Right Column: Sticky Enrollment Card */}
                    <aside className="w-full lg:w-100">
                        <EnrollmentCard price={course.price} />
                    </aside>
                </div>
            </div>
        </div>
    );
}