import { useLoaderData, Link, type ClientLoaderFunctionArgs } from "react-router";
import { ChevronLeft, Star, MessageSquare, ArrowRight } from "lucide-react";
import api from "~/utils/api.client";

interface CourseReviewSummary {
    id: string;
    slug: string;
    title: string;
    thumbnail?: string;
    totalReviews: number;
    averageRating: number;
    fiveStar: number;
    fourStar: number;
    threeStar: number;
    twoStar: number;
    oneStar: number;
}

interface PageData {
    courses: CourseReviewSummary[];
}

export async function clientLoader({ }: ClientLoaderFunctionArgs) {
    try {
        // Fetch instructor dashboard data which includes courses
        const response = await api.get("/user/instructor/dashboard/");
        const dashboardData = response.data;
        
        // Map courses with review data
        const coursesWithReviews = await Promise.all(
            (dashboardData.myCourses || []).map(async (course: any) => {
                try {
                    // Fetch reviews for each course
                    const reviewsRes = await api.get(`/courses/${course.id}/reviews/`);
                    const reviews = Array.isArray(reviewsRes.data) 
                        ? reviewsRes.data 
                        : (reviewsRes.data?.results || []);
                    
                    // Calculate rating distribution
                    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
                    let totalRating = 0;
                    reviews.forEach((review: any) => {
                        const rating = Math.round(review.rating);
                        if (rating >= 1 && rating <= 5) {
                            distribution[rating as keyof typeof distribution]++;
                            totalRating += review.rating;
                        }
                    });
                    
                    return {
                        id: course.id,
                        slug: course.slug || course.id,
                        title: course.title,
                        thumbnail: course.thumbnail,
                        totalReviews: reviews.length,
                        averageRating: reviews.length > 0 ? totalRating / reviews.length : 0,
                        fiveStar: distribution[5],
                        fourStar: distribution[4],
                        threeStar: distribution[3],
                        twoStar: distribution[2],
                        oneStar: distribution[1],
                    };
                } catch {
                    // Return course with zero reviews if fetch fails
                    return {
                        id: course.id,
                        slug: course.slug || course.id,
                        title: course.title,
                        thumbnail: course.thumbnail,
                        totalReviews: 0,
                        averageRating: 0,
                        fiveStar: 0,
                        fourStar: 0,
                        threeStar: 0,
                        twoStar: 0,
                        oneStar: 0,
                    };
                }
            })
        );
        
        return { courses: coursesWithReviews } as PageData;
    } catch (error) {
        console.error("All course reviews loader error:", error);
        return { courses: [] };
    }
}

export default function AllCourseReviewsPage() {
    const { courses } = useLoaderData<PageData>();
    
    const totalReviews = courses.reduce((sum, c) => sum + c.totalReviews, 0);
    const overallRating = courses.length > 0
        ? courses.reduce((sum, c) => sum + (c.averageRating * c.totalReviews), 0) / totalReviews
        : 0;

    return (
        <div className="min-h-screen space-y-6 p-4 lg:p-8">
            {/* Header */}
            <div className="flex flex-col gap-1 mb-4">
                <Link
                    to="/cms/analytics"
                    className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary hover:gap-3 transition-all mb-2"
                >
                    <ChevronLeft size={16} /> Back to Analytics
                </Link>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-black tracking-tight text-base-content">
                            Course_<span className="text-primary">Reviews</span>
                        </h1>
                        <p className="text-sm opacity-60 mt-1">
                            Manage feedback across all your courses
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <div className="text-2xl font-black text-primary">{totalReviews}</div>
                            <div className="text-xs opacity-50">Total Reviews</div>
                        </div>
                        <div className="w-px h-10 bg-base-content/10"></div>
                        <div className="text-right">
                            <div className="text-2xl font-black text-warning flex items-center gap-1">
                                {overallRating.toFixed(1)}
                                <Star size={20} fill="currentColor" />
                            </div>
                            <div className="text-xs opacity-50">Overall Rating</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Course Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {courses.length === 0 ? (
                    <div className="col-span-full card bg-base-100 border border-base-content/5 p-12 text-center">
                        <MessageSquare size={48} className="mx-auto mb-4 opacity-20" />
                        <p className="text-sm opacity-30 font-bold uppercase tracking-widest">
                            No courses found
                        </p>
                    </div>
                ) : (
                    courses.map((course) => (
                        <div
                            key={course.id}
                            className="card bg-base-100 border border-base-content/5 shadow-sm hover:shadow-md transition-all"
                        >
                            <div className="card-body p-6">
                                <div className="flex gap-4">
                                    {/* Thumbnail */}
                                    <div className="w-24 h-16 rounded-lg bg-base-200 flex-shrink-0 overflow-hidden">
                                        {course.thumbnail ? (
                                            <img
                                                src={course.thumbnail}
                                                alt={course.title}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <MessageSquare size={20} className="opacity-20" />
                                            </div>
                                        )}
                                    </div>
                                    
                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-black text-sm truncate" title={course.title}>
                                            {course.title}
                                        </h3>
                                        <div className="flex items-center gap-2 mt-1">
                                            <div className="flex items-center gap-1 text-warning">
                                                <Star size={14} fill="currentColor" />
                                                <span className="font-bold text-sm">
                                                    {course.averageRating.toFixed(1)}
                                                </span>
                                            </div>
                                            <span className="text-xs opacity-40">
                                                ({course.totalReviews} reviews)
                                            </span>
                                        </div>
                                    </div>
                                    
                                    {/* Action */}
                                    <Link
                                        to={`/cms/course/${course.slug}/reviews`}
                                        className="btn btn-primary btn-sm gap-2 flex-shrink-0"
                                    >
                                        View <ArrowRight size={14} />
                                    </Link>
                                </div>

                                {/* Rating Distribution */}
                                {course.totalReviews > 0 && (
                                    <div className="mt-4 pt-4 border-t border-base-content/5">
                                        <div className="flex items-center gap-2">
                                            {[5, 4, 3, 2, 1].map((star) => {
                                                const count = star === 5 ? course.fiveStar :
                                                    star === 4 ? course.fourStar :
                                                    star === 3 ? course.threeStar :
                                                    star === 2 ? course.twoStar : course.oneStar;
                                                const percentage = course.totalReviews > 0 
                                                    ? (count / course.totalReviews) * 100 
                                                    : 0;
                                                return (
                                                    <div key={star} className="flex-1">
                                                        <div
                                                            className="h-1.5 rounded-full bg-base-200 overflow-hidden"
                                                            title={`${star} stars: ${count} reviews`}
                                                        >
                                                            <div
                                                                className={`h-full rounded-full ${
                                                                    star >= 4 ? 'bg-success' :
                                                                    star === 3 ? 'bg-warning' : 'bg-error'
                                                                }`}
                                                                style={{ width: `${percentage}%` }}
                                                            />
                                                        </div>
                                                        <div className="text-[10px] text-center mt-1 opacity-40">
                                                            {star}★
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
