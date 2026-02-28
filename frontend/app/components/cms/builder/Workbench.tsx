import { Upload, X, Plus, Trash2, CheckCircle, Clock, FileText, AlignLeft, Play } from "lucide-react";
import type { Lesson, Resource, QuizQuestion } from "~/types/course";

interface WorkbenchProps {
    lesson: Lesson | undefined;
    moduleId: string;
    onUpdateLesson: (modId: string, lesId: string, data: Partial<Lesson>) => void;
    onAddQuizQuestion: (modId: string, lesId: string) => void;
    onUploadVideo: (modId: string, lesId: string, file: File) => void;
    onAddResource: (modId: string, lesId: string, file: File) => void;
    onDeleteResource: (modId: string, lesId: string, resourceId: string) => void;
}

export function Workbench({ 
    lesson, 
    moduleId, 
    onUploadVideo, 
    onAddResource, 
    onUpdateLesson, 
    onAddQuizQuestion, 
    onDeleteResource 
}: WorkbenchProps) {

    // Empty State
    if (!lesson) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center bg-base-100 relative overflow-hidden">
                <div className="absolute inset-0 opacity-[0.02] pointer-events-none" 
                     style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
                <div className="relative text-center space-y-4">
                    <div className="w-16 h-16 bg-base-300 rounded-3xl mx-auto flex items-center justify-center border border-base-content/5">
                        <Play size={24} className="opacity-20" />
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-30">Select_Node_To_Initialize</p>
                </div>
            </div>
        );
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            onUploadVideo(moduleId, lesson.id, e.target.files[0]);
        }
    };

    const handleResourceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            onAddResource(moduleId, lesson.id, e.target.files[0]);
        }
    };

    return (
        <div className="flex-1 bg-blackbase-100 relative flex flex-col h-full overflow-hidden">
            {/* --- CANVAS BACKGROUND --- */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                 style={{ backgroundImage: 'radial-gradient(#000000 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

            {/* --- WORKBENCH HEADER --- */}
            <div className="h-14 border-b border-base-content/5 flex items-center justify-between px-6 bg-base-200/50 backdrop-blur-md z-10">
                <div className="flex items-center gap-4 flex-1">
                    <input 
                        className="text-sm font-black bg-transparent border-none focus:outline-none w-full placeholder:opacity-10  "
                        value={lesson.title}
                        onChange={(e) => onUpdateLesson(moduleId, lesson.id, { title: e.target.value })}
                        placeholder="UNTITLED_LESSON_NODE..."
                    />
                    <div className="badge badge-outline border-primary/20 text-primary text-[9px] font-mono h-5 px-2 uppercase">
                        {lesson.type}
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <div className="text-[9px] font-mono opacity-30 uppercase tracking-widest mr-4">Auto_Save_Active</div>
                </div>
            </div>

            {/* --- MAIN EDITOR CANVAS --- */}
            <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar">
                <div className="max-w-4xl mx-auto p-8 lg:p-12 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">

                    {/* --- VIDEO CONTENT TYPE --- */}
                    {lesson.type === 'video' && (
                        <section className="space-y-6">
                            <div className="aspect-video bg-black rounded-4xl border border-base-content/10 relative overflow-hidden group shadow-2xl">
                                {lesson.videoUrl ? (
                                    <video src={lesson.videoUrl} controls className="w-full h-full object-cover" />
                                ) : (
                                    <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer hover:bg-primary/5 transition-all group">
                                        <div className="w-16 h-16 rounded-full bg-base-200 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                            <Upload size={24} className="opacity-40 group-hover:text-primary group-hover:opacity-100" />
                                        </div>
                                        <span className="text-xs font-black uppercase tracking-widest opacity-40">Upload_Source_Asset</span>
                                        <input type="file" accept="video/*" className="hidden" onChange={handleFileChange} />
                                    </label>
                                )}
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-base-200/50 rounded-2xl border border-base-content/5">
                                    <h4 className="text-[9px] font-black opacity-30 uppercase mb-1">Asset_Duration</h4>
                                    <p className="font-mono text-sm">{lesson.duration ? `${Math.round(lesson.duration)}s` : '--'}</p>
                                </div>
                                <div className="p-4 bg-base-200/50 rounded-2xl border border-base-content/5">
                                    <h4 className="text-[9px] font-black opacity-30 uppercase mb-1">Deployment_Status</h4>
                                    <p className={`font-mono text-sm ${lesson.videoUrl ? 'text-success' : 'text-warning'}`}>
                                        {lesson.videoUrl ? 'READY' : 'PENDING_UPLOAD'}
                                    </p>
                                </div>
                            </div>

                            <div className="p-6 bg-base-200/30 border border-base-content/5 rounded-3xl space-y-4">
                                <div className="flex items-center gap-2 text-[10px] font-black uppercase opacity-40">
                                    <AlignLeft size={14} /> Description / Context
                                </div>
                                <textarea 
                                    className="textarea w-full h-32 bg-transparent border-none focus:ring-0 p-0 text-sm leading-relaxed resize-none placeholder:opacity-20" 
                                    placeholder="Enter descriptive overview for this lesson..."
                                    value={lesson.description || ""}
                                    onChange={(e) => onUpdateLesson(moduleId, lesson.id, { description: e.target.value })}
                                />
                            </div>
                        </section>
                    )}

                    {/* --- ARTICLE CONTENT TYPE --- */}
                    {lesson.type === 'article' && (
                        <section className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-[10px] font-black uppercase opacity-40">
                                    <FileText size={14} /> Document_Editor
                                </div>
                                <div className="text-[9px] font-mono opacity-20">MARKDOWN_SUPPORTED</div>
                            </div>
                            <textarea 
                                className="w-full h-96 bg-base-200/50 border border-base-content/5 rounded-4xl p-6 focus:outline-none focus:border-primary/30 transition-colors font-mono text-sm leading-relaxed"
                                placeholder="# Write your article content here (Markdown/HTML)..."
                                value={lesson.content || ""}
                                onChange={(e) => onUpdateLesson(moduleId, lesson.id, { content: e.target.value })}
                            />
                        </section>
                    )}

                    {/* --- QUIZ CONTENT TYPE --- */}
                    {lesson.type === 'quiz' && (
                        <section className="space-y-8">
                            <div className="flex items-center gap-4 bg-primary/5 p-6 rounded-3xl border border-primary/10">
                                <div className="p-3 bg-primary/10 rounded-xl text-primary">
                                    <Clock size={20} />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-[10px] font-black uppercase tracking-widest opacity-60">Session_Time_Limit</h3>
                                    <p className="text-[9px] opacity-40">Minutes allowed for completion</p>
                                </div>
                                <input 
                                    type="number" 
                                    className="input bg-base-300 w-24 text-center font-mono font-bold"
                                    value={lesson.quizConfig?.timeLimit || 10}
                                    onChange={(e) => onUpdateLesson(moduleId, lesson.id, { 
                                        quizConfig: { ...lesson.quizConfig!, timeLimit: parseInt(e.target.value) } 
                                    })}
                                />
                            </div>

                            <div className="space-y-4">
                                {lesson.quizConfig?.questions?.map((q, qIdx) => (
                                    <div key={q.id} className="bg-base-200/40 p-8 rounded-4xl border border-base-content/5 space-y-6 relative group transition-all hover:border-base-content/10">
                                        <div className="flex gap-4">
                                            <span className="font-mono text-xs opacity-20 mt-1">{String(qIdx + 1).padStart(2, '0')}</span>
                                            <input 
                                                className="flex-1 bg-transparent font-black text-sm focus:outline-none border-b border-transparent focus:border-primary/20 pb-2 uppercase tracking-tight"
                                                value={q.text}
                                                placeholder="ENTER_QUESTION_PROMPT..."
                                                onChange={(e) => {
                                                    const newQuestions = [...(lesson.quizConfig?.questions || [])];
                                                    newQuestions[qIdx].text = e.target.value;
                                                    onUpdateLesson(moduleId, lesson.id, { quizConfig: { ...lesson.quizConfig!, questions: newQuestions }});
                                                }}
                                            />
                                        </div>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-8">
                                            {q.options.map((opt, oIdx) => (
                                                <div key={oIdx} className={`
                                                    flex items-center gap-3 p-3 rounded-xl border transition-all
                                                    ${opt.isCorrect ? 'bg-success/5 border-success/20' : 'bg-base-300/50 border-transparent hover:border-base-content/10'}
                                                `}>
                                                    <button 
                                                        onClick={() => {
                                                            const newQuestions = [...(lesson.quizConfig?.questions || [])];
                                                            newQuestions[qIdx].options.forEach((o, i) => o.isCorrect = i === oIdx);
                                                            onUpdateLesson(moduleId, lesson.id, { quizConfig: { ...lesson.quizConfig!, questions: newQuestions }});
                                                        }}
                                                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${opt.isCorrect ? 'border-success bg-success' : 'border-base-content/20'}`}
                                                    >
                                                        {opt.isCorrect && <CheckCircle size={12} className="text-white" />}
                                                    </button>
                                                    <input 
                                                        className="flex-1 bg-transparent text-xs focus:outline-none font-medium"
                                                        value={opt.text}
                                                        onChange={(e) => {
                                                            const newQuestions = [...(lesson.quizConfig?.questions || [])];
                                                            newQuestions[qIdx].options[oIdx].text = e.target.value;
                                                            onUpdateLesson(moduleId, lesson.id, { quizConfig: { ...lesson.quizConfig!, questions: newQuestions }});
                                                        }}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <button 
                                onClick={() => onAddQuizQuestion(moduleId, lesson.id)}
                                className="btn btn-outline border-dashed w-full rounded-2xl border-base-content/10 hover:border-primary text-[10px] font-black uppercase tracking-widest"
                            >
                                <Plus size={16} /> Append_New_Question
                            </button>
                        </section>
                    )}

                    {/* --- RESOURCES GLOBAL SECTION --- */}
                    {(lesson.type === "video" || lesson.type === "article") && (
                        <footer className="pt-12 border-t border-base-content/5">
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h3 className="text-xs font-black uppercase tracking-[0.2em] opacity-80">Supplementary_Assets</h3>
                                    <p className="text-[9px] opacity-30 font-mono">ATTACH_PDF_DOCS_OR_ARCHIVES</p>
                                </div>
                                <label className="btn btn-sm btn-ghost bg-base-content/5 hover:bg-primary hover:text-primary-content rounded-xl text-[10px] font-black uppercase">
                                    + Attach_File
                                    <input type="file" className="hidden" onChange={handleResourceChange} />
                                </label>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {lesson.resources.length === 0 && (
                                    <div className="col-span-2 py-12 border-2 border-dashed border-base-content/5 rounded-4xl flex flex-col items-center justify-center opacity-20">
                                        <FileText size={32} className="mb-2" />
                                        <p className="text-[10px] font-black uppercase tracking-widest">No_Resources_Linked</p>
                                    </div>
                                )}
                                {lesson.resources.map((res) => (
                                    <div key={res.id} className="flex items-center justify-between p-4 bg-base-200/50 rounded-2xl border border-base-content/5 group hover:border-primary/20 transition-all">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className="w-10 h-10 bg-base-300 rounded-xl flex items-center justify-center text-primary shadow-inner">
                                                <FileText size={18} />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-xs font-black truncate uppercase tracking-tight">{res.title}</p>
                                                <p className="text-[9px] opacity-30 font-mono">{res.size}</p>
                                            </div>
                                        </div>
                                        <button 
                                            className="btn btn-ghost btn-circle btn-xs text-base-content/10 hover:text-error hover:bg-error/10 opacity-0 group-hover:opacity-100 transition-all" 
                                            onClick={() => onDeleteResource(moduleId, lesson.id, res.id)}
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </footer>
                    )}
                </div>
            </div>
        </div>
    );
}