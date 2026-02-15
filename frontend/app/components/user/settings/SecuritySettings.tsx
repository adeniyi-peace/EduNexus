import { Lock, ShieldAlert, KeyRound } from "lucide-react";
import { Form } from "react-router";

export const SecuritySettings = () => {
    return (
        <div className="card  border border-base-content/5 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-error/10 text-error rounded-xl">
                    <Lock size={24} />
                </div>
                <div>
                    <h3 className="font-black text-lg">Security</h3>
                    <p className="text-sm opacity-60">Update password and secure your account.</p>
                </div>
            </div>

            <Form method="post" action="/settings/password" className="space-y-4 max-w-lg">
                <div className="form-control w-full">
                    <label className="label">
                        <span className="label-text font-bold text-xs uppercase opacity-70">Current Password</span>
                    </label>
                    <div className="relative">
                        <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 opacity-30" size={16} />
                        <input type="password" name="current_password" placeholder="••••••••" className="input input-bordered w-full pl-10" />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text font-bold text-xs uppercase opacity-70">New Password</span>
                        </label>
                        <input type="password" name="new_password" placeholder="••••••••" className="input input-bordered w-full" />
                    </div>
                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text font-bold text-xs uppercase opacity-70">Confirm New</span>
                        </label>
                        <input type="password" name="confirm_password" placeholder="••••••••" className="input input-bordered w-full" />
                    </div>
                </div>

                <div className="pt-2">
                    <button type="submit" className="btn btn-neutral btn-sm w-full md:w-auto">
                        Update Password
                    </button>
                </div>
            </Form>

            {/* Danger Zone */}
            <div className="mt-8 p-4 rounded-xl bg-error/5 border border-error/20 flex items-start gap-4">
                <ShieldAlert className="text-error shrink-0" size={20} />
                <div className="flex-1">
                    <h4 className="font-bold text-sm text-error">Delete Account</h4>
                    <p className="text-xs opacity-70 mt-1">
                        Permanently remove your account and all of your content. This action cannot be undone.
                    </p>
                </div>
                <button className="btn btn-outline btn-error btn-xs">Delete</button>
            </div>
        </div>
    );
};