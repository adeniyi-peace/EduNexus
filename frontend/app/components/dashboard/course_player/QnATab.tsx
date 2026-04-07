import { useState } from "react";
import { MessageCircle, CheckCircle, Reply, ChevronDown, User, Send, PlusCircle, ArrowLeft } from "lucide-react";
import { useLessonQuestions, useCreateQuestion, useCreateAnswer, type QnAQuestion } from "~/hooks/useLessonQnA";

interface QnATabProps {
    lessonId: string;
    isEnrolled: boolean;
    courseInstructorId?: number; // to identify if current user is instructor (optional if using UserContext)
}

export const QnATab = ({ lessonId, isEnrolled }: QnATabProps) => {
    const { data: questions = [], isLoading, isError, refetch } = useLessonQuestions(lessonId);
    const createQuestion = useCreateQuestion(lessonId);
    
    const [viewMode, setViewMode] = useState<"list" | "create" | "thread">("list");
    const [activeQuestion, setActiveQuestion] = useState<QnAQuestion | null>(null);
    
    const [newTitle, setNewTitle] = useState("");
    const [newContent, setNewContent] = useState("");

    const handleCreateSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTitle.trim() || !newContent.trim()) return;
        createQuestion.mutate({ title: newTitle, content: newContent }, {
            onSuccess: () => {
                setNewTitle("");
                setNewContent("");
                setViewMode("list");
            }
        });
    };

    const openThread = (question: QnAQuestion) => {
        setActiveQuestion(question);
        setViewMode("thread");
    };

    return (
        <div className="flex flex-col h-full bg-base-100 p-4 md:p-6 animate-in fade-in duration-300">
            {/* Header Area */}
            <div className="flex justify-between items-center mb-6 border-b border-base-content/10 pb-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                        <MessageCircle size={20} />
                    </div>
                    <div>
                        <h2 className="text-lg font-extrabold text-base-content tracking-tight">Q&A Dashboard</h2>
                        <p className="text-xs text-base-content/60 font-medium mt-0.5">Community Discussion & Instructor Support</p>
                    </div>
                </div>
                {viewMode === "list" && (
                    <button 
                        onClick={() => setViewMode("create")}
                        className="btn btn-sm btn-primary rounded-xl px-4 gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all"
                    >
                        <PlusCircle size={14} /> Ask Question
                    </button>
                )}
                {viewMode !== "list" && (
                    <button 
                        onClick={() => setViewMode("list")}
                        className="btn btn-sm btn-ghost rounded-xl px-4 gap-2 text-base-content/60 hover:text-base-content"
                    >
                        <ArrowLeft size={14} /> Back to Q&A
                    </button>
                )}
            </div>

            {/* List View */}
            {viewMode === "list" && (
                <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 pb-12">
                    {isLoading ? (
                        <div className="flex justify-center p-8">
                            <span className="loading loading-spinner text-primary loading-lg" />
                        </div>
                    ) : isError ? (
                        <div className="flex flex-col items-center justify-center h-48 text-center">
                            <p className="text-sm font-bold uppercase tracking-widest text-error mb-4">Failed to load Q&A</p>
                            <button className="btn btn-sm btn-outline btn-error" onClick={() => refetch()}>
                                Retry Loading
                            </button>
                        </div>
                    ) : questions.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-48 text-center opacity-60">
                            <MessageCircle size={48} className="mb-4 text-base-content/20" />
                            <p className="text-sm font-bold uppercase tracking-widest">No questions yet</p>
                            <p className="text-[11px] mt-2 max-w-xs leading-relaxed">Be the first to ask a question! Our instructors and community are here to help.</p>
                        </div>
                    ) : (
                        questions.map((q) => (
                            <div 
                                key={q.id} 
                                onClick={() => openThread(q)}
                                className="group bg-base-100 p-5 rounded-2xl border border-base-content/10 shadow-sm hover:shadow-md hover:border-primary/40 transition-all cursor-pointer relative overflow-hidden flex gap-4"
                            >
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary/10 to-primary/30 group-hover:from-primary/40 group-hover:to-primary transition-colors" />
                                
                                <div className="avatar self-start">
                                    <div className="w-10 rounded-full ring ring-base-100 ring-offset-2 ring-offset-base-200 bg-base-200">
                                        {q.student.profile_picture ? (
                                            <img src={q.student.profile_picture} alt={q.student.fullname} />
                                        ) : (
                                            <div className="w-full h-full flex flex-col items-center justify-center text-xs font-bold text-base-content/50">
                                                {q.student.fullname.charAt(0)}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start mb-1">
                                        <h3 className="text-sm font-bold text-base-content truncate pr-4 group-hover:text-primary transition-colors">{q.title}</h3>
                                    </div>
                                    <p className="text-xs text-base-content/60 line-clamp-2 mb-3 leading-relaxed">
                                        {q.content}
                                    </p>
                                    <div className="flex items-center gap-4 text-[11px] font-semibold text-base-content/40">
                                        <span className="flex items-center gap-1.5 text-primary/80 bg-primary/10 px-2 py-0.5 rounded-md">
                                            <Reply size={12} /> {q.answers_count} replies
                                        </span>
                                        <span>By {q.student.fullname}</span>
                                        <span>• {new Date(q.created_at).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* Create View */}
            {viewMode === "create" && (
                <div className="flex-1 max-w-2xl mx-auto w-full animate-in slide-in-from-right-4 duration-300">
                    <form onSubmit={handleCreateSubmit} className="bg-base-200/30 p-6 rounded-3xl border border-base-content/5 shadow-xl space-y-5">
                        <div>
                            <label className="text-xs font-bold uppercase tracking-wider text-base-content/60 mb-2 block">Question Title</label>
                            <input 
                                type="text" 
                                className="w-full bg-base-100 border border-base-content/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-base-content/30"
                                placeholder="e.g. How does the middleware function work?"
                                value={newTitle}
                                onChange={(e) => setNewTitle(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold uppercase tracking-wider text-base-content/60 mb-2 block">Details</label>
                            <textarea 
                                className="w-full bg-base-100 border border-base-content/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all min-h-[160px] resize-none placeholder:text-base-content/30 leading-relaxed"
                                placeholder="Provide more context or code snippets..."
                                value={newContent}
                                onChange={(e) => setNewContent(e.target.value)}
                                required
                            />
                        </div>
                        <div className="flex justify-end pt-2">
                            <button 
                                type="submit" 
                                disabled={createQuestion.isPending || !newTitle.trim() || !newContent.trim()}
                                className="btn btn-primary rounded-xl px-8 shadow-lg shadow-primary/20 hover:shadow-primary/40"
                            >
                                {createQuestion.isPending ? <span className="loading loading-spinner text-white" /> : <Send size={16} />}
                                Post Question
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Thread View */}
            {viewMode === "thread" && activeQuestion && (
                <ThreadView question={activeQuestion} lessonId={lessonId} />
            )}
        </div>
    );
};

const ThreadView = ({ question, lessonId }: { question: QnAQuestion, lessonId: string }) => {
    const { data: freshQuestions = [] } = useLessonQuestions(lessonId);
    
    // Auto-update active question if data refreshes
    const currentQ = freshQuestions.find(q => q.id === question.id) || question;
    const createAnswer = useCreateAnswer(currentQ.id, lessonId);
    const [replyText, setReplyText] = useState("");

    const handleReplySubmit = () => {
        if (!replyText.trim()) return;
        createAnswer.mutate(replyText, {
            onSuccess: () => setReplyText("")
        });
    };

    return (
        <div className="flex-1 flex flex-col h-full overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Original Question Card */}
            <div className="bg-gradient-to-br from-base-200/50 to-base-100 p-5 md:p-6 rounded-3xl border border-base-content/10 shadow-sm shrink-0 mb-6 group">
                <div className="flex gap-4">
                    <div className="avatar self-start">
                         <div className="w-12 h-12 rounded-full ring-2 ring-primary/20 bg-base-200">
                            {currentQ.student.profile_picture ? (
                                <img src={currentQ.student.profile_picture} alt={currentQ.student.fullname} />
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center text-sm font-bold text-base-content/50">
                                    {currentQ.student.fullname.charAt(0)}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-extrabold text-base-content">{currentQ.student.fullname}</span>
                            <span className="text-[11px] font-medium text-base-content/40 bg-base-200 px-2 py-1 rounded-full">{new Date(currentQ.created_at).toLocaleString()}</span>
                        </div>
                        <h3 className="text-base font-bold text-base-content mt-2 mb-1.5">{currentQ.title}</h3>
                        <p className="text-sm text-base-content/80 leading-relaxed max-w-none whitespace-pre-wrap">
                            {currentQ.content}
                        </p>
                    </div>
                </div>
            </div>

            {/* Answers List */}
            <div className="flex-1 overflow-y-auto px-1 space-y-4 custom-scrollbar pb-4 relative">
                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-transparent via-base-content/5 to-transparent z-0" />
                
                {currentQ.answers.length === 0 ? (
                    <div className="py-8 text-center text-sm font-medium text-base-content/40 relative z-10 w-full pl-12 italic">
                        No answers yet. Share your thoughts!
                    </div>
                ) : (
                    currentQ.answers.map((answer) => (
                        <div key={answer.id} className="flex gap-4 relative z-10 animate-in slide-in-from-bottom-2 duration-300">
                             {/* Connector dot */}
                             <div className="absolute left-[20px] top-4 w-3 h-3 rounded-full border-2 border-base-100 bg-base-content/20 shrink-0" />
                             
                             <div className="avatar self-start z-10 shrink-0 shadow-sm ml-px pt-1">
                                <div className="w-10 h-10 rounded-full border border-base-content/10 bg-base-200">
                                    {answer.user.profile_picture ? (
                                        <img src={answer.user.profile_picture} alt={answer.user.fullname} />
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center text-xs font-bold text-base-content/50">
                                            {answer.user.fullname.charAt(0)}
                                        </div>
                                    )}
                                </div>
                            </div>
                            
                            <div className={`flex-1 p-4 rounded-2xl md:rounded-3xl shadow-sm text-sm border 
                                ${answer.is_instructor_reply 
                                    ? 'bg-primary/5 border-primary/20 hover:border-primary/40' 
                                    : 'bg-base-100 border-base-content/10 hover:border-base-content/20'} 
                                transition-colors relative`}
                            >
                                <div className="flex flex-wrap items-center justify-between mb-2 gap-2">
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-base-content">{answer.user.fullname}</span>
                                        {answer.is_instructor_reply && (
                                            <span className="flex items-center gap-1 bg-primary text-primary-content text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider shadow-sm">
                                                <CheckCircle size={10} /> Instructor
                                            </span>
                                        )}
                                    </div>
                                    <span className="text-[10px] uppercase font-bold tracking-widest text-base-content/40">
                                        {new Date(answer.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                                <p className="text-base-content/80 leading-relaxed whitespace-pre-wrap">{answer.content}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Reply Input Area */}
            <div className="mt-4 bg-base-100 p-2 pl-4 pr-2 rounded-2xl border border-base-content/15 shadow-lg flex items-end gap-3 shrink-0 ring-1 ring-base-100/50 backdrop-blur-xl">
                <textarea 
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className="flex-1 bg-transparent py-3 text-sm focus:outline-none resize-none max-h-32 min-h-[48px] custom-scrollbar placeholder:text-base-content/30"
                    placeholder="Write a reply..."
                    disabled={createAnswer.isPending}
                />
                <button 
                    onClick={handleReplySubmit}
                    disabled={!replyText.trim() || createAnswer.isPending}
                    className="btn btn-primary btn-circle mb-1 shadow-md shadow-primary/20 shrink-0"
                >
                    {createAnswer.isPending ? <span className="loading loading-spinner text-white" /> : <Send size={18} className="ml-1" />}
                </button>
            </div>
        </div>
    );
};
