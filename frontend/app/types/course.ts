// types/course.ts

export interface CourseData {
    id: string;
    title: string;
    description?: string;
    thumbnail?: string;
    price?: number;
    category?: string;
    difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
    language?: string;
    modules: Module[];
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

export interface Lesson {
    id: string;
    title: string;
    type: 'video' | 'article' | 'quiz';
    description?: string; // Added description
    isPublished: boolean;
    
    // Type-specific fields
    videoUrl?: string;
    duration?: number;
    content?: string; // For Article (HTML/Markdown)
    quizConfig?: {
        timeLimit: number; // in minutes
        questions: QuizQuestion[];
    };
    resources: Resource[];
    isPreview?: boolean; // Add this
    isHidden?: boolean;  // Add this
}

// ... Module and Resource interfaces remain the same

export interface Resource {
    id: string;
    title: string;
    url: string; // URL from S3/Backend
    size: string;
}


export interface Module {
    id: string;
    title: string;
    lessons: Lesson[];
    isOpen: boolean; // UI state for accordion
}

