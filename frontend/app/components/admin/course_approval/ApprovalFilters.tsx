import { Search, Filter, Layers } from "lucide-react";

export const ApprovalFilters = ({ count }: { count: number }) => {
    return (
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-secondary text-secondary-content rounded-2xl shadow-lg shadow-secondary/20">
                    <Layers size={24} />
                </div>
                <div>
                    <h1 className="text-3xl font-black tracking-tighter">Review Queue</h1>
                    <p className="text-sm opacity-50 font-medium">
                        There are <span className="text-secondary font-bold">{count} courses</span> awaiting moderation.
                    </p>
                </div>
            </div>

            <div className="join w-full lg:w-auto shadow-sm">
                <div className="relative join-item flex-1 lg:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 opacity-30" size={16} />
                    <input className="input input-bordered input-sm w-full pl-10 focus:outline-primary" placeholder="Search queue..." />
                </div>
                <select className="select select-bordered select-sm join-item bg-base-100">
                    <option disabled selected>Category</option>
                    <option>Development</option>
                    <option>Design</option>
                    <option>Business</option>
                </select>
            </div>
        </div>
    );
};