import { useState, type RefObject } from "react";
import { ChatWindow } from "~/components/chat/ChatWindow"; // Adjust path as needed
import { Clock, Play, Save, Code, MessageSquareText } from "lucide-react";

interface TabSystemProps {
    currentLesson: any;
    videoRef: RefObject<HTMLVideoElement | null>;
    onJumpToTime: (seconds: number) => void;
}


export const TabSystem = ({ currentLesson, videoRef, onJumpToTime }: TabSystemProps) => {
    const [activeTab, setActiveTab] = useState("resources");

    // this logic allow saved notes to act like video bookmarks
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
        const newNote = {
            time: currentTime,
            text: noteText,
            isCode: isCodeMode
        };

        setSavedNotes([newNote, ...savedNotes]);
        setNoteText("");
        setIsCodeMode(false); // Reset after saving
    };

    return (
        /* Increased height to h-96 or h-[500px] to give the chat enough room to breathe */
        <div className="h-96 bg-base-100 border-t border-base-content/5 flex flex-col transition-all duration-500">
            {/* Tab Headers */}
            <div className="flex border-b border-base-content/5 px-6 bg-base-100/50 backdrop-blur-md sticky top-0 z-10">
                {["resources", "q&a", "notes"].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-6 py-4 text-[10px] font-black uppercase tracking-widest transition-all relative
                        ${activeTab === tab ? "text-primary" : "text-base-content/40 hover:text-base-content"}`}
                    >
                        {tab === "q&a" ? "Live Discussion" : tab}
                        {activeTab === tab && (
                            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary animate-in fade-in zoom-in duration-300" />
                        )}
                    </button>
                ))}
            </div>

            {/* Tab Panels */}
            <div className="flex-1 overflow-hidden flex flex-col">
                {activeTab === "resources" && (
                    <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in duration-500">
                        <div className="p-4 bg-base-200 rounded-2xl flex items-center justify-between group hover:bg-primary/5 transition-colors cursor-pointer border border-transparent hover:border-primary/20">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-base-300 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14.5 2 14.5 8 20 8"/></svg>
                                </div>
                                <div>
                                    <p className="text-sm font-bold">System_Architecture.pdf</p>
                                    <p className="text-[10px] opacity-40 uppercase font-black">2.4 MB • PDF Document</p>
                                </div>
                            </div>
                            <button className="btn btn-ghost btn-sm btn-circle text-primary">↓</button>
                        </div>
                    </div>
                )}

                {/* Live Chat Integration */}
                {activeTab === "q&a" && (
                    <div className="flex-1 flex flex-col min-h-0 animate-in slide-in-from-right-4 duration-500">
                        {/* We use the lesson ID as the room name so chat is lesson-specific. 
                           Change to `course-global` if you want one chat for the whole course.
                        */}
                        <ChatWindow 
                            roomName={`lesson-${currentLesson.id}`} 
                            title={`Discussion: ${currentLesson.title}`} 
                        />
                    </div>
                )}

                {activeTab === "notes" && (
                    <div className="p-6 h-full flex flex-col gap-4 animate-in fade-in duration-500">
                        {/* Note Input Area */}
                        <div className="space-y-3">
                            <div className="relative group">
                                <textarea 
                                    value={noteText}
                                    onChange={(e) => setNoteText(e.target.value)}
                                    className={`textarea w-full bg-base-200 rounded-2xl p-4 pr-12 focus:outline-primary border-none text-sm resize-none h-28 transition-all
                                        ${isCodeMode ? "font-mono text-primary bg-slate-950" : "font-sans"}
                                    `}
                                    placeholder={isCodeMode ? "paste_code_here();" : "Synchronize thoughts..."}
                                />
                                
                                {/* Mode Toggles */}
                                <div className="absolute right-3 top-3 flex flex-col gap-2">
                                    <button 
                                        onClick={() => setIsCodeMode(!isCodeMode)}
                                        className={`p-2 rounded-lg transition-colors ${isCodeMode ? 'bg-primary text-black' : 'bg-white/5 text-white/40 hover:text-white'}`}
                                        title="Toggle Code Mode"
                                    >
                                        <Code size={14} />
                                    </button>
                                    <div className="flex flex-col items-center text-primary/40 pt-1">
                                        <Clock size={12} />
                                        <span className="text-[8px] font-mono mt-0.5">{formatTime(videoRef.current?.currentTime || 0)}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-end">
                                <button onClick={handleSaveNote} className="btn btn-primary btn-sm rounded-xl px-4 flex items-center gap-2">
                                    <Save size={14} /> 
                                    <span className="text-[10px] font-black uppercase">Sync to Cloud</span>
                                </button>
                            </div>
                        </div>

                        {/* Saved Notes List */}
                        <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                            {savedNotes.map((note, idx) => (
                                <div 
                                    key={idx}
                                    className="p-4 bg-base-200/50 border border-white/5 rounded-xl group hover:border-primary/30 transition-all cursor-pointer"
                                    onClick={() => onJumpToTime(note.time)}
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <span className="flex items-center gap-1.5 text-primary text-[10px] font-black bg-primary/10 px-2 py-1 rounded-md">
                                            <Play size={10} fill="currentColor" /> {formatTime(note.time)}
                                        </span>
                                        {note.isCode && (
                                            <span className="text-[9px] text-primary/60 font-mono uppercase tracking-widest bg-primary/5 px-2 py-1 rounded border border-primary/20">
                                                Snippet
                                            </span>
                                        )}
                                    </div>

                                    {note.isCode ? (
                                        <pre className="bg-slate-950 p-3 rounded-lg overflow-x-auto border border-white/5">
                                            <code className="text-xs font-mono text-primary/80 leading-relaxed whitespace-pre">
                                                {note.text}
                                            </code>
                                        </pre>
                                    ) : (
                                        <p className="text-sm text-base-content/80 leading-relaxed">{note.text}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};