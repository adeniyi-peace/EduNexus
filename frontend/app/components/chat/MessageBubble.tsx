import { ShieldCheck, FileCode } from "lucide-react";

interface MessageProps {
    msg: {
        sender: string;
        message: string;
        timestamp: string;
        isMe: boolean;
        role?: string;
        attachmentUrl?: string;    // Added
        attachmentType?: string;   // Added
        attachmentName?: string;   // Added
    };
}

export const MessageBubble = ({ msg }: MessageProps) => {
    const isInstructor = msg.role === "Instructor";

    return (
        <div className={`flex flex-col ${msg.isMe ? 'items-end' : 'items-start'} group animate-in fade-in slide-in-from-bottom-2 duration-300`}>
            {/* Sender Name & Role */}
            {!msg.isMe && (
                <div className="flex items-center gap-2 mb-1 px-1">
                    <span className="text-[11px] font-bold text-slate-400">{msg.sender}</span>
                    {isInstructor && (
                        <span className="flex items-center gap-0.5 text-[9px] bg-primary/20 text-primary px-1.5 py-0.5 rounded-md font-black uppercase tracking-tighter border border-primary/30">
                            <ShieldCheck size={10} /> Authorized
                        </span>
                    )}
                </div>
            )}

            {/* Bubble Content */}
            <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed transition-all ${
                msg.isMe 
                    ? 'bg-primary text-primary-content rounded-tr-none' 
                    : isInstructor
                        ? 'bg-slate-800 text-white border-l-2 border-primary rounded-tl-none'
                        : 'bg-white/5 text-slate-300 border border-white/10 rounded-tl-none group-hover:bg-white/[0.07]'
            }`}>
                {/* IF IMAGE ATTACHMENT */}
                {msg.attachmentUrl && msg.attachmentType?.startsWith('image/') && (
                    <div className="mb-3 overflow-hidden rounded-lg border border-white/10">
                        <img 
                            src={msg.attachmentUrl} 
                            className="w-full h-auto hover:scale-105 transition-transform duration-500 cursor-zoom-in" 
                            alt="Attached transmission" 
                        />
                    </div>
                )}

                {/* IF CODE/FILE ATTACHMENT */}
                {msg.attachmentUrl && !msg.attachmentType?.startsWith('image/') && (
                    <div className="flex items-center gap-3 p-3 bg-black/40 rounded-xl mb-3 border border-white/5 group/file">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                            <FileCode size={20} />
                        </div>
                        <div className="flex flex-col overflow-hidden">
                            <span className="text-xs font-bold truncate text-white">{msg.attachmentName || "Resource File"}</span>
                            <a 
                                href={msg.attachmentUrl} 
                                download 
                                className="text-[10px] text-primary hover:text-white transition-colors flex items-center gap-1"
                            >
                                Download Node Data
                            </a>
                        </div>
                    </div>
                )}

                {/* Message Text */}
                {msg.message && (
                    <p className={msg.isMe ? "text-primary-content" : "text-slate-200"}>
                        {msg.message}
                    </p>
                )}
            </div>

            {/* Timestamp */}
            <span className="text-[9px] mt-1.5 px-1 text-white/20 font-mono tracking-widest uppercase">
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
        </div>
    );
};