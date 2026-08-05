"use client";

import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, ShoppingCart, Trash2, X } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/format";

export default function CartDrawer() {
  const {
    items,
    subtotal,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeItem,
    clearCart,
  } = useCart();

  return (
    <div
      className={`fixed inset-0 z-[60] ${isCartOpen ? "" : "pointer-events-none"}`}
      aria-hidden={!isCartOpen}
    >
      <div
        className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${
          isCartOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={closeCart}
      />

      <aside
        className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-xl transition-transform duration-300 ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-label="Shopping cart"
      >
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
          <h2 className="text-lg font-bold text-brand-navy">Your Cart</h2>
          <div className="flex items-center gap-2">
            {items.length > 0 && (
              <button
                type="button"
                onClick={clearCart}
                className="text-sm font-medium text-brand-gray transition-colors hover:text-brand-red"
              >
                Clear
              </button>
            )}
            <button
              type="button"
              onClick={closeCart}
              aria-label="Close cart"
              className="flex h-9 w-9 items-center justify-center rounded-md text-brand-gray transition-colors hover:bg-gray-100 hover:text-brand-navy"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <ShoppingCart className="h-12 w-12 text-gray-300" />
            <p className="text-brand-gray">Your cart is empty.</p>
            <Link
              href="/products"
              onClick={closeCart}
              className="rounded-md bg-brand-gradient px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-gray-100 overflow-y-auto px-5">
              {items.map((item) => (
                <li key={item.id} className="flex gap-4 py-4">
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md border border-gray-200 bg-gray-100">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      unoptimized
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>

                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <p className="line-clamp-2 text-sm font-medium text-brand-navy">
                        {item.name}
                      </p>
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        aria-label={`Remove ${item.name} from cart`}
                        className="flex h-7 w-7 shrink-0 items-center justify-center rounded text-brand-gray transition-colors hover:bg-red-50 hover:text-brand-red"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex items-center gap-3 rounded-md border border-gray-300 p-1">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          aria-label="Decrease quantity"
                          className="flex h-7 w-7 items-center justify-center rounded text-brand-gray transition hover:bg-gray-100 hover:text-brand-navy"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-6 text-center text-sm font-semibold text-brand-navy">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          aria-label="Increase quantity"
                          className="flex h-7 w-7 items-center justify-center rounded text-brand-gray transition hover:bg-gray-100 hover:text-brand-navy"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <span className="text-sm font-bold text-brand-navy">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="border-t border-gray-200 px-5 py-4">
              <div className="flex items-center justify-between">
                <span className="text-base text-brand-gray">Subtotal</span>
                <span className="text-xl font-bold text-brand-navy">
                  {formatPrice(subtotal)}
                </span>
              </div>
              <p className="mt-1 text-xs text-brand-gray">
                Shipping and taxes calculated at checkout.
              </p>
              <Link
                href="/checkout"
                onClick={closeCart}
                className="mt-4 flex w-full items-center justify-center rounded-md bg-brand-gradient px-5 py-3 text-base font-semibold text-white shadow-md transition-opacity hover:opacity-90"
              >
                Proceed to Checkout
              </Link>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
