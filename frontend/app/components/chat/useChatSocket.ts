import { useEffect, useRef, useState } from "react";

export const useChatSocket = (roomName: string) => {
    const [messages, setMessages] = useState<any[]>([]);
    const socketRef = useRef<WebSocket | null>(null);

    useEffect(() => {
        const wsUrl = `ws://localhost:8000/ws/chat/${roomName}/`;
        socketRef.current = new WebSocket(wsUrl);

        socketRef.current.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setMessages((prev) => [...prev, data]);
        };

        socketRef.current.onclose = () => console.log("Nexus Link Terminated");

        return () => {
            socketRef.current?.close();
        };
    }, [roomName]);

    // Updated to accept attachment data
    const sendMessage = (message: string, attachment?: { url: string; type: string; name: string }) => {
        if (socketRef.current?.readyState === WebSocket.OPEN) {
            socketRef.current.send(JSON.stringify({ 
                message,
                timestamp: new Date().toISOString(),
                attachmentUrl: attachment?.url,
                attachmentType: attachment?.type,
                attachmentName: attachment?.name,
                isMe: true // Temporary flag for local UI logic
            }));
        }
    };

    return { messages, sendMessage };
};