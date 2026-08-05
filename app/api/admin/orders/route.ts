import { NextRequest, NextResponse } from "next/server";
import { OrderStatus, Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { getSessionAdminId } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const adminId = await getSessionAdminId(request);
  if (!adminId) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const statusParam = request.nextUrl.searchParams.get("status");
  const where: Prisma.OrderWhereInput =
    statusParam && statusParam in OrderStatus ? { status: statusParam as OrderStatus } : {};

  const orders = await prisma.order.findMany({
    where,
    include: { _count: { select: { orderItems: true } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ orders });
}
