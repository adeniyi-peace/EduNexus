import { 
    ShieldCheck, 
    Lock, 
    Database, 
    Cpu, 
    Share2, 
    Trash2, 
    Cookie, 
    Mail, 
    FileJson,
    ArrowRight
} from "lucide-react";

export default function PrivacyPolicy() {
    return (
        <div className="bg-base-100 min-h-screen">
            {/* --- HERO HEADER --- */}
            <header className="relative bg-neutral py-24 border-b border-white/5 overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#3B35B8_1.5px,transparent_1.5px)] bg-size-[40px_40px]" />
                </div>
                
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-[10px] font-black uppercase tracking-widest mb-6">
                        <Lock size={12} />
                        Protocol: Data Protection
                    </div>
                    <h1 className="text-5xl lg:text-7xl font-black text-white mb-6 tracking-tighter italic">
                        Privacy Policy
                    </h1>
                    <p className="text-xl text-neutral-content/60 max-w-2xl mx-auto font-medium">
                        Your data belongs to you. We simply process it to optimize your learning trajectory.
                    </p>
                    <div className="mt-8 text-[10px] font-bold opacity-30 uppercase tracking-[0.3em]">
                        Last Revised: February 25, 2026
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 py-20">
                <div className="max-w-4xl mx-auto">
                    
                    {/* --- QUICK DATA SUMMARY TABLE --- */}
                    <div className="bg-base-200/50 rounded-[2.5rem] border border-base-content/5 p-10 mb-20 relative group overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                            <ShieldCheck size={120} />
                        </div>
                        
                        <h3 className="text-xl font-black mb-10 flex items-center gap-3">
                            <FileJson className="text-primary" />
                            Privacy at a Glance
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-primary">
                                    <Database size={16} />
                                    <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Collection</p>
                                </div>
                                <p className="text-sm font-semibold leading-relaxed">
                                    Email, payment tokens, learning telemetry, and security logs.
                                </p>
                            </div>
                            
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-secondary">
                                    <Cpu size={16} />
                                    <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Processing</p>
                                </div>
                                <p className="text-sm font-semibold leading-relaxed">
                                    Curriculum personalization and certificate verification.
                                </p>
                            </div>
                            
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-accent">
                                    <Share2 size={16} />
                                    <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Sub-Processors</p>
                                </div>
                                <p className="text-sm font-semibold leading-relaxed">
                                    Stripe (Payments) and SheerID (Verification).
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* --- MAIN CONTENT --- */}
                    <article className="prose prose-lg max-w-none prose-headings:font-black prose-headings:tracking-tighter prose-headings:italic prose-p:text-base-content/70 prose-strong:text-base-content">
                        <section className="mb-16">
                            <h2 className="flex items-center gap-4 text-3xl">
                                <span className="text-primary not-italic">01.</span> 
                                Information We Collect
                            </h2>
                            <p>
                                As an engineering platform, we collect <strong>telemetry</strong> on your code submissions, deployment logs, and architectural quiz attempts. This creates your "Nexus Score," a metric used solely to help mentors provide high-fidelity feedback on your technical growth.
                            </p>
                        </section>

                        <section className="mb-16">
                            <h2 className="flex items-center gap-4 text-3xl">
                                <span className="text-secondary not-italic">02.</span> 
                                The Right to be Forgotten
                            </h2>
                            <p>
                                In compliance with GDPR and CCPA, you retain full sovereignty over your data. You may request account termination at any time via your dashboard. Upon execution, all personal identifiers are purged, and your certificates (issued as verifiable credentials) will be mathematically revoked.
                            </p>
                            <div className="flex items-center gap-3 p-4 bg-error/5 border border-error/10 rounded-2xl text-error text-sm font-bold">
                                <Trash2 size={16} />
                                Note: Deletion is an irreversible administrative action.
                            </div>
                        </section>

                        <section className="mb-16">
                            <h2 className="flex items-center gap-4 text-3xl">
                                <span className="text-accent not-italic">03.</span> 
                                Cookies & Tracking Protocol
                            </h2>
                            <p>
                                EduNexus uses functional cookies to maintain session state and security. We explicitly <strong>reject</strong> the use of third-party advertising pixels. Your professional development data is never indexed for external marketing purposes.
                            </p>
                            <div className="flex items-center gap-2 text-sm font-black opacity-40">
                                <Cookie size={14} />
                                <span>LSO and Tracker blocks are supported by default.</span>
                            </div>
                        </section>
                    </article>

                    {/* --- CONTACT ESCALATION --- */}
                    <div className="mt-32 p-12 bg-neutral rounded-[3rem] relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 rounded-full blur-3xl -mr-32 -mt-32" />
                        
                        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
                            <div className="space-y-4">
                                <h3 className="text-3xl font-black text-white tracking-tight">Privacy Concerns?</h3>
                                <div className="flex items-center justify-center md:justify-start gap-3 text-white/60">
                                    <Mail size={18} className="text-secondary" />
                                    <span className="font-bold">privacy@edunexus.com</span>
                                </div>
                            </div>
                            
                            <button className="btn btn-secondary btn-lg h-20 px-10 rounded-2xl font-black uppercase tracking-widest text-xs group/btn">
                                <span>Request Data Export</span>
                                <ArrowRight className="group-hover/btn:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}