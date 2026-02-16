import { motion, AnimatePresence } from "framer-motion";
import { Check, X, Trash2, FolderEdit } from "lucide-react";

export const BulkActionBar = ({ selectedCount }: { selectedCount: number }) => {
    return (
        <AnimatePresence>
            {selectedCount > 0 && (
                <motion.div 
                    initial={{ y: 100, x: "-50%" }}
                    animate={{ y: -20, x: "-50%" }}
                    exit={{ y: 100, x: "-50%" }}
                    className="fixed bottom-0 left-1/2 z-50 bg-neutral text-neutral-content px-6 py-4 rounded-2xl shadow-2xl border border-white/10 flex items-center gap-8 min-w-100"
                >
                    <div className="flex items-center gap-3 border-r border-white/10 pr-6">
                        <span className="bg-primary text-primary-content w-6 h-6 rounded-full flex items-center justify-center text-xs font-black">
                            {selectedCount}
                        </span>
                        <span className="text-xs font-black uppercase tracking-widest">Courses Selected</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <button className="btn btn-sm btn-ghost gap-2 text-xs hover:bg-white/10">
                            <Check size={14} /> Publish
                        </button>
                        <button className="btn btn-sm btn-ghost gap-2 text-xs hover:bg-white/10">
                            <FolderEdit size={14} /> Move
                        </button>
                        <button className="btn btn-sm btn-error gap-2 text-xs">
                            <Trash2 size={14} /> Delete
                        </button>
                    </div>

                    <button className="btn btn-circle btn-xs btn-ghost ml-4">
                        <X size={14} />
                    </button>
                </motion.div>
            )}
        </AnimatePresence>
    );
};