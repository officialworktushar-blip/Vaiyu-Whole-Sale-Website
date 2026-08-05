import { prisma } from "@/lib/prisma";
import ProductForm from "@/components/admin/ProductForm";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-brand-navy">Add New Product</h1>
      <div className="mt-6">
        <ProductForm
          categories={categories.map((category) => ({
            id: category.id,
            name: category.name,
          }))}
        />
      </div>
    </div>
  );
}
