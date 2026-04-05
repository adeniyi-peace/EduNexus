import { useState, useEffect, useRef, useCallback } from "react";
import apiClient from "~/utils/api.client";
import type { CourseData, Module, Lesson, Resource, QuizQuestion, Category, CertificateConfig } from "~/types/course";
import { v4 as uuidv4 } from "uuid";

export type SyncStatus = "idle" | "saving" | "error" | "initializing";

export function useCourseBuilder(initialData: CourseData) {
    const [course, setCourse] = useState<CourseData>(initialData);
    const [categories, setCategories] = useState<Category[]>([]);
    const [syncStatus, setSyncStatus] = useState<SyncStatus>("idle");
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [uploadProgress, setUploadProgress] = useState<number>(0);
    const [isReady, setIsReady] = useState(initialData.modules.length > 0 || initialData.id !== "new-course");

    // Fetch categories on mount
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await apiClient.get("/categories/");
                setCategories(response.data);
            } catch (error) {
                console.error("Failed to fetch categories", error);
            }
        };
        fetchCategories();
    }, []);

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

    const loadCourse = useCallback(async (courseId: string) => {
        if (!courseId) return;
        setSyncStatus("initializing");
        try {
            const response = await apiClient.get(`/courses/${courseId}/`);
            setCourse(response.data);
            setIsReady(true);
            setSyncStatus("idle");
        } catch (error) {
            console.error("Failed to load course", error);
            setSyncStatus("error");
            setErrorMessage("Failed to load course data.");
        }
    }, []);

    // --- COURSE ACTIONS ---  COURSE UPDATES (Title, Price, etc.)
    const updateCourse = async (fields: Partial<CourseData>, thumbnailFile?: File | null) => {
        setCourse(prev => ({ ...prev, ...fields }));
        setErrorMessage(null);

        const preparePayload = (basePayload: any) => {
            if (thumbnailFile) {
                const formData = new FormData();
                formData.append("thumbnail", thumbnailFile);
                Object.entries(basePayload).forEach(([key, value]) => {
                    if (value !== undefined && key !== "thumbnail") {
                        // Handle simple values; complex ones might need JSON.stringify if the backend expects it
                        // but for course metadata these should be simple.
                        formData.append(key, value as any);
                    }
                });
                return formData;
            }
            return basePayload;
        };

        const config = thumbnailFile ? {
            headers: { "Content-Type": "multipart/form-data" },
            onUploadProgress: (progressEvent: any) => {
                const percent = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 100));
                setUploadProgress(percent);
            }
        } : {};

        try {
            if (!isReady) {
                setSyncStatus("initializing");
                // Remove temp ID before sending to backend
                const { id, ...basePayload } = { ...course, ...fields };
                const payload = preparePayload(basePayload);
                const response = await apiClient.post(`/courses/`, payload, config);
                const serverData = response.data;

                // CRITICAL: Replace temporary ID with server ID
                setCourse(prev => ({ ...prev, ...serverData }));
                setIsReady(true);
                setSyncStatus("idle");
                setUploadProgress(0);
                return serverData;
            } else {
                const payload = preparePayload(fields);
                const response = await syncToBackend(
                    () => apiClient.patch(`/courses/${course.id}/`, payload, config),
                );
                setUploadProgress(0);
                return response.data;
            }
        } catch (err: any) {
            console.error("Failed to sync course content", err.response);
            setSyncStatus("error");
            setUploadProgress(0);
            setErrorMessage(err?.response?.data?.title?.[0] || err?.response?.data?.message || "Failed to initialize course core records.");
            // setCourse(previousCourse);
            throw err;
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

    const uploadCourseThumbnail = async (file: File, courseId?: string) => {
        const targetId = courseId || course.id;
        if (targetId === "new-course") {
            throw new Error("Cannot upload thumbnail: Course not initialized");
        }

        setSyncStatus("saving");
        setUploadProgress(10); // Start progress

        try {
            const formData = new FormData();
            formData.append("thumbnail", file);

            const { data } = await apiClient.patch(`/courses/${targetId}/`, formData, {
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
        setErrorMessage(null);
        try {
            // 1. Create on backend first (or let backend handle creation)
            const response = await syncToBackend(() =>
                apiClient.post(`/courses/${course.id}/modules/`, { title: "New Section", isOpen:false })
            );
            const newModule = response.data;

            // 2. Update state with server ID
            setCourse(prev => ({ ...prev, modules: [...prev.modules, newModule] }));
            return newModule;
        } catch (err: any) {
            setErrorMessage("Failed to create new module.");
            throw err;
        }
    };

    const deleteModule = async (moduleId: string) => {
        setCourse(prev => ({
            ...prev,
            modules: prev.modules.filter(m => m.id !== moduleId)
        }));

        await syncToBackend(() =>
            apiClient.delete(`/courses/${course.id}/modules/${moduleId}/`)
        );
    };

    // --- 2. MODULE UPDATES (Renaming) ---
    const updateModule = async (moduleId: string, fields: Partial<Module>) => {
        setCourse(prev => ({
            ...prev,
            modules: prev.modules.map(m => m.id === moduleId ? { ...m, ...fields } : m)
        }));
        await syncToBackend(() => apiClient.patch(`/courses/${course.id}/modules/${moduleId}/`, fields));
    };



    // --- 3. LESSON UPDATES (Renaming, Content, Quiz Data) ---
    // --- LESSON ACTIONS ---
    const addLesson = async (moduleId: string, type: "video" | "article" | "quiz") => {
        setErrorMessage(null);
        // dynamic title based on type
        let defaultTitle = "Untitled Content";
        if (type === "video") defaultTitle = "Untitled Video";
        if (type === "article") defaultTitle = "Untitled Article";
        if (type === "quiz") defaultTitle = "Untitled Quiz";

        try {
            const response = await syncToBackend(() =>
                apiClient.post(`/modules/${moduleId}/lessons/`, {
                    title: defaultTitle,
                    type,
                    isPublished: false
                })
            );
            const newLesson = response.data;

            setCourse(prev => ({
                ...prev,
                modules: prev.modules.map(m =>
                    m.id === moduleId ? { ...m, lessons: [...m.lessons, newLesson] } : m
                )
            }));
            return newLesson;
        } catch (err: any) {
            setErrorMessage("Failed to create new lesson.");
            throw err;
        }
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
            apiClient.delete(`/modules/${moduleId}/lessons/${lessonId}/`)
        );
    };

    const updateLesson = async (moduleId: string, lessonId: string, fields: Partial<Lesson>) => {
        const previousCourse = { ...course };
        setCourse(prev => ({
            ...prev,
            modules: prev.modules.map(m =>
                m.id === moduleId ? {
                    ...m,
                    lessons: m.lessons.map(l => l.id === lessonId ? { ...l, ...fields } : l)
                } : m
            )
        }));
        const response = await syncToBackend(
            () => apiClient.patch(`/modules/${moduleId}/lessons/${lessonId}/`, fields),
            () => setCourse(previousCourse)
        );
        return response.data;
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
            apiClient.put(`/modules/${moduleId}/reorder/`, { lessonIds })
        );
    };

    // --- QUIZ SPECIFIC HELPERS ---
    // --- QUIZ ACTIONS ---
    const addQuizQuestion = async (moduleId: string, lessonId: string) => {
        setSyncStatus("saving");
        try {
            const response = await apiClient.post(`/lessons/${lessonId}/questions/`, {
                text: "New Question",
                options: [
                    { text: "Option A", isCorrect: true },
                    { text: "Option B", isCorrect: false },
                    { text: "Option C", isCorrect: false },
                    { text: "Option D", isCorrect: false }
                ]
            });
            const newQuestion = response.data;
            
            setCourse(prev => ({
                ...prev,
                modules: prev.modules.map(m =>
                    m.id === moduleId ? {
                        ...m,
                        lessons: m.lessons.map(l =>
                            l.id === lessonId ? {
                                ...l,
                                quizConfig: {
                                    ...l.quizConfig!,
                                    questions: [...(l.quizConfig?.questions || []), newQuestion]
                                }
                            } : l
                        )
                    } : m
                )
            }));
            setSyncStatus("idle");
            return newQuestion;
        } catch (err) {
            setSyncStatus("error");
            setErrorMessage("Failed to add quiz question.");
            throw err;
        }
    };

    const updateQuizQuestion = async (moduleId: string, lessonId: string, questionId: string, fields: Partial<QuizQuestion>) => {
        // Optimistic update
        setCourse(prev => ({
            ...prev,
            modules: prev.modules.map(m =>
                m.id === moduleId ? {
                    ...m,
                    lessons: m.lessons.map(l =>
                        l.id === lessonId ? {
                            ...l,
                            quizConfig: {
                                ...l.quizConfig!,
                                questions: l.quizConfig!.questions.map(q => q.id === questionId ? { ...q, ...fields } : q)
                            }
                        } : l
                    )
                } : m
            )
        }));

        await syncToBackend(() => 
            apiClient.patch(`/lessons/${lessonId}/questions/${questionId}/`, fields)
        );
    };

    const deleteQuizQuestion = async (moduleId: string, lessonId: string, questionId: string) => {
        setCourse(prev => ({
            ...prev,
            modules: prev.modules.map(m =>
                m.id === moduleId ? {
                    ...m,
                    lessons: m.lessons.map(l =>
                        l.id === lessonId ? {
                            ...l,
                            quizConfig: {
                                ...l.quizConfig!,
                                questions: l.quizConfig!.questions.filter(q => q.id !== questionId)
                            }
                        } : l
                    )
                } : m
            )
        }));

        await syncToBackend(() => 
            apiClient.delete(`/lessons/${lessonId}/questions/${questionId}/`)
        );
    };

    const updateQuizOption = async (moduleId: string, lessonId: string, questionId: string, optionId: string, fields: any) => {
         // Optimistic update
         setCourse(prev => ({
            ...prev,
            modules: prev.modules.map(m =>
                m.id === moduleId ? {
                    ...m,
                    lessons: m.lessons.map(l =>
                        l.id === lessonId ? {
                            ...l,
                            quizConfig: {
                                ...l.quizConfig!,
                                questions: l.quizConfig!.questions.map(q => q.id === questionId ? { 
                                    ...q, 
                                    options: q.options.map(o => o.id === optionId ? { ...o, ...fields } : o)
                                } : q)
                            }
                        } : l
                    )
                } : m
            )
        }));

        await syncToBackend(() => 
            apiClient.patch(`/lessons/${lessonId}/questions/${questionId}/options/${optionId}/`, fields)
        );
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
            const { data } = await apiClient.post(`/modules/${moduleId}/lessons/${lessonId}/upload/`, formData, {
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
        setErrorMessage(null);
        setSyncStatus("saving");
        const formData = new FormData();
        formData.append("url", file);

        try {
            const response = await apiClient.post(`/lessons/${lessonId}/resources/`, formData, {
                headers: { "Content-Type": "multipart/form-data" }}
            );
            const newResource = response.data;

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
            setSyncStatus("idle");
            return newResource;
        } catch (err: any) {
            setSyncStatus("error");
            setErrorMessage("Resource upload failed.");
            throw err;
        }
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

    const updateCertificateConfig = async (fields: Partial<CertificateConfig>, signatureFile?: File | null) => {
        if (course.id === "new-course") return;

        setSyncStatus("saving");
        setErrorMessage(null);

        try {
            const formData = new FormData();
            if (signatureFile) {
                formData.append("signatorySignature", signatureFile);
            }
            // Signatory fields (signatoryName, signatoryTitle)
            Object.entries(fields).forEach(([key, value]) => {
                if (value !== undefined && key !== "signatorySignature") {
                    formData.append(key, value as string);
                }
            });

            const response = await apiClient.patch(
                `/courses/${course.id}/certificate-config/`, 
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );

            setCourse(prev => ({
                ...prev,
                certificateConfig: response.data
            }));
            setSyncStatus("idle");
            return response.data;
        } catch (error: any) {
            console.error("Certificate Config Sync Error:", error);
            setSyncStatus("error");
            setErrorMessage(error?.response?.data?.message || "Failed to update certificate configuration.");
            throw error;
        }
    };

    return {
        course,
        categories,
        syncStatus,
        errorMessage,
        uploadProgress,
        isReady,
        setErrorMessage, // Allow manual clearing if needed
        loadCourse,
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
        deleteResource,
        updateQuizQuestion,
        deleteQuizQuestion,
        updateQuizOption,
        updateCertificateConfig
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