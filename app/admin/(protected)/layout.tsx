import Link from "next/link";
import { Images, LayoutDashboard, Package, ShoppingCart } from "lucide-react";
import SidebarLink from "@/components/admin/SidebarLink";
import { LogoutButton } from "./logout-button";

const NAV_LINKS = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/banners", label: "Banners", icon: Images },
];

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-gray-50">
      <aside className="fixed inset-y-0 left-0 flex w-60 flex-col border-r border-gray-200 bg-white">
        <div className="flex h-16 items-center gap-2 border-b border-gray-200 px-5">
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-brand-gradient text-sm font-bold text-white">
            V
          </span>
          <span className="text-base font-bold text-brand-navy">
            Admin Panel
          </span>
        </div>

        <nav className="flex-1 space-y-1 p-3">
          {NAV_LINKS.map((link) => {
            const Icon = link.icon;
            return (
              <SidebarLink key={link.href} href={link.href}>
                <Icon className="h-4 w-4" />
                {link.label}
              </SidebarLink>
            );
          })}
        </nav>

        <div className="space-y-2 border-t border-gray-200 p-3">
          <Link
            href="/"
            className="block rounded-md px-3 py-2 text-sm font-medium text-brand-gray transition-colors hover:bg-gray-50 hover:text-brand-navy"
          >
            Back to Store
          </Link>
          <LogoutButton />
        </div>
      </aside>

      <main className="ml-60 p-6 sm:p-8">{children}</main>
    </div>
  );
}
