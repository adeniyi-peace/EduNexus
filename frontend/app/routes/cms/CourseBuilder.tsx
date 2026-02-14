import { useState, useEffect } from "react";
import { 
    Menu, Settings, Trash2, ArrowLeft, MoreVertical, Layers, MonitorPlay 
} from "lucide-react";
import { PropertiesPanel } from "~/components/cms/builder/PropertiesPanel";
import { StructurePanel } from "~/components/cms/builder/StructurePanel";
import { SyncStatus } from "~/components/cms/builder/SyncStatus";
import { Workbench } from "~/components/cms/builder/Workbench";
import { useCourseBuilder } from "~/hooks/useCourseBuilder";

const INITIAL_DATA = { 
    id: "course-123", 
    title: "New Course Shell", 
    modules: [] 
};

export default function CourseBuilderLayout() {
    const { 
        course,
        syncStatus, 
        isReady,
        updateCourse,
        deleteCourse,
        updateModule,
        updateLesson,
        reorderLessons,
        addQuizQuestion,
        addModule, 
        deleteModule, 
        addLesson, 
        deleteLesson, 
        uploadVideo,
        addResource,
        deleteResource,
    } = useCourseBuilder(INITIAL_DATA);

    // --- LOCAL STATE FOR MODAL FORM (The Fix) ---
    const [draftSettings, setDraftSettings] = useState({
        title: "",
        price: 0,
        difficulty: "Beginner"
    });

    // Sync draft with real course data when course loads
    useEffect(() => {
        setDraftSettings({
            title: course.title,
            price: course.price || 0,
            difficulty: (course.difficulty || "Beginner") as string
        });
    }, [course.title, course.price, course.difficulty]);

    // Handle Saving
    const handleSaveSettings = () => {
        updateCourse({
            title: draftSettings.title,
            price: draftSettings.price,
            difficulty: draftSettings.difficulty as any
        });
        (document.getElementById('course_settings_modal') as HTMLDialogElement)?.close();
    };

    // Handle Cancel / Reset
    const handleCancelSettings = () => {
        // Reset form to current actual course data
        setDraftSettings({
            title: course.title,
            price: course.price || 0,
            difficulty: (course.difficulty || "Beginner") as string
        });
        (document.getElementById('course_settings_modal') as HTMLDialogElement)?.close();
    };


    // UI State
    const [activeModuleId, setActiveModuleId] = useState<string | null>(null);
    const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
    const [mobileView, setMobileView] = useState<'structure' | 'workbench' | 'properties'>('workbench');
    const [deleteConfirmText, setDeleteConfirmText] = useState("");

    const activeModule = course.modules.find(m => m.id === activeModuleId);
    const activeLesson = activeModule?.lessons.find(l => l.id === activeLessonId);

    return (
        <div className="h-screen flex flex-col overflow-hidden bg-[#09090b] text-white">
            
            {/* --- BUILDER HEADER --- */}
            <div className="h-14 lg:h-16 flex items-center justify-between px-4 lg:px-6 border-b border-white/5 bg-black/40 shrink-0 z-50">
                <div className="flex items-center gap-3 lg:gap-4">
                    <button className="btn btn-ghost btn-circle btn-sm text-white/40 hover:text-white">
                        <ArrowLeft size={18} />
                    </button>
                    
                    <div className="flex flex-col">
                        <span className="text-[10px] text-white/40 uppercase tracking-wider font-bold hidden lg:block">Course Builder</span>
                        <button 
                            onClick={() => (document.getElementById('course_settings_modal') as HTMLDialogElement)?.showModal()}
                            className="flex items-center gap-2 group"
                        >
                            <h1 className="text-sm font-bold truncate max-w-37.5 lg:max-w-xs group-hover:text-primary transition-colors">
                                {course.title}
                            </h1>
                            <Settings size={12} className="opacity-0 group-hover:opacity-50 transition-opacity" />
                        </button>
                    </div>

                    <div className="hidden lg:block">
                        <SyncStatus status={syncStatus} />
                    </div>
                </div>
                
                <div className="flex items-center gap-2">
                    <SyncStatus status={syncStatus} />
                    <button className="btn btn-primary btn-sm h-9 px-4 lg:px-6 rounded-xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-primary/20">
                        Publish
                    </button>
                </div>
            </div>

            {/* --- MAIN WORKSPACE --- */}
            <div className={`
                flex-1 flex overflow-hidden relative transition-all duration-500
                ${!isReady ? "opacity-30 pointer-events-none grayscale blur-[1px]" : "opacity-100"}
            `}>
                
                {/* LEFT PANEL */}
                <div className={`
                    absolute inset-0 z-20 bg-[#09090b] lg:static lg:bg-transparent lg:z-auto lg:w-72 lg:shrink-0 lg:border-r border-white/5 lg:block
                    ${mobileView === 'structure' ? 'block' : 'hidden'}
                `}>
                    <StructurePanel 
                        modules={course.modules}
                        activeLessonId={activeLessonId}
                        onSelectLesson={(modId, lesId) => {
                            setActiveModuleId(modId);
                            setActiveLessonId(lesId);
                            setMobileView('workbench');
                        }}
                        onAddModule={addModule}
                        onDeleteModule={deleteModule}
                        onAddLesson={addLesson}
                        onDeleteLesson={deleteLesson}
                        onUpdateModule={updateModule} 
                        onReorderLessons={reorderLessons}
                    />
                </div>

                {/* CENTER PANEL */}
                <div className={`
                    flex-1 min-w-0 bg-[#0c0c0e] lg:block
                    ${mobileView === 'workbench' ? 'block' : 'hidden'}
                `}>
                    <Workbench 
                        lesson={activeLesson} 
                        moduleId={activeModuleId || ""}
                        onUploadVideo={uploadVideo}
                        onAddResource={addResource}
                        onUpdateLesson={updateLesson} 
                        onAddQuizQuestion={addQuizQuestion}
                        onDeleteResource={deleteResource}
                    />
                </div>

                {/* RIGHT PANEL */}
                <div className={`
                    absolute inset-0 z-20 bg-[#09090b] lg:static lg:bg-transparent lg:z-auto lg:w-80 lg:shrink-0 lg:border-l border-white/5 lg:block
                    ${mobileView === 'properties' ? 'block' : 'hidden'}
                `}>
                    <PropertiesPanel 
                        lesson={activeLesson}
                        onUpdate={(fields) => {
                            if (activeModuleId && activeLessonId) {
                                updateLesson(activeModuleId, activeLessonId, fields);
                            }
                        }}
                    />
                </div>
            </div>

            {/* --- MOBILE NAV --- */}
            <div className="lg:hidden h-16 border-t border-white/10 bg-[#09090b] shrink-0 grid grid-cols-3">
                <button 
                    onClick={() => setMobileView('structure')}
                    className={`flex flex-col items-center justify-center gap-1 ${mobileView === 'structure' ? 'text-primary' : 'text-white/20'}`}
                >
                    <Layers size={20} />
                    <span className="text-[9px] font-bold uppercase">Outline</span>
                </button>
                <button 
                    onClick={() => setMobileView('workbench')}
                    className={`flex flex-col items-center justify-center gap-1 ${mobileView === 'workbench' ? 'text-primary' : 'text-white/20'}`}
                >
                    <MonitorPlay size={20} />
                    <span className="text-[9px] font-bold uppercase">Editor</span>
                </button>
                <button 
                    onClick={() => setMobileView('properties')}
                    className={`flex flex-col items-center justify-center gap-1 ${mobileView === 'properties' ? 'text-primary' : 'text-white/20'}`}
                >
                    <Settings size={20} />
                    <span className="text-[9px] font-bold uppercase">Settings</span>
                </button>
            </div>


            {/* --- SETTINGS MODAL (UPDATED) --- */}
            <dialog id="course_settings_modal" className="modal backdrop-blur-md">
                <div className="modal-box bg-[#09090b] border border-white/10 max-w-md">
                    <h3 className="font-bold text-lg mb-6">Course Settings</h3>
                    
                    <div className="space-y-6">
                        {/* Basic Fields */}
                        <div className="space-y-4">
                            <div>
                                <label className="label text-xs opacity-50 uppercase font-bold">Course Title</label>
                                <input 
                                    type="text" 
                                    className="input input-bordered w-full bg-white/5 border-white/10 focus:border-primary focus:outline-none" 
                                    value={draftSettings.title} 
                                    onChange={(e) => setDraftSettings(prev => ({ ...prev, title: e.target.value }))} 
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="label text-xs opacity-50 uppercase font-bold">Price ($)</label>
                                    <input 
                                        type="number" 
                                        className="input input-bordered w-full bg-white/5 border-white/10" 
                                        value={draftSettings.price} 
                                        onChange={(e) => setDraftSettings(prev => ({ ...prev, price: parseFloat(e.target.value) }))} 
                                    />
                                </div>
                                <div>
                                    <label className="label text-xs opacity-50 uppercase font-bold">Difficulty</label>
                                    <select 
                                        className="select select-bordered w-full bg-white/5 border-white/10"
                                        value={draftSettings.difficulty}
                                        onChange={(e) => setDraftSettings(prev => ({ ...prev, difficulty: e.target.value }))}
                                    >
                                        <option>Beginner</option>
                                        <option>Intermediate</option>
                                        <option>Advanced</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="divider before:bg-white/5 after:bg-white/5"></div>

                        {/* Danger Zone */}
                        <div className="rounded-xl border border-error/20 bg-error/5 p-4">
                            <h4 className="text-error text-sm font-bold flex items-center gap-2 mb-2">
                                <Trash2 size={14} /> Danger Zone
                            </h4>
                            <p className="text-xs text-error/60 mb-4">
                                This action cannot be undone. To confirm deletion, type <span className="font-mono bg-error/10 px-1 rounded select-all">DELETE</span> below.
                            </p>
                            <div className="flex gap-2">
                                <input 
                                    type="text" 
                                    placeholder="Type DELETE"
                                    className="input input-sm input-bordered flex-1 bg-black/20 border-error/20 text-error focus:border-error"
                                    value={deleteConfirmText}
                                    onChange={(e) => setDeleteConfirmText(e.target.value)}
                                />
                                <button 
                                    disabled={deleteConfirmText !== "DELETE"}
                                    onClick={deleteCourse}
                                    className="btn btn-sm btn-error text-white disabled:bg-white/5 disabled:text-white/20"
                                >
                                    Delete Course
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="modal-action">
                        {/* Cancel Button */}
                        <button 
                            type="button"
                            onClick={handleCancelSettings}
                            className="btn btn-sm btn-ghost hover:bg-white/5"
                        >
                            Cancel
                        </button>
                        
                        {/* Save Button */}
                        <button 
                            onClick={handleSaveSettings}
                            className="btn btn-sm btn-primary text-white"
                        >
                            Save Changes
                        </button>
                    </div>
                </div>
            </dialog>

            {/* LOADING OVERLAY */}
            {/* {!isReady && (
                <div className="absolute inset-0 z-60 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div className="flex flex-col items-center gap-3">
                        <span className="loading loading-spinner text-primary loading-lg"></span>
                        <span className="text-xs font-black uppercase tracking-widest text-white/50 animate-pulse">
                            Initializing Workspace...
                        </span>
                    </div>
                </div>
            )} */}
        </div>
    );
}