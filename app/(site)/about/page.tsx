import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  Boxes,
  Headphones,
  ShieldCheck,
  Tags,
} from "lucide-react";

const WHY_CHOOSE_US: { icon: LucideIcon; title: string; text: string }[] = [
  {
    icon: ShieldCheck,
    title: "Genuine Products",
    text: "Authentic home appliances and spare parts sourced directly from trusted manufacturers.",
  },
  {
    icon: Tags,
    title: "Bulk / Wholesale Pricing",
    text: "Transparent margin-friendly price slabs that get better as you buy in larger quantities.",
  },
  {
    icon: Boxes,
    title: "Wide Product Range",
    text: "From washing machines to spare parts and accessories — a complete catalog for your shop.",
  },
  {
    icon: Headphones,
    title: "Reliable Support",
    text: "Friendly assistance over call and WhatsApp for orders, dispatch, and after-sales help.",
  },
];

const STATS = [
  { value: "10+", label: "Years in Business" },
  { value: "500+", label: "Products Available" },
  { value: "1,000+", label: "Happy Retailers" },
  { value: "50+", label: "Cities Served" },
];

export default function AboutPage() {
  return (
    <>
      <section className="bg-brand-navy py-20">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-brand-orange">
            Who We Are
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            About Vaiyu Industries
          </h1>
          <p className="mt-4 text-lg font-medium text-gray-300">
            Powering Homes, Enhancing Lives
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <p className="text-sm font-semibold uppercase tracking-wider text-brand-orange">
          Our Story
        </p>
        <h2 className="mt-2 text-3xl font-bold tracking-tight text-brand-navy">
          Wholesale Supply You Can Rely On
        </h2>
        <div className="mt-6 space-y-5 leading-relaxed text-brand-gray">
          <p>
            Vaiyu Industries is a wholesale distributor of home appliances and
            spare parts. We supply washing machines, refrigerators, microwaves,
            blenders and mixers, fans, and a wide range of spare parts and
            accessories to businesses that buy in bulk. [Replace this paragraph
            with your company story.]
          </p>
          <p>
            We serve retailers, shop owners, and repair businesses across the
            region who need dependable supply, honest wholesale pricing, and a
            partner they can count on. Our catalog is built for resellers — every
            product is selected for quality and demand, so you can stock your
            shop with confidence. [Replace this paragraph with your story.]
          </p>
          <p>
            From the day an order is placed to the moment it reaches your
            doorstep, we are committed to quality and fast dispatch. Your
            business deserves a supplier that moves quickly — and that is
            exactly what we do. [Replace this paragraph with your story.]
          </p>
        </div>
      </section>

      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-brand-orange">
              Why Choose Us
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-brand-navy">
              The Vaiyu Advantage
            </h2>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {WHY_CHOOSE_US.map((point) => {
              const Icon = point.icon;
              return (
                <div
                  key={point.title}
                  className="rounded-xl border border-gray-200 bg-white p-6 text-center shadow-sm transition hover:shadow-md"
                >
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-gradient text-white">
                    <Icon className="h-6 w-6" strokeWidth={1.5} />
                  </div>
                  <h3 className="mt-4 text-base font-semibold text-brand-navy">
                    {point.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-brand-gray">
                    {point.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-brand-navy px-6 py-12 sm:px-12">
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-bold text-brand-orange sm:text-4xl">
                  {stat.value}
                </p>
                <p className="mt-2 text-sm font-medium text-gray-300">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-brand-navy">
            Ready to Stock Your Shop?
          </h2>
          <p className="mt-4 leading-relaxed text-brand-gray">
            Browse our wholesale catalog or talk to our team about bulk pricing
            and availability.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/products"
              className="rounded-md bg-brand-gradient px-6 py-3 text-sm font-semibold text-white shadow-md transition-opacity hover:opacity-90"
            >
              Browse Our Catalog
            </Link>
            <Link
              href="/contact"
              className="rounded-md border border-brand-navy px-6 py-3 text-sm font-semibold text-brand-navy transition-colors hover:bg-brand-navy hover:text-white"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
