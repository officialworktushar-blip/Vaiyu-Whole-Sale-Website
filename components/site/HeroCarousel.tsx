"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type BannerSlide = {
  id: string;
  imageUrl: string;
  title: string | null;
  linkUrl: string | null;
};

const AUTOPLAY_INTERVAL = 5000;

export default function HeroCarousel({ banners }: { banners: BannerSlide[] }) {
  const [current, setCurrent] = useState(0);
  const count = banners.length;

  const next = useCallback(
    () => setCurrent((prev) => (prev + 1) % count),
    [count]
  );
  const prev = useCallback(
    () => setCurrent((prev) => (prev - 1 + count) % count),
    [count]
  );

  useEffect(() => {
    if (count <= 1) return;
    const interval = setInterval(next, AUTOPLAY_INTERVAL);
    return () => clearInterval(interval);
  }, [count, next]);

  if (count === 0) {
    return (
      <section className="relative flex min-h-[420px] w-full items-center justify-center bg-brand-gradient">
        <div className="px-4 text-center text-white">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Vaiyu Industries
          </h1>
          <p className="mt-4 text-lg text-white/90">
            Powering Homes, Enhancing Lives
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      className="relative h-[420px] w-full overflow-hidden bg-brand-navy sm:h-[500px] lg:h-[560px]"
      aria-roledescription="carousel"
    >
      {banners.map((banner, index) => {
        const isActive = index === current;
        const slide = (
          <>
            <Image
              src={banner.imageUrl}
              alt={banner.title ?? "Vaiyu Industries banner"}
              fill
              priority={index === 0}
              sizes="100vw"
              className={`object-contain transition-opacity duration-700 ${
                isActive ? "opacity-100" : "opacity-0"
              }`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/80 via-brand-navy/30 to-brand-navy/10" />
            {banner.title && (
              <div className="absolute inset-0 flex items-end">
                <div className="mx-auto w-full max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
                  <h1 className="max-w-2xl text-3xl font-bold text-white sm:text-5xl">
                    {banner.title}
                  </h1>
                </div>
              </div>
            )}
          </>
        );

        const content = banner.linkUrl ? (
          <Link href={banner.linkUrl} className="absolute inset-0 block" aria-label={banner.title ?? "View banner"}>
            {slide}
          </Link>
        ) : (
          <div className="absolute inset-0">{slide}</div>
        );

        return (
          <div
            key={banner.id}
            className={`absolute inset-0 transition-opacity duration-700 ${
              isActive ? "opacity-100" : "opacity-0"
            }`}
            aria-hidden={!isActive}
          >
            {content}
          </div>
        );
      })}

      {count > 1 && (
        <>
          <button
            type="button"
            onClick={prev}
            aria-label="Previous banner"
            className="absolute left-4 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur transition hover:bg-white/40"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Next banner"
            className="absolute right-4 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur transition hover:bg-white/40"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
          <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2">
            {banners.map((banner, index) => (
              <button
                key={banner.id}
                type="button"
                onClick={() => setCurrent(index)}
                aria-label={`Go to banner ${index + 1}`}
                className={`h-2.5 rounded-full transition-all ${
                  index === current
                    ? "w-8 bg-brand-orange"
                    : "w-2.5 bg-white/60 hover:bg-white"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
