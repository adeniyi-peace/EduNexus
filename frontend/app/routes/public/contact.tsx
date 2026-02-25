import { useState } from "react";
import { Form, useNavigation } from "react-router";
import { 
    MessageSquare, 
    Globe, 
    Github, 
    Linkedin, 
    Twitter, 
    ArrowRight,
    ShieldCheck
} from "lucide-react";

export default function ContactPage() {
    const navigation = useNavigation();
    const isSubmitting = navigation.state === "submitting";
    const [activeDept, setActiveDept] = useState("Support");

    const departments = [
        { name: "Support", desc: "Technical issues & platform help", icon: "🛠️" },
        { name: "Sales", desc: "Enterprise & Team licensing", icon: "💼" },
        { name: "Partners", desc: "Instructor & Content inquiries", icon: "🤝" }
    ];

    return (
        <div className="min-h-screen bg-base-100 overflow-x-hidden">
            {/* --- TOP DECORATIVE ELEMENT --- */}
            <div className="h-1.5 bg-linear-to-r from-primary via-secondary to-accent w-full" />

            <div className="container mx-auto px-4 py-20 lg:py-32">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-start">
                    
                    {/* --- LEFT COLUMN: INFO & TRUST --- */}
                    <div className="lg:col-span-5 space-y-16 animate-slide-up">
                        <div className="space-y-6">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.2em]">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                                </span>
                                Nexus Communication Hub
                            </div>
                            <h1 className="text-6xl lg:text-8xl font-black tracking-tighter leading-[0.9]">
                                Let's build <br />
                                <span className="bg-clip-text text-transparent bg-linear-to-r from-primary to-secondary italic">The Next</span> <br />
                                together.
                            </h1>
                            <p className="text-xl text-base-content/60 max-w-md leading-relaxed">
                                Whether you're debugging a node or scaling a team, our engineering squad is standing by.
                            </p>
                        </div>

                        {/* Department Selection */}
                        <div className="space-y-6">
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 flex items-center gap-2">
                                <MessageSquare size={14} className="text-primary" />
                                Routing Logic
                            </p>
                            <div className="grid grid-cols-1 gap-4">
                                {departments.map((dept) => (
                                    <button
                                        key={dept.name}
                                        type="button"
                                        onClick={() => setActiveDept(dept.name)}
                                        className={`group flex items-center gap-5 p-6 rounded-4xl border-2 transition-all duration-500 text-left ${
                                            activeDept === dept.name 
                                            ? "border-primary bg-primary/5 shadow-xl shadow-primary/5" 
                                            : "border-base-content/5 hover:border-base-content/20 bg-base-100"
                                        }`}
                                    >
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl transition-colors ${
                                            activeDept === dept.name ? "bg-primary text-white" : "bg-base-200 opacity-70"
                                        }`}>
                                            {dept.icon}
                                        </div>
                                        <div>
                                            <p className="font-black text-lg leading-none mb-1.5">{dept.name}</p>
                                            <p className="text-xs font-medium opacity-50">{dept.desc}</p>
                                        </div>
                                        <div className={`ml-auto w-2 h-2 rounded-full transition-all duration-500 ${
                                            activeDept === dept.name ? "bg-primary scale-150" : "bg-base-300"
                                        }`} />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Trust Footer */}
                        <div className="grid grid-cols-2 gap-10 pt-10 border-t border-base-content/5">
                            <div className="space-y-4">
                                <p className="text-[10px] font-black opacity-30 uppercase tracking-widest">Socials</p>
                                <div className="flex gap-5">
                                    <Twitter size={20} className="cursor-pointer hover:text-primary transition-colors" />
                                    <Linkedin size={20} className="cursor-pointer hover:text-primary transition-colors" />
                                    <Github size={20} className="cursor-pointer hover:text-primary transition-colors" />
                                </div>
                            </div>
                            <div className="space-y-4">
                                <p className="text-[10px] font-black opacity-30 uppercase tracking-widest">Nexus Core</p>
                                <div className="flex items-center gap-2">
                                    <Globe size={16} className="text-secondary" />
                                    <p className="text-sm font-bold tracking-tight">SF / Remote / Web3</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* --- RIGHT COLUMN: THE FORM --- */}
                    <div className="lg:col-span-7 animate-fade-in [animation-delay:200ms]">
                        <Form 
                            method="post" 
                            className="card bg-base-100 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] dark:shadow-[0_40px_100px_-20px_rgba(0,0,0,0.6)] border border-base-content/5 p-8 lg:p-16 rounded-[3.5rem] relative"
                        >
                            {/* Hidden state for the action handler */}
                            <input type="hidden" name="department" value={activeDept} />
                            
                            {/* Decorative background blur inside the card */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] -mr-20 -mt-20 pointer-events-none" />

                            <div className="relative z-10">
                                <h2 className="text-3xl font-black mb-10 tracking-tight">
                                    Direct Message <br />
                                    <span className="text-primary opacity-90 tracking-tighter">to {activeDept} Node</span>
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                    <div className="form-control group">
                                        <label className="label text-[10px] font-black uppercase tracking-[0.2em] opacity-40 px-2 group-focus-within:text-primary transition-colors">Identification</label>
                                        <input 
                                            name="name"
                                            type="text" 
                                            required
                                            className="input input-bordered h-16 rounded-2xl focus:outline-primary bg-base-200/50 border-none px-6 font-bold" 
                                            placeholder="Your Name" 
                                        />
                                    </div>
                                    <div className="form-control group">
                                        <label className="label text-[10px] font-black uppercase tracking-[0.2em] opacity-40 px-2 group-focus-within:text-primary transition-colors">Digital Mail</label>
                                        <input 
                                            name="email"
                                            type="email" 
                                            required
                                            className="input input-bordered h-16 rounded-2xl focus:outline-primary bg-base-200/50 border-none px-6 font-bold" 
                                            placeholder="email@nexus.com" 
                                        />
                                    </div>
                                </div>

                                <div className="form-control mb-10 group">
                                    <label className="label text-[10px] font-black uppercase tracking-[0.2em] opacity-40 px-2 group-focus-within:text-primary transition-colors">Payload / Message</label>
                                    <textarea 
                                        name="message"
                                        required
                                        className="textarea textarea-bordered min-h-48 rounded-2xl focus:outline-primary bg-base-200/50 border-none p-6 font-medium text-lg leading-relaxed" 
                                        placeholder="Describe your inquiry with technical detail..."
                                    ></textarea>
                                </div>

                                <button 
                                    type="submit" 
                                    disabled={isSubmitting}
                                    className="btn btn-primary btn-lg w-full h-20 rounded-3xl shadow-2xl shadow-primary/20 flex items-center justify-between px-10 group"
                                >
                                    {isSubmitting ? (
                                        <div className="flex items-center gap-3 mx-auto">
                                            <span className="loading loading-spinner"></span>
                                            <span className="uppercase tracking-[0.3em] font-black text-xs">Transmitting...</span>
                                        </div>
                                    ) : (
                                        <>
                                            <span className="font-black uppercase tracking-[0.2em] text-sm">Initialize Connection</span>
                                            <div className="bg-white/20 p-2 rounded-xl group-hover:translate-x-2 transition-transform">
                                                <ArrowRight size={20} />
                                            </div>
                                        </>
                                    )}
                                </button>

                                <div className="mt-8 flex items-center justify-center gap-2 opacity-30">
                                    <ShieldCheck size={14} />
                                    <p className="text-[10px] font-black uppercase tracking-widest">
                                        End-to-End Encrypted Tunnel
                                    </p>
                                </div>
                            </div>
                        </Form>
                    </div>
                </div>
            </div>
        </div>
    );
}