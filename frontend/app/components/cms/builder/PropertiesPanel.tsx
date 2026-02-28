import { Globe, Clock, EyeOff, Trash2, ShieldCheck, HardDrive } from "lucide-react";
import type { Lesson } from "~/types/course";

interface PropertiesProps {
    lesson: Lesson | undefined;
    onUpdate: (fields: Partial<Lesson>) => void;
    onDelete?: () => void; // Added for the Danger Zone action
}

export function PropertiesPanel({ lesson, onUpdate, onDelete }: PropertiesProps) {
    // --- EMPTY STATE ---
    if (!lesson) {
        return (
            <aside className="w-80 h-full bg-base-200/30 border-l border-white/5 p-8 flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 rounded-full border border-white/5 flex items-center justify-center mb-4 opacity-20">
                    <ShieldCheck size={20} />
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-20">
                    Waiting_For_Selection
                </p>
            </aside>
        );
    }

    return (
        <aside className="w-80 h-full bg-base-200/50 border-l border-white/5 flex flex-col backdrop-blur-xl">
            {/* --- HEADER --- */}
            <div className="h-14 flex items-center px-6 border-b border-white/5 bg-white/2">
                <span className="text-[10px] font-black uppercase tracking-widest opacity-50">
                    Asset_Configuration
                </span>
            </div>

            {/* --- SCROLLABLE CONTENT --- */}
            <div className="flex-1 overflow-y-auto p-6 space-y-10 custom-scrollbar">
                
                {/* SECTION: VISIBILITY & ACCESS */}
                <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase text-primary tracking-widest flex items-center gap-2">
                        <div className="w-1 h-1 bg-primary rounded-full" /> Access_Control
                    </label>
                    
                    <div className="space-y-3">
                        {/* PUBLIC PREVIEW TOGGLE */}
                        <div className="flex items-center justify-between p-3 rounded-xl bg-white/2 border border-white/5 hover:border-white/10 transition-colors group">
                            <div className="flex items-center gap-3">
                                <Globe size={14} className="opacity-40 group-hover:text-primary transition-colors" />
                                <div className="flex flex-col">
                                    <span className="text-[11px] font-bold uppercase">Public Preview</span>
                                    <span className="text-[9px] opacity-40">Allow non-enrolled access</span>
                                </div>
                            </div>
                            <input 
                                type="checkbox" 
                                className="toggle toggle-sm toggle-primary" 
                                checked={lesson.isPreview || false} 
                                onChange={(e) => onUpdate({ isPreview: e.target.checked })} 
                            />
                        </div>

                        {/* HIDE FROM TOC */}
                        <div className="flex items-center justify-between p-3 rounded-xl bg-white/2 border border-white/5 hover:border-white/10 transition-colors group">
                            <div className="flex items-center gap-3">
                                <EyeOff size={14} className="opacity-40 group-hover:text-warning transition-colors" />
                                <div className="flex flex-col">
                                    <span className="text-[11px] font-bold uppercase">Stealth Mode</span>
                                    <span className="text-[9px] opacity-40">Hide from Curriculum view</span>
                                </div>
                            </div>
                            <input 
                                type="checkbox" 
                                className="toggle toggle-sm"
                                checked={lesson.isHidden || false}
                                onChange={(e) => onUpdate({ isHidden: e.target.checked })}
                            />
                        </div>
                    </div>
                </div>

                {/* SECTION: SYSTEM METADATA */}
                <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase text-primary tracking-widest flex items-center gap-2">
                        <div className="w-1 h-1 bg-primary rounded-full" /> System_Telemetry
                    </label>
                    
                    <div className="p-4 bg-black/40 rounded-xl border border-white/5 font-mono space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-[9px] opacity-30 uppercase">Runtime_ID</span>
                            <span className="text-[9px] opacity-60">{lesson.id.slice(0, 8)}...</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-[9px] opacity-30 uppercase">Duration</span>
                            <span className="text-[9px] opacity-60">
                                {lesson.duration ? `${Math.round(lesson.duration)}s` : 'NULL'}
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-[9px] opacity-30 uppercase">Asset_Type</span>
                            <span className="text-[9px] text-primary">{lesson.type.toUpperCase()}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-[9px] opacity-30 uppercase">Status</span>
                            <div className="flex items-center gap-1.5">
                                <div className={`w-1 h-1 rounded-full animate-pulse ${lesson.videoUrl || lesson.content ? 'bg-success' : 'bg-error'}`} />
                                <span className={`text-[9px] ${lesson.videoUrl || lesson.content ? 'text-success' : 'text-error'}`}>
                                    {lesson.videoUrl || lesson.content ? 'ONLINE' : 'OFFLINE'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* SECTION: PERMISSIONS */}
                <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase text-primary tracking-widest flex items-center gap-2">
                        <div className="w-1 h-1 bg-primary rounded-full" /> Rights_Management
                    </label>
                    
                    <div className="form-control">
                        <label className="label cursor-pointer justify-start gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors">
                            <input 
                                type="checkbox" 
                                className="checkbox checkbox-xs checkbox-primary border-white/20" 
                                checked={lesson.allowDownload || false}
                                onChange={(e) => onUpdate({ allowDownload: e.target.checked })}
                            />
                            <div className="flex flex-col">
                                <span className="text-[11px] font-bold uppercase">Permit Downloads</span>
                                <span className="text-[9px] opacity-40">Allow offline storage for students</span>
                            </div>
                        </label>
                    </div>
                </div>

                {/* DANGER ZONE */}
                <div className="pt-8 border-t border-white/5">
                    <button 
                        onClick={onDelete}
                        className="group btn btn-ghost btn-sm w-full gap-3 text-[10px] font-black uppercase hover:bg-error/10 hover:text-error transition-all"
                    >
                        <Trash2 size={14} className="opacity-50 group-hover:opacity-100" />
                        Purge_Asset_Node
                    </button>
                    <p className="text-[8px] text-center mt-3 opacity-20 uppercase tracking-tighter">
                        Warning: This action is irreversible
                    </p>
                </div>

            </div>
        </aside>
    );
}