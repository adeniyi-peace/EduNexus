// app/components/chat/MessageBubble.tsx
import { ShieldCheck, FileCode, Download } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { ChatMessage } from "~/types/chat";

interface MessageProps {
    msg: ChatMessage;
}

export const MessageBubble = ({ msg }: MessageProps) => {
    const isInstructor = msg.sender?.role === "instructor";

    const formattedTime = (() => {
        try {
            return formatDistanceToNow(new Date(msg.created_at), { addSuffix: true });
        } catch {
            return "";
        }
    })();

    // System messages
    if (msg.message_type === "system") {
        return (
            <div className="flex justify-center my-4">
                <span className="text-[10px] font-mono text-base-content/30 bg-base-content/5 px-4 py-1.5 rounded-full uppercase tracking-widest">
                    {msg.content}
                </span>
            </div>
        );
    }

    return (
        <div
            className={`flex flex-col ${msg.is_me ? "items-end" : "items-start"} group animate-in fade-in slide-in-from-bottom-2 duration-300`}
        >
            {/* Sender Name & Role */}
            {!msg.is_me && (
                <div className="flex items-center gap-2 mb-1.5 px-1">
                    {/* Avatar */}
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-black text-primary shrink-0">
                        {msg.sender?.first_name?.[0]?.toUpperCase() || "?"}
                    </div>
                    <span className="text-[11px] font-bold text-base-content/50">
                        {msg.sender?.fullname || msg.sender?.email || "User"}
                    </span>
                    {isInstructor && (
                        <span className="flex items-center gap-0.5 text-[9px] bg-primary/15 text-primary px-1.5 py-0.5 rounded-md font-black uppercase tracking-tighter border border-primary/20">
                            <ShieldCheck size={10} /> Instructor
                        </span>
                    )}
                </div>
            )}

            {/* Bubble Content */}
            <div
                className={`max-w-[80%] p-3.5 rounded-2xl text-sm leading-relaxed transition-all ${
                    msg.is_me
                        ? "bg-primary text-primary-content rounded-br-sm"
                        : isInstructor
                          ? "bg-base-200 text-base-content border-l-2 border-primary rounded-bl-sm"
                          : "bg-base-200/60 text-base-content border border-base-content/5 rounded-bl-sm group-hover:bg-base-200"
                }`}
            >
                {/* Image Attachment */}
                {msg.attachment_url &&
                    msg.attachment_type?.startsWith("image/") && (
                        <div className="mb-2.5 overflow-hidden rounded-xl border border-base-content/10">
                            <img
                                src={msg.attachment_url}
                                className="w-full h-auto max-h-64 object-cover hover:scale-105 transition-transform duration-500 cursor-zoom-in"
                                alt={msg.attachment_name || "Attached image"}
                            />
                        </div>
                    )}

                {/* File Attachment */}
                {msg.attachment_url &&
                    !msg.attachment_type?.startsWith("image/") && (
                        <div className="flex items-center gap-3 p-3 bg-base-content/5 rounded-xl mb-2.5 border border-base-content/5">
                            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary shrink-0">
                                <FileCode size={20} />
                            </div>
                            <div className="flex flex-col overflow-hidden flex-1">
                                <span className="text-xs font-bold truncate">
                                    {msg.attachment_name || "File"}
                                </span>
                                <a
                                    href={msg.attachment_url}
                                    download
                                    className="text-[10px] text-primary hover:underline flex items-center gap-1 mt-0.5"
                                >
                                    <Download size={10} /> Download
                                </a>
                            </div>
                        </div>
                    )}

                {/* Message Text */}
                {msg.content && <p className="whitespace-pre-wrap break-words">{msg.content}</p>}
            </div>

            {/* Timestamp + Read status */}
            <div className="flex items-center gap-1.5 mt-1 px-1">
                <span className="text-[9px] text-base-content/25 font-mono tracking-wider">
                    {formattedTime}
                </span>
                {msg.is_me && (
                    <span className={`text-[9px] ${msg.is_read ? "text-primary" : "text-base-content/20"}`}>
                        {msg.is_read ? "✓✓" : "✓"}
                    </span>
                )}
            </div>
        </div>
    );
};