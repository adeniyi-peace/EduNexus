import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '~/utils/api.client';

export interface QnAAnswer {
    id: string;
    question: string;
    user: {
        id: number;
        fullname: string;
        profile_picture: string;
    };
    content: string;
    is_instructor_reply: boolean;
    created_at: string;
}

export interface QnAQuestion {
    id: string;
    lesson: string;
    student: {
        id: number;
        fullname: string;
        profile_picture: string;
    };
    title: string;
    content: string;
    is_resolved: boolean;
    created_at: string;
    answers: QnAAnswer[];
    answers_count: number;
}

export function useLessonQuestions(lessonId: string) {
    return useQuery<QnAQuestion[]>({
        queryKey: ['lesson-questions', lessonId],
        queryFn: async () => {
            const { data } = await api.get(`/lessons/${lessonId}/questions/`);
            return data;
        },
        enabled: !!lessonId,
    });
}

export function useCreateQuestion(lessonId: string) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (questionData: { title: string; content: string }) =>
            api.post(`/lessons/${lessonId}/questions/`, questionData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['lesson-questions', lessonId] });
        },
    });
}

export function useCreateAnswer(questionId: string, lessonId: string) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (content: string) =>
            api.post(`/questions/${questionId}/answers/`, { content }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['lesson-questions', lessonId] });
        },
    });
}
