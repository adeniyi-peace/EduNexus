import { useRouteLoaderData } from "react-router";
import { useState } from "react";
import { User, Bell, Lock, Monitor } from "lucide-react";
import { ThemeSettings } from "~/components/user/settings/ThemeSettings";
import { NotificationSettings } from "~/components/user/settings/NotificationSettings";
import { SecuritySettings } from "~/components/user/settings/SecuritySettings";

// Define the shape of your root loader data
interface RootLoaderData {
    theme: string;
}

export default function SettingsPage() {
    // 1. Get the theme from the Root Loader (no need to re-fetch)
    const rootData = useRouteLoaderData("root") as RootLoaderData;
    const currentTheme = rootData?.theme || "edunexus";

    const [activeTab, setActiveTab] = useState("appearance");

    const tabs = [
        { id: "appearance", label: "Appearance", icon: Monitor },
        { id: "notifications", label: "Notifications", icon: Bell },
        { id: "security", label: "Security", icon: Lock },
    ];

    return (
        <div className="min-h-screen">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-3xl font-black mb-8 tracking-tight">Account Settings</h1>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar Navigation */}
                    <div className="w-full lg:w-64 shrink-0">
                        <nav className="menu bg-base-100 p-2 rounded-2xl shadow-sm border border-base-content/5">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all text-left
                                    ${activeTab === tab.id 
                                        ? 'bg-primary text-primary-content shadow-md shadow-primary/20' 
                                        : 'hover:bg-base-200 text-base-content/70'}`}
                                >
                                    <tab.icon size={18} />
                                    {tab.label}
                                </button>
                            ))}
                        </nav>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 space-y-6">
                        {activeTab === "appearance" && (
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <ThemeSettings currentTheme={currentTheme} />
                            </div>
                        )}

                        {activeTab === "notifications" && (
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <NotificationSettings />
                            </div>
                        )}

                        {activeTab === "security" && (
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <SecuritySettings />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}