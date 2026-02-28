import { useState, useEffect, type RefObject } from "react";
import { ChatWindow } from "~/components/chat/ChatWindow";
import { 
    Clock, Play, Save, Code, Download, FileText, 
    Maximize2, Minimize2, Trash2, MessageSquare 
} from "lucide-react";

interface TabSystemProps {
    currentLesson: any;
    videoRef: RefObject<HTMLVideoElement | null>;
    onJumpToTime: (seconds: number) => void;
    isExpanded: boolean;
    onToggleExpand: () => void;
}

export const TabSystem = ({ currentLesson, videoRef, onJumpToTime, isExpanded, onToggleExpand }: TabSystemProps) => {
    const [activeTab, setActiveTab] = useState("resources");
    const [noteText, setNoteText] = useState("");
    const [isCodeMode, setIsCodeMode] = useState(false);
    const [savedNotes, setSavedNotes] = useState<{id: string, time: number, text: string, isCode: boolean}[]>([]);
    const [liveTime, setLiveTime] = useState(0);

    // UX Improvement: Live time tracker for the note input
    useEffect(() => {
        if (activeTab !== "notes") return;
        
        const updateTime = () => {
            if (videoRef.current) {
                setLiveTime(videoRef.current.currentTime);
            }
        };

        // Update time frequently when notes tab is active
        const interval = setInterval(updateTime, 500);
        return () => clearInterval(interval);
    }, [activeTab, videoRef]);

    const formatTime = (seconds: number) => {
        if (isNaN(seconds)) return "0:00";
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleSaveNote = () => {
        if (!noteText.trim()) return;
        const newNote = {
            id: crypto.randomUUID(), // Better than using array index for keys
            time: liveTime,
            text: noteText,
            isCode: isCodeMode
        };
        setSavedNotes([newNote, ...savedNotes]);
        setNoteText("");
        setIsCodeMode(false);
    };

    const handleDeleteNote = (e: React.MouseEvent, idToRemove: string) => {
        e.stopPropagation(); // Prevent jumping to time when clicking delete
        setSavedNotes(prev => prev.filter(note => note.id !== idToRemove));
    };

    const tabs = [
        { id: "resources", label: "Resources" },
        { id: "q&a", label: "Discussion" },
        { id: "notes", label: "Notes" }
    ];

    return (
        <div className="flex flex-col h-full bg-base-100">
            {/* Tab Headers */}
            <div className="flex items-center justify-between border-b border-base-content/10 px-2 md:px-6 bg-base-100/95 backdrop-blur-md sticky top-0 z-20">
                <div className="flex" role="tablist" aria-label="Lesson Content Tabs">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            role="tab"
                            aria-selected={activeTab === tab.id}
                            aria-controls={`panel-${tab.id}`}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-4 md:px-6 py-4 text-xs font-bold uppercase tracking-wider transition-all relative whitespace-nowrap
                            ${activeTab === tab.id ? "text-primary" : "text-base-content/50 hover:text-base-content/80 hover:bg-base-content/5"}`}
                        >
                            {tab.label}
                            {activeTab === tab.id && (
                                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary shadow-[0_-2px_10px_rgba(var(--p),0.5)] animate-in slide-in-from-bottom-1 duration-200" />
                            )}
                        </button>
                    ))}
                </div>

                {/* Expand/Collapse Button */}
                <button 
                    onClick={onToggleExpand}
                    className="btn btn-ghost btn-sm gap-2 text-base-content/60 hover:text-primary hover:bg-primary/10 transition-colors"
                    aria-label={isExpanded ? "Exit focus mode" : "Enter focus mode"}
                    title={isExpanded ? "Show Video" : "Focus Mode"}
                >
                    {isExpanded ? (
                        <> <Minimize2 size={16} /> <span className="hidden sm:inline text-xs font-bold">Exit Focus</span> </>
                    ) : (
                        <> <Maximize2 size={16} /> <span className="hidden sm:inline text-xs font-bold">Focus Mode</span> </>
                    )}
                </button>
            </div>

            {/* Tab Panels */}
            <div className="flex-1 overflow-y-auto relative custom-scrollbar bg-base-200/20">
                
                {/* 1. RESOURCES TAB */}
                {activeTab === "resources" && (
                    <div id="panel-resources" role="tabpanel" className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        {currentLesson.resources?.length ? (
                            // Assuming you'll map over actual resources eventually
                            <div className="p-4 bg-base-100 rounded-xl border border-base-content/10 shadow-sm flex items-center justify-between group hover:border-primary/40 hover:shadow-md transition-all cursor-pointer">
                                <div className="flex items-center gap-4 min-w-0">
                                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
                                        <FileText size={22} />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-bold text-base-content truncate group-hover:text-primary transition-colors">Project_Starter_Files.zip</p>
                                        <p className="text-[10px] opacity-60 uppercase font-bold tracking-wider mt-0.5">12 MB • Zip Archive</p>
                                    </div>
                                </div>
                                <button className="btn btn-ghost btn-circle btn-sm text-base-content/50 group-hover:text-primary group-hover:bg-primary/10">
                                    <Download size={18} />
                                </button>
                            </div>
                        ) : (
                            <div className="col-span-full py-16 flex flex-col items-center justify-center text-center opacity-50">
                                <FileText size={48} className="mb-4 text-base-content/20" />
                                <p className="text-sm font-bold uppercase tracking-widest">No resources for this lesson</p>
                            </div>
                        )}
                    </div>
                )}

                {/* 2. DISCUSSION TAB */}
                {activeTab === "q&a" && (
                    <div id="panel-q&a" role="tabpanel" className="h-full flex flex-col min-h-100 animate-in fade-in duration-300">
                        <ChatWindow 
                            roomName={`lesson-${currentLesson.id}`} 
                            title={`Discussion: ${currentLesson.title}`} 
                        />
                    </div>
                )}

                {/* 3. NOTES TAB */}
                {activeTab === "notes" && (
                    <div id="panel-notes" role="tabpanel" className="p-4 md:p-6 space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300 max-w-4xl mx-auto">
                        
                        {/* Input Area */}
                        <div className="bg-base-100 p-1.5 rounded-2xl border border-base-content/10 shadow-sm focus-within:border-primary/50 focus-within:shadow-primary/10 focus-within:shadow-lg transition-all">
                            <div className="relative">
                                <textarea 
                                    value={noteText}
                                    onChange={(e) => setNoteText(e.target.value)}
                                    className={`w-full bg-transparent p-4 text-sm resize-none h-28 focus:outline-none text-base-content placeholder:text-base-content/30 ${isCodeMode ? 'font-mono text-xs bg-base-300/30 rounded-xl' : ''}`}
                                    placeholder={isCodeMode ? "// Paste your snippet here..." : "Jot down a thought... (It will be pinned to the current video time)"}
                                />
                                <div className="absolute top-2 right-2 flex gap-1">
                                    <button 
                                        onClick={() => setIsCodeMode(!isCodeMode)}
                                        className={`btn btn-xs btn-circle ${isCodeMode ? 'btn-primary' : 'btn-ghost text-base-content/40 hover:text-base-content'}`}
                                        title={isCodeMode ? "Switch to Text" : "Switch to Code"}
                                    >
                                        <Code size={14} />
                                    </button>
                                </div>
                            </div>
                            
                            <div className="flex justify-between items-center px-4 pb-2 pt-2 border-t border-base-content/5 mt-1">
                                <div className="flex items-center gap-2 text-xs font-mono text-primary bg-primary/10 px-2 py-1 rounded-md">
                                    <Clock size={12} /> {formatTime(liveTime)}
                                </div>
                                <button 
                                    onClick={handleSaveNote} 
                                    disabled={!noteText.trim()}
                                    className="btn btn-sm btn-primary rounded-xl px-6"
                                >
                                    <Save size={14} /> Save Note
                                </button>
                            </div>
                        </div>

                        {/* Saved Notes List */}
                        <div className="space-y-3 pb-8">
                            {savedNotes.length === 0 && (
                                <div className="text-center py-12 opacity-40 flex flex-col items-center">
                                    <MessageSquare size={32} className="mb-3 text-base-content/30" />
                                    <p className="text-xs font-bold uppercase tracking-widest">No notes taken yet</p>
                                    <p className="text-[10px] mt-2 max-w-xs">Notes are private and pinned to specific timestamps for easy reviewing.</p>
                                </div>
                            )}
                            
                            {savedNotes.map((note) => (
                                <div 
                                    key={note.id}
                                    onClick={() => onJumpToTime(note.time)}
                                    className="p-4 bg-base-100 border border-base-content/10 rounded-2xl hover:border-primary/40 hover:shadow-md cursor-pointer group transition-all relative overflow-hidden"
                                >
                                    {/* Accent line */}
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary/20 group-hover:bg-primary transition-colors" />
                                    
                                    <div className="flex items-center justify-between mb-3 pl-2">
                                        <div className="flex items-center gap-3">
                                            <button className="text-[11px] font-bold bg-primary/15 text-primary hover:bg-primary hover:text-primary-content transition-colors px-2.5 py-1 rounded-lg flex items-center gap-1.5 shadow-sm">
                                                <Play size={10} fill="currentColor" /> {formatTime(note.time)}
                                            </button>
                                            {note.isCode && <span className="text-[9px] uppercase tracking-wider opacity-60 font-bold border border-base-content/20 px-2 py-0.5 rounded-md">Snippet</span>}
                                        </div>
                                        
                                        <button 
                                            onClick={(e) => handleDeleteNote(e, note.id)}
                                            className="text-base-content/20 hover:text-error hover:bg-error/10 p-1.5 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                            title="Delete Note"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                    
                                    <div className={`text-sm text-base-content/80 pl-2 ${note.isCode ? 'font-mono text-xs bg-base-200 p-4 rounded-xl overflow-x-auto border border-base-content/5 mt-2 whitespace-pre-wrap' : 'leading-relaxed'}`}>
                                        {note.text}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};