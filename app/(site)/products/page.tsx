import type { Metadata } from "next";
import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import ProductListing from "@/components/site/ProductListing";
import { LISTING_PAGE_SIZE, parsePage, parseSort } from "@/lib/listing";

export const metadata: Metadata = {
  title: "All Products | Vaiyu Industries",
  description:
    "Browse our full wholesale catalog of home appliances, spare parts, and accessories.",
  openGraph: {
    title: "All Products | Vaiyu Industries",
    description:
      "Browse our full wholesale catalog of home appliances, spare parts, and accessories.",
    images: [{ url: "/Vaiyu.webp", alt: "Vaiyu Industries" }],
  },
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { search?: string; sort?: string; page?: string };
}) {
  const search =
    typeof searchParams.search === "string" ? searchParams.search.trim() : "";
  const sort = parseSort(searchParams.sort);
  const requestedPage = parsePage(searchParams.page);

  const where: Prisma.ProductWhereInput = { isActive: true };
  if (search) {
    where.name = { contains: search, mode: "insensitive" };
  }

  const orderBy: Prisma.ProductOrderByWithRelationInput =
    sort === "price-asc"
      ? { price: "asc" }
      : sort === "price-desc"
        ? { price: "desc" }
        : { createdAt: "desc" };

  const [categories, total] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.product.count({ where }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / LISTING_PAGE_SIZE));
  const page = Math.min(requestedPage, totalPages);

  const products = await prisma.product.findMany({
    where,
    include: { category: true },
    orderBy,
    skip: (page - 1) * LISTING_PAGE_SIZE,
    take: LISTING_PAGE_SIZE,
  });

  return (
    <ProductListing
      categories={categories}
      activeCategorySlug={undefined}
      heading="All Products"
      basePath="/products"
      products={products}
      total={total}
      search={search}
      sort={sort}
      page={page}
      pageSize={LISTING_PAGE_SIZE}
    />
  );
}
