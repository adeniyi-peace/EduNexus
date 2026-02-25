import { 
    Gavel, 
    ShieldAlert, 
    Zap, 
    CreditCard, 
    Code2, 
    Info,
    ExternalLink
} from "lucide-react";

export default function TermsOfService() {
    const sections = [
        { id: "acceptance", title: "1. Acceptance of Terms", icon: <Gavel size={14} /> },
        { id: "accounts", title: "2. User Accounts & Security", icon: <ShieldAlert size={14} /> },
        { id: "content", title: "3. Intellectual Property", icon: <Code2 size={14} /> },
        { id: "conduct", title: "4. User Conduct", icon: <Zap size={14} /> },
        { id: "billing", title: "5. Payments & Refunds", icon: <CreditCard size={14} /> },
    ];

    return (
        <div className="bg-base-100 min-h-screen">
            {/* --- HEADER --- */}
            <div className="bg-base-200 border-b border-base-content/5 py-16 lg:py-24">
                <div className="container mx-auto px-4 text-center lg:text-left lg:flex items-end justify-between">
                    <div className="max-w-2xl">
                        <div className="flex items-center gap-2 justify-center lg:justify-start text-primary font-black uppercase tracking-widest text-[10px] mb-4">
                            <Info size={14} />
                            Governance Protocol
                        </div>
                        <h1 className="text-5xl lg:text-7xl font-black tracking-tighter mb-6">
                            Terms of <span className="text-primary italic">Service</span>
                        </h1>
                        <p className="text-lg opacity-60 font-medium leading-relaxed">
                            Please review the operational parameters of the EduNexus platform. 
                            By initializing your session, you agree to these deployment terms.
                        </p>
                    </div>
                    <div className="mt-8 lg:mt-0">
                        <div className="inline-block px-6 py-3 bg-base-100 border border-base-content/10 rounded-2xl shadow-sm text-sm font-bold">
                            <span className="opacity-40 uppercase mr-2">Version:</span> 
                            2026.02.09
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-20">
                <div className="flex flex-col lg:flex-row gap-20">
                    
                    {/* --- STICKY NAVIGATION --- */}
                    <aside className="lg:w-72 hidden lg:block">
                        <div className="sticky top-28">
                            <p className="text-[10px] font-black opacity-30 uppercase tracking-[0.2em] mb-6 px-4">Documentation Map</p>
                            <nav className="space-y-1">
                                {sections.map((sec) => (
                                    <a 
                                        key={sec.id} 
                                        href={`#${sec.id}`} 
                                        className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold opacity-60 hover:opacity-100 hover:bg-primary/5 hover:text-primary transition-all group"
                                    >
                                        <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                                            {sec.icon}
                                        </span>
                                        {sec.title}
                                    </a>
                                ))}
                            </nav>
                            
                            <div className="mt-12 p-6 bg-neutral rounded-3xl text-neutral-content">
                                <p className="text-xs font-bold mb-4 opacity-70 italic">Questions regarding legal status?</p>
                                <button className="btn btn-primary btn-sm btn-block rounded-xl gap-2">
                                    Legal Dept <ExternalLink size={12} />
                                </button>
                            </div>
                        </div>
                    </aside>

                    {/* --- MAIN CONTENT --- */}
                    <main className="flex-1 max-w-3xl">
                        <article className="prose prose-lg prose-headings:font-black prose-headings:italic prose-headings:tracking-tight prose-p:text-base-content/70 prose-strong:text-base-content">
                            
                            <section id="acceptance" className="scroll-mt-32 mb-20">
                                <h2 className="text-3xl mb-6">01. Acceptance of Terms</h2>
                                <p>
                                    EduNexus ("the Company," "we," or "us") provides a high-performance digital learning environment. By creating an account, you confirm that you are at least 18 years of age and possess the legal authority to enter into this agreement. Accessing the "Nexus" implies full consent to these system parameters.
                                </p>
                            </section>

                            <section id="accounts" className="scroll-mt-32 mb-20">
                                <h2 className="text-3xl mb-6">02. User Accounts & Security</h2>
                                <p>
                                    Your account is a single-tenant instance for personal use only. Credential sharing or "multi-plexing" an account across multiple users is a violation of our architecture. 
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-8 not-prose">
                                    <div className="p-4 rounded-2xl bg-base-200 border border-base-content/5 flex items-start gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-error/10 text-error flex items-center justify-center shrink-0">
                                            <ShieldAlert size={16} />
                                        </div>
                                        <div>
                                            <p className="text-xs font-black uppercase tracking-wider mb-1">Strict Prohibition</p>
                                            <p className="text-xs opacity-60 font-medium">Simultaneous logins from distinct geographic nodes.</p>
                                        </div>
                                    </div>
                                    <div className="p-4 rounded-2xl bg-base-200 border border-base-content/5 flex items-start gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                                            <Zap size={16} />
                                        </div>
                                        <div>
                                            <p className="text-xs font-black uppercase tracking-wider mb-1">Bot Detection</p>
                                            <p className="text-xs opacity-60 font-medium">Heuristic analysis is applied to prevent scraping.</p>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section id="content" className="scroll-mt-32 mb-20">
                                <h2 className="text-3xl mb-6">03. Intellectual Property</h2>
                                <p>
                                    All source code, video assets, and architectural diagrams are the exclusive property of EduNexus. You are granted a limited-time license to execute and modify provided code for <strong>educational purposes only</strong>.
                                </p>
                                <blockquote className="border-l-primary bg-primary/5 rounded-r-3xl p-8 italic font-medium">
                                    "Reverse engineering our proprietary Learning Management System (LMS) or bulk-downloading course assets will result in immediate 'Connection Termination' and potential legal escalation."
                                </blockquote>
                            </section>

                            <section id="billing" className="scroll-mt-32 mb-20">
                                <h2 className="text-3xl mb-6">04. Payments & Refund Logic</h2>
                                <p>
                                    Individual course purchases include a 14-day "Conditional Refund" window. If content consumption exceeds 20% of total modules, the refund protocol is automatically disabled to protect mentor intellectual property.
                                </p>
                                <ul className="list-none p-0 space-y-4">
                                    {[
                                        "Individual Courses: 14-day window.",
                                        "Subscription: Cancel anytime, active until period ends.",
                                        "Certifications: Non-refundable once issued."
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-center gap-3 text-sm font-bold opacity-70">
                                            <div className="w-1.5 h-1.5 rounded-full bg-secondary" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        </article>
                    </main>
                </div>
            </div>
        </div>
    );
}