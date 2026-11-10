"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

/**
 * Shared shell + brand block for the auth pages (sign in / register),
 * so both routes present the same "Aura Suites & Apartments" identity.
 */
export default function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-navy px-4 py-12">
      {/* Decorative background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(212,175,55,0.18),transparent_45%),radial-gradient(circle_at_85%_80%,rgba(212,175,55,0.12),transparent_40%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 -left-24 h-96 w-96 rounded-full border border-gold/20"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 -right-24 h-[28rem] w-[28rem] rounded-full border border-gold/10"
      />

      <div className="relative w-full max-w-md">
        <div className="rounded-3xl border border-white/10 bg-white p-8 shadow-2xl sm:p-10">
          {/* Brand */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-navy font-serif text-2xl font-bold text-gold shadow-lg">
              A
            </div>
            <p className="font-serif text-2xl font-bold tracking-wide text-navy">
              AURA
            </p>
            <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-gold">
              Suites &amp; Apartments
            </p>
          </div>

          {children}
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-white/70 transition-colors hover:text-gold"
          >
            <ArrowRight className="h-4 w-4" />
            Back to website
          </Link>
        </div>
      </div>
    </div>
  );
}
