import { Award, Download, ExternalLink, ShieldCheck, Code, Database, Trophy } from "lucide-react";
import { useState } from "react";
import { MOCK_ACHIEVEMENTS } from "~/utils/mockData";

const IconMap: any = { ShieldCheck, Code, Database, Trophy };

export const AchievementGallery = () => {
    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* BADGES SECTION */}
            <section>
                <div className="flex items-center gap-3 mb-8">
                    <Trophy className="text-primary" size={24} />
                    <h2 className="text-xl font-black uppercase tracking-tighter italic">Earned <span className="text-primary">Badges</span></h2>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                    {MOCK_ACHIEVEMENTS.badges.map((badge) => {
                        const Icon = IconMap[badge.icon] || Award;
                        return (
                            <div key={badge.id} className="group relative flex flex-col items-center text-center p-6 bg-slate-900 border border-white/5 rounded-3xl hover:border-primary/50 transition-all duration-500">
                                {/* Glow Effect */}
                                <div className="absolute inset-0 bg-primary/5 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                                
                                <div className="w-16 h-16 mb-4 rounded-2xl bg-white/5 flex items-center justify-center text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-black transition-all duration-500 shadow-xl">
                                    <Icon size={32} />
                                </div>
                                <h3 className="text-xs font-black uppercase tracking-widest text-white mb-1">{badge.name}</h3>
                                <p className="text-[10px] text-white/30 font-medium leading-tight px-2">{badge.description}</p>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* CERTIFICATES SECTION */}
            <section>
                <div className="flex items-center gap-3 mb-8">
                    <Award className="text-primary" size={24} />
                    <h2 className="text-xl font-black uppercase tracking-tighter italic">Official <span className="text-primary">Credentials</span></h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {MOCK_ACHIEVEMENTS.certificates.map((cert) => (
                        <div key={cert.id} className="bg-slate-900 border border-white/5 rounded-3xl overflow-hidden flex flex-col md:flex-row group hover:border-white/20 transition-all duration-500">
                            {/* Certificate Mini-Preview */}
                            <div className="w-full md:w-48 h-32 bg-slate-950 relative overflow-hidden flex items-center justify-center border-r border-white/5">
                                <div className="absolute inset-0 bg-linear-to-br from-primary/20 to-transparent opacity-50" />
                                <Award className="text-white/10 group-hover:scale-150 transition-transform duration-1000" size={80} />
                                <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/60 backdrop-blur-md rounded text-[8px] font-mono text-primary uppercase">
                                    ID: {cert.credentialId}
                                </div>
                            </div>

                            {/* Info */}
                            <div className="flex-1 p-6 flex flex-col justify-between">
                                <div>
                                    <h3 className="text-lg font-bold text-white leading-tight mb-1">{cert.courseTitle}</h3>
                                    <p className="text-xs text-white/40 uppercase tracking-widest font-black">Issued on {new Date(cert.issueDate).toLocaleDateString()}</p>
                                </div>
                                
                                <div className="flex gap-3 mt-6">
                                    <button className="flex-1 btn btn-primary btn-sm rounded-xl gap-2 text-[10px] font-black uppercase">
                                        <Download size={14} /> Download PDF
                                    </button>
                                    <button className="btn btn-ghost btn-sm btn-circle border border-white/10 hover:bg-white/5">
                                        <ExternalLink size={14} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};