import { useState } from "react";
import { useLoaderData } from "react-router";
import { DUMMY_COURSES } from "~/utils/mockData";
import { CourseCard } from "~/components/ui/CourseCard";
import { CourseFilters } from "~/components/course/CourseFilters";

export async function loader() {
    // In the future, this will be: return await fetchFromDjango("/api/courses");
    return { courses: DUMMY_COURSES };
}

export default function CoursesPage() {
    const { courses } = useLoaderData<typeof loader>();
    
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");

    // Extract unique categories for the filter component
    const categories = Array.from(new Set(courses.map(c => c.category)));

    // Filtering Logic
    const filteredCourses = courses.filter(course => {
        const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             course.instructor.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === "All" || course.category === selectedCategory;
        
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="space-y-6 animate-in fade-in duration-700">
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
            <CourseFilters 
                categories={categories} 
                onSearch={setSearchQuery} 
                onCategoryChange={setSelectedCategory} 
            />

            {/* Course Grid */}
            {filteredCourses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {filteredCourses.map((course) => (
                        <div key={course.id} className="animate-in zoom-in-95 duration-500">
                            <CourseCard {...course} />
                        </div>
                    ))}
                </div>
            ) : (
                /* Empty State */
                <div className="flex flex-col items-center justify-center py-20 bg-base-100 rounded-[3rem] border border-dashed border-base-content/10">
                    <div className="w-20 h-20 bg-base-200 rounded-full flex items-center justify-center text-4xl mb-6 opacity-20">
                        🔭
                    </div>
                    <h3 className="text-xl font-black opacity-40 uppercase tracking-widest">No Modules Found</h3>
                    <p className="text-sm opacity-30 mt-2">Try adjusting your search or category filters.</p>
                    <button 
                        onClick={() => window.location.reload()} 
                        className="btn btn-ghost btn-sm mt-6 font-black opacity-50 underline"
                    >
                        Reset Search
                    </button>
                </div>
            )}

            {/* Bottom Pagination / Load More (Visual Placeholder) */}
            <div className="flex justify-center mt-16">
                <button className="btn btn-ghost gap-4 group">
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                    <span className="font-black uppercase tracking-widest text-[10px] opacity-50 group-hover:opacity-100 transition-all">
                        Fetch More Modules
                    </span>
                </button>
            </div>
        </div>
    );
}