"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ImageUpload from "@/components/admin/ImageUpload";

export type BannerFormData = {
  id?: string;
  imageUrl: string;
  title: string;
  linkUrl: string;
};

const inputClass =
  "w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-brand-navy placeholder:text-gray-400 focus:border-brand-orange focus:outline-none focus:ring-1 focus:ring-brand-orange";
const labelClass = "mb-1.5 block text-sm font-medium text-brand-navy";

export default function BannerForm({ banner }: { banner?: BannerFormData }) {
  const router = useRouter();
  const isEditing = Boolean(banner);

  const [form, setForm] = useState<BannerFormData>({
    imageUrl: banner?.imageUrl ?? "",
    title: banner?.title ?? "",
    linkUrl: banner?.linkUrl ?? "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting) return;
    if (!form.imageUrl) {
      setError("Please upload a banner image.");
      return;
    }
    setSubmitting(true);
    setError("");

    try {
      const url = isEditing
        ? `/api/admin/banners/${banner?.id}`
        : "/api/admin/banners";
      const response = await fetch(url, {
        method: isEditing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageUrl: form.imageUrl,
          title: form.title.trim(),
          linkUrl: form.linkUrl.trim(),
        }),
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(data.error ?? "Failed to save banner.");
        setSubmitting(false);
        return;
      }
      router.push("/admin/banners");
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
        <span className={labelClass}>
          Banner Image <span className="text-brand-red">*</span>
        </span>
        <ImageUpload
          value={form.imageUrl}
          onChange={(url) => setForm((prev) => ({ ...prev, imageUrl: url }))}
          folder="banners"
        />
      </div>

      <div>
        <label htmlFor="title" className={labelClass}>
          Title (optional)
        </label>
        <input
          id="title"
          type="text"
          value={form.title}
          onChange={(event) =>
            setForm((prev) => ({ ...prev, title: event.target.value }))
          }
          className={inputClass}
          placeholder="e.g. Festival Sale 2026"
        />
      </div>

      <div>
        <label htmlFor="linkUrl" className={labelClass}>
          Link URL (optional)
        </label>
        <input
          id="linkUrl"
          type="text"
          value={form.linkUrl}
          onChange={(event) =>
            setForm((prev) => ({ ...prev, linkUrl: event.target.value }))
          }
          className={inputClass}
          placeholder="e.g. /products"
        />
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
          {submitting ? "Saving..." : isEditing ? "Save Changes" : "Add Banner"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/banners")}
          className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-brand-gray transition hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
