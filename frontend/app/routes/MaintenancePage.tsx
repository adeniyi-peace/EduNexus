import { Hammer, Clock, ArrowRight } from "lucide-react";

export default function MaintenancePage() {
    return (
        <div className="min-h-screen bg-base-200 flex flex-col items-center justify-center p-6 text-center">
            
            {/* Animated Construction Icon */}
            <div className="relative mb-8">
                <div className="absolute inset-0 bg-warning/20 blur-2xl rounded-full animate-pulse" />
                <Hammer size={80} className="text-warning relative z-10 animate-bounce" />
            </div>

            <h1 className="text-4xl font-black tracking-tight mb-4">Under Maintenance</h1>
            
            <p className="text-lg opacity-60 max-w-md mx-auto mb-8 font-medium">
                We're currently upgrading the EduNexus database to make your learning experience faster.
            </p>

            {/* Status Card */}
            <div className="card bg-base-100 border border-base-content/10 shadow-xl w-full max-w-sm p-6">
                <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-base-200 rounded-xl">
                        <Clock size={24} className="text-primary" />
                    </div>
                    <div className="text-left">
                        <p className="text-xs font-bold uppercase opacity-50">Estimated Return</p>
                        <p className="font-black text-xl">2:00 PM EST</p>
                    </div>
                </div>
                
                <div className="w-full bg-base-200 rounded-full h-2 mb-2 overflow-hidden">
                    <div className="bg-warning h-2 rounded-full w-2/3 animate-pulse" />
                </div>
                <p className="text-xs text-left opacity-50 font-medium">System Update: 65% Complete</p>
            </div>

            <div className="mt-8 flex gap-4 text-sm font-bold opacity-50 hover:opacity-100 transition-opacity cursor-pointer">
                <a href="https://twitter.com/edunexus" target="_blank" className="flex items-center gap-1 hover:text-primary">
                    Check updates on Twitter <ArrowRight size={14} />
                </a>
            </div>
        </div>
    );
}