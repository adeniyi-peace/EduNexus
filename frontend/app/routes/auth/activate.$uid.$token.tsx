import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { useUserContext } from "~/hooks/useUserContext";
import api from "~/utils/api.client";

export default function ActivateAccount() {
    const { uid, token } = useParams();
    const navigate = useNavigate();
    const { loginWithToken } = useUserContext();
    
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState("Verifying your account...");

    useEffect(() => {
        const activate = async () => {
            try {
                // Backend endpoint: /auth/activate/<uid>/<token>/
                const response = await api.get(`/auth/activate/${uid}/${token}/`);
                
                if (response.status === 200) {
                    setStatus('success');
                    setMessage("Account activated successfully! Logging you in...");
                    
                    // Use the tokens to log the user in immediately
                    const { tokens, user } = response.data;
                    
                    // We need a method in our user store to set tokens manually
                    if (loginWithToken) {
                        loginWithToken(tokens, user);
                    }
                    
                    // Redirect after a short delay
                    setTimeout(() => {
                        navigate("/dashboard");
                    }, 2000);
                }
            } catch (err: any) {
                setStatus('error');
                setMessage(err.response?.data?.error || "Activation failed. The link may have expired.");
            }
        };

        if (uid && token) {
            activate();
        }
    }, [uid, token, navigate]);

    return (
        <div className="min-h-[60vh] flex items-center justify-center p-6">
            <div className="max-w-md w-full bg-base-100 rounded-3xl shadow-2xl p-8 border border-base-content/5 text-center animate-in fade-in zoom-in duration-500">
                {status === 'loading' && (
                    <div className="space-y-6">
                        <span className="loading loading-ring loading-lg text-primary"></span>
                        <h2 className="text-2xl font-black uppercase italic tracking-tight">Accessing Grid...</h2>
                        <p className="text-base-content/60">{message}</p>
                    </div>
                )}

                {status === 'success' && (
                    <div className="space-y-6">
                        <div className="w-20 h-20 bg-success/10 text-success rounded-full flex items-center justify-center mx-auto text-3xl animate-bounce">
                            ✅
                        </div>
                        <h2 className="text-2xl font-black uppercase italic tracking-tight">System Online</h2>
                        <p className="text-base-content/60">{message}</p>
                        <div className="pt-4">
                            <Link to="/dashboard" className="btn btn-primary btn-block rounded-2xl font-black uppercase italic">
                                Go to Dashboard
                            </Link>
                        </div>
                    </div>
                )}

                {status === 'error' && (
                    <div className="space-y-6">
                        <div className="w-20 h-20 bg-error/10 text-error rounded-full flex items-center justify-center mx-auto text-3xl">
                            ❌
                        </div>
                        <h2 className="text-2xl font-black uppercase italic tracking-tight">Sync Failure</h2>
                        <p className="text-error font-bold">{message}</p>
                        <div className="pt-4 space-y-3">
                            <Link to="/register" className="btn btn-outline btn-block rounded-2xl font-black uppercase italic hover:bg-error hover:text-white border-error/30">
                                Try Re-registering
                            </Link>
                            <Link to="/login" className="btn btn-ghost btn-xs opacity-50 uppercase font-black">
                                Back to Login
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
