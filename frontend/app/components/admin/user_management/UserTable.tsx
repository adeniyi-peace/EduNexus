import { MoreVertical, Mail, ShieldCheck, UserX, UserCheck, ExternalLink, Loader2 } from "lucide-react";
import type { AdminUser } from "~/types/admin";

interface Props {
    users: AdminUser[];
    totalCount: number;
    page: number;
    pageSize: number;
    onPageChange: (page: number) => void;
    onSuspend: (id: number) => void;
    onActivate: (id: number) => void;
    onRoleChange: (id: number, role: "student" | "instructor" | "admin") => void;
    isMutating?: boolean;
}

export const UserTable = ({
    users, totalCount, page, pageSize, onPageChange, onSuspend, onActivate, onRoleChange, isMutating
}: Props) => {
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
                        {users.map((user) => (
                            <tr key={user.id} className="group hover:bg-primary/5 transition-colors">
                                <td>
                                    <div className="flex items-center gap-3">
                                        <div className="avatar">
                                            <div className="mask mask-squircle w-10 h-10 bg-base-200">
                                                {user.avatar ? (
                                                    <img src={user.avatar} alt={user.fullname} />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center font-bold text-base-content/50 bg-base-300">
                                                        {user.fullname.charAt(0)}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="font-black text-sm">{user.fullname}</div>
                                            <div className="text-[11px] opacity-50 flex items-center gap-1 font-medium">
                                                <Mail size={10} /> {user.email}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <span className={`badge badge-sm font-bold border-none 
                                        ${user.role === 'admin' ? 'bg-neutral text-neutral-content' : 
                                          user.role === 'instructor' ? 'bg-primary/10 text-primary' : 'bg-base-200'}`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td>
                                    <div className="flex items-center gap-1.5">
                                        <div className={`w-1.5 h-1.5 rounded-full ${user.is_active ? 'bg-success animate-pulse' : 'bg-error'}`} />
                                        <span className="text-xs font-bold">{user.is_active ? 'Active' : 'Suspended'}</span>
                                    </div>
                                </td>
                                <td className="text-xs opacity-60 font-medium">
                                    {user.date_joined ? new Date(user.date_joined).toLocaleDateString() : '—'}
                                </td>
                                <td className="text-right">
                                    <div className="dropdown dropdown-left dropdown-end">
                                        <button tabIndex={0} className="btn btn-ghost btn-xs btn-square" disabled={isMutating}>
                                            {isMutating ? <Loader2 size={14} className="animate-spin" /> : <MoreVertical size={16} />}
                                        </button>
                                        <ul tabIndex={0} className="dropdown-content z-50 menu p-2 shadow-xl bg-base-100 border border-base-content/10 rounded-xl w-52">
                                            <li><a><ExternalLink size={14} /> View Full Profile</a></li>
                                            
                                            {user.role !== 'admin' && (
                                                <li><a onClick={() => onRoleChange(user.id, 'admin')}><ShieldCheck size={14} /> Make Admin</a></li>
                                            )}
                                            {user.role !== 'instructor' && (
                                                <li><a onClick={() => onRoleChange(user.id, 'instructor')}><ShieldCheck size={14} /> Make Instructor</a></li>
                                            )}
                                            {user.role !== 'student' && (
                                                <li><a onClick={() => onRoleChange(user.id, 'student')}><ShieldCheck size={14} /> Make Student</a></li>
                                            )}
                                            
                                            <div className="divider my-0"></div>
                                            
                                            {user.is_active ? (
                                                <li className="text-error"><a onClick={() => onSuspend(user.id)}><UserX size={14} /> Suspend User</a></li>
                                            ) : (
                                                <li className="text-success"><a onClick={() => onActivate(user.id)}><UserCheck size={14} /> Activate User</a></li>
                                            )}
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
                <span className="text-xs opacity-50 font-bold">Showing {users.length} of {totalCount} users</span>
                <div className="join">
                    <button 
                        className="join-item btn btn-xs btn-outline border-base-content/10"
                        disabled={page === 1}
                        onClick={() => onPageChange(page - 1)}
                    >
                        Prev
                    </button>
                    <button className="join-item btn btn-xs btn-active btn-primary">{page}</button>
                    <button 
                        className="join-item btn btn-xs btn-outline border-base-content/10"
                        disabled={page * pageSize >= totalCount}
                        onClick={() => onPageChange(page + 1)}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};