import { Wallet, TrendingUp, ArrowUpRight, DollarSign, PieChart } from "lucide-react";

export const FinanceStats = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* 1. Total Gross Volume */}
            <div className="card bg-base-100 border border-base-content/5 shadow-sm p-6 relative overflow-hidden group">
                <div className="absolute right-0 top-0 w-32 h-32 bg-primary/5 rounded-bl-full group-hover:bg-primary/10 transition-colors" />
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-base-200 rounded-lg text-primary">
                            <TrendingUp size={20} />
                        </div>
                        <span className="text-xs font-black uppercase opacity-50 tracking-widest">Gross Volume</span>
                    </div>
                    <div className="text-4xl font-black tracking-tighter">$124,500.00</div>
                    <div className="text-sm font-bold text-success flex items-center gap-1 mt-1">
                        <ArrowUpRight size={14} /> +18.2% <span className="text-base-content/40 font-medium">vs last month</span>
                    </div>
                </div>
            </div>

            {/* 2. Platform Net Income (Your Profit) */}
            <div className="card bg-primary text-primary-content shadow-lg shadow-primary/20 p-6 relative overflow-hidden">
                <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-xl" />
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-white/20 rounded-lg text-white">
                            <PieChart size={20} />
                        </div>
                        <span className="text-xs font-black uppercase opacity-80 tracking-widest">Net Revenue</span>
                    </div>
                    <div className="text-4xl font-black tracking-tighter">$24,900.00</div>
                    <div className="text-sm font-bold opacity-80 mt-1">
                        Running at ~20% margin
                    </div>
                </div>
            </div>

            {/* 3. Pending Payouts (Liabilities) */}
            <div className="card bg-base-100 border border-base-content/5 shadow-sm p-6">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-error/10 rounded-lg text-error">
                        <Wallet size={20} />
                    </div>
                    <span className="text-xs font-black uppercase opacity-50 tracking-widest">Pending Payouts</span>
                </div>
                <div className="text-4xl font-black tracking-tighter text-base-content/80">$8,250.00</div>
                <div className="text-xs font-bold opacity-40 mt-1 uppercase">
                    Due to 12 Instructors
                </div>
                <progress className="progress progress-error w-full mt-3 h-1 opacity-50" value="40" max="100"></progress>
            </div>
        </div>
    );
};