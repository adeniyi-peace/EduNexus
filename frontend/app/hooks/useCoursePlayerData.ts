import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '~/utils/api.client';
import type { PlayerCourseDetail, EnrollmentData } from '~/types/course';

/**
 * Fetches full course data (modules → lessons → resources, plus isEnrolled).
 * Runs client-side via TanStack Query so the Axios interceptor can attach
 * the JWT Bearer token from localStorage.
 */
export function useCoursePlayerData(courseId: string) {
    return useQuery<PlayerCourseDetail>({
        queryKey: ['course-player', courseId],
        queryFn: async () => {
            const { data } = await api.get(`/courses/${courseId}/`);
            return data;
        },
        staleTime: 1000 * 60 * 5, // 5 min cache — avoid refetching mid-lesson
        retry: 1,
    });
}

/**
 * Marks a lesson as completed for the authenticated user.
 * Invalidates the course query on success so progress data refreshes.
 * 
 * Backend endpoint: POST /courses/{course_pk}/modules/{module_pk}/complete-lesson
 */
export function useMarkLessonComplete(courseId: string) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ moduleId, lessonId }: { moduleId: string; lessonId: string }) => {
            const { data } = await api.post(`/courses/${courseId}/modules/${moduleId}/complete-lesson`, {
                lesson_id: lessonId,
            });
            return data;
        },
        onSuccess: (updatedProgress) => {
            // Avoid refetching by manually injecting the returned progress object into the cache
            queryClient.setQueryData<EnrollmentData>(['enrollment', courseId], (oldData) => {
                if (!oldData) return oldData;
                return {
                    ...oldData,
                    progress: updatedProgress
                };
            });
            // We no longer need to invalidate the whole course player queries
        },
    });
}

/**
 * Fetches the user's enrollment record for a specific course.
 */
export function useEnrollmentData(courseId: string, isEnrolled: boolean) {
    return useQuery<EnrollmentData>({
        queryKey: ['enrollment', courseId],
        queryFn: async () => {
            const { data } = await api.get(`/enrollments/course/${courseId}/`);
            return data;
        },
        enabled: isEnrolled,
    });
}
