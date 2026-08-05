import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/format";
import StatusBadge from "@/components/admin/StatusBadge";

export const dynamic = "force-dynamic";

const startOfToday = new Date();
startOfToday.setHours(0, 0, 0, 0);

export default async function AdminDashboardPage() {
  const [ordersToday, pendingOrders, totalProducts, outOfStock, recentOrders] =
    await Promise.all([
      prisma.order.count({ where: { createdAt: { gte: startOfToday } } }),
      prisma.order.count({ where: { status: "PENDING" } }),
      prisma.product.count(),
      prisma.product.count({ where: { stock: 0 } }),
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
      }),
    ]);

  const stats = [
    { label: "Orders Today", value: ordersToday },
    { label: "Pending Orders", value: pendingOrders },
    { label: "Total Products", value: totalProducts },
    { label: "Out of Stock", value: outOfStock },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-brand-navy">Dashboard</h1>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-gray-200 bg-white p-5"
          >
            <p className="text-sm font-medium text-brand-gray">{stat.label}</p>
            <p className="mt-2 text-3xl font-bold text-brand-navy">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-brand-navy">
            Recent Orders
          </h2>
          <Link
            href="/admin/orders"
            className="text-sm font-medium text-brand-orange transition-colors hover:text-brand-navy"
          >
            View all
          </Link>
        </div>

        <div className="mt-4 overflow-x-auto rounded-xl border border-gray-200 bg-white">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50 text-left text-xs font-semibold uppercase text-brand-gray">
              <tr>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="font-medium text-brand-navy transition-colors hover:text-brand-orange"
                    >
                      {order.customerName}
                    </Link>
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
              {recentOrders.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-10 text-center text-brand-gray"
                  >
                    No orders yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
