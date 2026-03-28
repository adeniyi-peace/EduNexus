export interface EnrolledCourse {
    id: string;
    title: string;
    progress: number;
    lastAccessed: string;
}

export interface Student {
    id: string;
    name: string;
    email: string;
    avatar: string;
    joinedDate: string;
    totalSpent?: number; // Useful for Global View
    
    // Global View specific
    enrolledCoursesCount?: number;
    enrolledCoursesList?: EnrolledCourse[];

    // Course View specific
    currentProgress?: number;
    status?: 'Active' | 'At Risk' | 'Completed';
    lastActive?: string;
}

// --- Student Dashboard API Types ---

export interface DashboardNotification {
    id: number;
    type: string;
    text: string;
    title: string;
    time: string;
    is_read: boolean;
    link?: string;
}

export interface AchievementDetail {
    id: number;
    name: string;
    description: string;
    icon_name: string;
    points: number;
}

export interface DashboardAchievement {
    id: number;
    achievement: AchievementDetail;
    earned_at: string;
}

export interface DashboardStats {
    xp_points: number;
    courses_completed: number;
    active_streak: number;
    rank: string;
    total_enrolled: number;
}

export interface StudentDashboardData {
    notifications: DashboardNotification[];
    achievements: DashboardAchievement[];
    stats: DashboardStats;
}