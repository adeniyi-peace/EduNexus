import { Edit3, MoreVertical, Users, Star, Clock } from "lucide-react";
import { motion } from "framer-motion";
import type { CourseData } from "~/types/course";

interface CourseCardProps {
    course: CourseData;
    onEdit: (id: string) => void;
    onDelete: (course: CourseData) => void;
}

export const CourseCard = ({ course, onEdit, onDelete }: CourseCardProps) => {
    return (
        <motion.div 
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="group flex flex-col bg-base-100 border border-base-content/5 rounded-2xl overflow-hidden hover:shadow-xl hover:border-primary/20 transition-all duration-300"
        >
            {/* Thumbnail */}
            <div className="relative aspect-video bg-base-300 overflow-hidden">
                <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                
                {/* Status Badge */}
                <div className="absolute top-3 left-3">
                    <span className={`badge border-none shadow-sm font-bold text-xs uppercase tracking-wider ${
                        course.status === 'Published' ? 'badge-success text-success-content' : 
                        course.status === 'Draft' ? 'badge-warning text-warning-content' : 'badge-ghost'
                    }`}>
                        {course.status}
                    </span>
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                    <button 
                        onClick={() => onEdit(course.id)}
                        className="btn btn-sm btn-white text-black gap-2 hover:scale-105 transition-transform font-bold"
                    >
                        <Edit3 size={14} /> Edit Course
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-primary/80">{course.category}</span>
                    <div className="dropdown dropdown-end">
                        <button tabIndex={0} className="btn btn-ghost btn-xs btn-circle opacity-0 group-hover:opacity-100 transition-opacity">
                            <MoreVertical size={14} />
                        </button>
                        <ul tabIndex={0} className="dropdown-content z-1 menu p-2 shadow-lg bg-base-100 rounded-box w-40 text-xs">
                            <li><a onClick={() => onEdit(course.id)}>Edit Details</a></li>
                            <li><a onClick={() => onDelete(course)} className="text-error hover:bg-error/10">Delete</a></li>
                        </ul>
                    </div>
                </div>

                <h3 className="font-bold text-lg leading-snug mb-4 line-clamp-2 group-hover:text-primary transition-colors">
                    {course.title}
                </h3>

                <div className="mt-auto pt-4 border-t border-base-content/5 flex items-center justify-between text-xs opacity-60 font-mono">
                    <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1"><Users size={12} /> {course.students}</span>
                        <span className="flex items-center gap-1"><Star size={12} className="text-warning fill-warning" /> {course.rating}</span>
                    </div>
                    <span className="flex items-center gap-1"><Clock size={12} /> {course.lastUpdated}</span>
                </div>
            </div>
        </motion.div>
    );
};