// components/course/EnrollmentCard.tsx
export function EnrollmentCard({ price }: { price: number }) {
    return (
        <div className="sticky top-28 card bg-base-100 shadow-2xl border border-base-content/10 overflow-hidden">
            <figure className="aspect-video bg-neutral flex items-center justify-center relative group cursor-pointer">
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                        <span className="text-white text-2xl">▶</span>
                    </div>
                </div>
                <img src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800" alt="Preview" />
            </figure>
            <div className="card-body p-8">
                <div className="flex items-baseline gap-2 mb-6">
                    <span className="text-4xl font-black text-primary">${price}</span>
                    <span className="text-lg opacity-50 line-through">$299.99</span>
                </div>
                
                <div className="space-y-4">
                    <button className="btn btn-primary btn-lg w-full shadow-lg shadow-primary/20">
                        Enroll Now
                    </button>
                    <button className="btn btn-outline btn-lg w-full">
                        Add to Wishlist
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