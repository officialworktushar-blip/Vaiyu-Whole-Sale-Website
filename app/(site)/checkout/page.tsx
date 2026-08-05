"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/format";

type FormState = {
  fullName: string;
  callingNumber: string;
  whatsappNumber: string;
  address: string;
  notes: string;
};

const EMPTY_FORM: FormState = {
  fullName: "",
  callingNumber: "",
  whatsappNumber: "",
  address: "",
  notes: "",
};

const inputClass =
  "w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm text-brand-navy placeholder:text-gray-400 focus:border-brand-orange focus:outline-none focus:ring-1 focus:ring-brand-orange";
const labelClass =
  "mb-1.5 block text-sm font-medium text-brand-navy";
const errorClass = "mt-1 text-xs text-brand-red";

function normalizePhone(value: string): string {
  return value.replace(/[^\d]/g, "").slice(0, 10);
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();

  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [sameAsCalling, setSameAsCalling] = useState(true);
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const setField = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSameAsCalling = (checked: boolean) => {
    setSameAsCalling(checked);
    if (checked) {
      setForm((prev) => ({ ...prev, whatsappNumber: prev.callingNumber }));
    }
  };

  const validate = (): boolean => {
    const nextErrors: Partial<FormState> = {};
    if (!form.fullName.trim()) nextErrors.fullName = "Full name is required.";
    if (form.callingNumber.length !== 10) {
      nextErrors.callingNumber = "Calling number must be 10 digits.";
    }
    if (form.whatsappNumber.length !== 10) {
      nextErrors.whatsappNumber = "WhatsApp number must be 10 digits.";
    }
    if (!form.address.trim()) nextErrors.address = "Delivery address is required.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (items.length === 0 || submitting) return;
    if (!validate()) return;

    setSubmitting(true);
    setSubmitError("");

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: form.fullName.trim(),
          callingNumber: form.callingNumber,
          whatsappNumber: form.whatsappNumber,
          address: form.address.trim(),
          notes: form.notes.trim() || null,
          items: items.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
          })),
        }),
      });

      const data = (await response.json()) as { orderId?: string; error?: string };

      if (!response.ok || !data.orderId) {
        setSubmitError(data.error ?? "Something went wrong. Please try again.");
        setSubmitting(false);
        return;
      }

      clearCart();
      router.push(`/order-confirmation/${data.orderId}`);
    } catch {
      setSubmitError("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-4 px-4 py-24 text-center sm:px-6 lg:px-8">
        <ShoppingCart className="h-12 w-12 text-gray-300" />
        <h1 className="text-2xl font-bold text-brand-navy">Your cart is empty</h1>
        <p className="text-brand-gray">
          Add products to your cart before checking out.
        </p>
        <Link
          href="/products"
          className="rounded-md bg-brand-gradient px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-brand-navy">Checkout</h1>

      <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-3">
        <form
          id="checkout-form"
          onSubmit={handleSubmit}
          noValidate
          className="space-y-6 lg:col-span-2"
        >
          <section className="rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-brand-navy">
              Contact Details
            </h2>

            <div className="mt-5 space-y-5">
              <div>
                <label htmlFor="fullName" className={labelClass}>
                  Full Name <span className="text-brand-red">*</span>
                </label>
                <input
                  id="fullName"
                  type="text"
                  autoComplete="name"
                  value={form.fullName}
                  onChange={(event) => setField("fullName", event.target.value)}
                  className={inputClass}
                  placeholder="e.g. Rajesh Kumar"
                />
                {errors.fullName && (
                  <p className={errorClass}>{errors.fullName}</p>
                )}
              </div>

              <div>
                <label htmlFor="callingNumber" className={labelClass}>
                  Calling Number <span className="text-brand-red">*</span>
                </label>
                <input
                  id="callingNumber"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel"
                  value={form.callingNumber}
                  onChange={(event) => {
                    const value = normalizePhone(event.target.value);
                    setField("callingNumber", value);
                    if (sameAsCalling) {
                      setForm((prev) => ({
                        ...prev,
                        callingNumber: value,
                        whatsappNumber: value,
                      }));
                    }
                  }}
                  className={inputClass}
                  placeholder="10-digit mobile number"
                />
                {errors.callingNumber && (
                  <p className={errorClass}>{errors.callingNumber}</p>
                )}
              </div>

              <div>
                <label htmlFor="whatsappNumber" className={labelClass}>
                  WhatsApp Number <span className="text-brand-red">*</span>
                </label>
                <input
                  id="whatsappNumber"
                  type="tel"
                  inputMode="numeric"
                  value={form.whatsappNumber}
                  disabled={sameAsCalling}
                  onChange={(event) =>
                    setField("whatsappNumber", normalizePhone(event.target.value))
                  }
                  className={`${inputClass} disabled:bg-gray-100 disabled:text-gray-500`}
                  placeholder="10-digit WhatsApp number"
                />
                {errors.whatsappNumber && (
                  <p className={errorClass}>{errors.whatsappNumber}</p>
                )}
              </div>

              <label className="flex cursor-pointer items-center gap-2 text-sm text-brand-gray">
                <input
                  type="checkbox"
                  checked={sameAsCalling}
                  onChange={(event) => handleSameAsCalling(event.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 accent-brand-orange"
                />
                Same as calling number
              </label>
            </div>
          </section>

          <section className="rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-brand-navy">
              Delivery Details
            </h2>

            <div className="mt-5 space-y-5">
              <div>
                <label htmlFor="address" className={labelClass}>
                  Delivery Address <span className="text-brand-red">*</span>
                </label>
                <textarea
                  id="address"
                  rows={4}
                  autoComplete="street-address"
                  value={form.address}
                  onChange={(event) => setField("address", event.target.value)}
                  className={`${inputClass} resize-y`}
                  placeholder="House number, street, area, city, state, pincode"
                />
                {errors.address && (
                  <p className={errorClass}>{errors.address}</p>
                )}
              </div>

              <div>
                <label htmlFor="notes" className={labelClass}>
                  Order Notes (optional)
                </label>
                <textarea
                  id="notes"
                  rows={3}
                  value={form.notes}
                  onChange={(event) => setField("notes", event.target.value)}
                  className={`${inputClass} resize-y`}
                  placeholder="Any special instructions for delivery"
                />
              </div>
            </div>
          </section>

          {submitError && (
            <p className="rounded-md bg-red-50 px-4 py-3 text-sm font-medium text-brand-red">
              {submitError}
            </p>
          )}
        </form>

        <aside className="h-fit rounded-xl border border-gray-200 bg-white p-6 lg:sticky lg:top-28">
          <h2 className="text-lg font-semibold text-brand-navy">
            Order Summary
          </h2>

          <ul className="mt-4 space-y-4">
            {items.map((item) => (
              <li key={item.id} className="flex gap-3">
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md border border-gray-200 bg-gray-100">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    unoptimized
                    sizes="56px"
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-1 items-center justify-between gap-2">
                  <div>
                    <p className="line-clamp-2 text-sm font-medium text-brand-navy">
                      {item.name}
                    </p>
                    <p className="text-xs text-brand-gray">
                      Qty {item.quantity}
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-brand-navy">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-4">
            <span className="text-base font-medium text-brand-gray">
              Total
            </span>
            <span className="text-xl font-bold text-brand-navy">
              {formatPrice(subtotal)}
            </span>
          </div>

          <button
            type="submit"
            form="checkout-form"
            disabled={submitting}
            className="mt-4 w-full rounded-md bg-brand-gradient px-5 py-3 text-base font-semibold text-white shadow-md transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {submitting ? "Placing Order..." : "Place Order"}
          </button>

          <p className="mt-3 text-center text-xs text-brand-gray">
            You will be contacted on your provided number to confirm the order.
          </p>
        </aside>
      </div>
    </div>
  );
}
