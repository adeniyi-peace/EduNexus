import { Search, LayoutGrid, List as ListIcon, Filter } from "lucide-react";

interface LibraryToolbarProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    viewMode: 'grid' | 'list';
    setViewMode: (mode: 'grid' | 'list') => void;
}

export const LibraryToolbar = ({ searchQuery, setSearchQuery, viewMode, setViewMode }: LibraryToolbarProps) => {
    return (
        <div className="flex flex-col md:flex-row gap-4 mb-6 sticky top-0 z-30 py-4  backdrop-blur-sm transition-all">
            {/* Search Input */}
            <div className="flex-1 flex gap-2 items-center">
                <div className="relative flex-1 max-w-lg group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 opacity-40 group-focus-within:text-primary transition-colors" size={18} />
                    <input 
                        type="text" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search courses by title..." 
                        className=" w-full pl-10 focus:outline-hidden focus:ring-2 ring-primary/20 "
                    />
                </div>
                
                {/* Filter Dropdown (Placeholder for more complex logic) */}
                <div className="dropdown">
                    <button tabIndex={0} className="btn btn-square btn-ghost border border-base-content/10">
                        <Filter size={18} />
                    </button>
                    <ul tabIndex={0} className="dropdown-content z-1 menu p-2 shadow-xl rounded-box w-52 mt-2">
                        <li><a>Newest First</a></li>
                        <li><a>Oldest First</a></li>
                        <li><a>Highest Rated</a></li>
                    </ul>
                </div>
            </div>

            {/* View Toggles */}
            <div className="flex p-1.5 rounded-xl border border-base-content/10 shadow-xs">
                <button 
                    onClick={() => setViewMode("grid")}
                    className={`p-2.5 rounded-lg transition-all duration-200 ${viewMode === "grid" ? "bg-primary text-primary-content shadow-md" : "text-base-content/50 hover:bg-primary/30"}`}
                >
                    <LayoutGrid size={18} />
                </button>
                <button 
                    onClick={() => setViewMode("list")}
                    className={`p-2.5 rounded-lg transition-all duration-200 ${viewMode === "list" ? "bg-primary text-primary-content shadow-md" : "text-base-content/50 hover:bg-primary/30"}`}
                >
                    <ListIcon size={18} />
                </button>
            </div>
        </div>
    );
};