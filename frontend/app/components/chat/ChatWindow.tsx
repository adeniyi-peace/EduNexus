// app/components/chat/ChatWindow.tsx
import { Send, Paperclip, ArrowDown, Wifi, WifiOff, Loader2 } from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";
import { useChatSocket } from "../../hooks/chat/useChatSocket";
import { MessageBubble } from "./MessageBubble";
import { FilePreview } from "./FilePreview";
import { useMessages, useUploadChatFile } from "~/hooks/chat/useChatData";
import type { ActiveRoom, ChatMessage } from "~/types/chat";

interface ChatWindowProps {
    activeRoom: ActiveRoom | null;
}

export const ChatWindow = ({ activeRoom }: ChatWindowProps) => {
    const [input, setInput] = useState("");
    const [showScrollButton, setShowScrollButton] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const scrollRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Fetch message history via REST API
    const {
        data: historyMessages = [],
        isLoading: historyLoading,
    } = useMessages(activeRoom?.id || null, activeRoom?.type || "room");

    // WebSocket for real-time messages
    const {
        messages: realtimeMessages,
        setMessages: setRealtimeMessages,
        connectionStatus,
        typingUsers,
        sendMessage,
        handleTyping,
    } = useChatSocket({
        roomId: activeRoom?.id || null,
        roomType: activeRoom?.type || "room",
    });

    // File upload mutation
    const uploadFile = useUploadChatFile();

    // Combine history + real-time, deduplicating by message_id
    const allMessages: ChatMessage[] = (() => {
        const seen = new Set<string>();
        const combined: ChatMessage[] = [];

        for (const msg of historyMessages) {
            const key = msg.id || msg.message_id || "";
            if (key && !seen.has(key)) {
                seen.add(key);
                combined.push(msg);
            }
        }
        for (const msg of realtimeMessages) {
            const key = msg.id || msg.message_id || "";
            if (key && !seen.has(key)) {
                seen.add(key);
                combined.push(msg);
            } else if (!key) {
                combined.push(msg);
            }
        }

        return combined;
    })();

    // Clear real-time messages when room changes (history will be re-fetched)
    useEffect(() => {
        setRealtimeMessages([]);
    }, [activeRoom?.id, setRealtimeMessages]);

    const handleSend = async () => {
        if (!input.trim() && !selectedFile) return;

        let attachmentData: { url: string; type: string; name: string } | undefined;

        if (selectedFile && activeRoom) {
            try {
                const result = await uploadFile.mutateAsync({
                    file: selectedFile,
                    roomId: activeRoom.type === "room" ? activeRoom.id : undefined,
                    dmRoomId: activeRoom.type === "dm" ? activeRoom.id : undefined,
                });
                attachmentData = {
                    url: result.url,
                    type: result.type,
                    name: result.name,
                };
            } catch {
                console.error("File upload failed");
            }
        }

        sendMessage(input, attachmentData);
        setInput("");
        setSelectedFile(null);
    };

    // Scroll detection
    const onScroll = () => {
        if (!containerRef.current) return;
        const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
        setShowScrollButton(scrollHeight - scrollTop - clientHeight > 200);
    };

    const scrollToBottom = useCallback(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
        setShowScrollButton(false);
    }, []);

    // Auto-scroll when new messages arrive (only if already at bottom)
    useEffect(() => {
        if (!showScrollButton) {
            scrollToBottom();
        }
    }, [allMessages.length, showScrollButton, scrollToBottom]);

    // No room selected state
    if (!activeRoom) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center bg-base-100/50 text-base-content/30">
                <div className="w-20 h-20 bg-base-content/5 rounded-3xl flex items-center justify-center mb-4">
                    <Send size={32} className="opacity-30" />
                </div>
                <h3 className="text-lg font-bold mb-1">No conversation selected</h3>
                <p className="text-sm opacity-50">Choose a chat from the sidebar to begin</p>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col bg-base-100/50 min-w-0">
            {/* Header */}
            <header className="px-5 py-3.5 border-b border-base-content/5 flex items-center justify-between bg-base-100/80 backdrop-blur-sm shrink-0">
                <div className="flex items-center gap-3 min-w-0">
                    <div
                        className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                            connectionStatus === "connected"
                                ? "bg-success animate-pulse shadow-[0_0_8px_rgba(0,200,100,0.5)]"
                                : connectionStatus === "connecting"
                                  ? "bg-warning animate-pulse"
                                  : "bg-error"
                        }`}
                    />
                    <div className="min-w-0">
                        <h3 className="font-bold text-base-content tracking-tight truncate">
                            {activeRoom.title}
                        </h3>
                        {activeRoom.subtitle && (
                            <p className="text-[10px] text-base-content/40 truncate">{activeRoom.subtitle}</p>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {connectionStatus === "connected" ? (
                        <span className="flex items-center gap-1 text-[10px] text-success/60 font-mono uppercase tracking-widest">
                            <Wifi size={12} /> Live
                        </span>
                    ) : connectionStatus === "connecting" ? (
                        <span className="flex items-center gap-1 text-[10px] text-warning/60 font-mono uppercase tracking-widest">
                            <Loader2 size={12} className="animate-spin" /> Connecting
                        </span>
                    ) : (
                        <span className="flex items-center gap-1 text-[10px] text-error/60 font-mono uppercase tracking-widest">
                            <WifiOff size={12} /> Offline
                        </span>
                    )}
                </div>
            </header>

            {/* Message Stream */}
            <div
                ref={containerRef}
                onScroll={onScroll}
                className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar"
            >
                {historyLoading ? (
                    <div className="flex items-center justify-center h-full">
                        <Loader2 size={24} className="animate-spin text-primary" />
                    </div>
                ) : allMessages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-base-content/20">
                        <p className="text-sm">No messages yet. Start the conversation!</p>
                    </div>
                ) : (
                    allMessages.map((msg, idx) => (
                        <MessageBubble key={msg.id || msg.message_id || idx} msg={msg} />
                    ))
                )}
                <div ref={scrollRef} />
            </div>

            {/* Typing Indicator */}
            {typingUsers.length > 0 && (
                <div className="px-5 py-1.5 text-[11px] text-primary/60 font-medium animate-in fade-in duration-200">
                    <span className="inline-flex items-center gap-1.5">
                        <span className="flex gap-0.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary/40 animate-bounce [animation-delay:0ms]" />
                            <span className="w-1.5 h-1.5 rounded-full bg-primary/40 animate-bounce [animation-delay:150ms]" />
                            <span className="w-1.5 h-1.5 rounded-full bg-primary/40 animate-bounce [animation-delay:300ms]" />
                        </span>
                        {typingUsers.map((u) => u.username).join(", ")}{" "}
                        {typingUsers.length === 1 ? "is" : "are"} typing…
                    </span>
                </div>
            )}

            {/* Floating Scroll Button */}
            {showScrollButton && (
                <div className="relative">
                    <button
                        onClick={scrollToBottom}
                        className="absolute bottom-2 right-6 z-20 bg-primary text-primary-content p-2.5 rounded-full shadow-lg hover:scale-110 transition-transform flex items-center gap-1.5 text-xs font-bold"
                    >
                        <ArrowDown size={14} />
                    </button>
                </div>
            )}

            {/* Input Area */}
            <div className="px-4 py-3 bg-base-100 border-t border-base-content/5 relative shrink-0">
                {selectedFile && (
                    <FilePreview file={selectedFile} onClear={() => setSelectedFile(null)} />
                )}

                <div className="relative flex items-center gap-2">
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="btn btn-ghost btn-sm btn-circle text-base-content/40 hover:text-primary"
                        aria-label="Attach file"
                    >
                        <Paperclip size={18} />
                    </button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                    />

                    <input
                        value={input}
                        onChange={(e) => {
                            setInput(e.target.value);
                            handleTyping();
                        }}
                        onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                        placeholder="Type a message…"
                        disabled={connectionStatus !== "connected"}
                        className="input input-bordered input-sm flex-1 bg-base-200/50 border-base-content/10 rounded-xl focus:border-primary/30 text-sm placeholder:text-base-content/30"
                    />
                    <button
                        onClick={handleSend}
                        disabled={connectionStatus !== "connected" || (!input.trim() && !selectedFile)}
                        className="btn btn-primary btn-sm btn-circle"
                        aria-label="Send message"
                    >
                        <Send size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};