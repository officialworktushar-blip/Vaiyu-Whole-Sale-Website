import { ProductGridSkeleton } from "@/components/site/ProductCardSkeleton";

export default function Loading() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="animate-skeleton h-4 w-32 rounded" />
      <div className="animate-skeleton mt-3 h-9 w-64 max-w-full rounded" />
      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[240px_1fr]">
        <aside className="animate-skeleton h-72 rounded-xl lg:block" />
        <div>
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="animate-skeleton h-11 w-full max-w-sm rounded-md" />
            <div className="animate-skeleton h-11 w-64 rounded-md" />
          </div>
          <ProductGridSkeleton count={6} />
        </div>
      </div>
    </section>
  );
}
