import { Key, Eye, EyeOff, ExternalLink } from "lucide-react";
import { useState } from "react";

export const ApiIntegrations = () => {
    const [showKey, setShowKey] = useState(false);

    return (
        <div className="card bg-base-100 border border-base-content/5 shadow-sm">
            <div className="p-6 border-b border-base-content/5 flex justify-between items-center">
                <h3 className="font-black text-lg flex items-center gap-2">
                    <Key size={18} className="text-accent" /> API Integrations
                </h3>
                <span className="badge badge-success badge-sm font-bold text-[10px] uppercase">All Systems Live</span>
            </div>

            <div className="p-6 space-y-4">
                <div className="form-control">
                    <div className="flex justify-between items-end mb-2">
                        <label className="label-text font-bold">Stripe Public Key</label>
                        <a href="#" className="text-[10px] link link-primary font-black uppercase flex items-center gap-1">
                            Get Key <ExternalLink size={10} />
                        </a>
                    </div>
                    <div className="join">
                        <input 
                            type={showKey ? "text" : "password"} 
                            className="input input-bordered join-item w-full text-xs font-mono" 
                            defaultValue="pk_test_51Mz..." 
                        />
                        <button 
                            className="btn btn-bordered join-item"
                            onClick={() => setShowKey(!showKey)}
                        >
                            {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>
                </div>

                <div className="form-control">
                    <label className="label-text font-bold mb-2">AWS S3 Bucket Name</label>
                    <input type="text" className="input input-bordered w-full text-xs" defaultValue="edunexus-media-prod" />
                </div>
            </div>
        </div>
    );
};