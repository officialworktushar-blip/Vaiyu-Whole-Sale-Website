"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

export default function ImageUpload({
  value,
  onChange,
  folder,
}: {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    if (folder) formData.append("folder", folder);

    setUploading(true);
    setError("");
    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = (await response.json()) as { url?: string; error?: string };
      if (!response.ok || !data.url) {
        setError(data.error ?? "Upload failed.");
      } else {
        onChange(data.url);
      }
    } catch {
      setError("Upload failed.");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  return (
    <div>
      <div className="flex items-center gap-4">
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={value}
            alt="Preview"
            className="h-20 w-20 rounded-md border border-gray-200 object-cover"
          />
        ) : (
          <div className="flex h-20 w-20 items-center justify-center rounded-md border border-dashed border-gray-300 px-2 text-center text-xs text-brand-gray">
            No image
          </div>
        )}
        <label className="flex cursor-pointer items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-brand-navy transition-colors hover:bg-gray-50">
          {uploading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin text-brand-orange" />
              Uploading...
            </>
          ) : (
            "Upload image"
          )}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            disabled={uploading}
            onChange={handleFile}
          />
        </label>
        {value && !uploading && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="text-sm font-medium text-brand-gray transition-colors hover:text-brand-red"
          >
            Remove
          </button>
        )}
      </div>
      {error && <p className="mt-1 text-xs text-brand-red">{error}</p>}
    </div>
  );
}
