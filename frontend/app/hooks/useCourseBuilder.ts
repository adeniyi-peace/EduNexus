import { useState, useEffect, useRef } from "react";
import apiClient from "~/utils/api.client";
import type { CourseData, Module, Lesson, Resource, QuizQuestion } from "~/types/course";
import { v4 as uuidv4 } from "uuid";

export type SyncStatus = "idle" | "saving" | "error";

export function useCourseBuilder(initialData: CourseData) {
    const [course, setCourse] = useState<CourseData>(initialData);
    const [syncStatus, setSyncStatus] = useState<SyncStatus>("idle");

    // Use a ref to ensure this only runs once per mount
    const hasCheckedExistence = useRef(false);

    // --- 0. INITIALIZATION CHECK ---
    useEffect(() => {
        const ensureCourseExists = async () => {
            if (hasCheckedExistence.current) return;
            hasCheckedExistence.current = true;

            try {
                // Check if course exists
                await apiClient.get(`/courses/${course.id}`);
            } catch (error) {
                // If 404 (or other error), assume it doesn't exist and create the shell
                console.log("Course not found, creating shell...");
                try {
                    await apiClient.post(`/courses`, {
                        id: course.id,
                        title: course.title,
                        price: course.price || 0,
                        // ... any other initial fields
                    });
                } catch (createError) {
                    console.error("Failed to create initial course shell", createError);
                    setSyncStatus("error");
                }
            }
        };

        if (course.id) {
            ensureCourseExists();
        }
    }, [course.id]);

    // Generic wrapper to handle status changes and API calls
    const syncToBackend = async (operation: () => Promise<any>) => {
        setSyncStatus("saving");
        try {
            await operation();
            // Optional: slight delay so the user actually sees the "saved" state
            setTimeout(() => setSyncStatus("idle"), 800);
        } catch (error) {
            console.error("Builder Sync Error:", error);
            setSyncStatus("error");
        }
    };

    // --- 1. COURSE LEVEL UPDATES (Title, Price, etc.) ---
    const updateCourse = async (fields: Partial<CourseData>) => {
        setCourse(prev => ({ ...prev, ...fields }));
        // Debounce this in production!
        await syncToBackend(() => apiClient.patch(`/courses/${course.id}`, fields));
    };

    // --- 2. MODULE UPDATES (Renaming) ---
    const updateModule = async (moduleId: string, fields: Partial<Module>) => {
        setCourse(prev => ({
            ...prev,
            modules: prev.modules.map(m => m.id === moduleId ? { ...m, ...fields } : m)
        }));
        await syncToBackend(() => apiClient.patch(`/modules/${moduleId}`, fields));
    };

    // --- 3. LESSON UPDATES (Renaming, Content, Quiz Data) ---
    const updateLesson = async (moduleId: string, lessonId: string, fields: Partial<Lesson>) => {
        setCourse(prev => ({
            ...prev,
            modules: prev.modules.map(m => 
                m.id === moduleId ? {
                    ...m,
                    lessons: m.lessons.map(l => l.id === lessonId ? { ...l, ...fields } : l)
                } : m
            )
        }));
        await syncToBackend(() => apiClient.patch(`/lessons/${lessonId}`, fields));
    };

    // --- 4. REORDERING ---
    const reorderLessons = async (moduleId: string, newLessons: Lesson[]) => {
        // 1. Optimistic Update
        setCourse(prev => ({
            ...prev,
            modules: prev.modules.map(m => 
                m.id === moduleId ? { ...m, lessons: newLessons } : m
            )
        }));

        // 2. Sync to Backend (Send just IDs to save bandwidth)
        const lessonIds = newLessons.map(l => l.id);
        await syncToBackend(() => 
            apiClient.put(`/modules/${moduleId}/reorder`, { lessonIds })
        );
    };

    // --- QUIZ SPECIFIC HELPERS ---
    const addQuizQuestion = (moduleId: string, lessonId: string) => {
        const newQuestion: QuizQuestion = {
            id: uuidv4(),
            text: "New Question",
            options: [
                { text: "Option A", isCorrect: true },
                { text: "Option B", isCorrect: false }
            ]
        };

        // Find current lesson to get existing questions
        const module = course.modules.find(m => m.id === moduleId);
        const lesson = module?.lessons.find(l => l.id === lessonId);
        const currentQuestions = lesson?.quizConfig?.questions || [];

        updateLesson(moduleId, lessonId, {
            quizConfig: {
                timeLimit: lesson?.quizConfig?.timeLimit || 10,
                questions: [...currentQuestions, newQuestion]
            }
        });
    };

    // --- MODULE ACTIONS ---
    const addModule = async () => {
        const newModule: Module = {
            id: `mod-${uuidv4()}`,
            title: "New Section",
            lessons: [],
            isOpen: true
        };

        setCourse(prev => ({ ...prev, modules: [...prev.modules, newModule] }));
        
        await syncToBackend(() => 
            apiClient.post(`/courses/${course.id}/modules`, newModule)
        );
    };

    const deleteModule = async (moduleId: string) => {
        setCourse(prev => ({
            ...prev,
            modules: prev.modules.filter(m => m.id !== moduleId)
        }));

        await syncToBackend(() => 
            apiClient.delete(`/courses/${course.id}/modules/${moduleId}`)
        );
    };

    // --- LESSON ACTIONS ---
    const addLesson = async (moduleId: string, type: "video" | "article" | "quiz") => {
        
        // dynamic title based on type
        let defaultTitle = "Untitled Content";
        if (type === "video") defaultTitle = "Untitled Video";
        if (type === "article") defaultTitle = "Untitled Article";
        if (type === "quiz") defaultTitle = "Untitled Quiz";

        const newLesson: Lesson = {
            id: `les-${uuidv4()}`,
            title: defaultTitle,
            type, // 'video' | 'article' | 'quiz'
            duration: 0,
            resources: [],
            isPublished: false
        };

        setCourse(prev => ({
            ...prev,
            modules: prev.modules.map(m => 
                m.id === moduleId ? { ...m, lessons: [...m.lessons, newLesson] } : m
            )
        }));

        await syncToBackend(() => 
            apiClient.post(`/modules/${moduleId}/lessons`, newLesson)
        );
    };

    const deleteLesson = async (moduleId: string, lessonId: string) => {
        setCourse(prev => ({
            ...prev,
            modules: prev.modules.map(m => 
                m.id === moduleId 
                    ? { ...m, lessons: m.lessons.filter(l => l.id !== lessonId) } 
                    : m
            )
        }));

        await syncToBackend(() => 
            apiClient.delete(`/modules/${moduleId}/lessons/${lessonId}`)
        );
    };

    // --- VIDEO & METADATA LOGIC ---
    const uploadVideo = async (moduleId: string, lessonId: string, file: File) => {
        setSyncStatus("saving");
        
        try {
            // 1. Get Duration Client-Side for instant metadata
            const duration = await getVideoDuration(file);

            // 2. Prepare Form Data
            const formData = new FormData();
            formData.append("video", file);
            formData.append("duration", duration.toString());

            // 3. Upload
            const { data } = await apiClient.post(`/lessons/${lessonId}/upload`, formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            // 4. Update State
            setCourse(prev => ({
                ...prev,
                modules: prev.modules.map(m => 
                    m.id === moduleId ? {
                        ...m,
                        lessons: m.lessons.map(l => 
                            l.id === lessonId 
                                ? { ...l, videoUrl: data.url, duration: duration } 
                                : l
                        )
                    } : m
                )
            }));
            setSyncStatus("idle");
        } catch (error) {
            console.error("Upload failed", error);
            setSyncStatus("error");
        }
    };

    // --- RESOURCE (DOCUMENT) ACTIONS ---
    const addResource = async (moduleId: string, lessonId: string, file: File) => {
        const tempId = uuidv4();
        const newResource: Resource = {
            id: `res-${tempId}`,
            title: file.name,
            url: URL.createObjectURL(file), 
            size: (file.size / 1024 / 1024).toFixed(2) + " MB"
        };

        // Optimistic UI update
        setCourse(prev => ({
            ...prev,
            modules: prev.modules.map(m => 
                m.id === moduleId ? {
                    ...m,
                    lessons: m.lessons.map(l => 
                        l.id === lessonId ? { ...l, resources: [...l.resources, newResource] } : l
                    )
                } : m
            )
        }));

        const formData = new FormData();
        formData.append("file", file);

        await syncToBackend(() => 
            apiClient.post(`/lessons/${lessonId}/resources`, formData)
        );
    };

    const deleteResource = async (moduleId: string, lessonId: string, resourceId: string) => {
        setCourse(prev => ({
            ...prev,
            modules: prev.modules.map(m => 
                m.id === moduleId ? {
                    ...m,
                    lessons: m.lessons.map(l => 
                        l.id === lessonId 
                            ? { ...l, resources: l.resources.filter(r => r.id !== resourceId) } 
                            : l
                    )
                } : m
            )
        }));

        await syncToBackend(() => 
            apiClient.delete(`/lessons/${lessonId}/resources/${resourceId}`)
        );
    };

    return { 
        course, 
        syncStatus,
        updateCourse,
        updateModule,
        updateLesson,
        reorderLessons,
        addQuizQuestion, 
        addModule, 
        deleteModule, 
        addLesson, 
        deleteLesson,
        uploadVideo,
        addResource,
        deleteResource
    };
}

// Utility to get video duration
const getVideoDuration = (file: File): Promise<number> => {
    return new Promise((resolve, reject) => {
        const video = document.createElement("video");
        video.preload = "metadata";
        video.onloadedmetadata = () => {
            window.URL.revokeObjectURL(video.src);
            resolve(video.duration);
        };
        video.onerror = reject;
        video.src = URL.createObjectURL(file);
    });
};