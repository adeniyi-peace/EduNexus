import { useState } from "react";
import { Search, Download, Users } from "lucide-react";
import type { Student } from "~/types/students";
import { StudentTable } from "~/components/cms/student/StudentTable";
import { StudentDrawer } from "~/components/cms/student/StudentDrawer";

// Mock Data for Global View
const GLOBAL_STUDENTS_MOCK: Student[] = [
    { 
        id: "1", name: "Alice Johnson", email: "alice@demo.com", avatar: "https://i.pravatar.cc/150?u=1", joinedDate: "Oct 2025", 
        totalSpent: 129.99, enrolledCoursesCount: 3,
        enrolledCoursesList: [
            { id: "101", title: "Python Bootcamp", progress: 75, lastAccessed: "2h ago" },
            { id: "102", title: "React Masterclass", progress: 10, lastAccessed: "1w ago" },
            { id: "103", title: "UI Design", progress: 0, lastAccessed: "Never" }
        ]
    },
    { 
        id: "2", name: "Bob Smith", email: "bob@demo.com", avatar: "https://i.pravatar.cc/150?u=2", joinedDate: "Nov 2025", 
        totalSpent: 49.99, enrolledCoursesCount: 1,
        enrolledCoursesList: [
            { id: "101", title: "Python Bootcamp", progress: 100, lastAccessed: "1d ago" }
        ]
    },
];

export default function GlobalStudentDirectory() {
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    const filteredStudents = GLOBAL_STUDENTS_MOCK.filter(s => 
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        s.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen p-4 lg:p-8">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-black tracking-tight flex items-center gap-2">
                        <Users className="text-primary" /> All Students
                    </h1>
                    <p className="text-sm opacity-60">Directory of all students across all your courses.</p>
                </div>
                <button className="btn btn-outline btn-sm gap-2">
                    <Download size={14} /> Export CSV
                </button>
            </div>

            {/* Search Bar */}
            <div className="mb-6 relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 opacity-40" size={16} />
                <input 
                    type="text" 
                    placeholder="Search by name or email..." 
                    className="input input-bordered w-full pl-10 "
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {/* Reusable Table in 'Global' Mode */}
            <StudentTable 
                students={filteredStudents} 
                mode="global" 
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