import { useState } from "react";
import { Plus, Filter, Search } from "lucide-react";
import { CourseStats } from "~/components/admin/courses/CourseStats";
import { CourseManagerTable } from "~/components/admin/courses/CourseManagerTable";
import { BulkActionBar } from "~/components/admin/courses/BulkActionBar";

export default function AdminCoursesPage() {
    // In a real app, this would be derived from the checkbox state in the table
    const [selectedCount, setSelectedCount] = useState(0);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tight">Course Inventory</h1>
                    <p className="text-sm opacity-50 font-medium italic">Manage, audit, and curate the learning catalog.</p>
                </div>
                <button className="btn btn-primary gap-2 shadow-lg shadow-primary/20">
                    <Plus size={18} /> New Course
                </button>
            </div>

            {/* Lifecycle Overview */}
            <CourseStats />

            {/* Filter Bar */}
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                <div className="relative w-full lg:max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 opacity-30" size={18} />
                    <input className="input input-bordered w-full pl-10 bg-base-100 border-base-content/10" placeholder="Filter by course name or instructor..." />
                </div>
                
                <div className="flex items-center gap-2 w-full lg:w-auto">
                    <button className="btn btn-outline border-base-content/10 btn-square btn-md lg:hidden">
                        <Filter size={18} />
                    </button>
                    <select className="select select-bordered bg-base-100 border-base-content/10 flex-1 lg:w-40">
                        <option disabled selected>Category</option>
                        <option>Development</option>
                        <option>Design</option>
                    </select>
                    <select className="select select-bordered bg-base-100 border-base-content/10 flex-1 lg:w-40">
                        <option disabled selected>Status</option>
                        <option>Published</option>
                        <option>Draft</option>
                    </select>
                </div>
            </div>

            {/* Main Table */}
            <CourseManagerTable />

            {/* Floating Bulk Actions (Triggered for demo with a button) */}
            <button 
                className="btn btn-xs opacity-20 hover:opacity-100" 
                onClick={() => setSelectedCount(selectedCount === 3 ? 0 : 3)}
            >
                Simulate Select (Dev)
            </button>
            <BulkActionBar selectedCount={selectedCount} />
        </div>
    );
}