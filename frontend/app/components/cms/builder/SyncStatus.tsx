// components/builder/SyncStatus.tsx
import { CloudCheck, CloudUpload, Loader2, AlertCircle } from "lucide-react";

interface SyncStatusProps {
    status: 'idle' | 'saving' | 'error';
    lastSaved?: Date;
}

export function SyncStatus({ status, lastSaved }: SyncStatusProps) {
    return (
        <div className="flex items-center gap-3 px-4 py-1.5 bg-white/5 border border-white/5 rounded-full backdrop-blur-md">
            {status === 'saving' && (
                <>
                    <Loader2 size={12} className="text-primary animate-spin" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-primary">
                        Syncing_Changes...
                    </span>
                </>
            )}

            {status === 'idle' && (
                <>
                    <CloudCheck size={14} className="text-emerald-400 opacity-60" />
                    <span className="text-[9px] font-black uppercase tracking-widest opacity-40">
                        All_Changes_Saved
                    </span>
                </>
            )}

            {status === 'error' && (
                <>
                    <AlertCircle size={14} className="text-error" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-error">
                        Sync_Failed
                    </span>
                </>
            )}
        </div>
    );
}