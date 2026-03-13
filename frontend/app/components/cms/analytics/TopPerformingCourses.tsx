import { Users, Star, DollarSign, Eye } from "lucide-react";
import type { CourseMetric } from "~/types/analytics";

const COURSE_DATA = [
    { id: "NX-01", title: "Advanced Distributed Systems", views: 12500, students: 450, revenue: 12400, rating: 4.9, conversionRate: 3.6 },
    { id: "NX-02", title: "Cloud Architecture Masterclass", views: 8200, students: 380, revenue: 9500, rating: 4.8, conversionRate: 3.9 },
    { id: "NX-03", title: "Next.js 15: Deep Dive", views: 5100, students: 210, revenue: 5200, rating: 4.7, conversionRate: 2.3 },
    { id: "NX-04", title: "UI/UX Design Masterclass", views: 3200, students: 120, revenue: 4200, rating: 4.6, conversionRate: 2.6 },
];

export const TopPerformingCourses = () => {
    return (
        <div className="bg-base-100 border border-base-content/5 rounded-3xl overflow-hidden shadow-xl">
            <div className="p-6 border-b border-base-content/5 flex flex-row justify-between items-center bg-base-200/50">
                <div>
                    <h3 className="font-black text-xl tracking-tight">Course Performance</h3>
                    <p className="text-xs opacity-40 font-medium mt-1 uppercase tracking-wider">Detailed Engagement & Revenue Tracking</p>
                </div>
                <button className="btn btn-sm btn-outline border-base-content/10 hover:border-primary hover:bg-primary/5 hover:text-primary transition-all rounded-xl font-bold uppercase text-[10px]">
                    Full Inventory
                </button>
            </div>
            
            <div className="overflow-x-auto">
                <table className="table w-full">
                    {/* Header */}
                    <thead className="bg-base-200/30 text-[10px] uppercase font-black tracking-widest text-base-content/50 border-b border-base-content/5">
                        <tr>
                            <th className="pl-8 py-5">Course</th>
                            <th className="text-center">Students</th>
                            <th className="text-center">Revenue</th>
                            <th className="text-center">Rating</th>
                            <th className="text-center">Views</th>
                            <th className="text-right pr-8">Conv. Rate</th>
                        </tr>
                    </thead>
                    
                    {/* Body */}
                    <tbody className="divide-y divide-base-content/5">
                        {COURSE_DATA.map((course) => (
                            <tr key={course.id} className="hover:bg-primary/5 transition-colors group">
                                <td className="pl-8 py-5">
                                    <div className="flex flex-col">
                                        <div className="font-bold text-sm text-base-content group-hover:text-primary transition-colors truncate max-w-[250px]" title={course.title}>
                                            {course.title}
                                        </div>
                                        <span className="text-[10px] font-mono opacity-30 mt-0.5">{course.id}</span>
                                    </div>
                                </td>
                                <td className="text-center">
                                    <div className="flex items-center justify-center gap-2 font-bold text-sm">
                                        <Users size={14} className="opacity-30" />
                                        {course.students}
                                    </div>
                                </td>
                                <td className="text-center">
                                    <div className="flex items-center justify-center gap-2 font-black text-sm text-success">
                                        <DollarSign size={14} className="opacity-50" />
                                        {course.revenue.toLocaleString()}
                                    </div>
                                </td>
                                <td className="text-center">
                                    <div className="flex items-center justify-center gap-2 font-bold text-sm text-warning">
                                        <Star size={14} fill="currentColor" />
                                        {course.rating}
                                    </div>
                                </td>
                                <td className="text-center font-mono text-xs opacity-40">
                                    {course.views.toLocaleString()}
                                </td>
                                <td className="pr-8 text-right">
                                    <div className="badge badge-lg bg-base-300 border-none font-black text-[11px] group-hover:bg-primary group-hover:text-primary-content transition-colors px-3">
                                        {course.conversionRate}%
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};