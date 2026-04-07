import { useState, useEffect, useRef, type RefObject } from "react";
import { QnATab } from "./QnATab";
import { Download, FileText, Maximize2, Minimize2, Lock } from "lucide-react";
import type { PlayerLesson } from "~/types/course";
import { NotesTab } from "./NotesTab";

interface TabSystemProps {
    currentLesson: PlayerLesson;
    videoRef: RefObject<HTMLVideoElement | null> | null; // null for article lessons
    onJumpToTime: (seconds: number) => void;
    isExpanded: boolean;
    onToggleExpand: () => void;
    isEnrolled: boolean;
}

export const TabSystem = ({ currentLesson, videoRef, onJumpToTime, isExpanded, onToggleExpand, isEnrolled }: TabSystemProps) => {
    const [activeTab, setActiveTab] = useState("resources");

    // Reset active tab when lesson changes
    useEffect(() => {
        setActiveTab("resources");
    }, [currentLesson.id]);

    const tabs = [
        { id: "resources", label: "Resources" },
        { id: "qna", label: "Q&A" },
        { id: "notes", label: "Notes" }
    ];

    // Has video? (for showing timestamps)
    const hasVideo = !!videoRef;

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
                                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary shadow-[0_-2px_10px_rgba(var(--p),0.5)]" />
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
                    <div id="panel-resources" role="tabpanel" className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-in fade-in duration-300">
                        {currentLesson.resources?.length > 0 ? (
                            currentLesson.resources.map((resource) => (
                                <a
                                    key={resource.id}
                                    href={resource.url}
                                    download // This triggers download if origin match, otherwise opens link
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-4 bg-base-100 rounded-xl border border-base-content/10 shadow-sm flex items-center justify-between group hover:border-primary/40 hover:shadow-md transition-all no-underline"
                                >
                                    <div className="flex items-center gap-4 min-w-0">
                                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
                                            <FileText size={22} />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-bold text-base-content truncate group-hover:text-primary transition-colors">
                                                {resource.title}
                                            </p>
                                            <p className="text-[10px] opacity-60 uppercase font-bold tracking-wider mt-0.5">
                                                {resource.size}
                                            </p>
                                        </div>
                                    </div>
                                    {/* Fix: removed <button> inside <a> to prevent swallow-clicks */}
                                    <div className="btn btn-ghost btn-circle btn-sm text-base-content/50 group-hover:text-primary group-hover:bg-primary/10">
                                        <Download size={18} />
                                    </div>
                                </a>
                            ))
                        ) : (
                            <div className="col-span-full py-16 flex flex-col items-center justify-center text-center opacity-50">
                                <FileText size={48} className="mb-4 text-base-content/20" />
                                <p className="text-sm font-bold uppercase tracking-widest">No resources for this lesson</p>
                            </div>
                        )}
                    </div>
                )}

                {/* 2. Q&A TAB */}
                {activeTab === "qna" && (
                    <div id="panel-qna" role="tabpanel" className="h-full flex flex-col min-h-100 animate-in fade-in duration-300">
                        {!isEnrolled ? (
                            <div className="flex flex-col items-center justify-center h-full text-center px-4 opacity-70">
                                <Lock size={48} className="mb-4 text-base-content/20" />
                                <h3 className="text-lg font-bold text-base-content mb-2">Enroll to join the Q&A</h3>
                                <p className="text-sm text-base-content/50 max-w-sm">Interact with the instructor and other students in the course community.</p>
                            </div>
                        ) : (
                            <QnATab lessonId={currentLesson.id} isEnrolled={isEnrolled} />
                        )}
                    </div>
                )}

                {/* 3. NOTES TAB */}
                {activeTab === "notes" && (
                    <NotesTab 
                        lessonId={currentLesson.id} 
                        isEnrolled={isEnrolled} 
                        videoRef={videoRef} 
                        hasVideo={hasVideo} 
                        onJumpToTime={onJumpToTime} 
                    />
                )}
            </div>
        </div>
    );
};