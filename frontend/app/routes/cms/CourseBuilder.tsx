import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { 
    Menu, Settings, ArrowLeft, MoreVertical, MonitorPlay, Layers, Archive, ChevronDown, CheckCircle, RotateCcw 
} from "lucide-react";
import { PropertiesPanel } from "~/components/cms/builder/PropertiesPanel";
import { StructurePanel } from "~/components/cms/builder/StructurePanel";
import { SyncStatus } from "~/components/cms/builder/SyncStatus";
import { Workbench } from "~/components/cms/builder/Workbench";
import { useCourseBuilder } from "~/hooks/useCourseBuilder";
import { type CourseData } from "~/types/course";
import { InitializationOverlay } from "~/components/cms/builder/InitializationOverlay";
import { SettingsModal } from "~/components/cms/builder/SettingsModal";

const INITIAL_DATA: CourseData = { 
    id: "new-course", 
    title: "New Course Shell", 
    modules: [] 
};

export default function CourseBuilderLayout() {
    const { id } = useParams();

    const { 
        course,
        syncStatus, 
        errorMessage,
        uploadProgress,
        isReady,
        loadCourse,
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
        uploadCourseThumbnail,
    } = useCourseBuilder(INITIAL_DATA);

    // Load existing course if ID exists
    useEffect(() => {
        if (id && course.id === "new-course") {
            loadCourse(id);
        }
    }, [id, loadCourse, course.id]);

    // --- LOCAL STATE FOR MODAL FORM ---
    // Strictly typed to match CourseData partials
    const [draftSettings, setDraftSettings] = useState<{
        title: string;
        price: number;
        difficulty: CourseData['difficulty'];
        description: string;
        category: string;
        language: string;
        status: CourseData['status'];
        thumbnail: string;
        thumbnailFile: File | null;
    }>({
        title: "",
        price: 0,
        difficulty: "Beginner",
        description: "",
        category: "",
        language: "English",
        status: "Draft",
        thumbnail: "",
        thumbnailFile: null
    });

    // Sync draft with real course data when course loads
    useEffect(() => {
        setDraftSettings({
            title: course.title || "",
            price: course.price || 0,
            difficulty: course.difficulty || "Beginner",
            description: course.description || "",
            category: course.category || "",
            language: course.language || "English",
            status: course.status || "Draft",
            thumbnail: course.thumbnail || "",
            thumbnailFile: null
        });
    }, [course]);

    const onThumbnailSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setDraftSettings(prev => ({
                ...prev,
                thumbnailFile: file,
                thumbnail: URL.createObjectURL(file)
            }));
        }
    };

    const handleSaveSettings = async () => {
        try {
            // 1. Initialize course or update core fields first. 
            // We need the server-assigned ID for thumbnail upload if it's new.
            const updatedCourse = await updateCourse({
                title: draftSettings.title,
                price: draftSettings.price,
                difficulty: draftSettings.difficulty,
                description: draftSettings.description,
                category: draftSettings.category,
                language: draftSettings.language,
                status: draftSettings.status,
            });

            const courseId = updatedCourse.id;
            let finalThumbnail = draftSettings.thumbnail;

            // 2. Now upload the thumbnail if a file is selected, using the guaranteed ID
            if (draftSettings.thumbnailFile) {
                finalThumbnail = await uploadCourseThumbnail(draftSettings.thumbnailFile, courseId);
            }

            // 3. Final sync for the thumbnail URL if it was uploaded
            if (draftSettings.thumbnailFile) {
                await updateCourse({ thumbnail: finalThumbnail });
            }

            setDraftSettings(prev => ({ ...prev, thumbnailFile: null }));
            
            // Only close if everything succeeded
            (document.getElementById('course_settings_modal') as HTMLDialogElement)?.close();
        } catch (err) {
            console.error("Critical Save Failure:", err);
            
            // Error is already handled/set in useCourseBuilder, 
            // the modal will stay open so the user can see the errorMessage prop.
        }
    };

    const handleCancelSettings = () => {
        setDraftSettings({
            title: course.title || "",
            price: course.price || 0,
            difficulty: course.difficulty || "Beginner",
            description: course.description || "",
            category: course.category || "",
            language: course.language || "English",
            status: course.status || "Draft",
            thumbnail: course.thumbnail || "",
            thumbnailFile: null
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
                    
                    <div className="flex items-center bg-base-300/40 rounded-xl p-0.5 border border-base-content/5">
                        {/* --- DYNAMIC PRIMARY ACTION --- */}
                        {course.status === 'Draft' && (
                            <button 
                                onClick={() => updateCourse({ status: 'Published' })}
                                className="btn btn-primary btn-sm h-8 px-4 rounded-lg font-black uppercase text-[9px] tracking-widest shadow-lg shadow-primary/20 flex items-center gap-2"
                            >
                                <CheckCircle size={12} />
                                Publish_Course
                            </button>
                        )}
                        {course.status === 'Published' && (
                            <button 
                                onClick={() => updateCourse({ status: 'Draft' })}
                                className="btn btn-ghost btn-sm h-8 px-4 rounded-lg font-black uppercase text-[9px] tracking-widest hover:bg-base-content/5 flex items-center gap-2"
                            >
                                <RotateCcw size={12} />
                                Unpublish_to_Draft
                            </button>
                        )}
                        {course.status === 'Archived' && (
                            <button 
                                onClick={() => updateCourse({ status: 'Draft' })}
                                className="btn btn-success btn-sm h-8 px-4 rounded-lg font-black uppercase text-[9px] tracking-widest shadow-lg shadow-success/20 text-success-content flex items-center gap-2"
                            >
                                <RotateCcw size={12} />
                                Restore_to_Draft
                            </button>
                        )}
                        
                        {/* --- DYNAMIC SECONDARY ACTIONS DROPDOWN --- */}
                        <div className="dropdown dropdown-end">
                            <label tabIndex={0} className="btn btn-ghost btn-sm h-8 px-2 rounded-lg text-base-content/40 hover:text-primary transition-colors">
                                <ChevronDown size={14} />
                            </label>
                            <ul tabIndex={0} className="dropdown-content z-[100] menu p-2 mt-2 shadow-2xl bg-base-200 border border-base-content/10 rounded-2xl w-52 glass-panel">
                                <li className="menu-title px-4 py-2 border-b border-base-content/5">
                                    <span className="text-[8px] font-black uppercase tracking-[0.2em] opacity-40">Status_Management</span>
                                </li>
                                
                                {course.status !== 'Published' && (
                                    <li>
                                        <button 
                                            onClick={() => updateCourse({ status: 'Published' })}
                                            className="flex items-center gap-3 py-3 hover:bg-primary/10 text-xs font-bold transition-all group"
                                        >
                                            <CheckCircle size={14} className="opacity-40 group-hover:opacity-100 group-hover:text-primary" />
                                            <span className="uppercase tracking-tight">Publish_Live</span>
                                        </button>
                                    </li>
                                )}

                                {course.status !== 'Draft' && (
                                    <li>
                                        <button 
                                            onClick={() => updateCourse({ status: 'Draft' })}
                                            className="flex items-center gap-3 py-3 hover:bg-info/10 text-xs font-bold transition-all group"
                                        >
                                            <RotateCcw size={14} className="opacity-40 group-hover:opacity-100 group-hover:text-info" />
                                            <span className="uppercase tracking-tight">Return_to_Draft</span>
                                        </button>
                                    </li>
                                )}

                                {course.status !== 'Archived' && (
                                    <li>
                                        <button 
                                            onClick={() => updateCourse({ status: 'Archived' })}
                                            className="flex items-center gap-3 py-3 hover:bg-warning/10 text-xs font-bold transition-all group"
                                        >
                                            <Archive size={14} className="opacity-40 group-hover:opacity-100 group-hover:text-warning" />
                                            <span className="uppercase tracking-tight">Move_to_Archive</span>
                                        </button>
                                    </li>
                                )}
                            </ul>
                        </div>
                    </div>
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
                        uploadProgress={uploadProgress}
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

            <SettingsModal 
                isOpen={false} // Managed by DaisyUI modal ID
                course={course}
                draftSettings={draftSettings}
                uploadProgress={uploadProgress}
                deleteConfirmText={deleteConfirmText}
                onDraftChange={(fields) => setDraftSettings(prev => ({ ...prev, ...fields }))}
                onThumbnailSelect={onThumbnailSelect}
                onSave={handleSaveSettings}
                onCancel={handleCancelSettings}
                onDelete={deleteCourse}
                onDeleteConfirmTextChange={setDeleteConfirmText}
                error={errorMessage}
            />

            {!isReady && (
                <InitializationOverlay 
                    onOpenSettings={() => (document.getElementById('course_settings_modal') as HTMLDialogElement)?.showModal()} 
                    error={errorMessage}
                />
            )}
        </div>
    );
}
