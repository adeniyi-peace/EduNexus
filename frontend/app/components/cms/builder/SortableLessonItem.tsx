import { GripVertical, Video, FileText, BrainCircuit, Trash2 } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Lesson } from "~/types/course";

interface SortableLessonItemProps {
    lesson: Lesson;
    activeLessonId: string | null;
    moduleId: string;
    onSelect: (modId: string, lesId: string) => void;
    onDelete: (modId: string, lesId: string) => void;
}

export function SortableLessonItem({ 
    lesson, 
    activeLessonId, 
    moduleId, 
    onSelect,
    onDelete 
}: SortableLessonItemProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: lesson.id });

    const style = {
        transform: CSS.Translate.toString(transform),
        transition,
        zIndex: isDragging ? 50 : "auto",
        position: (isDragging ? "relative" : "static") ,
    };

    const isActive = activeLessonId === lesson.id;

    return (
        <div 
            ref={setNodeRef} 
            style={style} 
            className={`
                group relative flex items-center gap-2 px-2 py-2 rounded-xl transition-all duration-200
                ${isDragging && "opacity-50 bg-base-300 shadow-2xl z-50 scale-[1.02]" }
                ${isActive 
                    ? "bg-primary/10 text-primary" 
                    : "text-base-content/60 hover:bg-base-content/5 hover:text-base-content"}
            `}
        >
            {/* --- DRAG HANDLE --- */}
            <div 
                {...attributes} 
                {...listeners} 
                className={`
                    p-1.5 rounded-lg transition-colors cursor-grab active:cursor-grabbing
                    ${isDragging ? "text-primary" : "text-base-content/10 group-hover:text-base-content/30"}
                `}
            >
                <GripVertical size={14} />
            </div>

            {/* --- CONTENT AREA (CLICKABLE) --- */}
            <button 
                onClick={() => onSelect(moduleId, lesson.id)}
                className="flex-1 flex items-center gap-3 min-w-0 text-left"
            >
                <div className={`
                    shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-colors
                    ${isActive ? "bg-primary text-primary-content" : "bg-base-300 text-base-content/40 group-hover:bg-base-content/10"}
                `}>
                    {lesson.type === 'video' && <Video size={14} />}
                    {lesson.type === 'article' && <FileText size={14} />}
                    {lesson.type === 'quiz' && <BrainCircuit size={14} />}
                </div>

                <div className="flex flex-col min-w-0">
                    <span className="text-xs font-medium tracking-tight truncate select-none">
                        {lesson.title || "Untitled_Asset"}
                    </span>
                    <span className="text-[9px] font-mono opacity-40 uppercase tracking-widest">
                        {lesson.type}
                    </span>
                </div>
            </button>

            {/* --- INLINE ACTIONS --- */}
            <div className={`
                flex items-center px-2 transition-all duration-200
                ${isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"}
            `}>
                <button 
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete(moduleId, lesson.id);
                    }}
                    className="p-2 rounded-lg text-base-content/20 hover:text-error hover:bg-error/10 transition-colors"
                    title="Remove Asset"
                >
                    <Trash2 size={14} />
                </button>
            </div>
            
            {/* ACTIVE INDICATOR BAR */}
            {isActive && (
                <div className="absolute left-0 top-2 bottom-2 w-1 bg-primary rounded-full shadow-[0_0_10px_rgba(var(--p),0.5)]" />
            )}
        </div>
    );
}