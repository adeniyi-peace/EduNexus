import { useState, type RefObject } from "react";
import { ChatWindow } from "~/components/chat/ChatWindow";
import { Clock, Play, Save, Code, Download, FileText, Maximize2, Minimize2 } from "lucide-react";

interface TabSystemProps {
    currentLesson: any;
    videoRef: RefObject<HTMLVideoElement | null>;
    onJumpToTime: (seconds: number) => void;
    isExpanded: boolean;           // New prop
    onToggleExpand: () => void;    // New prop
}

export const TabSystem = ({ currentLesson, videoRef, onJumpToTime,isExpanded, onToggleExpand }: TabSystemProps) => {
    const [activeTab, setActiveTab] = useState("resources");
    const [noteText, setNoteText] = useState("");
    const [isCodeMode, setIsCodeMode] = useState(false);
    const [savedNotes, setSavedNotes] = useState<{time: number, text: string, isCode: boolean}[]>([]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleSaveNote = () => {
        if (!noteText.trim()) return;
        const currentTime = videoRef.current?.currentTime || 0;
        setSavedNotes([{ time: currentTime, text: noteText, isCode: isCodeMode }, ...savedNotes]);
        setNoteText("");
        setIsCodeMode(false);
    };

    return (
        <div className="flex flex-col h-full bg-base-100">
            {/* Tab Headers */}
            <div className="flex items-center justify-between border-b border-base-content/5 px-4 md:px-6 bg-base-100/80 backdrop-blur-md sticky top-0 z-20">
                <div className="flex">
                    {["resources", "q&a", "notes"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 md:px-6 py-4 text-[10px] font-black uppercase tracking-widest transition-all relative whitespace-nowrap
                            ${activeTab === tab ? "text-primary" : "text-base-content/40 hover:text-base-content"}`}
                        >
                            {tab === "q&a" ? "Discussion" : tab}
                            {activeTab === tab && (
                                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary" />
                            )}
                        </button>
                    ))}
                </div>

                {/* Expand/Collapse Button */}
                <button 
                    onClick={onToggleExpand}
                    className="btn btn-ghost btn-xs gap-2 text-base-content/50 hover:text-primary"
                    title={isExpanded ? "Show Video" : "Focus Mode"}
                >
                    {isExpanded ? (
                        <> <Minimize2 size={14} /> <span className="hidden sm:inline">Exit Focus</span> </>
                    ) : (
                        <> <Maximize2 size={14} /> <span className="hidden sm:inline">Focus Mode</span> </>
                    )}
                </button>
            </div>

            {/* Tab Panels - Scrollable Content */}
            <div className="flex-1 overflow-y-auto relative custom-scrollbar">
                
                {/* 1. RESOURCES TAB */}
                {activeTab === "resources" && (
                    <div className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in duration-300">
                        {/* Mock Resource Card */}
                        <div className="p-4 bg-base-200/50 rounded-xl border border-base-content/5 flex items-center justify-between group hover:border-primary/20 transition-all cursor-pointer">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                    <FileText size={20} />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-sm font-bold truncate">Project_Starter_Files.zip</p>
                                    <p className="text-[10px] opacity-50 uppercase font-black">12 MB • Zip Archive</p>
                                </div>
                            </div>
                            <button className="btn btn-ghost btn-sm btn-square text-base-content/40 group-hover:text-primary">
                                <Download size={16} />
                            </button>
                        </div>
                    </div>
                )}

                {/* 2. CHAT TAB */}
                {activeTab === "q&a" && (
                    <div className="h-full flex flex-col min-h-75">
                        <ChatWindow 
                            roomName={`lesson-${currentLesson.id}`} 
                            title={`Discussion: ${currentLesson.title}`} 
                        />
                    </div>
                )}

                {/* 3. NOTES TAB */}
                {activeTab === "notes" && (
                    <div className="p-4 md:p-6 space-y-4 animate-in fade-in duration-300">
                        {/* Input Area */}
                        <div className="bg-base-200/50 p-1 rounded-2xl border border-base-content/5 focus-within:border-primary/30 transition-colors">
                            <div className="relative">
                                <textarea 
                                    value={noteText}
                                    onChange={(e) => setNoteText(e.target.value)}
                                    className={`w-full bg-transparent p-3 text-sm resize-none h-24 focus:outline-hidden ${isCodeMode ? 'font-mono text-xs' : ''}`}
                                    placeholder={isCodeMode ? "// Paste your snippet here..." : "Jot down a thought..."}
                                />
                                <div className="absolute bottom-2 right-2 flex gap-1">
                                    <button 
                                        onClick={() => setIsCodeMode(!isCodeMode)}
                                        className={`btn btn-xs ${isCodeMode ? 'btn-primary' : 'btn-ghost'}`}
                                        title="Toggle Code Mode"
                                    >
                                        <Code size={12} />
                                    </button>
                                </div>
                            </div>
                            <div className="flex justify-between items-center px-3 pb-2 pt-1 border-t border-base-content/5">
                                <span className="text-[10px] font-mono opacity-50 flex items-center gap-1">
                                    <Clock size={10} /> {formatTime(videoRef.current?.currentTime || 0)}
                                </span>
                                <button onClick={handleSaveNote} className="btn btn-xs btn-primary rounded-lg">
                                    <Save size={12} /> Save Note
                                </button>
                            </div>
                        </div>

                        {/* Saved Notes List */}
                        <div className="space-y-3">
                            {savedNotes.length === 0 && (
                                <div className="text-center py-10 opacity-30">
                                    <p className="text-xs font-bold uppercase tracking-widest">No notes taken yet</p>
                                </div>
                            )}
                            {savedNotes.map((note, idx) => (
                                <div 
                                    key={idx}
                                    onClick={() => onJumpToTime(note.time)}
                                    className="p-3 bg-base-100 border border-base-content/10 rounded-xl hover:border-primary/40 cursor-pointer group transition-all"
                                >
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-[9px] font-black bg-primary/10 text-primary px-1.5 py-0.5 rounded-md flex items-center gap-1">
                                            <Play size={8} fill="currentColor" /> {formatTime(note.time)}
                                        </span>
                                        {note.isCode && <span className="text-[8px] uppercase tracking-wider opacity-50 font-bold border border-base-content/20 px-1 rounded-sm">Snippet</span>}
                                    </div>
                                    <div className={`text-sm opacity-80 ${note.isCode ? 'font-mono text-xs bg-base-300 p-2 rounded-lg overflow-x-auto' : ''}`}>
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