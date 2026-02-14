import { GripVertical, Video, FileText, BrainCircuit} from "lucide-react";
import {  useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export function SortableLessonItem({ lesson, activeLessonId, moduleId, onSelect }: any) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: lesson.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 50 : "auto",
        position: isDragging ? "relative" : "static" as const, // Fix type issue
    };

    return (
        <div 
            ref={setNodeRef} 
            style={style} 
            className={`
                relative flex items-center gap-3 px-4 py-3 pl-2 group
                ${activeLessonId === lesson.id 
                    ? "bg-primary/10 border-l-2 border-primary text-primary" 
                    : "border-l-2 border-transparent text-white/60 hover:text-white hover:bg-white/5"}
                ${isDragging ? "opacity-50 bg-black" : ""}
            `}
        >
            {/* Drag Handle */}
            <div {...attributes} {...listeners} className="cursor-grab hover:text-white text-white/10 p-1">
                <GripVertical size={12} />
            </div>

            {/* Clickable Area for Selection */}
            <div 
                onClick={() => onSelect(moduleId, lesson.id)}
                className="flex-1 flex items-center gap-3 cursor-pointer min-w-0"
            >
                <span className="opacity-50 shrink-0">
                    {lesson.type === 'video' && <Video size={14} />}
                    {lesson.type === 'article' && <FileText size={14} />}
                    {lesson.type === 'quiz' && <BrainCircuit size={14} />}
                </span>
                <span className="text-xs font-medium truncate select-none">{lesson.title}</span>
            </div>
        </div>
    );
}