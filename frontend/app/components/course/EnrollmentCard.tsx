import { useState, useEffect } from "react";
import api from "~/utils/api.client";
import { Heart, Play, FileText, Globe, Award, Infinity, Smartphone } from "lucide-react";
import { useUserContext } from "~/hooks/useUserContext";
import type { CourseData } from "~/types/course";
import { useFreeEnrollment } from "~/hooks/useFreeEnrollment";

export function EnrollmentCard({ course }: { course: CourseData }) {
    const { price, id: courseId, thumbnail, duration, modules, certificateConfig } = course;
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [wishlistId, setWishlistId] = useState<number | null>(null);

    const { isAuthenticated } = useUserContext();
    const { handleEnrollment, isEnrolling } = useFreeEnrollment();

    // Calculate total resources
    const totalResources = modules?.reduce((acc, module) => {
        return acc + module.lessons.reduce((lAcc, lesson) => lAcc + (lesson.resources?.length || 0), 0);
    }, 0) || 0;

    useEffect(() => {
        // Check if item is in wishlist on mount (only for logged-in users)
        const checkWishlist = async () => {
            if (!isAuthenticated) return;

            try {
                const res = await api.get("/wishlists/");
                const data = Array.isArray(res.data) ? res.data : (res.data.results || []);
                const item = data.find((w: any) => w.course === courseId || w.course === parseInt(courseId));
                if (item) {
                    setIsWishlisted(true);
                    setWishlistId(item.id);
                }
            } catch (err) {
                console.error("Wishlist check failed", err);
            }
        };
        checkWishlist();
    }, [courseId, isAuthenticated]);

    const toggleWishlist = async (): Promise<void> => {
        if (!isAuthenticated) {
            // Redirect to login if trying to wishlist while not logged in
            window.location.href = "/login?next=" + window.location.pathname;
            return;
        }

        try {
            if (isWishlisted && wishlistId) {
                await api.delete(`/wishlists/${wishlistId}/`);
                setIsWishlisted(false);
                setWishlistId(null);
            } else {
                const res = await api.post("/wishlists/", { course: courseId });
                setIsWishlisted(true);
                setWishlistId(res.data.id);
            }
        } catch (err) {
            console.error("Wishlist toggle failed", err);
        }
    };

    return (
        <div className="sticky top-28 card bg-base-100 shadow-2xl border border-base-content/10 overflow-hidden rounded-[2.5rem]">
            <figure className="aspect-video bg-neutral flex items-center justify-center relative group cursor-pointer overflow-hidden">
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all flex items-center justify-center z-10">
                    <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 group-hover:scale-110 transition-transform">
                        <Play className="text-white fill-current ml-1" size={24} />
                    </div>
                </div>
                <img 
                    src={thumbnail || "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800"} 
                    alt={course.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                />
            </figure>
            <div className="card-body p-8">
                <div className="flex items-baseline gap-2 mb-6">
                    <span className="text-4xl font-black text-primary">${price}</span>
                    {price && price > 0 && <span className="text-lg opacity-50 line-through">${(Number(price) * 1.5).toFixed(2)}</span>}
                </div>

                <div className="space-y-4">
                    <button 
                        onClick={() => handleEnrollment(courseId, price)}
                        disabled={isEnrolling}
                        className="btn btn-primary btn-lg w-full shadow-lg shadow-primary/20 font-black rounded-2xl h-16"
                    >
                        {isEnrolling ? "Processing..." : (price == 0 || !price) ? "Enroll for Free" : "Buy Now"}
                    </button>
                    <button
                        onClick={toggleWishlist}
                        className={`btn btn-lg w-full gap-3 h-16 rounded-2xl border-2 ${isWishlisted ? 'btn-secondary text-secondary-content' : 'btn-outline'}`}
                    >
                        <Heart className={isWishlisted ? "fill-current" : ""} size={20} />
                        {isWishlisted ? "In Wishlist" : "Add to Wishlist"}
                    </button>
                </div>

                <div className="mt-8 space-y-4">
                    <p className="font-bold text-xs uppercase tracking-[0.2em] opacity-40">This course includes:</p>
                    <ul className="space-y-4 text-sm font-medium">
                        <li className="flex items-center gap-3">
                            <Play size={18} className="text-primary opacity-70" /> 
                            <span>{duration || "24 hours"} on-demand video</span>
                        </li>
                        {totalResources > 0 && (
                            <li className="flex items-center gap-3">
                                <FileText size={18} className="text-primary opacity-70" /> 
                                <span>{totalResources} downloadable resources</span>
                            </li>
                        )}
                        <li className="flex items-center gap-3">
                            <Infinity size={18} className="text-primary opacity-70" /> 
                            <span>Full lifetime access</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <Smartphone size={18} className="text-primary opacity-70" /> 
                            <span>Access on mobile and TV</span>
                        </li>
                        {certificateConfig && (
                            <li className="flex items-center gap-3">
                                <Award size={18} className="text-primary opacity-70" /> 
                                <span>Certificate of completion</span>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    );
}