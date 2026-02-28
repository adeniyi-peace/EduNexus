import { Link } from "react-router";
import { Edit3, Trash2, MoreVertical } from "lucide-react";
import type { Course } from "~/utils/mockData";
import type { Dispatch, SetStateAction } from "react";
import type { CourseData } from "~/types/course";

// Extend the interface to handle instructor specific needs
interface CourseCardProps extends Course {
    isInstructorView?: boolean;
    onEdit?: (id: string) => void;
    onDelete?: Dispatch<SetStateAction<CourseData | null>>;
    status?: 'Published' | 'Draft' | 'Archived';
}


export function CourseCard({ 
    id, title, instructor, thumbnail, category, price, rating, duration, level, isEnrolled,
    isInstructorView = false, onEdit, onDelete, status = 'Published'
}: CourseCardProps) {
    return (
        <div className="card bg-base-100 shadow-sm hover:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] transition-all duration-500 border border-base-content/5 group overflow-hidden h-full rounded-4xl">
            {/* Thumbnail Area */}
            <figure className="relative h-48 overflow-hidden">
                <img 
                    src={thumbnail} 
                    alt={title} 
                    className="group-hover:scale-110 transition-transform duration-1000 w-full h-full object-cover" 
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="absolute top-5 left-5 flex gap-2">
                    <span className="badge bg-primary/90 backdrop-blur-md text-white border-none font-bold py-3 px-4 text-xs uppercase tracking-widest shadow-lg">
                        {category}
                    </span>
                    
                    {/* Instructor-only Status Badge */}
                    {isInstructorView && (
                        <span className={`badge font-black py-3 px-4 shadow-lg border-none text-xs uppercase tracking-widest 
                            ${status === 'Published' ? 'bg-success text-success-content' : 
                              status === 'Draft' ? 'bg-warning text-warning-content' : 'bg-base-300'}`}>
                            {status}
                        </span>
                    )}
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
                    <div className="flex items-center gap-1 text-base-content/40">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                            <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
                        </svg>
                        <span className="text-[10px] font-black uppercase tracking-tighter">{duration}</span>
                    </div>
                </div>

                <h3 className="card-title text-xl font-black leading-tight group-hover:text-primary transition-colors line-clamp-2 min-h-[3.5rem]">
                    {title}
                </h3>
                
                <div className="flex items-center gap-2 mt-2">
                    <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md border 
                        ${level === 'Beginner' ? 'border-success text-success' : 
                          level === 'Intermediate' ? 'border-warning text-warning' : 
                          'border-error text-error'}`}>
                        {level}
                    </span>
                    <span className="text-xs text-base-content/40 font-bold italic">
                        By {instructor}
                    </span>
                </div>
                
                <div className="divider my-4 opacity-5"></div>
                
                {/* Conditional Footer: Instructor vs. Market vs. Enrolled */}
                <div className="flex justify-between items-center">
                    {isInstructorView ? (
                        /* Case: Instructor Management */
                        <div className="flex w-full gap-2">
                            <button 
                                onClick={() => onEdit?.(id)}
                                className="flex-1 btn btn-neutral btn-sm rounded-xl font-black uppercase tracking-widest text-xs gap-2"
                            >
                                <Edit3 size={14} /> Edit
                            </button>
                            <div className="dropdown dropdown-top dropdown-end">
                                <button tabIndex={0} className="btn btn-ghost btn-sm btn-square rounded-xl border border-base-content/10">
                                    <MoreVertical size={16} />
                                </button>
                                <ul tabIndex={0} className="dropdown-content z-50 menu p-2 shadow-2xl bg-base-100 rounded-box w-40 border border-base-content/5">
                                    <li><a className="text-xs font-bold">View Analytics</a></li>
                                    <li><a className="text-xs font-bold">Manage Students</a></li>
                                    <li><div className="divider my-0 opacity-10"></div></li>
                                    <li>
                                        <button 
                                            onClick={() => onDelete?.(id)}
                                            className="text-xs font-bold text-error hover:bg-error/10"
                                        >
                                            <Trash2 size={14} /> Delete Course
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    ) : isEnrolled ? (
                        /* Case: Student owns the course */
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
                                <span className="text-[10px] uppercase opacity-40 font-black tracking-widest">Price</span>
                                <span className="text-2xl font-black text-base-content">{price}</span>
                            </div>
                            <Link 
                                to={`/courses/${id}`}
                                className="btn btn-primary rounded-2xl px-8 font-black text-xs uppercase tracking-widest hover:shadow-lg hover:shadow-primary/20"
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