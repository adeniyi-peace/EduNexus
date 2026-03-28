// ---------------------------------------------------------------
// Types for the Instructor (CMS) Module API responses
// Mirrors the contracts defined in backend/user/views_cms.py
// ---------------------------------------------------------------

// --- Dashboard ---
export interface InstructorQuickStat {
    label: string;
    value: string;
    icon: string;
    color: string;
}

export interface InstructorCourse {
    id: string;
    title: string;
    status: string;
    progress: number;
    students: number;
    revenue: string;
}

export interface InstructorActivityItem {
    id: string;
    user: string;
    action: string;
    target: string;
    time: string;
}

export interface InstructorDashboardData {
    quickStats: InstructorQuickStat[];
    myCourses: InstructorCourse[];
    activityFeed: InstructorActivityItem[];
    instructorName: string;
}

// --- Instructor Analytics ---
export interface InstructorAnalyticsStats {
    totalRevenue: string;
    activeStudents: string;
    avgRating: string;
    hoursWatched: string;
    revenueTrend: string;
    revenueTrendDirection: 'up' | 'down' | 'neutral';
    studentsTrend: string;
    studentsTrendDirection: 'up' | 'down' | 'neutral';
    ratingTrend: string;
    ratingTrendDirection: 'up' | 'down' | 'neutral';
    hoursTrend: string;
    hoursTrendDirection: 'up' | 'down' | 'neutral';
}

export interface InstructorQuickStats {
    newEnrollments: number;
    certificates: number;
    refundRate: number;
    completionRate: number;
}

export interface InstructorTopCourse {
    id: string;
    title: string;
    students: number;
    revenue: string;
    rating: number;
}

export interface ChartDataPoint {
    name: string;
    revenue: number;
}

export interface DistributionBucket {
    name: string;
    value: number;
    color: string;
}

export interface RatingBucket {
    stars: number;
    count: number;
    percentage: number;
}

export interface InstructorAnalyticsData {
    stats: InstructorAnalyticsStats;
    revenueChart: ChartDataPoint[];
    studentDistribution: DistributionBucket[];
    ratingAnalysis: RatingBucket[];
    quickStats: InstructorQuickStats;
    topCourses: InstructorTopCourse[];
}

// --- Course Analytics ---
export interface CourseAnalyticsStats {
    revenue: string;
    students: string;
    rating: string;
    completion: string;
}

export interface FunnelStage {
    stage: string;
    students: number;
    percent: number;
}

export interface ModuleDropout {
    id: number;
    name: string;
    views: number;
    completed: number;
    dropout: number;
}

export interface CourseAnalyticsData {
    id: string;
    slug: string;
    courseTitle: string;
    stats: CourseAnalyticsStats;
    revenueChart: ChartDataPoint[];
    progressDistribution: DistributionBucket[];
    ratingAnalysis: RatingBucket[];
    funnelData: FunnelStage[];
    dropoutRates: ModuleDropout[];
}

// --- Course Reviews ---
export interface CourseReview {
    id: string;
    student: {
        fullname: string;
        avatar?: string;
    };
    rating: number;
    comment: string;
    created_at: string;
}

export interface CourseReviewsPageData {
    courseTitle: string;
    reviews: CourseReview[];
}

// --- All Course Reviews Overview ---
export interface CourseReviewSummary {
    id: string;
    slug: string;
    title: string;
    thumbnail?: string;
    totalReviews: number;
    averageRating: number;
    fiveStar: number;
    fourStar: number;
    threeStar: number;
    twoStar: number;
    oneStar: number;
}

export interface AllCourseReviewsData {
    courses: CourseReviewSummary[];
}

// --- Asset Library (Instructor Courses List) ---
export interface InstructorLibraryCourse {
    id: string;
    title: string;
    thumbnail: string;
    category?: string;
    students: number;
    rating: number;
    status: string;
    lastUpdated?: string;
    price: number;
    duration: string;
    difficulty: string;
    instructor: {
        id: number;
        fullname: string;
        profile_picture?: string | null;
    };
}
