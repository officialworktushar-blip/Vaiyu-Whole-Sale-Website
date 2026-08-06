import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ChevronRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/format";
import ProductGallery from "@/components/site/ProductGallery";
import AddToCartSection from "@/components/site/AddToCartSection";
import ProductCard from "@/components/site/ProductCard";
import ProductReviews from "@/components/site/ProductReviews";

export const dynamic = "force-dynamic";

const FALLBACK_IMAGE = "https://placehold.co/600x600.png?text=Product";

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const product = await prisma.product.findUnique({
    where: { id: params.id },
    include: { category: true },
  });
  if (!product) {
    return { title: "Product Not Found | Vaiyu Industries" };
  }
  const description = product.description.slice(0, 160);
  const image = product.images[0] ?? FALLBACK_IMAGE;
  return {
    title: `${product.name} | Vaiyu Industries`,
    description,
    openGraph: {
      title: `${product.name} | Vaiyu Industries`,
      description,
      type: "website",
      images: [{ url: image, alt: product.name }],
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: { id: string };
}) {
  const product = await prisma.product.findUnique({
    where: { id: params.id },
    include: { category: true },
  });

  if (!product) {
    notFound();
  }

  const mrp = product.mrp;
  const discount =
    mrp && mrp.greaterThan(product.price)
      ? Math.round((1 - product.price.toNumber() / mrp.toNumber()) * 100)
      : null;

  const stockStatus =
    product.stock === 0
      ? { label: "Out of Stock", className: "bg-red-50 text-brand-red" }
      : product.stock <= 5
        ? {
            label: `Only ${product.stock} left`,
            className: "bg-orange-50 text-brand-orange",
          }
        : { label: "In Stock", className: "bg-green-50 text-green-600" };

  const isOutOfStock = product.stock === 0;

  const relatedProducts = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      id: { not: product.id },
      isActive: true,
    },
    include: { category: true },
    orderBy: { createdAt: "desc" },
    take: 4,
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <nav aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-2 text-sm text-brand-gray">
          <li>
            <Link href="/" className="transition-colors hover:text-brand-navy">
              Home
            </Link>
          </li>
          <li aria-hidden="true">
            <ChevronRight className="h-4 w-4" />
          </li>
          <li>
            <Link
              href="/products"
              className="transition-colors hover:text-brand-navy"
            >
              Products
            </Link>
          </li>
          <li aria-hidden="true">
            <ChevronRight className="h-4 w-4" />
          </li>
          <li>
            <Link
              href={`/products/${product.category.slug}`}
              className="transition-colors hover:text-brand-navy"
            >
              {product.category.name}
            </Link>
          </li>
          <li aria-hidden="true">
            <ChevronRight className="h-4 w-4" />
          </li>
          <li className="font-medium text-brand-navy">{product.name}</li>
        </ol>
      </nav>

      <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-2">
        <ProductGallery images={product.images} name={product.name} />

        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-brand-orange">
            {product.category.name}
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-brand-navy">
            {product.name}
          </h1>

          <div className="mt-4 flex flex-wrap items-baseline gap-3">
            <span className="text-3xl font-bold text-brand-navy">
              {formatPrice(product.price.toNumber())}
            </span>
            {mrp && (
              <span className="text-lg text-brand-gray line-through">
                {formatPrice(mrp.toNumber())}
              </span>
            )}
            {discount && (
              <span className="rounded-full bg-brand-purple/10 px-2.5 py-0.5 text-sm font-semibold text-brand-purple">
                {discount}% OFF
              </span>
            )}
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span
              className={`rounded-full px-3 py-1 text-sm font-semibold ${stockStatus.className}`}
            >
              {stockStatus.label}
            </span>
            {!isOutOfStock && (
              <span className="text-sm text-brand-gray">
                Available for dispatch
              </span>
            )}
          </div>

          <div className="mt-8">
            <AddToCartSection
              productId={product.id}
              name={product.name}
              price={product.price.toNumber()}
              image={product.images[0] ?? FALLBACK_IMAGE}
              stock={product.stock}
            />
          </div>

          <div className="mt-10 border-t border-gray-200 pt-6">
            <h2 className="text-lg font-semibold text-brand-navy">
              Description
            </h2>
            <p className="mt-3 whitespace-pre-line leading-relaxed text-brand-gray">
              {product.description}
            </p>
          </div>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-bold tracking-tight text-brand-navy">
            Related Products
          </h2>
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {relatedProducts.map((related) => (
              <ProductCard key={related.id} product={related} />
            ))}
          </div>
        </section>
      )}

      <ProductReviews />
    </div>
  );
}
