import { NextRequest, NextResponse } from "next/server";
import { OrderStatus } from "@/generated/prisma/client";
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

  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: { orderItems: true },
  });
  if (!order) {
    return NextResponse.json({ error: "Order not found." }, { status: 404 });
  }
  return NextResponse.json({ order });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const adminId = await getSessionAdminId(request);
  if (!adminId) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const data = (await request.json().catch(() => ({}))) as Record<string, unknown>;
  const status = data.status;
  if (typeof status !== "string" || !(status in OrderStatus)) {
    return NextResponse.json(
      { error: "Invalid order status." },
      { status: 400 },
    );
  }

  const order = await prisma.order.findUnique({
    where: { id: params.id },
  });
  if (!order) {
    return NextResponse.json({ error: "Order not found." }, { status: 404 });
  }

  const updated = await prisma.order.update({
    where: { id: params.id },
    data: { status: status as OrderStatus },
  });

  return NextResponse.json({ order: updated });
}
