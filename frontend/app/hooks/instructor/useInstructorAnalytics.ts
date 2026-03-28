// hooks/instructor/useInstructorAnalytics.ts
// TanStack Query hook for the Instructor-wide analytics (KPIs, revenue chart, ratings)

import { useQuery } from "@tanstack/react-query";
import api from "~/utils/api.client";
import type { InstructorAnalyticsData } from "~/types/instructor";

async function fetchInstructorAnalytics(): Promise<InstructorAnalyticsData> {
    const { data } = await api.get<InstructorAnalyticsData>("/users/instructor/analytics/");
    return data;
}

export function useInstructorAnalytics() {
    return useQuery({
        queryKey: ["instructor", "analytics"],
        queryFn: fetchInstructorAnalytics,
        staleTime: 60_000, // 1 minute — analytics data is heavier to compute
        refetchOnWindowFocus: true,
    });
}
