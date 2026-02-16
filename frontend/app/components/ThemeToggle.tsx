// app/components/ThemeToggle
import { useFetcher } from "react-router";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle({ currentTheme }: { currentTheme: string }) {
    const fetcher = useFetcher();

    // --- OPTIMISTIC UI LOGIC ---
    // If the fetcher is currently submitting, use the value from the form.
    // Otherwise, fall back to the theme provided by the root loader.
    const submissionTheme = fetcher.formData?.get("theme") as string;
    const theme = submissionTheme || currentTheme;
    const isDark = theme === "edunexus_dark";

    return (
        <div className="tooltip tooltip-bottom" data-tip={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}>
            <button 
                className="btn btn-ghost btn-circle group transition-all duration-300 hover:bg-primary/10"
                aria-label="Toggle Theme"
                onClick={() => {
                    const nextTheme = isDark ? "edunexus" : "edunexus_dark";
                    fetcher.submit(
                        { theme: nextTheme }, 
                        { method: "POST", action: "/resources/theme" }
                    );
                }}
            >
                <label className="swap swap-rotate w-full h-full pointer-events-none">
                    {/* We use the 'isDark' state to drive the 'swap-active' class. 
                        This forces DaisyUI to show the correct icon based on our optimistic logic.
                    */}
                    <input type="checkbox" checked={isDark} readOnly className="hidden" />
                    
                    {/* Sun Icon (Visible when isDark is false) */}
                    <Sun 
                        className={`swap-on h-5 w-5 transition-transform duration-500 text-orange-400 ${!isDark ? 'rotate-0' : 'rotate-90'}`} 
                    />
                    
                    {/* Moon Icon (Visible when isDark is true) */}
                    <Moon 
                        className={`swap-off h-5 w-5 transition-transform duration-500 text-primary ${isDark ? 'rotate-0' : '-rotate-90'}`} 
                    />
                </label>
            </button>
        </div>
    );
}