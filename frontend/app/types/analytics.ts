export interface DailyMetric {
    date: string;
    revenue: number;
    students: number;
}

export interface CourseMetric {
    id: string;
    title: string;
    views: number;
    sales: number;
    revenue: number;
    conversionRate: number;
}

export interface StatCardData {
    title: string;
    value: string;
    trend: string;
    trendDirection: 'up' | 'down' | 'neutral';
    icon: any; // LucideIcon
    color: string;
}