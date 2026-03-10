import { useState, useEffect } from "react";
import api from "~/utils/api.client";
import { Heart } from "lucide-react";

export function EnrollmentCard({ price, courseId }: { price: number, courseId: string }) {
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [wishlistId, setWishlistId] = useState<number | null>(null);

    useEffect(() => {
        // Check if item is in wishlist on mount
        const checkWishlist = async () => {
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
    }, [courseId]);

    const toggleWishlist = async () => {
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
        <div className="sticky top-28 card bg-base-100 shadow-2xl border border-base-content/10 overflow-hidden">
            <figure className="aspect-video bg-neutral flex items-center justify-center relative group cursor-pointer">
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                        <span className="text-white text-2xl ml-1">▶</span>
                    </div>
                </div>
                <img src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800" alt="Preview" className="w-full h-full object-cover" />
            </figure>
            <div className="card-body p-8">
                <div className="flex items-baseline gap-2 mb-6">
                    <span className="text-4xl font-black text-primary">${price}</span>
                    <span className="text-lg opacity-50 line-through">$299.99</span>
                </div>

                <div className="space-y-4">
                    <button className="btn btn-primary btn-lg w-full shadow-lg shadow-primary/20 font-black">
                        Enroll Now
                    </button>
                    <button
                        onClick={toggleWishlist}
                        className={`btn btn-lg w-full gap-3 ${isWishlisted ? 'btn-secondary' : 'btn-outline border-2'}`}
                    >
                        <Heart className={isWishlisted ? "fill-current" : ""} size={20} />
                        {isWishlisted ? "In Wishlist" : "Add to Wishlist"}
                    </button>
                </div>

                <div className="mt-8 space-y-4">
                    <p className="font-bold text-sm uppercase tracking-widest opacity-60">This course includes:</p>
                    <ul className="space-y-3 text-sm">
                        <li className="flex items-center gap-3">✅ <span>24 hours on-demand video</span></li>
                        <li className="flex items-center gap-3">✅ <span>12 downloadable resources</span></li>
                        <li className="flex items-center gap-3">✅ <span>Full lifetime access</span></li>
                        <li className="flex items-center gap-3">✅ <span>Certificate of completion</span></li>
                    </ul>
                </div>
            </div>
        </div>
    );
}