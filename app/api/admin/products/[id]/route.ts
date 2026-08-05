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

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const adminId = await getSessionAdminId(request);
  if (!adminId) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const product = await prisma.product.findUnique({
    where: { id: params.id },
    include: { category: true },
  });
  if (!product) {
    return NextResponse.json({ error: "Product not found." }, { status: 404 });
  }
  return NextResponse.json({ product });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const adminId = await getSessionAdminId(request);
  if (!adminId) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const product = await prisma.product.findUnique({
    where: { id: params.id },
  });
  if (!product) {
    return NextResponse.json({ error: "Product not found." }, { status: 404 });
  }

  const data = (await request.json().catch(() => ({}))) as Record<string, unknown>;
  const patch: Prisma.ProductUpdateInput = {};

  if (typeof data.name === "string" && data.name.trim()) {
    const name = data.name.trim();
    patch.name = name;
    const slug = slugify(name);
    const conflict = await prisma.product.findFirst({
      where: { slug, id: { not: params.id } },
    });
    patch.slug = conflict ? `${slug}-${Date.now()}` : slug;
  }
  if (typeof data.categoryId === "string") {
    const category = await prisma.category.findUnique({
      where: { id: data.categoryId },
    });
    if (!category) {
      return NextResponse.json({ error: "Invalid category." }, { status: 400 });
    }
    patch.category = { connect: { id: data.categoryId } };
  }
  if (typeof data.description === "string") {
    patch.description = data.description.trim();
  }
  if (data.price !== undefined) {
    const price = parseDecimal(data.price);
    if (!price) {
      return NextResponse.json(
        { error: "Price must be a valid number." },
        { status: 400 },
      );
    }
    patch.price = price;
  }
  if (data.mrp !== undefined) {
    patch.mrp = data.mrp === "" || data.mrp === null ? null : parseDecimal(data.mrp);
  }
  if (data.stock !== undefined) {
    const stock = Number(data.stock);
    if (!Number.isInteger(stock) || stock < 0) {
      return NextResponse.json(
        { error: "Stock must be a whole number." },
        { status: 400 },
      );
    }
    patch.stock = stock;
  }
  if (Array.isArray(data.images)) {
    patch.images = data.images.filter(
      (image): image is string => typeof image === "string",
    );
  }
  if (typeof data.isFeatured === "boolean") {
    patch.isFeatured = data.isFeatured;
  }
  if (typeof data.isActive === "boolean") {
    patch.isActive = data.isActive;
  }

  const updated = await prisma.product.update({
    where: { id: params.id },
    data: patch,
  });

  return NextResponse.json({ product: updated });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const adminId = await getSessionAdminId(request);
  if (!adminId) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const product = await prisma.product.findUnique({
    where: { id: params.id },
  });
  if (!product) {
    return NextResponse.json({ error: "Product not found." }, { status: 404 });
  }

  await prisma.product.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
