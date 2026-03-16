import { Users, Star, DollarSign, Eye } from "lucide-react";

interface Course {
    id: string;
    title: string;
    students: number;
    revenue: string;
    rating: number;
    views?: number;
    conversionRate?: number;
}

interface TopPerformingCoursesProps {
    courses?: Course[];
}

export const TopPerformingCourses = ({ courses }: TopPerformingCoursesProps) => {
    const hasCourses = courses && courses.length > 0;
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
                        {hasCourses ? (
                            courses!.map((course) => (
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
                                            {course.revenue.replace('$', '')}
                                        </div>
                                    </td>
                                    <td className="text-center">
                                        <div className="flex items-center justify-center gap-2 font-bold text-sm text-warning">
                                            <Star size={14} fill="currentColor" />
                                            {course.rating}
                                        </div>
                                    </td>
                                    <td className="text-center font-mono text-xs opacity-40">
                                        {(course.views || 0).toLocaleString()}
                                    </td>
                                    <td className="pr-8 text-right">
                                        <div className="badge badge-lg bg-base-300 border-none font-black text-[11px] group-hover:bg-primary group-hover:text-primary-content transition-colors px-3">
                                            {course.conversionRate || 0}%
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="py-16 text-center">
                                    <div className="flex flex-col items-center gap-3 opacity-30">
                                        <div className="w-16 h-16 rounded-2xl bg-base-300 flex items-center justify-center">
                                            <DollarSign size={32} />
                                        </div>
                                        <p className="font-black text-sm uppercase tracking-widest">No Courses Yet</p>
                                        <p className="text-xs opacity-60 max-w-xs">Create your first course to see performance metrics here.</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
