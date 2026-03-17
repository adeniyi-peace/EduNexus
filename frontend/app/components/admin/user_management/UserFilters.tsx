import { Search, SlidersHorizontal, UserPlus, X } from "lucide-react";
import { useState } from "react";

interface Props {
    onFilterChange: (filters: { search?: string, role?: string, is_active?: boolean | '' }) => void;
    currentFilters: { search?: string, role?: string, is_active?: boolean | '' };
}

export const UserFilters = ({ onFilterChange, currentFilters }: Props) => {
    const [search, setSearch] = useState(currentFilters.search || "");

    const handleSearchBlur = () => onFilterChange({ search });
    const handleSearchKeyDown = (e: React.KeyboardEvent) => { if (e.key === 'Enter') onFilterChange({ search }); };

    return (
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-base-100 p-4 rounded-2xl border border-base-content/5 shadow-xs">
            {/* Search Input */}
            <div className="relative w-full md:max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 opacity-30" size={18} />
                <input 
                    type="text" 
                    placeholder="Search by name, email, or ID..." 
                    className="input input-bordered w-full pl-10 bg-base-200/50 border-none focus:bg-base-100 transition-all"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onBlur={handleSearchBlur}
                    onKeyDown={handleSearchKeyDown}
                />
            </div>

            {/* Filter Group */}
            <div className="flex items-center gap-2 w-full md:w-auto">
                <select 
                    className="select select-bordered select-sm bg-base-200/50 border-none"
                    value={currentFilters.role || ''}
                    onChange={(e) => onFilterChange({ role: e.target.value })}
                >
                    <option value="">All Roles</option>
                    <option value="student">Student</option>
                    <option value="instructor">Instructor</option>
                    <option value="admin">Admin</option>
                </select>

                <select 
                    className="select select-bordered select-sm bg-base-200/50 border-none"
                    value={currentFilters.is_active === undefined ? '' : currentFilters.is_active ? 'true' : 'false'}
                    onChange={(e) => {
                        const val = e.target.value;
                        onFilterChange({ is_active: val === '' ? '' : val === 'true' });
                    }}
                >
                    <option value="">All Status</option>
                    <option value="true">Active</option>
                    <option value="false">Suspended</option>
                </select>

                <div className="divider divider-horizontal mx-1 hidden md:flex"></div>

                <button className="btn btn-primary btn-sm gap-2">
                    <UserPlus size={16} />
                    <span className="hidden sm:inline">Add User</span>
                </button>
            </div>
        </div>
    );
};