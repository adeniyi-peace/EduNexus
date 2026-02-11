import { useState } from "react";

interface TabSystemProps {
    currentLesson: any;
}

export const TabSystem = ({ currentLesson }: TabSystemProps) => {
    const [activeTab, setActiveTab] = useState("resources");

    return (
        <div className="h-64 bg-base-100 border-t border-base-content/5 flex flex-col">
            {/* Tab Headers */}
            <div className="flex border-b border-base-content/5 px-6">
                {["resources", "q&a", "notes"].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-6 py-4 text-[10px] font-black uppercase tracking-widest transition-all relative
                        ${activeTab === tab ? "text-primary" : "text-base-content/40 hover:text-base-content"}`}
                    >
                        {tab}
                        {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary" />}
                    </button>
                ))}
            </div>

            {/* Tab Panels */}
            <div className="flex-1 p-6 overflow-y-auto">
                {activeTab === "resources" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-base-200 rounded-2xl flex items-center justify-between group hover:bg-primary/5 transition-colors cursor-pointer">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-base-300 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14.5 2 14.5 8 20 8"/></svg>
                                </div>
                                <div>
                                    <p className="text-sm font-bold">System_Architecture.pdf</p>
                                    <p className="text-[10px] opacity-40 uppercase font-black">2.4 MB • PDF Document</p>
                                </div>
                            </div>
                            <button className="btn btn-ghost btn-sm btn-circle">↓</button>
                        </div>
                    </div>
                )}

                {activeTab === "q&a" && (
                    <p className="text-sm opacity-50 italic">Discussion nodes are currently empty.</p>
                )}

                {activeTab === "notes" && (
                    <div className="h-full flex flex-col">
                        <textarea 
                            className="textarea flex-1 bg-base-200 rounded-2xl p-4 focus:outline-primary border-none text-sm resize-none" 
                            placeholder={`Jot down insights for ${currentLesson.title}...`}
                        />
                        <div className="flex justify-end mt-2">
                            <button className="btn btn-primary btn-xs rounded-lg uppercase tracking-tighter">Save to Cloud</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};