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