// components/builder/PropertiesPanel.tsx
import { Globe, Clock, EyeOff, Trash2 } from "lucide-react";
import type { Lesson } from "~/types/course"; // Ensure you import the Lesson type

interface PropertiesProps {
    lesson: Lesson | undefined;
    onUpdate: (fields: Partial<Lesson>) => void;
}

export function PropertiesPanel({ lesson, onUpdate }: PropertiesProps) {
    if (!lesson) return <div className="w-80 h-full bg-black/40 border-l border-white/5 p-4 text-xs opacity-30">Select a node to edit properties</div>;
    
    return (
        <div className="w-80 h-full bg-black/40 border-l border-white/5 flex flex-col">
            <div className="h-12 flex items-center px-4 border-b border-white/5 bg-white/2">
                <span className="text-[10px] font-black uppercase tracking-widest opacity-50">Node Properties</span>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-8">
                
                {/* Section: General */}
                <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase text-primary tracking-widest">General</label>
                    
                    {/* PUBLIC ACCESS / PREVIEW TOGGLE */}
                    <div className="flex items-center justify-between group ">
                        <div className="flex items-center gap-3 text-white/60">
                            <Globe size={16} />
                            <div className="flex flex-col">
                                <span className="text-xs font-medium">Public Preview</span>
                                <span className="text-[10px] opacity-50">Free for non-students</span>
                            </div>
                        </div>
                        <input 
                            type="checkbox" 
                            className="toggle toggle-success toggle-xs" 
                            // 1. Bind to the 'isPreview' property (add this to your Lesson type if missing)
                            checked={lesson.isPreview || false} 
                            // 2. Call onUpdate when changed
                            onChange={(e) => onUpdate({ isPreview: e.target.checked })} 
                        />
                    </div>

                    <div className="flex items-center justify-between group">
                        <div className="flex items-center gap-3 text-white/60">
                            <EyeOff size={16} />
                            <span className="text-xs font-medium">Hide from TOC</span>
                        </div>
                        <input 
                            type="checkbox" 
                            className="toggle toggle-neutral toggle-xs"
                            // Example of binding another property
                            checked={lesson.isHidden || false}
                            onChange={(e) => onUpdate({ isHidden: e.target.checked })}
                        />
                    </div>
                </div>

                {/* Section: Metadata */}
                <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase text-primary tracking-widest">Metadata</label>
                    
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-xs text-white/40">
                            <Clock size={14} /> Duration (min)
                        </div>
                        <div className="flex gap-4 text-xs font-mono opacity-40">
                            <span>DURATION: {lesson.duration ? `${Math.round(lesson.duration)}s` : '--'}</span>
                            <span>STATUS: {lesson.videoUrl ? 'READY' : 'WAITING_FOR_ASSET'}</span>
                        </div>
                    </div>
                </div>

                {/* Section: Permissions */}
                <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase text-primary tracking-widest">Assets</label>
                    <div className="form-control">
                        <label className="label cursor-pointer justify-start gap-3 p-0">
                            <input type="checkbox" className="checkbox checkbox-xs checkbox-primary rounded-md" />
                            <span className="label-text text-xs text-white/60">Allow Video Download</span>
                        </label>
                    </div>
                </div>

                {/* Danger Zone */}
                <div className="pt-8 border-t border-white/5 mt-auto">
                    <button className="btn btn-error btn-outline btn-sm w-full gap-2 text-[10px] font-black uppercase">
                        <Trash2 size={14} /> Delete Node
                    </button>
                </div>

            </div>
        </div>
    );
}