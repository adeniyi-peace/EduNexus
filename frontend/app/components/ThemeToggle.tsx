// app/components/ThemeToggle
import { useFetcher } from "react-router";

export function ThemeToggle({ currentTheme }: { currentTheme: string }) {
  const fetcher = useFetcher();
  const isDark = currentTheme === "edunexus_dark";

  return (
    <button 
      className="btn btn-ghost btn-circle"
      onClick={() => {
        const nextTheme = isDark ? "edunexus" : "edunexus_dark";
        fetcher.submit({ theme: nextTheme }, { method: "post", action: "/resources/theme" });
      }}
    >
      <label className="swap swap-rotate">
        <input type="checkbox" checked={isDark} readOnly />
        {/* Sun Icon */}
        <svg className="swap-on fill-current w-6 h-6"  />
        {/* Moon Icon */}
        <svg className="swap-off fill-current w-6 h-6"  />
      </label>
    </button>
  );
}