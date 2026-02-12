
import { Star, Shield, Trophy } from "lucide-react";
import { AchievementGallery } from "~/components/dashboard/achievement/AchievementGallery";

export default function AchievementsPage() {
    return (
        <div className="min-h-screen  p-8 ">
            <div className="max-w-6xl mx-auto">
                {/* Header Stats Bar */}
                <header className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="bg-slate-900/50 border border-white/5 p-6 rounded-3xl flex items-center gap-5">
                        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                            <Star size={24} />
                        </div>
                        <div>
                            <p className="text-[10px] text-white/30 uppercase font-black tracking-widest">Rank</p>
                            <p className="text-xl font-bold text-white">Elite Architect</p>
                        </div>
                    </div>

                    <div className="bg-slate-900/50 border border-white/5 p-6 rounded-3xl flex items-center gap-5">
                        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                            <Shield size={24} />
                        </div>
                        <div>
                            <p className="text-[10px] text-white/30 uppercase font-black tracking-widest">Total Badges</p>
                            <p className="text-xl font-bold text-white">12 Earned</p>
                        </div>
                    </div>

                    <div className="bg-slate-900/50 border border-white/5 p-6 rounded-3xl flex items-center gap-5">
                        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                            <Trophy size={24} />
                        </div>
                        <div>
                            <p className="text-[10px] text-white/30 uppercase font-black tracking-widest">Completion</p>
                            <p className="text-xl font-bold text-white">2 Certificates</p>
                        </div>
                    </div>
                </header>

                {/* The Main Gallery */}
                <AchievementGallery />
            </div>
        </div>
    );
}