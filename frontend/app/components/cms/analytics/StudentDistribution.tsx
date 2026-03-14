import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

export const StudentDistribution = ({ data = [] }: { data?: any[] }) => {
    return (
        <div className="card bg-base-100 border border-base-content/5 shadow-sm h-full min-h-[350px]">
            <div className="card-body p-6">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h3 className="font-black text-lg">Student Progress</h3>
                        <p className="text-xs opacity-50">Distribution of course completion.</p>
                    </div>
                </div>

                <div className="h-[250px] w-full relative">
                    {(!data || data.length === 0 || data.every(d => d.value === 0)) ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center opacity-30 select-none">
                            <p className="font-black text-sm uppercase tracking-widest">No Progress Data</p>
                            <p className="text-[10px] font-bold text-center">Students haven't started<br/>the curriculum yet.</p>
                        </div>
                    ) : (
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={data}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {data.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip 
                                    contentStyle={{ 
                                        borderRadius: '12px', 
                                        border: 'none', 
                                        boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' 
                                    }}
                                />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </div>
        </div>
    );
};
