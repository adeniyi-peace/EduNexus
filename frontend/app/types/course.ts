// types/course.ts

export interface CourseData {
    id: string;
    title: string;
    description?: string;
    thumbnail?: string;
    price?: number;
    category?: string;
    difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
    students?: number;
    rating?: number;
    status?: 'Published' | 'Draft' | 'Archived';
    lastUpdated?: string;
    language?: string;
    modules?: Module[];
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

// Base lesson properties shared across all types
interface BaseLesson {
    id: string;
    title: string;
    description?: string;
    isPublished: boolean;
    isPreview?: boolean;
    isHidden?: boolean;
    resources: Resource[];
}

export interface VideoLesson extends BaseLesson {
    type: 'video';
    videoUrl: string;
    duration: number;
}

export interface ArticleLesson extends BaseLesson {
    type: 'article';
    content: string; // HTML/Markdown
}

export interface QuizLesson extends BaseLesson {
    type: 'quiz';
    quizConfig: {
        timeLimit: number;
        questions: QuizQuestion[];
    };
}

// Discriminated Union
export type Lesson = VideoLesson | ArticleLesson | QuizLesson;

export interface Module {
    id: string;
    title: string;
    lessons: Lesson[];
    isOpen: boolean; 
}