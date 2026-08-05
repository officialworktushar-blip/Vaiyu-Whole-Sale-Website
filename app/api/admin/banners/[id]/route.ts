import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { getSessionAdminId } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const adminId = await getSessionAdminId(request);
  if (!adminId) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const banner = await prisma.banner.findUnique({ where: { id: params.id } });
  if (!banner) {
    return NextResponse.json({ error: "Banner not found." }, { status: 404 });
  }
  return NextResponse.json({ banner });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const adminId = await getSessionAdminId(request);
  if (!adminId) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const banner = await prisma.banner.findUnique({ where: { id: params.id } });
  if (!banner) {
    return NextResponse.json({ error: "Banner not found." }, { status: 404 });
  }

  const data = (await request.json().catch(() => ({}))) as Record<string, unknown>;

  if (data.move === "up" || data.move === "down") {
    const banners = await prisma.banner.findMany({
      orderBy: { sortOrder: "asc" },
    });
    const index = banners.findIndex((item) => item.id === params.id);
    const swapIndex = data.move === "up" ? index - 1 : index + 1;
    if (index < 0 || swapIndex < 0 || swapIndex >= banners.length) {
      return NextResponse.json({ banner });
    }
    const neighbor = banners[swapIndex];
    await prisma.$transaction([
      prisma.banner.update({
        where: { id: banner.id },
        data: { sortOrder: neighbor.sortOrder },
      }),
      prisma.banner.update({
        where: { id: neighbor.id },
        data: { sortOrder: banner.sortOrder },
      }),
    ]);
    return NextResponse.json({ banner: { ...banner, sortOrder: neighbor.sortOrder } });
  }

  const patch: Prisma.BannerUpdateInput = {};
  if (typeof data.imageUrl === "string" && data.imageUrl.trim()) {
    patch.imageUrl = data.imageUrl.trim();
  }
  if (typeof data.title === "string") {
    patch.title = data.title.trim() || null;
  }
  if (typeof data.linkUrl === "string") {
    patch.linkUrl = data.linkUrl.trim() || null;
  }
  if (typeof data.isActive === "boolean") {
    patch.isActive = data.isActive;
  }
  if (typeof data.sortOrder === "number") {
    patch.sortOrder = data.sortOrder;
  }

  const updated = await prisma.banner.update({
    where: { id: params.id },
    data: patch,
  });

  return NextResponse.json({ banner: updated });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const adminId = await getSessionAdminId(request);
  if (!adminId) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const banner = await prisma.banner.findUnique({ where: { id: params.id } });
  if (!banner) {
    return NextResponse.json({ error: "Banner not found." }, { status: 404 });
  }

  await prisma.banner.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
