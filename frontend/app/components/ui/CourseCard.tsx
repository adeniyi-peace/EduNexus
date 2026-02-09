import { Link } from "react-router";
import type { Course } from "~/utils/mockData";

export function CourseCard({ 
    id,
    title, 
    instructor, 
    thumbnail, 
    category, 
    price, 
    rating, 
    students,
    duration,
    level,
    isEnrolled 
}: Course) {
    return (
        <div className="card bg-base-100 shadow-sm hover:shadow-2xl transition-all duration-500 border border-base-content/5 group overflow-hidden h-full">
            {/* Thumbnail Area */}
            <figure className="relative h-48 overflow-hidden">
                <img 
                    src={thumbnail} 
                    alt={title} 
                    className="group-hover:scale-110 transition-transform duration-700 w-full h-full object-cover" 
                />
                <div className="absolute top-4 left-4 flex gap-2">
                    <span className="badge badge-primary font-black py-3 px-4 shadow-lg border-none text-[10px] uppercase tracking-widest bg-primary">
                        {category}
                    </span>
                </div>
            </figure>
            
            <div className="card-body p-6">
                {/* Stats Row */}
                <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-1.5">
                        <div className="rating rating-xs">
                            <input type="radio" className="mask mask-star-2 bg-warning" readOnly checked />
                        </div>
                        <span className="font-black text-xs">{rating}</span>
                    </div>
                    <div className="flex items-center gap-3 opacity-40">
                        <div className="flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                            <span className="text-[10px] font-black uppercase">{duration}</span>
                        </div>
                    </div>
                </div>

                <h3 className="card-title text-xl font-black leading-tight group-hover:text-primary transition-colors line-clamp-2 min-h-[3.5rem]">
                    {title}
                </h3>
                
                {/* Hardness Level Indicator */}
                <div className="flex items-center gap-2 mt-2">
                    <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md border 
                        ${level === 'Beginner' ? 'border-success text-success' : 
                          level === 'Intermediate' ? 'border-warning text-warning' : 
                          'border-error text-error'}`}>
                        {level}
                    </span>
                    <span className="text-[10px] text-base-content/40 font-bold italic">
                        By {instructor}
                    </span>
                </div>
                
                <div className="divider my-4 opacity-5"></div>
                
                {/* Conditional Footer: Market vs. Enrolled */}
                <div className="flex justify-between items-center">
                    {isEnrolled ? (
                        /* Case: User owns the course */
                        <div className="w-full">
                            <Link 
                                to={`/dashboard/courses/${id}`}
                                className="btn btn-neutral btn-block rounded-xl font-black uppercase tracking-widest text-xs group/btn shadow-xl shadow-neutral/10"
                            >
                                Enter Course Node
                                <span className="group-hover/btn:translate-x-1 transition-transform">→</span>
                            </Link>
                        </div>
                    ) : (
                        /* Case: Market Place view */
                        <>
                            <div className="flex flex-col">
                                <span className="text-[9px] uppercase opacity-40 font-black tracking-widest">Pricing</span>
                                <span className="text-xl font-black text-primary">{price}</span>
                            </div>
                            <Link 
                                to={`/market/courses/${id}`}
                                className="btn btn-primary btn-md rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-primary/20"
                            >
                                Details
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}