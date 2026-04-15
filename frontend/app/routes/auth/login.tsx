import { useState, useEffect } from "react";
import { Form, Link, useNavigate } from "react-router";
import { z } from "zod";
import { useUserContext } from "~/hooks/useUserContext";
import { useSocialAuth } from "~/hooks/useSocialAuth";

export const meta = () => {
  return [
    { title: "Login | EduNexus" },
    { name: "description", content: "Login Page" },
  ];
};

// --- LOGIN SCHEMA ---
const loginSchema = z.object({
    email: z.string().email("Please enter a valid network address."),
    password: z.string().min(1, "Password is required to authenticate."),
});

export default function Login() {
    const { login, isLoading, error, clearError } = useUserContext();
    const { loginWithGoogle, loginWithApple } = useSocialAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({ email: "", password: "" });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [showPassword, setShowPassword] = useState(false);
    const [touched, setTouched] = useState<Record<string, boolean>>({});

    // --- LIVE VALIDATION ---
    useEffect(() => {
        const result = loginSchema.safeParse(formData);
        if (!result.success) {
            const formattedErrors: Record<string, string> = {};
            result.error.issues.forEach((issue) => {
                const path = issue.path[0] as string;
                if (touched[path]) {
                    formattedErrors[path] = issue.message;
                }
            });
            setErrors(formattedErrors);
        } else {
            setErrors({});
        }
    }, [formData, touched]);

    // Clear store error when component mounts
    useEffect(() => {
        clearError();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        setTouched(prev => ({ ...prev, [e.target.name]: true }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Validate before submission
        const result = loginSchema.safeParse(formData);
        if (!result.success) {
            setTouched({ email: true, password: true });
            return;
        }

        try {
            await login(formData.email, formData.password);
            // Redirect is handled inside the store
        } catch {
            // Error is set in the store
        }
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="mb-10 text-center lg:text-left">
                <h1 className="text-4xl font-black mb-2 tracking-tight uppercase italic text-primary">Resume Access</h1>
                <p className="text-base-content/60">Re-establishing connection to the EduNexus grid.</p>
            </header>

            {/* Server Error Display */}
            {error && (
                <div className="mb-6 p-4 bg-error/10 border border-error/20 rounded-2xl animate-in fade-in slide-in-from-top-2 duration-300">
                    <p className="text-error text-sm font-bold">{error}</p>
                    {error.toLowerCase().includes("inactive") && (
                        <Link 
                            to="/email-verification" 
                            className="text-[10px] font-black uppercase text-primary mt-2 block hover:underline"
                        >
                            Resend activation link?
                        </Link>
                    )}
                </div>
            )}

            {/* --- SOCIAL AUTH --- */}
            <div className="grid grid-cols-2 gap-4 mb-8">
                <button type="button" onClick={() => loginWithGoogle()} disabled={isLoading} className="btn bg-base-200 border-none hover:bg-base-300 rounded-2xl h-14 normal-case font-bold group">
                    <img src="https://www.svgrepo.com/show/355037/google.svg" className="w-5 h-5 group-hover:scale-110 transition-transform" alt="G" />
                    Google
                </button>
                <button type="button" onClick={loginWithApple} disabled={isLoading} className="btn bg-base-200 border-none hover:bg-base-300 rounded-2xl h-14 normal-case font-bold group">
                    <img src="https://www.svgrepo.com/show/511330/apple-173.svg" className="w-5 h-5 dark:invert group-hover:scale-110 transition-transform" alt="A" />
                    Apple
                </button>
            </div>

            <div className="divider text-[10px] font-black opacity-30 uppercase tracking-[0.2em] mb-8">Identity Verification</div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email Field */}
                <div className="form-control">
                    <label className="label w-full text-[10px] font-black opacity-50 uppercase">Network Email</label>
                    <input 
                        name="email"
                        type="email" 
                        className={`input bg-base-200/50 border-none rounded-2xl h-14 focus:outline-primary transition-all ${errors.email ? 'ring-2 ring-error/50' : ''}`}
                        placeholder="aris@nexus.io"
                        value={formData.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        autoComplete="email"
                    />
                    {errors.email && <span className="text-[10px] text-error mt-2 font-bold px-1">{errors.email}</span>}
                </div>

                {/* Password Field */}
                <div className="form-control">
                    <div className="flex justify-between items-center pr-1">
                        <label className="label text-[10px] font-black opacity-50 uppercase">Security Key</label>
                        <Link 
                            to="/forgot-password" 
                            className="text-[10px] font-black text-primary uppercase hover:underline"
                        >
                            Reset Key?
                        </Link>
                    </div>
                    <div className="relative">
                        <input 
                            name="password"
                            type={showPassword ? "text" : "password"} 
                            className={`input w-full bg-base-200/50 border-none rounded-2xl h-14 focus:outline-primary pr-12 transition-all ${errors.password ? 'ring-2 ring-error/50' : ''}`}
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            autoComplete="current-password"
                        />
                        <button 
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 opacity-30 hover:opacity-100 transition-opacity"
                        >
                            {showPassword ? "🔒" : "👁️"}
                        </button>
                    </div>
                    {errors.password && <span className="text-[10px] text-error mt-2 font-bold px-1">{errors.password}</span>}
                </div>

                {/* Remember Me Toggle */}
                <div className="flex items-center gap-3 py-2">
                    <input 
                        type="checkbox" 
                        name="remember"
                        className="checkbox checkbox-primary checkbox-sm rounded-md" 
                    />
                    <span className="text-xs font-bold opacity-60">Maintain session persistence</span>
                </div>

                <button 
                    type="submit" 
                    disabled={isLoading || Object.keys(errors).length > 0}
                    className="btn btn-primary btn-block h-16 rounded-2xl shadow-xl shadow-primary/20 text-lg font-black mt-4 uppercase italic"
                >
                    {isLoading ? <span className="loading loading-spinner"></span> : "Unlock Dashboard"}
                </button>
            </form>

            <footer className="mt-10 text-center">
                <p className="text-sm opacity-60">
                    New to the architecture?{" "}
                    <Link to="/register" className="text-primary font-black hover:underline underline-offset-4">
                        Initialize Account
                    </Link>
                </p>
            </footer>
        </div>
    );
}