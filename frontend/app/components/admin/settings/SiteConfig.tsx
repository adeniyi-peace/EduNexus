import { Globe, Mail, Type, Save } from "lucide-react";

export const SiteConfig = () => {
    return (
        <div className="card bg-base-100 border border-base-content/5 shadow-sm">
            <div className="p-6 border-b border-base-content/5">
                <h3 className="font-black text-lg flex items-center gap-2">
                    <Globe size={18} className="text-primary" /> Platform Identity
                </h3>
            </div>
            
            <div className="p-6 space-y-4">
                <div className="form-control w-full">
                    <label className="label">
                        <span className="label-text font-bold">Platform Name</span>
                    </label>
                    <label className="input input-bordered flex items-center gap-2">
                        <Type size={16} className="opacity-30" />
                        <input type="text" className="grow" placeholder="EduNexus" defaultValue="EduNexus" />
                    </label>
                </div>

                <div className="form-control w-full">
                    <label className="label">
                        <span className="label-text font-bold">Support Contact Email</span>
                    </label>
                    <label className="input input-bordered flex items-center gap-2">
                        <Mail size={16} className="opacity-30" />
                        <input type="email" className="grow" placeholder="support@edunexus.com" />
                    </label>
                </div>

                <div className="pt-4 flex justify-end">
                    <button className="btn btn-primary btn-sm gap-2">
                        <Save size={16} /> Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};