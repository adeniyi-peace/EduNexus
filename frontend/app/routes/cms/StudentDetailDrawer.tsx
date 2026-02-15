import { X, Mail, Calendar, BarChart3, Award } from "lucide-react";
import { useEffect, useState } from "react";

interface DrawerProps {
    student: any;
    onClose: () => void;
}

export const StudentDetailDrawer = ({ student, onClose }: DrawerProps) => {
    const [isOpen, setIsOpen] = useState(false);

    // Handle animation state based on prop
    useEffect(() => {
        if (student) setIsOpen(true);
        else {
            const timer = setTimeout(() => setIsOpen(false), 300); // Wait for anim
            return () => clearTimeout(timer);
        }
    }, [student]);

    if (!student && !isOpen) return null;

    return (
        <div className={`fixed inset-0 z-50 overflow-hidden ${student ? 'pointer-events-auto' : 'pointer-events-none'}`}>
            {/* Backdrop */}
            <div 
                className={`absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity duration-300 ${student ? 'opacity-100' : 'opacity-0'}`}
                onClick={onClose}
            />

            {/* Panel */}
            <div className={`absolute inset-y-0 right-0 w-full max-w-md bg-base-100 shadow-2xl transform transition-transform duration-300 ease-out border-l border-base-content/10 ${student ? 'translate-x-0' : 'translate-x-full'}`}>
                {student && (
                    <div className="h-full flex flex-col">
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
                                    <p className="text-sm opacity-60 flex items-center gap-1">
                                        <Mail size={12} /> {student.email}
                                    </p>
                                    <div className="mt-2 flex gap-2">
                                        <button className="btn btn-xs btn-primary">Message</button>
                                        <button className="btn btn-xs btn-ghost border border-base-content/20">Edit Access</button>
                                    </div>
                                </div>
                            </div>
                            <button onClick={onClose} className="btn btn-circle btn-sm btn-ghost">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Content Scroll */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            
                            {/* High Level Stats */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-base-200 rounded-xl">
                                    <div className="text-xs opacity-50 uppercase font-bold mb-1 flex items-center gap-1">
                                        <BarChart3 size={12} /> Course Progress
                                    </div>
                                    <div className="text-2xl font-black text-primary">{student.progress}%</div>
                                    <progress className="progress progress-primary w-full h-1 mt-2" value={student.progress} max="100"></progress>
                                </div>
                                <div className="p-4 bg-base-200 rounded-xl">
                                    <div className="text-xs opacity-50 uppercase font-bold mb-1 flex items-center gap-1">
                                        <Award size={12} /> Quiz Average
                                    </div>
                                    <div className="text-2xl font-black text-secondary">88%</div>
                                    <div className="text-[10px] opacity-60 mt-1">Top 15% of class</div>
                                </div>
                            </div>

                            {/* Timeline / Activity */}
                            <div>
                                <h3 className="font-bold text-sm uppercase opacity-50 mb-4">Recent Activity</h3>
                                <ol className="relative border-l border-base-content/10 ml-2">                  
                                    <li className="mb-6 ml-6">
                                        <div className="absolute w-3 h-3 bg-primary rounded-full -left-1.5 border border-base-100"></div>
                                        <time className="mb-1 text-xs font-normal opacity-50">Just now</time>
                                        <h3 className="text-sm font-bold">Completed Lesson: "React Hooks"</h3>
                                        <p className="text-xs opacity-60 mt-1">Score: 100% on Quiz</p>
                                    </li>
                                    <li className="mb-6 ml-6">
                                        <div className="absolute w-3 h-3 bg-base-content/20 rounded-full -left-1.5 border border-base-100"></div>
                                        <time className="mb-1 text-xs font-normal opacity-50">2 days ago</time>
                                        <h3 className="text-sm font-bold">Started Module: "Advanced State"</h3>
                                    </li>
                                    <li className="ml-6">
                                        <div className="absolute w-3 h-3 bg-base-content/20 rounded-full -left-1.5 border border-base-100"></div>
                                        <time className="mb-1 text-xs font-normal opacity-50">{student.joined}</time>
                                        <h3 className="text-sm font-bold">Enrolled in Course</h3>
                                    </li>
                                </ol>
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="p-4 border-t border-base-content/10 bg-base-100 flex justify-between items-center">
                            <span className="text-xs opacity-50">User ID: {student.id}</span>
                            <button className="btn btn-error btn-sm btn-ghost text-error">Un-enroll Student</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};