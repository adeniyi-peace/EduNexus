// hooks/instructor/useCourseAnalytics.ts
// TanStack Query hook for individual course analytics (slug-based)

import { useQuery } from "@tanstack/react-query";
import api from "~/utils/api.client";
import type { CourseAnalyticsData } from "~/types/instructor";

async function fetchCourseAnalytics(slug: string): Promise<CourseAnalyticsData> {
    const { data } = await api.get<CourseAnalyticsData>(`/users/instructor/course-analytics/${slug}/`);
    return data;
}

export function useCourseAnalytics(slug: string | undefined) {
    return useQuery({
        queryKey: ["instructor", "course-analytics", slug],
        queryFn: () => fetchCourseAnalytics(slug!),
        enabled: !!slug,
        staleTime: 60_000,
        refetchOnWindowFocus: true,
    });
}
