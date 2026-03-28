// hooks/student/useStudentDashboard.ts
// TanStack Query hook for the Student Dashboard: notifications, achievements, stats

import { useQuery } from "@tanstack/react-query";
import api from "~/utils/api.client";
import type { StudentDashboardData } from "~/types/students";

async function fetchStudentDashboard(): Promise<StudentDashboardData> {
    const { data } = await api.get<StudentDashboardData>("/users/student/dashboard/");
    return data;
}

export function useStudentDashboard() {
    return useQuery({
        queryKey: ["student", "dashboard"],
        queryFn: fetchStudentDashboard,
        staleTime: 30_000, // 30 seconds
        refetchOnWindowFocus: true,
    });
}
