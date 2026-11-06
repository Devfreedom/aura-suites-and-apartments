import type { Metadata } from "next";
import UnsubscribeClient from "./UnsubscribeClient";
import { verifyUnsubscribeToken } from "@/lib/newsletter";

export const metadata: Metadata = {
  title: "Unsubscribe | Aura Suites & Apartments",
  description:
    "Manage your Aura Suites & Apartments newsletter subscription preferences.",
  robots: { index: false, follow: false },
};

// This page depends on a request-time `token` query parameter, so it is
// intentionally rendered on demand rather than from a prerendered shell.
export const instant = false;

interface UnsubscribePageProps {
  searchParams: Promise<{ token?: string }>;
}

export default async function UnsubscribePage({
  searchParams,
}: UnsubscribePageProps) {
  const { token } = await searchParams;
  const payload = token ? verifyUnsubscribeToken(token) : null;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-16">
      <div className="mb-8 text-center">
        <p className="font-serif text-3xl font-bold tracking-wide text-navy">
          AURA
        </p>
        <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-gold">
          Suites &amp; Apartments
        </p>
      </div>

      {token && !payload ? (
        <div className="w-full max-w-lg rounded-3xl border border-gray-100 bg-white p-8 text-center shadow-xl sm:p-10">
          <h1 className="font-serif text-2xl font-bold text-navy">
            Link Expired
          </h1>
          <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-gray-500">
            This unsubscribe link is invalid or has expired. Request a fresh link
            below and we&apos;ll email it to you.
          </p>
          <div className="mt-8 text-left">
            <UnsubscribeClient />
          </div>
        </div>
      ) : (
        <UnsubscribeClient token={token} email={payload?.email} />
      )}
    </main>
  );
}
