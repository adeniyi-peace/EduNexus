import { useState } from "react";

// Helper to map icons to categories for that technical look
const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
        case "all": return <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>;
        case "frontend": return <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>;
        case "backend": return <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>;
        case "design": return <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z"/><path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>;
        default: return <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m18 16 4-4-4-4"/><path d="m6 8-4 4 4 4"/><path d="m14.5 4-5 16"/></svg>;
    }
};

interface FilterProps {
    categories: string[];
    onSearch: (query: string) => void;
    onCategoryChange: (category: string) => void;
}

export function CourseFilters({ categories, onSearch, onCategoryChange }: FilterProps) {
    const [activeCategory, setActiveCategory] = useState("All");

    const handleCategoryClick = (cat: string) => {
        setActiveCategory(cat);
        onCategoryChange(cat);
    };

    return (
        <div className="flex flex-col md:flex-row gap-6 items-center justify-between mb-10">
            {/* Search Input */}
            <div className="relative w-full md:w-96 group">
                <input 
                    type="text" 
                    placeholder="Search for courses, tech, or mentors..." 
                    onChange={(e) => onSearch(e.target.value)}
                    className="input w-full bg-base-100 border-base-content/10 rounded-2xl h-14 pl-12 focus:outline-primary transition-all shadow-sm"
                />
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30 group-focus-within:opacity-100 transition-opacity" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            </div>

            {/* Category Pills */}
            {/* Category Node Switcher */}
            <div className="flex p-1.5 bg-base-100 rounded-[1.25rem] border border-base-content/5 shadow-inner overflow-x-auto max-w-full scrollbar-hide">
                {["All", ...categories].map((cat) => (
                    <button
                        key={cat}
                        onClick={() => handleCategoryClick(cat)}
                        className={`
                            flex items-center gap-3 px-6 py-2.5 rounded-[0.9rem] font-black text-[10px] uppercase tracking-[0.15em] transition-all duration-300 whitespace-nowrap
                            ${activeCategory === cat 
                                ? "bg-primary text-primary-content shadow-lg shadow-primary/20 scale-100" 
                                : "text-base-content/40 hover:text-base-content hover:bg-base-200 scale-95 hover:scale-100"}
                        `}
                    >
                        <span className={`${activeCategory === cat ? "opacity-100" : "opacity-30"}`}>
                            {getCategoryIcon(cat)}
                        </span>
                        {cat}
                        {activeCategory === cat && (
                            <span className="w-1 h-1 rounded-full bg-primary-content animate-pulse" />
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
}