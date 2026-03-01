import { Link } from "react-router";
import { Edit3, Trash2, MoreVertical, ShoppingCart, Check } from "lucide-react";
import type { Course as MockCourse } from "~/utils/mockData";
import type { Dispatch, SetStateAction } from "react";
import type { CourseData } from "~/types/course";
import { useCart } from "~/hooks/CartContext"; // Import your new Zustand store

interface CourseCardProps extends MockCourse {
    isInstructorView?: boolean;
    onEdit?: (id: string) => void;
    onDelete?: (id: string) => void;
    status?: 'Published' | 'Draft' | 'Archived';
}

export function CourseCard({ 
    id, title, instructor, thumbnail, category, price, rating, duration, level, isEnrolled,
    isInstructorView = false, onEdit, onDelete, status = 'Published'
}: CourseCardProps) {
    // 1. Hook into the Zustand store
    const { cart, addToCart } = useCart();
    
    // 2. Check if this specific course is already in the cart
    const isInCart = cart.some((item) => item.id === id);

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        
        // Match the data structure expected by your Store
        addToCart({
            id,
            title,
            instructor,
            price: typeof price === 'string' ? parseFloat(price.replace('$', '')) : price,
            image: thumbnail
        });
    };

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

                <h3 className="card-title text-xl font-black leading-tight group-hover:text-primary transition-colors line-clamp-2 min-h-14">
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
                
                <div className="flex justify-between items-center">
                    {isInstructorView ? (
                        <div className="flex w-full gap-2">
                            <button 
                                onClick={() => onEdit?.(id.toString())}
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
                                            onClick={() => onDelete?.(id.toString())}
                                            className="text-xs font-bold text-error hover:bg-error/10"
                                        >
                                            <Trash2 size={14} /> Delete Course
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    ) : isEnrolled ? (
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
                        /* Market Place view with Cart Logic */
                        <div className="flex items-center justify-between w-full">
                            <div className="flex flex-col">
                                <span className="text-[10px] uppercase opacity-40 font-black tracking-widest">Price</span>
                                <span className="text-2xl font-black text-base-content">{price}</span>
                            </div>
                            
                            <div className="flex gap-2">
                                <Link 
                                    to={`/courses/${id}`}
                                    className="btn btn-ghost btn-sm rounded-xl font-black text-[10px] uppercase tracking-widest opacity-40 hover:opacity-100"
                                >
                                    Details
                                </Link>

                                {isInCart ? (
                                    <Link to="/cart" className="btn btn-success btn-sm rounded-xl px-4 animate-fade-in shadow-lg shadow-success/20">
                                        <Check size={16} className="text-white" />
                                    </Link>
                                ) : (
                                    <button 
                                        onClick={handleAddToCart}
                                        className="btn btn-primary btn-sm rounded-xl px-4 hover:scale-105 transition-transform shadow-lg shadow-primary/20"
                                    >
                                        <ShoppingCart size={16} />
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}