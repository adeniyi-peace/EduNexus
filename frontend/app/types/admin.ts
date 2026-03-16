// ---------------------------------------------------------------
// Types for the Admin Module API responses
// ---------------------------------------------------------------

// --- Dashboard ---
export interface AdminKpiStat {
    title: string;
    value: string;
    rawValue: number;
    trend: number;
    description: string;
}

export interface AdminPendingCoursePreview {
    id: string;
    title: string;
    instructor: string;
    category: string;
    submittedAt: string;
    price: number;
    thumbnail: string | null;
}

export interface AdminActivityItem {
    id: string;
    user: string;
    action: string;
    target: string;
    time: string;
    type: 'enrollment' | 'payment' | 'review';
}

export interface AdminRevenueChartPoint {
    name: string;
    revenue: number;
    payout?: number;
}

export interface AdminDashboardData {
    kpiStats: AdminKpiStat[];
    pendingApprovals: AdminPendingCoursePreview[];
    activityFeed: AdminActivityItem[];
    revenueChart: AdminRevenueChartPoint[];
}

// --- User Management ---
export interface AdminUser {
    id: number;
    fullname: string;
    email: string;
    role: 'student' | 'instructor' | 'admin';
    is_active: boolean;
    date_joined: string | null;
    avatar: string | null;
}

export interface AdminUserListResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: AdminUser[];
}

// --- Courses (All) ---
export interface AdminCourse {
    id: string;
    title: string;
    instructor: string;
    category: string;
    status: 'Published' | 'Draft' | 'Archived' | 'PendingApproval' | 'Rejected';
    price: number;
    students: number;
    rating: number;
    thumbnail: string | null;
    created_at: string;
}

export interface AdminCourseListResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: AdminCourse[];
}

// --- Course Approval ---
export interface PendingCourse {
    id: string;
    title: string;
    instructor: {
        name: string;
        avatar: string | null;
        rating: number;
    };
    category: string;
    price: number;
    submittedAt: string;
    thumbnail: string | null;
    description: string;
    modulesCount: number;
}

export interface PendingCoursesResponse {
    count: number;
    results: PendingCourse[];
}

// --- Content Moderation ---
export interface ModerationReport {
    id: number;
    type: 'review' | 'comment';
    content: string;
    rating?: number;
    reason: string;
    reporter: string;
    author: string;
    authorId: number;
    courseTitle: string;
    courseId: string;
    timestamp: string;
}

export interface ModerationStats {
    totalFlagged: number;
    resolvedToday: number;
    pendingReview: number;
}

export interface ModerationListResponse {
    stats: ModerationStats;
    count: number;
    results: ModerationReport[];
}

// --- Finance ---
export interface AdminFinanceStats {
    totalRevenue: number;
    totalRevenueFormatted: string;
    thisMonth: number;
    thisMonthFormatted: string;
    revenueTrend: number;
    totalTransactions: number;
    platformFee: number;
}

export interface AdminTransaction {
    id: number;
    reference: string;
    email: string;
    userName: string;
    amount: number;
    status: 'success' | 'pending' | 'failed';
    date: string;
}

export interface AdminPayout {
    id: number;
    name: string;
    email: string;
    students: number;
    grossRevenue: number;
    platformCut: number;
    payoutDue: number;
    status: string;
}

export interface AdminFinanceData {
    stats: AdminFinanceStats;
    revenueChart: AdminRevenueChartPoint[];
    transactions: {
        count: number;
        results: AdminTransaction[];
        page: number;
        pageSize: number;
    };
    payouts: AdminPayout[];
}

// --- Analytics ---
export interface AdminAnalyticsKpis {
    totalUsers: number;
    totalStudents: number;
    totalInstructors: number;
    totalPublishedCourses: number;
    totalEnrollments: number;
    totalRevenue: number;
    avgPlatformRating: number;
}

export interface AnalyticsGrowthPoint {
    name: string;
    students: number;
    instructors: number;
}

export interface AdminTopCourse {
    id: string;
    title: string;
    instructor: string;
    students: number;
    revenue: number;
    revenueFormatted: string;
    rating: number;
    category: string;
}

export interface AdminAnalyticsData {
    kpis: AdminAnalyticsKpis;
    userGrowth: AnalyticsGrowthPoint[];
    engagementChart: { name: string; enrollments: number }[];
    topCourses: AdminTopCourse[];
    categoryDistribution: { name: string; courses: number }[];
}

// --- Settings ---
export interface AdminSettingItem {
    key: string;
    value: string;
    label: string;
    updated_at: string;
}

export interface AdminSettingsData {
    settings: AdminSettingItem[];
}

// --- Generic API Action Response ---
export interface AdminActionResponse {
    success: boolean;
    message: string;
    [key: string]: unknown;
}
