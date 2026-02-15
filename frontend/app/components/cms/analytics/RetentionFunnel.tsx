import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const funnelData = [
    { stage: 'Started', students: 1200, percent: 100 },
    { stage: 'Mod 1', students: 1100, percent: 91 },
    { stage: 'Mod 2', students: 850, percent: 70 },
    { stage: 'Mod 3', students: 600, percent: 50 },
    { stage: 'Completed', students: 450, percent: 37 },
];

export const RetentionFunnel = () => {
    return (
        <div className="card  border border-base-content/5 shadow-sm h-87.5">
            <div className="card-body p-6">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h3 className="font-black text-lg">Course Drop-off</h3>
                        <p className="text-xs opacity-50">Where students stop watching.</p>
                    </div>
                    <div className="badge badge-error gap-1 font-bold text-xs">
                        -15% at Mod 2
                    </div>
                </div>

                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={funnelData} layout="vertical" margin={{ left: 20 }}>
                        <XAxis type="number" hide />
                        <YAxis 
                            dataKey="stage" 
                            type="category" 
                            width={80} 
                            tick={{ fontSize: 11, fontWeight: 'bold' }} 
                            axisLine={false}
                            tickLine={false}
                        />
                        <Tooltip 
                            cursor={{fill: 'transparent'}}
                            content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                    return (
                                        <div className="bg-base-100 p-3 shadow-xl rounded-xl border border-base-content/10 text-xs">
                                            <p className="font-black mb-1">{payload[0].payload.stage}</p>
                                            <p>{payload[0].payload.students} Students ({payload[0].payload.percent}%)</p>
                                        </div>
                                    );
                                }
                                return null;
                            }}
                        />
                        <Bar dataKey="students" radius={[0, 4, 4, 0]} barSize={30}>
                            {funnelData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={index === 0 ? 'var(--p)' : index === 4 ? 'var(--s)' : '#cbd5e1'} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};