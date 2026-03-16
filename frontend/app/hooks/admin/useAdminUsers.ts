// hooks/admin/useAdminUsers.ts
// TanStack Query hook for User Management: list, suspend, activate, change role

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "~/utils/api.client";
import type { AdminUserListResponse, AdminUser, AdminActionResponse } from "~/types/admin";

export interface UserFilters {
    role?: string;
    is_active?: boolean | '';
    search?: string;
    page?: number;
    page_size?: number;
}

async function fetchAdminUsers(filters: UserFilters): Promise<AdminUserListResponse> {
    const params = new URLSearchParams();
    if (filters.role) params.set("role", filters.role);
    if (filters.is_active !== undefined && filters.is_active !== '')
        params.set("is_active", String(filters.is_active));
    if (filters.search) params.set("search", filters.search);
    if (filters.page) params.set("page", String(filters.page));
    if (filters.page_size) params.set("page_size", String(filters.page_size));

    const { data } = await api.get<AdminUserListResponse>(`/users/admin/users/?${params}`);
    return data;
}

async function updateUser(
    userId: number,
    payload: Partial<Pick<AdminUser, "is_active" | "role">>
): Promise<any> {
    const { data } = await api.patch<any>(`/users/admin/users/${userId}/`, payload);
    return data;
}

export function useAdminUsers(filters: UserFilters = {}) {
    return useQuery({
        queryKey: ["admin", "users", filters],
        queryFn: () => fetchAdminUsers(filters),
        placeholderData: (prev) => prev, // Keep previous data while loading new page
        staleTime: 15_000,
    });
}

export function useUpdateUser() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ userId, payload }: { userId: number; payload: Partial<Pick<AdminUser, "is_active" | "role">> }) =>
            updateUser(userId, payload),
        onSuccess: () => {
            // Invalidate user list so it refetches with updated is_active / role
            queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
            // Also invalidate dashboard so pending count / stats are fresh
            queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
        },
    });
}
