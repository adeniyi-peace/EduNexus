// hooks/admin/useContentReports.ts
// TanStack Query hook for Content Moderation (flagged reviews)

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "~/utils/api.client";
import type { ModerationListResponse, AdminActionResponse } from "~/types/admin";

async function fetchReports(): Promise<ModerationListResponse> {
    const { data } = await api.get<ModerationListResponse>("/users/admin/reports/");
    return data;
}

async function dismissReport(reviewId: number): Promise<AdminActionResponse> {
    const { data } = await api.post<AdminActionResponse>(`/user/admin/reports/${reviewId}/dismiss/`);
    return data;
}

async function removeReview(reviewId: number): Promise<AdminActionResponse> {
    const { data } = await api.post<AdminActionResponse>(`/user/admin/reports/${reviewId}/remove/`);
    return data;
}

export function useContentReports() {
    return useQuery({
        queryKey: ["admin", "reports"],
        queryFn: fetchReports,
        staleTime: 15_000,
        refetchOnWindowFocus: true,
    });
}

export function useDismissReport() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (reviewId: number) => dismissReport(reviewId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin", "reports"] });
        },
    });
}

export function useRemoveReview() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (reviewId: number) => removeReview(reviewId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin", "reports"] });
        },
    });
}
