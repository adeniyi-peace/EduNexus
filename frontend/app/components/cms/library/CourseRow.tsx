import { Edit3, Trash2, Users, Star } from "lucide-react";
import type { CourseData } from "~/types/course";
import { motion } from "framer-motion";

interface CourseRowProps {
    course: CourseData;
    onEdit: (id: string) => void;
    onDelete: (course: CourseData) => void;
}

export const CourseRow = ({ course, onEdit, onDelete }: CourseRowProps) => {
    return (
        <motion.tr 
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="hover:bg-base-200/30 transition-colors group border-b border-base-content/5 last:border-0"
        >
            <td className="pl-6 py-4">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-10 rounded-md overflow-hidden bg-base-300 shrink-0">
                        <img src={course.thumbnail} className="w-full h-full object-cover" alt="" />
                    </div>
                    <div>
                        <div className="font-bold text-sm group-hover:text-primary transition-colors cursor-pointer" onClick={() => onEdit(course.id)}>
                            {course.title}
                        </div>
                        <div className="text-[10px] opacity-50 uppercase tracking-wider font-bold mt-0.5">
                            {course.category}
                        </div>
                    </div>
                </div>
            </td>
            <td>
                <span className={`badge badge-sm font-bold ${
                    course.status === 'Published' ? 'badge-success badge-outline' : 
                    course.status === 'Draft' ? 'badge-warning badge-outline' : 'badge-ghost'
                }`}>
                    {course.status}
                </span>
            </td>
            <td>
                <div className="flex items-center gap-4 text-xs opacity-70 font-mono">
                    <span className="flex items-center gap-1.5"><Users size={14}/> {course.students}</span>
                    <span className="flex items-center gap-1.5"><Star size={14} className="text-warning fill-warning"/> {course.rating}</span>
                </div>
            </td>
            <td className="text-right pr-6">
                <div className="flex justify-end items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => onEdit(course.id)} className="btn btn-sm btn-ghost gap-2 hover:bg-primary/10 hover:text-primary">
                        <Edit3 size={14} /> <span className="hidden xl:inline">Edit</span>
                    </button>
                    <div className="w-px h-4 bg-base-content/10 mx-1"></div>
                    <button 
                        onClick={() => onDelete(course)}
                        className="btn btn-sm btn-square btn-ghost text-error/70 hover:bg-error/10 hover:text-error"
                        title="Delete Course"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </td>
        </motion.tr>
    );
};