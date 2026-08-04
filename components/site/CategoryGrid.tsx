import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  Blender,
  Fan,
  Microwave,
  Package,
  Refrigerator,
  WashingMachine,
  Wrench,
} from "lucide-react";
import type { Category } from "@/generated/prisma/client";

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  "washing-machine": WashingMachine,
  refrigerator: Refrigerator,
  microwave: Microwave,
  blender: Blender,
  fan: Fan,
  "spare-parts": Wrench,
};

export default function CategoryGrid({ categories }: { categories: Category[] }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center">
        <p className="text-sm font-semibold uppercase tracking-wider text-brand-orange">
          Shop by Category
        </p>
        <h2 className="mt-2 text-3xl font-bold tracking-tight text-brand-navy">
          Explore Our Product Range
        </h2>
      </div>

      <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {categories.map((category) => {
          const Icon = CATEGORY_ICONS[category.icon ?? ""] ?? Package;
          return (
            <Link
              key={category.id}
              href={`/products/${category.slug}`}
              className="group rounded-xl border border-gray-200 bg-white p-6 text-center shadow-sm transition hover:-translate-y-1 hover:border-brand-orange hover:shadow-md"
            >
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-orange-50 text-brand-orange transition group-hover:bg-brand-gradient group-hover:text-white">
                <Icon className="h-7 w-7" strokeWidth={1.5} />
              </div>
              <p className="mt-4 text-sm font-semibold text-brand-navy">
                {category.name}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
