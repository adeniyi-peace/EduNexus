import { useState } from "react";
import { ProfileAbout } from "~/components/user/profile/ProfileAbout";
import { ProfileHeader } from "~/components/user/profile/ProfileHeader";
import { ProfileSidebar } from "~/components/user/profile/ProfileSidebar";
import type { UserProfileData } from "~/types/user";

// Mock Data
const MOCK_USER: UserProfileData = {
    id: "1",
    name: "Alex Edunexus",
    role: "Senior Instructor",
    location: "Lagos, Nigeria",
    joinedDate: "Jan 2026",
    bio: "Senior Fullstack Developer & Technical Instructor.\n\nPassionate about building scalable education platforms. I love coffee, clean code, and helping students bridge the gap between theory and industry-standard practice.",
    avatar: "https://i.pravatar.cc/300?u=alex",
    coverImage: "bg-linear-to-r from-primary/20 to-secondary/20",
    socials: [
        { platform: "twitter", url: "https://twitter.com/edunexus" },
        { platform: "linkedin", url: "https://linkedin.com/in/edunexus" },
        { platform: "github", url: "https://github.com/edunexus" }
    ],
    stats: [
        { label: "Students", value: "1,240" },
        { label: "Courses", value: "12" }
    ]
};

export default function ProfilePage() {
    const [isEditing, setIsEditing] = useState(false);
    const [userData, setUserData] = useState<UserProfileData>(MOCK_USER);

    const handleToggleEdit = () => {
        if (isEditing) {
            // Here you would trigger the API call to save data
            console.log("Saving data...", userData);
        }
        setIsEditing(!isEditing);
    };

    return (
        <div className="min-h-screen bg-base-200/30 p-4 md:p-8 pb-24">
            <div className="max-w-5xl mx-auto space-y-6 md:space-y-8">
                
                {/* 1. Header Component */}
                <ProfileHeader 
                    user={userData} 
                    isEditing={isEditing} 
                    onToggleEdit={handleToggleEdit} 
                />

                {/* 2. Grid Layout for Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                    
                    {/* Left Column: Bio (Span 2) */}
                    <div className="lg:col-span-2">
                        <ProfileAbout 
                            user={userData} 
                            isEditing={isEditing} 
                        />
                        
                        {/* Optional: Add a 'Certificates' or 'Portfolio' section here later */}
                    </div>

                    {/* Right Column: Sidebar (Span 1) */}
                    <div>
                        <ProfileSidebar 
                            user={userData} 
                            isEditing={isEditing} 
                        />
                    </div>
                </div>

            </div>
        </div>
    );
}