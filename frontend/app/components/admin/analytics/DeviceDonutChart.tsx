import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const data = [
    { name: 'Desktop', value: 550 },
    { name: 'Mobile', value: 380 },
    { name: 'Tablet', value: 120 },
];

const COLORS = ['oklch(var(--p))', 'oklch(var(--s))', 'oklch(var(--a))'];

export const DeviceDonutChart = () => {
    return (
        <div className="w-full h-64">
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
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', fontWeight: 'bold' }}
                    />
                    <Legend 
                        verticalAlign="bottom" 
                        align="center"
                        iconType="circle"
                        formatter={(value) => <span className="text-xs font-black opacity-70 uppercase tracking-tighter">{value}</span>}
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};