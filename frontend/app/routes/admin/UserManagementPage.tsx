import { useState } from "react";
import { Users, FileDown } from "lucide-react";
import { UserFilters as UserFilterBar } from "~/components/admin/user_management/UserFilters";
import { UserTable } from "~/components/admin/user_management/UserTable";
import { useAdminUsers, useUpdateUser, type UserFilters } from "~/hooks/admin/useAdminUsers";
import { AdminTableSkeleton, AdminErrorState } from "~/components/admin/shared/AdminTableSkeleton";

export const meta = () => {
  return [
    { title: "User Management | EduNexus" },
    { name: "description", content: "User Management Page" },
  ];
};

export default function UserManagementPage() {
    const [filters, setFilters] = useState<UserFilters>({
        page: 1,
        page_size: 15,
    });

    const { data, isLoading, isError, refetch } = useAdminUsers(filters);
    const updateUserMutation = useUpdateUser();

    const handleFilterChange = (newFilters: Partial<UserFilters>) => {
        setFilters(prev => ({ ...prev, ...newFilters, page: 1 })); // Reset to page 1 on filter change
    };

    const handlePageChange = (page: number) => {
        setFilters(prev => ({ ...prev, page }));
    };

    const handleSuspend = (userId: number) => {
        updateUserMutation.mutate({ userId, payload: { is_active: false } });
    };

    const handleActivate = (userId: number) => {
        updateUserMutation.mutate({ userId, payload: { is_active: true } });
    };

    const handleRoleChange = (userId: number, role: 'student' | 'instructor' | 'admin') => {
        updateUserMutation.mutate({ userId, payload: { role } });
    };

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
                        <p className="text-sm opacity-50 font-medium italic">
                            {data ? `${data.count.toLocaleString()} total users` : "Manage students, instructors, and staff permissions."}
                        </p>
                    </div>
                </div>

                <button className="btn btn-outline btn-sm gap-2">
                    <FileDown size={16} /> Export CSV
                </button>
            </div>

            {/* Filter Section */}
            <UserFilterBar onFilterChange={handleFilterChange} currentFilters={filters} />

            {/* Data Table */}
            {isError ? (
                <AdminErrorState message="Could not load users." onRetry={refetch} />
            ) : isLoading ? (
                <AdminTableSkeleton rows={10} columns={6} />
            ) : (
                <UserTable
                    users={data?.results ?? []}
                    totalCount={data?.count ?? 0}
                    page={filters.page ?? 1}
                    pageSize={filters.page_size ?? 15}
                    onPageChange={handlePageChange}
                    onSuspend={handleSuspend}
                    onActivate={handleActivate}
                    onRoleChange={handleRoleChange}
                    isMutating={updateUserMutation.isPending}
                />
            )}
        </div>
    );
}