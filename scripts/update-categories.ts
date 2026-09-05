import "dotenv/config";
import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const newCategories = [
  { name: "Heaters", slug: "heaters", icon: "heater" },
  { name: "Induction Cooktops", slug: "induction-cooktops", icon: "induction" },
  { name: "Fan Parts", slug: "fan-parts", icon: "fan-parts" },
  { name: "Office Fans", slug: "office-fans", icon: "office-fan" },
  { name: "Ceiling Fans", slug: "ceiling-fans", icon: "ceiling-fan" },
  { name: "Table Fans", slug: "table-fans", icon: "table-fan" },
];

async function main() {
  const slugs: Record<string, string> = {};

  for (const category of newCategories) {
    const record = await prisma.category.upsert({
      where: { slug: category.slug },
      update: { name: category.name, icon: category.icon },
      create: category,
    });
    slugs[category.slug] = record.id;
    console.log(`Category ready: ${record.name} (${record.slug})`);
  }

  const fansCategory = await prisma.category.findUnique({ where: { slug: "fans" } });
  if (fansCategory) {
    const fanProducts = await prisma.product.findMany({
      where: { categoryId: fansCategory.id },
      select: { id: true, name: true },
    });
    console.log(`Reassigning ${fanProducts.length} products from 'fans'...`);

    for (const product of fanProducts) {
      const isTableFan = /table fan/i.test(product.name);
      const targetSlug = isTableFan ? "table-fans" : "ceiling-fans";
      await prisma.product.update({
        where: { id: product.id },
        data: { categoryId: slugs[targetSlug] },
      });
      console.log(`  ${product.name} -> ${targetSlug}`);
    }

    const remaining = await prisma.product.count({
      where: { categoryId: fansCategory.id },
    });
    if (remaining === 0) {
      await prisma.category.delete({ where: { id: fansCategory.id } });
      console.log("Removed legacy category: Fans");
    } else {
      console.error(`Aborting: 'fans' still has ${remaining} product(s).`);
      process.exit(1);
    }
  } else {
    console.log("Legacy 'fans' category not found; nothing to remove.");
  }

  console.log("Update complete.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });