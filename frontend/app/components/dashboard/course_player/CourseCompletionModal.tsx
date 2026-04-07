import { useEffect } from "react";
import { Award, ChevronRight, X, Sparkles } from "lucide-react";
import { Link } from "react-router";
import confetti from "canvas-confetti";

interface CourseCompletionModalProps {
    isOpen: boolean;
    onClose: () => void;
    courseTitle: string;
}

export const CourseCompletionModal = ({ isOpen, onClose, courseTitle }: CourseCompletionModalProps) => {
    
    // Trigger confetti when modal opens
    useEffect(() => {
        if (isOpen) {
            const end = Date.now() + 3 * 1000;
            const colors = ["#3B35B8", "#2DD4BF", "#FB923C"];

            (function frame() {
                confetti({
                    particleCount: 5,
                    angle: 60,
                    spread: 55,
                    origin: { x: 0 },
                    colors: colors
                });
                confetti({
                    particleCount: 5,
                    angle: 120,
                    spread: 55,
                    origin: { x: 1 },
                    colors: colors
                });

                if (Date.now() < end) {
                    requestAnimationFrame(frame);
                }
            }());
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 sm:p-6 animate-in fade-in duration-300">
            <div className="bg-base-100 rounded-3xl w-full max-w-lg shadow-[0_0_50px_rgba(0,0,0,0.3)] relative overflow-hidden flex flex-col scale-100 animate-in zoom-in-95 duration-500">
                
                {/* Decorative Head */}
                <div className="h-32 bg-linear-to-br from-primary to-secondary relative flex items-center justify-center overflow-hidden">
                    {/* Abstract Shapes */}
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse" />
                    <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-black/10 rounded-full blur-xl animate-pulse delay-150" />
                    
                    <div className="relative z-10 w-20 h-20 bg-base-100 rounded-full flex items-center justify-center p-1 shadow-xl translate-y-8">
                        <div className="w-full h-full bg-primary/10 rounded-full flex items-center justify-center border-4 border-base-100 text-primary">
                            <Award size={40} className="fill-primary/20" />
                        </div>
                    </div>
                </div>

                {/* Close Button */}
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 btn btn-circle btn-sm btn-ghost text-white/70 hover:text-white hover:bg-white/20 z-20"
                    aria-label="Close modal"
                >
                    <X size={16} />
                </button>

                {/* Body Content */}
                <div className="pt-14 pb-8 px-6 sm:px-10 text-center flex-1">
                    <div className="flex justify-center items-center gap-2 mb-2">
                        <Sparkles size={16} className="text-secondary" />
                        <span className="text-xs font-black uppercase tracking-[0.25em] text-primary">Course Completed</span>
                        <Sparkles size={16} className="text-secondary" />
                    </div>
                    
                    <h2 className="text-2xl sm:text-3xl font-black text-base-content mb-3 leading-tight">
                        Congratulations!
                    </h2>
                    
                    <p className="text-base-content/70 text-sm sm:text-base leading-relaxed mb-6">
                        You have successfully reached the end of <strong className="text-base-content font-bold underline decoration-primary/30 underline-offset-4">{courseTitle}</strong>. 
                        We are incredibly proud of your dedication.
                    </p>

                    <div className="bg-base-200/50 rounded-2xl p-5 border border-base-content/5 mb-8">
                        <h4 className="text-sm font-bold text-base-content mb-1">Your Certificate is Ready!</h4>
                        <p className="text-xs text-base-content/60">
                            Navigate to your achievements dashboard to view, download, and share your verified certificate.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 mt-auto">
                        <button 
                            onClick={onClose}
                            className="btn btn-ghost bg-base-200 hover:bg-base-300 text-base-content rounded-xl flex-1 border border-base-content/5"
                        >
                            Close
                        </button>
                        <Link 
                            to="/dashboard/achievements" 
                            className="btn btn-primary text-primary-content rounded-xl flex-1 shadow-[0_0_20px_rgba(var(--p),0.3)] hover:shadow-[0_0_30px_rgba(var(--p),0.5)] transition-all group"
                        >
                            View Certificate <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};
