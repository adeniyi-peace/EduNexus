import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import { ModerationStats } from "~/components/admin/moderation/ModerationStats";
import { ModerationFilters } from "~/components/admin/moderation/ModerationFilters";
import { ModerationCard } from "~/components/admin/moderation/ModerationCard";
import { useContentReports, useDismissReport, useRemoveReview } from "~/hooks/admin/useContentReports";
import { AdminTableSkeleton, AdminErrorState } from "~/components/admin/shared/AdminTableSkeleton";

export default function ContentModerationPage() {
    const { data, isLoading, isError, refetch } = useContentReports();
    const dismissMutation = useDismissReport();
    const removeMutation = useRemoveReview();

    // Optimistic removal — instantly hide dismissed/removed items
    const [dismissedIds, setDismissedIds] = useState<number[]>([]);

    const handleDismiss = async (id: number) => {
        setDismissedIds(prev => [...prev, id]);
        try {
            await dismissMutation.mutateAsync(id);
        } catch {
            setDismissedIds(prev => prev.filter(x => x !== id));
        }
    };

    const handleRemove = async (id: number) => {
        setDismissedIds(prev => [...prev, id]);
        try {
            await removeMutation.mutateAsync(id);
        } catch {
            setDismissedIds(prev => prev.filter(x => x !== id));
        }
    };

    const visibleReports = (data?.results ?? []).filter(r => !dismissedIds.includes(r.id));

    return (
        <div className="max-w-5xl mx-auto py-6 space-y-6">
            <header>
                <h1 className="text-3xl font-black tracking-tight">Content Moderation</h1>
                <p className="text-sm opacity-50 font-medium italic">Keep EduNexus safe and professional.</p>
            </header>

            {/* Stats — pass real data from API or loading state */}
            <ModerationStats
                totalFlagged={data?.stats.totalFlagged ?? 0}
                resolvedToday={data?.stats.resolvedToday ?? 0}
                pendingReview={data?.stats.pendingReview ?? 0}
                isLoading={isLoading}
            />

            <ModerationFilters />

            {isError ? (
                <AdminErrorState message="Could not load moderation queue." onRetry={refetch} />
            ) : isLoading ? (
                <AdminTableSkeleton rows={3} columns={5} />
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    <AnimatePresence mode="popLayout">
                        {visibleReports.length > 0 ? (
                            visibleReports.map((report) => (
                                <ModerationCard
                                    key={report.id}
                                    item={report as any}
                                    onDismiss={() => handleDismiss(report.id)}
                                    onRemove={() => handleRemove(report.id)}
                                />
                            ))
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="py-24 text-center bg-base-100 rounded-3xl border-2 border-dashed border-base-content/10"
                            >
                                <div className="w-16 h-16 bg-success/10 text-success rounded-full flex items-center justify-center mx-auto mb-4">
                                    <ShieldCheck size={32} />
                                </div>
                                <h3 className="text-xl font-black">Clean Slate!</h3>
                                <p className="opacity-50">The moderation queue is currently empty.</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
}