import Link from "next/link";
import { OrderStatus } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/format";
import StatusBadge from "@/components/admin/StatusBadge";
import { OrderStatusFilter } from "@/components/admin/AdminActions";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: { status?: string };
}) {
  const statusParam =
    typeof searchParams.status === "string" ? searchParams.status : "";
  const where =
    statusParam && statusParam in OrderStatus
      ? { status: statusParam as OrderStatus }
      : {};

  const orders = await prisma.order.findMany({
    where,
    include: { _count: { select: { orderItems: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-brand-navy">Orders</h1>
        <OrderStatusFilter current={statusParam || "ALL"} />
      </div>

      <div className="mt-6 overflow-x-auto rounded-xl border border-gray-200 bg-white">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50 text-left text-xs font-semibold uppercase text-brand-gray">
            <tr>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Calling</th>
              <th className="px-4 py-3">WhatsApp</th>
              <th className="px-4 py-3">Items</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/orders/${order.id}`}
                    className="font-medium text-brand-navy transition-colors hover:text-brand-orange"
                  >
                    {order.customerName}
                  </Link>
                </td>
                <td className="px-4 py-3 text-brand-gray">
                  {order.callingNumber}
                </td>
                <td className="px-4 py-3 text-brand-gray">
                  {order.whatsappNumber}
                </td>
                <td className="px-4 py-3 text-brand-gray">
                  {order._count.orderItems}
                </td>
                <td className="px-4 py-3 text-brand-navy">
                  {formatPrice(Number(order.totalAmount))}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={order.status} />
                </td>
                <td className="px-4 py-3 text-brand-gray">
                  {new Date(order.createdAt).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-10 text-center text-brand-gray"
                >
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
