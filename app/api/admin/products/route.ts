import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { getSessionAdminId } from "@/lib/auth";
import { slugify } from "@/lib/slug";

export const runtime = "nodejs";

function parseDecimal(value: unknown): Prisma.Decimal | null {
  if (typeof value !== "string" && typeof value !== "number") return null;
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0) return null;
  return new Prisma.Decimal(parsed);
}

async function uniqueSlug(base: string, excludeId?: string): Promise<string> {
  let slug = slugify(base);
  let suffix = 2;
  while (true) {
    const existing = await prisma.product.findUnique({ where: { slug } });
    if (!existing || existing.id === excludeId) return slug;
    slug = `${slugify(base)}-${suffix}`;
    suffix += 1;
  }
}

export async function GET(request: NextRequest) {
  const adminId = await getSessionAdminId(request);
  if (!adminId) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ products });
}

export async function POST(request: NextRequest) {
  const adminId = await getSessionAdminId(request);
  if (!adminId) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const data = (await request.json().catch(() => ({}))) as Record<string, unknown>;
  const name = typeof data.name === "string" ? data.name.trim() : "";
  const categoryId = typeof data.categoryId === "string" ? data.categoryId : "";
  const description =
    typeof data.description === "string" ? data.description.trim() : "";
  const price = parseDecimal(data.price);
  const mrp = data.mrp === "" || data.mrp === null ? null : parseDecimal(data.mrp);
  const stock = Number(data.stock);
  const images = Array.isArray(data.images)
    ? data.images.filter((image): image is string => typeof image === "string")
    : [];
  const isFeatured = Boolean(data.isFeatured);
  const isActive = Boolean(data.isActive);

  if (!name || !categoryId || !description || !price) {
    return NextResponse.json(
      { error: "Name, category, description, and price are required." },
      { status: 400 },
    );
  }

  const category = await prisma.category.findUnique({
    where: { id: categoryId },
  });
  if (!category) {
    return NextResponse.json({ error: "Invalid category." }, { status: 400 });
  }

  if (!Number.isInteger(stock) || stock < 0) {
    return NextResponse.json(
      { error: "Stock must be a whole number." },
      { status: 400 },
    );
  }

  const product = await prisma.product.create({
    data: {
      name,
      slug: await uniqueSlug(name),
      description,
      price,
      mrp,
      stock,
      categoryId,
      images,
      isFeatured,
      isActive,
    },
  });

  return NextResponse.json({ product }, { status: 201 });
}
