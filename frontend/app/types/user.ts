export interface SocialLink {
    platform: 'twitter' | 'linkedin' | 'github' | 'website';
    url: string;
}

export interface UserProfileData {
    id: string;
    firstName: string;
    lastName: string;
    role: "student" | "instructor" | "admin";
    location: string;
    joinedDate: string;
    bio: string;
    avatar: string;
    coverImage: string;
    socials: SocialLink[];
    stats: { label: string; value: string }[];
}