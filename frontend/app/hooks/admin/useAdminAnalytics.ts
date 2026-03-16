// hooks/admin/useAdminAnalytics.ts
// TanStack Query hook for the platform-wide Analytics module

import { useQuery } from "@tanstack/react-query";
import api from "~/utils/api.client";
import type { AdminAnalyticsData } from "~/types/admin";

async function fetchAdminAnalytics(): Promise<AdminAnalyticsData> {
    const { data } = await api.get<AdminAnalyticsData>("/users/admin/analytics/");
    return data;
}

export function useAdminAnalytics() {
    return useQuery({
        queryKey: ["admin", "analytics"],
        queryFn: fetchAdminAnalytics,
        staleTime: 120_000, // Analytics data can be 2 minutes stale
        refetchOnWindowFocus: false, // Don't hammer the analytics endpoint on focus
    });
}
