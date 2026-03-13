import { useState, useEffect } from "react";
import { 
    Menu, Settings, ArrowLeft, MoreVertical, MonitorPlay, Layers 
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
    const { 
        course,
        syncStatus, 
        errorMessage,
        uploadProgress,
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
        uploadCourseThumbnail,
    } = useCourseBuilder(INITIAL_DATA);

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
        let finalThumbnail = draftSettings.thumbnail;

        // Upload thumbnail if a new file was selected
        if (draftSettings.thumbnailFile) {
            try {
                finalThumbnail = await uploadCourseThumbnail(draftSettings.thumbnailFile);
            } catch (err) {
                console.error("Failed to upload thumbnail", err);
                // We'll continue with the rest of the update even if upload fails
            }
        }

        updateCourse({
            title: draftSettings.title,
            price: draftSettings.price,
            difficulty: draftSettings.difficulty,
            description: draftSettings.description,
            category: draftSettings.category,
            language: draftSettings.language,
            status: draftSettings.status,
            thumbnail: finalThumbnail
        });
        
        setDraftSettings(prev => ({ ...prev, thumbnailFile: null }));
        (document.getElementById('course_settings_modal') as HTMLDialogElement)?.close();
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