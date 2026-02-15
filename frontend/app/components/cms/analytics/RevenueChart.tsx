import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Download } from "lucide-react";

const data = [
    { name: 'Mon', revenue: 1200, students: 24 },
    { name: 'Tue', revenue: 2100, students: 13 },
    { name: 'Wed', revenue: 800, students: 98 },
    { name: 'Thu', revenue: 1600, students: 39 },
    { name: 'Fri', revenue: 2300, students: 48 },
    { name: 'Sat', revenue: 3400, students: 38 },
    { name: 'Sun', revenue: 2800, students: 43 },
];

export const RevenueChart = () => {
    return (
        <div className="card border border-base-content/5 shadow-sm h-100">
            <div className="card-body p-0 sm:p-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 px-6 pt-6 sm:px-0 sm:pt-0 gap-4">
                    <div>
                        <h3 className="font-black text-lg">Revenue Trends</h3>
                        <p className="text-xs opacity-50">Income performance over time.</p>
                    </div>
                    <div className="flex items-center gap-2">
                         <select className="select select-sm select-bordered font-bold text-xs uppercase focus:outline-hidden">
                            <option>Last 7 Days</option>
                            <option>Last 30 Days</option>
                            <option>This Year</option>
                        </select>
                        <button className="btn btn-sm btn-square btn-ghost border border-base-content/10">
                            <Download size={14} className="opacity-60" />
                        </button>
                    </div>
                </div>

                {/* Chart Area */}
                <div className="w-full h-70 sm:h-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="var(--p)" stopOpacity={0.2}/>
                                    <stop offset="95%" stopColor="var(--p)" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.05} />
                            <XAxis 
                                dataKey="name" 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{fontSize: 12, fill: 'currentColor', opacity: 0.4}} 
                                dy={10}
                            />
                            <YAxis 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{fontSize: 12, fill: 'currentColor', opacity: 0.4}} 
                                tickFormatter={(value) => `$${value}`}
                            />
                            <Tooltip 
                                contentStyle={{ 
                                    backgroundColor: 'var(--b1)', 
                                    borderRadius: '12px', 
                                    border: '1px solid rgba(0,0,0,0.05)',
                                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' 
                                }}
                                cursor={{ stroke: 'var(--p)', strokeWidth: 2, opacity: 0.5 }}
                            />
                            <Area 
                                type="monotone" 
                                dataKey="revenue" 
                                stroke="var(--p)" 
                                strokeWidth={3}
                                fillOpacity={1} 
                                fill="url(#colorRevenue)" 
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};