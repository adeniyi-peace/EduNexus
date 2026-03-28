// hooks/instructor/useMessageStudents.ts
// TanStack Query mutations for sending messages to students

import { useMutation } from "@tanstack/react-query";
import api from "~/utils/api.client";

interface MessageAllPayload {
    courseId: string;
    subject: string;
    message: string;
}

interface MessageStudentPayload {
    studentId: string;
    subject: string;
    message: string;
}

interface MessageResponse {
    success: boolean;
    message: string;
    recipients_count?: number;
}

export function useMessageAllStudents() {
    return useMutation({
        mutationFn: async ({ courseId, subject, message }: MessageAllPayload): Promise<MessageResponse> => {
            const { data } = await api.post(`/users/instructor/courses/${courseId}/message-all/`, {
                subject,
                message,
            });
            return data;
        },
    });
}

export function useMessageStudent() {
    return useMutation({
        mutationFn: async ({ studentId, subject, message }: MessageStudentPayload): Promise<MessageResponse> => {
            const { data } = await api.post(`/user/instructor/message-student/`, {
                student_id: studentId,
                subject,
                message,
            });
            return data;
        },
    });
}
