// hooks/admin/useAdminDashboard.ts
// TanStack Query hook for the Admin Dashboard KPIs, pending approvals, and activity feed

import { useQuery } from "@tanstack/react-query";
import api from "~/utils/api.client";
import type { AdminDashboardData } from "~/types/admin";

async function fetchAdminDashboard(): Promise<AdminDashboardData> {
    const { data } = await api.get<AdminDashboardData>("/users/admin/dashboard/");
    return data;
}

export function useAdminDashboard() {
    return useQuery({
        queryKey: ["admin", "dashboard"],
        queryFn: fetchAdminDashboard,
        staleTime: 30_000, // 30 seconds — dashboard data can go slightly stale
        refetchOnWindowFocus: true,
    });
}
