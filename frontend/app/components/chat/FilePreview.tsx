import { X, FileCode, ImageIcon } from "lucide-react";

interface FilePreviewProps {
    file: File;
    onClear: () => void;
}

export const FilePreview = ({ file, onClear }: FilePreviewProps) => {
    const isImage = file.type.startsWith('image/');

    return (
        <div className="absolute bottom-full left-4 mb-4 animate-in slide-in-from-bottom-2 duration-300">
            <div className="bg-slate-800 border border-primary/30 p-2 rounded-xl flex items-center gap-3 shadow-2xl backdrop-blur-md">
                <div className="w-12 h-12 bg-white/5 rounded-lg flex items-center justify-center text-primary">
                    {isImage ? <ImageIcon size={20} /> : <FileCode size={20} />}
                </div>
                <div className="flex flex-col pr-8">
                    <span className="text-xs font-bold text-white truncate max-w-37.5">{file.name}</span>
                    <span className="text-[10px] text-white/40 uppercase tracking-tighter">
                        {(file.size / 1024).toFixed(1)} KB • Ready for Uplink
                    </span>
                </div>
                <button 
                    onClick={onClear}
                    className="absolute -top-2 -right-2 bg-error text-white rounded-full p-1 hover:scale-110 transition-transform"
                >
                    <X size={12} />
                </button>
            </div>
        </div>
    );
};