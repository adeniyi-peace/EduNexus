import { Star, Trophy } from "lucide-react";

export const TopCourses = () => {
    const COURSES = [
        { name: "React 19 Deep Dive", instructor: "Sarah J.", students: 840, rating: 4.9, completion: 78 },
        { name: "UI Design Mastery", instructor: "Gary S.", students: 620, rating: 4.8, completion: 65 },
        { name: "Advanced Node.js", instructor: "Alex R.", students: 410, rating: 4.6, completion: 42 },
    ];

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
                        {COURSES.map((c, i) => (
                            <tr key={i} className="group hover:bg-base-200/50">
                                <td className="font-bold text-sm">
                                    <div className="flex items-center gap-2">
                                        <span className="font-mono opacity-30 text-xs">#{i + 1}</span>
                                        {c.name}
                                    </div>
                                    <div className="text-[10px] opacity-50 font-normal">{c.instructor}</div>
                                </td>
                                <td className="font-mono text-xs">{c.students}</td>
                                <td>
                                    <div className="flex items-center gap-1 text-xs font-bold text-warning">
                                        {c.rating} <Star size={10} fill="currentColor" />
                                    </div>
                                </td>
                                <td>
                                    <div className="flex items-center gap-2">
                                        <progress className="progress progress-primary w-16" value={c.completion} max="100"></progress>
                                        <span className="text-[10px] font-bold opacity-60">{c.completion}%</span>
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