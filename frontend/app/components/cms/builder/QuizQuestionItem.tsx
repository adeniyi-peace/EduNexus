import { useState, useEffect } from "react";
import { CheckCircle, Trash2 } from "lucide-react";

import type { QuizQuestion } from "~/types/course";

interface QuizQuestionItemProps {
    question: QuizQuestion;
    index: number;
    onUpdate: (fields: Partial<QuizQuestion>) => void;
    onDelete: () => void;
    onUpdateOption: (optionId: string, fields: any) => void;
}

export function QuizQuestionItem({ question, index, onUpdate, onDelete, onUpdateOption }: QuizQuestionItemProps) {
    const [localText, setLocalText] = useState(question.text);

    useEffect(() => {
        setLocalText(question.text);
    }, [question.id, question.text]);

    useEffect(() => {
        if (localText === question.text) return;
        const timer = setTimeout(() => {
            onUpdate({ text: localText });
        }, 1000);
        return () => clearTimeout(timer);
    }, [localText]);

    const setCorrectOption = (oIdx: number) => {
        // Toggle correct option: set all to false, then this one to true
        // (Or better, the backend could have a specialized endpoint, 
        // but for now we loop and update)
        question.options.forEach((opt, i) => {
            onUpdateOption(opt.id, { isCorrect: i === oIdx });
        });
    };

    return (
        <div className="bg-base-200/40 p-8 rounded-4xl border border-base-content/5 space-y-6 relative group transition-all hover:border-base-content/10 text-left">
            <button 
                onClick={onDelete}
                className="absolute top-6 right-6 btn btn-ghost btn-circle btn-xs text-error opacity-0 group-hover:opacity-100 transition-all hover:bg-error/10"
            >
                <Trash2 size={14} />
            </button>

            <div className="flex gap-4">
                <span className="font-mono text-xs opacity-20 mt-1">{String(index + 1).padStart(2, '0')}</span>
                <textarea 
                    className="flex-1 bg-transparent font-black text-sm focus:outline-none border-b border-transparent focus:border-primary/20 pb-2 uppercase tracking-tight resize-none min-h-[2.5rem]"
                    value={localText}
                    placeholder="ENTER_QUESTION_PROMPT..."
                    rows={1}
                    onChange={(e) => setLocalText(e.target.value)}
                    onInput={(e) => {
                        const target = e.target as HTMLTextAreaElement;
                        target.style.height = 'auto';
                        target.style.height = `${target.scrollHeight}px`;
                    }}
                />

            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-8">
                {question.options.map((opt, oIdx) => (
                    <QuizOptionItem 
                        key={opt.id}
                        option={opt}
                        onUpdate={(fields) => onUpdateOption(opt.id, fields)}
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
            <textarea 
                className="flex-1 bg-transparent text-xs focus:outline-none font-medium resize-none overflow-hidden py-1"
                value={localText}
                rows={1}
                onChange={(e) => setLocalText(e.target.value)}
                onInput={(e) => {
                    const target = e.target as HTMLTextAreaElement;
                    target.style.height = 'auto';
                    target.style.height = `${target.scrollHeight}px`;
                }}
            />

        </div>
    );
}
