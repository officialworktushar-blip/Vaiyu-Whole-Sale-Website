export default function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="animate-skeleton aspect-square w-full" />
      <div className="space-y-3 p-4">
        <div className="animate-skeleton h-5 w-16 rounded-full" />
        <div className="animate-skeleton h-4 w-full rounded" />
        <div className="animate-skeleton h-4 w-3/4 rounded" />
        <div className="animate-skeleton h-6 w-20 rounded" />
        <div className="animate-skeleton h-10 w-full rounded-md" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
}
