import { useState } from "react";
import { 
    ChevronRight, ChevronDown, Plus, 
    Video, FileText, BrainCircuit, Trash2, Edit2, Check 
} from "lucide-react";
import { 
    DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, type DragEndEvent 
} from "@dnd-kit/core";
import { 
    arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy
} from "@dnd-kit/sortable";
import { AnimatePresence, motion } from "framer-motion";
import type { Module, Lesson } from "~/types/course"; // Ensure this import matches your types
import { SortableLessonItem } from "./SortableLessonItem";

interface StructureProps {
    modules: Module[];
    activeLessonId: string | null;
    onSelectLesson: (modId: string, lesId: string) => void;
    onAddModule: () => void;
    onDeleteModule: (id: string) => void;
    onUpdateModule: (id: string, data: Partial<Module>) => void; // Added for Renaming/Toggling
    onAddLesson: (modId: string, type: 'video' | 'article' | 'quiz') => void;
    onDeleteLesson: (modId: string, lesId: string) => void;
    onReorderLessons: (modId: string, newOrder: Lesson[]) => void; // Added for DnD
}

// --- MAIN COMPONENT ---
export function StructurePanel({ 
    modules, 
    activeLessonId, 
    onSelectLesson, 
    onAddModule, 
    onDeleteModule,
    onUpdateModule,
    onAddLesson,
    onDeleteLesson,
    onReorderLessons
}: StructureProps) {
    
    // Local state for renaming a module
    const [editingModuleId, setEditingModuleId] = useState<string | null>(null);
    const [editTitle, setEditTitle] = useState("");

    // DnD Sensors
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    // Toggle Handler
    const handleToggle = (mod: Module) => {
        onUpdateModule(mod.id, { isOpen: !mod.isOpen });
    };

    // Rename Start Handler
    const startEditing = (mod: Module) => {
        setEditingModuleId(mod.id);
        setEditTitle(mod.title);
    };

    // Rename Save Handler
    const saveTitle = (modId: string) => {
        if (editTitle.trim()) {
            onUpdateModule(modId, { title: editTitle });
        }
        setEditingModuleId(null);
    };

    // DnD End Handler
    const handleDragEnd = (event: DragEndEvent, moduleId: string) => {
        const { active, over } = event;
        
        if (active.id !== over?.id) {
            const module = modules.find(m => m.id === moduleId);
            if (!module) return;

            const oldIndex = module.lessons.findIndex(l => l.id === active.id);
            const newIndex = module.lessons.findIndex(l => l.id === over?.id);
            
            const newOrder = arrayMove(module.lessons, oldIndex, newIndex);
            onReorderLessons(moduleId, newOrder);
        }
    };

    return (
        <div className="flex flex-col h-full bg-black/40 border-r border-white/5">
            {/* Header */}
            <div className="h-12 flex items-center justify-between px-4 border-b border-white/5 bg-white/2">
                <span className="text-[10px] font-black uppercase tracking-widest opacity-50">Course Outline</span>
                <span className="text-[9px] font-mono opacity-30">v2.0</span>
            </div>

            {/* Tree View */}
            <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar p-2 space-y-1">
                {modules.map((mod) => (
                    <div key={mod.id} className="rounded-xl overflow-hidden bg-white/2 border border-white/5">
                        
                        {/* MODULE HEADER */}
                        <div className="flex items-center gap-2 p-3 hover:bg-white/5 transition-colors group/module">
                            {/* Toggle Button */}
                            <button 
                                onClick={() => handleToggle(mod)}
                                className="text-white/40 hover:text-white transition-colors p-1"
                            >
                                {mod.isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                            </button>

                            {/* Title (View or Edit Mode) */}
                            <div className="flex-1 min-w-0">
                                {editingModuleId === mod.id ? (
                                    <div className="flex items-center gap-2">
                                        <input 
                                            autoFocus
                                            value={editTitle}
                                            onChange={(e) => setEditTitle(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && saveTitle(mod.id)}
                                            onBlur={() => saveTitle(mod.id)}
                                            className="w-full bg-black/50 border border-primary/50 text-xs px-2 py-1 rounded text-white outline-none"
                                        />
                                        <button onClick={() => saveTitle(mod.id)} className="text-primary hover:text-white">
                                            <Check size={12} />
                                        </button>
                                    </div>
                                ) : (
                                    <span 
                                        onDoubleClick={() => startEditing(mod)}
                                        className="text-xs font-bold uppercase tracking-tight truncate block cursor-text"
                                    >
                                        {mod.title}
                                    </span>
                                )}
                            </div>

                            {/* Module Actions */}
                            <div className={`flex gap-2 transition-opacity ${editingModuleId === mod.id ? 'opacity-0' : 'opacity-0 group-hover/module:opacity-100'}`}>
                                <button onClick={() => startEditing(mod)} className="text-white/20 hover:text-white">
                                    <Edit2 size={12} />
                                </button>
                                <button onClick={() => onDeleteModule(mod.id)} className="text-white/20 hover:text-error">
                                    <Trash2 size={12} />
                                </button>
                            </div>
                        </div>

                        {/* NESTED LESSONS (Drag Context) */}
                        <AnimatePresence>
                            {mod.isOpen && (
                                <motion.div 
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="border-t border-white/5 bg-black/20"
                                >
                                    <DndContext 
                                        sensors={sensors} 
                                        collisionDetection={closestCenter}
                                        onDragEnd={(e) => handleDragEnd(e, mod.id)}
                                    >
                                        <SortableContext 
                                            items={mod.lessons.map(l => l.id)}
                                            strategy={verticalListSortingStrategy}
                                        >
                                            {mod.lessons.map((lesson) => (
                                                <SortableLessonItem 
                                                    key={lesson.id}
                                                    lesson={lesson}
                                                    moduleId={mod.id}
                                                    activeLessonId={activeLessonId}
                                                    onSelect={onSelectLesson}
                                                />
                                            ))}
                                        </SortableContext>
                                    </DndContext>

                                    {/* Quick Add Button */}
                                    <div className="flex border-t border-white/5 divide-x divide-white/5">
    
                                        {/* Add Video Button */}
                                        <button 
                                            onClick={() => onAddLesson(mod.id, 'video')}
                                            className="flex-1 py-3 flex items-center justify-center gap-2 hover:bg-white/5 transition-colors group/btn"
                                            title="Add Video Lesson"
                                        >
                                            <Video size={12} className="text-white/20 group-hover/btn:text-blue-400" />
                                            <span className="text-[9px] font-black uppercase tracking-wider text-white/20 group-hover/btn:text-white">Video</span>
                                        </button>

                                        {/* Add Article Button */}
                                        <button 
                                            onClick={() => onAddLesson(mod.id, 'article')}
                                            className="flex-1 py-3 flex items-center justify-center gap-2 hover:bg-white/5 transition-colors group/btn"
                                            title="Add Article/Text"
                                        >
                                            <FileText size={12} className="text-white/20 group-hover/btn:text-emerald-400" />
                                            <span className="text-[9px] font-black uppercase tracking-wider text-white/20 group-hover/btn:text-white">Text</span>
                                        </button>

                                        {/* Add Quiz Button */}
                                        <button 
                                            onClick={() => onAddLesson(mod.id, 'quiz')}
                                            className="flex-1 py-3 flex items-center justify-center gap-2 hover:bg-white/5 transition-colors group/btn"
                                            title="Add Quiz"
                                        >
                                            <BrainCircuit size={12} className="text-white/20 group-hover/btn:text-purple-400" />
                                            <span className="text-[9px] font-black uppercase tracking-wider text-white/20 group-hover/btn:text-white">Quiz</span>
                                        </button>

                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                ))}

                {/* Add Module Button */}
                <button onClick={onAddModule} className="w-full py-4 border border-dashed border-white/10 rounded-xl flex items-center justify-center gap-2 text-white/20 hover:border-primary/40 hover:text-primary transition-all">
                    <Plus size={14} />
                    <span className="text-[10px] font-black uppercase tracking-widest">New Section</span>
                </button>
            </div>
        </div>
    );
}