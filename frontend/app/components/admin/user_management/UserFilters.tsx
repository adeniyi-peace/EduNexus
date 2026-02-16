import { Search, SlidersHorizontal, UserPlus, X } from "lucide-react";

export const UserFilters = () => {
    return (
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-base-100 p-4 rounded-2xl border border-base-content/5 shadow-xs">
            {/* Search Input */}
            <div className="relative w-full md:max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 opacity-30" size={18} />
                <input 
                    type="text" 
                    placeholder="Search by name, email, or ID..." 
                    className="input input-bordered w-full pl-10 bg-base-200/50 border-none focus:bg-base-100 transition-all"
                />
            </div>

            {/* Filter Group */}
            <div className="flex items-center gap-2 w-full md:w-auto">
                <select className="select select-bordered select-sm bg-base-200/50 border-none">
                    <option disabled selected>Role</option>
                    <option>All Roles</option>
                    <option>Student</option>
                    <option>Instructor</option>
                    <option>Admin</option>
                </select>

                <select className="select select-bordered select-sm bg-base-200/50 border-none">
                    <option disabled selected>Status</option>
                    <option>Active</option>
                    <option>Suspended</option>
                    <option>Pending</option>
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