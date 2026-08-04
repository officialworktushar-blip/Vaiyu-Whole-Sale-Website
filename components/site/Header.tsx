import Link from "next/link";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between gap-6">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-brand-gradient text-lg font-bold text-white shadow-sm">
              V
            </span>
            <span className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-brand-navy">
                Vaiyu Industries
              </span>
              <span className="text-xs text-brand-gray">
                Powering Homes, Enhancing Lives
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-8 lg:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-brand-gray transition-colors hover:text-brand-navy"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <Link
            href="/admin"
            className="rounded-md bg-brand-gradient px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90"
          >
            Wholesale Login
          </Link>
        </div>
      </div>
    </header>
  );
}
