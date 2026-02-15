import { Bell, Mail, MessageSquare, BookOpen } from "lucide-react";
import { Form } from "react-router";

export const NotificationSettings = () => {
    return (
        <div className="card border border-base-content/5 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-secondary/10 text-secondary rounded-xl">
                    <Bell size={24} />
                </div>
                <div>
                    <h3 className="font-black text-lg">Notifications</h3>
                    <p className="text-sm opacity-60">Manage how we contact you.</p>
                </div>
            </div>

            {/* We use a React Router Form here for easy submission */}
            <Form method="post" className="space-y-6">
                <div className="space-y-4">
                    {[
                        { 
                            id: "email_digest", 
                            icon: Mail, 
                            title: "Email Digest", 
                            desc: "Weekly summary of your course progress." 
                        },
                        { 
                            id: "new_content", 
                            icon: BookOpen, 
                            title: "New Content Alerts", 
                            desc: "Get notified when instructors post new lessons." 
                        },
                        { 
                            id: "mentions", 
                            icon: MessageSquare, 
                            title: "Discussion Mentions", 
                            desc: "When someone replies to your comment." 
                        }
                    ].map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-4 border border-base-content/5 rounded-xl hover:bg-base-200/50 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-base-200 rounded-lg text-base-content/70">
                                    <item.icon size={18} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm">{item.title}</h4>
                                    <p className="text-xs opacity-60">{item.desc}</p>
                                </div>
                            </div>
                            <input 
                                type="checkbox" 
                                name={item.id} 
                                defaultChecked 
                                className="toggle toggle-primary toggle-sm" 
                            />
                        </div>
                    ))}
                </div>

                <div className="flex justify-end pt-4 border-t border-base-content/5">
                    <button type="submit" className="btn btn-primary btn-sm">
                        Save Preferences
                    </button>
                </div>
            </Form>
        </div>
    );
};