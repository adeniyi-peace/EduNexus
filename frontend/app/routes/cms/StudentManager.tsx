import { useState } from "react";
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
    UserX
} from "lucide-react";
import { StudentDetailDrawer } from "./StudentDetailDrawer";

// Mock Data
const MOCK_STUDENTS = [
    { id: 1, name: "Alice Johnson", email: "alice@example.com", avatar: "https://i.pravatar.cc/150?u=1", progress: 75, lastActive: "2 hours ago", status: "Active", joined: "Oct 24, 2025" },
    { id: 2, name: "Bob Smith", email: "bob@example.com", avatar: "https://i.pravatar.cc/150?u=2", progress: 12, lastActive: "5 days ago", status: "At Risk", joined: "Nov 01, 2025" },
    { id: 3, name: "Charlie Brown", email: "charlie@example.com", avatar: "https://i.pravatar.cc/150?u=3", progress: 100, lastActive: "1 week ago", status: "Completed", joined: "Sep 15, 2025" },
];

export default function StudentManager() {
    const [selectedCourse, setSelectedCourse] = useState("Complete Python Bootcamp");
    const [selectedStudent, setSelectedStudent] = useState<any>(null);
    const [searchQuery, setSearchQuery] = useState("");

    // Filter Logic (Simple implementation)
    const filteredStudents = MOCK_STUDENTS.filter(s => 
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        s.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex flex-col h-[calc(100vh-64px)] bg-base-200/50">
            
            {/* --- TOP HEADER (Context Switcher) --- */}
            <div className="border-b border-base-content/10 px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl font-black tracking-tight flex items-center gap-2">
                        Students in 
                        <span className="text-primary dropdown dropdown-bottom dropdown-end">
                            <label tabIndex={0} className="cursor-pointer hover:underline decoration-dashed underline-offset-4 flex items-center gap-1">
                                {selectedCourse} <ChevronDown size={16} />
                            </label>
                            {/* Course Switcher Dropdown */}
                            <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow-xl bg-base-100 rounded-box w-64 mt-2">
                                <li><a onClick={() => setSelectedCourse("Complete Python Bootcamp")}>Python Bootcamp</a></li>
                                <li><a onClick={() => setSelectedCourse("Advanced React Patterns")}>Advanced React</a></li>
                            </ul>
                        </span>
                    </h1>
                    <p className="text-sm opacity-60">Manage enrollment, track progress, and grade assignments.</p>
                </div>
                <div className="flex gap-2">
                    <button className="btn btn-ghost btn-sm gap-2 border border-base-content/10">
                        <Download size={14} /> Export CSV
                    </button>
                    <button className="btn btn-primary btn-sm gap-2 shadow-lg shadow-primary/20">
                        <Mail size={14} /> Message All
                    </button>
                </div>
            </div>

            {/* --- FILTERS & STATS --- */}
            <div className="px-6 py-4 grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Search */}
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
                {/* Quick Filters */}
                <div className="flex gap-2">
                    <select className="select select-sm select-bordered w-full text-xs font-bold uppercase tracking-wide">
                        <option>All Status</option>
                        <option>Active</option>
                        <option>Completed</option>
                        <option>At Risk</option>
                    </select>
                </div>
            </div>

            {/* --- STUDENT LIST (Scrollable) --- */}
            <div className="flex-1 overflow-auto px-6 pb-6">
                <div className="bg-base-100 rounded-xl border border-base-content/5 shadow-sm overflow-hidden min-w-[800px]">
                    <table className="table w-full">
                        <thead className="bg-base-200/50 text-[10px] uppercase font-black tracking-widest text-base-content/50">
                            <tr>
                                <th className="pl-6 py-4">Student</th>
                                <th>Progress</th>
                                <th>Status</th>
                                <th>Last Active</th>
                                <th className="text-right pr-6">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-base-content/5">
                            {filteredStudents.map((student) => (
                                <tr 
                                    key={student.id} 
                                    onClick={() => setSelectedStudent(student)}
                                    className="hover:bg-base-200/40 transition-colors cursor-pointer group"
                                >
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
                                    <td className="w-1/4">
                                        <div className="flex flex-col gap-1.5">
                                            <div className="flex justify-between text-xs font-bold">
                                                <span className={student.progress === 100 ? "text-success" : ""}>{student.progress}%</span>
                                            </div>
                                            <progress 
                                                className={`progress w-full h-2 ${
                                                    student.progress === 100 ? 'progress-success' : 
                                                    student.progress < 20 ? 'progress-error' : 'progress-primary'
                                                }`} 
                                                value={student.progress} 
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
                                    <td className="pr-6 text-right" onClick={(e) => e.stopPropagation()}>
                                        <div className="dropdown dropdown-left dropdown-bottom">
                                            <label tabIndex={0} className="btn btn-ghost btn-xs btn-square">
                                                <MoreVertical size={16} />
                                            </label>
                                            <ul tabIndex={0} className="dropdown-content z-50 menu p-2 shadow-xl bg-base-100 rounded-box w-48 border border-base-content/10">
                                                <li><a onClick={() => setSelectedStudent(student)}>View Progress Detail</a></li>
                                                <li><a>Message Student</a></li>
                                                <div className="divider my-1"></div>
                                                <li><a className="text-warning">Reset Progress</a></li>
                                                <li><a className="text-error"><UserX size={14} /> Un-enroll Student</a></li>
                                            </ul>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* --- SLIDE-OVER DRAWER --- */}
            <StudentDetailDrawer 
                student={selectedStudent} 
                onClose={() => setSelectedStudent(null)} 
            />
        </div>
    );
};