export type NotificationType = 'system' | 'enrollment' | 'course_update' | 'achievement' | 'mentor_reply' | 'deadline';

export interface NotificationActor {
    id: string;
    name: string;
    avatar?: string;
    role: 'instructor' | 'student' | 'system';
}

export interface NotificationItem {
    id: string;
    type: NotificationType;
    actor: NotificationActor;
    title: string;
    message: string;
    timestamp: Date;
    isRead: boolean;
    link: string; // URL to navigate to (e.g., /courses/react-101/lesson-5)
    meta?: {
        grade?: number;
        courseName?: string;
    };
}