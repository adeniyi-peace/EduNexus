// hooks/instructor/useAllCourseReviews.ts
// TanStack Query hook for the "All Course Reviews" overview page
// Fetches dashboard data + reviews per course to build review summaries

import { useQuery } from "@tanstack/react-query";
import api from "~/utils/api.client";
import type { AllCourseReviewsData, CourseReviewSummary } from "~/types/instructor";

async function fetchAllCourseReviews(): Promise<AllCourseReviewsData> {
    // Fetch instructor dashboard data which includes course list
    const response = await api.get("/users/instructor/dashboard/");
    const dashboardData = response.data;

    // Map courses with review data
    const coursesWithReviews: CourseReviewSummary[] = await Promise.all(
        (dashboardData.myCourses || []).map(async (course: any) => {
            try {
                const reviewsRes = await api.get(`/courses/${course.id}/reviews/`);
                const reviews = Array.isArray(reviewsRes.data)
                    ? reviewsRes.data
                    : (reviewsRes.data?.results || []);

                // Calculate rating distribution
                const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
                let totalRating = 0;
                reviews.forEach((review: any) => {
                    const rating = Math.round(review.rating);
                    if (rating >= 1 && rating <= 5) {
                        distribution[rating as keyof typeof distribution]++;
                        totalRating += review.rating;
                    }
                });

                return {
                    id: course.id,
                    slug: course.slug || course.id,
                    title: course.title,
                    thumbnail: course.thumbnail,
                    totalReviews: reviews.length,
                    averageRating: reviews.length > 0 ? totalRating / reviews.length : 0,
                    fiveStar: distribution[5],
                    fourStar: distribution[4],
                    threeStar: distribution[3],
                    twoStar: distribution[2],
                    oneStar: distribution[1],
                };
            } catch {
                return {
                    id: course.id,
                    slug: course.slug || course.id,
                    title: course.title,
                    thumbnail: course.thumbnail,
                    totalReviews: 0,
                    averageRating: 0,
                    fiveStar: 0,
                    fourStar: 0,
                    threeStar: 0,
                    twoStar: 0,
                    oneStar: 0,
                };
            }
        })
    );

    return { courses: coursesWithReviews };
}

export function useAllCourseReviews() {
    return useQuery({
        queryKey: ["instructor", "all-course-reviews"],
        queryFn: fetchAllCourseReviews,
        staleTime: 60_000,
        refetchOnWindowFocus: true,
    });
}
