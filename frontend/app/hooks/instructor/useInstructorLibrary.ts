// hooks/instructor/useInstructorLibrary.ts
// TanStack Query hook for fetching the instructor's course library
// Replaces the hardcoded MOCK_DATA in AssetLibrary.tsx

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "~/utils/api.client";
import type { InstructorLibraryCourse } from "~/types/instructor";

async function fetchInstructorLibrary(): Promise<InstructorLibraryCourse[]> {
    // The instructor's courses are available via the courses endpoint
    // filtered by the authenticated instructor
    const { data } = await api.get("/courses/courses/", {
        params: { instructor: "me" },
    });
    // Handle paginated or flat response
    const courses = Array.isArray(data) ? data : (data?.results || []);
    return courses.map((course: any) => ({
        id: course.id || course.slug,
        title: course.title,
        thumbnail: course.thumbnail || undefined,
        category: course.category || "Uncategorized",
        students: course.student_count ?? course.students ?? 0,
        rating: course.rating ?? course.instructor_rating ?? 0,
        status: course.status || "Draft",
        lastUpdated: course.updated_at || course.created_at || "",
        price: course.price ?? 0,
        instructor: course.instructor?.fullname || course.instructor_name || "",
        duration: course.duration || "0h",
        modules: [],
        difficulty: course.difficulty || "Beginner",
    }));
}

export function useInstructorLibrary() {
    return useQuery({
        queryKey: ["instructor", "library"],
        queryFn: fetchInstructorLibrary,
        staleTime: 30_000,
        refetchOnWindowFocus: true,
    });
}

export function useDeleteCourse() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (courseId: string) => {
            await api.delete(`/courses/courses/${courseId}/`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["instructor", "library"] });
            queryClient.invalidateQueries({ queryKey: ["instructor", "dashboard"] });
        },
    });
}
