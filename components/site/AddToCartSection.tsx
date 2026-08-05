"use client";

import { useState } from "react";
import { ShoppingCart } from "lucide-react";
import QuantitySelector from "@/components/site/QuantitySelector";
import { useCart } from "@/lib/cart-context";

type AddToCartSectionProps = {
  productId: string;
  name: string;
  price: number;
  image: string;
  stock: number;
};

export default function AddToCartSection({
  productId,
  name,
  price,
  image,
  stock,
}: AddToCartSectionProps) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const isOutOfStock = stock <= 0;

  if (isOutOfStock) {
    return (
      <button
        type="button"
        disabled
        className="flex items-center gap-2 rounded-md bg-brand-gradient px-8 py-3 text-base font-semibold text-white opacity-40"
      >
        <ShoppingCart className="h-5 w-5" />
        Out of Stock
      </button>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-4">
      <QuantitySelector value={quantity} onChange={setQuantity} max={stock} />
      <button
        type="button"
        onClick={() =>
          addItem({ id: productId, name, price, image, stock }, quantity)
        }
        className="flex items-center gap-2 rounded-md bg-brand-gradient px-8 py-3 text-base font-semibold text-white shadow-md transition hover:opacity-90"
      >
        <ShoppingCart className="h-5 w-5" />
        Add to Cart
      </button>
    </div>
  );
}
