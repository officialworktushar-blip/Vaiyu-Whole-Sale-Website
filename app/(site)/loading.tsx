import { ProductGridSkeleton } from "@/components/site/ProductCardSkeleton";

export default function Loading() {
  return (
    <>
      <div className="animate-skeleton h-[420px] w-full sm:h-[500px] lg:h-[560px]" />
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="animate-skeleton mx-auto h-8 w-56 rounded" />
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="animate-skeleton aspect-square rounded-xl" />
          ))}
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="animate-skeleton h-8 w-72 rounded" />
        <div className="mt-8">
          <ProductGridSkeleton count={4} />
        </div>
      </section>
    </>
  );
}
