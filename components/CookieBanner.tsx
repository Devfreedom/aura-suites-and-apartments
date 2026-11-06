"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Cookie, X } from "lucide-react";

const STORAGE_KEY = "aura-cookie-consent";

export type CookieConsent = "all" | "essential";

interface CookieBannerProps {
  title?: string;
  message?: string;
  acceptLabel?: string;
  declineLabel?: string;
  policyHref?: string;
}

/**
 * Cookie consent banner.
 *
 * Consent is stored in `localStorage` under `aura-cookie-consent`:
 * `{ "choice": "all" | "essential", "timestamp": "<ISO date>" }`.
 */
export default function CookieBanner({
  title = "We value your privacy",
  message = "We use cookies to keep the site secure, remember your preferences, and understand how our suites are discovered. You can accept all cookies or continue with essential cookies only.",
  acceptLabel = "Accept All Cookies",
  declineLabel = "Essential Only",
  policyHref = "/privacy-policy#cookies",
}: CookieBannerProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        setIsVisible(true);
      }
    } catch {
      // localStorage can be blocked in private mode — show the banner anyway.
      setIsVisible(true);
    }
  }, []);

  function saveConsent(choice: CookieConsent) {
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ choice, timestamp: new Date().toISOString() })
      );
    } catch {
      // Ignore storage failures; the banner still dismisses for this session.
    }

    setIsVisible(false);
  }

  if (!isVisible) {
    return null;
  }

  return (
    <div
      role="region"
      aria-label="Cookie consent"
      className="fixed inset-x-0 bottom-0 z-[90] px-4 pb-4 sm:px-6 sm:pb-6"
    >
      <div className="relative mx-auto flex max-w-4xl flex-col gap-5 rounded-2xl border border-gold/30 bg-navy p-6 text-white shadow-2xl sm:flex-row sm:items-start sm:gap-6">
        <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-white/10 text-gold">
          <Cookie className="h-5 w-5" />
        </div>

        <div className="flex-1">
          <h2 className="font-serif text-lg font-bold text-white">{title}</h2>
          <p className="mt-2 text-sm leading-relaxed text-gray-300">
            {message}{" "}
            <Link
              href={policyHref}
              className="text-gold underline underline-offset-2 hover:text-[#E4C766]"
            >
              Read our Privacy Policy
            </Link>
            .
          </p>

          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={() => saveConsent("all")}
              className="inline-flex items-center justify-center rounded-xl bg-gold px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#C5A028]"
            >
              {acceptLabel}
            </button>
            <button
              type="button"
              onClick={() => saveConsent("essential")}
              className="inline-flex items-center justify-center rounded-xl border border-white/25 px-5 py-2.5 text-sm font-medium text-gray-200 transition-colors hover:border-white/40 hover:text-white"
            >
              {declineLabel}
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={() => saveConsent("essential")}
          aria-label="Dismiss cookie banner"
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-white/10 hover:text-white sm:relative sm:right-auto sm:top-auto"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
