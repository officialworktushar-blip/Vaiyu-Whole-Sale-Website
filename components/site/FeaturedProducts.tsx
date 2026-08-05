import ProductCard from "@/components/site/ProductCard";
import Link from "next/link";
import type { ProductWithCategory } from "@/components/site/ProductCard";

export default function FeaturedProducts({
  products,
}: {
  products: ProductWithCategory[];
}) {
  return (
    <section className="bg-gray-50 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-brand-orange">
              Featured
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-brand-navy">
              Bestsellers &amp; New Arrivals
            </h2>
          </div>
          <Link
            href="/products"
            className="text-sm font-semibold text-brand-orange transition-colors hover:text-brand-red"
          >
            View all products &rarr;
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
