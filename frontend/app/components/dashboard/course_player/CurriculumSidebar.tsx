import { CheckCircle2, Lock, PlayCircle, Circle } from "lucide-react";
import { MOCK_CURRICULUM } from "~/utils/mockData";

const allLessons = MOCK_CURRICULUM.flatMap(module => module.lessons);
interface SidebarProps {
    curriculum: typeof MOCK_CURRICULUM,
    currentLesson: typeof allLessons[0],
    allLessons: typeof allLessons,
    onLessonSelect: (lesson: any) => void;
}

export const CurriculumSidebar = ({ curriculum, currentLesson, allLessons, onLessonSelect }: SidebarProps) => {
    const progress = (allLessons.findIndex(l => l.id === currentLesson.id) / allLessons.length) * 100;

    return (
        <aside className="w-full h-full bg-base-100 flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-base-content/5 bg-base-100 shrink-0">
                <h3 className="font-black text-xs uppercase tracking-widest opacity-50 mb-1">Curriculum</h3>
                <h2 className="text-sm font-bold line-clamp-1">Fullstack Development Protocol</h2>
                
                {/* Progress Bar */}
                <div className="w-full bg-base-300 h-1.5 rounded-full mt-4 overflow-hidden relative">
                    <div 
                        className="bg-primary h-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(var(--p),0.5)]" 
                        style={{ width: `${progress}%` }}
                    />
                </div>
                <div className="flex justify-between mt-2 text-[10px] font-mono opacity-50">
                    <span>{Math.round(progress)}% Complete</span>
                    <span>{allLessons.findIndex(l => l.id === currentLesson.id) + 1}/{allLessons.length}</span>
                </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
                {curriculum.map((module, i) => (
                    <div key={i} className="space-y-3">
                        <div className="sticky top-0 bg-base-100/95 backdrop-blur-sm z-10 py-2 border-b border-base-content/5">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-primary/80 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary" /> {module.title}
                            </h4>
                        </div>
                        
                        <div className="space-y-1 pl-2 border-l border-base-content/10 ml-1">
                            {module.lessons.map((lesson) => {
                                const isCurrent = currentLesson.id === lesson.id;
                                const isCompleted = allLessons.findIndex(l => l.id === lesson.id) < allLessons.findIndex(l => l.id === currentLesson.id);
                                
                                return (
                                    <button
                                        key={lesson.id}
                                        onClick={() => onLessonSelect(lesson)}
                                        className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all group relative overflow-hidden
                                        ${isCurrent ? "bg-primary text-primary-content shadow-lg" : "hover:bg-base-200 text-base-content/60"}`}
                                    >
                                        <div className="shrink-0">
                                            {isCompleted ? (
                                                <CheckCircle2 size={16} className="text-success" />
                                            ) : isCurrent ? (
                                                <PlayCircle size={16} fill="currentColor" className="text-primary-content" />
                                            ) : (
                                                <Circle size={16} className="opacity-30" />
                                            )}
                                        </div>
                                        
                                        <div className="min-w-0 flex-1">
                                            <p className={`text-xs font-bold truncate ${isCurrent ? "" : "group-hover:text-base-content"}`}>
                                                {lesson.title}
                                            </p>
                                            <p className={`text-[9px] font-mono mt-0.5 ${isCurrent ? "text-primary-content/70" : "opacity-40"}`}>
                                                {lesson.duration}
                                            </p>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </aside>
    );
};