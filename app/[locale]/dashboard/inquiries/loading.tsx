export default function Loading() {
    return (
        <div className="p-6 lg:p-8 animate-pulse">
            <div className="mb-6">
                <div className="h-7 w-56 bg-slate-200 rounded-lg mb-2" />
                <div className="h-4 w-80 bg-slate-100 rounded" />
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-6">
                <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="flex items-center gap-4 py-3 border-b border-slate-100 last:border-0">
                            <div className="w-10 h-10 bg-slate-200 rounded-lg" />
                            <div className="flex-1">
                                <div className="h-4 w-48 bg-slate-200 rounded mb-2" />
                                <div className="h-3 w-32 bg-slate-100 rounded" />
                            </div>
                            <div className="h-6 w-20 bg-slate-200 rounded-full" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
