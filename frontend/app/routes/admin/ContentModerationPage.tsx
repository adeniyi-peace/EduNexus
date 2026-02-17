import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import { ModerationStats } from "~/components/admin/moderation/ModerationStats";
import { ModerationFilters } from "~/components/admin/moderation/ModerationFilters";
import { ModerationCard } from "~/components/admin/moderation/ModerationCard";

const MOCK_REPORTS = [
    {
        id: "r1",
        type: "comment",
        content: "This course is a scam, don't buy it! Here is a link to a free version: [link]",
        reason: "Spam & External Links",
        reporter: "John Doe",
        author: "User_99",
        timestamp: "10 mins ago"
    },
    {
        id: "r2",
        type: "review",
        content: "The instructor doesn't know what they are talking about. Absolute idiot.",
        reason: "Personal Attack / Harassment",
        reporter: "Instructor Alex",
        author: "FrustratedDev",
        timestamp: "1 hour ago"
    }
];

export default function ContentModerationPage() {
    const [reports, setReports] = useState(MOCK_REPORTS);

    const handleAction = (id: string) => {
        setReports(prev => prev.filter(r => r.id !== id));
    };

    return (
        <div className="max-w-5xl mx-auto py-6 space-y-6">
            <header>
                <h1 className="text-3xl font-black tracking-tight">Content Moderation</h1>
                <p className="text-sm opacity-50 font-medium italic">Keep EduNexus safe and professional.</p>
            </header>

            <ModerationStats />
            <ModerationFilters />

            <div className="grid grid-cols-1 gap-6">
                <AnimatePresence mode="popLayout">
                    {reports.length > 0 ? (
                        reports.map((report) => (
                            <ModerationCard 
                                key={report.id} 
                                item={report as any} 
                            />
                        ))
                    ) : (
                        <div className="py-24 text-center bg-base-100 rounded-3xl border-2 border-dashed border-base-content/10">
                            <div className="w-16 h-16 bg-success/10 text-success rounded-full flex items-center justify-center mx-auto mb-4">
                                <ShieldCheck size={32} />
                            </div>
                            <h3 className="text-xl font-black">Clean Slate!</h3>
                            <p className="opacity-50">The moderation queue is currently empty.</p>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}