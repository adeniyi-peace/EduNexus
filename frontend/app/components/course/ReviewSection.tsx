import { useState } from "react";
import api from "~/utils/api.client";
import { Star, MessageSquarePlus } from "lucide-react";
import type { Reviews } from "~/types/course";

export function ReviewSection({ reviews: initialReviews, courseId, isEnrolled }: { reviews: Reviews[], courseId: string, isEnrolled: boolean }) {
    const [reviews, setReviews] = useState(initialReviews);
    const [isWritingReview, setIsWritingReview] = useState(false);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmitReview = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const res = await api.post(`/courses/${courseId}/reviews/`, {
                rating,
                comment
            });
            setReviews([res.data, ...reviews]);
            setIsWritingReview(false);
            setRating(5);
            setComment("");
        } catch (err: any) {
            console.error("Review submission failed", err);
            alert(err.response?.data?.[0] || "Failed to submit review. You might have already reviewed this course.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="py-12 border-t border-base-content/5">
            <div className="flex flex-wrap items-center justify-between gap-6 mb-10">
                <h2 className="text-3xl font-black italic">Student Feedback</h2>
                
                {isEnrolled && !isWritingReview && (
                    <button 
                        onClick={() => setIsWritingReview(true)}
                        className="btn btn-primary btn-md rounded-2xl shadow-lg shadow-primary/20 gap-2"
                    >
                        <MessageSquarePlus size={18} />
                        Write a Review
                    </button>
                )}
            </div>

            {isWritingReview && (
                <div className="mb-12 bg-base-200/50 p-8 rounded-[2.5rem] border-2 border-primary/20 animate-in fade-in zoom-in-95 duration-300">
                    <form onSubmit={handleSubmitReview} className="space-y-6">
                        <div className="flex items-center gap-4">
                            <span className="font-bold text-sm uppercase tracking-widest opacity-60">Your Rating:</span>
                            <div className="rating rating-md">
                                {[1, 2, 3, 4, 5].map((val) => (
                                    <input 
                                        key={val}
                                        type="radio" 
                                        name="rating" 
                                        className="mask mask-star-2 bg-warning" 
                                        checked={rating === val}
                                        onChange={() => setRating(val)}
                                    />
                                ))}
                            </div>
                        </div>
                        <div className="form-control">
                            <textarea 
                                className="textarea textarea-bordered bg-base-100 rounded-2xl h-32 focus:ring-2 focus:ring-primary/20 font-medium" 
                                placeholder="Describe your experience with this course..."
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                required
                            ></textarea>
                        </div>
                        <div className="flex gap-3 justify-end">
                            <button 
                                type="button"
                                onClick={() => setIsWritingReview(false)}
                                className="btn btn-ghost rounded-xl"
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit"
                                disabled={isSubmitting}
                                className="btn btn-primary px-8 rounded-xl shadow-lg shadow-primary/20"
                            >
                                {isSubmitting ? <span className="loading loading-spinner"></span> : "Submit Review"}
                            </button>
                        </div>
                    </form>
                </div>
            )}
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-16 items-start">
                {/* Rating Summary Card */}
                <div className="lg:col-span-1 space-y-6 sticky top-28">
                    <div className="bg-base-200/50 p-8 rounded-[2.5rem] border border-base-content/5 text-center shadow-inner">
                        <div className="text-7xl font-black text-primary mb-2">
                             {reviews.length > 0 
                                ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
                                : "0.0"
                             }
                        </div>
                        <div className="rating rating-md mb-2">
                            {[...Array(5)].map((_, i) => (
                                <Star 
                                    key={i} 
                                    className={`mask mask-star-2 bg-warning ${i < Math.round(reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length || 0) ? '' : 'opacity-20'}`}
                                    size={20}
                                />
                            ))}
                        </div>
                        <p className="text-sm font-black uppercase tracking-widest opacity-40">
                            Course Rating
                        </p>
                        
                        <div className="mt-8 space-y-3">
                            {/* Star breakdown bars */}
                            {[5, 4, 3, 2, 1].map((star) => {
                                const count = reviews.filter(r => r.rating === star).length;
                                const percent = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                                return (
                                    <div key={star} className="flex items-center gap-4 text-xs font-bold">
                                        <span className="w-12 text-right">{star} Stars</span>
                                        <progress 
                                            className="progress progress-primary flex-1 h-2" 
                                            value={percent} 
                                            max="100"
                                        ></progress>
                                        <span className="w-8 opacity-50">{Math.round(percent)}%</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Individual Reviews Feed */}
                <div className="lg:col-span-2 space-y-10 min-w-0">
                    {reviews.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-8 lg:p-16 bg-base-200/30 rounded-3xl border border-base-content/10 text-center text-base-content/50">
                            <MessageSquarePlus size={48} className="mb-4 opacity-40" />
                            <h3 className="text-xl font-bold mb-2">No Reviews Yet</h3>
                            <p className="max-w-xs text-sm">Be the first to share your learning experience! Your feedback helps others.</p>
                        </div>
                    ) : (
                        reviews.map((review) => (
                        <div key={review.id} className="group">
                            <div className="flex gap-5 items-start mb-4">
                                <div className="avatar placeholder">
                                    <div className="bg-neutral text-neutral-content rounded-2xl w-14 shadow-lg group-hover:rotate-3 transition-transform flex">
                                        <span className="text-xl font-bold items-center justify-center">{review.student.fullname ? review.student.fullname[0] : 'U'}</span>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <div className="font-black text-lg">{review.student.fullname || "Anonymous"}</div>
                                    <div className="rating rating-xs">
                                        {[...Array(5)].map((_, i) => (
                                            <input 
                                                key={i} 
                                                type="radio" 
                                                className="mask mask-star-2 bg-warning" 
                                                readOnly 
                                                checked={i < review.rating} 
                                            />
                                        ))}
                                    </div>
                                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-30 mt-1">
                                        {review.created_at ? new Date(review.created_at).toLocaleDateString() : "Just now"} • Verified Purchase
                                    </p>
                                </div>
                            </div>
                            <p className="text-base-content/80 leading-relaxed text-lg border-l-4 border-primary/20 pl-6 italic">
                                "{review.comment}"
                            </p>
                            <div className="flex items-center gap-4 mt-6 ml-10 flex-wrap">
                                <span className="text-xs opacity-40">Was this helpful?</span>
                                <button className="btn btn-xs btn-ghost border border-base-content/10 flex-1 sm:flex-none">Yes</button>
                                <button className="btn btn-xs btn-ghost border border-base-content/10 flex-1 sm:flex-none">No</button>
                            </div>
                        </div>
                    )))}
                    
                    {reviews.length > 5 && (
                        <button className="btn btn-block btn-outline border-2 mt-8">
                            See All {reviews.length} Reviews
                        </button>
                    )}
                </div>
            </div>
        </section>
    );
}