// components/builder/Workbench.tsx
import { Upload, X, Plus, Trash2, CheckCircle, Clock, FileText, AlignLeft } from "lucide-react";
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

export function Workbench({ lesson, moduleId, onUploadVideo, onAddResource, onUpdateLesson, onAddQuizQuestion, onDeleteResource }: WorkbenchProps) {
    if (!lesson) return <div className="p-10 text-center opacity-40">Select a lesson node</div>;

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

    const removeResource = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            onAddResource(moduleId, lesson.id, e.target.files[0]);
        }
    };
    
    return (
        <div className="flex-1 bg-[#09090b] relative flex flex-col h-full overflow-hidden">
            {/* Canvas Background Grid */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                 style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '24px 24px' }} 
            />

            <div className="h-14 border-b border-white/5 flex items-center justify-between px-6 bg-white/2">
                <div className="flex items-center gap-4">
                    <input 
                        className="text-sm font-black bg-transparent border-none focus:outline-none w-full placeholder:opacity-20"
                        value={lesson.title}
                        onChange={(e) => onUpdateLesson(moduleId, lesson.id, { title: e.target.value })}
                        placeholder="Enter Lesson Title..."
                    />
                    <span className="badge badge-xs bg-emerald-500/20 text-emerald-400 border-none font-mono">{lesson.type}</span>
                </div>
            </div>

            {/* Scrollable Content Area */}
            <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar p-8 lg:p-12">
                <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-300">

                    {/* --- VIDEO EDITOR UI --- */}
                    {/* 1. Video Uploader */}
                    {lesson.type === 'video' && (
                        <div className="space-y-4">
                            <div className="aspect-video bg-black rounded-3xl border border-white/10 relative overflow-hidden group">
                                {lesson.videoUrl ? (
                                    <video src={lesson.videoUrl} controls className="w-full h-full object-cover" />
                                ) : (
                                    <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer hover:bg-white/5 transition-all">
                                        <Upload size={32} className="mb-2 opacity-50" />
                                        <span className="text-xs font-black uppercase tracking-widest opacity-40">Click to Upload Video</span>
                                        <input type="file" accept="video/*" className="hidden" onChange={handleFileChange} />
                                    </label>
                                )}
                            </div>
                            
                            {/* 2. Metadata Display (Auto-calculated) */}
                            <div className="flex gap-4 text-xs font-mono opacity-40">
                                <span>DURATION: {lesson.duration ? `${Math.round(lesson.duration)}s` : '--'}</span>
                                <span>STATUS: {lesson.videoUrl ? 'READY' : 'WAITING_FOR_ASSET'}</span>
                            </div>

                            <div className="p-6 bg-white/2 border border-white/5 rounded-2xl space-y-4">
                                <h3 className="text-xs font-black uppercase tracking-widest opacity-50">Transcript / Description</h3>
                                <textarea 
                                    className="textarea w-full h-32 bg-transparent border-none focus:ring-0 p-0 text-sm leading-relaxed resize-none" 
                                    placeholder="Start typing the lesson overview..."
                                    value={lesson.description || ""}
                                    onChange={(e) => onUpdateLesson(moduleId, lesson.id, { description: e.target.value })}
                                />
                            </div>
                        </div>
                    )}

                    {/* --- ARTICLE EDITOR --- */}
                    {lesson.type === 'article' && (
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-xs font-bold uppercase opacity-50">
                                <AlignLeft size={14} /> Content Editor
                            </div>
                            <textarea 
                                className="w-full h-96 bg-white/5 rounded-xl p-6 focus:outline-none font-mono text-sm leading-relaxed"
                                placeholder="# Write your article content here (Markdown/HTML)..."
                                value={lesson.content || ""}
                                onChange={(e) => onUpdateLesson(moduleId, lesson.id, { content: e.target.value })}
                            />
                        </div>
                    )}

                    {/* --- QUIZ EDITOR --- */}
                    {lesson.type === 'quiz' && (
                        <div className="space-y-6">
                            {/* Time Limit */}
                            <div className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/5">
                                <Clock size={16} className="text-primary" />
                                <span className="text-xs font-bold uppercase">Time Limit (Min)</span>
                                <input 
                                    type="number" 
                                    className="input input-sm bg-black/40 w-20 text-center"
                                    value={lesson.quizConfig?.timeLimit || 10}
                                    onChange={(e) => onUpdateLesson(moduleId, lesson.id, { 
                                        quizConfig: { ...lesson.quizConfig!, timeLimit: parseInt(e.target.value) } 
                                    })}
                                />
                            </div>

                            {/* Question List */}
                            <div className="space-y-4">
                                {lesson.quizConfig?.questions?.map((q, qIdx) => (
                                    <div key={q.id} className="bg-white/5 p-6 rounded-xl border border-white/5 space-y-4 relative group">
                                        <input 
                                            className="w-full bg-transparent font-bold text-sm focus:outline-none border-b border-transparent focus:border-white/10 pb-2"
                                            value={q.text}
                                            onChange={(e) => {
                                                const newQuestions = [...(lesson.quizConfig?.questions || [])];
                                                newQuestions[qIdx].text = e.target.value;
                                                onUpdateLesson(moduleId, lesson.id, { quizConfig: { ...lesson.quizConfig!, questions: newQuestions }});
                                            }}
                                        />
                                        
                                        {/* Options */}
                                        <div className="space-y-2 pl-4 border-l-2 border-white/5">
                                            {q.options.map((opt, oIdx) => (
                                                <div key={oIdx} className="flex items-center gap-3">
                                                    <button 
                                                        onClick={() => {
                                                            const newQuestions = [...(lesson.quizConfig?.questions || [])];
                                                            newQuestions[qIdx].options.forEach((o, i) => o.isCorrect = i === oIdx); // Mutually exclusive
                                                            onUpdateLesson(moduleId, lesson.id, { quizConfig: { ...lesson.quizConfig!, questions: newQuestions }});
                                                        }}
                                                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${opt.isCorrect ? 'border-success bg-success/20' : 'border-white/20'}`}
                                                    >
                                                        {opt.isCorrect && <div className="w-2 h-2 rounded-full bg-success" />}
                                                    </button>
                                                    <input 
                                                        className="flex-1 bg-transparent text-xs focus:outline-none opacity-80"
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
                                className="btn btn-outline btn-sm w-full border-dashed text-xs uppercase"
                            >
                                + Add Question
                            </button>
                        </div>
                    )}

                    {/* 3. Resources / Documents Section */}
                    {(lesson.type === "video" || lesson.type ==="article") &&
                    <div className="pt-8 border-t border-white/5">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-sm font-black uppercase tracking-widest opacity-60">Attached Resources</h3>
                            <label className="btn btn-xs btn-outline border-white/10 hover:bg-white hover:text-black">
                                + Add PDF/Zip
                                <input type="file" className="hidden" onChange={handleResourceChange} />
                            </label>
                        </div>

                        <div className="space-y-2">
                            {lesson.resources.length === 0 && (
                                <p className="text-xs italic opacity-20">No documents attached.</p>
                            )}
                            {lesson.resources.map((res) => (
                                <div key={res.id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-white/10 rounded-lg">
                                            <FileText size={16} />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold">{res.title}</p>
                                            <p className="text-[10px] opacity-40 uppercase">{res.size}</p>
                                        </div>
                                    </div>
                                    <button className="btn btn-ghost btn-circle btn-xs text-white/20 hover:text-error" onClick={()=>{onDeleteResource(moduleId, lesson.id, res.id)}}>
                                        <X size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                    }
                </div>
            </div>
        </div>
    );
}