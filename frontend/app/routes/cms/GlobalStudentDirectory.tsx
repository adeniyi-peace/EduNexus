import { useState } from "react";
import { useLoaderData } from "react-router";
import { Search, Download, Users, Loader2 } from "lucide-react";
import type { Student } from "~/types/students";
import { StudentTable } from "~/components/cms/student/StudentTable";
import { StudentDrawer } from "~/components/cms/student/StudentDrawer";
import api from "~/utils/api.client";
import type { Route } from "./+types/GlobalStudentDirectory";

// Client loader - fetches global students data
export async function clientLoader({}: Route.ClientLoaderArgs) {
    try {
        const response = await api.get(`/users/instructor/students/`);
        return { students: response.data.students as Student[] };
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
    const { students } = useLoaderData<typeof clientLoader>();
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    const filteredStudents = (students || []).filter(s => 
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        s.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Export CSV functionality
    const handleExportCSV = () => {
        const headers = ['Name', 'Email', 'Joined Date', 'Courses Count', 'Total Spent'];
        const csvContent = [
            headers.join(','),
            ...filteredStudents.map(student => [
                `"${student.name}"`,
                `"${student.email}"`,
                `"${student.joinedDate}"`,
                `${student.enrolledCoursesCount || 0}`,
                `${student.totalSpent?.toFixed(2) || '0.00'}`
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `all-students-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

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
                <button 
                    className="btn btn-outline btn-sm gap-2"
                    onClick={handleExportCSV}
                >
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