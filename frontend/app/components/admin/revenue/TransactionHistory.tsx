import { ShoppingBag, ArrowDownLeft } from "lucide-react";
import type { AdminTransaction } from "~/types/admin";

interface Props {
    transactions: AdminTransaction[];
    totalCount: number;
    page: number;
    onPageChange: (page: number) => void;
}

export const TransactionHistory = ({ transactions, totalCount, page, onPageChange }: Props) => {
    return (
        <div className="card bg-base-100 border border-base-content/5 shadow-sm h-full max-h-[800px] flex flex-col">
            <div className="p-6 border-b border-base-content/5">
                <h3 className="font-black text-lg">Live Transactions</h3>
            </div>
            <div className="divide-y divide-base-content/5 overflow-y-auto flex-1">
                {transactions.length === 0 ? (
                    <div className="p-6 text-center opacity-30 text-sm font-bold">No recent transactions</div>
                ) : transactions.map((t) => (
                    <div key={t.id} className="p-4 flex items-center justify-between hover:bg-base-200/50 transition-colors">
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-xl ${t.amount >= 0 ? 'bg-success/10 text-success' : 'bg-error/10 text-error'}`}>
                                {t.amount >= 0 ? <ShoppingBag size={18} /> : <ArrowDownLeft size={18} />}
                            </div>
                            <div>
                                <p className="text-sm font-bold truncate max-w-[120px]" title={t.reference}>{t.reference}</p>
                                <p className="text-xs opacity-50 truncate max-w-[120px]">{t.userName} • {new Date(t.date).toLocaleDateString()}</p>
                            </div>
                        </div>
                        <span className={`font-black text-sm ${t.amount >= 0 ? 'text-success' : 'text-error'}`}>
                            {t.amount >= 0 ? '+' : ''}${Math.abs(t.amount).toFixed(2)}
                        </span>
                    </div>
                ))}
            </div>
            <div className="p-2 border-t border-base-content/5 flex items-center justify-between bg-base-200/30">
                <button 
                    className="btn btn-ghost btn-xs" 
                    disabled={page === 1} 
                    onClick={() => onPageChange(page - 1)}
                >
                    Prev
                </button>
                <div className="text-xs font-bold opacity-30">Page {page}</div>
                <button 
                    className="btn btn-ghost btn-xs" 
                    disabled={page * 10 >= totalCount} 
                    onClick={() => onPageChange(page + 1)}
                >
                    Next
                </button>
            </div>
        </div>
    );
};