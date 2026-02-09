import { useState } from "react";

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
            <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto scrollbar-hide">
                {["All", ...categories].map((cat) => (
                    <button
                        key={cat}
                        onClick={() => handleCategoryClick(cat)}
                        className={`px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all whitespace-nowrap
                        ${activeCategory === cat 
                            ? "bg-primary text-primary-content shadow-lg shadow-primary/20" 
                            : "bg-base-100 hover:bg-base-200 opacity-60 hover:opacity-100"}`}
                    >
                        {cat}
                    </button>
                ))}
            </div>
        </div>
    );
}