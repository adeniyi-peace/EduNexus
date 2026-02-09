import { useState, useEffect } from "react";
import { Form, Link, useNavigation } from "react-router";
import { z } from "zod";

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
    const navigation = useNavigation();
    const isSubmitting = navigation.state !== "idle";

    const [formData, setFormData] = useState({ password: "", confirmPassword: "" });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const [showPassword, setShowPassword] = useState(false);

    // --- LIVE VALIDATION ---
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        setTouched(prev => ({ ...prev, [e.target.name]: true }));
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

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="mb-10">
                <h1 className="text-4xl font-black mb-2 tracking-tight uppercase italic">New Credentials</h1>
                <p className="text-base-content/60 leading-relaxed">
                    Update your security key to regain access to the Nexus.
                </p>
            </header>

            <Form method="post" className="space-y-6">
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
                    disabled={isSubmitting || Object.keys(errors).length > 0}
                    className="btn btn-primary btn-block h-16 rounded-2xl shadow-xl shadow-primary/20 text-lg font-black uppercase italic mt-4"
                >
                    {isSubmitting ? (
                        <span className="loading loading-spinner"></span>
                    ) : (
                        "Override Security Key"
                    )}
                </button>
            </Form>

            <footer className="mt-10 text-center">
                <Link to="/login" className="text-xs font-black opacity-40 hover:opacity-100 hover:text-primary transition-all uppercase tracking-widest">
                    Cancel and Return to Login
                </Link>
            </footer>
        </div>
    );
}