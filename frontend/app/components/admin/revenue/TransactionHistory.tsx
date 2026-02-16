import { ShoppingBag, ArrowDownLeft } from "lucide-react";

export const TransactionHistory = () => {
    const TRANSACTIONS = [
        { id: 1, desc: "Course Purchase: React 19", user: "Mike T.", amount: "+$49.99", time: "2m ago", type: "in" },
        { id: 2, desc: "Course Purchase: UI Design", user: "Sarah L.", amount: "+$89.00", time: "15m ago", type: "in" },
        { id: 3, desc: "Refund: Python Basics", user: "John D.", amount: "-$29.99", time: "1h ago", type: "out" },
    ];

    return (
        <div className="card bg-base-100 border border-base-content/5 shadow-sm h-full">
            <div className="p-6 border-b border-base-content/5">
                <h3 className="font-black text-lg">Live Transactions</h3>
            </div>
            <div className="divide-y divide-base-content/5">
                {TRANSACTIONS.map((t) => (
                    <div key={t.id} className="p-4 flex items-center justify-between hover:bg-base-200/50 transition-colors">
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-xl ${t.type === 'in' ? 'bg-success/10 text-success' : 'bg-error/10 text-error'}`}>
                                {t.type === 'in' ? <ShoppingBag size={18} /> : <ArrowDownLeft size={18} />}
                            </div>
                            <div>
                                <p className="text-sm font-bold">{t.desc}</p>
                                <p className="text-xs opacity-50">{t.user} • {t.time}</p>
                            </div>
                        </div>
                        <span className={`font-black text-sm ${t.type === 'in' ? 'text-success' : 'text-error'}`}>
                            {t.amount}
                        </span>
                    </div>
                ))}
            </div>
            <button className="btn btn-block btn-ghost btn-sm rounded-t-none border-t border-base-content/5 opacity-50">
                View All Transactions
            </button>
        </div>
    );
};