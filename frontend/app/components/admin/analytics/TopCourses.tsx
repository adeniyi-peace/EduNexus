import { Star, Trophy } from "lucide-react";
import type { AdminTopCourse } from "~/types/admin";

interface Props {
    courses: AdminTopCourse[];
}

export const TopCourses = ({ courses }: Props) => {
    return (
        <div className="card bg-base-100 border border-base-content/5 shadow-sm overflow-hidden h-full">
            <div className="p-6 border-b border-base-content/5 flex justify-between items-center">
                <h3 className="font-black text-lg flex items-center gap-2">
                    <Trophy size={18} className="text-warning" /> Top Performers
                </h3>
            </div>
            <div className="overflow-x-auto">
                <table className="table table-zebra">
                    <thead className="text-[10px] uppercase font-black opacity-50 bg-base-200/50">
                        <tr>
                            <th>Course Name</th>
                            <th>Students</th>
                            <th>Rating</th>
                            <th>Avg. Completion</th>
                        </tr>
                    </thead>
                    <tbody>
                        {courses.length === 0 ? (
                            <tr><td colSpan={4} className="text-center py-6 opacity-30 font-bold">No trending courses</td></tr>
                        ) : courses.map((c, i) => (
                            <tr key={c.id} className="group hover:bg-base-200/50">
                                <td className="font-bold text-sm">
                                    <div className="flex items-center gap-2">
                                        <span className="font-mono opacity-30 text-xs">#{i + 1}</span>
                                        {c.title}
                                    </div>
                                    <div className="text-[10px] opacity-50 font-normal">{c.instructor} | {c.category}</div>
                                </td>
                                <td className="font-mono text-xs">{c.students}</td>
                                <td>
                                    <div className="flex items-center gap-1 text-xs font-bold text-warning">
                                        {c.rating} <Star size={10} fill="currentColor" />
                                    </div>
                                </td>
                                <td>
                                    <div className="flex items-center gap-2">
                                        <progress className="progress progress-primary w-16" value={c.rating * 20} max="100"></progress>
                                        <span className="text-[10px] font-bold opacity-60">{c.revenueFormatted}</span>
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