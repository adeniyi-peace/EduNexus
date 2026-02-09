import { Link } from "react-router";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-base-200 py-20 lg:py-32">
        {/* Decorative Nexus Background Blobs */}
        <div className="absolute top-0 -left-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 -right-20 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 relative z-10 flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2 text-center lg:text-left">
                <h1 className="text-5xl lg:text-7xl font-black leading-tight mb-6">
                Master the <span className="text-primary italic">Nexus</span> of Knowledge.
                </h1>
                <p className="text-xl text-base-content/70 mb-8 max-w-xl">
                Join 50,000+ students on the most interactive E-learning platform built for the next generation of creators and engineers.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link to="/courses" className="btn btn-primary btn-lg px-8 shadow-xl shadow-primary/20">Explore Catalog</Link>
                <Link to="/register" className="btn btn-outline btn-lg px-8">Become an Instructor</Link>
                </div>
            </div>
            
            <div className="lg:w-1/2 relative">
                <div className="rounded-3xl overflow-hidden shadow-2xl border-8 border-base-100 transform lg:rotate-3 hover:rotate-0 transition-transform duration-700">
                    <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80" alt="Students collaborating" />
                </div>
                {/* Floating Badge */}
                <div className="absolute -bottom-6 -left-6 bg-accent text-white p-6 rounded-2xl shadow-2xl hidden md:block">
                <p className="text-4xl font-black">4.9/5</p>
                <p className="text-sm font-medium opacity-90">Student Satisfaction</p>
                </div>
            </div>
        </div>
    </section>
  );
}