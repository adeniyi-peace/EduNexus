// app/hooks/useUserContext.ts
// Centralized authentication store using Zustand + dj-rest-auth endpoints
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { jwtDecode } from "jwt-decode";
import api from "~/utils/api.client";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "~/utils/constants";
import type { AuthUser, UserRole, RegisterData, ResetPasswordData, ChangePasswordData, JwtPayload, AuthState, AuthActions } from "~/types/user";

// --- API Endpoints (dj-rest-auth) ---

const AUTH_ENDPOINTS = {
    // dj-rest-auth core
    LOGIN:                  "/auth/login/",
    LOGOUT:                 "/auth/logout/",
    PASSWORD_RESET:         "/auth/password/reset/",
    PASSWORD_RESET_CONFIRM: "/auth/password/reset/confirm/",
    PASSWORD_CHANGE:        "/auth/password/change/",
    USER:                   "/auth/user/",
    TOKEN_REFRESH:          "/auth/token/refresh/",

    // dj-rest-auth registration
    REGISTER:               "/auth/registration/",
    VERIFY_EMAIL:           "/auth/registration/verify-email/",
    RESEND_EMAIL:           "/auth/registration/resend-email/",
    RESEND_ACTIVATION:      "/auth/resend-activation/",

    // Social auth
    GOOGLE_LOGIN:           "/auth/api/auth/google/",
    APPLE_LOGIN:            "/auth/api/auth/apple/",
} as const;

// --- Role-to-Dashboard Mapping ---

const DASHBOARD_MAP: Record<UserRole, string> = {
    student:    "/dashboard",
    instructor: "/cms",
    admin:      "/admin",
};

// --- Helper: Extract user from JWT ---

function decodeTokenUser(accessToken: string): Partial<AuthUser> | null {
    try {
        const decoded = jwtDecode<JwtPayload>(accessToken);

        // Check if token is expired
        if (decoded.exp * 1000 < Date.now()) {
            return null;
        }

        return {
            id: decoded.user_id,
            email: decoded.email,
            role: decoded.role,
        };
    } catch {
        return null;
    }
}

// --- Helper: Store tokens ---

function storeTokens(access: string) {
    localStorage.setItem(ACCESS_TOKEN, access);
}

function clearTokens() {
    localStorage.removeItem(ACCESS_TOKEN);
}

// --- Helper: Handle auth response from dj-rest-auth ---
// dj-rest-auth login/registration returns { access, refresh, user }

function extractAuthResponse(data: any): {
    access: string;
    refresh?: string;
    user: AuthUser;
} {
    return {
        access: data.access || data.access_token,
        refresh: data.refresh || data.refresh_token,
        user: data.user,
    };
}

// --- Zustand Store ---

