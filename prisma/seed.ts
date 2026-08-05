import "dotenv/config";
import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

const placeholderImage = (label: string) =>
  `https://placehold.co/600x600.png?text=${encodeURIComponent(label)}`;

if (
  process.env.NODE_ENV === "production" &&
  process.env.SEED_FORCE !== "true"
) {
  console.error(
    "Refusing to seed sample data in production.",
    "This script only creates demo categories, products, and banners with placeholder images.",
    "Run `npm run db:seed:admin` to create your admin user instead.",
  );
  process.exit(1);
}

const categories = [
  { name: "Washing Machines", slug: "washing-machines", icon: "washing-machine" },
  { name: "Refrigerators", slug: "refrigerators", icon: "refrigerator" },
  { name: "Microwaves", slug: "microwaves", icon: "microwave" },
  { name: "Blenders & Mixers", slug: "blenders-mixers", icon: "blender" },
  { name: "Fans", slug: "fans", icon: "fan" },
  { name: "Spare Parts & Accessories", slug: "spare-parts-accessories", icon: "spare-parts" },
];

type SeedProduct = {
  name: string;
  price: number;
  mrp: number;
  stock: number;
};

const productsByCategory: Record<string, SeedProduct[]> = {
  "washing-machines": [
    { name: "Semi-Automatic Washing Machine 6.2kg", price: 18990, mrp: 22990, stock: 60 },
    { name: "Fully-Automatic Top Load Washing Machine 7kg", price: 24990, mrp: 29990, stock: 40 },
    { name: "Front Load Washing Machine 8kg", price: 38990, mrp: 45990, stock: 25 },
  ],
  refrigerators: [
    { name: "Single Door Refrigerator 190L", price: 15490, mrp: 18490, stock: 50 },
    { name: "Double Door Refrigerator 240L", price: 23490, mrp: 27990, stock: 35 },
    { name: "Side-by-Side Refrigerator 450L", price: 64990, mrp: 74990, stock: 15 },
  ],
  microwaves: [
    { name: "Microwave Oven 20L", price: 6490, mrp: 7990, stock: 45 },
    { name: "Grill Microwave Oven 28L", price: 8990, mrp: 10990, stock: 30 },
    { name: "Convection Microwave Oven 32L", price: 12490, mrp: 14990, stock: 20 },
  ],
  "blenders-mixers": [
    { name: "Mixer Grinder 750W", price: 2990, mrp: 3690, stock: 80 },
    { name: "Juicer Blender 500W", price: 2490, mrp: 2990, stock: 70 },
    { name: "Hand Blender 200W", price: 1790, mrp: 2190, stock: 60 },
  ],
  fans: [
    { name: "Ceiling Fan 1200mm", price: 1490, mrp: 1890, stock: 120 },
    { name: "Pedestal Fan 16 inch", price: 2490, mrp: 2990, stock: 90 },
    { name: "Exhaust Fan 8 inch", price: 990, mrp: 1290, stock: 100 },
  ],
  "spare-parts-accessories": [
    { name: "Washing Machine Drain Hose", price: 349, mrp: 499, stock: 200 },
    { name: "Refrigerator Door Gasket", price: 899, mrp: 1199, stock: 150 },
    { name: "Microwave Turntable Plate", price: 549, mrp: 699, stock: 180 },
  ],
};

async function main() {
  console.log("Seeding database...");

  const categoryIds = new Map<string, string>();
  for (const category of categories) {
    const record = await prisma.category.upsert({
      where: { slug: category.slug },
      update: { name: category.name, icon: category.icon },
      create: category,
    });
    categoryIds.set(category.slug, record.id);
    console.log(`  Category: ${record.name}`);
  }

  for (const [categorySlug, products] of Object.entries(productsByCategory)) {
    const categoryId = categoryIds.get(categorySlug);
    if (!categoryId) {
      throw new Error(`Missing category for slug: ${categorySlug}`);
    }
    const categoryName =
      categories.find((c) => c.slug === categorySlug)?.name ?? categorySlug;

    for (let index = 0; index < products.length; index += 1) {
      const product = products[index];
      const slug = `${categorySlug}-${index + 1}`;
      await prisma.product.upsert({
        where: { slug },
        update: {
          name: product.name,
          categoryId,
          price: product.price,
          mrp: product.mrp,
          stock: product.stock,
        },
        create: {
          name: product.name,
          slug,
          description: `${product.name} — placeholder description for the ${categoryName} range.`,
          price: product.price,
          mrp: product.mrp,
          stock: product.stock,
          categoryId,
          images: [placeholderImage(product.name)],
          isFeatured: index === 0,
        },
      });
      console.log(`  Product: ${product.name}`);
    }
  }

  await prisma.banner.deleteMany();
  await prisma.banner.create({
    data: {
      imageUrl: placeholderImage("Vaiyu Industries Banner"),
      title: "Wholesale Deals on Home Appliances",
      linkUrl: "/products",
      isActive: true,
      sortOrder: 0,
    },
  });
  console.log("  Banner: Wholesale Deals on Home Appliances");

  console.log("Seed complete.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
