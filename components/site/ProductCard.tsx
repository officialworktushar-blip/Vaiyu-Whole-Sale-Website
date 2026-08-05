import Link from "next/link";
import Image from "next/image";
import type { Category, Product } from "@/generated/prisma/client";
import { formatPrice } from "@/lib/format";
import AddToCartButton from "@/components/site/AddToCartButton";

export type ProductWithCategory = Product & { category: Category };

const FALLBACK_IMAGE = "https://placehold.co/600x600?text=Product";

export default function ProductCard({
  product,
}: {
  product: ProductWithCategory;
}) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md">
      <Link
        href={`/product/${product.id}`}
        className="relative block aspect-square overflow-hidden bg-gray-100"
      >
        <Image
          src={product.images[0] ?? FALLBACK_IMAGE}
          alt={product.name}
          fill
          unoptimized
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 100vw"
          className="object-cover transition duration-300 group-hover:scale-105"
        />
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <Link href={`/products/${product.category.slug}`}>
          <span className="w-fit rounded-full bg-orange-50 px-2.5 py-0.5 text-xs font-medium text-brand-orange transition-colors hover:bg-brand-orange hover:text-white">
            {product.category.name}
          </span>
        </Link>
        <Link href={`/product/${product.id}`}>
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
        <AddToCartButton
          productId={product.id}
          name={product.name}
          price={product.price.toNumber()}
          image={product.images[0] ?? FALLBACK_IMAGE}
          stock={product.stock}
        />
      </div>
    </article>
  );
}
