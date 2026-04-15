import { useState, useEffect } from "react";
import { Link } from "react-router";
import { CourseCard } from "~/components/ui/CourseCard";
import { CourseFilters } from "~/components/course/CourseFilters";
import api from "~/utils/api.client";

export const meta = () => {
  return [
    { title: "My Courses | EduNexus" },
    { name: "description", content: "My Courses Page" },
  ];
};

interface PaginatedResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: any[];
}

export default function CoursesPage() {
    // --- STATE ---
    const [courses, setCourses] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [categories, setCategories] = useState<string[]>([]);
    const itemsPerPage = 6;

    // --- FETCH COURSES FROM API ---
    useEffect(() => {
        const fetchCourses = async () => {
            setIsLoading(true);
            try {
                const params: Record<string, any> = {
                    page: currentPage,
                    page_size: itemsPerPage,
                };
                if (searchQuery) params.search = searchQuery;
                if (selectedCategory !== "All") params.category = selectedCategory;

                const res = await api.get<PaginatedResponse>("/courses/", { params });
                
                // Handle both paginated and unpaginated
                if (res.data.results) {
                    setCourses(res.data.results);
                    setTotalCount(res.data.count);
                } else if (Array.isArray(res.data)) {
                    setCourses(res.data);
                    setTotalCount(res.data.length);
                }
            } catch (err) {
                console.error("Failed to fetch courses", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchCourses();
    }, [currentPage, searchQuery, selectedCategory]);

    // Fetch categories once on mount
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await api.get("/courses/", { params: { page_size: 100 } });
                const allCourses = res.data.results || res.data || [];
                const uniqueCats = Array.from(new Set(allCourses.map((c: any) => c.category?.name || c.category).filter(Boolean)));
                setCategories(uniqueCats as string[]);
            } catch {
                // Silently fail - categories are optional
            }
        };
        fetchCategories();
    }, []);

    const totalPages = Math.ceil(totalCount / itemsPerPage);

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
                    categories={categories} 
                    onSearch={handleSearch} 
                    onCategoryChange={handleFilterChange} 
                />
            </div>

            {/* Loading State */}
            {isLoading ? (
                <div className="flex items-center justify-center min-h-[40vh]">
                    <span className="loading loading-dots loading-lg text-primary"></span>
                </div>
            ) : courses.length > 0 ? (
                <div className="space-y-16">
                    {/* Course Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                        {courses.map((course, idx) => (
                            <div 
                                key={course.id} 
                                className="animate-in zoom-in-95 duration-500 fill-mode-both"
                                style={{ animationDelay: `${idx * 50}ms` }}
                            >
                                <CourseCard course={course} />
                            </div>
                        ))}
                    </div>

                    {/* --- PAGINATION UI --- */}
                    {totalPages > 1 && (
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
                                Showing {((currentPage - 1) * itemsPerPage) + 1}—{Math.min(currentPage * itemsPerPage, totalCount)} of {totalCount} results
                            </p>
                        </div>
                    )}
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