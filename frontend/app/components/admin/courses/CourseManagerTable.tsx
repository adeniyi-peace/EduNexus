import { MoreHorizontal, Users, Star, ExternalLink, Settings, Trash2 } from "lucide-react";

const COURSES = [
    { id: "1", title: "React 19 Mastery", instructor: "Sarah J.", students: 1240, rating: 4.9, status: "Published", price: 89.00 },
    { id: "2", title: "Advanced CSS Layouts", instructor: "Gary S.", students: 850, rating: 4.7, status: "Draft", price: 45.00 },
    { id: "3", title: "Node.js Security", instructor: "Alex R.", students: 320, rating: 4.8, status: "Published", price: 120.00 },
];

export const CourseManagerTable = () => {
    return (
        <div className="card bg-base-100 border border-base-content/5 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="table table-zebra font-sans">
                    <thead className="bg-base-200/50 text-[10px] uppercase font-black opacity-50">
                        <tr>
                            <th className="w-12"><input type="checkbox" className="checkbox checkbox-xs" /></th>
                            <th>Course Name</th>
                            <th>Instructor</th>
                            <th>Stats</th>
                            <th>Status</th>
                            <th className="text-right">Price</th>
                            <th className="text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {COURSES.map((course) => (
                            <tr key={course.id} className="hover:bg-primary/5 transition-colors group">
                                <td><input type="checkbox" className="checkbox checkbox-xs" /></td>
                                <td>
                                    <div className="font-black text-sm group-hover:text-primary transition-colors cursor-pointer">
                                        {course.title}
                                    </div>
                                    <div className="text-[10px] opacity-40 font-bold uppercase tracking-tighter">ID: {course.id}</div>
                                </td>
                                <td className="text-xs font-bold opacity-70">{course.instructor}</td>
                                <td>
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center gap-1 text-xs opacity-60">
                                            <Users size={12} /> {course.students}
                                        </div>
                                        <div className="flex items-center gap-1 text-xs text-warning font-bold">
                                            <Star size={12} fill="currentColor" /> {course.rating}
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div className={`badge badge-xs font-black uppercase text-[9px] px-2 py-2
                                        ${course.status === 'Published' ? 'badge-success' : 'badge-ghost opacity-50'}`}>
                                        {course.status}
                                    </div>
                                </td>
                                <td className="text-right font-black text-sm">${course.price}</td>
                                <td className="text-right">
                                    <div className="dropdown dropdown-left">
                                        <button className="btn btn-ghost btn-xs btn-square">
                                            <MoreHorizontal size={16} />
                                        </button>
                                        <ul className="dropdown-content z-50 menu p-2 shadow-xl bg-base-100 border border-base-content/10 rounded-xl w-48">
                                            <li><a className="text-xs font-bold"><ExternalLink size={14} /> View on Site</a></li>
                                            <li><a className="text-xs font-bold"><Settings size={14} /> Manage Content</a></li>
                                            <li className="text-error"><a className="text-xs font-bold"><Trash2 size={14} /> Delete Course</a></li>
                                        </ul>
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