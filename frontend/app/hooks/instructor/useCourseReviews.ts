// hooks/instructor/useCourseReviews.ts
// TanStack Query hook for fetching reviews for a specific course
// Uses a 2-step fetch: resolves slug → real ID via course-analytics, then fetches reviews

import { useQuery } from "@tanstack/react-query";
import api from "~/utils/api.client";
import type { CourseReviewsPageData, CourseReview } from "~/types/instructor";

async function fetchCourseReviews(slug: string): Promise<CourseReviewsPageData> {
    // Step 1: Resolve slug → real course ID via course analytics endpoint
    const courseRes = await api.get(`/users/instructor/course-analytics/${slug}/`);
    const courseData = courseRes.data;
    const realCourseId = courseData.id || slug;

    // Step 2: Fetch reviews using the real UUID
    let reviewsData: CourseReview[] = [];
    try {
        const reviewsRes = await api.get(`/courses/${realCourseId}/reviews/`);
        // Handle both Array and DRF Paginated Response ({ results: [] })
        reviewsData = Array.isArray(reviewsRes.data)
            ? reviewsRes.data
            : (reviewsRes.data?.results || []);
    } catch (revErr) {
        console.error("Reviews fetch error:", revErr);
    }

    return {
        courseTitle: courseData.courseTitle || "Course",
        reviews: reviewsData,
    };
}

export function useCourseReviews(slug: string | undefined) {
    return useQuery({
        queryKey: ["instructor", "course-reviews", slug],
        queryFn: () => fetchCourseReviews(slug!),
        enabled: !!slug,
        staleTime: 30_000,
        refetchOnWindowFocus: true,
    });
}
