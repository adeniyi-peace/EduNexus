import { useState, useEffect } from "react";
import { Form, Link, useNavigation } from "react-router";
import { z } from "zod";

// --- DJANGO-STYLE SCHEMA ---
const registerSchema = z.object({
    firstName: z.string()
        .min(2, "First name is too short.")
        .regex(/^[^0-9]*$/, "Names cannot contain numbers."),
    lastName: z.string()
        .min(2, "Last name is too short."),
    email: z.string()
        .email("Enter a valid email address."),
    password: z.string()
        .min(8, "This password is too short. It must contain at least 8 characters.")
        .refine(val => !/^\d+$/.test(val), "This password is entirely numeric.")
}).refine((data) => !data.password.toLowerCase().includes(data.firstName.toLowerCase()), {
    message: "The password is too similar to your first name.",
    path: ["password"],
});

export default function Register() {
    const navigation = useNavigation();
    const isSubmitting = navigation.state !== "idle";

    const [formData, setFormData] = useState({ firstName: "", lastName: "", email: "", password: "" });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [showPassword, setShowPassword] = useState(false);
    const [touched, setTouched] = useState<Record<string, boolean>>({});

    // --- LIVE VALIDATION LOOP ---
    useEffect(() => {
        const result = registerSchema.safeParse(formData);
        if (!result.success) {
            const formattedErrors: Record<string, string> = {};
            result.error.issues.forEach((issue) => {
                // Only show errors for fields the user has interacted with (touched)
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        setTouched(prev => ({ ...prev, [e.target.name]: true }));
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="mb-10 text-center lg:text-left">
                <h1 className="text-4xl font-black mb-2 tracking-tight uppercase italic">Initiate Session</h1>
                <p className="text-base-content/60">Connect to the Nexus Architecture.</p>
            </header>

            {/* --- SOCIAL AUTH --- */}
            <div className="grid grid-cols-2 gap-4 mb-8">
                <button type="button" className="btn btn-outline border-base-content/10 hover:bg-base-200 rounded-2xl h-14 normal-case font-bold">
                    <img src="https://www.svgrepo.com/show/355037/google.svg" className="w-5 h-5" alt="G" />
                    Google
                </button>
                <button type="button" className="btn btn-outline border-base-content/10 hover:bg-base-200 rounded-2xl h-14 normal-case font-bold">
                    <img src="https://www.svgrepo.com/show/511330/apple-173.svg" className="w-5 h-5 dark:invert" alt="A" />
                    Apple
                </button>
            </div>

            <div className="divider text-[10px] font-black opacity-30 uppercase tracking-[0.2em] mb-8">Secure Protocol</div>

            <Form method="post" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="form-control">
                        <label className="label text-[10px] font-black opacity-50 uppercase">First Name</label>
                        <input 
                            name="firstName"
                            type="text" 
                            className={`input bg-base-200/50 border-none rounded-2xl h-14 focus:outline-primary ${errors.firstName ? 'ring-2 ring-error/50' : ''}`}
                            placeholder="Aris"
                            value={formData.firstName}
                            onChange={handleChange}
                            onBlur={handleBlur}
                        />
                        {errors.firstName && <span className="text-[10px] text-error mt-2 font-bold px-1">{errors.firstName}</span>}
                    </div>
                    <div className="form-control">
                        <label className="label text-[10px] font-black opacity-50 uppercase">Last Name</label>
                        <input 
                            name="lastName"
                            type="text" 
                            className={`input bg-base-200/50 border-none rounded-2xl h-14 focus:outline-primary ${errors.lastName ? 'ring-2 ring-error/50' : ''}`}
                            placeholder="Thorne"
                            value={formData.lastName}
                            onChange={handleChange}
                            onBlur={handleBlur}
                        />
                        {errors.lastName && <span className="text-[10px] text-error mt-2 font-bold px-1">{errors.lastName}</span>}
                    </div>
                </div>

                <div className="form-control">
                    <label className="label text-[10px] font-black opacity-50 uppercase">Network Email</label>
                    <input 
                        name="email"
                        type="email" 
                        className={`input w-full bg-base-200/50 border-none rounded-2xl h-14 focus:outline-primary ${errors.email ? 'ring-2 ring-error/50' : ''}`}
                        placeholder="aris@nexus.io"
                        value={formData.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                    />
                    {errors.email && <span className="text-[10px] text-error mt-2 font-bold px-1">{errors.email}</span>}
                </div>

                <div className="form-control">
                    <label className="label text-[10px] font-black opacity-50 uppercase">Access Password</label>
                    <div className="relative">
                        <input 
                            name="password"
                            type={showPassword ? "text" : "password"} 
                            className={`input w-full bg-base-200/50 border-none rounded-2xl h-14 focus:outline-primary pr-12 ${errors.password ? 'ring-2 ring-error/50' : ''}`}
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={handleChange}
                            onBlur={handleBlur}
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

                <button 
                    type="submit" 
                    disabled={isSubmitting || Object.keys(errors).length > 0}
                    className="btn btn-primary btn-block h-16 rounded-2xl shadow-xl shadow-primary/20 text-lg font-black mt-6 uppercase italic"
                >
                    {isSubmitting ? <span className="loading loading-spinner"></span> : "Create Nexus Account"}
                </button>
            </Form>

            <p className="mt-8 text-center text-sm opacity-60">
                Already registered? <Link to="/login" className="text-primary font-black hover:underline underline-offset-4">Login to Nexus</Link>
            </p>
        </div>
    );
}