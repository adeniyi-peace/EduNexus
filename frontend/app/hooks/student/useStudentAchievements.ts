// hooks/student/useStudentAchievements.ts
// TanStack Query hooks for achievements and certificates on the Achievements Page

import { useQuery } from "@tanstack/react-query";
import api from "~/utils/api.client";
import type { DashboardAchievement } from "~/types/students";
import type { Certificate } from "~/types/course";

async function fetchUserAchievements(): Promise<DashboardAchievement[]> {
    const { data } = await api.get("/users/user-achievements/");
    return Array.isArray(data) ? data : (data.results || []);
}

async function fetchUserCertificates(): Promise<Certificate[]> {
    const { data } = await api.get("/certificates/");
    return Array.isArray(data) ? data : (data.results || []);
}

export function useStudentAchievements() {
    return useQuery({
        queryKey: ["student", "achievements"],
        queryFn: fetchUserAchievements,
        staleTime: 60_000,
    });
}

export function useStudentCertificates() {
    return useQuery({
        queryKey: ["student", "certificates"],
        queryFn: fetchUserCertificates,
        staleTime: 60_000,
    });
}
