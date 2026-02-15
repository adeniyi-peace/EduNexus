import { Camera, MapPin, Calendar, Edit3, X, Save } from "lucide-react";
import { motion } from "framer-motion";
import type { UserProfileData } from "~/types/user";

interface ProfileHeaderProps {
    user: UserProfileData;
    isEditing: boolean;
    onToggleEdit: () => void;
}

export const ProfileHeader = ({ user, isEditing, onToggleEdit }: ProfileHeaderProps) => {
    return (
        <div className="card bg-base-100 border border-base-content/5 overflow-hidden shadow-sm relative z-10">
            {/* Cover Image Area */}
            <div className="h-32 md:h-48 bg-linear-to-r from-primary/20 to-secondary/20 relative group">
                 {/* Simulated Cover Upload Button */}
                <button className={`absolute bottom-4 right-4 btn btn-sm btn-circle btn-neutral/80 backdrop-blur-md text-white transition-opacity ${isEditing ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                    <Camera size={16} />
                </button>
            </div>
            
            <div className="card-body pt-0 relative px-6 md:px-10">
                {/* Avatar Section */}
                <div className="absolute -top-16 left-6 md:left-10">
                    <div className="relative group">
                        <div className="w-32 h-32 rounded-full ring-4 ring-base-100 bg-base-200 overflow-hidden shadow-lg">
                            <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                        </div>
                        {/* Avatar Upload Overlay */}
                        <div className={`absolute inset-0 rounded-full bg-black/40 flex items-center justify-center transition-opacity cursor-pointer ${isEditing ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                            <Camera className="text-white drop-shadow-md" size={24} />
                        </div>
                    </div>
                </div>

                {/* Text Info & Action Button */}
                <div className="mt-16 md:mt-4 md:ml-44 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        {isEditing ? (
                            <input 
                                type="text" 
                                defaultValue={user.name} 
                                className="input input-bordered input-sm font-black text-xl w-full max-w-xs" 
                            />
                        ) : (
                            <h1 className="text-2xl font-black tracking-tight">{user.name}</h1>
                        )}
                        
                        <div className="flex flex-wrap items-center gap-3 opacity-60 text-sm font-medium mt-1">
                            <span className="badge badge-neutral badge-sm font-bold uppercase tracking-wider">{user.role}</span>
                            <span className="flex items-center gap-1"><MapPin size={12} /> {user.location}</span>
                            <span className="hidden md:flex items-center gap-1"><Calendar size={12} /> Joined {user.joinedDate}</span>
                        </div>
                    </div>

                    <button 
                        onClick={onToggleEdit}
                        className={`btn btn-sm gap-2 transition-all ${isEditing ? 'btn-success text-white' : 'btn-outline'}`}
                    >
                        {isEditing ? <><Save size={16} /> Save Changes</> : <><Edit3 size={16} /> Edit Profile</>}
                    </button>
                </div>
            </div>
        </div>
    );
};