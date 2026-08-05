"use client";

import { ShoppingCart } from "lucide-react";
import { useCart } from "@/lib/cart-context";

type AddToCartButtonProps = {
  productId: string;
  name: string;
  price: number;
  image: string;
  stock: number;
};

export default function AddToCartButton({
  productId,
  name,
  price,
  image,
  stock,
}: AddToCartButtonProps) {
  const { addItem } = useCart();
  const isOutOfStock = stock <= 0;

  return (
    <button
      type="button"
      disabled={isOutOfStock}
      onClick={() =>
        addItem({ id: productId, name, price, image, stock }, 1)
      }
      className="mt-4 flex w-full items-center justify-center gap-2 rounded-md bg-brand-gradient px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
    >
      <ShoppingCart className="h-4 w-4" />
      {isOutOfStock ? "Out of Stock" : "Add to Cart"}
    </button>
  );
}
