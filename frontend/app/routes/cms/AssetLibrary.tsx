import { useState } from "react";
import { useNavigate } from "react-router";
import { Plus, AlertTriangle, Search, Loader2, RefreshCw } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { LibraryToolbar } from "~/components/cms/library/LibraryToolbar";
import { CourseCard } from "~/components/ui/CourseCard";
import { CourseRow } from "~/components/cms/library/CourseRow";
import { useInstructorLibrary, useDeleteCourse } from "~/hooks/instructor/useInstructorLibrary";
import type { InstructorLibraryCourse } from "~/types/instructor";

export default function InstructorLibrary() {
    const navigate = useNavigate();
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [searchQuery, setSearchQuery] = useState("");
    
    // Data Fetching
    const { data: courses, isLoading, isError, refetch } = useInstructorLibrary();
    const deleteMutation = useDeleteCourse();
    
    // Deletion Logic
    const [courseToDelete, setCourseToDelete] = useState<InstructorLibraryCourse | null>(null);

    const handleDeleteConfirm = async () => {
        if (courseToDelete) {
            try {
                await deleteMutation.mutateAsync(courseToDelete.id);
                setCourseToDelete(null);
            } catch (error) {
                console.error("Failed to delete course:", error);
                alert("Failed to delete course. Please try again.");
            }
        }
    };

    const handleEdit = (id: string) => {
        navigate(`/cms/builder/${id}`);
    };

    // Filter Logic
    const filteredCourses = (courses || []).filter(c => 
        c.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Loading State
    if (isLoading) {
        return (
            <div className="min-h-screen p-4 lg:p-8 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="animate-spin text-primary" size={48} />
                    <p className="text-base-content/60 font-medium">Loading library...</p>
                </div>
            </div>
        );
    }

    // Error State
    if (isError) {
        return (
            <div className="min-h-screen p-4 lg:p-8 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4 text-center">
                    <div className="w-16 h-16 rounded-full bg-error/10 flex items-center justify-center">
                        <RefreshCw size={28} className="text-error" />
                    </div>
                    <h3 className="font-black text-lg">Failed to load library</h3>
                    <p className="text-sm opacity-60">Something went wrong while fetching your courses.</p>
                    <button onClick={() => refetch()} className="btn btn-primary btn-sm gap-2">
                        <RefreshCw size={14} /> Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-4 lg:p-8 animate-in fade-in duration-500">
            
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-base-content uppercase">Course_<span className="text-primary">Library</span></h1>
                    <p className="text-sm opacity-60 mt-1">Manage your curriculum content and assets.</p>
                </div>
                <button 
                    onClick={() => navigate("/cms/builder")}
                    className="btn btn-primary gap-2 shadow-lg shadow-primary/20 hover:scale-105 transition-transform rounded-2xl"
                >
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
                    <div className="flex flex-col items-center justify-center py-40 opacity-50 bg-base-200/50 rounded-[3rem] border-2 border-dashed border-base-content/5">
                        <div className="w-20 h-20 bg-base-300 rounded-full flex items-center justify-center mb-4">
                            <Search size={32} />
                        </div>
                        <h3 className="font-black text-lg uppercase tracking-tight">No courses found</h3>
                        <p className="text-sm">Try adjusting your search terms or create a new course.</p>
                    </div>
                ) : viewMode === "grid" ? (
                    // Grid View
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredCourses.map((course) => (
                            <CourseCard 
                                key={course.id} 
                                // @ts-ignore - mapping compatibility
                                course={course}
                                onEdit={handleEdit} 
                                isInstructorView={true}
                                onDelete={(course) => setCourseToDelete(course as any)} 
                            />
                        ))}
                    </div>
                ) : (
                    // List View
                    <div className="rounded-[2.5rem] border border-base-content/5 shadow-xs overflow-hidden bg-base-100">
                        <table className="table w-full">
                            <thead className="bg-base-200/50 text-xs uppercase font-black text-base-content/40 border-b border-base-content/5">
                                <tr>
                                    <th className="py-6 pl-8">Course Details</th>
                                    <th>Status</th>
                                    <th>Performance</th>
                                    <th className="text-right pr-8">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredCourses.map((course) => (
                                    <CourseRow 
                                        key={course.id} 
                                        // @ts-ignore - mapping compatibility
                                        course={course} 
                                        onEdit={handleEdit} 
                                        onDelete={() => setCourseToDelete(course)} 
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
                    <div className="modal-box rounded-[2.5rem] border border-base-content/10 shadow-2xl p-8">
                        <div className="flex flex-col items-center text-center gap-4">
                            <div className="w-20 h-20 rounded-3xl bg-error/10 flex items-center justify-center text-error animate-bounce">
                                <AlertTriangle size={40} />
                            </div>
                            <h3 className="font-black text-2xl uppercase tracking-tight">Delete_Course?</h3>
                            <p className="py-2 text-sm opacity-60 leading-relaxed">
                                You are about to initiate deletion for <span className="font-black text-base-content underline decoration-error/30">{courseToDelete.title}</span>. 
                                <br/><br/>
                                <span className="text-error font-black uppercase text-[10px] bg-error/10 px-2 py-1 rounded">Critical Warning</span>
                                <br/>
                                This action is irreversible and will purge all student records.
                            </p>
                            <div className="modal-action w-full flex gap-3 mt-6">
                                <button className="btn flex-1 rounded-2xl font-black uppercase text-xs" onClick={() => setCourseToDelete(null)}>Abort</button>
                                <button 
                                    className="btn btn-error flex-1 rounded-2xl font-black uppercase text-xs shadow-lg shadow-error/20" 
                                    onClick={handleDeleteConfirm}
                                    disabled={deleteMutation.isPending}
                                >
                                    {deleteMutation.isPending ? <Loader2 className="animate-spin" size={16} /> : "Execute Delete"}
                                </button>
                            </div>
                        </div>
                    </div>
                    <form method="dialog" className="modal-backdrop bg-base-300/60 backdrop-blur-md">
                        <button onClick={() => setCourseToDelete(null)}>close</button>
                    </form>
                </dialog>
            )}
        </div>
    );
}