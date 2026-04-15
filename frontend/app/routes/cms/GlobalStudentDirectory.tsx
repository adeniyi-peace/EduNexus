import { useState } from "react";
import { Search, Download, Users, Loader2, RefreshCw } from "lucide-react";
import type { Student } from "~/types/students";
import { StudentTable } from "~/components/cms/student/StudentTable";
import { StudentDrawer } from "~/components/cms/student/StudentDrawer";
import { useGlobalStudents } from "~/hooks/instructor/useGlobalStudents";

export const meta = () => {
  return [
    { title: "All Students | EduNexus" },
    { name: "description", content: "All Students Page" },
  ];
};

export default function GlobalStudentDirectory() {
    const { data: students, isLoading, isError, refetch } = useGlobalStudents();
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
                    <p className="text-sm opacity-60 max-w-xs">Could not fetch the global student directory.</p>
                    <button onClick={() => refetch()} className="btn btn-primary btn-sm gap-2">
                        <RefreshCw size={14} /> Try Again
                    </button>
                </div>
            </div>
        );
    }

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