export function CourseCardSkeleton() {
    return (
        <div className="card bg-base-100 border border-base-content/5 shadow-sm rounded-[2rem] overflow-hidden">
            <div className="skeleton h-56 w-full rounded-none"></div>
            <div className="card-body p-8 space-y-6">
                <div className="flex justify-between">
                    <div className="skeleton h-6 w-24 rounded-lg"></div>
                    <div className="skeleton h-6 w-16 rounded-lg"></div>
                </div>
                <div className="space-y-3">
                    <div className="skeleton h-8 w-full rounded-lg"></div>
                    <div className="skeleton h-8 w-4/5 rounded-lg"></div>
                </div>
                <div className="skeleton h-6 w-32 rounded-lg opacity-40"></div>
                <div className="divider my-0 opacity-5"></div>
                <div className="flex justify-between items-center pt-2">
                    <div className="skeleton h-10 w-24 rounded-xl"></div>
                    <div className="skeleton h-12 w-32 rounded-2xl"></div>
                </div>
            </div>
        </div>
    );
}

export function MarketplaceSkeleton() {
    return (
        <div className="container mx-auto px-4 py-16 animate-pulse">
            <div className="max-w-3xl mb-16">
                <div className="skeleton h-12 w-80 mb-6 rounded-2xl"></div>
                <div className="skeleton h-5 w-full rounded-lg mb-2"></div>
                <div className="skeleton h-5 w-2/3 rounded-lg"></div>
            </div>

            <div className="flex flex-col lg:flex-row gap-12 mt-12">
                <aside className="w-full lg:w-80 space-y-8">
                    <div className="skeleton h-[500px] w-full rounded-[2.5rem]"></div>
                </aside>

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