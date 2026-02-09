import { useState, useEffect } from "react";
import { Form, Link, useNavigation } from "react-router";
import { z } from "zod";

// --- VALIDATION SCHEMA ---
const forgotPasswordSchema = z.object({
    email: z.string().email("Please enter a valid recovery address."),
});

export default function ForgotPassword() {
    const navigation = useNavigation();
    const isSubmitting = navigation.state !== "idle";

    const [email, setEmail] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [touched, setTouched] = useState(false);
    const [isSent, setIsSent] = useState(false);

    // --- LIVE VALIDATION ---
    useEffect(() => {
        if (touched) {
            const result = forgotPasswordSchema.safeParse({ email });
            if (!result.success) {
                setError(result.error.issues[0].message);
            } else {
                setError(null);
            }
        }
    }, [email, touched]);

    // Mock submission handler (In production, this would be handled by a Remix Action)
    const handleSubmit = (e: React.FormEvent) => {
        if (error || email === "") {
            e.preventDefault();
            setTouched(true);
            return;
        }
        // For demo purposes, we'll simulate a successful send
        // setIsSent(true); 
    };

    if (isSent) {
        return (
            <div className="animate-in fade-in zoom-in duration-500 text-center">
                <div className="w-20 h-20 bg-success/10 text-success rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">
                    📧
                </div>
                <h1 className="text-3xl font-black mb-4">Check your Node</h1>
                <p className="text-base-content/60 mb-8 leading-relaxed">
                    If an account exists for <span className="text-base-content font-bold">{email}</span>, 
                    you will receive a password reset link shortly.
                </p>
                <Link to="/login" className="btn btn-ghost font-black uppercase tracking-widest text-xs">
                    ← Back to Login
                </Link>
            </div>
        );
    }

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="mb-10 text-center lg:text-left">
                <Link to="/login" className="text-xs font-black text-primary uppercase tracking-widest hover:opacity-70 transition-opacity mb-4 inline-block">
                    ← Return to Login
                </Link>
                <h1 className="text-4xl font-black mb-2 tracking-tight uppercase italic">Recover Key</h1>
                <p className="text-base-content/60 leading-relaxed">
                    Lost your security credentials? Enter your registered email to receive a reset protocol.
                </p>
            </header>

            <Form method="post" onSubmit={handleSubmit} className="space-y-6">
                <div className="form-control">
                    <label className="label text-[10px] font-black opacity-50 uppercase tracking-widest">
                        Recovery Email
                    </label>
                    <input 
                        name="email"
                        type="email" 
                        className={`input bg-base-200/50 border-none rounded-2xl h-16 focus:outline-primary transition-all text-lg ${error ? 'ring-2 ring-error/50' : ''}`}
                        placeholder="engineer@nexus.io"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onBlur={() => setTouched(true)}
                        required
                    />
                    {error && (
                        <span className="text-[10px] text-error mt-2 font-bold px-1 animate-in fade-in slide-in-from-top-1">
                            {error}
                        </span>
                    )}
                </div>

                <div className="bg-primary/5 rounded-2xl p-4 border border-primary/10">
                    <p className="text-[11px] opacity-70 leading-relaxed">
                        <span className="font-black text-primary uppercase mr-1">Security Note:</span> 
                        For your protection, reset links expire after 60 minutes. If you don't see the email, check your spam folder or "Promotions" tab.
                    </p>
                </div>

                <button 
                    type="submit" 
                    disabled={isSubmitting || (touched && !!error)}
                    className="btn btn-primary btn-block h-16 rounded-2xl shadow-xl shadow-primary/20 text-lg font-black uppercase italic"
                >
                    {isSubmitting ? (
                        <span className="loading loading-spinner"></span>
                    ) : (
                        "Send Reset Protocol"
                    )}
                </button>
            </Form>

            <footer className="mt-12 pt-8 border-t border-base-content/5 text-center">
                <p className="text-xs opacity-50 font-medium">
                    Still having trouble? <Link to="/support" className="text-primary font-black hover:underline">Contact System Support</Link>
                </p>
            </footer>
        </div>
    );
}