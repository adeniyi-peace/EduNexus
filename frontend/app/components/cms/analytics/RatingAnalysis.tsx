import { Star } from "lucide-react";
import { Link } from "react-router";

interface RatingAnalysisProps {
    ratings?: any[];
    averageRating?: string;
    courseId?: string;
}

export const RatingAnalysis = ({ ratings = [], averageRating = "0.0", courseId }: RatingAnalysisProps) => {
    return (
        <div className="card bg-base-100 border border-base-content/5 shadow-sm h-full">
            <div className="card-body p-6 text-base-content">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="font-black text-lg text-base-content">Rating Analysis</h3>
                        <p className="text-xs opacity-50">Student feedback distribution.</p>
                    </div>
                    <div className="text-right">
                        <div className="text-2xl font-black text-primary">{averageRating}</div>
                        <div className="flex text-warning">
                            {[1, 2, 3, 4, 5].map((s) => (
                                <Star key={s} size={12} fill="currentColor" />
                            ))}
                        </div>
                    </div>
                </div>

                <div className="space-y-4 relative flex-1 min-h-[150px]">
                    {(!ratings || ratings.length === 0 || ratings.every(r => r.count === 0)) ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center opacity-30 select-none">
                            <p className="font-black text-sm uppercase tracking-widest">No Reviews</p>
                            <p className="text-[10px] font-bold">Feedback will appear here.</p>
                        </div>
                    ) : (
                        ratings.map((rating) => (
                            <div key={rating.stars} className="flex items-center gap-4">
                                <div className="flex items-center gap-1 w-8">
                                    <span className="text-xs font-bold">{rating.stars}</span>
                                    <Star size={10} className="text-warning" fill="currentColor" />
                                </div>
                                <div className="flex-1 h-2 bg-base-200 rounded-full overflow-hidden">
                                    <div 
                                        className="h-full bg-primary" 
                                        style={{ width: `${rating.percentage}%` }}
                                    ></div>
                                </div>
                                <div className="w-10 text-right">
                                    <span className="text-xs font-bold opacity-60">{rating.count}</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="mt-6 pt-6 border-t border-base-content/5">
                    <Link 
                        to={courseId ? `/cms/course/${courseId}/reviews` : "/cms/reviews"}
                        className="btn btn-ghost btn-xs w-full font-black opacity-50 hover:opacity-100 flex items-center justify-center no-underline"
                    >
                        {courseId ? "View Course Reviews" : "View All Reviews"}
                    </Link>
                </div>
            </div>
        </div>
    );
};
