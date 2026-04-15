import { useParams, Link } from "react-router";
import { ChevronLeft, Star, MessageSquare, Filter, MoreHorizontal, Reply, Loader2, RefreshCw } from "lucide-react";
import { useCourseReviews } from "~/hooks/instructor/useCourseReviews";

export const meta = () => {
  return [
    { title: "Course Reviews | EduNexus" },
    { name: "description", content: "Course Reviews Page" },
  ];
};

export default function CourseReviewsPage() {
    const { id } = useParams();
    const { data, isLoading, isError, refetch } = useCourseReviews(id);

    const courseTitle = data?.courseTitle || "Course";
    const reviews = data?.reviews || [];

    // Loading state
    if (isLoading) {
        return (
            <div className="min-h-screen p-4 lg:p-8 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="animate-spin text-primary" size={48} />
                    <p className="text-base-content/60">Loading reviews...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (isError) {
        return (
            <div className="min-h-screen p-4 lg:p-8 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4 text-center">
                    <div className="w-16 h-16 rounded-full bg-error/10 flex items-center justify-center">
                        <RefreshCw size={28} className="text-error" />
                    </div>
                    <h3 className="font-black text-lg">Failed to load reviews</h3>
                    <p className="text-sm opacity-60 max-w-xs">Could not fetch reviews for this course.</p>
                    <button onClick={() => refetch()} className="btn btn-primary btn-sm gap-2">
                        <RefreshCw size={14} /> Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen space-y-6 p-4 lg:p-8">
            {/* Header */}
            <div className="flex flex-col gap-1 mb-4">
                <Link
                    to={`/cms/course/${id}/analytics`}
                    className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary hover:gap-3 transition-all mb-2"
                >
                    <ChevronLeft size={16} /> Back to Analytics
                </Link>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-black tracking-tight text-base-content flex items-center gap-3">
                            Student_<span className="text-primary">Feedback</span>
                        </h1>
                        <p className="text-sm opacity-60 mt-1">
                            Reading all reviews for <span className="font-bold text-base-content">{courseTitle}</span>
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <button className="btn btn-sm btn-ghost border border-base-content/10 rounded-xl gap-2 font-black uppercase text-[10px]">
                            <Filter size={14} /> Filter
                        </button>
                        <select className="select select-bordered select-sm rounded-xl font-bold text-xs">
                            <option>Newest First</option>
                            <option>Highest Rating</option>
                            <option>Lowest Rating</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Reviews List */}
            <div className="space-y-4">
                {reviews.length === 0 ? (
                    <div className="card bg-base-100 border border-base-content/5 p-12 text-center text-sm opacity-30 italic font-bold uppercase tracking-widest">
                        No reviews yet for this course.
                    </div>
                ) : (
                    reviews.map((review) => (
                        <div key={review.id} className="card bg-base-100 border border-base-content/5 shadow-sm hover:shadow-md transition-all group">
                            <div className="card-body p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center font-black text-primary">
                                            {review.student.fullname[0]}
                                        </div>
                                        <div>
                                            <h4 className="font-black text-sm">{review.student.fullname}</h4>
                                            <div className="flex text-warning gap-0.5 mt-0.5">
                                                {[1, 2, 3, 4, 5].map((s) => (
                                                    <Star 
                                                        key={s} 
                                                        size={12} 
                                                        fill={s <= review.rating ? "currentColor" : "transparent"} 
                                                        className={s <= review.rating ? "" : "opacity-20"}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-mono opacity-30 uppercase">{new Date(review.created_at).toLocaleDateString()}</p>
                                        <button className="btn btn-ghost btn-xs btn-square opacity-20 hover:opacity-100 mt-2">
                                            <MoreHorizontal size={14} />
                                        </button>
                                    </div>
                                </div>
                                
                                <blockquote className="text-sm italic opacity-80 leading-relaxed pl-4 border-l-2 border-primary/20 mb-6">
                                    "{review.comment}"
                                </blockquote>

                                <div className="flex justify-between items-center py-4 border-t border-base-content/5">
                                    <button className="btn btn-link btn-xs no-underline text-primary p-0 gap-2 h-auto min-h-0 font-black uppercase text-[10px]">
                                        <Reply size={14} /> Reply to Student
                                    </button>
                                    <span className="text-[10px] uppercase font-bold opacity-30 italic">Verified Purchase</span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
