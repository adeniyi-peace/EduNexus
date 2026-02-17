import { useState } from "react";
import { AlertTriangle, Power, Save } from "lucide-react";

export const MaintenanceToggle = () => {
    // In a real app, this state comes from your DB or Config
    const [isMaintenanceMode, setMaintenanceMode] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const handleToggle = () => {
        if (!isMaintenanceMode) {
            // Turning ON requires confirmation
            setShowConfirm(true);
        } else {
            // Turning OFF can be instant
            setMaintenanceMode(false);
            // TODO: Call API to update system status
        }
    };

    const confirmMaintenance = () => {
        setMaintenanceMode(true);
        setShowConfirm(false);
        // TODO: Call API to update system status
    };

    return (
        <div className="card bg-base-100 border border-error/20 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-base-content/5 flex justify-between items-center bg-error/5">
                <div className="flex items-center gap-3 text-error">
                    <AlertTriangle size={24} />
                    <h3 className="font-black text-lg">Danger Zone</h3>
                </div>
            </div>
            
            <div className="p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h4 className="font-bold text-base">Maintenance Mode</h4>
                        <p className="text-sm opacity-60 max-w-md">
                            When enabled, all non-admin users will be redirected to the maintenance page. 
                            Active sessions may be interrupted.
                        </p>
                    </div>
                    
                    <label className="swap swap-rotate">
                        <input 
                            type="checkbox" 
                            checked={isMaintenanceMode} 
                            onChange={handleToggle} 
                            className="toggle toggle-error toggle-lg" 
                        />
                    </label>
                </div>
            </div>

            {/* Confirmation Modal */}
            {showConfirm && (
                <dialog className="modal modal-open">
                    <div className="modal-box border-t-4 border-error">
                        <h3 className="font-black text-lg text-error flex items-center gap-2">
                            <Power size={20} /> System Shutdown?
                        </h3>
                        <p className="py-4 text-sm opacity-70">
                            Are you sure you want to enable Maintenance Mode? This will kick out all active students immediately.
                        </p>
                        <div className="modal-action">
                            <button className="btn" onClick={() => setShowConfirm(false)}>Cancel</button>
                            <button className="btn btn-error text-white" onClick={confirmMaintenance}>
                                Yes, Enable Maintenance
                            </button>
                        </div>
                    </div>
                    <div className="modal-backdrop bg-black/50" onClick={() => setShowConfirm(false)}></div>
                </dialog>
            )}
        </div>
    );
};