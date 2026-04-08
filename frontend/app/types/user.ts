// --- Types for useUserContext ---
export type UserRole = "student" | "instructor" | "admin";

export interface AuthUser {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    role: UserRole;
    profile_picture?: string | null;
    pk?: number;
    username?: string;
}

export interface JwtPayload {
    user_id: number;
    email: string;
    role: UserRole;
    exp: number;
    iat: number;
    jti: string;
    token_type: string;
}

export interface AuthState {
    user: AuthUser | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}

export interface AuthActions {
    // Core auth
    login: (email: string, password: string) => Promise<void>;
    register: (data: RegisterData) => Promise<{ success: boolean }>;
    logout: () => Promise<void>;

    // Password management
    forgotPassword: (email: string) => Promise<{ success: boolean }>;
    resetPassword: (data: ResetPasswordData) => Promise<{ success: boolean }>;
    changePassword: (data: ChangePasswordData) => Promise<{ success: boolean }>;

    // Social auth
    loginWithGoogle: (accessToken: string) => Promise<void>;
    loginWithApple: (idToken: string, code?: string) => Promise<void>;

    // User management
    fetchUser: () => Promise<void>;
    updateUser: (data: Partial<AuthUser>) => Promise<void>;

    // Session management
    initializeAuth: () => void;
    refreshToken: () => Promise<boolean>;
    clearError: () => void;

    // Account activation
    loginWithToken: (tokens: { access: string; refresh: string }, user: AuthUser) => void;
    resendActivation: (email: string) => Promise<{ success: boolean }>;

    // Helpers
    getDashboardByRole: (role?: UserRole) => string;
}

export interface RegisterData {
    first_name: string;
    last_name: string;
    email: string;
    password1: string;
    password2: string;
}

export interface ResetPasswordData {
    uid: string;
    token: string;
    new_password1: string;
    new_password2: string;
}

export interface ChangePasswordData {
    old_password: string;
    new_password1: string;
    new_password2: string;
}


// --- Types for User Profile ---

export interface SocialLink {
    platform: 'twitter' | 'linkedin' | 'github' | 'website';
    url: string;
}

export interface UserProfileData {
    id: string;
    firstName: string;
    lastName: string;
    fullname: string;
    role: "student" | "instructor" | "admin";
    location: string;
    joinedDate: string;
    bio: string;
    avatar: string;
    coverImage: string;
    socials: SocialLink[];
    stats: { label: string; value: string }[];
}