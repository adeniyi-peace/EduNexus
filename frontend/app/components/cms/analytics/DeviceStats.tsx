import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Smartphone, Monitor, Tablet } from "lucide-react";

const deviceData = [
    { name: 'Desktop', value: 65, color: 'var(--p)' },
    { name: 'Mobile', value: 25, color: 'var(--s)' },
    { name: 'Tablet', value: 10, color: 'var(--a)' },
];

export const DeviceStats = () => {
    return (
        <div className="card border border-base-content/5 shadow-sm h-87.5">
             <div className="card-body p-6 flex flex-col items-center justify-center">
                <h3 className="font-black text-lg self-start w-full">Device Usage</h3>
                
                <div className="w-full h-50 relative">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={deviceData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {deviceData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                    {/* Center Text Overlay */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                        <span className="text-3xl font-black">65%</span>
                        <p className="text-[10px] uppercase opacity-50 font-bold">Desktop</p>
                    </div>
                </div>

                <div className="flex justify-center gap-4 mt-4 w-full">
                    <div className="flex flex-col items-center gap-1">
                        <Monitor size={16} className="text-primary" />
                        <span className="text-xs font-bold">65%</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                        <Smartphone size={16} className="text-secondary" />
                        <span className="text-xs font-bold">25%</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                        <Tablet size={16} className="text-accent" />
                        <span className="text-xs font-bold">10%</span>
                    </div>
                </div>
            </div>
        </div>
    );
};