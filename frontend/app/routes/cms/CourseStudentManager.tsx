import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { 
    Search, 
    Filter, 
    Mail, 
    Download,
    Loader2,
    X,
    Send,
    Users,
    RefreshCw
} from "lucide-react";
import type { Student } from "~/types/students";
import { StudentTable } from "~/components/cms/student/StudentTable";
import { StudentDrawer } from "~/components/cms/student/StudentDrawer";
import { useCourseStudents } from "~/hooks/instructor/useCourseStudents";
import { useMessageAllStudents, useMessageStudent } from "~/hooks/instructor/useMessageStudents";

export const meta = () => {
  return [
    { title: "Students | EduNexus" },
    { name: "description", content: "Students Page" },
  ];
};

export default function CourseStudentManager() {
    const { id: courseId } = useParams();
    const navigate = useNavigate();
    const { data: students, isLoading, isError, refetch } = useCourseStudents(courseId);
    const messageAllMutation = useMessageAllStudents();
    const messageStudentMutation = useMessageStudent();

    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    
    // Message modal state
    const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
    const [messageMode, setMessageMode] = useState<'all' | 'individual'>('all');
    const [selectedMessageStudent, setSelectedMessageStudent] = useState<Student | null>(null);
    const [messageSubject, setMessageSubject] = useState("");
    const [messageBody, setMessageBody] = useState("");

    const isSending = messageAllMutation.isPending || messageStudentMutation.isPending;

    // Filter students based on search query
    const filteredStudents = (students || []).filter(student => 
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Export CSV functionality
    const handleExportCSV = () => {
        const headers = ['Name', 'Email', 'Joined Date', 'Progress', 'Status', 'Last Active'];
        const csvContent = [
            headers.join(','),
            ...filteredStudents.map(student => [
                `"${student.name}"`,
                `"${student.email}"`,
                `"${student.joinedDate}"`,
                `${student.currentProgress || 0}%`,
                `"${student.status || 'N/A'}"`,
                `"${student.lastActive || 'N/A'}"`
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `students-course-${courseId}-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Open message modal for all students
    const handleMessageAll = () => {
        setMessageMode('all');
        setSelectedMessageStudent(null);
        setMessageSubject("");
        setMessageBody("");
        setIsMessageModalOpen(true);
    };

    // Open message modal for individual student
    const handleMessageStudent = (student: Student) => {
        setMessageMode('individual');
        setSelectedMessageStudent(student);
        setMessageSubject("");
        setMessageBody("");
        setIsMessageModalOpen(true);
    };

    // Send message using mutation hooks
    const handleSendMessage = async () => {
        if (!messageSubject.trim() || !messageBody.trim() || !courseId) return;
        
        try {
            if (messageMode === 'all') {
                await messageAllMutation.mutateAsync({
                    courseId,
                    subject: messageSubject,
                    message: messageBody,
                });
            } else if (messageMode === 'individual' && selectedMessageStudent) {
                await messageStudentMutation.mutateAsync({
                    studentId: selectedMessageStudent.id,
                    subject: messageSubject,
                    message: messageBody,
                });
            }
            
            // Close modal and reset
            setIsMessageModalOpen(false);
            setMessageSubject("");
            setMessageBody("");
        } catch (error) {
            console.error('Failed to send message:', error);
            alert('Failed to send message. Please try again.');
        }
    };

    // Close message modal
    const closeMessageModal = () => {
        setIsMessageModalOpen(false);
        setMessageSubject("");
        setMessageBody("");
        setSelectedMessageStudent(null);
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="min-h-screen p-4 lg:p-8 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="animate-spin text-primary" size={48} />
                    <p className="text-base-content/60">Loading students...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (isError) {
        return (
            <div className="min-h-screen p-4 lg:p-8 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4 text-center">
                    <div className="w-16 h-16 rounded-full bg-error/10 flex items-center justify-center">
                        <RefreshCw size={28} className="text-error" />
                    </div>
                    <h3 className="font-black text-lg">Failed to load students</h3>
                    <p className="text-sm opacity-60 max-w-xs">Could not fetch student data for this course.</p>
                    <button onClick={() => refetch()} className="btn btn-primary btn-sm gap-2">
                        <RefreshCw size={14} /> Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-4 lg:p-8">
            {/* Header with Context Switcher */}
            <div className="flex flex-col gap-4 mb-8">
                <div className="text-sm font-bold opacity-40 uppercase tracking-widest">Course Manager</div>
                <div className="flex items-center gap-2">
                    <h1 className="text-3xl font-black">Student Management</h1>
                </div>
            </div>

            {/* Filter Toolbar */}
            <div className="flex items-center justify-between gap-2 max-md:flex-col-reverse max-md:items-end mb-4">
                <div className="md:col-span-2 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 opacity-40" size={16} />
                    <input 
                        type="text" 
                        placeholder="Search by name or email..." 
                        className="input input-sm input-bordered w-full pl-10 rounded-lg"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                
                <div className="flex justify-end gap-2">
                    <div className="flex gap-2">
                        <button 
                            className="btn btn-ghost btn-sm gap-2 border border-base-content/10"
                            onClick={handleExportCSV}
                        >
                            <Download size={14} /> Export CSV
                        </button>
                        <button 
                            className="btn btn-primary btn-sm gap-2 shadow-lg shadow-primary/20"
                            onClick={handleMessageAll}
                        >
                            <Mail size={14} /> Message All
                        </button>
                    </div>

                    <div className="flex gap-2">
                        <select className="select select-sm select-bordered font-bold text-xs uppercase bg-primary">
                            <option>All Status</option>
                            <option>At Risk (&lt; 20%)</option>
                            <option>Completed</option>
                        </select>
                        <button className="btn btn-sm btn-square btn-ghost border border-base-content/20">
                            <Filter size={16} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Reusable Table in 'Course' Mode */}
            <StudentTable 
                students={filteredStudents} 
                mode="course" 
                onSelectStudent={setSelectedStudent}
                onMessageStudent={handleMessageStudent}
            />

            {/* Shared Drawer */}
            <StudentDrawer 
                student={selectedStudent} 
                onClose={() => setSelectedStudent(null)} 
            />

            {/* Message Modal */}
            {isMessageModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-base-100 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-base-content/10">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                    {messageMode === 'all' ? (
                                        <Users size={20} className="text-primary" />
                                    ) : (
                                        <Mail size={20} className="text-primary" />
                                    )}
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">
                                        {messageMode === 'all' ? 'Message All Students' : `Message ${selectedMessageStudent?.name}`}
                                    </h3>
                                    <p className="text-xs text-base-content/60">
                                        {messageMode === 'all' 
                                            ? `${filteredStudents.length} students will receive this message` 
                                            : selectedMessageStudent?.email}
                                    </p>
                                </div>
                            </div>
                            <button 
                                className="btn btn-ghost btn-sm btn-square"
                                onClick={closeMessageModal}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-4 space-y-4">
                            <div>
                                <label className="label text-sm font-medium">Subject</label>
                                <input
                                    type="text"
                                    className="input input-bordered w-full"
                                    placeholder="Enter message subject..."
                                    value={messageSubject}
                                    onChange={(e) => setMessageSubject(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="label text-sm font-medium">Message</label>
                                <textarea
                                    className="textarea textarea-bordered w-full min-h-[150px]"
                                    placeholder="Type your message here..."
                                    value={messageBody}
                                    onChange={(e) => setMessageBody(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-end gap-2 p-4 border-t border-base-content/10 bg-base-200/30">
                            <button 
                                className="btn btn-ghost"
                                onClick={closeMessageModal}
                            >
                                Cancel
                            </button>
                            <button 
                                className="btn btn-primary gap-2"
                                onClick={handleSendMessage}
                                disabled={!messageSubject.trim() || !messageBody.trim() || isSending}
                            >
                                {isSending ? (
                                    <>
                                        <Loader2 size={16} className="animate-spin" />
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        <Send size={16} />
                                        Send Message
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}