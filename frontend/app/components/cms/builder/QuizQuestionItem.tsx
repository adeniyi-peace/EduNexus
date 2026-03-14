import { useState, useEffect } from "react";
import { CheckCircle } from "lucide-react";
import type { QuizQuestion } from "~/types/course";

interface QuizQuestionItemProps {
    question: QuizQuestion;
    index: number;
    onUpdate: (q: QuizQuestion) => void;
}

export function QuizQuestionItem({ question, index, onUpdate }: QuizQuestionItemProps) {
    const [localText, setLocalText] = useState(question.text);

    useEffect(() => {
        setLocalText(question.text);
    }, [question.id]);

    useEffect(() => {
        if (localText === question.text) return;
        const timer = setTimeout(() => {
            onUpdate({ ...question, text: localText });
        }, 1000);
        return () => clearTimeout(timer);
    }, [localText]);

    const handleOptionUpdate = (oIdx: number, fields: any) => {
        const newOptions = [...question.options];
        newOptions[oIdx] = { ...newOptions[oIdx], ...fields };
        onUpdate({ ...question, options: newOptions });
    };

    const setCorrectOption = (oIdx: number) => {
        const newOptions = question.options.map((o, i) => ({ ...o, isCorrect: i === oIdx }));
        onUpdate({ ...question, options: newOptions });
    };

    return (
        <div className="bg-base-200/40 p-8 rounded-4xl border border-base-content/5 space-y-6 relative group transition-all hover:border-base-content/10 text-left">
            <div className="flex gap-4">
                <span className="font-mono text-xs opacity-20 mt-1">{String(index + 1).padStart(2, '0')}</span>
                <input 
                    className="flex-1 bg-transparent font-black text-sm focus:outline-none border-b border-transparent focus:border-primary/20 pb-2 uppercase tracking-tight"
                    value={localText}
                    placeholder="ENTER_QUESTION_PROMPT..."
                    onChange={(e) => setLocalText(e.target.value)}
                />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-8">
                {question.options.map((opt, oIdx) => (
                    <QuizOptionItem 
                        key={oIdx}
                        option={opt}
                        onUpdate={(fields) => handleOptionUpdate(oIdx, fields)}
                        onSetCorrect={() => setCorrectOption(oIdx)}
                    />
                ))}
            </div>
        </div>
    );
}

function QuizOptionItem({ option, onUpdate, onSetCorrect }: { option: any, onUpdate: (f: any) => void, onSetCorrect: () => void }) {
    const [localText, setLocalText] = useState(option.text);

    useEffect(() => {
        setLocalText(option.text);
    }, [option.text, option.isCorrect]); // Reset if external change occurs

    useEffect(() => {
        if (localText === option.text) return;
        const timer = setTimeout(() => {
            onUpdate({ text: localText });
        }, 800);
        return () => clearTimeout(timer);
    }, [localText]);

    return (
        <div className={`
            flex items-center gap-3 p-3 rounded-xl border transition-all
            ${option.isCorrect ? 'bg-success/5 border-success/20' : 'bg-base-300/50 border-transparent hover:border-base-content/10'}
        `}>
            <button 
                onClick={onSetCorrect}
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${option.isCorrect ? 'border-success bg-success' : 'border-base-content/20'}`}
            >
                {option.isCorrect && <CheckCircle size={12} className="text-white" />}
            </button>
            <input 
                className="flex-1 bg-transparent text-xs focus:outline-none font-medium"
                value={localText}
                onChange={(e) => setLocalText(e.target.value)}
            />
        </div>
    );
}
