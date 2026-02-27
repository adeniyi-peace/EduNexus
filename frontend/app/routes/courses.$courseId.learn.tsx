import { redirect, useLoaderData } from "react-router";
// import { requireUser, getUser } from "~/utils/auth.server";
// import { api } from "~/utils/api.server";
import CoursePlayer from "~/components/dashboard/course_player/CoursePlayer";

export async function loader({ request, params }: { request: Request, params: { courseId: string } }) {
    const url = new URL(request.url);
    const lessonId = url.searchParams.get("lessonId");

    // 1. Get the current user (if any). Do NOT force a redirect to login yet!
    // const user = await getUser(request); 
    const user = null; // Simulating an unauthenticated user for this example

    // 2. Fetch the course and lesson data from your Django backend
    // const courseData = await api.getCourse(params.courseId);
    
    // Dummy check for the specific lesson being requested
    const isPreviewLesson = true; // Pretend we checked the DB and this lesson IS a preview
    const isUserEnrolled = false; // Pretend we checked the DB and the user is NOT enrolled

    // 3. THE HYBRID LOGIC GATEWAY
    if (!user && !isPreviewLesson) {
        // Unauthenticated user trying to access a locked lesson -> Kick to login or course page
        throw redirect(`/courses/${params.courseId}?error=login_required`);
    }

    if (user && !isUserEnrolled && !isPreviewLesson) {
        // Authenticated user, but didn't buy the course, trying to access a locked lesson -> Kick to checkout
        throw redirect(`/courses/${params.courseId}?error=enrollment_required`);
    }

    // 4. If they made it here, they are either:
    // A) Enrolled students (full access)
    // B) Public users accessing a valid Preview lesson (limited access)
    return {
        courseId: params.courseId,
        lessonId: lessonId,
        isEnrolled: isUserEnrolled,
        // ... pass down the actual course/lesson data
    };
}

export default function LearnRoute() {
    const data = useLoaderData<typeof loader>();

    // We pass the enrollment status down to the player so it knows how to behave
    return (
        <CoursePlayer 
            isEnrolled={data.isEnrolled} 
            initialLessonId={data.lessonId}
            // courseData={data.courseData}
        />
    );
}