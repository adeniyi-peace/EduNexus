// app/routes/dashboard/ChatPage.tsx
// Student dashboard chat page
import { ChatContainer } from "~/components/chat/ChatContainer";

export const meta = () => {
  return [
    { title: "Chat | EduNexus" },
    { name: "description", content: "Chat Page" },
  ];
};

export default function ChatPage() {
    return (
        <div className="h-full">
            <ChatContainer />
        </div>
    );
}
