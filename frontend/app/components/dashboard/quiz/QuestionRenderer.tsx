import { useState, useEffect } from "react";
import { AnswerOption } from "./AnswerOption";

interface QuestionProps {
    question: any;
    onAnswer: (correct: boolean) => void;
}

export const QuestionRenderer = ({ question, onAnswer }: QuestionProps) => {
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [isShowingFeedback, setIsShowingFeedback] = useState(false);

    // Reset local state when the question changes
    useEffect(() => {
        setSelectedId(null);
        setIsShowingFeedback(false);
    }, [question]);

    const handleSelect = (index: number, isCorrect: boolean) => {
        if (isShowingFeedback) return;

        setSelectedId(index);
        setIsShowingFeedback(true);

        // Wait 1 second before moving to the next question
        setTimeout(() => {
            onAnswer(isCorrect);
        }, 1200);
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-slate-900 border border-white/5 p-8 rounded-3xl shadow-xl">
                <p className="text-lg text-slate-200 leading-relaxed font-medium">
                    {question.text}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {question.options.map((option: any, index: number) => {
                    // Determine the status of this specific option
                    let status: "idle" | "correct" | "wrong" = "idle";
                    
                    if (isShowingFeedback) {
                        if (option.isCorrect) status = "correct";
                        else if (selectedId === index) status = "wrong";
                    }

                    return (
                        <AnswerOption
                            key={index}
                            letter={String.fromCharCode(65 + index)}
                            text={option.text}
                            disabled={isShowingFeedback}
                            status={status}
                            onClick={() => handleSelect(index, option.isCorrect)}
                        />
                    );
                })}
            </div>
        </div>
    );
};

// {question.options.map((option: any, index: number) => (
//     <button
//         key={index}
//         onClick={() => onAnswer(option.isCorrect)}
//         className="group relative flex items-center p-5 bg-white/5 border border-white/10 rounded-2xl transition-all hover:bg-primary/10 hover:border-primary/50 text-left"
//     >
//         <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center mr-4 group-hover:bg-primary/20 transition-colors">
//             <span className="text-xs font-bold text-slate-400 group-hover:text-primary">
//                 {String.fromCharCode(65 + index)}
//             </span>
//         </div>
//         <span className="text-slate-300 font-medium">{option.text}</span>
//     </button>
// ))}