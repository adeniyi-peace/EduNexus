// app/components/chat/ChatSidebar.tsx
import { Hash, User, Users, Search, MessageSquare, Plus } from "lucide-react";
import { useState } from "react";
import { useChatRooms, useDMRooms, useRoomParticipants, useStartDM } from "~/hooks/chat/useChatData";
import type { ActiveRoom, ChatRoom, DirectMessageRoom, ChatParticipant } from "~/types/chat";

interface ChatSidebarProps {
    activeRoom: ActiveRoom | null;
    onSelect: (room: ActiveRoom) => void;
    isMobileOpen?: boolean;
    onMobileClose?: () => void;
}

export const ChatSidebar = ({ activeRoom, onSelect, isMobileOpen, onMobileClose }: ChatSidebarProps) => {
    const { data: rooms = [], isLoading: roomsLoading } = useChatRooms();
    const { data: dms = [], isLoading: dmsLoading } = useDMRooms();
    const [searchQuery, setSearchQuery] = useState("");
    const [showNewDM, setShowNewDM] = useState(false);
    const [selectedRoomForDM, setSelectedRoomForDM] = useState<string | null>(null);

    // Filter rooms by search
    const filteredRooms = rooms.filter((r) =>
        r.course_title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const filteredDMs = dms.filter((dm) =>
        dm.other_participant?.fullname?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dm.course_title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSelectRoom = (room: ChatRoom) => {
        onSelect({
            id: room.id,
            type: "room",
            title: room.course_title,
            subtitle: `${room.participant_count} members • ${room.instructor_name}`,
        });
        onMobileClose?.();
    };

    const handleSelectDM = (dm: DirectMessageRoom) => {
        onSelect({
            id: dm.id,
            type: "dm",
            title: dm.other_participant?.fullname || "Direct Message",
            subtitle: dm.course_title,
        });
        onMobileClose?.();
    };

    return (
        <div
            className={`
                w-80 bg-base-200/50 border-r border-base-content/5 flex flex-col shrink-0
                ${isMobileOpen !== undefined ? (isMobileOpen ? "fixed inset-0 z-50 w-full sm:w-80" : "hidden lg:flex") : ""}
            `}
        >
            {/* Header */}
            <div className="p-5 border-b border-base-content/5 shrink-0">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-black text-base-content tracking-tight flex items-center gap-2">
                        <MessageSquare size={20} className="text-primary" />
                        Messages
                    </h2>
                    {isMobileOpen !== undefined && (
                        <button
                            onClick={onMobileClose}
                            className="btn btn-ghost btn-sm btn-circle lg:hidden"
                        >
                            ✕
                        </button>
                    )}
                </div>

                {/* Search */}
                <div className="relative">
                    <Search
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/30"
                        size={14}
                    />
                    <input
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search conversations…"
                        className="input input-sm w-full bg-base-content/5 border-none rounded-xl pl-9 text-xs placeholder:text-base-content/30 focus:ring-1 focus:ring-primary/20"
                    />
                </div>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto p-3 space-y-6 custom-scrollbar">
                {/* Course Group Chats */}
                <div>
                    <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-base-content/30 mb-3 px-2 flex items-center gap-2">
                        <Users size={12} /> Course Channels
                    </h3>
                    <div className="space-y-0.5">
                        {roomsLoading ? (
                            <div className="flex justify-center py-4">
                                <span className="loading loading-dots loading-sm text-primary" />
                            </div>
                        ) : filteredRooms.length === 0 ? (
                            <p className="text-xs text-base-content/30 px-3 py-2">
                                {searchQuery ? "No matching channels" : "No course channels yet"}
                            </p>
                        ) : (
                            filteredRooms.map((room) => (
                                <button
                                    key={room.id}
                                    onClick={() => handleSelectRoom(room)}
                                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left ${activeRoom?.id === room.id && activeRoom?.type === "room"
                                            ? "bg-primary/10 text-primary"
                                            : "text-base-content/60 hover:bg-base-content/5 hover:text-base-content"
                                        }`}
                                >
                                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                        <Hash size={16} className="text-primary" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between gap-2">
                                            <span className="text-sm font-semibold truncate">
                                                {room.course_title}
                                            </span>
                                            {room.unread_count > 0 && (
                                                <span className="badge badge-primary badge-xs px-1.5 font-bold">
                                                    {room.unread_count}
                                                </span>
                                            )}
                                        </div>
                                        {room.last_message && (
                                            <p className="text-[11px] text-base-content/35 truncate mt-0.5">
                                                <span className="font-medium">{room.last_message.sender_name}:</span>{" "}
                                                {room.last_message.content || "[file]"}
                                            </p>
                                        )}
                                    </div>
                                </button>
                            ))
                        )}
                    </div>
                </div>

                {/* Direct Messages */}
                <div>
                    <div className="flex items-center justify-between px-2 mb-3">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-base-content/30 flex items-center gap-2">
                            <User size={12} /> Direct Messages
                        </h3>
                        <button
                            onClick={() => setShowNewDM(!showNewDM)}
                            className="btn btn-ghost btn-xs btn-circle text-base-content/30 hover:text-primary"
                            aria-label="New direct message"
                        >
                            <Plus size={14} />
                        </button>
                    </div>

                    {/* New DM picker */}
                    {showNewDM && (
                        <NewDMPicker
                            rooms={rooms}
                            selectedRoomForDM={selectedRoomForDM}
                            setSelectedRoomForDM={setSelectedRoomForDM}
                            onStartDM={(dm) => {
                                handleSelectDM(dm);
                                setShowNewDM(false);
                            }}
                        />
                    )}

                    <div className="space-y-0.5">
                        {dmsLoading ? (
                            <div className="flex justify-center py-4">
                                <span className="loading loading-dots loading-sm text-primary" />
                            </div>
                        ) : filteredDMs.length === 0 ? (
                            <p className="text-xs text-base-content/30 px-3 py-2">
                                {searchQuery ? "No matching conversations" : "No direct messages yet"}
                            </p>
                        ) : (
                            filteredDMs.map((dm) => (
                                <button
                                    key={dm.id}
                                    onClick={() => handleSelectDM(dm)}
                                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left group ${activeRoom?.id === dm.id && activeRoom?.type === "dm"
                                            ? "bg-base-content/10 text-base-content"
                                            : "text-base-content/60 hover:bg-base-content/5 hover:text-base-content"
                                        }`}
                                >
                                    <div className="relative shrink-0">
                                        <div className="w-9 h-9 rounded-full bg-base-content/10 flex items-center justify-center text-sm font-bold group-hover:ring-2 ring-primary/20 transition-all">
                                            {dm.other_participant?.first_name?.[0]?.toUpperCase() || "?"}
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between gap-2">
                                            <span className="text-sm font-semibold truncate">
                                                {dm.other_participant?.fullname || "User"}
                                            </span>
                                            {dm.unread_count > 0 && (
                                                <span className="badge badge-primary badge-xs px-1.5 font-bold">
                                                    {dm.unread_count}
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-1.5 mt-0.5">
                                            <span className="text-[9px] text-primary font-bold uppercase tracking-tight">
                                                {dm.other_participant?.role}
                                            </span>
                                            <span className="text-[9px] text-base-content/20">•</span>
                                            <span className="text-[10px] text-base-content/30 truncate">
                                                {dm.course_title}
                                            </span>
                                        </div>
                                    </div>
                                </button>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- New DM Picker Sub-Component ---

interface NewDMPickerProps {
    rooms: ChatRoom[];
    selectedRoomForDM: string | null;
    setSelectedRoomForDM: (id: string | null) => void;
    onStartDM: (dm: DirectMessageRoom) => void;
}

const NewDMPicker = ({ rooms, selectedRoomForDM, setSelectedRoomForDM, onStartDM }: NewDMPickerProps) => {
    const { data: participants = [], isLoading } = useRoomParticipants(selectedRoomForDM);
    const startDM = useStartDM();

    const handleStartDM = async (participant: ChatParticipant) => {
        if (!selectedRoomForDM) return;

        // Get the course ID from the selected room
        const room = rooms.find((r) => r.id === selectedRoomForDM);
        if (!room) return;

        try {
            // We use the actual course_id from the room
            const dm = await startDM.mutateAsync({
                userId: participant.id,
                courseId: room.course_id,
            });
            onStartDM(dm);
        } catch (err) {
            console.error("Failed to start DM:", err);
        }
    };

    return (
        <div className="mx-2 mb-3 p-3 bg-base-content/5 rounded-xl border border-base-content/5 space-y-2.5">
            <p className="text-[10px] font-bold text-base-content/40 uppercase tracking-wider">
                Select a course channel first
            </p>
            <select
                value={selectedRoomForDM || ""}
                onChange={(e) => setSelectedRoomForDM(e.target.value || null)}
                className="select select-xs select-bordered w-full rounded-lg text-xs"
            >
                <option value="">Choose a channel…</option>
                {rooms.map((r) => (
                    <option key={r.id} value={r.id}>
                        {r.course_title}
                    </option>
                ))}
            </select>

            {selectedRoomForDM && (
                <div className="max-h-32 overflow-y-auto space-y-1">
                    {isLoading ? (
                        <div className="flex justify-center py-2">
                            <span className="loading loading-spinner loading-xs text-primary" />
                        </div>
                    ) : participants.length === 0 ? (
                        <p className="text-[10px] text-base-content/30 text-center py-2">
                            No other participants
                        </p>
                    ) : (
                        participants.map((p) => (
                            <button
                                key={p.id}
                                onClick={() => handleStartDM(p)}
                                disabled={startDM.isPending}
                                className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-left hover:bg-base-content/5 transition-colors disabled:opacity-50"
                            >
                                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">
                                    {p.first_name?.[0]?.toUpperCase() || "?"}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <span className="text-xs font-medium truncate block">
                                        {p.fullname}
                                    </span>
                                    <span className="text-[9px] text-primary/60 uppercase">
                                        {p.role}
                                    </span>
                                </div>
                            </button>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};