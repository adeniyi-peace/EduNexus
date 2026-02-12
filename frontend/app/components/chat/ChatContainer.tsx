import { useState } from "react";
import { ChatSidebar } from "./ChatSidebar";
import { ChatWindow } from "./ChatWindow";

export const ChatContainer = () => {
    const [activeRoom, setActiveRoom] = useState("course-general");
    const [chatTitle, setChatTitle] = useState("Global Course Discussion");

    return (
        <div className="flex h-full bg-slate-950 border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
            {/* Sidebar: Navigation */}
            <ChatSidebar 
                activeRoom={activeRoom} 
                onSelect={(id, title) => {
                    setActiveRoom(id);
                    setChatTitle(title);
                }} 
            />

            {/* Main Content: The Chat Stream */}
            <ChatWindow roomName={activeRoom} title={chatTitle} />
        </div>
    );
};