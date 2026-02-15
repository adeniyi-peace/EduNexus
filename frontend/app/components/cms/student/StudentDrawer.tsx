import { X, Mail, BookOpen, ExternalLink, ShieldAlert } from "lucide-react";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Student } from "~/types/students";

interface DrawerProps {
    student: Student | null;
    onClose: () => void;
}

export const StudentDrawer = ({ student, onClose }: DrawerProps) => {
    return (
        <AnimatePresence>
            {student && (
                <>
                    {/* Backdrop */}
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
                    />

                    {/* Drawer Panel */}
                    <motion.div 
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed inset-y-0 right-0 w-full max-w-md shadow-2xl z-50 border-l border-base-content/10 flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-base-content/5 flex justify-between items-start bg-base-200/30">
                            <div className="flex gap-4">
                                <div className="avatar">
                                    <div className="w-16 rounded-full ring ring-primary ring-offset-2 ring-offset-base-100">
                                        <img src={student.avatar} alt={student.name} />
                                    </div>
                                </div>
                                <div>
                                    <h2 className="text-xl font-black">{student.name}</h2>
                                    <p className="text-sm opacity-60 flex items-center gap-1 mb-2">
                                        <Mail size={12} /> {student.email}
                                    </p>
                                    <span className="badge badge-sm badge-success font-bold uppercase tracking-wider text-[10px]">
                                        Joined {student.joinedDate}
                                    </span>
                                </div>
                            </div>
                            <button onClick={onClose} className="btn btn-circle btn-sm btn-ghost hover:bg-base-content/10">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Scrollable Content */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            
                            {/* Section: Enrolled Courses List */}
                            {student.enrolledCoursesList && (
                                <div>
                                    <h3 className="text-xs font-black uppercase opacity-40 mb-3 flex items-center gap-2">
                                        <BookOpen size={12} /> Enrolled Courses ({student.enrolledCoursesList.length})
                                    </h3>
                                    <div className="space-y-3">
                                        {student.enrolledCoursesList.map((course) => (
                                            <div key={course.id} className="p-3 border border-base-content/10 rounded-xl hover:border-primary/30 transition-colors shadow-xs">
                                                <div className="flex justify-between items-start mb-2">
                                                    <h4 className="font-bold text-sm line-clamp-1">{course.title}</h4>
                                                    <a href={`/courses/${course.id}`} className="opacity-30 hover:opacity-100 hover:text-primary"><ExternalLink size={12} /></a>
                                                </div>
                                                <div className="flex items-center gap-3 text-xs">
                                                    <div className="flex-1 flex flex-col gap-1">
                                                        <div className="flex justify-between opacity-60">
                                                            <span>Progress</span>
                                                            <span>{course.progress}%</span>
                                                        </div>
                                                        <progress className="progress progress-primary w-full h-1" value={course.progress} max="100"></progress>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Section: Current Course Specifics (if only 1 course context) */}
                            {student.currentProgress !== undefined && (
                                <div className="p-4 bg-primary/5 border border-primary/10 rounded-xl">
                                    <div className="text-center">
                                        <div className="text-3xl font-black text-primary">{student.currentProgress}%</div>
                                        <div className="text-xs font-bold uppercase opacity-50 tracking-widest">Current Course Completion</div>
                                    </div>
                                </div>
                            )}

                            {/* Actions Area */}
                            <div className="divider opacity-10">Admin Zone</div>
                            <div className="flex flex-col gap-2">
                                <button className="btn btn-sm btn-outline gap-2 w-full">
                                    <Mail size={14} /> Send Direct Message
                                </button>
                                <button className="btn btn-sm btn-ghost text-error hover:bg-error/10 gap-2 w-full">
                                    <ShieldAlert size={14} /> Ban / Un-enroll Student
                                </button>
                            </div>

                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};