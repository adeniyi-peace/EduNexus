import { ShieldCheck, UserPlus, Fingerprint } from "lucide-react";

export const SecuritySettings = () => {
    return (
        <div className="card bg-base-100 border border-base-content/5 shadow-sm">
            <div className="p-6 border-b border-base-content/5">
                <h3 className="font-black text-lg flex items-center gap-2">
                    <ShieldCheck size={18} className="text-secondary" /> Security Policies
                </h3>
            </div>

            <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex gap-3">
                        <UserPlus className="opacity-40" />
                        <div>
                            <p className="font-bold text-sm">Allow Public Registration</p>
                            <p className="text-xs opacity-50">Let anyone create a student account.</p>
                        </div>
                    </div>
                    <input type="checkbox" className="toggle toggle-secondary" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex gap-3">
                        <Fingerprint className="opacity-40" />
                        <div>
                            <p className="font-bold text-sm">Enforce Two-Factor (MFA)</p>
                            <p className="text-xs opacity-50">Require instructors to use authenticator apps.</p>
                        </div>
                    </div>
                    <input type="checkbox" className="toggle toggle-secondary" />
                </div>
                
                <div className="bg-base-200/50 p-4 rounded-xl border border-dashed border-base-content/10">
                    <p className="text-[10px] font-black uppercase opacity-40 mb-2">Password Policy</p>
                    <select className="select select-bordered select-sm w-full font-bold">
                        <option>Standard (8+ characters)</option>
                        <option>Strict (Uppercase, Number, Symbol)</option>
                        <option>Academic (SSO Only)</option>
                    </select>
                </div>
            </div>
        </div>
    );
};