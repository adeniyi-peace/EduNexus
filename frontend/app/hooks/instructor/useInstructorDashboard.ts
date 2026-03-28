// hooks/instructor/useInstructorDashboard.ts
// TanStack Query hook for the Instructor Dashboard KPIs, courses, and activity feed

import { useQuery } from "@tanstack/react-query";
import api from "~/utils/api.client";
import type { InstructorDashboardData } from "~/types/instructor";

async function fetchInstructorDashboard(): Promise<InstructorDashboardData> {
    const { data } = await api.get<InstructorDashboardData>("/users/instructor/dashboard/");
    return data;
}

export function useInstructorDashboard() {
    return useQuery({
        queryKey: ["instructor", "dashboard"],
        queryFn: fetchInstructorDashboard,
        staleTime: 30_000,
        refetchOnWindowFocus: true,
    });
}
