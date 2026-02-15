import { Eye, ShoppingCart, TrendingUp } from "lucide-react";
import type { CourseMetric } from "~/types/analytics";

const COURSE_DATA: CourseMetric[] = [
    { id: "1", title: "Complete Python Bootcamp 2026", views: 12500, sales: 450, revenue: 22500, conversionRate: 3.6 },
    { id: "2", title: "Advanced React Patterns", views: 8200, sales: 320, revenue: 15800, conversionRate: 3.9 },
    { id: "3", title: "UI/UX Design Masterclass", views: 5100, sales: 120, revenue: 4200, conversionRate: 2.3 },
    { id: "4", title: "Docker & Kubernetes Guide", views: 3200, sales: 85, revenue: 3100, conversionRate: 2.6 },
];

export const TopPerformingCourses = () => {
    return (
        <div className="card border border-base-content/5 shadow-sm overflow-hidden h-full">
            <div className="card-header p-6 border-b border-base-content/5 flex flex-row justify-between items-center">
                <h3 className="font-black text-lg">Course Performance</h3>
                <button className="btn btn-xs btn-ghost text-primary font-bold">View Full Report</button>
            </div>
            
            <div className="overflow-x-auto">
                <table className="table table-sm md:table-md">
                    {/* Header */}
                    <thead className="bg-base-200/30 text-[10px] uppercase font-black tracking-widest text-base-content/50">
                        <tr>
                            <th className="pl-6 py-4">Course Name</th>
                            <th className="text-center">Views</th>
                            <th className="text-center">Conv. Rate</th>
                            <th className="text-right pr-6">Revenue</th>
                        </tr>
                    </thead>
                    
                    {/* Body */}
                    <tbody className="divide-y divide-base-content/5">
                        {COURSE_DATA.map((course, index) => (
                            <tr key={course.id} className="hover:bg-base-200/20 transition-colors">
                                <td className="pl-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-6 h-6 rounded bg-base-content/10 flex items-center justify-center text-[10px] font-black opacity-50">
                                            {index + 1}
                                        </div>
                                        <div className="font-bold text-sm max-w-37.5 md:max-w-xs truncate" title={course.title}>
                                            {course.title}
                                        </div>
                                    </div>
                                </td>
                                <td className="text-center font-mono text-xs opacity-70">
                                    {course.views.toLocaleString()}
                                </td>
                                <td className="text-center">
                                    <div className="badge badge-sm badge-ghost font-bold text-xs">
                                        {course.conversionRate}%
                                    </div>
                                </td>
                                <td className="pr-6 text-right font-black text-sm text-base-content">
                                    ${course.revenue.toLocaleString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};