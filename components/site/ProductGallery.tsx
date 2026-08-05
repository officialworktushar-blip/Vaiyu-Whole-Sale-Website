"use client";

import Image from "next/image";
import { useState } from "react";

const FALLBACK_IMAGE = "https://placehold.co/600x600?text=Product";

export default function ProductGallery({
  images,
  name,
}: {
  images: string[];
  name: string;
}) {
  const gallery = images.length > 0 ? images : [FALLBACK_IMAGE];
  const [active, setActive] = useState(0);

  return (
    <div>
      <div className="relative aspect-square overflow-hidden rounded-xl border border-gray-200 bg-white">
        <Image
          src={gallery[active]}
          alt={name}
          fill
          priority
          unoptimized
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover"
        />
      </div>

      {gallery.length > 1 && (
        <div className="mt-4 grid grid-cols-4 gap-3">
          {gallery.map((src, index) => (
            <button
              key={`${src}-${index}`}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`View image ${index + 1}`}
              className={`relative aspect-square overflow-hidden rounded-md border-2 transition ${
                index === active
                  ? "border-brand-orange"
                  : "border-transparent hover:border-gray-300"
              }`}
            >
              <Image
                src={src}
                alt=""
                fill
                unoptimized
                sizes="(min-width: 1024px) 12vw, 20vw"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
