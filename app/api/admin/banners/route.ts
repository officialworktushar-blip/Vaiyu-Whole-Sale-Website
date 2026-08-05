import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionAdminId } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const adminId = await getSessionAdminId(request);
  if (!adminId) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const banners = await prisma.banner.findMany({
    orderBy: { sortOrder: "asc" },
  });
  return NextResponse.json({ banners });
}

export async function POST(request: NextRequest) {
  const adminId = await getSessionAdminId(request);
  if (!adminId) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const data = (await request.json().catch(() => ({}))) as Record<string, unknown>;
  const imageUrl = typeof data.imageUrl === "string" ? data.imageUrl.trim() : "";
  const title = typeof data.title === "string" ? data.title.trim() : null;
  const linkUrl = typeof data.linkUrl === "string" ? data.linkUrl.trim() : null;

  if (!imageUrl) {
    return NextResponse.json({ error: "Image is required." }, { status: 400 });
  }

  const maxSortOrder = await prisma.banner.aggregate({
    _max: { sortOrder: true },
  });
  const banner = await prisma.banner.create({
    data: {
      imageUrl,
      title: title || null,
      linkUrl: linkUrl || null,
      isActive: true,
      sortOrder: (maxSortOrder._max.sortOrder ?? 0) + 1,
    },
  });

  return NextResponse.json({ banner }, { status: 201 });
}
