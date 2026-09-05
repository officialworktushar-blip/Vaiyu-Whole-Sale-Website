"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Images,
  LayoutDashboard,
  Menu,
  Package,
  ShoppingCart,
  X,
} from "lucide-react";
import SidebarLink from "@/components/admin/SidebarLink";
import { LogoutButton } from "./logout-button";

const NAV_LINKS = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/banners", label: "Banners", icon: Images },
];

function SidebarContent() {
  return (
    <>
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
    </>
  );
}

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <aside className="fixed inset-y-0 left-0 hidden w-60 flex-col border-r border-gray-200 bg-white lg:flex">
        <SidebarContent />
      </aside>

      <header className="fixed inset-x-0 top-0 z-30 flex h-14 items-center justify-between border-b border-gray-200 bg-white px-4 lg:hidden">
        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          aria-label="Open menu"
          className="rounded-md p-1.5 text-brand-navy transition-colors hover:bg-gray-50"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-brand-gradient text-xs font-bold text-white">
            V
          </span>
          <span className="text-sm font-bold text-brand-navy">Admin Panel</span>
        </div>
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
            className="absolute inset-0 h-full w-full bg-gray-900/40"
          />
          <aside className="fixed inset-y-0 left-0 flex w-60 flex-col overflow-y-auto border-r border-gray-200 bg-white">
            <div className="flex h-14 items-center justify-end border-b border-gray-200 px-3">
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
                className="rounded-md p-1.5 text-brand-navy transition-colors hover:bg-gray-50"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <SidebarContent />
          </aside>
        </div>
      )}

      <main className="p-4 pt-20 sm:p-8 sm:pt-20 lg:ml-60 lg:pt-8">
        {children}
      </main>
    </div>
  );
}