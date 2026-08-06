import { prisma } from "@/lib/prisma";
import HeroCarousel from "@/components/site/HeroCarousel";
import CategoryGrid from "@/components/site/CategoryGrid";
import FeaturedProducts from "@/components/site/FeaturedProducts";
import TrustSection from "@/components/site/TrustSection";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [banners, categories, featuredProducts] = await Promise.all([
    prisma.banner.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    }),
    prisma.category.findMany({
      orderBy: { name: "asc" },
    }),
    prisma.product.findMany({
      where: { isFeatured: true, isActive: true },
      include: { category: true },
      orderBy: { createdAt: "asc" },
      take: 8,
    }),
  ]);

  return (
    <>
      <HeroCarousel
        banners={banners.map(({ id, imageUrl, title, linkUrl }) => ({
          id,
          imageUrl,
          title,
          linkUrl,
        }))}
      />
      <CategoryGrid categories={categories} />
      <FeaturedProducts products={featuredProducts} />
      <TrustSection />
    </>
  );
}
