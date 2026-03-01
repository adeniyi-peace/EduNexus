import { useEffect } from "react";
import { useSearchParams, Link } from "react-router";
import { Check, ArrowRight, Download, PlayCircle, ShieldCheck } from "lucide-react";
import confetti from "canvas-confetti";

export default function CheckoutSuccessPage() {
    const [searchParams] = useSearchParams();
    const reference = searchParams.get("reference") || "N/A";

    useEffect(() => {
        // Trigger a sophisticated confetti burst
        const duration = 3 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

        const interval: any = setInterval(function() {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
        }, 250);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
            <div className="max-w-2xl w-full text-center space-y-8">
                
                {/* 1. Animated Success Icon */}
                <div className="relative mx-auto w-24 h-24">
                    <div className="absolute inset-0 bg-success/20 rounded-full animate-ping" />
                    <div className="relative w-24 h-24 bg-success text-success-content rounded-full flex items-center justify-center shadow-2xl shadow-success/40 animate-fade-in">
                        <Check size={48} strokeWidth={3} />
                    </div>
                </div>

                {/* 2. Headline */}
                <div className="space-y-2 animate-slide-up">
                    <h1 className="text-5xl font-black tracking-tighter italic">
                        Welcome to the <span className="text-primary">Nexus</span>.
                    </h1>
                    <p className="text-lg font-bold opacity-60">
                        Your payment was successful and your seat is reserved.
                    </p>
                </div>

                {/* 3. Transaction Card */}
                <div className="card bg-base-100 border border-base-content/5 shadow-2xl p-8 space-y-6 animate-slide-up [animation-delay:200ms]">
                    <div className="grid grid-cols-2 gap-4 text-left">
                        <div className="space-y-1">
                            <p className="text-[10px] font-black uppercase opacity-40 tracking-widest">Order Reference</p>
                            <p className="font-mono text-sm font-bold bg-base-200 px-2 py-1 rounded-md w-fit">
                                {reference}
                            </p>
                        </div>
                        <div className="space-y-1 text-right">
                            <p className="text-[10px] font-black uppercase opacity-40 tracking-widest">Status</p>
                            <p className="text-success font-black flex items-center justify-end gap-1">
                                <ShieldCheck size={14} /> Verified
                            </p>
                        </div>
                    </div>

                    <div className="divider opacity-5 my-0" />

                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link 
                            to="/dashboard" 
                            className="btn btn-primary flex-1 h-14 rounded-2xl font-black text-lg gap-2 shadow-xl shadow-primary/20"
                        >
                            Start Learning <PlayCircle size={20} />
                        </Link>
                        <button className="btn btn-ghost border-base-content/10 h-14 rounded-2xl font-black gap-2">
                            <Download size={20} /> Receipt
                        </button>
                    </div>
                </div>

                {/* 4. Support Footer */}
                <p className="text-xs font-bold opacity-30 uppercase tracking-[0.2em] animate-fade-in [animation-delay:500ms]">
                    A confirmation email has been sent to your inbox.
                    <br />
                    Need help? <Link to="/support" className="link link-primary">Contact Support</Link>
                </p>
            </div>
        </div>
    );
}