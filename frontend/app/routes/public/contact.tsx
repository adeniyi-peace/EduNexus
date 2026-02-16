import { useState } from "react";
import { Form, useNavigation } from "react-router";

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
        <div className="min-h-screen bg-base-100">
            {/* --- TOP DECORATIVE ELEMENT --- */}
            <div className="h-2 bg-linear-to-r from-primary via-secondary to-accent w-full" />

            <div className="container mx-auto px-4 py-16 lg:py-24">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
                    
                    {/* --- LEFT COLUMN: INFO & TRUST --- */}
                    <div className="lg:col-span-5 space-y-12">
                        <div>
                            <div className="badge badge-outline border-primary text-primary font-black mb-4 px-4 py-3">
                                CONTACT US
                            </div>
                            <h1 className="text-5xl lg:text-7xl font-black tracking-tighter leading-tight">
                                Let's build the <br />
                                <span className="text-primary italic">Next</span> together.
                            </h1>
                            <p className="text-xl text-base-content/60 mt-6 leading-relaxed">
                                Whether you're a student facing a bug or a CTO looking to upskill your team, our engineers are ready to assist.
                            </p>
                        </div>

                        {/* Department Selection (Visual Only/Radio) */}
                        <div className="space-y-4">
                            <p className="text-xs font-black uppercase tracking-[0.2em] opacity-40">Choose Department</p>
                            <div className="grid grid-cols-1 gap-3">
                                {departments.map((dept) => (
                                    <button
                                        key={dept.name}
                                        onClick={() => setActiveDept(dept.name)}
                                        className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left ${
                                            activeDept === dept.name 
                                            ? "border-primary bg-primary/5" 
                                            : "border-base-content/5 hover:border-base-content/20 bg-base-100"
                                        }`}
                                    >
                                        <span className="text-2xl">{dept.icon}</span>
                                        <div>
                                            <p className="font-bold leading-none mb-1">{dept.name}</p>
                                            <p className="text-xs opacity-50">{dept.desc}</p>
                                        </div>
                                        {activeDept === dept.name && <span className="ml-auto text-primary">●</span>}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Social/Location Quick Links */}
                        <div className="flex flex-wrap gap-8 pt-6 border-t border-base-content/5">
                            <div>
                                <p className="text-[10px] font-black opacity-30 uppercase mb-2">Social</p>
                                <div className="flex gap-4">
                                    <span className="cursor-pointer hover:text-primary transition-colors">Twitter</span>
                                    <span className="cursor-pointer hover:text-primary transition-colors">LinkedIn</span>
                                    <span className="cursor-pointer hover:text-primary transition-colors">GitHub</span>
                                </div>
                            </div>
                            <div>
                                <p className="text-[10px] font-black opacity-30 uppercase mb-2">Location</p>
                                <p className="text-sm font-bold italic">Tech District, SF / Global Remote</p>
                            </div>
                        </div>
                    </div>

                    {/* --- RIGHT COLUMN: THE FORM --- */}
                    <div className="lg:col-span-7">
                        <Form 
                            method="post" 
                            className="card bg-base-100 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border border-base-content/5 p-8 lg:p-12 rounded-[3rem] relative overflow-hidden"
                        >
                            {/* Decorative Blur */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-full blur-3xl -mr-16 -mt-16" />
                            
                            <h2 className="text-2xl font-black mb-8">Send a Message to <span className="text-primary">{activeDept}</span></h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div className="form-control">
                                    <label className="label text-xs font-black uppercase opacity-50">Full Name</label>
                                    <input 
                                        name="name"
                                        type="text" 
                                        required
                                        className="input input-bordered h-14 rounded-xl focus:outline-primary bg-base-200/50 border-none" 
                                        placeholder="Aris Thorne" 
                                    />
                                </div>
                                <div className="form-control">
                                    <label className="label text-xs font-black uppercase opacity-50">Email Address</label>
                                    <input 
                                        name="email"
                                        type="email" 
                                        required
                                        className="input input-bordered h-14 rounded-xl focus:outline-primary bg-base-200/50 border-none" 
                                        placeholder="aris@nexus.com" 
                                    />
                                </div>
                            </div>

                            <div className="form-control mb-8">
                                <label className="label text-xs font-black uppercase opacity-50">Tell us about your project or issue</label>
                                <textarea 
                                    name="message"
                                    required
                                    className="textarea textarea-bordered h-40 rounded-xl focus:outline-primary bg-base-200/50 border-none py-4" 
                                    placeholder="I'm interested in the Enterprise plan for my team of 50..."
                                ></textarea>
                            </div>

                            <button 
                                type="submit" 
                                disabled={isSubmitting}
                                className="btn btn-primary btn-lg w-full rounded-2xl shadow-xl shadow-primary/20 flex items-center gap-3"
                            >
                                {isSubmitting ? (
                                    <span className="loading loading-spinner"></span>
                                ) : (
                                    <>
                                        <span>Initialize Connection</span>
                                        <span className="text-xl">→</span>
                                    </>
                                )}
                            </button>

                            <p className="text-center text-[10px] opacity-30 mt-6 uppercase tracking-widest">
                                Secure end-to-end encrypted submission
                            </p>
                        </Form>
                    </div>
                </div>
            </div>
        </div>
    );
}