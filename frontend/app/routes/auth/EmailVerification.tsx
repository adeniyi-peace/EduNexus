import { useState } from "react";
import { Link } from "react-router";
import { useUserContext } from "~/hooks/useUserContext";
import { Mail, ArrowRight, Zap, CheckCircle2 } from "lucide-react";

export default function ResendActivation() {
    const { resendActivation, isLoading, error, clearError } = useUserContext();
    const [email, setEmail] = useState("");
    const [isSent, setIsSent] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        const result = await resendActivation(email);
        if (result.success) {
            setIsSent(true);
        }
    };

    if (isSent) {
        return (
            <div className="animate-in fade-in zoom-in duration-500 text-center py-10">
                <div className="w-24 h-24 bg-success/10 text-success rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
                    <CheckCircle2 size={40} />
                </div>
                <h1 className="text-3xl font-black mb-4 uppercase italic">Transmission Resent</h1>
                <p className="text-base-content/60 mb-8 max-w-sm mx-auto leading-relaxed">
                    If that email is in our architecture, a new activation link has been dispatched to <span className="text-primary font-bold">{email}</span>.
                </p>
                <div className="space-y-4">
                    <Link to="/login" className="btn btn-primary btn-block rounded-2xl h-16 font-black uppercase italic">
                        Back to Login
                    </Link>
                    <button 
                        onClick={() => setIsSent(false)} 
                        className="text-xs font-black opacity-40 hover:opacity-100 uppercase tracking-widest mt-4"
                    >
                        Try another email
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="mb-10 text-center lg:text-left">
                <div className="flex items-center gap-2 text-primary mb-2 justify-center lg:justify-start">
                    <Zap size={18} fill="currentColor" />
                    <span className="text-[10px] font-black uppercase tracking-[0.4em]">Account Recovery</span>
                </div>
                <h1 className="text-4xl font-black mb-2 tracking-tight uppercase italic text-primary">Resync Account</h1>
                <p className="text-base-content/60">Need a new activation link? Provide your network email below.</p>
            </header>

            {error && (
                <div className="mb-6 p-4 bg-error/10 border border-error/20 rounded-2xl animate-in fade-in slide-in-from-top-2">
                    <p className="text-error text-sm font-bold">{error}</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="form-control">
                    <label className="flex items-center gap-2 px-1 mb-2">
                        <Mail size={12} className="opacity-40" />
                        <span className="text-[10px] font-black opacity-40 uppercase tracking-widest text-primary">Network Email</span>
                    </label>
                    <input 
                        type="email" 
                        className="input bg-base-200/50 border-none rounded-2xl h-16 focus:outline-primary transition-all w-full"
                        placeholder="aris@nexus.io"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <button 
                    type="submit" 
                    disabled={isLoading || !email}
                    className="btn btn-primary btn-block h-16 rounded-2xl shadow-xl shadow-primary/20 text-lg font-black uppercase italic group"
                >
                    {isLoading ? (
                        <span className="loading loading-spinner"></span>
                    ) : (
                        <div className="flex items-center gap-2">
                            Request Resync
                            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </div>
                    )}
                </button>
            </form>

            <footer className="mt-10 text-center">
                <p className="text-sm opacity-60">
                    Already active?{" "}
                    <Link to="/login" className="text-primary font-black hover:underline underline-offset-4 tracking-tighter uppercase italic">
                        Access Grid
                    </Link>
                </p>
            </footer>
        </div>
    );
}
