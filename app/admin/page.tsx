"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  TrendingUp,
  DollarSign,
  Users,
  Clock,
  ChevronRight,
  AlertCircle,
  Loader2,
} from "lucide-react";

import { getBookings } from "@/lib/bookings";
import type { Booking } from "@/types/booking";

export const instant = false;

const statusColors: Record<string, string> = {
  Confirmed: "text-emerald-600 bg-emerald-50",
  Pending: "text-amber-600 bg-amber-50",
  Cancelled: "text-red-600 bg-red-50",
};

export default function AdminPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const loadBookings = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);

    try {
      const data = await getBookings();
      setBookings(data);
    } catch (error) {
      setLoadError(
        error instanceof Error ? error.message : "Failed to load dashboard data."
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadBookings();
  }, [loadBookings]);

  // Live metrics computed from the bookings table.
  const totalRevenue = bookings
    .filter((b) => b.paymentStatus === "paid")
    .reduce((sum, b) => sum + b.totalAmount, 0);

  const activeGuests = bookings
    .filter((b) => b.bookingStatus === "confirmed")
    .reduce((sum, b) => sum + b.guestCount, 0);

  const pendingCheckIns = bookings.filter(
    (b) => b.bookingStatus === "pending"
  ).length;

  // Proxy: share of bookings that are confirmed. A true occupancy rate would
  // require suite inventory / total available nights, which isn't tracked yet.
  const occupancyRate =
    bookings.length > 0
      ? Math.round(
          (bookings.filter((b) => b.bookingStatus === "confirmed").length /
            bookings.length) *
            100
        )
      : 0;

  // 5 most recent bookings (getBookings already orders by created_at desc).
  const recentBookings = bookings.slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="font-serif font-bold text-3xl text-navy">Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Welcome back to Aura Suites & Apartments admin panel
        </p>
      </div>

      {loadError && (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700"
        >
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <p>{loadError}</p>
        </div>
      )}

      {/* Metric Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-500">Total Revenue</p>
              <p className="mt-1 truncate font-serif text-2xl font-bold text-navy">
                {isLoading ? "—" : `₦${totalRevenue.toLocaleString()}`}
              </p>
            </div>
            <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-gold/10 text-gold">
              <DollarSign className="h-6 w-6" />
            </div>
          </div>
          <p className="mt-3 text-xs text-gray-500">
            ▲ 12% vs last month
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-500">Occupancy Rate</p>
              <p className="mt-1 truncate font-serif text-2xl font-bold text-navy">
                {isLoading ? "—" : `${occupancyRate}%`}
              </p>
            </div>
            <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-gold/10 text-gold">
              <TrendingUp className="h-6 w-6" />
            </div>
          </div>
          <p className="mt-3 text-xs text-gray-500">
            ▲ 5% vs last month
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-500">Active Guests</p>
              <p className="mt-1 truncate font-serif text-2xl font-bold text-navy">
                {isLoading ? "—" : activeGuests}
              </p>
            </div>
            <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-gold/10 text-gold">
              <Users className="h-6 w-6" />
            </div>
          </div>
          <p className="mt-3 text-xs text-gray-500">
            ▲ 2 guests today
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-500">
                Pending Check-ins
              </p>
              <p className="mt-1 truncate font-serif text-2xl font-bold text-navy">
                {isLoading ? "—" : pendingCheckIns}
              </p>
            </div>
            <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <Clock className="h-6 w-6" />
            </div>
          </div>
          <p className="mt-3 text-xs text-gray-500">
            ▲ 1 new this morning
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
        <Link
          href="/admin/reservations"
          className="flex-1 bg-navy text-white px-6 py-4 rounded-xl font-medium hover:bg-navy/90 transition-all flex items-center justify-between"
        >
          <span>Manage Reservations</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
        <Link
          href="/"
          className="flex-1 bg-white border border-gray-200 text-navy px-6 py-4 rounded-xl font-medium hover:bg-gray-50 transition-all flex items-center justify-between"
        >
          <span>New Reservation</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Recent Reservations */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="font-serif font-bold text-xl text-navy">
            Recent Reservations
          </h2>
          <Link
            href="/admin/reservations"
            className="text-sm text-gold font-medium hover:underline"
          >
            View All →
          </Link>
        </div>

        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex items-center justify-center gap-3 py-20 text-gray-500">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-sm">Loading reservations…</span>
            </div>
          ) : recentBookings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center px-6">
              <div className="w-14 h-14 rounded-full bg-gold/10 text-gold flex items-center justify-center mb-4">
                <Users className="w-7 h-7" />
              </div>
              <h3 className="font-serif font-bold text-lg text-navy">
                No recent reservations
              </h3>
              <p className="text-sm text-gray-500 mt-1 max-w-sm">
                Bookings made through the site will appear here.
              </p>
            </div>
          ) : (
            <table className="w-full min-w-[720px] text-left">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-6 py-4 text-sm font-medium text-gray-500">
                    Reservation ID
                  </th>
                  <th className="px-6 py-4 text-sm font-medium text-gray-500">
                    Guest Name
                  </th>
                  <th className="px-6 py-4 text-sm font-medium text-gray-500">
                    Suite
                  </th>
                  <th className="px-6 py-4 text-sm font-medium text-gray-500">
                    Check-in / Check-out
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
                {recentBookings.map((res) => (
                  <tr
                    key={res.id}
                    className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm text-gray-600 font-mono">
                      {res.id}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-navy">
                      {res.customerName}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {res.suiteType}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <div>{res.checkIn}</div>
                      <div className="text-xs text-gray-400">{res.checkOut}</div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-navy">
                      ₦{res.totalAmount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[res.bookingStatus.charAt(0).toUpperCase() + res.bookingStatus.slice(1)]}`}>
                        {res.bookingStatus.charAt(0).toUpperCase() + res.bookingStatus.slice(1)}
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
