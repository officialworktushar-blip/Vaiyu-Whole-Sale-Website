import Link from "next/link";
import { prisma } from "@/lib/prisma";
import {
  BannerDeleteButton,
  BannerMoveButtons,
  BannerToggle,
} from "@/components/admin/AdminActions";

export const dynamic = "force-dynamic";

export default async function AdminBannersPage() {
  const banners = await prisma.banner.findMany({
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-brand-navy">Banners</h1>
        <Link
          href="/admin/banners/new"
          className="rounded-md bg-brand-gradient px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
        >
          Add New Banner
        </Link>
      </div>

      {banners.length === 0 ? (
        <div className="mt-6 rounded-xl border border-gray-200 bg-white px-4 py-10 text-center text-brand-gray">
          No banners yet. Add one to show a festival banner on the home page.
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {banners.map((banner, index) => (
            <div
              key={banner.id}
              className="rounded-xl border border-gray-200 bg-white p-4"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={banner.imageUrl}
                alt={banner.title ?? "Banner"}
                className="aspect-video w-full rounded-md border border-gray-200 object-cover"
              />
              <div className="mt-3">
                <p className="font-medium text-brand-navy">
                  {banner.title || "Untitled"}
                </p>
                <p className="mt-0.5 text-xs text-brand-gray">
                  Order #{banner.sortOrder}
                </p>
                {banner.linkUrl && (
                  <p className="mt-0.5 truncate text-xs text-brand-gray">
                    {banner.linkUrl}
                  </p>
                )}
              </div>
              <div className="mt-3 flex flex-wrap items-center justify-between gap-y-2 border-t border-gray-100 pt-3">
                <BannerToggle id={banner.id} active={banner.isActive} />
                <div className="flex items-center gap-2">
                  <BannerMoveButtons
                    id={banner.id}
                    move="up"
                    disabled={index === 0}
                  />
                  <BannerMoveButtons
                    id={banner.id}
                    move="down"
                    disabled={index === banners.length - 1}
                  />
                  <Link
                    href={`/admin/banners/${banner.id}/edit`}
                    className="rounded-md border border-gray-300 px-2.5 py-1 text-xs font-medium text-brand-navy transition-colors hover:bg-gray-50"
                  >
                    Edit
                  </Link>
                  <BannerDeleteButton id={banner.id} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
