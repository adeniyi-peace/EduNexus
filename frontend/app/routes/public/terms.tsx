import { SectionHeader } from "~/components/ui/SectionHeader";

export default function TermsOfService() {
    const sections = [
        { id: "acceptance", title: "1. Acceptance of Terms" },
        { id: "accounts", title: "2. User Accounts & Security" },
        { id: "content", title: "3. Intellectual Property" },
        { id: "conduct", title: "4. User Conduct" },
        { id: "billing", title: "5. Payments & Refunds" },
    ];

    return (
        <div className="container mx-auto px-4 py-20">
            <div className="flex flex-col lg:flex-row gap-16">
                {/* --- STICKY NAVIGATION --- */}
                <aside className="lg:w-64 hidden lg:block">
                    <div className="sticky top-28 space-y-4">
                        <p className="text-[10px] font-black opacity-30 uppercase tracking-widest px-4">Sections</p>
                        <nav className="flex flex-col">
                            {sections.map((sec) => (
                                <a 
                                    key={sec.id} 
                                    href={`#${sec.id}`} 
                                    className="px-4 py-2 rounded-xl text-sm font-medium hover:bg-base-200 transition-colors"
                                >
                                    {sec.title}
                                </a>
                            ))}
                        </nav>
                    </div>
                </aside>

                {/* --- CONTENT --- */}
                <main className="flex-1 max-w-3xl">
                    <div className="mb-12">
                        <div className="badge badge-outline mb-4">Effective: Feb 09, 2026</div>
                        <h1 className="text-5xl font-black mb-6">Terms of <span className="text-primary">Service</span></h1>
                        <p className="text-lg opacity-60">
                            Please read these terms carefully before accessing the Nexus. By using our platform, you agree to be bound by these conditions.
                        </p>
                    </div>

                    <article className="prose prose-lg prose-headings:font-black prose-headings:italic prose-p:text-base-content/70">
                        <section id="acceptance" className="scroll-mt-28 mb-12">
                            <h2>1. Acceptance of Terms</h2>
                            <p>
                                EduNexus ("the Company," "we," or "us") provides a digital learning platform. By creating an account or accessing our content, you confirm that you are at least 18 years of age and possess the legal authority to enter into this agreement.
                            </p>
                        </section>

                        <section id="accounts" className="scroll-mt-28 mb-12">
                            <h2>2. User Accounts & Security</h2>
                            <p>
                                Your account is for your personal use only. Sharing credentials with "study groups" or third parties is a violation of our architecture. We reserve the right to terminate accounts that exhibit bot-like behavior or simultaneous logins from multiple geographic nodes.
                            </p>
                        </section>

                        <section id="content" className="scroll-mt-28 mb-12">
                            <h2>3. Intellectual Property</h2>
                            <p>
                                All source code, video lectures, and architectural diagrams provided in courses are the exclusive property of EduNexus and its Mentors. You are granted a non-exclusive, non-transferable license to view and execute code for educational purposes.
                            </p>
                            <div className="bg-primary/5 border-l-4 border-primary p-6 rounded-r-2xl my-6 italic">
                                "Reverse engineering our proprietary LMS or scraping course videos is strictly prohibited and will result in immediate legal action."
                            </div>
                        </section>

                        <section id="billing" className="scroll-mt-28 mb-12">
                            <h2>5. Payments & Refunds</h2>
                            <p>
                                We offer a 14-day "No Questions Asked" refund policy for individual course purchases, provided that less than 20% of the content has been consumed. Subscription plans are billed monthly and can be cancelled at any time.
                            </p>
                        </section>
                    </article>
                </main>
            </div>
        </div>
    );
}