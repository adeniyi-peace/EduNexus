// app/hooks/useChatData.ts
// TanStack Query hooks for chat REST API endpoints
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "~/utils/api.client";
import type { ChatRoom, DirectMessageRoom, ChatMessage, ChatParticipant } from "~/types/chat";

const CHAT_KEYS = {
    rooms: ["chat-rooms"] as const,
    dms: ["chat-dms"] as const,
    messages: (roomId: string, roomType: string) => ["chat-messages", roomType, roomId] as const,
    participants: (roomId: string) => ["chat-participants", roomId] as const,
};

/**
 * Fetches all course group chat rooms for the authenticated user.
 */
export function useChatRooms() {
    return useQuery<ChatRoom[]>({
        queryKey: CHAT_KEYS.rooms,
        queryFn: async () => {
            const { data } = await api.get("/chat/rooms/");
            return data;
        },
        staleTime: 30_000, // 30 seconds
    });
}

/**
 * Fetches all DM conversations for the authenticated user.
 */
export function useDMRooms() {
    return useQuery<DirectMessageRoom[]>({
        queryKey: CHAT_KEYS.dms,
        queryFn: async () => {
            const { data } = await api.get("/chat/dms/");
            return data;
        },
        staleTime: 30_000,
    });
}

/**
 * Fetches paginated message history for a room.
 * @param roomId - UUID of the room
 * @param roomType - "room" for group chat, "dm" for direct message
 */
export function useMessages(roomId: string | null, roomType: "room" | "dm") {
    const paramKey = roomType === "room" ? "room_id" : "dm_room_id";

    return useQuery<ChatMessage[]>({
        queryKey: CHAT_KEYS.messages(roomId || "", roomType),
        queryFn: async () => {
            const { data } = await api.get("/chat/messages/", {
                params: { [paramKey]: roomId },
            });
            // API returns paginated results with cursor, extract the results array
            return data.results || data;
        },
        enabled: !!roomId,
        staleTime: 10_000,
    });
}

/**
 * Starts or retrieves a DM conversation with another user.
 */
export function useStartDM() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ userId, courseId }: { userId: number; courseId: string }) => {
            const { data } = await api.post("/chat/dms/start/", {
                user_id: userId,
                course_id: courseId,
            });
            return data as DirectMessageRoom;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: CHAT_KEYS.dms });
        },
    });
}

/**
 * Fetches participants of a chat room (for DM user picker).
 */
export function useRoomParticipants(roomId: string | null) {
    return useQuery<ChatParticipant[]>({
        queryKey: CHAT_KEYS.participants(roomId || ""),
        queryFn: async () => {
            const { data } = await api.get("/chat/participants/", {
                params: { room_id: roomId },
            });
            return data;
        },
        enabled: !!roomId,
        staleTime: 60_000,
    });
}

/**
 * Upload a file attachment for a chat message.
 */
export function useUploadChatFile() {
    return useMutation({
        mutationFn: async ({
            file,
            roomId,
            dmRoomId,
        }: {
            file: File;
            roomId?: string;
            dmRoomId?: string;
        }) => {
            const formData = new FormData();
            formData.append("file", file);
            if (roomId) formData.append("room_id", roomId);
            if (dmRoomId) formData.append("dm_room_id", dmRoomId);

            const { data } = await api.post("/chat/upload/", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            return data as { url: string; name: string; type: string; message_id: string };
        },
    });
}
