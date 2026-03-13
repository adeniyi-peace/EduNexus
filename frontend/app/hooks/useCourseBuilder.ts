import { useState, useEffect, useRef } from "react";
import apiClient from "~/utils/api.client";
import type { CourseData, Module, Lesson, Resource, QuizQuestion } from "~/types/course";
import { v4 as uuidv4 } from "uuid";

export type SyncStatus = "idle" | "saving" | "error" | "initializing";

export function useCourseBuilder(initialData: CourseData) {
    const [course, setCourse] = useState<CourseData>(initialData);
    const [syncStatus, setSyncStatus] = useState<SyncStatus>("idle");
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [uploadProgress, setUploadProgress] = useState<number>(0);
    const [isReady, setIsReady] = useState(initialData.modules.length > 0 || initialData.id !== "new-course");

    // Browser Warning for Unsaved Changes
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (syncStatus === "saving" || syncStatus === "initializing") {
                e.preventDefault();
                e.returnValue = "";
            }
        };
        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => window.removeEventListener("beforeunload", handleBeforeUnload);
    }, [syncStatus]);

    // Generic wrapper to handle status changes and API calls
    const syncToBackend = async (operation: () => Promise<any>, rollback?: () => void) => {
        setSyncStatus("saving");
        setErrorMessage(null);
        try {
            const response = await operation();
            setSyncStatus("idle");
            return response;
        } catch (error: any) {
            console.error("Builder Sync Error:", error);
            setSyncStatus("error");
            setErrorMessage(error?.response?.data?.message || "Internal System Error: Core Sync Failed");
            if (rollback) rollback();
            throw error;
        }
    };

    // --- COURSE ACTIONS ---  COURSE UPDATES (Title, Price, etc.)
    const updateCourse = async (fields: Partial<CourseData>) => {
        const previousCourse = { ...course };
        setCourse(prev => ({ ...prev, ...fields }));
        setErrorMessage(null);

        try {
            if (!isReady) {
                setSyncStatus("initializing");
                // Remove temp ID before sending to backend
                const { id, ...payload } = { ...course, ...fields };
                const response = await apiClient.post(`/courses/`, payload);
                const serverData = response.data;
                
                // CRITICAL: Replace temporary ID with server ID
                setCourse(prev => ({ ...prev, ...serverData }));
                setIsReady(true);
                setSyncStatus("idle");
            } else {
                await syncToBackend(
                    () => apiClient.patch(`/courses/${course.id}/`, fields),
                    () => setCourse(previousCourse)
                );
            }
        } catch (err: any) {
            console.error("Failed to sync course content", err);
            setSyncStatus("error");
            setErrorMessage(err?.response?.data?.title?.[0] || err?.response?.data?.message || "Failed to initialize course core records.");
            setCourse(previousCourse);
        } 
    };

    const deleteCourse = async () => {
        setSyncStatus("saving");
        try {
            await apiClient.delete(`/courses/${course.id}`);
            // Redirect logic would go here, e.g., router.push('/dashboard')
            window.location.href = "/dashboard"; 
        } catch (error) {
            console.error("Failed to delete course", error);
            setSyncStatus("error");
        }
    };

    const uploadCourseThumbnail = async (file: File) => {
        setSyncStatus("saving");
        setUploadProgress(10); // Start progress

        try {
            const formData = new FormData();
            formData.append("thumbnail", file);
            
            const { data } = await apiClient.patch(`/courses/${course.id}/`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
                onUploadProgress: (progressEvent) => {
                    const percent = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 100));
                    setUploadProgress(percent);
                }
            });
            
            setCourse(prev => ({ ...prev, thumbnail: data.thumbnail }));
            setSyncStatus("idle");
            setUploadProgress(0);
            return data.thumbnail;
        } catch (error) {
            console.error("Thumbnail upload failed", error);
            setSyncStatus("error");
            setUploadProgress(0);
            throw error;
        }
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

    // --- 2. MODULE UPDATES (Renaming) ---
    const updateModule = async (moduleId: string, fields: Partial<Module>) => {
        setCourse(prev => ({
            ...prev,
            modules: prev.modules.map(m => m.id === moduleId ? { ...m, ...fields } : m)
        }));
        await syncToBackend(() => apiClient.patch(`/modules/${moduleId}`, fields));
    };

    

    // --- 3. LESSON UPDATES (Renaming, Content, Quiz Data) ---
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


    // --- VIDEO & METADATA LOGIC ---
    const uploadVideo = async (moduleId: string, lessonId: string, file: File) => {
        setSyncStatus("saving");
        setUploadProgress(10);
        
        try {
            // 1. Get Duration Client-Side for instant metadata
            const duration = await getVideoDuration(file);

            // 2. Prepare Form Data
            const formData = new FormData();
            formData.append("video_url", file); // Backend expects video_url for lesson
            formData.append("duration", duration.toString());

            // 3. Upload with progress
            const { data } = await apiClient.post(`/lessons/${lessonId}/upload`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
                onUploadProgress: (progressEvent) => {
                    const percent = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 100));
                    setUploadProgress(percent);
                }
            });

            // 4. Update State
            setCourse(prev => ({
                ...prev,
                modules: prev.modules.map(m => 
                    m.id === moduleId ? {
                        ...m,
                        lessons: m.lessons.map(l => 
                            l.id === lessonId 
                                ? { ...l, videoUrl: data.video_url, duration: duration } 
                                : l
                        )
                    } : m
                )
            }));
            setSyncStatus("idle");
            setUploadProgress(0);
        } catch (error) {
            console.error("Upload failed", error);
            setSyncStatus("error");
            setUploadProgress(0);
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
    errorMessage,
    uploadProgress,
    isReady, 
    setErrorMessage, // Allow manual clearing if needed
    updateCourse,
    deleteCourse,  
    uploadCourseThumbnail,
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