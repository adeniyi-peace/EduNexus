import { BookOpen, FileEdit, EyeOff, CheckCircle } from "lucide-react";
import type { AdminCourse } from "~/types/admin";

interface Props {
    data: AdminCourse[];
    isLoading?: boolean;
}

export const CourseStats = ({ data, isLoading }: Props) => {
    const STATS = [
        { label: "Total Courses", value: isLoading ? "..." : data.length.toString(), icon: BookOpen, color: "text-primary" },
        { label: "Published", value: isLoading ? "..." : data.filter(c => c.status === 'Published').length.toString(), icon: CheckCircle, color: "text-success" },
        { label: "Drafts", value: isLoading ? "..." : data.filter(c => c.status === 'Draft').length.toString(), icon: FileEdit, color: "text-warning" },
        { label: "Pending Review", value: isLoading ? "..." : data.filter(c => c.status === 'PendingApproval').length.toString(), icon: EyeOff, color: "text-info" },
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