import { useLoaderData } from "react-router";
import type { Route } from "./+types/courses.$courseId.learn";
import CoursePlayer from "~/components/dashboard/course_player/CoursePlayer";

export function meta() {
    return [
        { title: "Learning | EduNexus" },
        { name: "description", content: "EduNexus course player — learn at your pace." },
    ];
}

export async function loader({ request, params }: Route.LoaderArgs) {
    const url = new URL(request.url);
    return {
        courseId: params.id as string,
        lessonId: url.searchParams.get("lessonId"),
    };
}

export default function LearnRoute() {
    const { courseId, lessonId } = useLoaderData<typeof loader>();
    return <CoursePlayer courseId={courseId} initialLessonId={lessonId} />;
}