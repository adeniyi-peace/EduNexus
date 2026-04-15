import { useState, useEffect } from "react";
import { Database, RefreshCw, Save, Loader2 } from "lucide-react";
import { ApiIntegrations } from "~/components/admin/settings/ApiIntegrations";
import { MaintenanceToggle } from "~/components/admin/settings/MaintenanceToggle";
import { SecuritySettings } from "~/components/admin/settings/SecuritySettings";
import { SiteConfig } from "~/components/admin/settings/SiteConfig";
import { useAdminSettings, useSaveAdminSettings } from "~/hooks/admin/useAdminSettings";
import { AdminTableSkeleton, AdminErrorState } from "~/components/admin/shared/AdminTableSkeleton";

export const meta = () => {
  return [
    { title: "Settings | EduNexus" },
    { name: "description", content: "Settings Page" },
  ];
};

export default function AdminSettingsPage() {
    const { data, isLoading, isError, refetch } = useAdminSettings();
    const saveMutation = useSaveAdminSettings();

    // Local working copy of settings
    const [localSettings, setLocalSettings] = useState<Record<string, string>>({});
    const [isDirty, setIsDirty] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);

    // Sync local state when data loads
    useEffect(() => {
        if (data?.settings) {
            const map: Record<string, string> = {};
            data.settings.forEach(s => { map[s.key] = s.value; });
            setLocalSettings(map);
        }
    }, [data]);

    const handleChange = (key: string, value: string) => {
        setLocalSettings(prev => ({ ...prev, [key]: value }));
        setIsDirty(true);
        setSaveSuccess(false);
    };

    const handleSave = async () => {
        const settingsArray = Object.entries(localSettings).map(([key, value]) => ({ key, value }));
        try {
            await saveMutation.mutateAsync(settingsArray);
            setIsDirty(false);
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);
        } catch { /* error handled by mutation state */ }
    };

    const handleRevert = () => {
        if (data?.settings) {
            const map: Record<string, string> = {};
            data.settings.forEach(s => { map[s.key] = s.value; });
            setLocalSettings(map);
        }
        setIsDirty(false);
    };

    const lastUpdated = data?.settings.reduce((latest, s) => {
        return s.updated_at > latest ? s.updated_at : latest;
    }, "");

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {/* Header */}
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black tracking-tight italic">System Configuration</h1>
                    <p className="text-sm font-medium opacity-50 uppercase tracking-widest">Global Platform Controls</p>
                </div>
                <div className="flex items-center gap-2">
                    {isDirty && (
                        <button
                            className="btn btn-ghost btn-sm gap-2 font-black opacity-60 hover:opacity-100"
                            onClick={handleRevert}
                            disabled={saveMutation.isPending}
                        >
                            <RefreshCw size={14} /> Revert
                        </button>
                    )}
                    <button
                        className={`btn btn-sm gap-2 ${isDirty ? 'btn-primary' : 'btn-ghost opacity-40'} ${saveSuccess ? 'btn-success' : ''}`}
                        onClick={handleSave}
                        disabled={!isDirty || saveMutation.isPending}
                    >
                        {saveMutation.isPending ? (
                            <><Loader2 size={14} className="animate-spin" /> Saving...</>
                        ) : saveSuccess ? (
                            <>✓ Saved</>
                        ) : (
                            <><Save size={14} /> Save Changes</>
                        )}
                    </button>
                </div>
            </div>

            {isError ? (
                <AdminErrorState message="Could not load platform settings." onRetry={refetch} />
            ) : isLoading ? (
                <AdminTableSkeleton rows={6} columns={2} />
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Column 1: Identity & API */}
                    <div className="space-y-8">
                        <SiteConfig settings={localSettings} onChange={handleChange} />
                        <ApiIntegrations settings={localSettings} onChange={handleChange} />
                    </div>

                    {/* Column 2: Security & Infrastructure */}
                    <div className="space-y-8">
                        <SecuritySettings settings={localSettings} onChange={handleChange} />

                        <div className="space-y-4">
                            <div className="flex items-center gap-2 opacity-50 uppercase text-[10px] font-black tracking-widest">
                                <Database size={14} /> Advanced Infrastructure
                            </div>
                            <MaintenanceToggle
                                isEnabled={localSettings["maintenance_mode"] === "true"}
                                onToggle={(val) => handleChange("maintenance_mode", val ? "true" : "false")}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Footer Audit Info */}
            <div className="py-8 border-t border-base-content/5 text-center">
                <p className="text-[10px] font-bold opacity-30 uppercase tracking-[0.2em]">
                    {lastUpdated
                        ? `Last system change: ${lastUpdated}`
                        : "Last system change: No changes recorded yet"}
                </p>
            </div>
        </div>
    );
}