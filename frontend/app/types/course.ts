// types/course.ts

export interface CourseData {
    id: string;
    title: string;
    instructor: string;
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