import { useState } from "react";
import { Plus, AlertTriangle, Search } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import type { CourseData } from "~/types/course";
import { LibraryToolbar } from "~/components/cms/library/LibraryToolbar";
import { CourseCard } from "~/components/ui/CourseCard";
import { CourseRow } from "~/components/cms/library/CourseRow";

// Mock Data Source
const MOCK_DATA: CourseData[] = [
    { id: "1", title: "Complete Python Bootcamp 2026", thumbnail: "https://placehold.co/600x400/2a323c/a6adbb?text=Python", category: "Development", students: 1250, rating: 4.8, status: "Published", lastUpdated: "2d ago", price: 49.99 },
    { id: "2", title: "Advanced React Patterns", thumbnail: "https://placehold.co/600x400/2a323c/a6adbb?text=React", category: "Frontend", students: 850, rating: 4.9, status: "Draft", lastUpdated: "1w ago", price: 59.99 },
    { id: "3", title: "UI/UX Design Masterclass", thumbnail: "https://placehold.co/600x400/2a323c/a6adbb?text=UI/UX", category: "Design", students: 0, rating: 0, status: "Archived", lastUpdated: "3mo ago", price: 29.99 },
];

export default function InstructorLibrary() {
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [searchQuery, setSearchQuery] = useState("");
    const [courses, setCourses] = useState(MOCK_DATA);
    
    // Deletion Logic
    const [courseToDelete, setCourseToDelete] = useState<CourseData | null>(null);

    const handleDeleteConfirm = () => {
        if (courseToDelete) {
            setCourses(prev => prev.filter(c => c.id !== courseToDelete.id));
            setCourseToDelete(null);
            // In real app: call API here
        }
    };

    const handleEdit = (id: string) => {
        console.log(`Maps to /instructor/course/${id}/edit`);
    };

    // Filter Logic
    const filteredCourses = courses.filter(c => 
        c.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen p-4 lg:p-8">
            
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-base-content">Course Library</h1>
                    <p className="text-sm opacity-60 mt-1">Manage your curriculum content and assets.</p>
                </div>
                <button className="btn btn-primary gap-2 shadow-lg shadow-primary/20 hover:scale-105 transition-transform">
                    <Plus size={18} />
                    <span>Create New Course</span>
                </button>
            </div>

            {/* Toolbar */}
            <LibraryToolbar 
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                viewMode={viewMode}
                setViewMode={setViewMode}
            />

            {/* Content Area */}
            <AnimatePresence mode="wait">
                {filteredCourses.length === 0 ? (
                    // Empty State
                    <div className="flex flex-col items-center justify-center py-20 opacity-50">
                        <div className="w-20 h-20 bg-base-300 rounded-full flex items-center justify-center mb-4">
                            <Search size={32} />
                        </div>
                        <h3 className="font-bold text-lg">No courses found</h3>
                        <p className="text-sm">Try adjusting your search terms.</p>
                    </div>
                ) : viewMode === "grid" ? (
                    // Grid View
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredCourses.map((course) => (
                            <CourseCard 
                                key={course.id} 
                                {...course} 
                                onEdit={handleEdit} 
                                isInstructorView={true}
                                onDelete={setCourseToDelete} 
                            />
                        ))}
                    </div>
                ) : (
                    // List View
                    <div className="rounded-2xl border border-base-content/5 shadow-xs overflow-hidden">
                        <table className="table w-full">
                            <thead className="bg-base-200/50 text-xs uppercase font-bold text-base-content/50">
                                <tr>
                                    <th className="py-4 pl-6">Course Details</th>
                                    <th>Status</th>
                                    <th>Performance</th>
                                    <th className="text-right pr-6">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredCourses.map((course) => (
                                    <CourseRow 
                                        key={course.id} 
                                        course={course} 
                                        onEdit={handleEdit} 
                                        onDelete={setCourseToDelete} 
                                    />
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </AnimatePresence>

            {/* Delete Confirmation Modal */}
            {courseToDelete && (
                <dialog className="modal modal-open">
                    <div className="modal-box">
                        <div className="flex flex-col items-center text-center gap-4">
                            <div className="w-16 h-16 rounded-full bg-error/10 flex items-center justify-center text-error">
                                <AlertTriangle size={32} />
                            </div>
                            <h3 className="font-bold text-lg">Delete this course?</h3>
                            <p className="py-2 text-sm opacity-70">
                                You are about to delete <span className="font-bold text-base-content">{courseToDelete.title}</span>. 
                                This action cannot be undone and all student progress will be lost.
                            </p>
                            <div className="modal-action w-full flex gap-2">
                                <button className="btn flex-1" onClick={() => setCourseToDelete(null)}>Cancel</button>
                                <button className="btn btn-error flex-1" onClick={handleDeleteConfirm}>Delete Forever</button>
                            </div>
                        </div>
                    </div>
                    <form method="dialog" className="modal-backdrop">
                        <button onClick={() => setCourseToDelete(null)}>close</button>
                    </form>
                </dialog>
            )}
        </div>
    );
}