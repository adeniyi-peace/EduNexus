import { useState, useMemo } from "react";
import { useLoaderData } from "react-router";
import { DUMMY_COURSES } from "~/utils/mockData";
import { CourseCard } from "~/components/ui/CourseCard";
import { CourseFilters } from "~/components/course/CourseFilters";

export async function loader() {
    return { courses: DUMMY_COURSES };
}

export default function CoursesPage() {
    const { courses } = useLoaderData<typeof loader>();
    
    // --- STATE ---
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    // --- LOGIC: FILTERING ---
    const filteredCourses = useMemo(() => {
        return courses.filter(course => {
            const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                 course.instructor.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = selectedCategory === "All" || course.category === selectedCategory;
            return matchesSearch && matchesCategory;
        });
    }, [courses, searchQuery, selectedCategory]);

    // --- LOGIC: PAGINATION ---
    const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedCourses = filteredCourses.slice(startIndex, startIndex + itemsPerPage);

    // Reset page to 1 when filters change
    const handleFilterChange = (cat: string) => {
        setSelectedCategory(cat);
        setCurrentPage(1);
    };

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        setCurrentPage(1);
    };

    const resetFilters = () => {
        setSearchQuery("");
        setSelectedCategory("All");
        setCurrentPage(1);
    };

    return (
        <div className="space-y-10 pb-20 animate-in fade-in duration-700">
            {/* Header Section */}
            <header className="mb-10">
                <div className="flex items-center gap-4 mb-2">
                    <span className="h-px w-12 bg-primary/30"></span>
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Library Catalog</span>
                </div>
                <h1 className="text-4xl font-black italic tracking-tight uppercase">Knowledge Nodes</h1>
                <p className="text-base-content/50 mt-2 font-medium">Access high-fidelity training modules across the Nexus.</p>
            </header>

            {/* Filters */}
            <div className="bg-base-100/40 backdrop-blur-md p-2 rounded-4xl border border-base-content/5">
                <CourseFilters 
                    categories={Array.from(new Set(courses.map(c => c.category)))} 
                    onSearch={handleSearch} 
                    onCategoryChange={handleFilterChange} 
                />
            </div>

            {/* Main Content Area */}
            {paginatedCourses.length > 0 ? (
                <div className="space-y-16">
                    {/* Course Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                        {paginatedCourses.map((course, idx) => (
                            <div 
                                key={course.id} 
                                className="animate-in zoom-in-95 duration-500 fill-mode-both"
                                style={{ animationDelay: `${idx * 50}ms` }}
                            >
                                <CourseCard {...course} />
                            </div>
                        ))}
                    </div>

                    {/* --- SOPHISTICATED PAGINATION UI --- */}
                    <div className="flex flex-col items-center gap-6 pt-10 border-t border-base-content/5">
                        <div className="flex items-center gap-2">
                            {/* Previous Button */}
                            <button 
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="btn btn-ghost btn-square rounded-2xl border border-base-content/5 hover:border-primary/50 disabled:opacity-10 group"
                            >
                                <span className="group-hover:-translate-x-1 transition-transform">←</span>
                            </button>

                            {/* Page Numbers */}
                            <div className="flex items-center gap-2 bg-base-200/50 p-1.5 rounded-3xl border border-base-content/5">
                                {[...Array(totalPages)].map((_, i) => {
                                    const pageNum = i + 1;
                                    const isActive = currentPage === pageNum;
                                    return (
                                        <button
                                            key={pageNum}
                                            onClick={() => setCurrentPage(pageNum)}
                                            className={`
                                                w-10 h-10 rounded-xl font-mono text-xs font-black transition-all duration-300
                                                ${isActive 
                                                    ? "bg-primary text-black shadow-[0_0_20px_rgba(var(--p),0.4)] scale-110 z-10" 
                                                    : "hover:bg-base-content/10 opacity-40 hover:opacity-100 active:scale-90"
                                                }
                                            `}
                                        >
                                            {pageNum < 10 ? `0${pageNum}` : pageNum}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Next Button */}
                            <button 
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="btn btn-ghost btn-square rounded-2xl border border-base-content/5 hover:border-primary/50 disabled:opacity-10 group"
                            >
                                <span className="group-hover:translate-x-1 transition-transform">→</span>
                            </button>
                        </div>

                        {/* Status Label */}
                        <p className="text-[9px] font-mono font-black uppercase tracking-[0.2em] opacity-30">
                            Showing {startIndex + 1}—{Math.min(startIndex + itemsPerPage, filteredCourses.length)} of {filteredCourses.length} results
                        </p>
                    </div>
                </div>
            ) : (
                /* Empty State */
                <div className="flex flex-col items-center justify-center py-32 bg-base-200/30 rounded-[3rem] border border-dashed border-base-content/10 animate-in fade-in zoom-in-95">
                    <div className="relative mb-8">
                        <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full"></div>
                        <div className="relative w-20 h-20 bg-base-100 rounded-3xl flex items-center justify-center text-3xl border border-base-content/5 shadow-inner">
                            🔭
                        </div>
                    </div>
                    <h3 className="text-xl font-black opacity-60 uppercase tracking-[0.2em]">Zero Match Detected</h3>
                    <p className="text-xs opacity-30 mt-2 font-mono uppercase">Adjust filter parameters for a wider search</p>
                    <button 
                        onClick={resetFilters} 
                        className="mt-8 px-6 py-2 rounded-full border border-primary/30 text-primary text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-black transition-all active:scale-95"
                    >
                        Reset System Filters
                    </button>
                </div>
            )}
        </div>
    );
}