// hooks/admin/useAdminCourses.ts
// TanStack Query hook for Admin Course Inventory (all courses, all instructors)

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "~/utils/api.client";
import type { AdminCourseListResponse, AdminActionResponse } from "~/types/admin";

export interface CourseFilters {
    status?: string;
    category?: string;
    search?: string;
    page?: number;
    page_size?: number;
}

async function fetchAdminCourses(filters: CourseFilters): Promise<AdminCourseListResponse> {
    const params = new URLSearchParams();
    if (filters.status && filters.status !== "all") params.set("status", filters.status);
    if (filters.category && filters.category !== "all") params.set("category", filters.category);
    if (filters.search) params.set("search", filters.search);
    if (filters.page) params.set("page", String(filters.page));
    if (filters.page_size) params.set("page_size", String(filters.page_size));

    const { data } = await api.get<AdminCourseListResponse>(`/users/admin/courses/?${params}`);
    return data;
}

async function deleteCourse(courseId: string): Promise<AdminActionResponse> {
    const { data } = await api.delete<AdminActionResponse>(`/users/admin/courses/${courseId}/`);
    return data;
}

export function useAdminCourses(filters: CourseFilters = {}) {
    return useQuery({
        queryKey: ["admin", "courses", filters],
        queryFn: () => fetchAdminCourses(filters),
        placeholderData: (prev) => prev,
        staleTime: 15_000,
    });
}

export function useDeleteCourse() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (courseId: string) => deleteCourse(courseId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin", "courses"] });
            queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
            queryClient.invalidateQueries({ queryKey: ["admin", "pending-approvals"] });
        },
    });
}
