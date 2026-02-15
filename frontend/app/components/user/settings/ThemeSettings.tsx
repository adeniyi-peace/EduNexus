import { useFetcher } from "react-router";
import { Monitor, Moon, Sun, CheckCircle2 } from "lucide-react";

interface ThemeSettingsProps {
    currentTheme: string;
}

export const ThemeSettings = ({ currentTheme }: ThemeSettingsProps) => {
    const fetcher = useFetcher();
    
    // Optimistic UI: Use the submitted data if pending, otherwise use prop
    const optimisticTheme = fetcher.formData?.get("theme") || currentTheme;
    const isDark = optimisticTheme === "edunexus_dark";

    const handleThemeChange = (newTheme: string) => {
        fetcher.submit(
            { theme: newTheme }, 
            { method: "POST", action: "/resources/theme" }
        );
    };

    return (
        <div className="card border border-base-content/5 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-primary/10 text-primary rounded-xl">
                    <Monitor size={24} />
                </div>
                <div>
                    <h3 className="font-black text-lg">Interface Theme</h3>
                    <p className="text-sm opacity-60">Select your preferred appearance.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Light Mode Card */}
                <button
                    onClick={() => handleThemeChange("edunexus")}
                    className={`relative group border-2 rounded-2xl p-4 text-left transition-all overflow-hidden
                    ${!isDark ? 'border-primary bg-primary/5' : 'border-base-content/10 hover:border-primary/50'}`}
                >
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-orange-500">
                            <Sun size={20} />
                        </div>
                        <span className="font-bold">Light Mode</span>
                    </div>
                    <div className="h-16 bg-base-200 rounded-lg border border-base-content/5 relative overflow-hidden">
                        <div className="absolute top-2 left-2 w-16 h-2 bg-white rounded-full"></div>
                        <div className="absolute top-6 left-2 w-8 h-2 bg-primary/20 rounded-full"></div>
                    </div>
                    {!isDark && (
                        <div className="absolute top-4 right-4 text-primary">
                            <CheckCircle2 size={20} fill="currentColor" className="text-white" />
                        </div>
                    )}
                </button>

                {/* Dark Mode Card */}
                <button
                    onClick={() => handleThemeChange("edunexus_dark")}
                    className={`relative group border-2 rounded-2xl p-4 text-left transition-all overflow-hidden
                    ${isDark ? 'border-primary bg-primary/5' : 'border-base-content/10 hover:border-primary/50'}`}
                >
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-blue-400">
                            <Moon size={20} />
                        </div>
                        <span className="font-bold">Dark Mode</span>
                    </div>
                    <div className="h-16 bg-slate-900 rounded-lg border border-white/10 relative overflow-hidden">
                        <div className="absolute top-2 left-2 w-16 h-2 bg-white/20 rounded-full"></div>
                        <div className="absolute top-6 left-2 w-8 h-2 bg-primary rounded-full"></div>
                    </div>
                    {isDark && (
                        <div className="absolute top-4 right-4 text-primary">
                            <CheckCircle2 size={20} fill="currentColor" className="text-white" />
                        </div>
                    )}
                </button>
            </div>
        </div>
    );
};