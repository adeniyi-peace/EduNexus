// app/components/chat/FilePreview.tsx
import { X, FileCode, ImageIcon } from "lucide-react";

interface FilePreviewProps {
    file: File;
    onClear: () => void;
}

export const FilePreview = ({ file, onClear }: FilePreviewProps) => {
    const isImage = file.type.startsWith("image/");

    return (
        <div className="absolute bottom-full left-4 mb-3 animate-in slide-in-from-bottom-2 duration-300 z-10">
            <div className="bg-base-200 border border-primary/20 p-2.5 rounded-xl flex items-center gap-3 shadow-xl">
                {/* File icon or image preview */}
                <div className="w-12 h-12 bg-base-content/5 rounded-lg flex items-center justify-center text-primary shrink-0 overflow-hidden">
                    {isImage ? (
                        <img
                            src={URL.createObjectURL(file)}
                            alt="preview"
                            className="w-full h-full object-cover rounded-lg"
                        />
                    ) : (
                        <FileCode size={20} />
                    )}
                </div>
                <div className="flex flex-col pr-6 min-w-0">
                    <span className="text-xs font-bold text-base-content truncate max-w-[150px]">
                        {file.name}
                    </span>
                    <span className="text-[10px] text-base-content/40 uppercase tracking-tight">
                        {(file.size / 1024).toFixed(1)} KB • Ready to send
                    </span>
                </div>
                <button
                    onClick={onClear}
                    className="absolute -top-2 -right-2 bg-error text-error-content rounded-full p-1 hover:scale-110 transition-transform shadow-sm"
                    aria-label="Remove file"
                >
                    <X size={12} />
                </button>
            </div>
        </div>
    );
};