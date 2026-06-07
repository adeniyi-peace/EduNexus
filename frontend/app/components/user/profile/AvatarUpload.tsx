import { Camera, User } from "lucide-react";
import { useState, useRef } from "react";

interface Props {
    currentAvatar: string | null;
    onFileSelect: (file: File) => void;
    onPresetSelect: (url: string) => void;
}

const PRESET_AVATARS = [
    { name: "Cyber", url: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=150&auto=format&fit=crop&q=60" },
    { name: "Aurora", url: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=150&auto=format&fit=crop&q=60" },
    { name: "Sunset", url: "https://images.unsplash.com/photo-1557683316-973673baf926?w=150&auto=format&fit=crop&q=60" },
    { name: "Flare", url: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=150&auto=format&fit=crop&q=60" },
    { name: "Matrix", url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=150&auto=format&fit=crop&q=60" },
    { name: "Vector", url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=60" }
];

export const AvatarUpload = ({ currentAvatar, onFileSelect, onPresetSelect }: Props) => {
    const [preview, setPreview] = useState<string | null>(currentAvatar);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const objectUrl = URL.createObjectURL(file);
            setPreview(objectUrl);
            onFileSelect(file);
        }
    };

    const handlePresetClick = (url: string) => {
        setPreview(url);
        onPresetSelect(url);
    };

    return (
        <div className="flex flex-col items-center gap-6">
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
            
            <p className="text-[10px] text-center opacity-50 font-black uppercase tracking-wider">
                Click above to upload<br/>or choose a preset below:
            </p>

            {/* Presets Grid */}
            <div className="grid grid-cols-3 gap-2 w-full max-w-xs">
                {PRESET_AVATARS.map((preset) => (
                    <button
                        key={preset.name}
                        onClick={() => handlePresetClick(preset.url)}
                        type="button"
                        className={`relative rounded-xl overflow-hidden aspect-square border-2 transition-all hover:scale-105 active:scale-95 ${preview === preset.url ? "border-primary shadow-lg" : "border-transparent opacity-80 hover:opacity-100"}`}
                        title={preset.name}
                    >
                        <img src={preset.url} alt={preset.name} className="object-cover w-full h-full" />
                    </button>
                ))}
            </div>
        </div>
    );
};