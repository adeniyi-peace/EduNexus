export default function PrivacyPolicy() {
    return (
        <div className="container mx-auto px-4 py-20">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-5xl font-black mb-6 italic text-secondary">Privacy Policy</h1>
                    <p className="text-xl opacity-60">Your data belongs to you. We just use it to power your learning.</p>
                </div>

                {/* --- QUICK DATA SUMMARY TABLE --- */}
                <div className="bg-base-200/50 rounded-4xl border border-base-content/5 p-8 mb-16">
                    <h3 className="text-lg font-bold mb-6">Privacy at a Glance</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div>
                            <p className="text-[10px] font-black opacity-30 uppercase mb-2">What we collect</p>
                            <p className="text-sm font-medium">Email, payment info, learning progress, and IP address for security.</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-black opacity-30 uppercase mb-2">How we use it</p>
                            <p className="text-sm font-medium">To personalize your curriculum and verify your certifications.</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-black opacity-30 uppercase mb-2">Third Parties</p>
                            <p className="text-sm font-medium">Stripe (Payments) and SheerID (Student Verification).</p>
                        </div>
                    </div>
                </div>

                <article className="prose prose-lg max-w-none prose-p:text-base-content/70">
                    <section className="mb-12">
                        <h2 className="font-black italic underline decoration-secondary">Information We Collect</h2>
                        <p>
                            As an engineering platform, we collect telemetry on your code submissions and quiz attempts to provide the "Nexus Score." This data is used solely to help mentors give you better feedback.
                        </p>
                    </section>

                    <section className="mb-12">
                        <h2 className="font-black italic underline decoration-secondary">The "Right to be Forgotten"</h2>
                        <p>
                            In accordance with GDPR and CCPA, you can request the full deletion of your Nexus account at any time. This includes your progress, certificates (which will be revoked on-chain), and personal identifiers.
                        </p>
                    </section>

                    <section className="mb-12">
                        <h2 className="font-black italic underline decoration-secondary">Cookies & Tracking</h2>
                        <p>
                            We use functional cookies to keep you logged in. We do not use third-party tracking pixels for advertising. Your learning journey is not being sold to advertisers.
                        </p>
                    </section>
                </article>

                {/* Contact Escalation */}
                <div className="mt-20 p-10 bg-neutral text-neutral-content rounded-[2.5rem] text-center">
                    <h3 className="text-2xl font-bold mb-4">Privacy Concerns?</h3>
                    <p className="opacity-70 mb-8">Email our Data Protection Officer at <strong>privacy@edunexus.com</strong></p>
                    <button className="btn btn-secondary rounded-xl px-10">Request Data Export</button>
                </div>
            </div>
        </div>
    );
}