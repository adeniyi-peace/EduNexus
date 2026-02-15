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
import type { Student } from "~/types/students";
import { StudentTable } from "~/components/cms/student/StudentTable";
import { StudentDrawer } from "~/components/cms/student/StudentDrawer";

// Mock Data for Course View
const COURSE_STUDENTS_MOCK: Student[] = [
    { 
        id: "1", name: "Alice Johnson", email: "alice@demo.com", avatar: "https://i.pravatar.cc/150?u=1", joinedDate: "Oct 24",
        currentProgress: 75, status: 'Active', lastActive: "2h ago",
        // Note: We populate this list so the drawer still works if clicked
        enrolledCoursesList: [{ id: "101", title: "Python Bootcamp", progress: 75, lastAccessed: "2h ago" }]
    },
    { 
        id: "3", name: "Charlie Brown", email: "charlie@demo.com", avatar: "https://i.pravatar.cc/150?u=3", joinedDate: "Sep 15",
        currentProgress: 12, status: 'At Risk', lastActive: "2w ago",
        enrolledCoursesList: [{ id: "101", title: "Python Bootcamp", progress: 12, lastAccessed: "2w ago" }]
    },
];

export default function CourseStudentManager() {
    const [selectedCourse, setSelectedCourse] = useState("Python Bootcamp");
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    return (
        <div className="min-h-screen">
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
                        <button className="btn btn-ghost btn-sm gap-2 border border-base-content/10">
                            <Download size={14} /> Export CSV
                        </button>
                        <button className="btn btn-primary btn-sm gap-2 shadow-lg shadow-primary/20">
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
                students={COURSE_STUDENTS_MOCK} 
                mode="course" 
                onSelectStudent={setSelectedStudent} 
            />

            {/* Shared Drawer */}
            <StudentDrawer 
                student={selectedStudent} 
                onClose={() => setSelectedStudent(null)} 
            />
        </div>
    );
}