import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CheckCircle2, PackageCheck } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/format";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Order Confirmation | Vaiyu Industries",
  robots: { index: false },
};

export default async function OrderConfirmationPage({
  params,
}: {
  params: { orderId: string };
}) {
  const order = await prisma.order.findUnique({
    where: { id: params.orderId },
    include: { orderItems: true },
  });

  if (!order) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
          <CheckCircle2 className="h-10 w-10 text-green-600" />
        </div>
        <h1 className="mt-6 text-3xl font-bold tracking-tight text-brand-navy">
          Order Placed Successfully!
        </h1>
        <p className="mt-3 max-w-md text-brand-gray">
          Thank you for your order, {order.customerName}. We will contact you on
          your provided number shortly to confirm the details.
        </p>
      </div>

      <div className="mt-10 overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 bg-gray-50 px-6 py-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-brand-gray">
              Order ID
            </p>
            <p className="mt-0.5 font-mono text-sm font-semibold text-brand-navy">
              {order.id}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs font-medium uppercase tracking-wider text-brand-gray">
              Status
            </p>
            <p className="mt-0.5 text-sm font-semibold text-brand-orange">
              {order.status}
            </p>
          </div>
        </div>

        <ul className="divide-y divide-gray-100">
          {order.orderItems.map((item) => (
            <li
              key={item.id}
              className="flex items-center justify-between gap-4 px-6 py-4"
            >
              <div>
                <p className="font-medium text-brand-navy">{item.productName}</p>
                <p className="mt-0.5 text-sm text-brand-gray">
                  Qty {item.quantity} &times;{" "}
                  {formatPrice(item.price.toNumber())}
                </p>
              </div>
              <span className="font-semibold text-brand-navy">
                {formatPrice(item.price.toNumber() * item.quantity)}
              </span>
            </li>
          ))}
        </ul>

        <div className="flex items-center justify-between border-t border-gray-200 px-6 py-4">
          <span className="font-medium text-brand-gray">Total</span>
          <span className="text-xl font-bold text-brand-navy">
            {formatPrice(order.totalAmount.toNumber())}
          </span>
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-gray-200 bg-white px-6 py-5">
        <h2 className="flex items-center gap-2 font-semibold text-brand-navy">
          <PackageCheck className="h-5 w-5 text-brand-orange" />
          Delivery Details
        </h2>
        <div className="mt-4 grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-brand-gray">
              Calling Number
            </p>
            <p className="mt-0.5 font-medium text-brand-navy">
              {order.callingNumber}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-brand-gray">
              WhatsApp Number
            </p>
            <p className="mt-0.5 font-medium text-brand-navy">
              {order.whatsappNumber}
            </p>
          </div>
          <div className="sm:col-span-2">
            <p className="text-xs font-medium uppercase tracking-wider text-brand-gray">
              Delivery Address
            </p>
            <p className="mt-0.5 whitespace-pre-line leading-relaxed text-brand-navy">
              {order.address}
            </p>
          </div>
          {order.notes && (
            <div className="sm:col-span-2">
              <p className="text-xs font-medium uppercase tracking-wider text-brand-gray">
                Order Notes
              </p>
              <p className="mt-0.5 whitespace-pre-line text-brand-navy">
                {order.notes}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-10 flex flex-wrap justify-center gap-4">
        <Link
          href="/products"
          className="rounded-md bg-brand-gradient px-6 py-3 text-sm font-semibold text-white shadow-md transition-opacity hover:opacity-90"
        >
          Continue Shopping
        </Link>
        <Link
          href="/"
          className="rounded-md border border-gray-300 px-6 py-3 text-sm font-semibold text-brand-navy transition-colors hover:border-brand-navy"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
