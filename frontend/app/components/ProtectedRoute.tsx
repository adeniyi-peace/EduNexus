// app/components/ProtectedRoute.tsx
// Role-based route protection wrapper
import { useEffect, useState, type ReactNode } from "react";
import { useNavigate } from "react-router";
import { useUserContext, type UserRole } from "~/hooks/useUserContext";

interface ProtectedRouteProps {
    allowedRoles?: UserRole[];
    children: ReactNode;
}

export default function ProtectedRoute({ allowedRoles, children }: ProtectedRouteProps) {
    const {
        user,
        isAuthenticated,
        isLoading,
        initializeAuth,
        getDashboardByRole,
    } = useUserContext();

    const navigate = useNavigate();
    const [isInitialized, setIsInitialized] = useState(false);

    // Hydrate auth state from localStorage on mount
    useEffect(() => {
        useUserContext.persist.rehydrate();
        initializeAuth();
        setIsInitialized(true);
    }, []);

    // Handle redirects after initialization
    useEffect(() => {
        if (!isInitialized || isLoading) return;

        if (!isAuthenticated || !user) {
            navigate("/login", { replace: true });
            return;
        }

        // If allowedRoles is specified, test against it
        if (allowedRoles && !allowedRoles.includes(user.role)) {
            const correctDashboard = getDashboardByRole(user.role);
            navigate(correctDashboard, { replace: true });
        }
    }, [isInitialized, isAuthenticated, user, isLoading]);

    // Show loading while checking auth
    if (!isInitialized || isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-base-200">
                <div className="flex flex-col items-center gap-6">
                    <div className="relative">
                        <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-primary-content font-black text-2xl shadow-xl shadow-primary/30 animate-pulse">
                            N
                        </div>
                        <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-xl animate-pulse" />
                    </div>
                    <div className="text-center">
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40">
                            Verifying Identity
                        </p>
                        <span className="loading loading-dots loading-sm text-primary mt-2" />
                    </div>
                </div>
            </div>
        );
    }

    // Not authorized — redirect handled by useEffect
    if (!isAuthenticated || !user) {
        return null;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return null;
    }

    // Authorized — render the layout
    return <>{children}</>;
}
