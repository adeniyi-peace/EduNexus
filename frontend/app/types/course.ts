// types/course.ts

import type { User } from "~/utils/db.server";

export interface CourseData {
    id: string;
    title: string;
    instructor: Instructor;
    description?: string;
    thumbnail?: string;
    price?: number;
    duration: string;
    category?: string;
    difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
    students?: number;
    rating?: number;
    status?: 'Published' | 'Draft' | 'Archived';
    lastUpdated?: string;
    language?: string;
    modules: Module[];
    isEnrolled?: boolean;
    reviews?: Reviews[];
}

export interface QuizOption {
    text: string;
    isCorrect: boolean;
}

export interface QuizQuestion {
    id: string;
    text: string;
    options: QuizOption[];
}

export interface Resource {
    id: string;
    title: string;
    url: string;
    size: string;
}

export interface Lesson {
    id: string;
    title: string;
    type: 'video' | 'article' | 'quiz';
    description?: string;
    isPublished: boolean;
    isPreview?: boolean;
    isHidden?: boolean;
    allowDownload?: boolean;
    resources: Resource[];

    // Type-specific fields
    videoUrl?: string;
    duration?: number;
    content?: string; // For Article (HTML/Markdown)
    quizConfig?: {
        timeLimit: number; // in minutes
        questions: QuizQuestion[];
    }

}

export interface Module {
    id: string;
    title: string;
    lessons: Lesson[];
    isOpen: boolean;
}

export interface Certificate {
    id: string;
    certificate_id: string;
    course: number;
    course_name: string;
    instructor_name: string;
    student_name: string;
    issued_at: string;
}

export interface Reviews {
    id: number,
    student: User,
    rating: number,
    comment: string,
    created_at: string,
}

export interface Instructor {
    id: number,
    email: string,
    first_name: string,
    last_name: string,
    fullname: string,
    role: string,
    phone: string,
    date_joined: string,
    xp: string,
    profile_picture: string,
    student_count: number,
    instructor_rating: string,
    premium_courses_count: string
}