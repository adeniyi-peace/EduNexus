// hooks/admin/usePendingApprovals.ts
// TanStack Query hook for the Course Approval workflow

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "~/utils/api.client";
import type { PendingCoursesResponse, AdminActionResponse } from "~/types/admin";

async function fetchPendingApprovals(): Promise<PendingCoursesResponse> {
    const { data } = await api.get<PendingCoursesResponse>("/users/admin/courses/pending/");
    return data;
}

async function approveCourse(courseId: string): Promise<AdminActionResponse> {
    const { data } = await api.post<AdminActionResponse>(`/users/admin/courses/${courseId}/approve/`);
    return data;
}

async function rejectCourse(courseId: string, reason: string): Promise<AdminActionResponse> {
    const { data } = await api.post<AdminActionResponse>(
        `/users/admin/courses/${courseId}/reject/`,
        { reason }
    );
    return data;
}

export function usePendingApprovals() {
    return useQuery({
        queryKey: ["admin", "courses", "pending"],
        queryFn: fetchPendingApprovals,
        staleTime: 10_000, // Approval queue should be fairly fresh
        refetchOnWindowFocus: true,
    });
}

export function useApproveCourse() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (courseId: string) => approveCourse(courseId),
        onSuccess: () => {
            // Ripple: invalidate pending list, all courses, and dashboard pending count
            queryClient.invalidateQueries({ queryKey: ["admin", "courses", "pending"] });
            queryClient.invalidateQueries({ queryKey: ["admin", "courses"] });
            queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
        },
    });
}

export function useRejectCourse() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ courseId, reason }: { courseId: string; reason: string }) =>
            rejectCourse(courseId, reason),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin", "courses", "pending"] });
            queryClient.invalidateQueries({ queryKey: ["admin", "courses"] });
            queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
        },
    });
}
