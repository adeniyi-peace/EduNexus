// components/admin/shared/AdminTableSkeleton.tsx
// Reusable skeleton loader for admin data tables — prevents layout shift during fetches

interface AdminTableSkeletonProps {
    rows?: number;
    columns?: number;
}

export function AdminTableSkeleton({ rows = 6, columns = 5 }: AdminTableSkeletonProps) {
    return (
        <div className="card bg-base-100 border border-base-content/5 shadow-sm overflow-hidden animate-pulse">
            {/* Table Header */}
            <div className="flex items-center gap-4 p-4 border-b border-base-content/5">
                {Array.from({ length: columns }).map((_, i) => (
                    <div
                        key={i}
                        className="h-3 bg-base-300 rounded-full"
                        style={{ width: `${60 + (i % 3) * 20}px` }}
                    />
                ))}
            </div>
            {/* Table Rows */}
            {Array.from({ length: rows }).map((_, rowIdx) => (
                <div
                    key={rowIdx}
                    className="flex items-center gap-4 p-4 border-b border-base-content/5 last:border-0"
                >
                    {/* Avatar placeholder */}
                    <div className="w-9 h-9 rounded-full bg-base-300 flex-shrink-0" />
                    {/* Cell placeholders */}
                    {Array.from({ length: columns - 1 }).map((_, colIdx) => (
                        <div
                            key={colIdx}
                            className="h-3 bg-base-300 rounded-full flex-1"
                            style={{ maxWidth: `${100 + (colIdx % 4) * 40}px`, opacity: 1 - colIdx * 0.1 }}
                        />
                    ))}
                </div>
            ))}
        </div>
    );
}

// Stat card skeleton — for KPI grids
export function AdminStatSkeleton({ count = 4 }: { count?: number }) {
    return (
        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-${count} gap-4 md:gap-6`}>
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="card bg-base-100 border border-base-content/5 shadow-sm p-6 animate-pulse">
                    <div className="flex items-start justify-between mb-4">
                        <div className="w-10 h-10 rounded-xl bg-base-300" />
                        <div className="w-16 h-5 rounded-full bg-base-300" />
                    </div>
                    <div className="h-8 w-32 bg-base-300 rounded-lg mb-2" />
                    <div className="h-3 w-24 bg-base-300/70 rounded-full" />
                </div>
            ))}
        </div>
    );
}

// Error state for admin tables
interface AdminErrorStateProps {
    message?: string;
    onRetry?: () => void;
}

export function AdminErrorState({ message = "Failed to load data.", onRetry }: AdminErrorStateProps) {
    return (
        <div className="card bg-base-100 border border-error/20 shadow-sm p-12 text-center">
            <div className="text-4xl mb-4">⚠️</div>
            <h3 className="text-lg font-black mb-2">Something went wrong</h3>
            <p className="text-sm opacity-50 font-medium mb-4">{message}</p>
            {onRetry && (
                <button className="btn btn-sm btn-outline btn-error mx-auto" onClick={onRetry}>
                    Try Again
                </button>
            )}
        </div>
    );
}
