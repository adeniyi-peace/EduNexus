import { 
    Lock, 
    CheckCircle2, 
    ArrowRight, 
    ShieldCheck, 
    Terminal, 
    Trophy 
} from "lucide-react";

interface PaywallModalProps {
    isOpen: boolean;
    onClose: () => void;
    courseTitle: string;
    price: number;
}

export function PaywallModal({ isOpen, onClose, courseTitle, price }: PaywallModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
            {/* Backdrop with heavy blur for focus */}
            <div 
                className="absolute inset-0 bg-neutral/80 backdrop-blur-md animate-in fade-in duration-300" 
                onClick={onClose} 
            />
            
            {/* Modal Container */}
            <div className="relative bg-base-100 w-full max-w-2xl rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                
                {/* Visual Header */}
                <div className="relative h-32 bg-primary flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 opacity-20 bg-[matrix(1,0,0,1,0,0)] bg-[radial-gradient(#fff_1px,transparent_1px)] bg-size-[20px_20px]" />
                    <div className="relative z-10 bg-base-100 p-4 rounded-3xl shadow-xl">
                        <Lock className="text-primary" size={32} />
                    </div>
                </div>

                <div className="p-8 lg:p-12">
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 text-secondary text-[10px] font-black uppercase tracking-widest mb-4">
                            <ShieldCheck size={12} />
                            Access Restricted
                        </div>
                        <h2 className="text-3xl lg:text-4xl font-black italic tracking-tighter mb-4 leading-tight">
                            Upgrade your <span className="text-primary underline decoration-primary/30">Session</span>
                        </h2>
                        <p className="text-base-content/60 font-medium">
                            You've finished the public preview for <span className="text-base-content font-bold">{courseTitle}</span>. 
                            Enroll to unlock the full architectural schematic.
                        </p>
                    </div>

                    {/* Value Proposition Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                        {[
                            { icon: <Terminal size={18} />, text: "Full Source Code Access" },
                            { icon: <Trophy size={18} />, text: "Verifiable On-Chain Certificate" },
                            { icon: <CheckCircle2 size={18} />, text: "Direct Mentor Q&A" },
                            { icon: <CheckCircle2 size={18} />, text: "Advanced Quiz Modules" },
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-3 p-4 bg-base-200/50 rounded-2xl border border-base-content/5">
                                <div className="text-primary">{item.icon}</div>
                                <span className="text-sm font-bold opacity-80">{item.text}</span>
                            </div>
                        ))}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-4">
                        <button className="btn btn-primary btn-lg h-20 rounded-2xl font-black uppercase tracking-widest flex items-center justify-between px-8 group">
                            <div className="text-left">
                                <p className="text-[10px] opacity-60">Full Lifetime Access</p>
                                <p className="text-xl">Enroll Now — ${price}</p>
                            </div>
                            <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                        </button>
                        
                        <button 
                            onClick={onClose}
                            className="btn btn-ghost hover:bg-base-200 rounded-xl text-xs font-black uppercase tracking-[0.2em] opacity-40 hover:opacity-100"
                        >
                            Return to Previews
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}