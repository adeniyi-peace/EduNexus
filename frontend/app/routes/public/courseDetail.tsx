import { useLoaderData, Link } from "react-router"; // Add this import at the top
import { PlayCircle, Lock } from "lucide-react"; // Let's use icons to clarify access
import api from "~/utils/api.client";
import { Syllabus } from "~/components/course/Syllabus";
import { InstructorBio } from "~/components/course/InstructorBio";
import { ReviewSection } from "~/components/course/ReviewSection";
import { EnrollmentCard } from "~/components/course/EnrollmentCard";
import type { CourseData } from "~/types/course";

export async function clientLoader({ params }: { params: { id: string } }) {
    try {
        // Placeholder for future Django API call
        const res = await api.get(`/courses/${params.id}/`);
        return res.data as CourseData;

    } catch (error) {
        console.log(error)
        throw new Response("Not Found", { status: 404 });
    }
}


export default function CourseLandingPage() {
    const course = useLoaderData<typeof clientLoader>();

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
                        <div className="flex flex-wrap gap-6 items-center text-sm font-medium">
                            <div className="flex items-center gap-1">
                                <span className="text-warning text-lg">★</span>
                                <span className="font-bold">{course.rating || 0}</span>
                                <span className="opacity-60">ratings</span>
                            </div>
                            <div>{course.students?.toLocaleString()} students</div>
                            <div>Created by <span className="text-secondary link link-hover">{course.instructor?.fullname}</span></div>
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

                        <Syllabus modules={course.modules} courseId={course.id} />

                        <InstructorBio instructor={course.instructor} />

                        {course.reviews && course.reviews.length > 0 ? (
                            <ReviewSection reviews={course.reviews} courseId={course.id} isEnrolled={!!course.isEnrolled} />
                        ) : (
                            <p>No reviews yet</p>
                        )}
                    </div>  

                    {/* Right Column: Sticky Enrollment Card */}
                    {/* Only show enrollment card if NOT enrolled */}
                    {!course.isEnrolled && (
                        <aside className="w-full lg:w-[400px]">
                            <EnrollmentCard course={course} />
                        </aside>
                    )}

                    {/* If enrolled, show a progress or "Resume" sidebar */}
                    {course.isEnrolled && (
                        <aside className="w-full lg:w-[400px]">
                            <div className="sticky top-28 card bg-primary text-primary-content shadow-2xl p-8 rounded-3xl">
                                <h3 className="text-2xl font-black mb-4">Welcome Back!</h3>
                                <p className="opacity-80 mb-6 font-medium">You are currently enrolled in this course. Continue where you left off.</p>
                                <Link to={`/courses/${course.id}/learn`} className="btn btn-secondary btn-block shadow-lg">
                                    Resume Learning
                                </Link>
                            </div>
                        </aside>
                    )}
                </div>
            </div>
        </div>
    );
}