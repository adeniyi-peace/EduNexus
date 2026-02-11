import { Award, RefreshCcw, ArrowRight, CheckCircle2 } from "lucide-react";

interface ResultsProps {
    score: number;
    total: number;
    onRestart?: () => void;
    onContinue?: () => void;
}

export const QuizResults = ({ score, total, onRestart, onContinue }: ResultsProps) => {
    const percentage = Math.round((score / total) * 100);
    const isPassed = percentage >= 70;

    return (
        <div className="max-w-2xl mx-auto py-12 px-6 text-center">
            <div className="relative inline-block mb-8">
                {/* Outer Glow Ring */}
                <div className={`absolute inset-0 rounded-full blur-3xl opacity-20 ${isPassed ? 'bg-primary' : 'bg-error'}`} />
                
                <div className={`relative w-32 h-32 rounded-full border-2 flex items-center justify-center mx-auto ${isPassed ? 'border-primary bg-primary/10' : 'border-error bg-error/10'}`}>
                    <Award size={64} className={isPassed ? 'text-primary' : 'text-error'} />
                </div>
            </div>

            <h2 className="text-4xl font-bold text-white mb-2">
                {isPassed ? "Assessment Verified" : "Sync Interrupted"}
            </h2>
            <p className="text-slate-400 mb-10 tracking-wide uppercase text-xs font-black">
                Result: {score} / {total} Nodes Correct ({percentage}%)
            </p>

            <div className="grid grid-cols-1 gap-4 mb-12">
                <div className="bg-white/5 border border-white/10 p-6 rounded-3xl flex items-center justify-between">
                    <div className="flex items-center gap-4 text-left">
                        <div className="w-12 h-12 rounded-2xl bg-success/20 flex items-center justify-center text-success">
                            <CheckCircle2 size={24} />
                        </div>
                        <div>
                            <p className="text-white font-bold">Accuracy Rating</p>
                            <p className="text-slate-400 text-sm">System proficiency optimized</p>
                        </div>
                    </div>
                    <span className="text-3xl font-mono font-bold text-white">{percentage}%</span>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                    onClick={onRestart}
                    className="btn btn-ghost border border-white/10 hover:bg-white/5 rounded-2xl px-8 gap-2"
                >
                    <RefreshCcw size={18} /> Re-Initialize
                </button>
                <button 
                    onClick={onContinue}
                    className="btn btn-primary rounded-2xl px-12 gap-2 shadow-[0_0_20px_rgba(var(--p),0.4)]"
                >
                    Next Module <ArrowRight size={18} />
                </button>
            </div>
        </div>
    );
};