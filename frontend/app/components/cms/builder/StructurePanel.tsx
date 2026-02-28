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
import type { Module, Lesson } from "~/types/course";
import { SortableLessonItem } from "./SortableLessonItem";

interface StructureProps {
    modules: Module[];
    activeLessonId: string | null;
    onSelectLesson: (modId: string, lesId: string) => void;
    onAddModule: () => void;
    onDeleteModule: (id: string) => void;
    onUpdateModule: (id: string, data: Partial<Module>) => void;
    onAddLesson: (modId: string, type: 'video' | 'article' | 'quiz') => void;
    onDeleteLesson: (modId: string, lesId: string) => void;
    onReorderLessons: (modId: string, newOrder: Lesson[]) => void;
}

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
    
    const [editingModuleId, setEditingModuleId] = useState<string | null>(null);
    const [editTitle, setEditTitle] = useState("");

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: { distance: 8 }, // Prevents accidental drags on click
        }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const handleToggle = (mod: Module) => {
        onUpdateModule(mod.id, { isOpen: !mod.isOpen });
    };

    const startEditing = (mod: Module) => {
        setEditingModuleId(mod.id);
        setEditTitle(mod.title);
    };

    const saveTitle = (modId: string) => {
        if (editTitle.trim()) {
            onUpdateModule(modId, { title: editTitle });
        }
        setEditingModuleId(null);
    };

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
        <div className="flex flex-col h-full bg-base-100/50 backdrop-blur-sm">
            {/* --- PANEL HEADER --- */}
            <header className="h-12 flex items-center justify-between px-4 border-b border-base-content/5 bg-base-300/20">
                <span className="text-[10px] font-black uppercase tracking-widest opacity-40">
                    Course_Outline
                </span>
                <div className="badge badge-outline border-base-content/10 text-[9px] font-mono opacity-30">
                    v2.0.4
                </div>
            </header>

            {/* --- TREE VIEW --- */}
            <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar p-3 space-y-2">
                {modules.map((mod) => (
                    <div key={mod.id} className="rounded-2xl overflow-hidden bg-base-200/40 border border-base-content/5 transition-all duration-300">
                        
                        {/* MODULE HEADER */}
                        <div className={`
                            flex items-center gap-2 p-3 transition-colors group/module
                            ${mod.isOpen ? 'bg-base-300/30' : 'hover:bg-base-300/20'}
                        `}>
                            <button 
                                onClick={() => handleToggle(mod)}
                                className="text-base-content/40 hover:text-primary transition-colors p-1"
                            >
                                {mod.isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                            </button>

                            <div className="flex-1 min-w-0">
                                {editingModuleId === mod.id ? (
                                    <div className="flex items-center gap-2">
                                        <input 
                                            autoFocus
                                            value={editTitle}
                                            onChange={(e) => setEditTitle(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && saveTitle(mod.id)}
                                            onBlur={() => saveTitle(mod.id)}
                                            className="w-full bg-base-300 border border-primary/50 text-[11px] font-bold px-2 py-1 rounded-lg text-base-content outline-none"
                                        />
                                        <button onClick={() => saveTitle(mod.id)} className="text-primary">
                                            <Check size={14} />
                                        </button>
                                    </div>
                                ) : (
                                    <span 
                                        onDoubleClick={() => startEditing(mod)}
                                        className="text-[11px] font-black uppercase tracking-tight truncate block cursor-text select-none"
                                    >
                                        {mod.title}
                                    </span>
                                )}
                            </div>

                            <div className={`flex gap-1 transition-opacity ${editingModuleId === mod.id ? 'opacity-0' : 'opacity-0 group-hover/module:opacity-100'}`}>
                                <button onClick={() => startEditing(mod)} className="btn btn-ghost btn-xs btn-square text-base-content/20 hover:text-primary">
                                    <Edit2 size={12} />
                                </button>
                                <button onClick={() => onDeleteModule(mod.id)} className="btn btn-ghost btn-xs btn-square text-base-content/20 hover:text-error">
                                    <Trash2 size={12} />
                                </button>
                            </div>
                        </div>

                        {/* NESTED LESSONS */}
                        <AnimatePresence initial={false}>
                            {mod.isOpen && (
                                <motion.div 
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.2, ease: "circOut" }}
                                    className="border-t border-base-content/5 bg-base-300/10"
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
                                            <div className="p-1 space-y-0.5">
                                                {mod.lessons.map((lesson) => (
                                                    <SortableLessonItem 
                                                        key={lesson.id}
                                                        lesson={lesson}
                                                        moduleId={mod.id}
                                                        activeLessonId={activeLessonId}
                                                        onSelect={onSelectLesson}
                                                        onDelete={onDeleteLesson}
                                                    />
                                                ))}
                                                
                                                {mod.lessons.length === 0 && (
                                                    <div className="py-8 text-center opacity-20 italic text-[10px] uppercase font-bold tracking-tighter">
                                                        No_Assets_Deployed
                                                    </div>
                                                )}
                                            </div>
                                        </SortableContext>
                                    </DndContext>

                                    {/* QUICK ADD ACTIONS */}
                                    <div className="flex border-t border-base-content/5 divide-x divide-base-content/5 bg-base-300/40">
                                        <AddButton 
                                            icon={<Video size={12} />} 
                                            label="Video" 
                                            color="text-blue-400"
                                            onClick={() => onAddLesson(mod.id, 'video')} 
                                        />
                                        <AddButton 
                                            icon={<FileText size={12} />} 
                                            label="Text" 
                                            color="text-emerald-400"
                                            onClick={() => onAddLesson(mod.id, 'article')} 
                                        />
                                        <AddButton 
                                            icon={<BrainCircuit size={12} />} 
                                            label="Quiz" 
                                            color="text-purple-400"
                                            onClick={() => onAddLesson(mod.id, 'quiz')} 
                                        />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                ))}

                {/* ADD MODULE BUTTON */}
                <button 
                    onClick={onAddModule} 
                    className="w-full py-4 border-2 border-dashed border-base-content/5 rounded-2xl flex items-center justify-center gap-2 text-base-content/20 hover:border-primary/40 hover:text-primary hover:bg-primary/5 transition-all group"
                >
                    <Plus size={14} className="group-hover:rotate-90 transition-transform duration-300" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Deploy_New_Section</span>
                </button>
            </div>
        </div>
    );
}

// Sub-component for the lesson add buttons to keep the main return clean
function AddButton({ icon, label, color, onClick }: { icon: React.ReactNode, label: string, color: string, onClick: () => void }) {
    return (
        <button 
            onClick={onClick}
            className="flex-1 py-3 flex items-center justify-center gap-2 hover:bg-base-100 transition-colors group/btn"
        >
            <span className={`${color} opacity-40 group-hover/btn:opacity-100 transition-opacity`}>{icon}</span>
            <span className="text-[9px] font-black uppercase tracking-wider text-base-content/20 group-hover/btn:text-base-content">
                {label}
            </span>
        </button>
    );
}