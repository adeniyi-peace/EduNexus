interface SidebarProps {
    curriculum: {
        title: string;
        lessons: {
            id: string;
            title: string;
            duration: string;
            completed: boolean;
            videoUrl: string;
        }[];
    }[];
    currentLesson: {
        id: string;
        title: string;
        duration: string;
        completed: boolean;
        videoUrl: string;
    };
    allLessons: {
        id: string;
        title: string;
        duration: string;
        completed: boolean;
        videoUrl: string;
    }[];
    onLessonSelect: (lesson: any) => void;
}

export const CurriculumSidebar = ({ curriculum, currentLesson, allLessons, onLessonSelect }: SidebarProps) => {
    const progress = (allLessons.findIndex(l => l.id === currentLesson.id) / allLessons.length) * 100;

    return (
        <aside className="w-full lg:w-96 bg-base-100 border-l border-base-content/5 flex flex-col shadow-2xl z-10">
                        <div className="p-6 border-b border-base-content/5">
                            <h3 className="font-black text-xs uppercase tracking-widest opacity-50">Curriculum Node</h3>
                            <p className="text-sm font-bold mt-1 line-clamp-1">Advanced Distributed Systems</p>
                            <div className="w-full bg-base-300 h-1.5 rounded-full mt-4 overflow-hidden">
                                {/* Progress Bar Dynamic Width */}
                                <div 
                                    className="bg-primary h-full transition-all duration-1000 shadow-[0_0_10px_rgba(59,53,184,0.5)]" 
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>
        
                        <div className="flex-1 overflow-y-auto p-4 space-y-6">
                            {curriculum.map((module, i) => (
                                <div key={i} className="space-y-2">
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-primary/60 px-2 flex items-center gap-2">
                                        <span className="w-4 h-px bg-primary/20" /> {module.title}
                                    </h4>
                                    <div className="space-y-1">
                                        {module.lessons.map((lesson) => (
                                            <button
                                                key={lesson.id}
                                                onClick={() => onLessonSelect(lesson)}
                                                className={`w-full flex items-center justify-between p-3 rounded-xl transition-all group
                                                ${currentLesson.id === lesson.id ? "bg-primary text-primary-content shadow-lg scale-[1.02]" : "hover:bg-base-200 text-base-content/60 hover:text-base-content"}`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    {lesson.completed || allLessons.findIndex(l => l.id === lesson.id) < allLessons.findIndex(l => l.id === currentLesson.id) ? (
                                                        <div className="w-5 h-5 rounded-full bg-success text-success-content flex items-center justify-center shrink-0">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                                                        </div>
                                                    ) : (
                                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${currentLesson.id === lesson.id ? 'border-primary-content' : 'border-base-content/10'}`}>
                                                            <span className="text-[8px] font-black">{lesson.id.slice(-1)}</span>
                                                        </div>
                                                    )}
                                                    <span className="text-xs font-bold text-left leading-snug">{lesson.title}</span>
                                                </div>
                                                <span className={`text-[9px] font-black ${currentLesson.id === lesson.id ? 'opacity-100' : 'opacity-30'}`}>{lesson.duration}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </aside>
    );
};