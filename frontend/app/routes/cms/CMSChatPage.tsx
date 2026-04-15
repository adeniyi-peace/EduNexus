// app/routes/cms/CMSChatPage.tsx
// Instructor CMS chat page
import { ChatContainer } from "~/components/chat/ChatContainer";

export const meta = () => {
  return [
    { title: "Chat | EduNexus" },
    { name: "description", content: "Chat Page" },
  ];
};

export default function CMSChatPage() {
    return (
        <div className="h-full">
            <ChatContainer />
        </div>
    );
}
