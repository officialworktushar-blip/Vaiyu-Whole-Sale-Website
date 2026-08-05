import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import ProductListing from "@/components/site/ProductListing";
import { LISTING_PAGE_SIZE, parsePage, parseSort } from "@/lib/listing";

export async function generateMetadata({
  params,
}: {
  params: { category: string };
}): Promise<Metadata> {
  const category = await prisma.category.findUnique({
    where: { slug: params.category },
  });
  if (!category) return { title: "Category Not Found | Vaiyu Industries" };
  const description = `Wholesale ${category.name.toLowerCase()} from Vaiyu Industries.`;
  return {
    title: `${category.name} | Vaiyu Industries`,
    description,
    openGraph: {
      title: `${category.name} | Vaiyu Industries`,
      description,
      images: [{ url: "/Vaiyu.webp", alt: "Vaiyu Industries" }],
    },
  };
}

export default async function CategoryProductsPage({
  params,
  searchParams,
}: {
  params: { category: string };
  searchParams: { search?: string; sort?: string; page?: string };
}) {
  const category = await prisma.category.findUnique({
    where: { slug: params.category },
  });
  if (!category) notFound();

  const search =
    typeof searchParams.search === "string" ? searchParams.search.trim() : "";
  const sort = parseSort(searchParams.sort);
  const requestedPage = parsePage(searchParams.page);

  const where: Prisma.ProductWhereInput = {
    isActive: true,
    categoryId: category.id,
  };
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
      activeCategorySlug={category.slug}
      heading={category.name}
      basePath={`/products/${category.slug}`}
      products={products}
      total={total}
      search={search}
      sort={sort}
      page={page}
      pageSize={LISTING_PAGE_SIZE}
    />
  );
}
