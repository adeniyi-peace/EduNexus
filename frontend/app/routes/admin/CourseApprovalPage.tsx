import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import type { PendingCourse } from "~/types/course";
import { ApprovalFilters } from "~/components/admin/course_approval/ApprovalFilters";
import { CourseReviewCard } from "~/components/admin/course_approval/CourseReviewCard";

const MOCK_PENDING: PendingCourse[] = [
    {
        id: "c1",
        title: "Mastering React Server Components",
        instructor: { name: "Dr. Angela Yu", avatar: "https://i.pravatar.cc/100?u=angela", rating: 4.9 },
        category: "Development",
        price: 89.99,
        submittedAt: "2 hours ago",
        thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400",
        description: "Deep dive into RSC and the Next.js App Router.",
        modulesCount: 12
    },
    {
        id: "c2",
        title: "Advanced Figma for SaaS",
        instructor: { name: "Gary Simon", avatar: "https://i.pravatar.cc/100?u=gary", rating: 4.7 },
        category: "Design",
        price: 49.00,
        submittedAt: "5 hours ago",
        thumbnail: "https://images.unsplash.com/photo-1541462608141-ad511a7ee596?w=400",
        description: "Scale your design systems with variables and auto-layout.",
        modulesCount: 8
    }
];

export default function CourseApprovalPage() {
    const [queue, setQueue] = useState<PendingCourse[]>(MOCK_PENDING);

    const handleAction = (id: string, type: 'approve' | 'reject') => {
        // Here you would trigger your React Router action or Fetcher
        setQueue(prev => prev.filter(c => c.id !== id));
        console.log(`${type}d course: ${id}`);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <ApprovalFilters count={queue.length} />

            <div className="grid grid-cols-1 gap-4">
                <AnimatePresence mode="popLayout">
                    {queue.length > 0 ? (
                        queue.map((course) => (
                            <CourseReviewCard 
                                key={course.id}
                                course={course}
                                onApprove={(id) => handleAction(id, 'approve')}
                                onReject={(id) => handleAction(id, 'reject')}
                            />
                        ))
                    ) : (
                        <div className="py-20 text-center bg-base-100 rounded-3xl border-2 border-dashed border-base-content/10">
                            <div className="text-5xl mb-4">🎉</div>
                            <h3 className="text-xl font-black">All Caught Up!</h3>
                            <p className="opacity-50">No new courses require review at this time.</p>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}