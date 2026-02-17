import { Filter, Search } from "lucide-react";

export const ModerationFilters = () => {
    return (
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between mb-8">
            <div className="relative w-full lg:max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 opacity-30" size={18} />
                <input 
                    className="input input-bordered w-full pl-10 bg-base-100" 
                    placeholder="Search content or users..." 
                />
            </div>
            
            <div className="flex items-center gap-2 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0">
                <div className="badge badge-outline h-10 px-4 gap-2 border-base-content/10">
                    <Filter size={14} /> <span className="text-xs font-bold uppercase">Filter By:</span>
                </div>
                {['All', 'Spam', 'Harassment', 'Copyright', 'Profanity'].map((f) => (
                    <button 
                        key={f} 
                        className={`btn btn-sm rounded-full ${f === 'All' ? 'btn-neutral' : 'btn-ghost border-base-content/10'}`}
                    >
                        {f}
                    </button>
                ))}
            </div>
        </div>
    );
};