export const QuizTimer = ({ seconds, total }: { seconds: number; total: number }) => {
    const percentage = (seconds / total) * 100;
    const isCritical = seconds < 10;

    return (
        <div className="relative flex items-center justify-center w-16 h-16">
            <svg className="w-full h-full transform -rotate-90">
                <circle
                    cx="32" cy="32" r="28"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="transparent"
                    className="text-white/5"
                />
                <circle
                    cx="32" cy="32" r="28"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="transparent"
                    strokeDasharray={175.9}
                    strokeDashoffset={175.9 - (175.9 * percentage) / 100}
                    className={`transition-all duration-1000 ${
                        isCritical ? "text-error" : "text-primary"
                    }`}
                />
            </svg>
            <span className={`absolute font-mono text-sm font-bold ${isCritical ? "animate-pulse text-error" : "text-white"}`}>
                {seconds}s
            </span>
        </div>
    );
};