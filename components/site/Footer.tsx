import Link from "next/link";

const QUICK_LINKS = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact" },
  { href: "/admin", label: "Wholesale Login" },
];

export default function Footer() {
  return (
    <footer className="bg-brand-navy text-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-brand-gradient text-lg font-bold text-white">
                V
              </span>
              <div>
                <p className="text-lg font-bold">Vaiyu Industries</p>
                <p className="text-sm text-gray-300">
                  Powering Homes, Enhancing Lives
                </p>
              </div>
            </div>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-gray-300">
              Wholesale distributor of home power and energy solutions.
              Company address, description, and registration details
              placeholder.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-300">
              Quick Links
            </h3>
            <ul className="mt-4 space-y-3 text-sm">
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-300 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-300">
              Contact
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-gray-300">
              <li>Email: info@vaiyuindustries.com</li>
              <li>Phone: +1 (000) 000-0000</li>
              <li>Address placeholder</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} Vaiyu Industries. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
