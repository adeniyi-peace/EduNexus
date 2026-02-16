
import { DollarSign, Download } from "lucide-react";
import { FinanceStats } from "~/components/admin/revenue/FinanceStats";
import { PayoutsTable } from "~/components/admin/revenue/PayoutsTable";
import { TransactionHistory } from "~/components/admin/revenue/TransactionHistory";

export default function FinancePage() {
    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-base-100 border border-base-content/10 rounded-2xl shadow-sm">
                        <DollarSign size={28} className="text-success" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black tracking-tight">Financial Overview</h1>
                        <p className="text-sm opacity-50 font-medium">Track revenue, manage payouts, and analyze growth.</p>
                    </div>
                </div>
                <button className="btn btn-outline btn-sm gap-2">
                    <Download size={16} /> Monthly Report
                </button>
            </div>

            {/* 1. Key Metrics */}
            <FinanceStats />

            {/* 2. Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Left Column: Payouts & Chart Placeholder (Span 2) */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Revenue Chart Container */}
                    <div className="card bg-base-100 border border-base-content/5 shadow-sm p-6 h-80 relative flex flex-col justify-center items-center text-center">
                         <div className="absolute top-6 left-6 font-black text-lg">Revenue Trends</div>
                         {/* This is where you would drop <ResponsiveContainer> from Recharts */}
                         <div className="w-full h-48 bg-base-200/50 rounded-xl border border-dashed border-base-content/10 flex items-center justify-center opacity-40">
                            <span className="font-bold text-sm">Interactive Chart Area (Recharts)</span>
                         </div>
                    </div>

                    {/* The Payout Table */}
                    <PayoutsTable />
                </div>

                {/* Right Column: Transaction Feed (Span 1) */}
                <div className="lg:col-span-1">
                    <TransactionHistory />
                </div>
            </div>
        </div>
    );
}