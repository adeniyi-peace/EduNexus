import { motion } from "framer-motion";
import { MoreVertical, CheckCircle2, Clock, BookOpen, Mail } from "lucide-react";
import type { Student } from "~/types/students";

interface StudentTableProps {
    students: Student[];
    mode: 'global' | 'course'; // Determines which columns to show
    onSelectStudent: (student: Student) => void;
}

export const StudentTable = ({ students, mode, onSelectStudent }: StudentTableProps) => {
    return (
        <div className="rounded-2xl border border-base-content/5 shadow-sm overflow-hidden">
            <table className="table w-full">
                {/* Header */}
                <thead className="bg-base-200/50 text-[10px] uppercase font-black tracking-widest text-base-content/50">
                    <tr>
                        <th className="pl-6 py-4">Student Name</th>
                        
                        {mode === 'global' ? (
                            <>
                                <th>Courses</th>
                                <th>Total Spent</th>
                                <th>Joined</th>
                            </>
                        ) : (
                            <>
                                <th>Progress</th>
                                <th>Status</th>
                                <th>Last Active</th>
                            </>
                        )}
                        
                        <th className="text-right pr-6">Actions</th>
                    </tr>
                </thead>

                {/* Body */}
                <tbody className="divide-y divide-base-content/5">
                    {students.map((student, index) => (
                        <motion.tr 
                            key={student.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            onClick={() => onSelectStudent(student)}
                            className="hover:bg-base-200/40 transition-colors cursor-pointer group"
                        >
                            {/* 1. Name Column */}
                            <td className="pl-6 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="avatar">
                                        <div className="w-10 rounded-full ring ring-base-content/5 ring-offset-2 ring-offset-base-100">
                                            <img src={student.avatar} alt={student.name} />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="font-bold text-sm">{student.name}</div>
                                        <div className="text-xs opacity-50">{student.email}</div>
                                    </div>
                                </div>
                            </td>

                            {/* 2. Middle Columns (Dynamic) */}
                            {mode === 'global' ? (
                                <>
                                    <td>
                                        <div className="badge badge-neutral font-bold badge-sm gap-2">
                                            <BookOpen size={10} /> {student.enrolledCoursesCount} Courses
                                        </div>
                                    </td>
                                    <td className="font-mono text-sm opacity-70">
                                        ${student.totalSpent?.toFixed(2)}
                                    </td>
                                    <td className="text-xs opacity-50 font-bold">{student.joinedDate}</td>
                                </>
                            ) : (
                                <>
                                    <td className="w-1/4">
                                        <div className="flex flex-col gap-1.5 max-w-35">
                                            <div className="flex justify-between text-[10px] font-bold uppercase">
                                                <span>Progress</span>
                                                <span className={student.currentProgress === 100 ? "text-success" : ""}>
                                                    {student.currentProgress}%
                                                </span>
                                            </div>
                                            <progress 
                                                className={`progress w-full h-1.5 ${
                                                    student.currentProgress === 100 ? 'progress-success' : 
                                                    (student.currentProgress || 0) < 20 ? 'progress-error' : 'progress-primary'
                                                }`} 
                                                value={student.currentProgress} 
                                                max="100"
                                            ></progress>
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`badge badge-sm font-bold gap-1 ${
                                            student.status === 'Completed' ? 'badge-success badge-outline' :
                                            student.status === 'At Risk' ? 'badge-error badge-outline' : 'badge-ghost'
                                        }`}>
                                            {student.status === 'Completed' && <CheckCircle2 size={10} />}
                                            {student.status}
                                        </span>
                                    </td>
                                    <td className="text-xs font-mono opacity-60">
                                        <div className="flex items-center gap-1">
                                            <Clock size={12} /> {student.lastActive}
                                        </div>
                                    </td>
                                </>
                            )}

                            {/* 3. Actions Column */}
                            <td className="pr-6 text-right">
                                <button className="btn btn-ghost btn-sm btn-square opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Mail size={16} />
                                </button>
                                <button className="btn btn-ghost btn-sm btn-square">
                                    <MoreVertical size={16} />
                                </button>
                            </td>
                        </motion.tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};