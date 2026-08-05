export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="animate-skeleton h-4 w-48 rounded" />
      <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-2">
        <div className="animate-skeleton aspect-square w-full rounded-xl" />
        <div className="space-y-4">
          <div className="animate-skeleton h-4 w-24 rounded-full" />
          <div className="animate-skeleton h-8 w-full rounded" />
          <div className="animate-skeleton h-8 w-3/4 rounded" />
          <div className="animate-skeleton h-6 w-32 rounded" />
          <div className="animate-skeleton h-24 w-full rounded" />
          <div className="animate-skeleton h-12 w-full rounded-md" />
          <div className="animate-skeleton h-12 w-full rounded-md" />
        </div>
      </div>
    </div>
  );
}
