import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import BannerForm from "@/components/admin/BannerForm";

export const dynamic = "force-dynamic";

export default async function EditBannerPage({
  params,
}: {
  params: { id: string };
}) {
  const banner = await prisma.banner.findUnique({ where: { id: params.id } });
  if (!banner) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold text-brand-navy">Edit Banner</h1>
      <div className="mt-6">
        <BannerForm
          banner={{
            id: banner.id,
            imageUrl: banner.imageUrl,
            title: banner.title ?? "",
            linkUrl: banner.linkUrl ?? "",
          }}
        />
      </div>
    </div>
  );
}
