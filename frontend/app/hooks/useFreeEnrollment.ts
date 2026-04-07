import { useState } from "react";
import api from "~/utils/api.client";
import { useUserContext } from "~/hooks/useUserContext";

export function useFreeEnrollment() {
    const { isAuthenticated } = useUserContext();
    const [isEnrolling, setIsEnrolling] = useState(false);

    const handleEnrollment = async (courseId: string | number, price: number | string | undefined | null) => {
        if (!isAuthenticated) {
            window.location.href = "/login?next=" + window.location.pathname;
            return;
        }

        if (price == 0 || !price) {
            setIsEnrolling(true);
            try {
                const source = localStorage.getItem("first_touch_source") || "Direct";
                await api.post("/enrollments/", { course: courseId, traffic_source: source });
                window.location.href = `/courses/${courseId}/learn`;
            } catch (err) {
                console.error("Enrollment failed", err);
                setIsEnrolling(false);
            }
            // Note: If success, we redirect, so no need to turn off isEnrolling
        } else {
            window.location.href = "/checkout";
        }
    };

    return { handleEnrollment, isEnrolling };
}
