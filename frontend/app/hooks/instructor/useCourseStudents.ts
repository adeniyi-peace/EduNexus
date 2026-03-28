// hooks/instructor/useCourseStudents.ts
// TanStack Query hook for listing students enrolled in a specific course

import { useQuery } from "@tanstack/react-query";
import api from "~/utils/api.client";
import type { Student } from "~/types/students";

interface CourseStudentsResponse {
    students: Student[];
}

async function fetchCourseStudents(courseId: string): Promise<Student[]> {
    const { data } = await api.get<CourseStudentsResponse>(
        `/users/instructor/courses/${courseId}/students/`
    );
    return data.students;
}

export function useCourseStudents(courseId: string | undefined) {
    return useQuery({
        queryKey: ["instructor", "course-students", courseId],
        queryFn: () => fetchCourseStudents(courseId!),
        enabled: !!courseId,
        staleTime: 30_000,
        refetchOnWindowFocus: true,
    });
}
