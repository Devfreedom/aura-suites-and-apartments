import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createServerClient } from "@supabase/ssr";
import {
  Calendar,
  Users,
  Moon,
  Sparkles,
  ChevronRight,
  Wallet,
  MapPin,
  CalendarClock,
  ExternalLink,
} from "lucide-react";

import { supabaseUrl, supabaseAnonKey } from "@/lib/supabase/config";
import { getBookingsForUser } from "@/lib/bookings";
import { formatPrice, formatDate, todayISO, VENUE_ADDRESS, DIRECTIONS_URL } from "@/lib/format";
import BookingCard from "@/components/dashboard/BookingCard";
import ProfileSettingsForm from "@/components/dashboard/ProfileSettingsForm";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import type { Booking } from "@/types/booking";

export const metadata: Metadata = {
  title: "Dashboard | Aura Suites & Apartments",
  description: "View your bookings, upcoming stays, and payment history.",
};

export const instant = false;

/**
 * The most immediate upcoming reservation: confirmed, not cancelled, and
 * ending today or later. Ordered so the earliest check-in wins.
 */
function getFeaturedUpcomingStay(bookings: Booking[]): Booking | null {
  const today = todayISO();
  return (
    bookings
      .filter(
        (b) =>
          b.bookingStatus === "confirmed" &&
          b.checkOut >= today &&
          b.checkIn >= today
      )
      .sort((a, b) => a.checkIn.localeCompare(b.checkIn))[0] ?? null
  );
}

/** "In 3 days" / "Today" / live-stay label for the hero card. */
function checkInCountdownLabel(checkIn: string): string {
  const today = todayISO();
  if (checkIn === today) return "Checking in today";
  if (checkIn < today) return "Your stay is underway";

  const days = Math.round(
    (new Date(checkIn).getTime() - new Date(today).getTime()) / 86_400_000
  );
  if (Number.isNaN(days) || days <= 1) return "Checking in tomorrow";
  return `Checking in ${formatDate(checkIn)} — in ${days} days`;
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

  const [bookings, { data: authUser }] = await Promise.all([
    getBookingsForUser(user.id, user.email ?? undefined),
    supabase.auth.getUser(),
  ]);
  const currentUser = (authUser.user ?? user) as SupabaseUser;

  const confirmedBookings = bookings.filter(
    (b) =>
      b.bookingStatus === "confirmed" ||
      b.paymentStatus === "paid"
  );
  const totalSpent = confirmedBookings.reduce(
    (sum, b) => sum + b.totalAmount,
    0
  );
  const today = todayISO();
  const upcoming = confirmedBookings.filter((b) => b.checkOut >= today);
  const featuredStay = getFeaturedUpcomingStay(bookings);

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

      {/* Featured upcoming stay */}
      {featuredStay && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
          <div className="relative overflow-hidden rounded-3xl border-2 border-gold/60 bg-navy text-white shadow-xl">
            <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-l from-gold/20 to-transparent pointer-events-none" />
            <div className="relative z-10 p-6 sm:p-9 grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              {/* Left: stay summary */}
              <div>
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gold/20 text-gold text-xs font-semibold tracking-widest uppercase mb-4">
                  <CalendarClock className="w-4 h-4" />
                  Upcoming stay
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold">
                  {featuredStay.suiteType || "Suite reservation"}
                </h2>
                <p className="mt-1 text-sm font-medium text-gold">
                  {checkInCountdownLabel(featuredStay.checkIn)}
                </p>
                <div className="mt-5 grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gold shrink-0" />
                    <div>
                      <p className="text-[11px] uppercase tracking-wider text-gray-400">
                        Check-in
                      </p>
                      <p className="text-sm font-medium">
                        {formatDate(featuredStay.checkIn)} · 2:00 PM
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gold shrink-0" />
                    <div>
                      <p className="text-[11px] uppercase tracking-wider text-gray-400">
                        Check-out
                      </p>
                      <p className="text-sm font-medium">
                        {formatDate(featuredStay.checkOut)} · 12:00 noon
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gold shrink-0" />
                    <div>
                      <p className="text-[11px] uppercase tracking-wider text-gray-400">
                        Guests
                      </p>
                      <p className="text-sm font-medium">
                        {featuredStay.guestCount || "—"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Moon className="w-4 h-4 text-gold shrink-0" />
                    <div>
                      <p className="text-[11px] uppercase tracking-wider text-gray-400">
                        Ref
                      </p>
                      <p className="text-sm font-medium truncate">
                        {featuredStay.reference}
                      </p>
                    </div>
                  </div>
                </div>
                <a
                  href={DIRECTIONS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gold px-5 py-3 text-sm font-semibold text-white shadow-lg transition-colors hover:bg-[#C5A028]"
                >
                  <MapPin className="h-4 w-4" />
                  Get Check-In Directions
                  <ExternalLink className="h-3.5 w-3.5 text-white/70" />
                </a>
              </div>

              {/* Right: directions card */}
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="text-gold w-5 h-5" />
                  <h3 className="font-serif font-bold text-lg">Where to find us</h3>
                </div>
                <p className="text-sm text-gray-300 leading-relaxed">
                  {VENUE_ADDRESS}
                </p>
                <div className="mt-4 space-y-2 text-sm text-gray-200">
                  <p className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-gold shrink-0" />
                    Check-in starts at 2:00 PM — present your booking reference and
                    a valid ID at the front desk.
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-gold shrink-0" />
                    Free on-site parking is available for the duration of your stay.
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-gold shrink-0" />
                    Full check-in instructions and house rules are on your
                    reservation card below — use &quot;View Stay Details&quot;.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Bookings list */}
      <section
        id="bookings"
        className="max-w-7xl mx-auto scroll-mt-24 px-4 sm:px-6 lg:px-8 py-10"
      >
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
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </div>
        )}
      </section>

      {/* Profile settings */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <ProfileSettingsForm user={currentUser} />
      </section>
    </main>
  );
}
