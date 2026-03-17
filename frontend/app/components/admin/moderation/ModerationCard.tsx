import { motion } from "framer-motion";
import { ThumbsUp, Trash2, ShieldAlert, UserX, MessageSquare } from "lucide-react";
import type { ContentReport } from "~/types/admin";

interface Props {
    item: ContentReport;
    onDismiss: () => void;
    onRemove: () => void;
}

export const ModerationCard = ({ item, onDismiss, onRemove }: Props) => {
    return (
        <motion.div 
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="card bg-base-100 border border-base-content/5 shadow-sm group"
        >
            <div className="p-0 flex flex-col md:flex-row">
                {/* Left Side: The "Incident" Context */}
                <div className="p-6 flex-1 border-b md:border-b-0 md:border-r border-base-content/5">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="badge badge-error badge-outline font-black text-[10px] uppercase">
                            {item.targetType}
                        </div>
                        <span className="text-[10px] font-bold opacity-40 uppercase tracking-widest">
                            Reported {new Date(item.createdAt).toLocaleDateString()}
                        </span>
                    </div>

                    <div className="bg-base-200/50 rounded-2xl p-4 mb-4 border border-base-content/5 italic text-sm text-base-content/80">
                        "{item.targetContent}"
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="avatar placeholder">
                            <div className="bg-neutral text-neutral-content rounded-full w-6">
                                <span className="text-[10px]">{item.authorName.charAt(0)}</span>
                            </div>
                        </div>
                        <span className="text-xs font-bold">Author: <span className="text-primary">{item.authorName}</span></span>
                    </div>
                </div>

                {/* Right Side: The Report Details & Actions */}
                <div className="p-6 w-full md:w-80 bg-base-200/20 flex flex-col justify-between">
                    <div>
                        <p className="text-[10px] font-black uppercase opacity-40 mb-2">Report Reason</p>
                        <div className="flex items-start gap-2 text-error mb-4">
                            <ShieldAlert size={16} className="shrink-0" />
                            <p className="text-sm font-bold leading-tight">{item.reason}</p>
                        </div>
                        <p className="text-xs font-medium opacity-60">
                            Reported by: <span className="font-bold text-base-content">{item.reporterName}</span>
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-6">
                        <button className="btn btn-sm btn-ghost gap-2 border border-base-content/10" onClick={onDismiss}>
                            <ThumbsUp size={14} /> Dismiss
                        </button>
                        <button className="btn btn-sm btn-error gap-2" onClick={onRemove}>
                            <Trash2 size={14} /> Delete
                        </button>
                        <button className="btn btn-sm btn-outline btn-error col-span-2 gap-2">
                            <UserX size={14} /> Ban User
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};