import { Camera, Mail, ShieldCheck } from "lucide-react";
import { useState, useRef } from "react";

export const ProfileHeader = ({ user }: { user: any }) => {
    const [preview, setPreview] = useState(user.avatarUrl || null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result as string);
            reader.readAsDataURL(file);
            // TODO: Upload to Django/Cloudinary here
        }
    };

    return (
        <div className="relative mb-24">
            {/* Cover Banner */}
            <div className="h-48 w-full bg-gradient-to-r from-primary/20 to-secondary/20 rounded-3xl" />
            
            {/* Avatar Section */}
            <div className="absolute -bottom-16 left-8 flex items-end gap-6">
                <div className="relative group">
                    <div className="avatar">
                        <div className="w-32 h-32 rounded-2xl ring ring-base-100 ring-offset-base-100 ring-offset-4 overflow-hidden bg-base-300">
                            {preview ? (
                                <img src={preview} alt="Profile" />
                            ) : (
                                <div className="flex items-center justify-center h-full text-4xl font-black opacity-20">
                                    {user.fullName[0]}
                                </div>
                            )}
                        </div>
                    </div>
                    <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute bottom-2 right-2 btn btn-circle btn-primary btn-sm shadow-xl scale-0 group-hover:scale-100 transition-transform"
                    >
                        <Camera size={16} />
                    </button>
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        className="hidden" 
                        accept="image/*" 
                        onChange={handleFileChange} 
                    />
                </div>

                <div className="pb-4">
                    <div className="flex items-center gap-2">
                        <h1 className="text-3xl font-black tracking-tight">{user.fullName}</h1>
                        {user.role === 'ADMIN' && <ShieldCheck size={20} className="text-primary" />}
                    </div>
                    <p className="text-sm font-bold opacity-50 flex items-center gap-2">
                        <Mail size={14} /> {user.email}
                    </p>
                </div>
            </div>
        </div>
    );
};