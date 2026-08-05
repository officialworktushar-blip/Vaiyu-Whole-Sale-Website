import nodemailer from "nodemailer";
import sharp from "sharp";
import type { Order, OrderItem } from "@/generated/prisma/client";
import { formatPrice } from "@/lib/format";

const NAVY = "#1B2A4A";
const ORANGE = "#FF6A00";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function toHtmlLines(value: string): string {
  return escapeHtml(value).replace(/\r?\n/g, "<br/>");
}

async function logoAttachment(): Promise<{
  filename: string;
  content: Buffer;
  cid: string;
}> {
  const content = await sharp("public/Vaiyu.webp").png().toBuffer();
  return { filename: "vaiyu-logo.png", content, cid: "logo" };
}

function itemsRows(orderItems: OrderItem[]): string {
  if (orderItems.length === 0) {
    return '<tr><td colspan="4" style="padding:10px 12px;font-size:14px;color:#6b7280;">No items.</td></tr>';
  }
  return orderItems
    .map((item) => {
      const subtotal = Number(item.price) * item.quantity;
      return `
        <tr>
          <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;font-size:14px;">${escapeHtml(item.productName)}</td>
          <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;font-size:14px;text-align:center;">${item.quantity}</td>
          <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;font-size:14px;text-align:right;">${formatPrice(Number(item.price))}</td>
          <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;font-size:14px;text-align:right;font-weight:600;">${formatPrice(subtotal)}</td>
        </tr>`;
    })
    .join("");
}

function renderOrderEmail(
  order: Order,
  orderItems: OrderItem[],
  recipient: "customer" | "admin",
): { subject: string; html: string } {
  const isAdmin = recipient === "admin";

  const greeting = isAdmin
    ? "New Order Received"
    : `Hi ${escapeHtml(order.customerName)},`;
  const intro = isAdmin
    ? "A new order has been placed on the Vaiyu Industries website."
    : "Thank you for your order! Here are your order details.";
  const closing = isAdmin
    ? "This email was sent automatically for every new order."
    : "Our team will call you shortly to confirm your order.";

  const html = `
    <div style="background-color:#f4f5f7;padding:24px 16px;font-family:Arial,Helvetica,sans-serif;">
      <div style="max-width:600px;margin:0 auto;background-color:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;">
        <div style="background-color:${NAVY};padding:28px 24px;text-align:center;">
          <img src="cid:logo" alt="Vaiyu Industries" width="72" height="72" style="display:block;margin:0 auto;border-radius:50%;" />
          <h1 style="margin:12px 0 0;color:#ffffff;font-size:24px;font-weight:700;">Vaiyu Industries</h1>
          <p style="margin:4px 0 0;color:${ORANGE};font-size:13px;">Wholesale Order</p>
        </div>
        <div style="padding:28px 24px;">
          <p style="margin:0 0 6px;font-size:16px;color:#111827;font-weight:600;">${greeting}</p>
          <p style="margin:0 0 20px;font-size:14px;color:#4b5563;">${intro}</p>

          <p style="margin:0 0 4px;font-size:13px;color:#6b7280;">ORDER ID</p>
          <p style="margin:0 0 20px;font-size:15px;font-weight:600;color:${NAVY};">#${order.id}</p>

          <table style="width:100%;border-collapse:collapse;">
            <thead>
              <tr style="background-color:${NAVY};">
                <th style="padding:10px 12px;font-size:12px;letter-spacing:0.05em;text-transform:uppercase;color:#ffffff;text-align:left;">Item</th>
                <th style="padding:10px 12px;font-size:12px;letter-spacing:0.05em;text-transform:uppercase;color:#ffffff;text-align:center;">Qty</th>
                <th style="padding:10px 12px;font-size:12px;letter-spacing:0.05em;text-transform:uppercase;color:#ffffff;text-align:right;">Price</th>
                <th style="padding:10px 12px;font-size:12px;letter-spacing:0.05em;text-transform:uppercase;color:#ffffff;text-align:right;">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              ${itemsRows(orderItems)}
            </tbody>
          </table>

          <div style="margin-top:16px;padding-top:16px;border-top:2px solid ${ORANGE};text-align:right;">
            <p style="margin:0;font-size:14px;color:#4b5563;">Total Amount</p>
            <p style="margin:4px 0 0;font-size:22px;font-weight:700;color:${NAVY};">${formatPrice(Number(order.totalAmount))}</p>
          </div>

          <div style="margin-top:24px;">
            <p style="margin:0 0 4px;font-size:13px;color:#6b7280;">DELIVERY ADDRESS</p>
            <p style="margin:0;font-size:14px;line-height:1.6;color:#111827;">${toHtmlLines(order.address)}</p>
          </div>

          <p style="margin:24px 0 0;padding-top:20px;border-top:1px solid #e5e7eb;font-size:14px;color:#4b5563;">${closing}</p>
          <p style="margin:12px 0 0;font-size:12px;color:#9ca3af;">Vaiyu Industries - Support: ${escapeHtml(process.env.EMAIL_USER ?? "")}</p>
        </div>
      </div>
    </div>
  `;

  return {
    subject: isAdmin
      ? `New Order #${order.id} - Vaiyu Industries`
      : `Order Confirmation #${order.id} - Vaiyu Industries`,
    html,
  };
}

export async function sendOrderConfirmationEmail(
  order: Order,
  orderItems: OrderItem[],
): Promise<void> {
  const { subject, html } = renderOrderEmail(order, orderItems, "customer");
  await transporter.sendMail({
    from: `"Vaiyu Industries" <${process.env.EMAIL_USER}>`,
    to: order.email,
    subject,
    html,
    attachments: [await logoAttachment()],
  });
}

export async function sendAdminOrderNotification(
  order: Order,
  orderItems: OrderItem[],
): Promise<void> {
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail) {
    console.warn(
      "ADMIN_EMAIL is not set. Skipping admin order notification email.",
    );
    return;
  }
  const { subject, html } = renderOrderEmail(order, orderItems, "admin");
  await transporter.sendMail({
    from: `"Vaiyu Industries" <${process.env.EMAIL_USER}>`,
    to: adminEmail,
    subject,
    html,
    attachments: [await logoAttachment()],
  });
}
