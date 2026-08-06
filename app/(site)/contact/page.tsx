import Link from "next/link";
import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import ContactForm from "@/components/site/ContactForm";

const WHATSAPP_NUMBER = process.env.WHATSAPP_NUMBER ?? "919999999999";
const WHATSAPP_MESSAGE = encodeURIComponent(
  "Hello Vaiyu Industries! I have a question about your wholesale products.",
);

const CONTACT_EMAIL = process.env.ADMIN_EMAIL ?? "info@vaiyuindustries.com";

const CONTACT_DETAILS = [
  {
    icon: MapPin,
    title: "Business Address",
    lines: ["Your company street address here", "City, State, PIN - India"],
  },
  {
    icon: Phone,
    title: "Calling Number",
    lines: ["+91 98765 43210"],
  },
  {
    icon: MessageCircle,
    title: "WhatsApp Number",
    lines: ["+91 98765 43210"],
  },
  {
    icon: Mail,
    title: "Email Address",
    lines: [CONTACT_EMAIL],
  },
  {
    icon: Clock,
    title: "Business Hours",
    lines: ["Monday - Saturday: 10:00 AM - 7:00 PM", "Sunday: Closed"],
  },
];

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-wider text-brand-orange">
          Get in Touch
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-brand-navy sm:text-4xl">
          Contact Us
        </h1>
        <p className="mt-4 leading-relaxed text-brand-gray">
          Have a question about our wholesale catalog, bulk pricing, or an
          order? Send us a message and our team will get back to you shortly.
        </p>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-2">
        <div>
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-brand-navy">
              Contact Details
            </h2>
            <ul className="mt-5 space-y-5">
              {CONTACT_DETAILS.map((detail) => {
                const Icon = detail.icon;
                return (
                  <li key={detail.title} className="flex gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-50 text-brand-orange">
                      <Icon className="h-5 w-5" strokeWidth={1.5} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-medium uppercase tracking-wider text-brand-gray">
                        {detail.title}
                      </p>
                      {detail.lines.map((line) => (
                        <p
                          key={line}
                          className="mt-0.5 text-sm font-medium text-brand-navy"
                        >
                          {line}
                        </p>
                      ))}
                    </div>
                  </li>
                );
              })}
            </ul>

            <Link
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-md bg-[#25D366] px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-opacity hover:opacity-90"
            >
              <MessageCircle className="h-4 w-4" />
              Chat on WhatsApp
            </Link>
          </div>

          <div className="mt-6 overflow-hidden rounded-xl border border-gray-200">
            <iframe
              title="Vaiyu Industries location"
              src="https://maps.google.com/maps?q=New%20Delhi&t=&z=11&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="300"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="block"
            />
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 sm:p-8">
          <h2 className="text-lg font-semibold text-brand-navy">
            Send us a Message
          </h2>
          <p className="mt-1 text-sm text-brand-gray">
            We usually reply within one business day.
          </p>
          <div className="mt-6">
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}
