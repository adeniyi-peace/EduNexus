import { useState, useEffect } from "react";
import { Upload, ShieldCheck, PenTool, Award, ImagePlus } from "lucide-react";
import type { CertificateConfig } from "~/types/course";

interface CertificateEditorProps {
    config?: CertificateConfig;
    courseTitle: string;
    instructorName: string;
    onUpdate: (fields: Partial<CertificateConfig>, signatureFile?: File | null) => void;
}

export function CertificateEditor({ config, courseTitle, instructorName, onUpdate }: CertificateEditorProps) {
    const [localName, setLocalName] = useState(config?.signatoryName || instructorName || "");
    const [localTitle, setLocalTitle] = useState(config?.signatoryTitle || "Course Instructor");
    const [signaturePreview, setSignaturePreview] = useState(config?.signatorySignature || "");
    const [signatureFile, setSignatureFile] = useState<File | null>(null);

    // Sync from props
    useEffect(() => {
        if (config) {
            setLocalName(config.signatoryName);
            setLocalTitle(config.signatoryTitle);
            setSignaturePreview(config.signatorySignature || "");
        }
    }, [config]);

    const handleSignatureSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSignatureFile(file);
            setSignaturePreview(URL.createObjectURL(file));
        }
    };

    const handleSave = () => {
        onUpdate({
            signatoryName: localName,
            signatoryTitle: localTitle
        }, signatureFile);
    };

    return (
        <div className="flex-1 bg-base-100 flex flex-col h-full overflow-y-auto lg:overflow-hidden">
            {/* Header */}
            <div className="h-14 border-b border-base-content/5 flex items-center justify-between px-6 bg-base-200/50 backdrop-blur-md z-10">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                        <Award size={18} />
                    </div>
                    <span className="text-sm font-black uppercase tracking-tight">Certification_Engine</span>
                </div>
                <button 
                    onClick={handleSave}
                    className="btn btn-primary btn-xs h-8 px-4 rounded-lg font-black uppercase text-[9px] tracking-widest shadow-lg shadow-primary/20"
                >
                    Deploy_Configuration
                </button>
            </div>

            <div className="flex-1 overflow-hidden flex flex-col lg:flex-row relative">
                {/* Configuration Panel */}
                <div className="w-full lg:w-96 lg:border-r border-base-content/5 p-6 lg:p-8 space-y-8 lg:overflow-y-auto custom-scrollbar shrink-0">
                    <div className="space-y-1">
                        <h2 className="text-xs font-black uppercase tracking-widest text-primary">Issuance_Rules</h2>
                        <p className="text-[10px] opacity-40 uppercase font-mono leading-tight">Configure the authority identity for automated issuance.</p>
                    </div>

                    <div className="space-y-6">
                        <div className="form-control">
                            <label className="label py-1">
                                <span className="label-text text-[10px] opacity-40 uppercase font-black tracking-widest">Signatory Name</span>
                            </label>
                            <div className="relative">
                                <PenTool size={14} className="absolute left-4 top-1/2 -translate-y-1/2 opacity-20" />
                                <input 
                                    type="text" 
                                    className="input input-bordered w-full bg-base-200 border-none focus:ring-2 ring-primary/20 transition-all font-bold pl-12 text-sm" 
                                    value={localName} 
                                    onChange={(e) => setLocalName(e.target.value)}
                                    placeholder="e.g. John Doe"
                                />
                            </div>
                        </div>

                        <div className="form-control">
                            <label className="label py-1">
                                <span className="label-text text-[10px] opacity-40 uppercase font-black tracking-widest">Signatory Title</span>
                            </label>
                            <div className="relative">
                                <ShieldCheck size={14} className="absolute left-4 top-1/2 -translate-y-1/2 opacity-20" />
                                <input 
                                    type="text" 
                                    className="input input-bordered w-full bg-base-200 border-none focus:ring-2 ring-primary/20 transition-all font-bold pl-12 text-sm" 
                                    value={localTitle} 
                                    onChange={(e) => setLocalTitle(e.target.value)}
                                    placeholder="e.g. Lead Instructor"
                                />
                            </div>
                        </div>

                        <div className="form-control">
                            <label className="label py-1">
                                <span className="label-text text-[10px] opacity-40 uppercase font-black tracking-widest">Authorized Signature</span>
                            </label>
                            <div 
                                onClick={() => document.getElementById('signature_upload')?.click()}
                                className={`
                                    relative aspect-[3/1] rounded-2xl border-2 border-dashed transition-all cursor-pointer group flex flex-col items-center justify-center gap-2 overflow-hidden
                                    ${signaturePreview ? 'border-transparent bg-white/5' : 'border-base-content/10 hover:border-primary/40 bg-base-200/50'}
                                `}
                            >
                                {signaturePreview ? (
                                    <>
                                        <img src={signaturePreview} alt="Signature" className="w-full h-full object-contain p-4 invert dark:invert-0" />
                                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-2">
                                            <ImagePlus className="text-white" size={20} />
                                            <span className="text-[9px] font-black text-white uppercase tracking-widest">Replace</span>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <Upload size={20} className="opacity-20 group-hover:text-primary transition-colors" />
                                        <span className="text-[9px] font-black opacity-20 uppercase tracking-widest">Upload_PNG_Transparent</span>
                                    </>
                                )}
                                <input 
                                    id="signature_upload"
                                    type="file" 
                                    className="hidden" 
                                    accept="image/*"
                                    onChange={handleSignatureSelect}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10">
                        <p className="text-[9px] font-bold text-primary uppercase leading-relaxed text-center">
                            Note: Certificates are automatically issued to students upon 100% course completion.
                        </p>
                    </div>
                </div>

                {/* Preview Panel */}
                <div className="flex-1 bg-base-200/50 p-4 lg:p-12 flex flex-col items-center justify-start lg:justify-center relative lg:overflow-y-auto custom-scrollbar min-h-[500px] lg:min-h-0">
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                         style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
                    
                    <div className="flex items-center gap-2 mb-6 lg:mb-8 opacity-20 shrink-0">
                        <div className="h-px w-6 lg:w-8 bg-base-content" />
                        <span className="text-[9px] lg:text-[10px] font-black uppercase tracking-[0.3em]">Live_Issuance_Preview</span>
                        <div className="h-px w-6 lg:w-8 bg-base-content" />
                    </div>

                    {/* Certificate Mockup Wrapper for Scaling */}
                    <div className="w-full max-w-[800px] flex items-center justify-center overflow-x-auto lg:overflow-visible pb-8 lg:pb-0 custom-scrollbar">
                        <div className="w-full min-w-[320px] aspect-[1.414/1] bg-white text-slate-800 shadow-2xl relative p-6 lg:p-12 border-[8px] lg:border-[20px] border-slate-100 flex flex-col items-center justify-between text-center font-serif origin-center">
                        {/* Decorative Corner */}
                        <div className="absolute top-0 left-0 w-24 h-24 border-t-8 border-l-8 border-slate-200" />
                        <div className="absolute top-0 right-0 w-24 h-24 border-t-8 border-r-8 border-slate-200" />
                        <div className="absolute bottom-0 left-0 w-24 h-24 border-b-8 border-l-8 border-slate-200" />
                        <div className="absolute bottom-0 right-0 w-24 h-24 border-b-8 border-r-8 border-slate-200" />

                            <div className="space-y-1 lg:space-y-2 mt-2 lg:mt-4">
                                <h1 className="text-2xl lg:text-5xl font-black italic tracking-tighter text-slate-900 font-sans uppercase">Certificate</h1>
                                <p className="text-[8px] lg:text-xs font-sans font-black uppercase tracking-[0.5em] text-slate-400 font-sans">of Achievement</p>
                            </div>

                            <div className="space-y-1">
                                <p className="text-[10px] lg:text-sm italic opacity-60">This is to certify that</p>
                                <h2 className="text-lg lg:text-3xl font-bold font-sans tracking-tight border-b-2 border-slate-100 inline-block px-4 lg:px-12 py-1 lg:py-2 mb-2 lg:mb-4 whitespace-nowrap">STUDENT_NAME_PLACEHOLDER</h2>
                                <p className="text-[10px] lg:text-sm italic opacity-60">has successfully completed the course</p>
                                <h3 className="text-xs lg:text-xl font-bold font-sans uppercase tracking-normal text-primary mt-1 lg:mt-2 line-clamp-1">{courseTitle || 'COURSE_TITLE'}</h3>
                            </div>

                            <div className="flex justify-between items-end w-full px-4 lg:px-12 pb-2 lg:pb-4 font-sans gap-2 lg:gap-4">
                                <div className="flex flex-col items-center flex-1">
                                    <span className="text-[6px] lg:text-[10px] font-bold uppercase tracking-widest text-slate-300 border-t border-slate-100 pt-1 lg:pt-2 px-2 lg:px-4 italic">Date of Issue</span>
                                    <span className="text-[8px] lg:text-sm font-bold mt-0.5 lg:mt-1 uppercase text-slate-400">April 05, 2026</span>
                                </div>

                                <div className="w-12 lg:w-24 h-12 lg:h-24 rounded-full border-2 lg:border-4 border-slate-50 flex items-center justify-center opacity-10 flex-none scale-50 lg:scale-100">
                                    <Award size={48} className="text-slate-900" />
                                </div>

                                <div className="flex flex-col items-center flex-1 min-w-[80px] lg:min-w-[160px]">
                                    {signaturePreview ? (
                                        <img src={signaturePreview} alt="Signature" className="h-6 lg:h-12 object-contain mb-1 lg:mb-2 invert" />
                                    ) : (
                                        <div className="h-6 lg:h-12" />
                                    )}
                                    <span className="text-[6px] lg:text-[10px] font-bold uppercase tracking-widest text-slate-900 border-t border-slate-100 pt-1 lg:pt-2 px-2 lg:px-4 uppercase truncate max-w-full">{localName || instructorName}</span>
                                    <span className="text-[5px] lg:text-[8px] font-bold text-slate-400 italic uppercase truncate max-w-full">{localTitle}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
