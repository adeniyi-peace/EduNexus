import { WifiOff, RefreshCw } from "lucide-react";

export default function OfflinePage() {
    return (
        <div className="min-h-screen bg-base-100 flex flex-col items-center justify-center p-6 text-center">
            
            <div className="w-24 h-24 bg-base-200 rounded-full flex items-center justify-center mb-6">
                <WifiOff size={40} className="text-base-content/40" />
            </div>

            <h2 className="text-2xl font-black tracking-tight mb-2">No Internet Connection</h2>
            <p className="opacity-50 max-w-xs mx-auto mb-8">
                Please check your network settings and try again. Your progress is saved locally.
            </p>

            <button 
                onClick={() => window.location.reload()} 
                className="btn btn-primary btn-wide gap-2 shadow-lg shadow-primary/20"
            >
                <RefreshCw size={18} /> Retry Connection
            </button>
        </div>
    );
}