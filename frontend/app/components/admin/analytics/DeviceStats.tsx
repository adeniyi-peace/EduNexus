import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Smartphone, Monitor, Tablet } from "lucide-react";

interface DeviceStat {
    name: string;
    value: number;
}

export const DeviceStats = ({ stats = [] }: { stats?: DeviceStat[] }) => {
    // Map backend categories to our UI structure
    const config = {
        'Desktop': { color: '#3b82f6', icon: Monitor },
        'Mobile': { color: '#ec4899', icon: Smartphone },
        'Tablet': { color: '#8b5cf6', icon: Tablet },
        'Other': { color: '#94a3b8', icon: Monitor }
    };

    const displayData = stats.length > 0 ? stats.map(s => ({
        name: s.name,
        value: s.value,
        color: (config as any)[s.name]?.color || config.Other.color,
        icon: (config as any)[s.name]?.icon || config.Other.icon
    })) : [
        { name: 'No Data', value: 100, color: '#e2e8f0', icon: Monitor }
    ];

    const mainStat = displayData[0];

    return (
        <div className="card border border-base-content/5 shadow-sm h-87.5">
             <div className="card-body p-6 flex flex-col items-center justify-center">
                <h3 className="font-black text-lg self-start w-full">Device Usage</h3>
                
                <div className="w-full h-50 relative">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={displayData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {displayData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                    {/* Center Text Overlay */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                        <span className="text-3xl font-black">{mainStat.value}%</span>
                        <p className="text-[10px] uppercase opacity-50 font-bold">{mainStat.name}</p>
                    </div>
                </div>

                <div className="flex justify-center flex-wrap gap-4 mt-4 w-full">
                    {displayData.filter(d => d.name !== 'No Data').map((stat, i) => (
                        <div key={i} className="flex flex-col items-center gap-1">
                            <stat.icon size={16} style={{ color: stat.color }} />
                            <span className="text-xs font-bold">{stat.value}%</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};