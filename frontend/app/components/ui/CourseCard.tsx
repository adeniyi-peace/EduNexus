import { Link } from "react-router";
import { Edit3, Trash2, MoreVertical } from "lucide-react";
import type { Course } from "~/utils/mockData";

// Extend the interface to handle instructor specific needs
interface CourseCardProps extends Course {
    isInstructorView?: boolean;
    onEdit?: (id: string) => void;
    onDelete?: (id: string) => void;
    status?: 'Published' | 'Draft' | 'Archived';
}


export function CourseCard({ 
    id, title, instructor, thumbnail, category, price, rating, duration, level, isEnrolled,
    isInstructorView = false, onEdit, onDelete, status = 'Published'
}: CourseCardProps) {
    return (
        <div className="card bg-base-100 shadow-sm hover:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] transition-all duration-500 border border-base-content/5 group overflow-hidden h-full rounded-4xl">
            {/* Thumbnail Area */}
            <figure className="relative h-56 overflow-hidden">
                <img 
                    src={thumbnail} 
                    alt={title} 
                    className="group-hover:scale-110 transition-transform duration-1000 w-full h-full object-cover" 
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="absolute top-5 left-5 flex gap-2">
                    <span className="badge bg-primary/90 backdrop-blur-md text-white border-none font-bold py-3 px-4 text-[10px] uppercase tracking-widest shadow-lg">
                        {category}
                    </span>
                </div>
            </figure>
            
            <div className="card-body p-8">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-warning/10 text-warning">
                        <span className="font-black text-xs">{rating}</span>
                        <div className="rating rating-xs">
                            <input type="radio" className="mask mask-star-2 bg-warning scale-75" readOnly checked />
                        </div>
                    </div>
                    <div className="flex items-center gap-1 text-base-content/40">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                            <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
                        </svg>
                        <span className="text-[10px] font-black uppercase tracking-tighter">{duration}</span>
                    </div>
                </div>

                <h3 className="text-xl font-black leading-tight group-hover:text-primary transition-colors line-clamp-2 min-h-14">
                    {title}
                </h3>
                
                <div className="flex items-center gap-3 mt-4">
                    <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border-2 
                        ${level === 'Beginner' ? 'border-success/20 text-success' : 
                          level === 'Intermediate' ? 'border-warning/20 text-warning' : 
                          'border-error/20 text-error'}`}>
                        {level}
                    </span>
                    <span className="text-xs text-base-content/50 font-medium">
                        {instructor}
                    </span>
                </div>
                
                <div className="divider my-6 opacity-5" />
                
                <div className="flex justify-between items-center">
                    {/* (Case logic remains same, just styling updated) */}
                    {isEnrolled ? (
                        <Link 
                            to={`/dashboard/courses/${id}`}
                            className="btn btn-neutral btn-block rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl transition-all hover:scale-[1.02]"
                        >
                            Enter Course Node
                        </Link>
                    ) : (
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