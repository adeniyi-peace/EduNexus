import { SectionHeader } from "~/components/ui/SectionHeader";

export default function PricingPage() {
    const plans = [
        {
            name: "Seeker",
            price: "Free",
            desc: "Start your journey into the Nexus.",
            features: ["Access to free courses", "Community forum", "Basic certificates"],
            cta: "Get Started",
            popular: false
        },
        {
            name: "Architect",
            price: "$29",
            period: "/mo",
            desc: "The sweet spot for career changers.",
            features: ["Unlimited course access", "1-on-1 mentor sessions", "Priority support", "Project reviews"],
            cta: "Go Pro",
            popular: true
        },
        {
            name: "Enterprise",
            price: "Custom",
            desc: "Bulk learning for high-performing teams.",
            features: ["Team analytics", "Private cohort", "LMS Integration", "Custom curriculum"],
            cta: "Contact Sales",
            popular: false
        }
    ];

    return (
        <div className="container mx-auto px-4 py-20">
            <SectionHeader 
                title="Investment in Future" 
                subtitle="Choose the path that fits your current goals and future ambitions."
                centered
            />

            

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
                {plans.map((plan) => (
                    <div key={plan.name} className={`card bg-base-100 border-2 transition-all duration-300 ${plan.popular ? "border-primary shadow-2xl scale-105" : "border-base-content/5 shadow-lg"}`}>
                        {plan.popular && (
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 badge badge-primary font-bold px-6 py-4">
                                Most Popular
                            </div>
                        )}
                        <div className="card-body p-8">
                            <h3 className="text-2xl font-black">{plan.name}</h3>
                            <div className="flex items-baseline gap-1 my-6">
                                <span className="text-5xl font-black">{plan.price}</span>
                                <span className="text-xl opacity-50">{plan.period}</span>
                            </div>
                            <p className="text-base-content/60 mb-8">{plan.desc}</p>
                            
                            <ul className="space-y-4 mb-10 grow">
                                {plan.features.map((f) => (
                                    <li key={f} className="flex items-center gap-3 text-sm font-medium">
                                        <span className="text-primary text-lg">✓</span> {f}
                                    </li>
                                ))}
                            </ul>

                            <button className={`btn btn-lg w-full ${plan.popular ? "btn-primary shadow-lg shadow-primary/20" : "btn-outline"}`}>
                                {plan.cta}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}