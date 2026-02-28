export default function DashboardLoading() {
    return (
        <div className="p-6 lg:p-8 animate-pulse">
            {/* Header Skeleton */}
            <div className="mb-8">
                <div className="h-8 w-64 bg-slate-200 rounded-lg mb-2" />
                <div className="h-4 w-96 bg-slate-100 rounded-lg" />
            </div>

            {/* Stats Grid Skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="bg-white border border-slate-200 rounded-xl p-5">
                        <div className="flex items-center justify-between mb-3">
                            <div className="h-4 w-24 bg-slate-200 rounded" />
                            <div className="w-2 h-2 rounded-full bg-slate-200" />
                        </div>
                        <div className="h-8 w-16 bg-slate-200 rounded-lg" />
                    </div>
                ))}
            </div>

            {/* Content Skeleton */}
            <div className="bg-white border border-slate-200 rounded-xl p-6">
                <div className="h-6 w-48 bg-slate-200 rounded-lg mb-6" />
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-slate-200 rounded-xl" />
                            <div className="flex-1">
                                <div className="h-4 w-40 bg-slate-200 rounded mb-2" />
                                <div className="h-3 w-64 bg-slate-100 rounded" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
