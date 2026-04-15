import { Link } from "react-router";
import { ChevronLeft, Star, MessageSquare, ArrowRight, Loader2, RefreshCw } from "lucide-react";
import { useAllCourseReviews } from "~/hooks/instructor/useAllCourseReviews";

export const meta = () => {
  return [
    { title: "All Course Reviews | EduNexus" },
    { name: "description", content: "All Course Reviews Page" },
  ];
};

export default function AllCourseReviewsPage() {
    const { data, isLoading, isError, refetch } = useAllCourseReviews();
    const courses = data?.courses || [];
    const totalReviews = courses.reduce((sum, c) => sum + c.totalReviews, 0);
    const overallRating = totalReviews > 0
        ? courses.reduce((sum, c) => sum + (c.averageRating * c.totalReviews), 0) / totalReviews
        : 0;

    if (isLoading) {
        return (
            <div className="min-h-screen p-4 lg:p-8 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="animate-spin text-primary" size={48} />
                    <p className="text-base-content/60">Loading course reviews...</p>
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="min-h-screen p-4 lg:p-8 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4 text-center">
                    <div className="w-16 h-16 rounded-full bg-error/10 flex items-center justify-center">
                        <RefreshCw size={28} className="text-error" />
                    </div>
                    <h3 className="font-black text-lg">Failed to load reviews</h3>
                    <button onClick={() => refetch()} className="btn btn-primary btn-sm gap-2">
                        <RefreshCw size={14} /> Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen space-y-6 p-4 lg:p-8">
            <div className="flex flex-col gap-1 mb-4">
                <Link to="/cms/analytics" className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary hover:gap-3 transition-all mb-2">
                    <ChevronLeft size={16} /> Back to Analytics
                </Link>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-black tracking-tight text-base-content">
                            Course_<span className="text-primary">Reviews</span>
                        </h1>
                        <p className="text-sm opacity-60 mt-1">Manage feedback across all your courses</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <div className="text-2xl font-black text-primary">{totalReviews}</div>
                            <div className="text-xs opacity-50">Total Reviews</div>
                        </div>
                        <div className="w-px h-10 bg-base-content/10"></div>
                        <div className="text-right">
                            <div className="text-2xl font-black text-warning flex items-center gap-1">
                                {overallRating.toFixed(1)} <Star size={20} fill="currentColor" />
                            </div>
                            <div className="text-xs opacity-50">Overall Rating</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {courses.length === 0 ? (
                    <div className="col-span-full card bg-base-100 border border-base-content/5 p-12 text-center">
                        <MessageSquare size={48} className="mx-auto mb-4 opacity-20" />
                        <p className="text-sm opacity-30 font-bold uppercase tracking-widest">No courses found</p>
                    </div>
                ) : (
                    courses.map((course) => {
                        const getRatingCount = (star: number) => {
                            if (star === 5) return course.fiveStar;
                            if (star === 4) return course.fourStar;
                            if (star === 3) return course.threeStar;
                            if (star === 2) return course.twoStar;
                            return course.oneStar;
                        };
                        return (
                            <div key={course.id} className="card bg-base-100 border border-base-content/5 shadow-sm hover:shadow-md transition-all">
                                <div className="card-body p-6">
                                    <div className="flex gap-4">
                                        <div className="w-24 h-16 rounded-lg bg-base-200 flex-shrink-0 overflow-hidden">
                                            {course.thumbnail ? (
                                                <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center"><MessageSquare size={20} className="opacity-20" /></div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-black text-sm truncate" title={course.title}>{course.title}</h3>
                                            <div className="flex items-center gap-2 mt-1">
                                                <div className="flex items-center gap-1 text-warning">
                                                    <Star size={14} fill="currentColor" />
                                                    <span className="font-bold text-sm">{course.averageRating.toFixed(1)}</span>
                                                </div>
                                                <span className="text-xs opacity-40">({course.totalReviews} reviews)</span>
                                            </div>
                                        </div>
                                        <Link to={`/cms/course/${course.slug}/reviews`} className="btn btn-primary btn-sm gap-2 flex-shrink-0">
                                            View <ArrowRight size={14} />
                                        </Link>
                                    </div>
                                    {course.totalReviews > 0 && (
                                        <div className="mt-4 pt-4 border-t border-base-content/5">
                                            <div className="flex items-center gap-2">
                                                {[5, 4, 3, 2, 1].map((star) => {
                                                    const count = getRatingCount(star);
                                                    const pct = course.totalReviews > 0 ? (count / course.totalReviews) * 100 : 0;
                                                    return (
                                                        <div key={star} className="flex-1">
                                                            <div className="h-1.5 rounded-full bg-base-200 overflow-hidden" title={`${star} stars: ${count}`}>
                                                                <div className={`h-full rounded-full ${star >= 4 ? 'bg-success' : star === 3 ? 'bg-warning' : 'bg-error'}`} style={{ width: `${pct}%` }} />
                                                            </div>
                                                            <div className="text-[10px] text-center mt-1 opacity-40">{star}★</div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
