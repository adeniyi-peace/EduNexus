import { Github, Twitter, Linkedin, Globe, Link as LinkIcon } from "lucide-react";

interface Socials {
    twitter: string;
    github: string;
    linkedin: string;
    website: string;
}

interface Props {
    socials: Socials;
    onChange: (key: keyof Socials, val: string) => void;
}

export const SocialLinks = ({ socials, onChange }: Props) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control">
                <label className="label"><span className="label-text font-bold">Twitter</span></label>
                <div className="input-group flex items-center">
                    <span className="bg-base-200 px-3 py-3 border border-r-0 border-base-content/20 rounded-l-lg">
                        <Twitter size={18} />
                    </span>
                    <input 
                        type="text" 
                        placeholder="username" 
                        className="input input-bordered w-full rounded-l-none"
                        value={socials.twitter}
                        onChange={(e) => onChange('twitter', e.target.value)}
                    />
                </div>
            </div>

            <div className="form-control">
                <label className="label"><span className="label-text font-bold">GitHub</span></label>
                <div className="input-group flex items-center">
                    <span className="bg-base-200 px-3 py-3 border border-r-0 border-base-content/20 rounded-l-lg">
                        <Github size={18} />
                    </span>
                    <input 
                        type="text" 
                        placeholder="username" 
                        className="input input-bordered w-full rounded-l-none"
                        value={socials.github}
                        onChange={(e) => onChange('github', e.target.value)}
                    />
                </div>
            </div>

            <div className="form-control">
                <label className="label"><span className="label-text font-bold">LinkedIn</span></label>
                <div className="input-group flex items-center">
                    <span className="bg-base-200 px-3 py-3 border border-r-0 border-base-content/20 rounded-l-lg">
                        <Linkedin size={18} />
                    </span>
                    <input 
                        type="text" 
                        placeholder="profile-url" 
                        className="input input-bordered w-full rounded-l-none"
                        value={socials.linkedin}
                        onChange={(e) => onChange('linkedin', e.target.value)}
                    />
                </div>
            </div>

            <div className="form-control">
                <label className="label"><span className="label-text font-bold">Website</span></label>
                <div className="input-group flex items-center">
                    <span className="bg-base-200 px-3 py-3 border border-r-0 border-base-content/20 rounded-l-lg">
                        <Globe size={18} />
                    </span>
                    <input 
                        type="text" 
                        placeholder="https://..." 
                        className="input input-bordered w-full rounded-l-none"
                        value={socials.website}
                        onChange={(e) => onChange('website', e.target.value)}
                    />
                </div>
            </div>
        </div>
    );
};