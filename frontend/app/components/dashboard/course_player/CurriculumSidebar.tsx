import { CheckCircle2, Lock, PlayCircle, Circle, FileText, HelpCircle } from "lucide-react";
import type { PlayerModule, PlayerLesson } from "~/types/course";

interface SidebarProps {
    modules: PlayerModule[];
    allLessons: PlayerLesson[];
    currentLesson: PlayerLesson;
    completedLessonIds: Set<string>;
    courseTitle: string;
    isEnrolled: boolean;
    onLessonSelect: (lesson: PlayerLesson) => void;
}

export const CurriculumSidebar = ({
    modules,
    allLessons,
    currentLesson,
    completedLessonIds,
    courseTitle,
    isEnrolled,
    onLessonSelect,
}: SidebarProps) => {
    // Progress based on completed lessons, not current position
    const progress = allLessons.length > 0
        ? (completedLessonIds.size / allLessons.length) * 100
        : 0;

    return (
        <aside className="w-full h-full bg-base-100 flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-base-content/5 bg-base-100 shrink-0">
                <h3 className="font-black text-xs uppercase tracking-widest opacity-50 mb-1">Curriculum</h3>
                <h2 className="text-sm font-bold line-clamp-1">{courseTitle}</h2>

                {/* Progress Bar */}
                <div className="w-full bg-base-300 h-1.5 rounded-full mt-4 overflow-hidden relative">
                    <div
                        className="bg-primary h-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(var(--p),0.5)]"
                        style={{ width: `${progress}%` }}
                    />
                </div>
                <div className="flex justify-between mt-2 text-[10px] font-mono opacity-50">
                    <span>{Math.round(progress)}% Complete</span>
                    <span>{completedLessonIds.size}/{allLessons.length}</span>
                </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
                {modules.map((module) => (
                    <div key={module.id} className="space-y-3">
                        <div className="sticky top-0 bg-base-100/95 backdrop-blur-sm z-10 py-2 border-b border-base-content/5">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-primary/80 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary" /> {module.title}
                            </h4>
                        </div>

                        <div className="space-y-1 pl-2 border-l border-base-content/10 ml-1">
                            {module.lessons.map((lesson) => {
                                const isCurrent = currentLesson.id === lesson.id;
                                const isCompleted = completedLessonIds.has(lesson.id);
                                const isLocked = !isEnrolled && !lesson.isPreview;

                                return (
                                    <button
                                        key={lesson.id}
                                        onClick={() => !isLocked && onLessonSelect(lesson)}
                                        aria-label={lesson.title}
                                        aria-current={isCurrent ? 'true' : undefined}
                                        aria-disabled={isLocked ? 'true' : undefined}
                                        className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all group relative overflow-hidden
                                        ${isCurrent ? "bg-primary text-primary-content shadow-lg" : "hover:bg-base-200 text-base-content/60"}
                                        ${isLocked ? "opacity-50 cursor-not-allowed" : ""}`}
                                    >
                                        {/* Lesson type / status icon */}
                                        <div className="shrink-0">
                                            {isLocked ? (
                                                <Lock size={16} className="text-base-content/30" />
                                            ) : isCompleted ? (
                                                <CheckCircle2 size={16} className="text-success" />
                                            ) : isCurrent ? (
                                                <PlayCircle size={16} fill="currentColor" className="text-primary-content" />
                                            ) : lesson.type === 'article' ? (
                                                <FileText size={16} className="opacity-40" />
                                            ) : lesson.type === 'quiz' ? (
                                                <HelpCircle size={16} className="opacity-40" />
                                            ) : (
                                                <Circle size={16} className="opacity-30" />
                                            )}
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <p className={`text-xs font-bold truncate ${isCurrent ? "" : "group-hover:text-base-content"}`}>
                                                {lesson.title}
                                            </p>
                                            <p className={`text-[9px] font-mono mt-0.5 ${isCurrent ? "text-primary-content/70" : "opacity-40"}`}>
                                                {lesson.type === 'video' && lesson.duration
                                                    ? `${Math.floor(lesson.duration / 60)}:${String(lesson.duration % 60).padStart(2, '0')}`
                                                    : lesson.type === 'article'
                                                        ? 'Article'
                                                        : lesson.type === 'quiz'
                                                            ? 'Quiz'
                                                            : ''
                                                }
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