import { useState, useEffect, type RefObject } from "react";
import { Clock, Play, Save, Code, Trash2, MessageSquare, Lock } from "lucide-react";
import { useLessonNotes, useCreateNote, useDeleteNote } from "~/hooks/useLessonNotes";

interface NotesTabProps {
    lessonId: string;
    isEnrolled: boolean;
    videoRef: RefObject<HTMLVideoElement | null> | null;
    onJumpToTime: (seconds: number) => void;
    hasVideo: boolean;
}

export const NotesTab = ({ lessonId, isEnrolled, videoRef, onJumpToTime, hasVideo }: NotesTabProps) => {
    const [noteText, setNoteText] = useState("");
    const [isCodeMode, setIsCodeMode] = useState(false);
    const [liveTime, setLiveTime] = useState(0);

    // Fetch notes from the backend for the current lesson
    const { data: savedNotes = [], isLoading: isNotesLoading, isError, refetch } = useLessonNotes(lessonId);
    const createNote = useCreateNote(lessonId);
    const deleteNote = useDeleteNote(lessonId);

    // Reset form when lesson changes
    useEffect(() => {
        setNoteText("");
        setIsCodeMode(false);
    }, [lessonId]);

    // Live time tracker for the note input
    useEffect(() => {
        if (!videoRef) return;

        const updateTime = () => {
            if (videoRef?.current) {
                setLiveTime(videoRef.current.currentTime);
            }
        };

        const interval = setInterval(updateTime, 500);
        return () => clearInterval(interval);
    }, [videoRef]);

    const formatTime = (seconds: number) => {
        if (isNaN(seconds)) return "0:00";
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleSaveNote = () => {
        if (!noteText.trim()) return;
        createNote.mutate(
            { content: noteText, timestamp: liveTime, is_code: isCodeMode },
            {
                onSuccess: () => {
                    setNoteText("");
                    setIsCodeMode(false);
                }
            }
        );
    };

    const handleDeleteNote = (e: React.MouseEvent, idToRemove: string) => {
        e.stopPropagation();
        deleteNote.mutate(idToRemove);
    };

    return (
        <div id="panel-notes" role="tabpanel" className="p-4 md:p-6 space-y-6 animate-in fade-in duration-300 max-w-4xl mx-auto h-full">
            {!isEnrolled ? (
                <div className="flex flex-col items-center justify-center h-full min-h-[40vh] text-center px-4 opacity-70">
                    <Lock size={48} className="mb-4 text-base-content/20" />
                    <h3 className="text-lg font-bold text-base-content mb-2">Enroll to take notes</h3>
                    <p className="text-sm text-base-content/50 max-w-sm">Save your thoughts and code snippets directly linked to video timestamps.</p>
                </div>
            ) : (
                <>
                    {/* Input Area */}
                    <div className="bg-base-100 p-1.5 rounded-2xl border border-base-content/10 shadow-sm focus-within:border-primary/50 focus-within:shadow-primary/10 focus-within:shadow-lg transition-all">
                        <div className="relative">
                            <textarea
                                value={noteText}
                                onChange={(e) => setNoteText(e.target.value)}
                                onKeyDown={(e) => e.stopPropagation()}
                                className={`w-full bg-transparent p-4 text-sm resize-none h-28 focus:outline-none text-base-content placeholder:text-base-content/30 ${isCodeMode ? 'font-mono text-xs bg-base-300/30 rounded-xl' : ''}`}
                                placeholder={isCodeMode ? "// Paste your snippet here..." : hasVideo ? "Jot down a thought... (pinned to the current video time)" : "Jot down a thought..."}
                                disabled={createNote.isPending}
                            />
                            <div className="absolute top-2 right-2 flex gap-1">
                                <button
                                    onClick={() => setIsCodeMode(!isCodeMode)}
                                    className={`btn btn-xs btn-circle ${isCodeMode ? 'btn-primary' : 'btn-ghost text-base-content/40 hover:text-base-content'}`}
                                    title={isCodeMode ? "Switch to Text" : "Switch to Code"}
                                    disabled={createNote.isPending}
                                >
                                    <Code size={14} />
                                </button>
                            </div>
                        </div>

                        <div className="flex justify-between items-center px-4 pb-2 pt-2 border-t border-base-content/5 mt-1">
                            {hasVideo ? (
                                <div className="flex items-center gap-2 text-xs font-mono text-primary bg-primary/10 px-2 py-1 rounded-md">
                                    <Clock size={12} /> {formatTime(liveTime)}
                                </div>
                            ) : (
                                <div className="text-xs text-base-content/30 font-mono">
                                    No timestamp
                                </div>
                            )}
                            <button
                                onClick={handleSaveNote}
                                disabled={!noteText.trim() || createNote.isPending}
                                className="btn btn-sm btn-primary rounded-xl px-6"
                            >
                                {createNote.isPending ? (
                                    <span className="loading loading-spinner loading-xs" />
                                ) : (
                                    <Save size={14} />
                                )}
                                {createNote.isPending ? "Saving..." : "Save Note"}
                            </button>
                        </div>
                    </div>

                    {/* Saved Notes List */}
                    <div className="space-y-3 pb-8">
                        {isNotesLoading ? (
                            <div className="flex justify-center p-8">
                                <span className="loading loading-spinner text-primary" />
                            </div>
                        ) : isError ? (
                            <div className="text-center py-12 flex flex-col items-center">
                                <p className="text-sm font-bold uppercase tracking-widest text-error mb-4">Failed to load notes</p>
                                <button className="btn btn-sm btn-outline btn-error" onClick={() => refetch()}>
                                    Retry Loading
                                </button>
                            </div>
                        ) : savedNotes.length === 0 ? (
                            <div className="text-center py-12 opacity-40 flex flex-col items-center">
                                <MessageSquare size={32} className="mb-3 text-base-content/30" />
                                <p className="text-xs font-bold uppercase tracking-widest">No notes taken yet</p>
                                <p className="text-[10px] mt-2 max-w-xs">Notes are private and pinned to specific timestamps for easy reviewing.</p>
                            </div>
                        ) : (
                            savedNotes.map((note) => (
                                <div
                                    key={note.id}
                                    onClick={() => hasVideo && note.timestamp != null && onJumpToTime(note.timestamp)}
                                    className={`p-4 bg-base-100 border border-base-content/10 rounded-2xl hover:border-primary/40 hover:shadow-md group transition-all relative overflow-hidden ${hasVideo ? 'cursor-pointer' : ''}`}
                                >
                                    {/* Accent line */}
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary/20 group-hover:bg-primary transition-colors" />

                                    <div className="flex items-center justify-between mb-3 pl-2">
                                        <div className="flex items-center gap-3">
                                            {hasVideo && note.timestamp != null && (
                                                <button className="text-[11px] font-bold bg-primary/15 text-primary hover:bg-primary hover:text-primary-content transition-colors px-2.5 py-1 rounded-lg flex items-center gap-1.5 shadow-sm">
                                                    <Play size={10} fill="currentColor" /> {formatTime(note.timestamp)}
                                                </button>
                                            )}
                                            {note.is_code && <span className="text-[9px] uppercase tracking-wider opacity-60 font-bold border border-base-content/20 px-2 py-0.5 rounded-md">Snippet</span>}
                                        </div>

                                        <button
                                            onClick={(e) => handleDeleteNote(e, note.id)}
                                            className="text-base-content/20 hover:text-error hover:bg-error/10 p-1.5 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                            title="Delete Note"
                                            disabled={deleteNote.isPending}
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>

                                    <div className={`text-sm text-base-content/80 pl-2 ${note.is_code ? 'font-mono text-xs bg-base-200 p-4 rounded-xl overflow-x-auto border border-base-content/5 mt-2 whitespace-pre-wrap' : 'leading-relaxed'}`}>
                                        {note.content}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </>
            )}
        </div>
    );
};
