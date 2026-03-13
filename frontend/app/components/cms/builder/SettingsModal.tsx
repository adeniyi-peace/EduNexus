import React from "react";
import { Trash2, ImagePlus } from "lucide-react";
import type { CourseData } from "~/types/course";

interface SettingsModalProps {
    isOpen: boolean;
    course: CourseData;
    draftSettings: {
        title: string;
        price: number;
        difficulty: CourseData['difficulty'];
        description: string;
        category: string;
        language: string;
        status: CourseData['status'];
        thumbnail: string;
        thumbnailFile: File | null;
    };
    uploadProgress: number;
    deleteConfirmText: string;
    onDraftChange: (fields: any) => void;
    onThumbnailSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSave: () => void;
    onCancel: () => void;
    onDelete: () => void;
    onDeleteConfirmTextChange: (text: string) => void;
    error: string | null;
}

export function SettingsModal({
    course,
    draftSettings,
    uploadProgress,
    deleteConfirmText,
    onDraftChange,
    onThumbnailSelect,
    onSave,
    onCancel,
    onDelete,
    onDeleteConfirmTextChange,
    error
}: SettingsModalProps) {
    return (
        <dialog id="course_settings_modal" className="modal modal-bottom sm:modal-middle backdrop-blur-sm">
            <div className="modal-box bg-base-100 border border-base-content/10 max-w-2xl p-8 rounded-4xl">
                <h3 className="font-black text-xl mb-6 italic uppercase tracking-tighter">Course_Settings</h3>
                
                {error && (
                    <div className="bg-error/10 border border-error/20 p-4 rounded-2xl flex items-center gap-3 mb-6 animate-in shake duration-500">
                        <div className="w-8 h-8 rounded-full bg-error/20 flex items-center justify-center shrink-0">
                            <span className="text-error font-black">!</span>
                        </div>
                        <p className="text-[10px] text-error font-bold uppercase tracking-widest text-left">
                            {error}
                        </p>
                    </div>
                )}

                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Basic Info */}
                        <div className="space-y-4 md:col-span-2">
                            <div className="form-control">
                                <label className="label py-1">
                                    <span className="label-text text-[10px] opacity-40 uppercase font-black tracking-widest">Course Title</span>
                                </label>
                                <input 
                                    type="text" 
                                    className="input input-bordered w-full bg-base-200 border-none focus:ring-2 ring-primary/20 transition-all font-bold" 
                                    value={draftSettings.title} 
                                    onChange={(e) => onDraftChange({ title: e.target.value })} 
                                />
                            </div>
                            <div className="form-control">
                                <label className="label py-1">
                                    <span className="label-text text-[10px] opacity-40 uppercase font-black tracking-widest">Description</span>
                                </label>
                                <textarea 
                                    className="textarea textarea-bordered w-full bg-base-200 border-none focus:ring-2 ring-primary/20 transition-all font-medium h-24" 
                                    value={draftSettings.description} 
                                    onChange={(e) => onDraftChange({ description: e.target.value })} 
                                />
                            </div>
                        </div>

                        {/* Details Row 1 */}
                        <div className="form-control">
                            <label className="label py-1">
                                <span className="label-text text-[10px] opacity-40 uppercase font-black tracking-widest">Price ($)</span>
                            </label>
                            <input 
                                type="number" 
                                className="input input-bordered w-full bg-base-200 border-none font-bold" 
                                value={draftSettings.price} 
                                onChange={(e) => onDraftChange({ price: parseFloat(e.target.value) })} 
                            />
                        </div>
                        <div className="form-control">
                            <label className="label py-1">
                                <span className="label-text text-[10px] opacity-40 uppercase font-black tracking-widest">Language</span>
                            </label>
                            <input 
                                type="text" 
                                className="input input-bordered w-full bg-base-200 border-none font-bold" 
                                value={draftSettings.language} 
                                onChange={(e) => onDraftChange({ language: e.target.value })} 
                            />
                        </div>

                        {/* Details Row 2 */}
                        <div className="form-control">
                            <label className="label py-1">
                                <span className="label-text text-[10px] opacity-40 uppercase font-black tracking-widest">Category</span>
                            </label>
                            <input 
                                type="text" 
                                className="input input-bordered w-full bg-base-200 border-none font-bold" 
                                placeholder="e.g. Backend, Design"
                                value={draftSettings.category} 
                                onChange={(e) => onDraftChange({ category: e.target.value })} 
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="form-control">
                                <label className="label py-1">
                                    <span className="label-text text-[10px] opacity-40 uppercase font-black tracking-widest">Difficulty</span>
                                </label>
                                <select 
                                    className="select select-bordered w-full bg-base-200 border-none font-bold"
                                    value={draftSettings.difficulty}
                                    onChange={(e) => onDraftChange({ difficulty: e.target.value as any })}
                                >
                                    <option value="Beginner">Beginner</option>
                                    <option value="Intermediate">Intermediate</option>
                                    <option value="Advanced">Advanced</option>
                                </select>
                            </div>
                            <div className="form-control">
                                <label className="label py-1">
                                    <span className="label-text text-[10px] opacity-40 uppercase font-black tracking-widest">Status</span>
                                </label>
                                <select 
                                    className="select select-bordered w-full bg-base-200 border-none font-bold"
                                    value={draftSettings.status}
                                    onChange={(e) => onDraftChange({ status: e.target.value as any })}
                                >
                                    <option value="Draft">Draft</option>
                                    <option value="Published">Published</option>
                                    <option value="Archived">Archived</option>
                                </select>
                            </div>
                        </div>

                        {/* Thumbnail Upload */}
                        <div className="form-control md:col-span-2">
                            <label className="label py-1">
                                <span className="label-text text-[10px] opacity-40 uppercase font-black tracking-widest">Course Thumbnail</span>
                            </label>
                            
                            <div 
                                onClick={() => document.getElementById('thumbnail_upload_input')?.click()}
                                className={`
                                    relative aspect-video rounded-2xl border-2 border-dashed transition-all cursor-pointer group overflow-hidden
                                    ${draftSettings.thumbnail ? 'border-transparent' : 'border-base-content/10 hover:border-primary/40 bg-base-200/50'}
                                `}
                            >
                                {draftSettings.thumbnail ? (
                                    <>
                                        <img src={draftSettings.thumbnail} alt="Preview" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center gap-2">
                                            <ImagePlus className="text-white" size={32} />
                                            <span className="text-[10px] font-black text-white uppercase tracking-widest">Replace Image</span>
                                        </div>
                                        {draftSettings.thumbnailFile && (
                                            <div className="absolute top-4 left-4 flex gap-2">
                                                <span className="badge badge-primary font-black uppercase text-[8px] tracking-widest shadow-lg">New Upload</span>
                                                {uploadProgress > 0 && <span className="badge badge-secondary font-black uppercase text-[8px] tracking-widest shadow-lg">{uploadProgress}%</span>}
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                                        {uploadProgress > 0 ? (
                                            <div className="radial-progress text-primary" style={{ "--value": uploadProgress, "--size": "3rem" } as any}>
                                                <span className="text-[10px] font-black">{uploadProgress}%</span>
                                            </div>
                                        ) : (
                                            <div className="w-12 h-12 rounded-2xl bg-base-100 flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-content transition-all">
                                                <ImagePlus size={24} />
                                            </div>
                                        )}
                                        <div className="text-center">
                                            <p className="text-xs font-black uppercase tracking-widest opacity-40 group-hover:opacity-100 transition-opacity">Upload_Thumbnail</p>
                                            <p className="text-[10px] opacity-20 mt-1">PNG, JPG or WEBP (Max 2MB)</p>
                                        </div>
                                    </div>
                                )}
                                
                                <input 
                                    id="thumbnail_upload_input"
                                    type="file" 
                                    className="hidden" 
                                    accept="image/*"
                                    onChange={onThumbnailSelect}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="divider opacity-5"></div>

                    {/* Danger Zone */}
                    <div className="rounded-2xl border border-error/20 bg-error/5 p-5">
                        <h4 className="text-error text-[10px] font-black uppercase tracking-widest flex items-center gap-2 mb-2">
                            <Trash2 size={14} /> Critical_Zone
                        </h4>
                        <p className="text-xs text-error/60 mb-4 leading-relaxed">
                            Deleting this course will purge all associated modules and media. Type <span className="font-mono bg-error/10 px-1 rounded text-error font-bold">DELETE</span> to confirm.
                        </p>
                        <div className="flex gap-2">
                            <input 
                                type="text" 
                                placeholder="Type DELETE"
                                className="input input-sm input-bordered flex-1 bg-base-100 border-error/20 text-error focus:border-error placeholder:text-error/20 font-bold"
                                value={deleteConfirmText}
                                onChange={(e) => onDeleteConfirmTextChange(e.target.value)}
                            />
                            <button 
                                disabled={deleteConfirmText !== "DELETE"}
                                onClick={onDelete}
                                className="btn btn-sm btn-error text-white px-4 rounded-lg disabled:opacity-20"
                            >
                                Purge
                            </button>
                        </div>
                    </div>
                </div>

                <div className="modal-action gap-2">
                    <button 
                        type="button"
                        onClick={onCancel}
                        className="btn btn-ghost btn-sm uppercase text-[10px] font-black"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={onSave}
                        className="btn btn-primary btn-sm px-6 rounded-xl uppercase text-[10px] font-black shadow-lg shadow-primary/20"
                    >
                        Save_Changes
                    </button>
                </div>
            </div>
        </dialog>
    );
}
