import { useState } from "react";
import { 
    Search, 
    CreditCard, 
    Cpu, 
    GraduationCap, 
    LifeBuoy, 
    MessageSquare, 
    Mail, 
    ChevronRight,
    Terminal
} from "lucide-react";
import { SectionHeader } from "~/components/ui/SectionHeader";

export default function SupportPage() {
    const [searchQuery, setSearchQuery] = useState("");

    const categories = [
        { title: "Account & Billing", icon: <CreditCard size={28} />, count: 12, color: "text-blue-500" },
        { title: "Platform Features", icon: <Cpu size={28} />, count: 8, color: "text-purple-500" },
        { title: "Certifications", icon: <GraduationCap size={28} />, count: 5, color: "text-emerald-500" },
        { title: "Technical Support", icon: <LifeBuoy size={28} />, count: 15, color: "text-amber-500" },
    ];

    const faqs = [
        { 
            q: "Is there a student discount?", 
            a: "Yes! Students with a valid .edu email get 50% off Architect plans. Verification is handled through our partnership with SheerID during checkout.",
            cat: "Account & Billing"
        },
        { 
            q: "Can I cancel my subscription anytime?", 
            a: "Absolutely. No contracts, no hidden fees. You can cancel with one click from your billing dashboard. You will retain access until the end of your current period.",
            cat: "Account & Billing"
        },
        { 
            q: "How do the certificates work?", 
            a: "EduNexus certificates are permanent and stored on-chain for verification. You can add them to your LinkedIn profile with a single click.",
            cat: "Certifications"
        },
        { 
            q: "What is the 'Nexus Methodology'?", 
            a: "It is our proprietary project-based learning flow that mimics real-world senior engineering cycles, including PR reviews and CI/CD simulations.",
            cat: "Platform Features"
        }
    ];

    const filteredFaqs = faqs.filter(f => 
        f.q.toLowerCase().includes(searchQuery.toLowerCase()) || 
        f.cat.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="pb-24 bg-base-100">
            {/* --- HERO SEARCH SECTION --- */}
            <section className="bg-neutral py-24 lg:py-40 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[120px] -mr-48 -mt-48" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/5 rounded-full blur-[100px] -ml-32 -mb-32" />
                
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/60 text-[10px] font-black uppercase tracking-[0.3em] mb-8">
                        <Terminal size={12} className="text-primary" />
                        System Support Protocol
                    </div>
                    <h1 className="text-5xl lg:text-7xl font-black text-white mb-8 tracking-tighter">
                        How can we <span className="text-primary italic">help?</span>
                    </h1>
                    
                    <div className="max-w-2xl mx-auto relative group">
                        <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none opacity-40 group-focus-within:opacity-100 transition-opacity">
                            <Search size={20} className="text-white" />
                        </div>
                        <input 
                            type="text" 
                            placeholder="Query keywords, error codes, or topics..." 
                            className="input input-lg h-20 w-full rounded-2xl bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:bg-white focus:text-neutral transition-all pl-16 pr-20 shadow-2xl"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <div className="absolute inset-y-0 right-6 flex items-center pointer-events-none">
                            <kbd className="kbd kbd-sm bg-white/10 border-none text-white/40">⌘K</kbd>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- CATEGORY GRID --- */}
            <section className="container mx-auto px-4 -mt-16 relative z-20">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {categories.map((cat) => (
                        <div key={cat.title} className="group card bg-base-100 shadow-2xl border border-base-content/5 hover:border-primary/40 transition-all cursor-pointer overflow-hidden">
                            <div className="card-body p-8 relative">
                                <div className={`mb-6 transition-transform group-hover:scale-110 duration-500 ${cat.color}`}>
                                    {cat.icon}
                                </div>
                                <h3 className="font-black text-xl tracking-tight">{cat.title}</h3>
                                <div className="flex items-center justify-between mt-4">
                                    <p className="text-[10px] opacity-40 font-black uppercase tracking-widest">{cat.count} Docs</p>
                                    <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-primary" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* --- FAQ SECTION --- */}
            <section className="container mx-auto px-4 py-32 max-w-4xl">
                <div className="mb-16">
                    <SectionHeader 
                        title="Common Inquiries" 
                        subtitle="Operational details and platform logistics." 
                        centered
                    />
                </div>
                
                <div className="space-y-4">
                    {filteredFaqs.length > 0 ? (
                        filteredFaqs.map((faq, i) => (
                            <div key={i} className="collapse collapse-plus bg-base-200/30 border border-base-content/5 rounded-4xl hover:border-primary/20 transition-all">
                                <input type="checkbox" /> 
                                <div className="collapse-title text-lg font-bold p-8">
                                    <div className="flex flex-col gap-2">
                                        <span className="text-[10px] uppercase tracking-widest text-primary font-black opacity-60">{faq.cat}</span>
                                        {faq.q}
                                    </div>
                                </div>
                                <div className="collapse-content px-8 pb-8"> 
                                    <div className="pt-4 border-t border-base-content/5">
                                        <p className="text-base-content/70 leading-relaxed font-medium italic">
                                            "{faq.a}"
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-20 bg-base-200/50 rounded-[3rem] border border-dashed border-base-content/10">
                            <Search size={48} className="mx-auto mb-4 opacity-10" />
                            <p className="text-xl font-bold opacity-30 italic">No documentation found for "{searchQuery}"</p>
                        </div>
                    )}
                </div>
            </section>

            {/* --- ESCALATION SECTION --- */}
            <section className="container mx-auto px-4">
                <div className="bg-neutral rounded-[3.5rem] p-12 lg:p-24 flex flex-col lg:flex-row items-center justify-between gap-12 relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
                    
                    <div className="max-w-xl text-center lg:text-left relative z-10">
                        <h2 className="text-4xl lg:text-5xl font-black text-white mb-6 tracking-tighter italic">Still stuck in the <span className="text-primary">void?</span></h2>
                        <p className="text-white/60 text-lg font-medium leading-relaxed">
                            Our Level 3 Support Engineers are standing by to resolve high-priority technical blockers and billing anomalies.
                        </p>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto relative z-10">
                        <button className="btn btn-primary btn-lg h-20 px-12 rounded-2xl shadow-2xl shadow-primary/30 gap-3 group">
                            <MessageSquare size={20} />
                            <span className="font-black uppercase tracking-widest text-xs">Initialize Chat</span>
                        </button>
                        <button className="btn btn-outline btn-lg h-20 px-12 rounded-2xl border-white/20 text-white hover:bg-white hover:text-neutral gap-3">
                            <Mail size={20} />
                            <span className="font-black uppercase tracking-widest text-xs">Open Ticket</span>
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}