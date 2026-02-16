import { MoreVertical, Mail, ShieldCheck, UserX, ExternalLink } from "lucide-react";

const MOCK_USERS = [
    { id: "1", name: "Sarah Jenkins", email: "sarah@edu.com", role: "Instructor", status: "Active", joined: "Jan 12, 2026", avatar: "https://i.pravatar.cc/150?u=1" },
    { id: "2", name: "Marcus Wright", email: "m.wright@edu.com", role: "Student", status: "Active", joined: "Feb 02, 2026", avatar: "https://i.pravatar.cc/150?u=2" },
    { id: "3", name: "Helena Hills", email: "h.hills@edu.com", role: "Student", status: "Suspended", joined: "Dec 15, 2025", avatar: "https://i.pravatar.cc/150?u=3" },
    { id: "4", name: "Admin Alex", email: "alex@edunexus.com", role: "Admin", status: "Active", joined: "Jan 01, 2026", avatar: "https://i.pravatar.cc/150?u=4" },
];

export const UserTable = () => {
    return (
        <div className="card bg-base-100 border border-base-content/5 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="table table-zebra w-full font-sans">
                    {/* Head */}
                    <thead className="bg-base-200/80 text-[10px] uppercase font-black tracking-widest opacity-60">
                        <tr>
                            <th className="rounded-none">User Info</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th>Joined Date</th>
                            <th className="text-right">Actions</th>
                        </tr>
                    </thead>
                    {/* Body */}
                    <tbody>
                        {MOCK_USERS.map((user) => (
                            <tr key={user.id} className="group hover:bg-primary/5 transition-colors">
                                <td>
                                    <div className="flex items-center gap-3">
                                        <div className="avatar">
                                            <div className="mask mask-squircle w-10 h-10 bg-base-200">
                                                <img src={user.avatar} alt={user.name} />
                                            </div>
                                        </div>
                                        <div>
                                            <div className="font-black text-sm">{user.name}</div>
                                            <div className="text-[11px] opacity-50 flex items-center gap-1 font-medium">
                                                <Mail size={10} /> {user.email}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <span className={`badge badge-sm font-bold border-none 
                                        ${user.role === 'Admin' ? 'bg-neutral text-neutral-content' : 
                                          user.role === 'Instructor' ? 'bg-primary/10 text-primary' : 'bg-base-200'}`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td>
                                    <div className="flex items-center gap-1.5">
                                        <div className={`w-1.5 h-1.5 rounded-full ${user.status === 'Active' ? 'bg-success animate-pulse' : 'bg-error'}`} />
                                        <span className="text-xs font-bold">{user.status}</span>
                                    </div>
                                </td>
                                <td className="text-xs opacity-60 font-medium">
                                    {user.joined}
                                </td>
                                <td className="text-right">
                                    <div className="dropdown dropdown-left dropdown-end">
                                        <button tabIndex={0} className="btn btn-ghost btn-xs btn-square">
                                            <MoreVertical size={16} />
                                        </button>
                                        <ul tabIndex={0} className="dropdown-content z-50 menu p-2 shadow-xl bg-base-100 border border-base-content/10 rounded-xl w-52">
                                            <li><a><ExternalLink size={14} /> View Full Profile</a></li>
                                            <li><a><ShieldCheck size={14} /> Change Role</a></li>
                                            <li className="text-error"><a><UserX size={14} /> Suspend User</a></li>
                                        </ul>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination Footer */}
            <div className="p-4 border-t border-base-content/5 flex items-center justify-between bg-base-200/20">
                <span className="text-xs opacity-50 font-bold">Showing 4 of 1,240 users</span>
                <div className="join">
                    <button className="join-item btn btn-xs btn-outline border-base-content/10">Prev</button>
                    <button className="join-item btn btn-xs btn-active btn-primary">1</button>
                    <button className="join-item btn btn-xs btn-outline border-base-content/10">2</button>
                    <button className="join-item btn btn-xs btn-outline border-base-content/10">Next</button>
                </div>
            </div>
        </div>
    );
};