// app/components/course/ReviewSection.tsx

export function ReviewSection({ reviews }: { reviews: any[] }) {
    return (
        <section className="py-12 border-t border-base-content/5">
            <h2 className="text-3xl font-black mb-10 italic">Student Feedback</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 items-start">
                {/* Rating Summary Card */}
                <div className="lg:col-span-1 space-y-6 sticky top-28">
                    <div className="bg-base-200/50 p-8 rounded-[2.5rem] border border-base-content/5 text-center shadow-inner">
                        <div className="text-7xl font-black text-primary mb-2">4.9</div>
                        <div className="rating rating-md mb-2">
                            {[...Array(5)].map((_, i) => (
                                <input 
                                    key={i} 
                                    type="radio" 
                                    className="mask mask-star-2 bg-warning" 
                                    readOnly 
                                    checked={i < 5} 
                                />
                            ))}
                        </div>
                        <p className="text-sm font-black uppercase tracking-widest opacity-40">
                            Course Rating
                        </p>
                        
                        <div className="mt-8 space-y-3">
                            {/* Star breakdown bars */}
                            {[
                                { star: 5, percent: 92 },
                                { star: 4, percent: 6 },
                                { star: 3, percent: 2 },
                                { star: 2, percent: 0 },
                                { star: 1, percent: 0 },
                            ].map((row) => (
                                <div key={row.star} className="flex items-center gap-4 text-xs font-bold">
                                    <span className="w-12 text-right">{row.star} Stars</span>
                                    <progress 
                                        className="progress progress-primary flex-1 h-2" 
                                        value={row.percent} 
                                        max="100"
                                    ></progress>
                                    <span className="w-8 opacity-50">{row.percent}%</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Individual Reviews Feed */}
                <div className="lg:col-span-2 space-y-10">
                    {reviews.map((review) => (
                        <div key={review.id} className="group">
                            <div className="flex gap-5 items-start mb-4">
                                <div className="avatar placeholder">
                                    <div className="bg-neutral text-neutral-content rounded-2xl w-14 shadow-lg group-hover:rotate-3 transition-transform">
                                        <span className="text-xl font-bold">{review.user[0]}</span>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <div className="font-black text-lg">{review.user}</div>
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
                                        2 Weeks Ago • Verified Purchase
                                    </p>
                                </div>
                            </div>
                            <p className="text-base-content/80 leading-relaxed text-lg border-l-4 border-primary/20 pl-6 italic">
                                "{review.comment}"
                            </p>
                            <div className="flex items-center gap-4 mt-6 ml-10">
                                <span className="text-xs opacity-40">Was this helpful?</span>
                                <button className="btn btn-xs btn-ghost border border-base-content/10">Yes</button>
                                <button className="btn btn-xs btn-ghost border border-base-content/10">No</button>
                            </div>
                        </div>
                    ))}
                    
                    <button className="btn btn-block btn-outline border-2 mt-8">
                        See All 428 Reviews
                    </button>
                </div>
            </div>
        </section>
    );
}