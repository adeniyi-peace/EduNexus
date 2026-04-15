import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router";
import { z } from "zod";
import { useUserContext } from "~/hooks/useUserContext";

export const meta = () => {
  return [
    { title: "Reset Password | EduNexus" },
    { name: "description", content: "Reset Password Page" },
  ];
};

// --- VALIDATION SCHEMA ---
const resetSchema = z.object({
    password: z.string()
        .min(8, "Password must be at least 8 characters.")
        .refine(val => !/^\d+$/.test(val), "Password cannot be entirely numeric."),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
});

export default function ResetPassword() {
    const { resetPassword, isLoading, error, clearError } = useUserContext();
    const [searchParams] = useSearchParams();

    // dj-rest-auth sends uid and token as URL parameters
    const uid = searchParams.get("uid") || "";
    const token = searchParams.get("token") || "";

    const [formData, setFormData] = useState({ password: "", confirmPassword: "" });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const [showPassword, setShowPassword] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    // Live validation
    useEffect(() => {
        const result = resetSchema.safeParse(formData);
        if (!result.success) {
            const formattedErrors: Record<string, string> = {};
            result.error.issues.forEach((issue) => {
                const path = issue.path[0] as string;
                if (touched[path]) formattedErrors[path] = issue.message;
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const result = resetSchema.safeParse(formData);
        if (!result.success) {
            setTouched({ password: true, confirmPassword: true });
            return;
        }

        const response = await resetPassword({
           uid: uid.trim(),
           token: token.trim(),
           new_password1: formData.password,
           new_password2: formData.confirmPassword,
        });

        if (response.success) {
            setIsSuccess(true);
        }
    };

    // Calculate Strength (Simple visual feedback)
    const getStrength = () => {
        const pw = formData.password;
        if (pw.length === 0) return 0;
        let score = 0;
        if (pw.length > 8) score++;
        if (/[A-Z]/.test(pw)) score++;
        if (/[0-9]/.test(pw)) score++;
        if (/[^A-Za-z0-9]/.test(pw)) score++;
        return score;
    };

    if (isSuccess) {
        return (
            <div className="animate-in fade-in zoom-in duration-500 text-center">
                <div className="w-20 h-20 bg-success/10 text-success rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">
                    ✅
                </div>
                <h1 className="text-3xl font-black mb-4">Password Updated</h1>
                <p className="text-base-content/60 mb-8 leading-relaxed">
                    Your security key has been successfully updated. You can now login with your new credentials.
                </p>
                <Link to="/login" className="btn btn-primary rounded-2xl font-black uppercase tracking-widest text-xs">
                    Continue to Login
                </Link>
            </div>
        );
    }

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="mb-10">
                <h1 className="text-4xl font-black mb-2 tracking-tight uppercase italic">New Credentials</h1>
                <p className="text-base-content/60 leading-relaxed">
                    Update your security key to regain access to the Nexus.
                </p>
            </header>

            {/* Server Error Display */}
            {error && (
                <div className="mb-6 p-4 bg-error/10 border border-error/20 rounded-2xl animate-in fade-in slide-in-from-top-2 duration-300">
                    <p className="text-error text-sm font-bold">{error}</p>
                </div>
            )}

            {/* Missing token/uid warning */}
            {(!uid || !token) && (
                <div className="mb-6 p-4 bg-warning/10 border border-warning/20 rounded-2xl">
                    <p className="text-warning text-sm font-bold">
                        Invalid or expired reset link. Please request a new password reset.
                    </p>
                    <Link to="/forgot-password" className="text-primary text-xs font-black uppercase mt-2 inline-block hover:underline">
                        Request New Reset →
                    </Link>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* New Password */}
                <div className="form-control">
                    <label className="label text-[10px] font-black opacity-50 uppercase tracking-widest">
                        New Security Key
                    </label>
                    <div className="relative">
                        <input 
                            name="password"
                            type={showPassword ? "text" : "password"} 
                            className={`input w-full bg-base-200/50 border-none rounded-2xl h-16 focus:outline-primary pr-12 transition-all ${errors.password ? 'ring-2 ring-error/50' : ''}`}
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            required
                        />
                        <button 
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 opacity-30 hover:opacity-100 transition-opacity"
                        >
                            {showPassword ? "🔒" : "👁️"}
                        </button>
                    </div>

                    {/* Password Strength Meter */}
                    <div className="flex gap-1 mt-3 px-1">
                        {[1, 2, 3, 4].map((step) => (
                            <div 
                                key={step} 
                                className={`h-1 flex-1 rounded-full transition-all duration-500 ${
                                    getStrength() >= step ? 'bg-primary' : 'bg-base-content/10'
                                }`} 
                            />
                        ))}
                    </div>
                    
                    {errors.password && (
                        <span className="text-[10px] text-error mt-2 font-bold px-1 animate-in slide-in-from-top-1">
                            {errors.password}
                        </span>
                    )}
                </div>

                {/* Confirm Password */}
                <div className="form-control">
                    <label className="label text-[10px] font-black opacity-50 uppercase tracking-widest">
                        Verify New Key
                    </label>
                    <input 
                        name="confirmPassword"
                        type="password" 
                        className={`input bg-base-200/50 border-none rounded-2xl h-16 focus:outline-primary transition-all ${errors.confirmPassword ? 'ring-2 ring-error/50' : ''}`}
                        placeholder="••••••••"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                    />
                    {errors.confirmPassword && (
                        <span className="text-[10px] text-error mt-2 font-bold px-1">
                            {errors.confirmPassword}
                        </span>
                    )}
                </div>

                <button 
                    type="submit" 
                    disabled={isLoading || Object.keys(errors).length > 0 || !uid || !token}
                    className="btn btn-primary btn-block h-16 rounded-2xl shadow-xl shadow-primary/20 text-lg font-black uppercase italic mt-4"
                >
                    {isLoading ? (
                        <span className="loading loading-spinner"></span>
                    ) : (
                        "Override Security Key"
                    )}
                </button>
            </form>

            <footer className="mt-10 text-center">
                <Link to="/login" className="text-xs font-black opacity-40 hover:opacity-100 hover:text-primary transition-all uppercase tracking-widest">
                    Cancel and Return to Login
                </Link>
            </footer>
        </div>
    );
}