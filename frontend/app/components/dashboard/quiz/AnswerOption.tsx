interface AnswerOptionProps {
    letter: string;
    text: string;
    onClick: () => void;
    status: "idle" | "correct" | "wrong";
    disabled: boolean;
}

export const AnswerOption = ({ letter, text, onClick, status, disabled }: AnswerOptionProps) => {
    // Define status-based styles
    const statusStyles = {
        idle: "border-white/10 hover:border-primary/50 hover:bg-primary/10",
        correct: "border-success bg-success/20 shadow-[0_0_15px_rgba(34,197,94,0.3)]",
        wrong: "border-error bg-error/20 opacity-60",
    };

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`group relative flex items-center p-5 bg-white/[0.03] border rounded-2xl transition-all duration-300 text-left ${statusStyles[status]}`}
        >
            <div className={`relative z-10 w-10 h-10 rounded-xl border flex items-center justify-center mr-4 transition-all
                ${status === 'correct' ? 'bg-success border-success text-white' : 
                  status === 'wrong' ? 'bg-error border-error text-white' : 
                  'bg-slate-900 border-white/10 text-slate-500 group-hover:text-primary'}`}
            >
                <span className="text-sm font-black tracking-tighter">{letter}</span>
            </div>
            
            <span className={`relative z-10 font-medium transition-colors ${status !== 'idle' ? 'text-white' : 'text-slate-300'}`}>
                {text}
            </span>
        </button>
    );
};