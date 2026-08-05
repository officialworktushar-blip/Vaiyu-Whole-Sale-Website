"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ImageUpload from "@/components/admin/ImageUpload";

export type ProductFormData = {
  id?: string;
  name: string;
  categoryId: string;
  description: string;
  price: string;
  mrp: string;
  stock: string;
  images: string[];
  isFeatured: boolean;
  isActive: boolean;
};

const inputClass =
  "w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-brand-navy placeholder:text-gray-400 focus:border-brand-orange focus:outline-none focus:ring-1 focus:ring-brand-orange";
const labelClass = "mb-1.5 block text-sm font-medium text-brand-navy";

export default function ProductForm({
  categories,
  product,
}: {
  categories: { id: string; name: string }[];
  product?: ProductFormData;
}) {
  const router = useRouter();
  const isEditing = Boolean(product);

  const [form, setForm] = useState<ProductFormData>({
    name: product?.name ?? "",
    categoryId: product?.categoryId ?? "",
    description: product?.description ?? "",
    price: product?.price ?? "",
    mrp: product?.mrp ?? "",
    stock: product?.stock ?? "0",
    images: product?.images ?? [],
    isFeatured: product?.isFeatured ?? false,
    isActive: product?.isActive ?? true,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const setField = (field: keyof ProductFormData, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting) return;
    if (!form.name.trim() || !form.categoryId || !form.price) {
      setError("Name, category, and price are required.");
      return;
    }
    setSubmitting(true);
    setError("");

    try {
      const url = isEditing
        ? `/api/admin/products/${product?.id}`
        : "/api/admin/products";
      const response = await fetch(url, {
        method: isEditing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          categoryId: form.categoryId,
          description: form.description.trim(),
          price: form.price,
          mrp: form.mrp === "" ? null : form.mrp,
          stock: Number(form.stock) || 0,
          images: form.images,
          isFeatured: form.isFeatured,
          isActive: form.isActive,
        }),
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(data.error ?? "Failed to save product.");
        setSubmitting(false);
        return;
      }
      router.push("/admin/products");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl space-y-5 rounded-xl border border-gray-200 bg-white p-6"
    >
      <div>
        <label htmlFor="name" className={labelClass}>
          Name <span className="text-brand-red">*</span>
        </label>
        <input
          id="name"
          type="text"
          value={form.name}
          onChange={(event) => setField("name", event.target.value)}
          className={inputClass}
          placeholder="e.g. Ceiling Fan 1200mm"
        />
      </div>

      <div>
        <label htmlFor="categoryId" className={labelClass}>
          Category <span className="text-brand-red">*</span>
        </label>
        <select
          id="categoryId"
          value={form.categoryId}
          onChange={(event) => setField("categoryId", event.target.value)}
          className={inputClass}
        >
          <option value="">Select a category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="description" className={labelClass}>
          Description <span className="text-brand-red">*</span>
        </label>
        <textarea
          id="description"
          rows={4}
          value={form.description}
          onChange={(event) => setField("description", event.target.value)}
          className={`${inputClass} resize-y`}
          placeholder="Product description"
        />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div>
          <label htmlFor="price" className={labelClass}>
            Price (INR) <span className="text-brand-red">*</span>
          </label>
          <input
            id="price"
            type="number"
            min="0"
            step="0.01"
            value={form.price}
            onChange={(event) => setField("price", event.target.value)}
            className={inputClass}
            placeholder="0"
          />
        </div>
        <div>
          <label htmlFor="mrp" className={labelClass}>
            MRP (INR)
          </label>
          <input
            id="mrp"
            type="number"
            min="0"
            step="0.01"
            value={form.mrp}
            onChange={(event) => setField("mrp", event.target.value)}
            className={inputClass}
            placeholder="0"
          />
        </div>
        <div>
          <label htmlFor="stock" className={labelClass}>
            Stock
          </label>
          <input
            id="stock"
            type="number"
            min="0"
            step="1"
            value={form.stock}
            onChange={(event) => setField("stock", event.target.value)}
            className={inputClass}
            placeholder="0"
          />
        </div>
      </div>

      <div>
        <span className={labelClass}>Image</span>
        <ImageUpload
          value={form.images[0] ?? ""}
          onChange={(url) => setForm((prev) => ({ ...prev, images: [url] }))}
          folder="products"
        />
      </div>

      <div className="space-y-3">
        <label className="flex cursor-pointer items-center gap-2 text-sm text-brand-navy">
          <input
            type="checkbox"
            checked={form.isFeatured}
            onChange={(event) => setField("isFeatured", event.target.checked)}
            className="h-4 w-4 rounded border-gray-300 accent-brand-orange"
          />
          Featured product
        </label>
        <label className="flex cursor-pointer items-center gap-2 text-sm text-brand-navy">
          <input
            type="checkbox"
            checked={form.isActive}
            onChange={(event) => setField("isActive", event.target.checked)}
            className="h-4 w-4 rounded border-gray-300 accent-brand-orange"
          />
          Active (visible in store)
        </label>
      </div>

      {error && (
        <p className="rounded-md bg-red-50 px-3 py-2.5 text-sm font-medium text-brand-red">
          {error}
        </p>
      )}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-md bg-brand-gradient px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {submitting ? "Saving..." : isEditing ? "Save Changes" : "Add Product"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/products")}
          className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-brand-gray transition hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
