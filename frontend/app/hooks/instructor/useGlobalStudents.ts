// hooks/instructor/useGlobalStudents.ts
// TanStack Query hook for listing all students across all instructor courses

import { useQuery } from "@tanstack/react-query";
import api from "~/utils/api.client";
import type { Student } from "~/types/students";

interface GlobalStudentsResponse {
    students: Student[];
}

async function fetchGlobalStudents(): Promise<Student[]> {
    const { data } = await api.get<GlobalStudentsResponse>("/users/instructor/students/");
    return data.students;
}

export function useGlobalStudents() {
    return useQuery({
        queryKey: ["instructor", "global-students"],
        queryFn: fetchGlobalStudents,
        staleTime: 30_000,
        refetchOnWindowFocus: true,
    });
}
