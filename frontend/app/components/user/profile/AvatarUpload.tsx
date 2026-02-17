import { Camera, User, Loader2 } from "lucide-react";
import { useState, useRef } from "react";

interface Props {
    currentAvatar: string | null;
    onFileSelect: (file: File) => void;
}

export const AvatarUpload = ({ currentAvatar, onFileSelect }: Props) => {
    const [preview, setPreview] = useState<string | null>(currentAvatar);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // 1. Generate local preview immediately
            const objectUrl = URL.createObjectURL(file);
            setPreview(objectUrl);
            
            // 2. Pass file up to parent for the actual upload
            onFileSelect(file);
        }
    };

    return (
        <div className="flex flex-col items-center gap-4">
            <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                <div className="avatar placeholder ring ring-primary ring-offset-base-100 ring-offset-2 rounded-full overflow-hidden w-32 h-32">
                    {preview ? (
                        <img src={preview} alt="Avatar" className="object-cover w-full h-full" />
                    ) : (
                        <div className="bg-neutral text-neutral-content w-full h-full flex items-center justify-center">
                            <User size={48} />
                        </div>
                    )}
                </div>
                
                {/* Overlay on Hover */}
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                    <Camera className="text-white" size={24} />
                </div>
            </div>
            
            <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                accept="image/*" 
            />
            
            <p className="text-xs text-center opacity-50">
                Click to change.<br/>JPG, GIF or PNG. Max 2MB.
            </p>
        </div>
    );
};