import { useState } from "react";
import { AvatarUpload } from "~/components/user/profile/AvatarUpload";
import { BioSection } from "~/components/user/profile/BioSection";
import { SocialLinks } from "~/components/user/profile/SocialLinks";
import { Save, Loader2 } from "lucide-react";

export default function ProfilePage() {
    // Initial State (Mocking data from loader)
    const [isLoading, setIsLoading] = useState(false);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [bio, setBio] = useState("Hi! I'm a passionate instructor teaching React and Django.");
    const [socials, setSocials] = useState({
        twitter: "edunexus_dev",
        github: "codewithme",
        linkedin: "",
        website: ""
    });

    const handleSocialChange = (key: keyof typeof socials, val: string) => {
        setSocials(prev => ({ ...prev, [key]: val }));
    };

    const handleSubmit = async () => {
        setIsLoading(true);

        // 1. Construct FormData for Django
        // Django handles 'multipart/form-data' best for images
        const formData = new FormData();
        
        // Only append avatar if it changed
        if (avatarFile) {
            formData.append("avatar", avatarFile); 
        }
        
        formData.append("bio", bio);
        
        // For nested JSON (socials), Django DRF usually expects a stringified JSON 
        // if you are inside a multipart form, OR individual fields if flattened.
        // Let's assume a JSONField called 'social_links':
        formData.append("social_links", JSON.stringify(socials));

        try {
            // Mock API Call
            // await fetch('/api/profile/me/', { method: 'PATCH', body: formData });
            console.log("Submitting to Django:", Object.fromEntries(formData));
            
            // Simulate network delay
            await new Promise(r => setTimeout(r, 1000));
            alert("Profile Updated Successfully!");
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-10 px-4 space-y-8">
            <div className="flex justify-between items-center border-b border-base-content/10 pb-6">
                <div>
                    <h1 className="text-3xl font-black tracking-tight">Public Profile</h1>
                    <p className="text-sm opacity-50 font-medium">Manage how others see you on EduNexus.</p>
                </div>
                <button 
                    onClick={handleSubmit} 
                    className="btn btn-primary gap-2" 
                    disabled={isLoading}
                >
                    {isLoading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                    Save Changes
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Avatar */}
                <div className="lg:col-span-1">
                    <div className="card bg-base-100 border border-base-content/5 shadow-sm p-6 sticky top-8">
                        <h3 className="font-bold text-lg mb-4">Profile Picture</h3>
                        <AvatarUpload 
                            currentAvatar="https://i.pravatar.cc/300" 
                            onFileSelect={setAvatarFile} 
                        />
                    </div>
                </div>

                {/* Right Column: Details */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="card bg-base-100 border border-base-content/5 shadow-sm p-6">
                        <h3 className="font-bold text-lg mb-4 border-b border-base-content/5 pb-2">About You</h3>
                        <BioSection value={bio} onChange={setBio} />
                    </div>

                    <div className="card bg-base-100 border border-base-content/5 shadow-sm p-6">
                        <h3 className="font-bold text-lg mb-4 border-b border-base-content/5 pb-2">Social Connections</h3>
                        <SocialLinks socials={socials} onChange={handleSocialChange} />
                    </div>
                </div>
            </div>
        </div>
    );
}