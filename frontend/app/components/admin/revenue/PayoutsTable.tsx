import { CheckCircle2, MoreHorizontal, ExternalLink, AlertCircle } from "lucide-react";

const PAYOUTS = [
    { id: "p1", instructor: "Sarah Jenkins", email: "sarah@edu.com", amount: 1250.00, method: "Stripe", date: "Feb 14", status: "Pending", avatar: "https://i.pravatar.cc/150?u=1" },
    { id: "p2", instructor: "David Chen", email: "david@edu.com", amount: 890.50, method: "PayPal", date: "Feb 13", status: "Pending", avatar: "https://i.pravatar.cc/150?u=2" },
    { id: "p3", instructor: "Elena Gomez", email: "elena@edu.com", amount: 2400.00, method: "Bank Transfer", date: "Feb 10", status: "Overdue", avatar: "https://i.pravatar.cc/150?u=3" },
];

export const PayoutsTable = () => {
    return (
        <div className="card bg-base-100 border border-base-content/5 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-base-content/5 flex justify-between items-center bg-base-200/30">
                <div>
                    <h3 className="font-black text-lg">Payout Requests</h3>
                    <p className="text-xs opacity-50">Instructors requesting withdrawal.</p>
                </div>
                <button className="btn btn-sm btn-outline gap-2">
                    <ExternalLink size={14} /> Export CSV
                </button>
            </div>
            
            <div className="overflow-x-auto">
                <table className="table">
                    <thead>
                        <tr className="text-xs uppercase font-black opacity-50 border-b border-base-content/5">
                            <th>Instructor</th>
                            <th>Method</th>
                            <th>Requested</th>
                            <th>Amount</th>
                            <th className="text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {PAYOUTS.map((p) => (
                            <tr key={p.id} className="hover:bg-base-200/50 group transition-colors">
                                <td>
                                    <div className="flex items-center gap-3">
                                        <div className="avatar">
                                            <div className="w-10 rounded-full">
                                                <img src={p.avatar} alt={p.instructor} />
                                            </div>
                                        </div>
                                        <div>
                                            <div className="font-bold text-sm">{p.instructor}</div>
                                            <div className="text-xs opacity-50">{p.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <span className="badge badge-ghost badge-sm font-bold text-[10px] uppercase tracking-wider">{p.method}</span>
                                </td>
                                <td className="text-sm font-medium opacity-70">
                                    {p.status === 'Overdue' && <AlertCircle size={14} className="inline text-error mr-1" />}
                                    {p.date}
                                </td>
                                <td className="font-black text-base">${p.amount.toFixed(2)}</td>
                                <td className="text-right">
                                    <button className="btn btn-sm btn-success btn-outline gap-2 hover:text-white!">
                                        Pay Now <CheckCircle2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {/* Empty State / Footer */}
            <div className="p-4 bg-base-200/20 text-center text-xs opacity-50 border-t border-base-content/5">
                All payouts are processed via Stripe Connect or PayPal Payouts API.
            </div>
        </div>
    );
};