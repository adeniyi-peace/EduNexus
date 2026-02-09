// app/components/ui/Skeletons.tsx

export function CourseCardSkeleton() {
    return (
        <div className="card bg-base-100 border border-base-content/5 shadow-sm">
            <div className="skeleton h-52 w-full rounded-b-none"></div>
            <div className="card-body p-6 space-y-4">
                <div className="skeleton h-4 w-24"></div>
                <div className="skeleton h-6 w-full"></div>
                <div className="skeleton h-4 w-3/4"></div>
                <div className="divider my-0 opacity-5"></div>
                <div className="flex justify-between items-center">
                    <div className="skeleton h-8 w-20"></div>
                    <div className="skeleton h-10 w-24"></div>
                </div>
            </div>
        </div>
    );
}

export function MarketplaceSkeleton() {
    return (
        <div className="container mx-auto px-4 py-12 animate-pulse">
            {/* Section Header Skeleton */}
            <div className="max-w-3xl mb-12">
                <div className="skeleton h-10 w-64 mb-4"></div>
                <div className="skeleton h-4 w-full mb-2"></div>
                <div className="skeleton h-4 w-2/3"></div>
            </div>

            <div className="flex flex-col lg:flex-row gap-10 mt-12">
                {/* Sidebar Skeleton */}
                <aside className="w-full lg:w-72 space-y-8">
                    <div className="skeleton h-80 w-full rounded-3xl"></div>
                </aside>

                {/* Grid Skeleton */}
                <main className="flex-1">
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                        {[...Array(6)].map((_, i) => (
                            <CourseCardSkeleton key={i} />
                        ))}
                    </div>
                </main>
            </div>
        </div>
    );
}