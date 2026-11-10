"use client";

/**
 * Renders the global Navbar everywhere EXCEPT on routes that provide their own
 * full-screen shell — namely the auth pages (which use `AuthShell`) and the
 * standalone admin sign-in screen.
 *
 * Keeping this decision in a client wrapper lets `app/layout.tsx` stay a server
 * component so it can keep exporting `metadata` and `viewport`.
 */

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";

const NAVBAR_HIDDEN_PREFIXES = ["/auth", "/admin/login"];

function isNavbarHidden(pathname: string) {
  return NAVBAR_HIDDEN_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

export default function ConditionalNavbar() {
  const pathname = usePathname();

  if (isNavbarHidden(pathname)) return null;

  return <Navbar />;
}
