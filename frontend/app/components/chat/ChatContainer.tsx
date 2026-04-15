// app/components/chat/ChatContainer.tsx
import { useState } from "react";
import { Menu } from "lucide-react";
import { ChatSidebar } from "./ChatSidebar";
import { ChatWindow } from "./ChatWindow";
import type { ActiveRoom } from "~/types/chat";

export const ChatContainer = () => {
    const [activeRoom, setActiveRoom] = useState<ActiveRoom | null>(null);
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

    return (
        <div className="flex h-[calc(100vh-6rem)] bg-base-100 border border-base-content/5 rounded-2xl overflow-hidden shadow-xl">
            {/* Mobile sidebar toggle */}
            <button
                onClick={() => setIsMobileSidebarOpen(true)}
                className="lg:hidden fixed bottom-6 left-6 z-30 btn btn-primary btn-circle shadow-xl"
                aria-label="Open chat sidebar"
            >
                <Menu size={20} />
            </button>

            {/* Sidebar */}
            <ChatSidebar
                activeRoom={activeRoom}
                onSelect={setActiveRoom}
                isMobileOpen={isMobileSidebarOpen}
                onMobileClose={() => setIsMobileSidebarOpen(false)}
            />

            {/* Chat Window */}
            <ChatWindow activeRoom={activeRoom} />
        </div>
    );
};