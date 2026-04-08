// types/course.ts

import type { User } from "~/utils/db.server";
import type { UserProfileData } from "./user";

export interface Category {
    id: string;
    name: string;
    slug: string;
}

export interface CertificateConfig {
    signatoryName: string;
    signatoryTitle: string;
    signatorySignature?: string;
}

// --- Shared sub-types ---

export interface QuizOption {
    id: string;
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

export interface Note {
    id: string;
    student: string;
    lesson: string;
    content: string;
    timestamp?: number;
    is_code?: boolean;
    created_at: string;
}

// --- Flat Lesson interface (used by CourseBuilder, Workbench, etc.) ---

export interface Lesson {
    id: string;
    title: string;
    type: 'video' | 'article' | 'quiz';
    description?: string;
    isPublished: boolean;
    isPreview?: boolean;
    isHidden?: boolean;
    allowDownload?: boolean;
    order?: number;
    resources: Resource[];

    // Type-specific fields (all optional — builder needs to read/write freely)
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

// --- Discriminated Lesson Union (used by CoursePlayer — matches LessonSerializer.to_representation) ---

interface BasePlayerLessonFields {
    id: string;
    title: string;
    description?: string;
    isPublished: boolean;
    isPreview: boolean;
    isHidden: boolean;
    allowDownload: boolean;
    order: number;
    resources: Resource[];
}

export interface VideoLesson extends BasePlayerLessonFields {
    type: 'video';
    videoUrl: string | null;
    duration: number; // seconds
}

export interface ArticleLesson extends BasePlayerLessonFields {
    type: 'article';
    content: string; // HTML/Markdown from backend
}

export interface QuizLesson extends BasePlayerLessonFields {
    type: 'quiz';
    quizConfig: {
        timeLimit: number;
        questions: QuizQuestion[];
    };
}

export type PlayerLesson = VideoLesson | ArticleLesson | QuizLesson;

export interface PlayerModule {
    id: string;
    title: string;
    isOpen: boolean;
    lessons: PlayerLesson[];
}

// --- Course-level types ---

export interface Instructor {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    fullname: string;
    role: string;
    phone: string;
    date_joined: string;
    xp: string;
    profile_picture: string;
    student_count: number;
    instructor_rating: string;
    premium_courses_count: string;
}

export interface EnrollmentData {
    id: string;
    course: number;
    progress?: {
        percentage_complete: number;
        last_accessed: string | null;
        completed_lessons: string[];
    };
    enrolled_at: string;
    device_type?: string;
    traffic_source?: string;
    country_code?: string;
}

export interface Reviews {
    id: number;
    student: UserProfileData;
    rating: number;
    comment: string;
    created_at: string;
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

/** Used by CourseBuilder */
export interface CourseData {
    id: string;
    title: string;
    instructor?: Instructor;
    description?: string;
    thumbnail?: string;
    price?: number;
    duration?: string;
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
    certificateConfig?: CertificateConfig;
}

/** Used by CoursePlayer — full detail from GET /courses/:id/ */
export interface PlayerCourseDetail {
    id: string;
    title: string;
    slug: string;
    description: string;
    thumbnail: string | null;
    price: number;
    duration: string;
    category: string;
    language: string;
    difficulty: string;
    status: string;
    lastUpdated: string;
    created_at: string;
    modules: PlayerModule[];
    students: number;
    isEnrolled: boolean;
    rating: number | null;
    instructor: Instructor;
}