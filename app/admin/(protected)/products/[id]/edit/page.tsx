import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProductForm from "@/components/admin/ProductForm";

export const dynamic = "force-dynamic";

export default async function EditProductPage({
  params,
}: {
  params: { id: string };
}) {
  const [product, categories] = await Promise.all([
    prisma.product.findUnique({ where: { id: params.id } }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!product) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold text-brand-navy">Edit Product</h1>
      <div className="mt-6">
        <ProductForm
          categories={categories.map((category) => ({
            id: category.id,
            name: category.name,
          }))}
          product={{
            id: product.id,
            name: product.name,
            categoryId: product.categoryId,
            description: product.description,
            price: product.price.toString(),
            mrp: product.mrp ? product.mrp.toString() : "",
            stock: String(product.stock),
            images: product.images,
            isFeatured: product.isFeatured,
            isActive: product.isActive,
          }}
        />
      </div>
    </div>
  );
}
