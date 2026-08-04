import Link from "next/link";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/admin" className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-md bg-brand-gradient text-sm font-bold text-white">
              V
            </span>
            <span className="text-base font-bold text-brand-navy">
              Admin Panel
            </span>
          </Link>
          <Link
            href="/"
            className="text-sm font-medium text-brand-gray transition-colors hover:text-brand-navy"
          >
            Back to Store
          </Link>
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
