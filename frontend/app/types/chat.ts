// app/types/chat.ts
// TypeScript interfaces for the chat system

export interface ChatParticipant {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    fullname: string;
    role: "student" | "instructor" | "admin";
    profile_picture: string | null;
}

export interface LastMessage {
    id: string;
    content: string;
    sender_name: string;
    message_type: "text" | "image" | "file" | "system";
    created_at: string;
}

export interface ChatRoom {
    id: string;
    course_id: string;
    course_title: string;
    course_thumbnail: string | null;
    room_type: "course_group";
    instructor_name: string;
    participant_count: number;
    last_message: LastMessage | null;
    unread_count: number;
    created_at: string;
}

export interface DirectMessageRoom {
    id: string;
    other_participant: ChatParticipant | null;
    course_title: string;
    last_message: LastMessage | null;
    unread_count: number;
    created_at: string;
}

export interface ChatMessage {
    id?: string;
    message_id?: string;
    sender: ChatParticipant;
    content: string;
    attachment_url?: string;
    attachment_name?: string;
    attachment_type?: string;
    message_type: "text" | "image" | "file" | "system";
    is_read: boolean;
    is_me: boolean;
    created_at: string;
}

// WebSocket incoming event types
export interface WSChatMessageEvent {
    type: "chat_message";
    message_id: string;
    sender: ChatParticipant;
    content: string;
    message_type: string;
    attachment_url: string;
    attachment_name: string;
    attachment_type: string;
    created_at: string;
    is_me: boolean;
}

export interface WSTypingEvent {
    type: "typing";
    user_id: number;
    username: string;
    is_typing: boolean;
}

export interface WSUserEvent {
    type: "user_event";
    event: "join" | "leave";
    user_id: number;
    username: string;
}

export type WSEvent = WSChatMessageEvent | WSTypingEvent | WSUserEvent;

// Active room state (could be group or DM)
export interface ActiveRoom {
    id: string;
    type: "room" | "dm";
    title: string;
    subtitle?: string;
}

// Connection states for the WebSocket
export type ConnectionStatus = "connecting" | "connected" | "disconnected" | "error";
