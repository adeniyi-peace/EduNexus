import { useState } from "react";
import { useLoaderData, useNavigate } from "react-router";
import { 
    Search, 
    Filter, 
    MoreVertical, 
    Mail, 
    Ban, 
    CheckCircle2, 
    Clock, 
    ChevronDown, 
    Download,
    UserX,
    Loader2,
    AlertCircle,
    X,
    Send,
    Users
} from "lucide-react";
import type { Student } from "~/types/students";
import { StudentTable } from "~/components/cms/student/StudentTable";
import { StudentDrawer } from "~/components/cms/student/StudentDrawer";
import api from "~/utils/api.client";
import type { Route } from "./+types/CourseStudentManager";

// Client loader - fetches data on the client side
export async function clientLoader({ params }: Route.ClientLoaderArgs) {
    const courseId = params.id;
    
    if (!courseId) {
        throw new Response("Course ID is required", { status: 400 });
    }
    
    try {
        const response = await api.get(`/users/instructor/courses/${courseId}/students/`);
        return { students: response.data.students as Student[], courseId };
    } catch (error) {
        throw new Response("Failed to load students", { status: 500 });
    }
}

// Loading state shown while clientLoader fetches
export function HydrateFallback() {
    return (
        <div className="min-h-screen p-4 lg:p-8 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <Loader2 className="animate-spin text-primary" size={48} />
                <p className="text-base-content/60">Loading students...</p>
            </div>
        </div>
    );
}

export default function CourseStudentManager() {
    const { students, courseId } = useLoaderData<typeof clientLoader>();
    const navigate = useNavigate();
    const [selectedCourse, setSelectedCourse] = useState("Python Bootcamp");
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    
    // Message modal state
    const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
    const [messageMode, setMessageMode] = useState<'all' | 'individual'>('all');
    const [selectedMessageStudent, setSelectedMessageStudent] = useState<Student | null>(null);
    const [messageSubject, setMessageSubject] = useState("");
    const [messageBody, setMessageBody] = useState("");
    const [isSending, setIsSending] = useState(false);

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
        link.download = `students-${selectedCourse.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.csv`;
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

    // Send message
    const handleSendMessage = async () => {
        if (!messageSubject.trim() || !messageBody.trim()) return;
        
        setIsSending(true);
        try {
            if (messageMode === 'all') {
                // Send to all students in course
                await api.post(`/users/instructor/courses/${courseId}/message-all/`, {
                    subject: messageSubject,
                    message: messageBody
                });
            } else if (messageMode === 'individual' && selectedMessageStudent) {
                // Send to individual student
                await api.post(`/users/instructor/message-student/`, {
                    student_id: selectedMessageStudent.id,
                    subject: messageSubject,
                    message: messageBody
                });
            }
            
            // Close modal and reset
            setIsMessageModalOpen(false);
            setMessageSubject("");
            setMessageBody("");
        } catch (error) {
            console.error('Failed to send message:', error);
            alert('Failed to send message. Please try again.');
        } finally {
            setIsSending(false);
        }
    };

    // Close message modal
    const closeMessageModal = () => {
        setIsMessageModalOpen(false);
        setMessageSubject("");
        setMessageBody("");
        setSelectedMessageStudent(null);
    };

    return (
        <div className="min-h-screen p-4 lg:p-8">
            {/* Header with Context Switcher */}
            <div className="flex flex-col gap-4 mb-8">
                <div className="text-sm font-bold opacity-40 uppercase tracking-widest">Course Manager</div>
                <div className="flex items-center gap-2">
                    <h1 className="text-3xl font-black">Students in</h1>
                    <div className="dropdown dropdown-bottom">
                        <label tabIndex={0} className="btn btn-lg btn-ghost text-3xl font-black text-primary px-2 min-h-0 h-auto normal-case underline decoration-dashed underline-offset-8">
                            {selectedCourse} <ChevronDown size={24} />
                        </label>
                        <ul tabIndex={0} className="dropdown-content z-1 menu p-2 shadow-xl rounded-box w-72 mt-2">
                            <li><a onClick={() => setSelectedCourse("Python Bootcamp")}>Python Bootcamp</a></li>
                            <li><a onClick={() => setSelectedCourse("React Masterclass")}>React Masterclass</a></li>
                        </ul>
                    </div>
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