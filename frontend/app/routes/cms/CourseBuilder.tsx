import { useState } from "react";
import { PropertiesPanel } from "~/components/cms/builder/PropertiesPanel";
import { StructurePanel } from "~/components/cms/builder/StructurePanel";
import { SyncStatus } from "~/components/cms/builder/SyncStatus";
import { Workbench } from "~/components/cms/builder/Workbench";
import { useCourseBuilder } from "~/hooks/useCourseBuilder";

const INITIAL_DATA = { 
    id: "course-123", 
    title: "Demo Course", 
    modules: [] 
};

export default function CourseBuilderLayout() {
    const { 
        course,
        syncStatus, 
        updateCourse, // Added this
        updateModule,
        updateLesson, // Added this
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

    const [activeModuleId, setActiveModuleId] = useState<string | null>(null);
    const [activeLessonId, setActiveLessonId] = useState<string | null>(null);

    const activeModule = course.modules.find(m => m.id === activeModuleId);
    const activeLesson = activeModule?.lessons.find(l => l.id === activeLessonId);

    return (
        <div className="h-[calc(100vh-6rem)] overflow-hidden">
            {/* BUILDER SUB-HEADER */}
            <div className="h-16 flex items-center justify-between px-6 border-b border-white/5 bg-black/20 shrink-0">
                <div className="flex items-center gap-4">
                    <button onClick={() => (document.getElementById('course_settings_modal') as HTMLDialogElement)?.showModal()}>
                        <h1 className="text-xs font-black uppercase tracking-[0.2em] hover:text-primary transition-colors">
                            {course.title} (Edit)
                        </h1>
                    </button>
                    <SyncStatus status={syncStatus} />
                </div>
                
                <div className="flex items-center gap-2">
                    <button className="btn btn-ghost btn-xs opacity-40 hover:opacity-100">Draft Auto-Saved</button>
                    <button className="btn btn-primary btn-sm px-6 rounded-xl font-black uppercase text-[10px]">Deploy</button>
                </div>
            </div>

            {/* COURSE SETTINGS MODAL */}
            <dialog id="course_settings_modal" className="modal backdrop-blur-sm">
                <div className="modal-box bg-[#09090b] border border-white/10">
                    <h3 className="font-bold text-lg mb-4">Course Settings</h3>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="label text-xs opacity-50 uppercase">Course Title</label>
                            <input 
                                type="text" 
                                className="input input-bordered w-full bg-white/5" 
                                value={course.title} 
                                onChange={(e) => updateCourse({ title: e.target.value })} 
                            />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="label text-xs opacity-50 uppercase">Price ($)</label>
                                <input 
                                    type="number" 
                                    className="input input-bordered w-full bg-white/5" 
                                    value={course.price || 0} 
                                    onChange={(e) => updateCourse({ price: parseFloat(e.target.value) })} 
                                />
                            </div>
                            <div>
                                <label className="label text-xs opacity-50 uppercase">Difficulty</label>
                                <select 
                                    className="select select-bordered w-full bg-white/5"
                                    value={course.difficulty || 'Beginner'}
                                    onChange={(e) => updateCourse({ difficulty: e.target.value as any })}
                                >
                                    <option>Beginner</option>
                                    <option>Intermediate</option>
                                    <option>Advanced</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="modal-action">
                        <form method="dialog">
                            <button className="btn btn-sm">Close</button>
                        </form>
                    </div>
                </div>
            </dialog>

            <div className="flex justify-between overflow-hidden h-full">
                {/* Fixed Width Sidebar */}
                <div className="w-72 shrink-0 border-r border-white/5">
                    <StructurePanel 
                        modules={course.modules}
                        activeLessonId={activeLessonId}
                        onSelectLesson={(modId, lesId) => {
                            setActiveModuleId(modId);
                            setActiveLessonId(lesId);
                        }}
                        onAddModule={addModule}
                        onDeleteModule={deleteModule}
                        onAddLesson={addLesson}
                        onDeleteLesson={deleteLesson}
                        onUpdateModule={updateModule} 
                        onReorderLessons={reorderLessons}
                    />
                </div>

                {/* Flexible Editor */}
                <Workbench 
                    lesson={activeLesson} 
                    moduleId={activeModuleId || ""}
                    onUploadVideo={uploadVideo}
                    onAddResource={addResource}
                    onUpdateLesson={updateLesson} 
                    onAddQuizQuestion={addQuizQuestion}
                    onDeleteResource = {deleteResource}
                />

                {/* Fixed Width Properties */}
                <div className="w-80 shrink-0 hidden xl:block">
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
        </div>
    );
}