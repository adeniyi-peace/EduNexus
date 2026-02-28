import { useState, useEffect } from "react";
import { 
    Menu, Settings, Trash2, ArrowLeft, MoreVertical, Layers, MonitorPlay 
} from "lucide-react";
import { PropertiesPanel } from "~/components/cms/builder/PropertiesPanel";
import { StructurePanel } from "~/components/cms/builder/StructurePanel";
import { SyncStatus } from "~/components/cms/builder/SyncStatus";
import { Workbench } from "~/components/cms/builder/Workbench";
import { useCourseBuilder } from "~/hooks/useCourseBuilder";
import { type CourseData } from "~/types/course";

const INITIAL_DATA: CourseData = { 
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

    // --- LOCAL STATE FOR MODAL FORM ---
    // Strictly typed to match CourseData partials
    const [draftSettings, setDraftSettings] = useState<{
        title: string;
        price: number;
        difficulty: CourseData['difficulty'];
    }>({
        title: "",
        price: 0,
        difficulty: "Beginner"
    });

    // Sync draft with real course data when course loads
    useEffect(() => {
        setDraftSettings({
            title: course.title,
            price: course.price || 0,
            difficulty: course.difficulty || "Beginner"
        });
    }, [course.title, course.price, course.difficulty]);

    const handleSaveSettings = () => {
        updateCourse({
            title: draftSettings.title,
            price: draftSettings.price,
            difficulty: draftSettings.difficulty
        });
        (document.getElementById('course_settings_modal') as HTMLDialogElement)?.close();
    };

    const handleCancelSettings = () => {
        setDraftSettings({
            title: course.title,
            price: course.price || 0,
            difficulty: course.difficulty || "Beginner"
        });
        (document.getElementById('course_settings_modal') as HTMLDialogElement)?.close();
    };

    // UI State
    const [activeModuleId, setActiveModuleId] = useState<string | null>(null);
    const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
    const [mobileView, setMobileView] = useState<'structure' | 'workbench' | 'properties'>('workbench');
    const [deleteConfirmText, setDeleteConfirmText] = useState("");

    const activeModule = course.modules?.find(m => m.id === activeModuleId);
    const activeLesson = activeModule?.lessons.find(l => l.id === activeLessonId);

    return (
        <div className="h-screen flex flex-col overflow-hidden bg-base-100 text-base-content font-sans">
            
            {/* --- BUILDER HEADER --- */}
            <header className="h-16 flex items-center justify-between px-4 lg:px-6 border-b border-base-content/5 bg-base-200/50 backdrop-blur-md shrink-0 ">
                <div className="flex items-center gap-4">
                    <button className="btn btn-ghost btn-circle btn-sm text-base-content/40 hover:text-primary transition-colors">
                        <ArrowLeft size={18} />
                    </button>
                    
                    <div className="flex flex-col">
                        <span className="text-[10px] text-base-content/40 uppercase tracking-widest font-black hidden lg:block">
                            Engine // Course_Builder
                        </span>
                        <button 
                            onClick={() => (document.getElementById('course_settings_modal') as HTMLDialogElement)?.showModal()}
                            className="flex items-center gap-2 group text-left"
                        >
                            <h1 className="text-sm font-bold truncate max-w-37.5 lg:max-w-xs group-hover:text-primary transition-colors uppercase tracking-tight">
                                {course.title}
                            </h1>
                            <Settings size={12} className="opacity-0 group-hover:opacity-50 transition-opacity" />
                        </button>
                    </div>

                    <div className="hidden lg:block">
                        <SyncStatus status={syncStatus} />
                    </div>
                </div>
                
                <div className="flex items-center gap-3">
                    <div className="lg:hidden">
                        <SyncStatus status={syncStatus} />
                    </div>
                    <button className="btn btn-primary btn-sm h-9 px-6 rounded-xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-primary/20">
                        Publish_Changes
                    </button>
                </div>
            </header>

            {/* --- MAIN WORKSPACE --- */}
            <main className={`
                flex-1 flex overflow-hidden relative transition-all duration-500
                ${!isReady ? "opacity-30 pointer-events-none grayscale blur-sm" : "opacity-100"}
            `}>
                
                {/* LEFT PANEL: STRUCTURE */}
                <aside className={`
                    absolute inset-0 z-20 bg-base-100 lg:static lg:bg-transparent lg:z-auto lg:w-80 lg:shrink-0 lg:border-r border-base-content/5
                    ${mobileView === 'structure' ? 'block' : 'hidden lg:block'}
                `}>
                    <StructurePanel 
                        modules={course.modules || []}
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
                </aside>

                {/* CENTER PANEL: WORKBENCH */}
                <section className={`
                    flex-1 min-w-0 bg-base-200/30
                    ${mobileView === 'workbench' ? 'block' : 'hidden lg:block'}
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
                </section>

                {/* RIGHT PANEL: PROPERTIES */}
                <aside className={`
                    absolute inset-0 z-20 bg-base-100 lg:static lg:bg-transparent lg:z-auto lg:w-80 lg:shrink-0 lg:border-l border-base-content/5
                    ${mobileView === 'properties' ? 'block' : 'hidden lg:block'}
                `}>
                    <PropertiesPanel 
                        lesson={activeLesson}
                        onUpdate={(fields) => {
                            if (activeModuleId && activeLessonId) {
                                updateLesson(activeModuleId, activeLessonId, fields);
                            }
                        }}
                    />
                </aside>
            </main>

            {/* --- MOBILE NAV --- */}
            <nav className="lg:hidden h-16 border-t border-base-content/10 bg-base-200 shrink-0 grid grid-cols-3">
                <button 
                    onClick={() => setMobileView('structure')}
                    className={`flex flex-col items-center justify-center gap-1 transition-colors ${mobileView === 'structure' ? 'text-primary' : 'text-base-content/30'}`}
                >
                    <Layers size={20} />
                    <span className="text-[9px] font-black uppercase tracking-tighter">Outline</span>
                </button>
                <button 
                    onClick={() => setMobileView('workbench')}
                    className={`flex flex-col items-center justify-center gap-1 transition-colors ${mobileView === 'workbench' ? 'text-primary' : 'text-base-content/30'}`}
                >
                    <MonitorPlay size={20} />
                    <span className="text-[9px] font-black uppercase tracking-tighter">Editor</span>
                </button>
                <button 
                    onClick={() => setMobileView('properties')}
                    className={`flex flex-col items-center justify-center gap-1 transition-colors ${mobileView === 'properties' ? 'text-primary' : 'text-base-content/30'}`}
                >
                    <Settings size={20} />
                    <span className="text-[9px] font-black uppercase tracking-tighter">Config</span>
                </button>
            </nav>

            {/* --- SETTINGS MODAL --- */}
            <dialog id="course_settings_modal" className="modal modal-bottom sm:modal-middle backdrop-blur-sm">
                <div className="modal-box bg-base-100 border border-base-content/10 max-w-md p-8 rounded-4xl">
                    <h3 className="font-black text-xl mb-6 italic uppercase tracking-tighter">Course_Settings</h3>
                    
                    <div className="space-y-6">
                        <div className="space-y-4">
                            <div className="form-control">
                                <label className="label py-1">
                                    <span className="label-text text-[10px] opacity-40 uppercase font-black tracking-widest">Course Title</span>
                                </label>
                                <input 
                                    type="text" 
                                    className="input input-bordered w-full bg-base-200 border-none focus:ring-2 ring-primary/20 transition-all font-bold" 
                                    value={draftSettings.title} 
                                    onChange={(e) => setDraftSettings(prev => ({ ...prev, title: e.target.value }))} 
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="form-control">
                                    <label className="label py-1">
                                        <span className="label-text text-[10px] opacity-40 uppercase font-black tracking-widest">Price ($)</span>
                                    </label>
                                    <input 
                                        type="number" 
                                        className="input input-bordered w-full bg-base-200 border-none font-bold" 
                                        value={draftSettings.price} 
                                        onChange={(e) => setDraftSettings(prev => ({ ...prev, price: parseFloat(e.target.value) }))} 
                                    />
                                </div>
                                <div className="form-control">
                                    <label className="label py-1">
                                        <span className="label-text text-[10px] opacity-40 uppercase font-black tracking-widest">Difficulty</span>
                                    </label>
                                    <select 
                                        className="select select-bordered w-full bg-base-200 border-none font-bold"
                                        value={draftSettings.difficulty}
                                        onChange={(e) => setDraftSettings(prev => ({ ...prev, difficulty: e.target.value as any }))}
                                    >
                                        <option value="Beginner">Beginner</option>
                                        <option value="Intermediate">Intermediate</option>
                                        <option value="Advanced">Advanced</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="divider opacity-5"></div>

                        {/* Danger Zone */}
                        <div className="rounded-2xl border border-error/20 bg-error/5 p-5">
                            <h4 className="text-error text-[10px] font-black uppercase tracking-widest flex items-center gap-2 mb-2">
                                <Trash2 size={14} /> Critical_Zone
                            </h4>
                            <p className="text-xs text-error/60 mb-4 leading-relaxed">
                                Deleting this course will purge all associated modules and media. Type <span className="font-mono bg-error/10 px-1 rounded text-error font-bold">DELETE</span> to confirm.
                            </p>
                            <div className="flex gap-2">
                                <input 
                                    type="text" 
                                    placeholder="Type DELETE"
                                    className="input input-sm input-bordered flex-1 bg-base-100 border-error/20 text-error focus:border-error placeholder:text-error/20 font-bold"
                                    value={deleteConfirmText}
                                    onChange={(e) => setDeleteConfirmText(e.target.value)}
                                />
                                <button 
                                    disabled={deleteConfirmText !== "DELETE"}
                                    onClick={deleteCourse}
                                    className="btn btn-sm btn-error text-white px-4 rounded-lg disabled:opacity-20"
                                >
                                    Purge
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="modal-action gap-2">
                        <button 
                            type="button"
                            onClick={handleCancelSettings}
                            className="btn btn-ghost btn-sm uppercase text-[10px] font-black"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={handleSaveSettings}
                            className="btn btn-primary btn-sm px-6 rounded-xl uppercase text-[10px] font-black shadow-lg shadow-primary/20"
                        >
                            Save_Changes
                        </button>
                    </div>
                </div>
            </dialog>
        </div>
    );
}