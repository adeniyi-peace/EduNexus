import { useState } from "react";
import { SectionHeader } from "~/components/ui/SectionHeader";

export default function SupportPage() {
    const [searchQuery, setSearchQuery] = useState("");

    const categories = [
        { title: "Account & Billing", icon: "💳", count: 12 },
        { title: "Platform Features", icon: "🛠️", count: 8 },
        { title: "Certifications", icon: "🎓", count: 5 },
        { title: "Technical Support", icon: "💻", count: 15 },
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
        <div className="pb-24">
            {/* --- HERO SEARCH SECTION --- */}
            <section className="bg-neutral py-20 lg:py-32 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -mr-32 -mt-32" />
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <h1 className="text-4xl lg:text-6xl font-black text-white mb-6">
                        How can we <span className="text-secondary">help?</span>
                    </h1>
                    <div className="max-w-2xl mx-auto relative mt-10">
                        <input 
                            type="text" 
                            placeholder="Search for articles, topics, or keywords..." 
                            className="input input-lg w-full rounded-2xl bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:bg-white focus:text-neutral transition-all pl-14"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <span className="absolute left-5 top-1/2 -translate-y-1/2 text-2xl opacity-40">🔍</span>
                    </div>
                </div>
            </section>

            {/* --- CATEGORY GRID --- */}
            <section className="container mx-auto px-4 -mt-12 relative z-20">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {categories.map((cat) => (
                        <div key={cat.title} className="card bg-base-100 shadow-xl border border-base-content/5 hover:border-primary/30 transition-all cursor-pointer group">
                            <div className="card-body items-center text-center p-8">
                                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{cat.icon}</div>
                                <h3 className="font-bold text-lg">{cat.title}</h3>
                                <p className="text-xs opacity-50 font-black uppercase tracking-widest mt-2">{cat.count} Articles</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* --- FAQ SECTION --- */}
            <section className="container mx-auto px-4 py-24 max-w-4xl">
                <SectionHeader 
                    title="Frequently Asked Questions" 
                    subtitle="Quick answers to the most common queries." 
                    centered
                />
                
                <div className="mt-12 space-y-4">
                    {filteredFaqs.length > 0 ? (
                        filteredFaqs.map((faq, i) => (
                            <div key={i} className="collapse collapse-plus bg-base-200/50 border border-base-content/5 rounded-3xl overflow-hidden hover:bg-base-200 transition-colors">
                                <input type="checkbox" /> 
                                <div className="collapse-title text-xl font-bold p-6">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[10px] uppercase tracking-tighter text-primary font-black">{faq.cat}</span>
                                        {faq.q}
                                    </div>
                                </div>
                                <div className="collapse-content px-6 pb-6"> 
                                    <p className="text-lg text-base-content/70 leading-relaxed italic border-l-2 border-primary/20 pl-4">
                                        {faq.a}
                                    </p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-12 opacity-50 italic">
                            No results found for "{searchQuery}"
                        </div>
                    )}
                </div>
            </section>

            {/* --- ESCALATION SECTION --- */}
            <section className="container mx-auto px-4">
                <div className="bg-base-200 rounded-[3rem] p-12 lg:p-20 flex flex-col lg:flex-row items-center justify-between gap-10">
                    <div className="max-w-md text-center lg:text-left">
                        <h2 className="text-3xl lg:text-4xl font-black mb-4">Still need assistance?</h2>
                        <p className="text-base-content/60 text-lg">
                            Our support engineers are available 24/7 to help you resolve technical or billing issues.
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                        <button className="btn btn-primary btn-lg px-10 shadow-xl shadow-primary/20">
                            Chat with Support
                        </button>
                        <button className="btn btn-outline btn-lg px-10">
                            Email Ticket
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}