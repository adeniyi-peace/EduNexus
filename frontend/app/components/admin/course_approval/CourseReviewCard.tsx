import { CheckCircle, XCircle, Eye, Clock, BookOpen, User } from "lucide-react";
import { motion } from "framer-motion";
import type { PendingCourse } from "~/types/course";

interface Props {
    course: PendingCourse;
    onApprove: (id: string) => void;
    onReject: (id: string) => void;
}

export const CourseReviewCard = ({ course, onApprove, onReject }: Props) => {
    return (
        <motion.div 
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, x: -20 }}
            className="card card-side bg-base-100 border border-base-content/5 shadow-sm hover:shadow-md transition-all group"
        >
            {/* Thumbnail */}
            <figure className="w-48 hidden md:block relative overflow-hidden">
                <img src={course.thumbnail} alt={course.title} className="object-cover h-full w-full group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button className="btn btn-circle btn-primary">
                        <Eye size={20} />
                    </button>
                </div>
            </figure>

            <div className="card-body p-5">
                <div className="flex justify-between items-start gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="badge badge-sm badge-secondary font-bold uppercase tracking-widest text-[10px]">
                                {course.category}
                            </span>
                            <span className="text-[10px] font-black opacity-40 uppercase flex items-center gap-1">
                                <Clock size={10} /> {course.submittedAt}
                            </span>
                        </div>
                        <h2 className="card-title text-lg font-black leading-tight mb-2">
                            {course.title}
                        </h2>
                        
                        {/* Instructor Info */}
                        <div className="flex items-center gap-2 mb-4">
                            <div className="avatar">
                                <div className="w-6 h-6 rounded-full">
                                    <img src={course.instructor.avatar} />
                                </div>
                            </div>
                            <span className="text-xs font-bold opacity-70">by {course.instructor.name}</span>
                        </div>
                    </div>

                    <div className="text-right">
                        <p className="text-xl font-black text-primary">${course.price}</p>
                        <p className="text-[10px] font-bold opacity-40 uppercase">{course.modulesCount} Modules</p>
                    </div>
                </div>

                <div className="card-actions justify-end items-center mt-auto pt-4 border-t border-base-content/5 gap-3">
                    <button 
                        onClick={() => onReject(course.id)}
                        className="btn btn-ghost btn-sm text-error gap-2 hover:bg-error/10"
                    >
                        <XCircle size={16} /> Reject
                    </button>
                    <button 
                        onClick={() => onApprove(course.id)}
                        className="btn btn-primary btn-sm gap-2 shadow-lg shadow-primary/20"
                    >
                        <CheckCircle size={16} /> Approve Course
                    </button>
                </div>
            </div>
        </motion.div>
    );
};