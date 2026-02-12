import { ChatContainer } from "~/components/chat/ChatContainer";

export default function CommunityPage() {
    return (
        // Max height of the screen minus the navbar height (80px)
        <div className="h-[calc(100vh-80px)] p-6 bg-base-300">
            <div className="max-w-7xl mx-auto h-full flex flex-col">
                <header className="mb-6">
                    <h1 className="text-3xl font-black text-white tracking-tighter uppercase italic">
                        Communications<span className="text-primary text-sm not-italic ml-2">Hub</span>
                    </h1>
                    <p className="text-slate-400 text-sm">Synchronizing with the global student network...</p>
                </header>

                <div className="flex-1 min-h-0"> {/* min-h-0 is crucial for inner scrolling */}
                    <ChatContainer />
                </div>
            </div>
        </div>
    );
}