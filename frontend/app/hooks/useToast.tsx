import React, { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle, AlertTriangle, AlertCircle, Info, X } from "lucide-react";

export type ToastType = "success" | "error" | "warning" | "info";

export interface Toast {
    id: string;
    message: string;
    type: ToastType;
    duration?: number;
}

interface ToastContextType {
    showToast: (message: string, type?: ToastType, duration?: number) => void;
    removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    const showToast = useCallback((message: string, type: ToastType = "info", duration = 4000) => {
        const id = Math.random().toString(36).substring(2, 9);
        setToasts((prev) => [...prev, { id, message, type, duration }]);

        if (duration > 0) {
            setTimeout(() => {
                removeToast(id);
            }, duration);
        }
    }, [removeToast]);

    return (
        <ToastContext.Provider value={{ showToast, removeToast }}>
            {children}
            <ToastContainer toasts={toasts} removeToast={removeToast} />
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error("useToast must be used within a ToastProvider");
    }
    return context;
}

function ToastContainer({ toasts, removeToast }: { toasts: Toast[]; removeToast: (id: string) => void }) {
    return (
        <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-3 w-full max-w-sm pointer-events-none">
            {toasts.map((toast) => (
                <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
            ))}
        </div>
    );
}

function ToastItem({ toast, onClose }: { toast: Toast; onClose: () => void }) {
    const typeConfigs = {
        success: {
            icon: <CheckCircle className="text-emerald-400" size={18} />,
            bg: "bg-emerald-950/80 border-emerald-500/30 text-emerald-200",
        },
        error: {
            icon: <AlertCircle className="text-rose-400" size={18} />,
            bg: "bg-rose-950/80 border-rose-500/30 text-rose-200",
        },
        warning: {
            icon: <AlertTriangle className="text-amber-400" size={18} />,
            bg: "bg-amber-950/80 border-amber-500/30 text-amber-200",
        },
        info: {
            icon: <Info className="text-sky-400" size={18} />,
            bg: "bg-sky-950/80 border-sky-500/30 text-sky-200",
        },
    };

    const config = typeConfigs[toast.type];

    return (
        <div
            className={`flex items-start gap-3 p-4 rounded-2xl border backdrop-blur-md shadow-2xl pointer-events-auto animate-in slide-in-from-right-10 fade-in duration-300 ${config.bg}`}
            role="alert"
        >
            <div className="mt-0.5 shrink-0">{config.icon}</div>
            <div className="flex-1 text-sm font-semibold tracking-tight">{toast.message}</div>
            <button
                onClick={onClose}
                className="text-base-content/50 hover:text-base-content transition-colors shrink-0 p-0.5 rounded-lg hover:bg-white/10"
                aria-label="Close notification"
            >
                <X size={14} />
            </button>
        </div>
    );
}
