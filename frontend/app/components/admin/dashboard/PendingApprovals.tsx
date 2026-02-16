export const PendingApprovals = () => {
    const PENDING = [
        { id: 1, name: "Advanced Go Mastery", instructor: "Jared Smith", date: "Feb 14", status: "New" },
        { id: 2, name: "UI Design for Devs", instructor: "Emily Chen", date: "Feb 13", status: "Updated" },
    ];

    return (
        <div className="card bg-base-100 border border-base-content/5 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-base-content/5">
                <h3 className="font-black text-lg tracking-tight">Content Review Queue</h3>
            </div>
            <div className="overflow-x-auto">
                <table className="table table-zebra font-sans">
                    <thead className="bg-base-200/50 text-xs uppercase font-black opacity-50">
                        <tr>
                            <th>Course Name</th>
                            <th>Instructor</th>
                            <th>Submitted</th>
                            <th className="text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {PENDING.map((course) => (
                            <tr key={course.id} className="hover">
                                <td className="font-bold text-sm">{course.name}</td>
                                <td className="text-sm opacity-70 font-medium">{course.instructor}</td>
                                <td className="text-xs">{course.date}</td>
                                <td className="text-right">
                                    <button className="btn btn-xs btn-primary">Review</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};