import type { LucideIcon } from "lucide-react";
import {
  BadgePercent,
  MessageCircle,
  ShieldCheck,
  Truck,
} from "lucide-react";

type TrustPoint = {
  icon: LucideIcon;
  title: string;
  text: string;
};

const TRUST_POINTS: TrustPoint[] = [
  {
    icon: BadgePercent,
    title: "True Wholesale Pricing",
    text: "Buy in bulk and unlock margin-friendly prices with clear, transparent price slabs.",
  },
  {
    icon: ShieldCheck,
    title: "Genuine Spare Parts",
    text: "Authentic parts and appliances sourced directly from trusted manufacturers.",
  },
  {
    icon: Truck,
    title: "Fast Dispatch",
    text: "Orders packed and dispatched quickly with reliable delivery partners.",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp Order Updates",
    text: "Confirm, track, and manage every order right from your WhatsApp chat.",
  },
];

export default function TrustSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="rounded-2xl bg-brand-navy px-6 py-12 sm:px-12">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-brand-orange">
            Why Vaiyu
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-white">
            Why Wholesale With Us?
          </h2>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {TRUST_POINTS.map((point) => {
            const Icon = point.icon;
            return (
              <div
                key={point.title}
                className="rounded-xl border border-white/10 bg-white/5 p-6 text-center"
              >
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-gradient text-white">
                  <Icon className="h-6 w-6" strokeWidth={1.5} />
                </div>
                <h3 className="mt-4 text-base font-semibold text-white">
                  {point.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-300">
                  {point.text}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
