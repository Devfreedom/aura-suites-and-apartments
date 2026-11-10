import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createServerClient } from "@supabase/ssr";
import {
  Calendar,
  Users,
  Moon,
  CreditCard,
  Sparkles,
  ChevronRight,
  Wallet,
} from "lucide-react";

import { supabaseUrl, supabaseAnonKey } from "@/lib/supabase/config";
import { getBookingsForUser } from "@/lib/bookings";
import type { Booking } from "@/types/booking";

export const metadata: Metadata = {
  title: "Dashboard | Aura Suites & Apartments",
  description: "View your bookings, upcoming stays, and payment history.",
};

export const instant = false;

const NAIRA_FORMATTER = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  minimumFractionDigits: 0,
});

function formatPrice(amount: number) {
  return NAIRA_FORMATTER.format(amount);
}

function formatDate(value: string) {
  if (!value) return "—";
  const d = new Date(value);
  return Number.isNaN(d.getTime())
    ? "—"
    : d.toLocaleDateString("en-NG", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
}

function statusBadge(paymentStatus: string, bookingStatus: string) {
  const isConfirmed =
    bookingStatus === "confirmed" || paymentStatus === "paid";

  if (isConfirmed) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200">
        Confirmed
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 border border-amber-200">
      Awaiting payment
    </span>
  );
}

export default async function DashboardPage() {
  // Server-side session check — redirect unauthenticated users to sign-in
  const cookieStore = await cookies();
  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll() {
        // Read-only in Server Component
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/sign-in?redirectTo=%2Fdashboard");
  }

  const bookings = await getBookingsForUser(
    user.id,
    user.email ?? undefined
  );

  const confirmedBookings = bookings.filter(
    (b) =>
      b.bookingStatus === "confirmed" ||
      b.paymentStatus === "paid"
  );
  const totalSpent = confirmedBookings.reduce(
    (sum, b) => sum + b.totalAmount,
    0
  );
  const today = new Date().toISOString().split("T")[0];
  const upcoming = confirmedBookings.filter((b) => b.checkOut >= today);

  const displayName =
    user.user_metadata?.full_name ||
    user.email?.split("@")[0] ||
    "Guest";

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-navy py-14 text-white relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-l from-gold/20 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gold/20 text-gold text-xs font-semibold tracking-widest uppercase mb-4">
            <Sparkles className="w-4 h-4" />
            Guest Dashboard
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
            Welcome back, {displayName}
          </h1>
          <p className="mt-2 text-gray-300 text-sm sm:text-base max-w-2xl font-light">
            Manage your reservations, upcoming stays at No. 5 Kashim Ibrahim
            Road, Jos, and payment history — all in one place.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-2xl bg-white border border-gray-200 shadow-sm p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-navy/10 text-navy flex items-center justify-center shrink-0">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                  All bookings
                </p>
                <p className="font-serif font-bold text-2xl text-navy">
                  {bookings.length}
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-2xl bg-white border border-gray-200 shadow-sm p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <Moon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Upcoming stays
                </p>
                <p className="font-serif font-bold text-2xl text-navy">
                  {upcoming.length}
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-2xl bg-white border border-gray-200 shadow-sm p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gold/10 text-gold flex items-center justify-center shrink-0">
                <Wallet className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Total spent
                </p>
                <p className="font-serif font-bold text-2xl text-navy">
                  {formatPrice(totalSpent)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bookings list */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h2 className="font-serif font-bold text-2xl text-navy mb-6">
          {upcoming.length > 0 ? "Your reservations" : "Booking history"}
        </h2>

        {bookings.length === 0 ? (
          <div className="rounded-3xl border border-gray-200 bg-white p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-gold/10 text-gold flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8" />
            </div>
            <h3 className="font-serif font-bold text-lg text-navy">
              No bookings yet
            </h3>
            <p className="text-sm text-gray-500 mt-1 max-w-md mx-auto">
              When you reserve a suite, your stay details and payment history
              will appear here.
            </p>
            <Link
              href="/suites"
              className="mt-6 inline-flex items-center gap-2 bg-navy text-white px-6 py-3 rounded-xl font-medium hover:bg-navy/90 transition-all shadow-md"
            >
              Browse Our Suites
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {bookings.map((booking: Booking) => (
              <div
                key={booking.id}
                className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm flex flex-col gap-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-11 h-11 rounded-xl bg-navy text-gold flex items-center justify-center shrink-0">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-serif font-bold text-lg text-navy leading-tight truncate">
                        {booking.suiteType || "Suite reservation"}
                      </h3>
                      <p className="text-xs text-gray-400">
                        Ref: {booking.reference}
                      </p>
                    </div>
                  </div>
                  {statusBadge(booking.paymentStatus, booking.bookingStatus)}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-gray-100 pt-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gold shrink-0" />
                    <div className="min-w-0">
                      <p className="text-[11px] uppercase tracking-wider text-gray-400 font-medium">
                        Check-in
                      </p>
                      <p className="text-sm font-medium text-navy">
                        {formatDate(booking.checkIn)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gold shrink-0" />
                    <div className="min-w-0">
                      <p className="text-[11px] uppercase tracking-wider text-gray-400 font-medium">
                        Check-out
                      </p>
                      <p className="text-sm font-medium text-navy">
                        {formatDate(booking.checkOut)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gold shrink-0" />
                    <div>
                      <p className="text-[11px] uppercase tracking-wider text-gray-400 font-medium">
                        Guests
                      </p>
                      <p className="text-sm font-medium text-navy">
                        {booking.guestCount || "—"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Moon className="w-4 h-4 text-gold shrink-0" />
                    <div>
                      <p className="text-[11px] uppercase tracking-wider text-gray-400 font-medium">
                        Nights
                      </p>
                      <p className="text-sm font-medium text-navy">
                        {booking.nights || "—"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-gray-100 pt-4">
                  <p className="text-sm text-gray-500">
                    Paid with{" "}
                    <span className="font-medium text-navy">
                      {booking.paymentMethod || "Paystack"}
                    </span>
                    {booking.paidAt ? ` · ${formatDate(booking.paidAt)}` : ""}
                  </p>
                  <p className="font-serif font-bold text-xl text-navy">
                    {formatPrice(booking.totalAmount)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
