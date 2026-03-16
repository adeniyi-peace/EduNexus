import { useState } from "react";
import { Plus, Search } from "lucide-react";
import { CourseStats } from "~/components/admin/courses/CourseStats";
import { CourseManagerTable } from "~/components/admin/courses/CourseManagerTable";
import { BulkActionBar } from "~/components/admin/courses/BulkActionBar";
import { useAdminCourses, useDeleteCourse, type CourseFilters } from "~/hooks/admin/useAdminCourses";
import { AdminTableSkeleton, AdminErrorState } from "~/components/admin/shared/AdminTableSkeleton";

export default function AdminCoursesPage() {
    const [selectedCount, setSelectedCount] = useState(0);
    const [filters, setFilters] = useState<CourseFilters>({ page: 1, page_size: 15 });
    const [searchInput, setSearchInput] = useState("");

    const { data, isLoading, isError, refetch } = useAdminCourses(filters);
    const deleteMutation = useDeleteCourse();

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchInput(e.target.value);
    };

    const applySearch = () => {
        setFilters(prev => ({ ...prev, search: searchInput, page: 1 }));
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") applySearch();
    };

    const handleStatusFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFilters(prev => ({ ...prev, status: e.target.value, page: 1 }));
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tight">Course Inventory</h1>
                    <p className="text-sm opacity-50 font-medium italic">
                        {data ? `${data.count.toLocaleString()} courses across all instructors` : "Manage, audit, and curate the learning catalog."}
                    </p>
                </div>
                <button className="btn btn-primary gap-2 shadow-lg shadow-primary/20">
                    <Plus size={18} /> New Course
                </button>
            </div>

            {/* Lifecycle Overview Stats */}
            <CourseStats isLoading={isLoading} data={data?.results ?? []} />

            {/* Filter Bar */}
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                <div className="relative w-full lg:max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 opacity-30" size={18} />
                    <input
                        className="input input-bordered w-full pl-10 bg-base-100 border-base-content/10"
                        placeholder="Filter by course name or instructor..."
                        value={searchInput}
                        onChange={handleSearch}
                        onKeyDown={handleKeyDown}
                        onBlur={applySearch}
                    />
                </div>

                <div className="flex items-center gap-2 w-full lg:w-auto">
                    <select
                        className="select select-bordered bg-base-100 border-base-content/10 flex-1 lg:w-44"
                        onChange={handleStatusFilter}
                        defaultValue=""
                    >
                        <option value="">All Statuses</option>
                        <option value="Published">Published</option>
                        <option value="Draft">Draft</option>
                        <option value="PendingApproval">Pending Approval</option>
                        <option value="Rejected">Rejected</option>
                        <option value="Archived">Archived</option>
                    </select>
                </div>
            </div>

            {/* Main Table */}
            {isError ? (
                <AdminErrorState message="Could not load courses." onRetry={refetch} />
            ) : isLoading ? (
                <AdminTableSkeleton rows={10} columns={6} />
            ) : (
                <CourseManagerTable
                    courses={data?.results ?? []}
                    totalCount={data?.count ?? 0}
                    page={filters.page ?? 1}
                    pageSize={filters.page_size ?? 15}
                    onPageChange={(page) => setFilters(prev => ({ ...prev, page }))}
                    onDelete={(id) => deleteMutation.mutate(id)}
                    onSelect={(count) => setSelectedCount(count)}
                />
            )}

            <BulkActionBar selectedCount={selectedCount} />
        </div>
    );
}