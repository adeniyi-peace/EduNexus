import { Trash2, User } from "lucide-react";
import { useCart } from "~/hooks/CartContext";
import type { CourseData } from "~/types/course";

export const CartItem = ({ course }: { course: CourseData }) => {
    const { removeFromCart } = useCart();

    return (
        <div className="flex flex-col sm:flex-row gap-4 p-4 bg-base-100 border border-base-content/5 rounded-3xl hover:border-primary/20 transition-all group animate-fade-in">
            {/* Thumbnail */}
            <div className="w-full sm:w-40 h-24 bg-base-200 rounded-2xl overflow-hidden shrink-0">
                <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
            </div>

            {/* Info */}
            <div className="flex-1 space-y-1">
                <h4 className="font-black text-lg leading-tight group-hover:text-primary transition-colors">
                    {course.title}
                </h4>
                <div className="flex items-center gap-2 text-xs font-bold opacity-50">
                    <User size={14} /> {course.instructor}
                </div>
            </div>

            {/* Price & Action */}
            <div className="flex sm:flex-col justify-between items-end gap-2">
                <p className="text-xl font-black text-secondary">${course.price}</p>
                <button 
                    onClick={() => removeFromCart(course.id)}
                    className="btn btn-ghost btn-circle btn-sm text-error hover:bg-error/10"
                >
                    <Trash2 size={18} />
                </button>
            </div>
        </div>
    );
};