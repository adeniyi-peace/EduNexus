import { Tooltip, ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, ZAxis } from 'recharts';

const data = [
  { hour: 'Morning', day: 'Mon', value: 10 }, { hour: 'Afternoon', day: 'Mon', value: 60 }, { hour: 'Evening', day: 'Mon', value: 30 },
  { hour: 'Morning', day: 'Tue', value: 20 }, { hour: 'Afternoon', day: 'Tue', value: 50 }, { hour: 'Evening', day: 'Tue', value: 80 },
  { hour: 'Morning', day: 'Wed', value: 15 }, { hour: 'Afternoon', day: 'Wed', value: 70 }, { hour: 'Evening', day: 'Wed', value: 40 },
  // ... more mock data would actally go here
];

export const EngagementHeatmap = () => {
    return (
        <div className="card border border-base-content/5 shadow-sm h-87.5">
            <div className="card-body p-6">
                <h3 className="font-black text-lg mb-2">Study Habits</h3>
                <p className="text-xs opacity-50 mb-4">When your students are most active.</p>

                <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                        <XAxis type="category" dataKey="day" name="Day" interval={0} tick={{ fontSize: 12 }} />
                        <YAxis type="category" dataKey="hour" name="Time" tick={{ fontSize: 12 }} />
                        <ZAxis type="number" dataKey="value" range={[50, 400]} name="Students" />
                        <Tooltip cursor={{ strokeDasharray: '3 3' }} wrapperStyle={{ zIndex: 100 }} content={({ payload }) => {
                            if (payload && payload.length) {
                                return (
                                    <div className="bg-base-100 p-2 border border-base-content/10 shadow-xl rounded-lg text-xs">
                                        <p className="font-bold">{payload[0].payload.day} - {payload[0].payload.hour}</p>
                                        <p className="opacity-70">{payload[0].value} Active Students</p>
                                    </div>
                                );
                            }
                            return null;
                        }} />
                        <Scatter data={data} fill="var(--p)" shape="circle" />
                    </ScatterChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};