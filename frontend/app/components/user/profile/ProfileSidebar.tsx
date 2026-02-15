import { Twitter, Linkedin, Github, Globe, Link as LinkIcon, Plus } from "lucide-react";
import type { UserProfileData } from "~/types/user";

interface ProfileSidebarProps {
    user: UserProfileData;
    isEditing: boolean;
}

const IconMap = {
    twitter: { icon: Twitter, color: "text-sky-500" },
    linkedin: { icon: Linkedin, color: "text-blue-600" },
    github: { icon: Github, color: "text-base-content" },
    website: { icon: Globe, color: "text-success" },
};

export const ProfileSidebar = ({ user, isEditing }: ProfileSidebarProps) => {
    return (
        <div className="space-y-6">
            {/* Quick Stats Card */}
            <div className="grid grid-cols-2 gap-4">
                {user.stats.map((stat, i) => (
                    <div key={i} className="card bg-base-100 border border-base-content/5 p-4 shadow-xs text-center">
                        <div className="text-2xl font-black text-primary">{stat.value}</div>
                        <div className="text-[10px] font-bold uppercase opacity-50 tracking-widest">{stat.label}</div>
                    </div>
                ))}
            </div>

            {/* Social Links Card */}
            <div className="card bg-base-100 border border-base-content/5 p-6 shadow-xs">
                <h3 className="font-black text-xs uppercase tracking-widest opacity-50 mb-4">Social Presence</h3>
                
                <div className="space-y-3">
                    {user.socials.map((soc, i) => {
                        const { icon: Icon, color } = IconMap[soc.platform] || IconMap.website;
                        return (
                            <div key={i} className="group">
                                {isEditing ? (
                                    <div className="join w-full">
                                        <div className="join-item btn btn-square btn-sm btn-ghost bg-base-200">
                                            <Icon size={16} className={color} />
                                        </div>
                                        <input 
                                            type="text" 
                                            defaultValue={soc.url} 
                                            className="join-item input input-bordered input-sm w-full text-xs font-mono" 
                                        />
                                    </div>
                                ) : (
                                    <a 
                                        href={soc.url} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-between p-3 rounded-xl hover:bg-base-200/50 border border-transparent hover:border-base-content/5 transition-all cursor-pointer"
                                    >
                                        <div className="flex items-center gap-3">
                                            <Icon size={18} className={color} />
                                            <span className="text-sm font-bold capitalize">{soc.platform}</span>
                                        </div>
                                        <LinkIcon size={14} className="opacity-0 group-hover:opacity-40 transition-opacity" />
                                    </a>
                                )}
                            </div>
                        );
                    })}
                </div>

                {isEditing && (
                    <button className="btn btn-outline btn-xs btn-dashed w-full mt-4 gap-1 opacity-50 hover:opacity-100">
                        <Plus size={12} /> Add Social Link
                    </button>
                )}
            </div>
        </div>
    );
};