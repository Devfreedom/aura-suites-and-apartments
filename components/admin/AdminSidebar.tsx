"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Building2,
  CreditCard,
  Settings,
  LogOut,
  X,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const navItems = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Reservations", href: "/admin/reservations", icon: FileText },
  { name: "Suite Management", href: "/admin/suites", icon: Building2 },
  { name: "Paystack Transactions", href: "/admin/transactions", icon: CreditCard },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

interface AdminSidebarProps {
  /** Whether the mobile slide-over drawer is open. */
  isOpen: boolean;
  /** Close the mobile drawer (called on backdrop, close button, nav). */
  onClose: () => void;
}

export default function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const [isSigningOut, setIsSigningOut] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  async function handleSignOut() {
    setIsSigningOut(true);

    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } finally {
      router.replace("/admin/login");
      router.refresh();
    }
  }

  return (
    <aside
      id="admin-sidebar"
      className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-navy transition-transform duration-300 ease-in-out md:translate-x-0 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="flex h-16 flex-shrink-0 items-center justify-between px-4">
        <Link
          href="/admin"
          onClick={onClose}
          className="flex min-w-0 items-center gap-2"
        >
          <span className="font-serif text-xl font-bold text-white">AURA</span>
          <span className="truncate text-gold text-xs font-medium tracking-wider uppercase">
            Suites & Apartments
          </span>
        </Link>
        <button
          type="button"
          onClick={onClose}
          className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-white/10 text-white transition-colors hover:bg-white/20 md:hidden"
          aria-label="Close menu"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <nav className="mt-6 flex-1 space-y-1 overflow-y-auto px-3 pb-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onClose}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-gold text-white"
                  : "text-gray-300 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              <span className="truncate">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto flex-shrink-0 border-t border-white/10 p-3">
        <p className="mb-3 px-2 text-xs font-medium uppercase tracking-wider text-gray-400">
          admin panel
        </p>
        <div className="rounded-xl border border-white/20 bg-white/10 p-3">
          <p className="text-xs text-gray-300">Aura Suites & Apartments</p>
          <p className="mt-1 text-[10px] text-gray-500">
            Makurdi, Benue State
          </p>
        </div>

        <button
          type="button"
          onClick={() => void handleSignOut()}
          disabled={isSigningOut}
          title="Sign out"
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-white/20 px-3 py-2.5 text-xs font-medium text-gray-300 transition-colors hover:border-red-400/40 hover:bg-red-500/10 hover:text-red-300 disabled:opacity-60 sm:justify-start"
        >
          <LogOut className="h-4 w-4 flex-shrink-0" />
          {isSigningOut ? "Signing out…" : "Sign out"}
        </button>
      </div>
    </aside>
  );
}
