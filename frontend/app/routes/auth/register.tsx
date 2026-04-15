import { useState, useEffect } from "react";
import { Link } from "react-router";
import { z } from "zod";
import { 
    User, 
    Mail, 
    Lock, 
    Eye, 
    EyeOff, 
    ArrowRight, 
    ShieldCheck, 
    Zap,
    AlertCircle
} from "lucide-react";
import { useUserContext } from "~/hooks/useUserContext";
import { useSocialAuth } from "~/hooks/useSocialAuth";

export const meta = () => {
  return [
    { title: "Register | EduNexus" },
    { name: "description", content: "Register Page" },
  ];
};

const registerSchema = z.object({
    firstName: z.string()
        .min(2, "First name is too short.")
        .regex(/^[^0-9]*$/, "Names cannot contain numbers."),
    lastName: z.string()
        .min(2, "Last name is too short."),
    email: z.string()
        .email("Enter a valid email address."),
    password: z.string()
        .min(8, "Password must contain at least 8 characters.")
        .refine(val => !/^\d+$/.test(val), "Password cannot be entirely numeric.")
}).refine((data) => !data.password.toLowerCase().includes(data.firstName.toLowerCase()), {
    message: "Security risk: Password contains your first name.",
    path: ["password"],
});

export default function Register() {
    const { register, isLoading, error, clearError } = useUserContext();
    const { loginWithGoogle, loginWithApple } = useSocialAuth();

    const [formData, setFormData] = useState({ firstName: "", lastName: "", email: "", password: "" });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [showPassword, setShowPassword] = useState(false);
    const [touched, setTouched] = useState<Record<string, boolean>>({});

    // Live validation
    useEffect(() => {
        const result = registerSchema.safeParse(formData);
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

    // Clear store error on mount
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

    const [isRegistered, setIsRegistered] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const result = registerSchema.safeParse(formData);
        if (!result.success) {
            setTouched({ firstName: true, lastName: true, email: true, password: true });
            return;
        }

        try {
            const res = await register({
                first_name: formData.firstName,
                last_name: formData.lastName,
                email: formData.email,
                password1: formData.password,
                password2: formData.password,
            });
            
            if (res.success) {
                setIsRegistered(true);
            }
        } catch {
            // Error is set in the store
        }
    };

    if (isRegistered) {
        return (
            <div className="animate-in fade-in zoom-in duration-500 text-center py-10">
                <div className="w-24 h-24 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-8 text-4xl animate-bounce">
                    📩
                </div>
                <h1 className="text-3xl font-black mb-4 uppercase italic">Check your Transmission</h1>
                <p className="text-base-content/60 mb-8 max-w-sm mx-auto leading-relaxed">
                    Identity provisioned! We've sent an activation link to <span className="text-primary font-bold">{formData.email}</span>. Please verify your account to access the Nexus.
                </p>
                <div className="space-y-4">
                    <Link to="/login" className="btn btn-primary btn-block rounded-2xl h-16 font-black uppercase italic">
                        Return to Authentication
                    </Link>
                    <button 
                        onClick={() => setIsRegistered(false)} 
                        className="btn btn-ghost btn-sm opacity-50 uppercase font-black"
                    >
                        Entered wrong email?
                    </button>
                </div>
            </div>
        );
    }

    // Simple strength logic for UI feedback
    const passStrength = formData.password.length === 0 ? 0 : formData.password.length < 8 ? 1 : 2;

    return (
        <div className="animate-in fade-in slide-in-from-bottom-6 duration-1000">
            <header className="mb-10">
                <div className="flex items-center gap-2 text-primary mb-2">
                    <Zap size={18} fill="currentColor" />
                    <span className="text-[10px] font-black uppercase tracking-[0.4em]">Initialize Account</span>
                </div>
                <h1 className="text-4xl font-black mb-2 tracking-tighter uppercase italic">Create <span className="text-primary">Identity</span></h1>
                <p className="text-base-content/50 font-medium">Provision your credentials for the Nexus architecture.</p>
            </header>

            {/* Server Error Display */}
            {error && (
                <div className="mb-6 p-4 bg-error/10 border border-error/20 rounded-2xl animate-in fade-in slide-in-from-top-2 duration-300">
                    <p className="text-error text-sm font-bold">{error}</p>
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

            <div className="relative flex items-center mb-8">
                <div className="grow border-t border-base-content/5"></div>
                <span className="shrink mx-4 text-[10px] font-black opacity-20 uppercase tracking-[0.3em]">Encrypted Handshake</span>
                <div className="grow border-t border-base-content/5"></div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                    <div className="form-control">
                        <label className="flex items-center gap-2 px-1 mb-2">
                            <User size={12} className="opacity-40" />
                            <span className="text-[10px] font-black opacity-40 uppercase tracking-widest">Given Name</span>
                        </label>
                        <input 
                            name="firstName"
                            type="text" 
                            className={`input bg-base-200/50 border-2 border-transparent focus:border-primary/50 rounded-2xl h-14 transition-all ${errors.firstName ? 'border-error/50 bg-error/5' : ''}`}
                            placeholder="e.g. Aris"
                            value={formData.firstName}
                            onChange={handleChange}
                            onBlur={handleBlur}
                        />
                        {errors.firstName && (
                            <div className="flex items-center gap-1 mt-2 text-error animate-in fade-in slide-in-from-top-1">
                                <AlertCircle size={10} />
                                <span className="text-[10px] font-bold uppercase">{errors.firstName}</span>
                            </div>
                        )}
                    </div>
                    <div className="form-control">
                        <label className="flex items-center gap-2 px-1 mb-2">
                            <span className="text-[10px] font-black opacity-40 uppercase tracking-widest text-right w-full">Family Name</span>
                        </label>
                        <input 
                            name="lastName"
                            type="text" 
                            className={`input bg-base-200/50 border-2 border-transparent focus:border-primary/50 rounded-2xl h-14 transition-all ${errors.lastName ? 'border-error/50 bg-error/5' : ''}`}
                            placeholder="e.g. Thorne"
                            value={formData.lastName}
                            onChange={handleChange}
                            onBlur={handleBlur}
                        />
                    </div>
                </div>

                <div className="form-control">
                    <label className="flex items-center gap-2 px-1 mb-2">
                        <Mail size={12} className="opacity-40" />
                        <span className="text-[10px] font-black opacity-40 uppercase tracking-widest">Network Email</span>
                    </label>
                    <input 
                        name="email"
                        type="email" 
                        className={`input w-full bg-base-200/50 border-2 border-transparent focus:border-primary/50 rounded-2xl h-14 transition-all ${errors.email ? 'border-error/50 bg-error/5' : ''}`}
                        placeholder="aris@nexus.io"
                        value={formData.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                    />
                    {errors.email && (
                        <div className="flex items-center gap-1 mt-2 text-error animate-in fade-in slide-in-from-top-1">
                            <AlertCircle size={10} />
                            <span className="text-[10px] font-bold uppercase">{errors.email}</span>
                        </div>
                    )}
                </div>

                <div className="form-control">
                    <label className="flex items-center justify-between px-1 mb-2">
                        <div className="flex items-center gap-2">
                            <Lock size={12} className="opacity-40" />
                            <span className="text-[10px] font-black opacity-40 uppercase tracking-widest">Secret Key</span>
                        </div>
                        {formData.password && (
                            <div className="flex gap-1">
                                <div className={`h-1 w-4 rounded-full transition-colors ${passStrength >= 1 ? 'bg-warning' : 'bg-base-300'}`} />
                                <div className={`h-1 w-4 rounded-full transition-colors ${passStrength >= 2 ? 'bg-success' : 'bg-base-300'}`} />
                            </div>
                        )}
                    </label>
                    <div className="relative">
                        <input 
                            name="password"
                            type={showPassword ? "text" : "password"} 
                            className={`input w-full bg-base-200/50 border-2 border-transparent focus:border-primary/50 rounded-2xl h-14 pr-12 transition-all ${errors.password ? 'border-error/50 bg-error/5' : ''}`}
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={handleChange}
                            onBlur={handleBlur}
                        />
                        <button 
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 opacity-20 hover:opacity-100 transition-opacity"
                        >
                            {showPassword ? <Lock size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                    {errors.password && (
                        <div className="flex items-center gap-1 mt-2 text-error animate-in fade-in slide-in-from-top-1">
                            <AlertCircle size={10} />
                            <span className="text-[10px] font-bold uppercase">{errors.password}</span>
                        </div>
                    )}
                </div>

                <div className="pt-4">
                    <button 
                        type="submit" 
                        disabled={isLoading || Object.keys(errors).length > 0}
                        className="btn btn-primary btn-block h-16 rounded-2xl shadow-2xl shadow-primary/20 text-lg font-black uppercase italic group"
                    >
                        {isLoading ? (
                            <span className="loading loading-spinner"></span>
                        ) : (
                            <div className="flex items-center gap-2">
                                Create Nexus Identity
                                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </div>
                        )}
                    </button>
                </div>
            </form>

            <footer className="mt-8 flex flex-col items-center gap-6">
                <p className="text-xs font-medium opacity-50">
                    Already authenticated? <Link to="/login" className="text-primary font-black hover:underline underline-offset-4 tracking-tight">Login to Node</Link>
                </p>
                <div className="flex items-center gap-2 px-4 py-2 bg-base-200/50 rounded-xl border border-base-content/5">
                    <ShieldCheck size={14} className="text-success" />
                    <span className="text-[9px] font-black uppercase tracking-widest opacity-40">ISO/IEC 27001 Compliant Storage</span>
                </div>
            </footer>
        </div>
    );
}