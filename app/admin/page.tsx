import type { Metadata } from "next";
import Link from "next/link";
import {
  Building2,
  CalendarCheck,
  ChevronRight,
  CreditCard,
  ExternalLink,
  FileText,
  Settings,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";

import { createAdminClient } from "@/lib/supabase/admin";
import { getBookings } from "@/lib/bookings";
import { formatDate, formatPrice } from "@/lib/format";
import type { Booking, BookingStatus } from "@/types/booking";

export const metadata: Metadata = {
  title: "Admin Overview | Aura Suites & Apartments",
  description: "Bookings, revenue and suite inventory at a glance.",
};

// The admin shell reads the current pathname (client hook) and the overview
// reads live booking data — never prerender this route.
export const instant = false;

const STATUS_STYLES: Record<BookingStatus, string> = {
  confirmed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  cancelled: "bg-red-50 text-red-700 border-red-200",
};

const STATUS_LABELS: Record<BookingStatus, string> = {
  confirmed: "Confirmed",
  pending: "Pending",
  cancelled: "Cancelled",
};

export default async function AdminOverviewPage() {
  let bookings: Booking[] = [];
  let suitesTotal = 0;
  let suitesActive = 0;
  let loadError: string | null = null;

  try {
    const supabase = createAdminClient();

    const [bookingsResult, suitesResult] = await Promise.all([
      getBookings(),
      supabase.from("suites").select("is_published"),
    ]);

    bookings = bookingsResult;

    if (suitesResult.error) {
      throw new Error(`Failed to load suites: ${suitesResult.error.message}`);
    }

    const suiteRows = (suitesResult.data ?? []) as { is_published: boolean | null }[];
    suitesTotal = suiteRows.length;
    suitesActive = suiteRows.filter((s) => s.is_published !== false).length;
  } catch (error) {
    // Graceful fallback: the page still renders with zeroed metrics.
    loadError =
      error instanceof Error ? error.message : "Failed to load dashboard data.";
  }

  const paidBookings = bookings.filter((b) => b.paymentStatus === "paid");
  const totalRevenue = paidBookings.reduce((sum, b) => sum + b.totalAmount, 0);
  const confirmedBookings = bookings.filter(
    (b) => b.bookingStatus === "confirmed"
  );
  const upcomingStays = confirmedBookings.filter(
    (b) => b.checkOut >= new Date().toISOString().split("T")[0]
  );
  const recentBookings = bookings.slice(0, 5);

  const stats = [
    {
      label: "Total Bookings",
      value: String(bookings.length),
      hint: `${confirmedBookings.length} confirmed · ${upcomingStays.length} upcoming`,
      icon: CalendarCheck,
      accent: "bg-navy/10 text-navy",
    },
    {
      label: "Total Revenue",
      value: formatPrice(totalRevenue),
      hint: `${paidBookings.length} paid reservation${paidBookings.length === 1 ? "" : "s"}`,
      icon: Wallet,
      accent: "bg-gold/10 text-gold",
    },
    {
      label: "Active Suites",
      value: String(suitesActive),
      hint: `${suitesTotal} total suite${suitesTotal === 1 ? "" : "s"} in the catalogue`,
      icon: Building2,
      accent: "bg-emerald-50 text-emerald-600",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-navy">
            Admin Overview
          </h1>
          <p className="mt-2 text-gray-600">
            Everything happening at Aura Suites &amp; Apartments, at a glance.
          </p>
        </div>
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-navy/15 bg-white px-4 py-3 text-sm font-semibold text-navy shadow-sm transition-colors hover:bg-gray-50 sm:self-auto min-h-[44px]"
        >
          <ExternalLink className="h-4 w-4 text-gold" />
          Back to Guest Site
        </Link>
      </div>

      {loadError && (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          <span className="mt-0.5 h-4 w-4 flex-shrink-0 rounded-full bg-red-500/80" />
          <p>{loadError} Showing totals from available data.</p>
        </div>
      )}

      {/* Key statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map(({ label, value, hint, icon: Icon, accent }) => (
          <div
            key={label}
            className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-500">{label}</p>
                <p className="mt-1 truncate font-serif text-2xl font-bold text-navy">
                  {value}
                </p>
              </div>
              <div
                className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl ${accent}`}
              >
                <Icon className="h-6 w-6" />
              </div>
            </div>
            <p className="mt-3 text-xs text-gray-500">{hint}</p>
          </div>
        ))}
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Link
          href="/admin/reservations"
          className="flex items-center justify-between gap-3 rounded-xl bg-navy px-5 py-4 font-medium text-white transition-colors hover:bg-navy/90 min-h-[48px]"
        >
          <span className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-gold" />
            Reservations
          </span>
          <ChevronRight className="h-4 w-4" />
        </Link>
        <Link
          href="/admin/suites"
          className="flex items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white px-5 py-4 font-medium text-navy transition-colors hover:bg-gray-50 min-h-[48px]"
        >
          <span className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-gold" />
            Suite Management
          </span>
          <ChevronRight className="h-4 w-4 text-gray-400" />
        </Link>
        <Link
          href="/admin/transactions"
          className="flex items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white px-5 py-4 font-medium text-navy transition-colors hover:bg-gray-50 min-h-[48px]"
        >
          <span className="flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-gold" />
            Transactions
          </span>
          <ChevronRight className="h-4 w-4 text-gray-400" />
        </Link>
        <Link
          href="/admin/settings"
          className="flex items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white px-5 py-4 font-medium text-navy transition-colors hover:bg-gray-50 min-h-[48px]"
        >
          <span className="flex items-center gap-2">
            <Settings className="h-4 w-4 text-gold" />
            Site Settings
          </span>
          <ChevronRight className="h-4 w-4 text-gray-400" />
        </Link>
      </div>

      {/* Recent reservations */}
      <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-200 p-6">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-gold" />
            <h2 className="font-serif text-xl font-bold text-navy">
              Recent Reservations
            </h2>
          </div>
          <Link
            href="/admin/reservations"
            className="text-sm font-medium text-gold hover:underline"
          >
            View All →
          </Link>
        </div>

        <div className="overflow-x-auto">
          {recentBookings.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gold/10 text-gold">
                <Users className="h-7 w-7" />
              </div>
              <h3 className="font-serif text-lg font-bold text-navy">
                No recent reservations
              </h3>
              <p className="mt-1 max-w-sm text-sm text-gray-500">
                Bookings made through the website will appear here as soon as
                payment is confirmed.
              </p>
            </div>
          ) : (
            <table className="w-full min-w-[760px] text-left">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-6 py-4 text-sm font-medium text-gray-500">
                    Reference
                  </th>
                  <th className="px-6 py-4 text-sm font-medium text-gray-500">
                    Guest
                  </th>
                  <th className="px-6 py-4 text-sm font-medium text-gray-500">
                    Suite
                  </th>
                  <th className="px-6 py-4 text-sm font-medium text-gray-500">
                    Check-in / out
                  </th>
                  <th className="px-6 py-4 text-sm font-medium text-gray-500">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-sm font-medium text-gray-500">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.map((booking) => (
                  <tr
                    key={booking.id}
                    className="border-b border-gray-100 transition-colors hover:bg-gray-50/60"
                  >
                    <td className="px-6 py-4 font-mono text-xs text-gray-600">
                      {booking.reference}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-navy">
                      {booking.customerName || "—"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {booking.suiteType || "—"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <div>{formatDate(booking.checkIn)}</div>
                      <div className="text-xs text-gray-400">
                        {formatDate(booking.checkOut)}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-navy">
                      {formatPrice(booking.totalAmount)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                          STATUS_STYLES[booking.bookingStatus] ??
                          "border-gray-200 bg-gray-50 text-gray-600"
                        }`}
                      >
                        {STATUS_LABELS[booking.bookingStatus] ?? booking.bookingStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
