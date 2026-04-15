import { useState, useEffect } from "react";
import { Link } from "react-router";
import api from "~/utils/api.client";
import { CourseCard } from "~/components/ui/CourseCard";
import { Heart, BookOpen, ArrowRight } from "lucide-react";

export const meta = () => {
  return [
    { title: "My Wishlist | EduNexus" },
    { name: "description", content: "My Wishlist Page" },
  ];
};

export default function WishlistPage() {
    const [wishlistItems, setWishlistItems] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchWishlist = async () => {
            try {
                const res = await api.get("/wishlists/");
                // Handle both paginated and unpaginated responses
                setWishlistItems(Array.isArray(res.data) ? res.data : (res.data.results || []));
            } catch (err) {
                console.error("Failed to fetch wishlist", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchWishlist();
    }, []);

    const removeFromWishlist = async (id: number) => {
        try {
            await api.delete(`/wishlists/${id}/`);
            setWishlistItems(wishlistItems.filter(item => item.id !== id));
        } catch (err) {
            console.error("Failed to remove from wishlist", err);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    return (
        <div className="space-y-10 pb-20 animate-in fade-in duration-700">
            {/* Header Section */}
            <header className="mb-10">
                <div className="flex items-center gap-4 mb-2">
                    <span className="h-px w-12 bg-secondary/30"></span>
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-secondary">Saved Modules</span>
                </div>
                <h1 className="text-4xl font-black italic tracking-tight uppercase">My Wishlist</h1>
                <p className="text-base-content/50 mt-2 font-medium">Your curated collection of future learning paths.</p>
            </header>

            {wishlistItems.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {wishlistItems.map((item, idx) => (
                        <div
                            key={item.id}
                            className="relative group animate-in zoom-in-95 duration-500 fill-mode-both"
                            style={{ animationDelay: `${idx * 50}ms` }}
                        >
                            <CourseCard course={item.course_details} />
                            <button
                                onClick={() => removeFromWishlist(item.id)}
                                className="absolute top-4 right-4 z-10 btn btn-circle btn-sm bg-base-100/80 backdrop-blur-md border-none shadow-lg text-error hover:bg-error hover:text-white transition-all transform group-hover:scale-110"
                                title="Remove from wishlist"
                            >
                                <Heart size={16} className="fill-current" />
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                /* Empty State */
                <div className="flex flex-col items-center justify-center py-32 bg-base-200/30 rounded-[3rem] border border-dashed border-base-content/10 animate-in fade-in zoom-in-95">
                    <div className="relative mb-8">
                        <div className="absolute inset-0 bg-secondary/20 blur-3xl rounded-full"></div>
                        <div className="relative w-24 h-24 bg-base-100 rounded-[2rem] flex items-center justify-center text-4xl border border-base-content/5 shadow-inner">
                            <Heart className="text-secondary opacity-40" size={40} />
                        </div>
                    </div>
                    <h3 className="text-2xl font-black opacity-60 uppercase tracking-[0.2em]">Wislist Empty</h3>
                    <p className="max-w-xs text-center text-sm opacity-40 mt-4 font-medium leading-relaxed">
                        You haven't bookmarked any courses yet. Start exploring the marketplace to build your learning path.
                    </p>
                    <Link
                        to="/courses"
                        className="btn btn-secondary mt-8 rounded-2xl px-8 shadow-xl shadow-secondary/20 gap-2 font-black uppercase tracking-widest text-[10px]"
                    >
                        Explore Courses
                        <ArrowRight size={14} />
                    </Link>
                </div>
            )}
        </div>
    );
}
