import { 
    LineChart, 
    Line, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer, 
    Area, 
    AreaChart 
} from 'recharts';

interface Props {
    data: { name: string; enrollments: number }[];
}

export const EngagementLineChart = ({ data }: Props) => {
    return (
        <div className="w-full h-80">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                    <defs>
                        <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="oklch(var(--p))" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="oklch(var(--p))" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="oklch(var(--bc) / 0.1)" />
                    <XAxis 
                        dataKey="name" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fontSize: 10, fontWeight: 700, fill: 'oklch(var(--bc) / 0.5)' }} 
                        dy={10}
                    />
                    <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fontSize: 10, fontWeight: 700, fill: 'oklch(var(--bc) / 0.5)' }} 
                    />
                    <Tooltip 
                        contentStyle={{ 
                            backgroundColor: 'oklch(var(--b1))', 
                            borderRadius: '12px', 
                            border: '1px solid oklch(var(--bc) / 0.1)',
                            boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
                        }} 
                        itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                    />
                    <Area 
                        type="monotone" 
                        dataKey="enrollments" 
                        stroke="oklch(var(--p))" 
                        strokeWidth={3}
                        fillOpacity={1} 
                        fill="url(#colorUsers)" 
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};