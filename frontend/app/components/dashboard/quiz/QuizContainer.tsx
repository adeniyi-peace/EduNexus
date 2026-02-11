import { useState, useEffect } from "react";
import { QuizTimer } from "./QuizTimer";
import { QuestionRenderer } from "./QuestionRenderer";
import { QuizResults } from "./QuizResults";

interface QuizProps {
    questions: {
        text: string;
        options: {
            text: string;
            isCorrect: boolean;
        }[];
    }[];
    timeLimit?: number; // In seconds. If null, quiz is untimed.
    onFinish: () => void; // Added to trigger the next lesson in CoursePlayer
}

export const QuizContainer = ({ questions, timeLimit, onFinish }: QuizProps) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [isFinished, setIsFinished] = useState(false);
    const [timeLeft, setTimeLeft] = useState(timeLimit || 0);

    // Reset quiz state to start over
    const handleRestart = () => {
        setCurrentIndex(0);
        setScore(0);
        setIsFinished(false);
        setTimeLeft(timeLimit || 0);
    };

    // Timer Logic
    useEffect(() => {
        if (!timeLimit || isFinished) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    setIsFinished(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLimit, isFinished, currentIndex]); // currentIndex added to ensure timer behaves on resets

    const handleAnswer = (isCorrect: boolean) => {
        if (isCorrect) setScore(score + 1);
        
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            setIsFinished(true);
        }
    };

    if (isFinished) {
        return (
            <QuizResults 
                score={score} 
                total={questions.length} 
                onRestart={handleRestart}
                onContinue={onFinish} // Navigates to the next node in the sidebar
            />
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-8 animate-in fade-in duration-700">
            <header className="flex justify-between items-center border-b border-white/10 pb-6">
                <div>
                    <span className="text-primary font-black uppercase tracking-[0.3em] text-[10px]">
                        Protocol Node {currentIndex + 1} / {questions.length}
                    </span>
                    <h2 className="text-2xl font-bold text-white mt-1">Knowledge Assessment</h2>
                </div>
                
                {timeLimit && (
                    <QuizTimer seconds={timeLeft} total={timeLimit} />
                )}
            </header>

            <QuestionRenderer 
                question={questions[currentIndex]} 
                onAnswer={handleAnswer} 
            />
        </div>
    );
};