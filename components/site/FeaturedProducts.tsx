import Link from "next/link";
import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import type { Category, Product } from "@/generated/prisma/client";
import { formatPrice } from "@/lib/format";

type FeaturedProduct = Product & { category: Category };

const FALLBACK_IMAGE = "https://placehold.co/600x600?text=Product";

export default function FeaturedProducts({
  products,
}: {
  products: FeaturedProduct[];
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
            <article
              key={product.id}
              className="group flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
            >
              <Link
                href={`/products/${product.slug}`}
                className="relative block aspect-square overflow-hidden bg-gray-100"
              >
                <Image
                  src={product.images[0] ?? FALLBACK_IMAGE}
                  alt={product.name}
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 100vw"
                  className="object-cover transition duration-300 group-hover:scale-105"
                />
              </Link>

              <div className="flex flex-1 flex-col p-4">
                <span className="w-fit rounded-full bg-orange-50 px-2.5 py-0.5 text-xs font-medium text-brand-orange">
                  {product.category.name}
                </span>
                <Link href={`/products/${product.slug}`}>
                  <h3 className="mt-3 line-clamp-2 font-semibold text-brand-navy transition-colors group-hover:text-brand-orange">
                    {product.name}
                  </h3>
                </Link>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-lg font-bold text-brand-navy">
                    {formatPrice(product.price.toNumber())}
                  </span>
                  {product.mrp && (
                    <span className="text-sm text-brand-gray line-through">
                      {formatPrice(product.mrp.toNumber())}
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-md bg-brand-gradient px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
                >
                  <ShoppingCart className="h-4 w-4" />
                  Add to Cart
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
