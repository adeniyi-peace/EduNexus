import { motion, AnimatePresence } from "framer-motion";
import type { UserProfileData } from "~/types/user";

interface ProfileAboutProps {
    user: UserProfileData;
    isEditing: boolean;
}

export const ProfileAbout = ({ user, isEditing }: ProfileAboutProps) => {
    return (
        <div className="card bg-base-100 border border-base-content/5 p-6 shadow-xs h-full">
            <h3 className="font-black text-lg mb-4 flex items-center gap-2">
                About Me
                {isEditing && <span className="badge badge-xs badge-warning">Editing</span>}
            </h3>
            
            
            <div className="relative min-h-30">
                <AnimatePresence mode="wait">
                    {isEditing ? (
                        <motion.div
                            key="edit"
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            className="h-full"
                        >
                            <textarea 
                                className="textarea textarea-bordered w-full h-40 font-sans text-base leading-relaxed focus:outline-primary" 
                                defaultValue={user.bio}
                                placeholder="Tell the community about yourself..."
                            />
                            <div className="text-xs opacity-40 text-right mt-2">Markdown supported</div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="view"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <p className="opacity-70 leading-relaxed whitespace-pre-line">
                                {user.bio}
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};