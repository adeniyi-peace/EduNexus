import { BookOpen, FileEdit, EyeOff, CheckCircle } from "lucide-react";

export const CourseStats = () => {
    const STATS = [
        { label: "Total Courses", value: "1,248", icon: BookOpen, color: "text-primary" },
        { label: "Published", value: "1,102", icon: CheckCircle, color: "text-success" },
        { label: "Drafts", value: "84", icon: FileEdit, color: "text-warning" },
        { label: "Private", value: "62", icon: EyeOff, color: "text-error" },
    ];

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {STATS.map((stat, i) => (
                <div key={i} className="bg-base-100 border border-base-content/5 rounded-2xl p-4 flex items-center gap-4">
                    <div className={`p-3 rounded-xl bg-base-200 ${stat.color}`}>
                        <stat.icon size={20} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase opacity-40 tracking-widest leading-none mb-1">{stat.label}</p>
                        <p className="text-xl font-black tracking-tighter">{stat.value}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};