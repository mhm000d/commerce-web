export function ProductsGridSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="flex flex-col bg-white rounded-lg border border-slate-200 overflow-hidden animate-pulse"
        >
          <div className="aspect-square bg-slate-100" />
          <div className="p-4 flex flex-col gap-3">
            <div className="h-4 bg-slate-100 rounded w-3/4" />
            <div className="h-3 bg-slate-100 rounded w-1/2" />
            <div className="h-5 bg-slate-100 rounded w-1/4 mt-auto" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="h-8 bg-slate-100 rounded w-32 mb-8 animate-pulse" />
      <ProductsGridSkeleton />
    </div>
  );
}