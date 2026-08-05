"use client";

import { Minus, Plus } from "lucide-react";

export default function QuantitySelector({
  value,
  onChange,
  max,
}: {
  value: number;
  onChange: (value: number) => void;
  max: number;
}) {
  const upperBound = Math.max(max, 1);

  const clamp = (candidate: number) =>
    Math.min(Math.max(candidate, 1), upperBound);

  return (
    <div className="flex items-center gap-3 rounded-md border border-gray-300 bg-white p-1">
      <button
        type="button"
        onClick={() => onChange(clamp(value - 1))}
        aria-label="Decrease quantity"
        className="flex h-9 w-9 items-center justify-center rounded text-brand-gray transition hover:bg-gray-100 hover:text-brand-navy"
      >
        <Minus className="h-4 w-4" />
      </button>
      <span className="w-10 text-center text-lg font-semibold text-brand-navy">
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(clamp(value + 1))}
        aria-label="Increase quantity"
        className="flex h-9 w-9 items-center justify-center rounded text-brand-gray transition hover:bg-gray-100 hover:text-brand-navy"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}
