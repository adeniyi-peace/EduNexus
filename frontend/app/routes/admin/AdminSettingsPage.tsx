
import { Database, RefreshCw } from "lucide-react";
import { ApiIntegrations } from "~/components/admin/settings/ApiIntegrations";
import { MaintenanceToggle } from "~/components/admin/settings/MaintenanceToggle";
import { SecuritySettings } from "~/components/admin/settings/SecuritySettings";
import { SiteConfig } from "~/components/admin/settings/SiteConfig";

export default function AdminSettingsPage() {
    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {/* Header */}
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black tracking-tight italic">System Configuration</h1>
                    <p className="text-sm font-medium opacity-50 uppercase tracking-widest">Global Platform Controls</p>
                </div>
                <button className="btn btn-ghost btn-sm gap-2 font-black opacity-40 hover:opacity-100">
                    <RefreshCw size={14} /> Revert to Default
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Column 1: Identity & API */}
                <div className="space-y-8">
                    <SiteConfig />
                    <ApiIntegrations />
                </div>

                {/* Column 2: Security & Infrastructure */}
                <div className="space-y-8">
                    <SecuritySettings />
                    
                    {/* The Maintenance Toggle component you already have */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 opacity-50 uppercase text-[10px] font-black tracking-widest">
                            <Database size={14} /> Advanced Infrastructure
                        </div>
                        <MaintenanceToggle />
                    </div>
                </div>
            </div>
            
            {/* Footer Audit Info */}
            <div className="py-8 border-t border-base-content/5 text-center">
                <p className="text-[10px] font-bold opacity-30 uppercase tracking-[0.2em]">
                    Last system change: Feb 16, 2026 by Admin_Sarah
                </p>
            </div>
        </div>
    );
}