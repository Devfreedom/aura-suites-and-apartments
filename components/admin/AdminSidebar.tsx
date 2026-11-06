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
  ChevronRight,
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

export default function AdminSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
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
      className={`fixed inset-y-0 left-0 z-50 w-64 bg-navy transition-all duration-300 ${
        isCollapsed ? "w-16" : ""
      }`}
    >
      <div className="flex items-center justify-between h-16 px-4">
        <Link href="/admin" className="flex items-center gap-2">
          <span className="font-serif font-bold text-xl text-white">AURA</span>
          {!isCollapsed && (
            <span className="text-gold text-xs font-medium tracking-wider uppercase">
              Suites & Apartments
            </span>
          )}
        </Link>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          aria-label="Toggle sidebar"
        >
          {isCollapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <X className="w-5 h-5" />
          )}
        </button>
      </div>

      <nav className="mt-6 px-3 space-y-1">
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
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                isActive
                  ? "bg-gold text-white"
                  : "text-gray-300 hover:text-white hover:bg-white/10"
              }`}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && item.name}
            </Link>
          );
        })}
      </nav>

      <div className="absolute bottom-6 left-3 right-3">
        <div className="px-2">
          {!isCollapsed && (
            <>
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-3">
                admin panel
              </p>
              <div className="bg-white/10 border border-white/20 rounded-xl p-3">
                <p className="text-xs text-gray-300">
                  Aura Suites & Apartments
                </p>
                <p className="text-[10px] text-gray-500 mt-1">
                  Makurdi, Benue State
                </p>
              </div>
            </>
          )}

          <button
            type="button"
            onClick={() => void handleSignOut()}
            disabled={isSigningOut}
            title="Sign out"
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-white/20 px-3 py-2.5 text-xs font-medium text-gray-300 transition-colors hover:border-red-400/40 hover:bg-red-500/10 hover:text-red-300 disabled:opacity-60 sm:justify-start"
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            {!isCollapsed && (isSigningOut ? "Signing out…" : "Sign out")}
          </button>
        </div>
      </div>
    </aside>
  );
}
