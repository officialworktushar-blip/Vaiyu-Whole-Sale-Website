import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/format";
import {
  ProductDeleteButton,
  ProductToggle,
} from "@/components/admin/AdminActions";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-brand-navy">Products</h1>
        <Link
          href="/admin/products/new"
          className="rounded-md bg-brand-gradient px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
        >
          Add New Product
        </Link>
      </div>

      <div className="mt-6 overflow-x-auto rounded-xl border border-gray-200 bg-white">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50 text-left text-xs font-semibold uppercase text-brand-gray">
            <tr>
              <th className="px-4 py-3">Image</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  {product.images[0] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="h-12 w-12 rounded-md border border-gray-200 object-cover"
                    />
                  ) : (
                    <div className="h-12 w-12 rounded-md border border-gray-200 bg-gray-100" />
                  )}
                </td>
                <td className="px-4 py-3 font-medium text-brand-navy">
                  {product.name}
                </td>
                <td className="px-4 py-3 text-brand-gray">
                  {product.category.name}
                </td>
                <td className="px-4 py-3 text-brand-navy">
                  {formatPrice(Number(product.price))}
                </td>
                <td className="px-4 py-3 text-brand-gray">{product.stock}</td>
                <td className="px-4 py-3">
                  <ProductToggle id={product.id} active={product.isActive} />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/products/${product.id}/edit`}
                      className="rounded-md border border-gray-300 px-2.5 py-1 text-xs font-medium text-brand-navy transition-colors hover:bg-gray-50"
                    >
                      Edit
                    </Link>
                    <ProductDeleteButton id={product.id} name={product.name} />
                  </div>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-10 text-center text-brand-gray"
                >
                  No products yet.{" "}
                  <Link
                    href="/admin/products/new"
                    className="font-medium text-brand-orange"
                  >
                    Add your first product
                  </Link>
                  .
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
