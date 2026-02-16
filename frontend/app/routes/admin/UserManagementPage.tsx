import { Users, FileDown } from "lucide-react";
import { UserFilters } from "~/components/admin/user_management/UserFilters";
import { UserTable } from "~/components/admin/user_management/UserTable";

export default function UserManagementPage() {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary text-primary-content rounded-2xl shadow-lg shadow-primary/20">
                        <Users size={28} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black tracking-tight">User Directory</h1>
                        <p className="text-sm opacity-50 font-medium italic">Manage students, instructors, and staff permissions.</p>
                    </div>
                </div>
                
                <button className="btn btn-outline btn-sm gap-2">
                    <FileDown size={16} /> Export CSV
                </button>
            </div>

            {/* Filter Section */}
            <UserFilters />

            {/* Data Table */}
            <UserTable />
        </div>
    );
}