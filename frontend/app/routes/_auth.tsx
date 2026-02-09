import { Outlet, Link } from "react-router";

export default function AuthLayout() {
    return (
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-base-100">
            {/* --- LEFT SIDE: BRANDING & SOCIAL PROOF --- */}
            <div className="hidden lg:flex flex-col justify-between p-12 bg-neutral text-neutral-content relative overflow-hidden">
                {/* Decorative background pattern */}
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#3B35B8_1px,transparent_1px)] bg-size-[40px_40px]" />
                </div>

                <Link to="/" className="flex items-center gap-2 relative z-10 group">
                    <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-primary-content font-bold text-xl group-hover:rotate-12 transition-transform shadow-lg shadow-primary/20">
                        N
                    </div>
                    <span className="text-2xl font-black tracking-tight text-white">EduNexus</span>
                </Link>

                <div className="relative z-10">
                    <h2 className="text-5xl font-black leading-tight mb-6">
                        Architect your <br />
                        <span className="text-primary italic">future</span> with us.
                    </h2>
                    <p className="text-xl opacity-70 max-w-md">
                        Join 50,000+ engineers mastering the art of production-scale systems.
                    </p>
                </div>

                <div className="relative z-10 p-6 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-sm">
                    <p className="italic opacity-90 mb-4">
                        "The most structured path to Senior Engineer I've ever found. The project feedback loops are a game changer."
                    </p>
                    <div className="flex items-center gap-3">
                        <div className="avatar placeholder">
                            <div className="bg-primary text-primary-content rounded-full w-10">
                                <span>JD</span>
                            </div>
                        </div>
                        <div>
                            <p className="font-bold text-sm">Jordan Dax</p>
                            <p className="text-xs opacity-50">Lead Dev at TechFlow</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- RIGHT SIDE: FORM OUTLET --- */}
            <main className="flex items-center justify-center p-6 lg:p-12 relative">
                {/* Mobile Logo Only */}
                <div className="lg:hidden absolute top-8 left-8">
                    <Link to="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-content font-bold text-lg">N</div>
                        <span className="font-black">EduNexus</span>
                    </Link>
                </div>
                
                <div className="w-full max-w-md">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}