import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/format";
import StatusBadge from "@/components/admin/StatusBadge";
import { OrderStatusSelect } from "@/components/admin/AdminActions";

export const dynamic = "force-dynamic";

export default async function AdminOrderDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: { orderItems: true },
  });

  if (!order) notFound();

  return (
    <div>
      <Link
        href="/admin/orders"
        className="text-sm font-medium text-brand-gray transition-colors hover:text-brand-navy"
      >
        &larr; Back to orders
      </Link>
      <h1 className="mt-3 text-2xl font-bold text-brand-navy">
        Order #{order.id}
      </h1>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white lg:col-span-2">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50 text-left text-xs font-semibold uppercase text-brand-gray">
              <tr>
                <th className="px-4 py-3">Item</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3 text-center">Qty</th>
                <th className="px-4 py-3 text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {order.orderItems.map((item) => (
                <tr key={item.id}>
                  <td className="px-4 py-3 font-medium text-brand-navy">
                    {item.productName}
                  </td>
                  <td className="px-4 py-3 text-brand-gray">
                    {formatPrice(Number(item.price))}
                  </td>
                  <td className="px-4 py-3 text-center text-brand-gray">
                    {item.quantity}
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-brand-navy">
                    {formatPrice(Number(item.price) * item.quantity)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-gray-50">
                <td
                  colSpan={3}
                  className="px-4 py-3 text-sm font-semibold text-brand-gray"
                >
                  Total
                </td>
                <td className="px-4 py-3 text-right text-base font-bold text-brand-navy">
                  {formatPrice(Number(order.totalAmount))}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <h2 className="text-sm font-semibold uppercase text-brand-gray">
              Order Status
            </h2>
            <div className="mt-3">
              <OrderStatusSelect orderId={order.id} status={order.status} />
            </div>
            <div className="mt-3">
              <StatusBadge status={order.status} />
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <h2 className="text-sm font-semibold uppercase text-brand-gray">
              Customer
            </h2>
            <dl className="mt-3 space-y-2 text-sm">
              <div>
                <dt className="text-brand-gray">Name</dt>
                <dd className="font-medium text-brand-navy">
                  {order.customerName}
                </dd>
              </div>
              <div>
                <dt className="text-brand-gray">Email</dt>
                <dd className="font-medium text-brand-navy">{order.email}</dd>
              </div>
              <div>
                <dt className="text-brand-gray">Calling</dt>
                <dd className="font-medium text-brand-navy">
                  {order.callingNumber}
                </dd>
              </div>
              <div>
                <dt className="text-brand-gray">WhatsApp</dt>
                <dd className="font-medium text-brand-navy">
                  {order.whatsappNumber}
                </dd>
              </div>
              <div>
                <dt className="text-brand-gray">Placed on</dt>
                <dd className="font-medium text-brand-navy">
                  {new Date(order.createdAt).toLocaleString("en-IN")}
                </dd>
              </div>
            </dl>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <h2 className="text-sm font-semibold uppercase text-brand-gray">
              Delivery Address
            </h2>
            <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-brand-navy">
              {order.address}
            </p>
            {order.notes && (
              <>
                <h3 className="mt-4 text-sm font-semibold uppercase text-brand-gray">
                  Notes
                </h3>
                <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-brand-gray">
                  {order.notes}
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
