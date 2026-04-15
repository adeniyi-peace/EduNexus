import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { PendingCourse } from "~/types/admin";
import { ApprovalFilters } from "~/components/admin/course_approval/ApprovalFilters";
import { CourseReviewCard } from "~/components/admin/course_approval/CourseReviewCard";
import { usePendingApprovals, useApproveCourse, useRejectCourse } from "~/hooks/admin/usePendingApprovals";
import { AdminTableSkeleton, AdminErrorState } from "~/components/admin/shared/AdminTableSkeleton";
import { ShieldCheck } from "lucide-react";

export const meta = () => {
  return [
    { title: "Course Approval | EduNexus" },
    { name: "description", content: "Course Approval Page" },
  ];
};

export default function CourseApprovalPage() {
    const { data, isLoading, isError, refetch } = usePendingApprovals();
    const approveMutation = useApproveCourse();
    const rejectMutation = useRejectCourse();

    const [optimisticQueue, setOptimisticQueue] = useState<string[]>([]);

    const handleApprove = async (id: string) => {
        setOptimisticQueue(prev => [...prev, id]);
        try {
            await approveMutation.mutateAsync(id);
        } catch {
            setOptimisticQueue(prev => prev.filter(x => x !== id));
        }
    };

    const handleReject = async (id: string, reason?: string) => {
        if (!reason) reason = "Does not meet platform standards.";
        setOptimisticQueue(prev => [...prev, id]);
        try {
            await rejectMutation.mutateAsync({ courseId: id, reason });
        } catch {
            setOptimisticQueue(prev => prev.filter(x => x !== id));
        }
    };

    // Filter out optimistically-removed courses for instant UI feedback
    const queue: PendingCourse[] = (data?.results ?? []).filter(
        c => !optimisticQueue.includes(c.id)
    );

    if (isError) {
        return (
            <div className="max-w-4xl mx-auto pt-8">
                <AdminErrorState message="Could not load pending courses." onRetry={refetch} />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <ApprovalFilters count={queue.length} />

            {isLoading ? (
                <AdminTableSkeleton rows={3} columns={4} />
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    <AnimatePresence mode="popLayout">
                        {queue.length > 0 ? (
                            queue.map((course) => (
                                <CourseReviewCard
                                    key={course.id}
                                    course={course}
                                    onApprove={(id) => handleApprove(id)}
                                    onReject={(id) => handleReject(id)}
                                />
                            ))
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="py-20 text-center bg-base-100 rounded-3xl border-2 border-dashed border-base-content/10"
                            >
                                <div className="w-16 h-16 bg-success/10 text-success rounded-full flex items-center justify-center mx-auto mb-4">
                                    <ShieldCheck size={32} />
                                </div>
                                <h3 className="text-xl font-black">All Caught Up!</h3>
                                <p className="opacity-50">No new courses require review at this time.</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
}