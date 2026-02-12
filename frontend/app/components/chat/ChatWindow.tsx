import { Send, Paperclip, ArrowDown  } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useChatSocket } from "./useChatSocket";
import { MessageBubble } from "./MessageBubble";
import { FilePreview } from "./FilePreview";
import { MOCK_CHAT_MESSAGES } from "~/utils/mockData";

export const ChatWindow = ({ roomName, title }: { roomName: string, title: string }) => {
    const { messages, sendMessage } = useChatSocket(roomName);
    const [input, setInput] = useState("");
    const [showScrollButton, setShowScrollButton] = useState(false);

    const scrollRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Combine mock data with real-time messages
    const displayMessages = [...MOCK_CHAT_MESSAGES, ...messages];

    const handleSend = async () => {
        if (!input.trim() && !selectedFile) return;

        let attachmentData = undefined;

        if (selectedFile) {
            // In a real Django setup, you'd likely upload the file to S3 first, 
            // then send the URL via the WebSocket.
            
            // 1. You would usually call your Django API here:
            // const formData = new FormData();
            // formData.append('file', selectedFile);
            // const response = await axios.post('/api/upload/', formData);
            // attachmentData = { url: response.data.url, type: selectedFile.type, name: selectedFile.name };

            // For now, we'll simulate a local URL for testing:
            attachmentData = { 
                url: URL.createObjectURL(selectedFile), 
                type: selectedFile.type, 
                name: selectedFile.name 
            };
        }
        
        // Now sendMessage matches the hook signature
        sendMessage(input, attachmentData); 
        
        setInput("");
        setSelectedFile(null);
    };

    // Detect if user has scrolled up
    const onScroll = () => {
        if (!containerRef.current) return;
        const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
        
        // If user is more than 200px from bottom, show the button
        const isScrolledUp = scrollHeight - scrollTop - clientHeight > 200;
        setShowScrollButton(isScrolledUp);
    };

    const scrollToBottom = () => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
        setShowScrollButton(false);
    };

    // Auto-scroll logic only if user is already at the bottom
    useEffect(() => {
        if (!showScrollButton) {
            scrollToBottom();
        }
    }, [messages]);


    return (
        <div className="flex-1 flex flex-col bg-slate-900/50">
            {/* Header */}
            <header className="p-4 border-b border-white/5 flex items-center justify-between bg-slate-900">
                <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse shadow-[0_0_10px_rgba(var(--p),0.8)]" />
                    <h3 className="font-bold text-white tracking-tight">{title}</h3>
                </div>
                <span className="text-[10px] font-mono text-white/20 uppercase tracking-widest">Encrypted Connection</span>
            </header>

            {/* Message Stream */}
            <div 
                ref={containerRef}
                onScroll={onScroll}
                className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide"
            >
                {messages.map((msg, idx) => (
                    <MessageBubble key={idx} msg={msg} />
                ))}
                <div ref={scrollRef} />
            </div>

            {/* Floating Scroll Button */}
            {showScrollButton && (
                <button 
                    onClick={scrollToBottom}
                    className="absolute bottom-24 right-8 z-20 bg-primary text-primary-content p-3 rounded-full shadow-[0_0_20px_rgba(var(--p),0.5)] animate-bounce hover:scale-110 transition-transform flex items-center gap-2 text-xs font-bold"
                >
                    <ArrowDown size={16} /> New Transmissions
                </button>
            )}
            

            {/* Input Area */}
            <div className="p-4 bg-slate-900 border-t border-white/5 relative">
                {selectedFile && <FilePreview file={selectedFile} onClear={() => setSelectedFile(null)} />}

                <div className="relative flex items-center">
                    <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="p-2 text-white/40 hover:text-primary transition-colors"
                    >
                        <Paperclip size={20} />
                    </button>
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        className="hidden" 
                        onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                    />

                    <input 
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSend()}
                        placeholder="Transmit data..."
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-4 pr-12 text-white focus:outline-none focus:border-primary/50 transition-all"
                    />
                    <button 
                        onClick={handleSend}
                        className="absolute right-2 p-2 text-primary hover:text-white transition-colors"
                    >
                        <Send size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
};