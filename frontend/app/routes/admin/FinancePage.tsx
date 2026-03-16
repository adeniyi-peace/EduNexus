import { useState } from "react";
import { DollarSign, Download } from "lucide-react";
import { FinanceStats } from "~/components/admin/revenue/FinanceStats";
import { PayoutsTable } from "~/components/admin/revenue/PayoutsTable";
import { TransactionHistory } from "~/components/admin/revenue/TransactionHistory";
import { useAdminFinance } from "~/hooks/admin/useAdminFinance";
import { AdminStatSkeleton, AdminTableSkeleton, AdminErrorState } from "~/components/admin/shared/AdminTableSkeleton";

export default function FinancePage() {
    const [txPage, setTxPage] = useState(1);
    const { data, isLoading, isError, refetch } = useAdminFinance({ page: txPage, page_size: 10 });

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
                        <p className="text-sm opacity-50 font-medium">
                            {data ? `${data.stats.totalTransactions.toLocaleString()} transactions • ${data.stats.totalRevenueFormatted} total` : "Track revenue, manage payouts, and analyze growth."}
                        </p>
                    </div>
                </div>
                <button className="btn btn-outline btn-sm gap-2">
                    <Download size={16} /> Monthly Report
                </button>
            </div>

            {/* 1. Key Metrics */}
            {isError ? (
                <AdminErrorState message="Could not load finance data." onRetry={refetch} />
            ) : isLoading ? (
                <AdminStatSkeleton count={3} />
            ) : (
                <FinanceStats stats={data?.stats} />
            )}

            {/* 2. Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Column: Revenue Chart + Payouts */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Revenue Chart */}
                    <div className="card bg-base-100 border border-base-content/5 shadow-sm p-6">
                        <div className="font-black text-lg mb-4">Revenue Trends</div>
                        {isLoading ? (
                            <div className="h-48 bg-base-300 rounded-xl animate-pulse" />
                        ) : (
                            <div className="flex items-end justify-between h-48 w-full gap-2">
                                {data?.revenueChart.map((point) => {
                                    const maxVal = Math.max(...(data.revenueChart.map(p => p.revenue)), 1);
                                    const revH = Math.max((point.revenue / maxVal) * 100, 4);
                                    const payH = Math.max(((point.payout ?? 0) / maxVal) * 100, 4);
                                    return (
                                        <div key={point.name} className="flex-1 flex flex-col items-center gap-1 group">
                                            <div className="w-full flex gap-1 items-end" style={{ height: "160px" }}>
                                                <div className="flex-1 bg-primary/20 hover:bg-primary rounded-sm transition-all" style={{ height: `${revH}%` }} title={`Revenue: $${point.revenue.toFixed(0)}`} />
                                                <div className="flex-1 bg-success/20 hover:bg-success rounded-sm transition-all" style={{ height: `${payH}%` }} title={`Payout: $${(point.payout ?? 0).toFixed(0)}`} />
                                            </div>
                                            <span className="text-[10px] font-bold opacity-40">{point.name}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                        <div className="flex gap-4 mt-3 text-xs font-bold opacity-50">
                            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-primary/40 inline-block" /> Revenue</span>
                            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-success/40 inline-block" /> Instructor Payout</span>
                        </div>
                    </div>

                    {/* Payout Table */}
                    {isLoading ? (
                        <AdminTableSkeleton rows={5} columns={5} />
                    ) : (
                        <PayoutsTable payouts={data?.payouts ?? []} />
                    )}
                </div>

                {/* Right Column: Transaction Feed */}
                <div className="lg:col-span-1">
                    {isLoading ? (
                        <AdminTableSkeleton rows={8} columns={3} />
                    ) : (
                        <TransactionHistory
                            transactions={data?.transactions.results ?? []}
                            totalCount={data?.transactions.count ?? 0}
                            page={txPage}
                            onPageChange={setTxPage}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}