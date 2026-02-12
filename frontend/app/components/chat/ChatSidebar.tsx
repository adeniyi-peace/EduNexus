import { Hash, MessageSquare, User, ShieldCheck } from "lucide-react";

interface ChatSidebarProps {
    activeRoom: string;
    onSelect: (id: string, title: string) => void;
}

export const ChatSidebar = ({ activeRoom, onSelect }: ChatSidebarProps) => {
    const channels = [
        { id: "course-general", title: "Global Discussion", type: "public" },
        { id: "course-q-a", title: "Q&A Protocol", type: "public" },
    ];

    const directMessages = [
        { id: "dm-dr-nexus", title: "Dr. Nexus", role: "Instructor", online: true },
        { id: "dm-assistant-alpha", title: "Assistant Alpha", role: "TA", online: false },
    ];

    return (
        <div className="w-72 bg-slate-900 border-r border-white/5 flex flex-col">
            <div className="p-6 border-b border-white/5">
                <h2 className="text-xl font-black text-white tracking-tighter uppercase italic">
                    Nexus<span className="text-primary text-sm not-italic ml-1">Comm</span>
                </h2>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-8">
                {/* PUBLIC CHANNELS */}
                <div>
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 mb-4 px-2">
                        Global Nodes
                    </h3>
                    <div className="space-y-1">
                        {channels.map((ch) => (
                            <button
                                key={ch.id}
                                onClick={() => onSelect(ch.id, ch.title)}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                                    activeRoom === ch.id 
                                    ? 'bg-primary/10 text-primary border border-primary/20' 
                                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                                }`}
                            >
                                <Hash size={18} />
                                <span className="text-sm font-medium">{ch.title}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* DIRECT MESSAGES */}
                <div>
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 mb-4 px-2">
                        Secure Links
                    </h3>
                    <div className="space-y-1">
                        {directMessages.map((dm) => (
                            <button
                                key={dm.id}
                                onClick={() => onSelect(dm.id, dm.title)}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group ${
                                    activeRoom === dm.id 
                                    ? 'bg-white/10 text-white border border-white/10' 
                                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                                }`}
                            >
                                <div className="relative">
                                    <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center border border-white/5 group-hover:border-primary/50 transition-colors">
                                        <User size={16} />
                                    </div>
                                    {dm.online && (
                                        <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-success rounded-full border-2 border-slate-900" />
                                    )}
                                </div>
                                <div className="flex flex-col items-start overflow-hidden">
                                    <span className="text-sm font-medium truncate w-full">{dm.title}</span>
                                    <span className="text-[9px] text-primary font-bold uppercase tracking-tighter">{dm.role}</span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};