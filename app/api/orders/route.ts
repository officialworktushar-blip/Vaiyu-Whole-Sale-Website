import { NextResponse } from "next/server";
import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import {
  sendAdminOrderNotification,
  sendOrderConfirmationEmail,
} from "@/lib/email";

type OrderItemInput = {
  productId: string;
  quantity: number;
};

function parsePhone(value: unknown): string | null {
  const digits = String(value ?? "").replace(/\D/g, "");
  return digits.length === 10 ? digits : null;
}

function toErrorMessage(
  parsedItems: OrderItemInput[],
  productById: Map<string, { stock: number }>,
): string | null {
  const quantityByProduct: Record<string, number> = {};
  for (const item of parsedItems) {
    quantityByProduct[item.productId] =
      (quantityByProduct[item.productId] ?? 0) + item.quantity;
  }
  for (const productId of Object.keys(quantityByProduct)) {
    const product = productById.get(productId);
    if (!product) return "Some products are no longer available.";
    if (quantityByProduct[productId] > product.stock) {
      return "Some items in your cart have insufficient stock. Please reduce the quantity.";
    }
  }
  return null;
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 },
    );
  }

  const data = (body ?? {}) as Record<string, unknown>;
  const fullName = typeof data.fullName === "string" ? data.fullName.trim() : "";
  const address = typeof data.address === "string" ? data.address.trim() : "";
  const callingNumber = parsePhone(data.callingNumber);
  const whatsappNumber = parsePhone(data.whatsappNumber);
  const email = typeof data.email === "string" ? data.email.trim() : "";
  const notes = typeof data.notes === "string" ? data.notes.trim() : null;
  const rawItems = Array.isArray(data.items) ? data.items : [];

  if (!fullName || !address || !callingNumber || !whatsappNumber || !email) {
    return NextResponse.json(
      { error: "Please fill in all required fields." },
      { status: 400 },
    );
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { error: "Please enter a valid email address." },
      { status: 400 },
    );
  }

  if (rawItems.length === 0) {
    return NextResponse.json(
      { error: "Your cart is empty." },
      { status: 400 },
    );
  }

  const parsedItems: OrderItemInput[] = [];
  for (const rawItem of rawItems) {
    if (typeof rawItem !== "object" || rawItem === null) {
      return NextResponse.json(
        { error: "Invalid cart items." },
        { status: 400 },
      );
    }
    const item = rawItem as Record<string, unknown>;
    const productId = typeof item.productId === "string" ? item.productId : "";
    const quantity = Number(item.quantity);
    if (!productId || !Number.isInteger(quantity) || quantity <= 0) {
      return NextResponse.json(
        { error: "Invalid cart items." },
        { status: 400 },
      );
    }
    parsedItems.push({ productId, quantity });
  }

  const productIds = parsedItems.map((item) => item.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds }, isActive: true },
  });

  const productById = new Map(products.map((product) => [product.id, product]));
  const stockError = toErrorMessage(parsedItems, productById);
  if (stockError) {
    return NextResponse.json({ error: stockError }, { status: 400 });
  }

  let totalAmount = new Prisma.Decimal(0);
  for (const item of parsedItems) {
    const product = productById.get(item.productId);
    if (!product) continue;
    totalAmount = totalAmount.plus(product.price.mul(item.quantity));
  }

  const order = await prisma.$transaction(async (tx) => {
    const created = await tx.order.create({
      data: {
        customerName: fullName,
        callingNumber,
        whatsappNumber,
        email,
        address,
        notes: notes || null,
        totalAmount,
        orderItems: {
          create: parsedItems.map((item) => {
            const product = productById.get(item.productId);
            return {
              productId: item.productId,
              productName: product ? product.name : item.productId,
              price: product ? product.price : new Prisma.Decimal(0),
              quantity: item.quantity,
            };
          }),
        },
      },
      include: { orderItems: true },
    });

    for (const item of parsedItems) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    return created;
  });

  try {
    await sendOrderConfirmationEmail(order, order.orderItems);
  } catch (error) {
    console.error("Failed to send order confirmation email:", error);
  }

  try {
    await sendAdminOrderNotification(order, order.orderItems);
  } catch (error) {
    console.error("Failed to send admin order notification email:", error);
  }

  return NextResponse.json({ orderId: order.id }, { status: 201 });
}
