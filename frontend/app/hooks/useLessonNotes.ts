import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '~/utils/api.client';
import type { Note } from '~/types/course';

export function useLessonNotes(lessonId: string) {
    return useQuery<Note[]>({
        queryKey: ['lesson-notes', lessonId],
        queryFn: async () => {
            const { data } = await api.get(`/lessons/${lessonId}/notes/`);
            return data;
        },
        enabled: !!lessonId,
    });
}

export function useCreateNote(lessonId: string) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (noteData: { content: string; timestamp: number; is_code: boolean }) =>
            api.post(`/lessons/${lessonId}/notes/`, noteData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['lesson-notes', lessonId] });
        },
    });
}

export function useDeleteNote(lessonId: string) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (noteId: string) =>
            api.delete(`/lessons/${lessonId}/notes/${noteId}/`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['lesson-notes', lessonId] });
        },
    });
}
