import { Layers } from "lucide-react";

interface InitializationOverlayProps {
    onOpenSettings: () => void;
    error: string | null;
}

export function InitializationOverlay({ onOpenSettings, error }: InitializationOverlayProps) {
    return (
        <div className="absolute inset-0 z-[100] bg-base-100 flex flex-col items-center justify-center p-6 text-center overflow-hidden">
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                 style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
            
            <div className="relative space-y-8 max-w-sm animate-in fade-in slide-in-from-bottom-8 duration-1000">
                <div className="w-24 h-24 bg-primary/10 rounded-[2.5rem] mx-auto flex items-center justify-center text-primary shadow-2xl shadow-primary/20">
                    <Layers size={40} className="animate-pulse" />
                </div>
                
                <div className="space-y-4">
                    <h2 className="text-2xl font-black italic uppercase tracking-tighter">Initializing_Course_Nexus</h2>
                    
                    {error ? (
                        <div className="bg-error/10 border border-error/20 p-4 rounded-2xl flex items-center gap-3 animate-in shake duration-500">
                            <div className="w-8 h-8 rounded-full bg-error/20 flex items-center justify-center shrink-0">
                                <span className="text-error font-black">!</span>
                            </div>
                            <p className="text-[10px] text-error font-bold uppercase tracking-widest text-left">
                                {error}
                            </p>
                        </div>
                    ) : (
                        <p className="text-xs opacity-40 font-medium leading-relaxed italic">
                            Establish your course core records to begin architectural deployment. 
                        </p>
                    )}
                </div>

                <div className="flex flex-col gap-3">
                    <button 
                        onClick={onOpenSettings}
                        className={`
                            btn h-14 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl transition-all
                            ${error ? 'btn-error shadow-error/20' : 'btn-primary shadow-primary/20'}
                        `}
                    >
                        {error ? 'Retry_Initialization' : 'Setup_Course_Core'}
                    </button>
                </div>
            </div>
        </div>
    );
}