export const useUserContext = create<AuthState & AuthActions>()(
    persist(
        (set, get) => ({
            // --- Initial State ---
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,

            // ========================================
            // LOGIN
            // POST /auth/login/
            // Body: { email, password }
            // Returns: { access, refresh, user }
            // ========================================
            login: async (email: string, password: string) => {
                set({ isLoading: true, error: null });
                try {
                    const { data } = await api.post(AUTH_ENDPOINTS.LOGIN, {
                        email,
                        password,
                    });
                    const { access, user } = extractAuthResponse(data);
                    storeTokens(access);


                    set({
                        user,
                        isAuthenticated: true,
                        isLoading: false,
                        error: null,
                    });

                    // Redirect to role-based dashboard
                    const dashboard = get().getDashboardByRole(user.role);
                    window.location.href = dashboard;
                } catch (err: any) {
                    const message =
                        err.response?.data?.non_field_errors?.[0] ||
                        err.response?.data?.detail ||
                        err.response?.data?.email?.[0] ||
                        "Login failed. Please check your credentials.";
                    set({ isLoading: false, error: message });
                    throw err;
                }
            },

            // ========================================
            // REGISTER
            // POST /auth/registration/
            // Body: { first_name, last_name, email, password1, password2 }
            // Returns: { access, refresh, user }
            // ========================================
            register: async (registerData: RegisterData) => {
                set({ isLoading: true, error: null });
                try {
                    await api.post(AUTH_ENDPOINTS.REGISTER, registerData);
                    // registration view now returns a message and no tokens if inactive
                    set({ isLoading: false });
                    return { success: true };
                } catch (err: any) {
                    const message =
                        err.response?.data?.non_field_errors?.[0] ||
                        err.response?.data?.email?.[0] ||
                        err.response?.data?.password1?.[0] ||
                        err.response?.data?.detail ||
                        "Registration failed. Please try again.";
                    set({ isLoading: false, error: message });
                    throw err;
                }
            },

            // ========================================
            // LOGOUT
            // POST /auth/logout/
            // ========================================
            logout: async () => {
                try {
                    await api.post(AUTH_ENDPOINTS.LOGOUT);
                } catch {
                    // Even if the server call fails, clear local state
                } finally {
                    clearTokens();
                    set({
                        user: null,
                        isAuthenticated: false,
                        isLoading: false,
                        error: null,
                    });
                    window.location.href = "/login";
                }
            },

            // ========================================
            // FORGOT PASSWORD
            // POST /auth/password/reset/
            // Body: { email }
            // ========================================
            forgotPassword: async (email: string) => {
                set({ isLoading: true, error: null });
                try {
                    await api.post(AUTH_ENDPOINTS.PASSWORD_RESET, { email });
                    set({ isLoading: false });
                    return { success: true };
                } catch (err: any) {
                    const message =
                        err.response?.data?.email?.[0] ||
                        err.response?.data?.detail ||
                        "Failed to send reset email.";
                    set({ isLoading: false, error: message });
                    return { success: false };
                }
            },

            // ========================================
            // RESET PASSWORD (Confirm)
            // POST /auth/password/reset/confirm/
            // Body: { uid, token, new_password1, new_password2 }
            // ========================================
            resetPassword: async (resetData: ResetPasswordData) => {
                set({ isLoading: true, error: null });
                try {
                    await api.post(AUTH_ENDPOINTS.PASSWORD_RESET_CONFIRM, resetData);
                    set({ isLoading: false });
                    return { success: true };
                } catch (err: any) {
                    const message =
                        err.response?.data?.new_password2?.[0] ||
                        err.response?.data?.new_password1?.[0] ||
                        err.response?.data?.token?.[0] ||
                        err.response?.data?.uid?.[0] ||
                        err.response?.data?.detail ||
                        "Password reset failed.";
                    set({ isLoading: false, error: message });
                    return { success: false };
                }
            },

            // ========================================
            // CHANGE PASSWORD (Authenticated)
            // POST /auth/password/change/
            // Body: { old_password, new_password1, new_password2 }
            // ========================================
            changePassword: async (changeData: ChangePasswordData) => {
                set({ isLoading: true, error: null });
                try {
                    await api.post(AUTH_ENDPOINTS.PASSWORD_CHANGE, changeData);
                    set({ isLoading: false });
                    return { success: true };
                } catch (err: any) {
                    const message =
                        err.response?.data?.old_password?.[0] ||
                        err.response?.data?.new_password2?.[0] ||
                        err.response?.data?.new_password1?.[0] ||
                        err.response?.data?.detail ||
                        "Password change failed.";
                    set({ isLoading: false, error: message });
                    return { success: false };
                }
            },

            // ========================================
            // GOOGLE SOCIAL LOGIN
            // POST /auth/api/auth/google/
            // Body: { access_token }
            // Returns: { access, refresh, user }
            // ========================================
            loginWithGoogle: async (accessToken: string) => {
                set({ isLoading: true, error: null });
                try {
                    const { data } = await api.post(AUTH_ENDPOINTS.GOOGLE_LOGIN, {
                        access_token: accessToken,
                    });
                    const { access, user } = extractAuthResponse(data);
                    storeTokens(access);


                    set({
                        user,
                        isAuthenticated: true,
                        isLoading: false,
                        error: null,
                    });

                    const dashboard = get().getDashboardByRole(user.role);
                    window.location.href = dashboard;
                } catch (err: any) {
                    const message =
                        err.response?.data?.non_field_errors?.[0] ||
                        err.response?.data?.detail ||
                        "Google login failed.";
                    set({ isLoading: false, error: message });
                    throw err;
                }
            },

            // ========================================
            // APPLE SOCIAL LOGIN
            // POST /auth/api/auth/apple/
            // Body: { id_token, code? }
            // Returns: { access, refresh, user }
            // ========================================
            loginWithApple: async (idToken: string, code?: string) => {
                set({ isLoading: true, error: null });
                try {
                    const { data } = await api.post(AUTH_ENDPOINTS.APPLE_LOGIN, {
                        id_token: idToken,
                        code,
                    });
                    const { access, user } = extractAuthResponse(data);
                    storeTokens(access);


                    set({
                        user,
                        isAuthenticated: true,
                        isLoading: false,
                        error: null,
                    });

                    const dashboard = get().getDashboardByRole(user.role);
                    window.location.href = dashboard;
                } catch (err: any) {
                    const message =
                        err.response?.data?.non_field_errors?.[0] ||
                        err.response?.data?.detail ||
                        "Apple login failed.";
                    set({ isLoading: false, error: message });
                    throw err;
                }
            },

            // ========================================
            // FETCH CURRENT USER
            // GET /auth/user/
            // Returns user details from UserSerializer
            // ========================================
            fetchUser: async () => {
                set({ isLoading: true });
                try {
                    const { data } = await api.get(AUTH_ENDPOINTS.USER);
                    set({
                        user: data,
                        isAuthenticated: true,
                        isLoading: false,
                    });
                } catch (err: any) {
                    set({ isLoading: false });
                    // If 401, the interceptor will handle token refresh
                    throw err;
                }
            },

            // ========================================
            // UPDATE USER
            // PATCH /auth/user/
            // Body: partial user fields
            // ========================================
            updateUser: async (userData: Partial<AuthUser>) => {
                set({ isLoading: true, error: null });
                try {
                    const { data } = await api.patch(AUTH_ENDPOINTS.USER, userData);
                    set({
                        user: data,
                        isLoading: false,
                    });
                } catch (err: any) {
                    const message =
                        err.response?.data?.detail ||
                        "Failed to update user profile.";
                    set({ isLoading: false, error: message });
                    throw err;
                }
            },

            // ========================================
            // INITIALIZE AUTH
            // Checks localStorage for existing JWT, decodes it,
            // and hydrates user state on app load
            // ========================================
            initializeAuth: () => {
                const token = localStorage.getItem(ACCESS_TOKEN);
                if (!token) {
                    set({ user: null, isAuthenticated: false, isLoading: false });
                    return;
                }

                const decoded = decodeTokenUser(token);
                if (!decoded) {
                    // Token expired or invalid — try refresh
                    get().refreshToken().then((success) => {
                        if (!success) {
                            clearTokens();
                            set({ user: null, isAuthenticated: false, isLoading: false });
                        }
                    });
                    return;
                }

                // Token is valid — hydrate state from JWT and fetch full user
                set({
                    user: {
                        id: decoded.id!,
                        email: decoded.email!,
                        role: decoded.role!,
                        first_name: "",
                        last_name: "",
                    },
                    isAuthenticated: true,
                    isLoading: false,
                });

                // Fetch full user details in background
                get().fetchUser().catch(() => {
                    // Silent fail — we already have basic info from JWT
                });
            },

            // ========================================
            // REFRESH TOKEN
            // POST /auth/token/refresh/
            // Body: {} (Refresh token is in HTTP-ONLY cookie)
            // Returns: { access }
            // ========================================
            refreshToken: async () => {
                try {
                    // Body is empty because refresh token is sent via cookie
                    const { data } = await api.post(AUTH_ENDPOINTS.TOKEN_REFRESH);
                    localStorage.setItem(ACCESS_TOKEN, data.access);
                    return true;
                } catch {
                    clearTokens();
                    set({ user: null, isAuthenticated: false });
                    return false;
                }
            },

            // ========================================
            // CLEAR ERROR
            // ========================================
            clearError: () => set({ error: null }),

            // ========================================
            // GET DASHBOARD BY ROLE
            // ========================================
            getDashboardByRole: (role?: UserRole) => {
                const userRole = role || get().user?.role;
                if (!userRole) return "/login";
                return DASHBOARD_MAP[userRole] || "/dashboard";
            },

            // ========================================
            // LOGIN WITH TOKEN (From Activation)
            // ========================================
            loginWithToken: (tokens: { access: string; refresh?: string }, user: AuthUser) => {
                storeTokens(tokens.access);

                set({
                    user,
                    isAuthenticated: true,
                    isLoading: false,
                    error: null,
                });
            },

            // ========================================
            // RESEND ACTIVATION
            // ========================================
            resendActivation: async (email: string) => {
                set({ isLoading: true, error: null });
                try {
                    await api.post(AUTH_ENDPOINTS.RESEND_ACTIVATION, { email });
                    set({ isLoading: false });
                    return { success: true };
                } catch (err: any) {
                    const message = err.response?.data?.error || "Failed to resend activation email.";
                    set({ isLoading: false, error: message });
                    return { success: false };
                }
            },
        }),
        {
            name: "edunexus_auth",
            storage: createJSONStorage(() => localStorage),
            // Only persist user and isAuthenticated — not loading/error state
            partialize: (state) => ({
                user: state.user,
                isAuthenticated: state.isAuthenticated,
            }),
            skipHydration: true,
        }
    )
);
