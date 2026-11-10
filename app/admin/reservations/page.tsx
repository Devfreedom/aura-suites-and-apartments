"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Edit3, Trash2, Loader2, AlertCircle } from "lucide-react";

import {
  adminDeleteBooking,
  adminFetchBookings,
} from "@/app/admin/actions";
import type { Booking } from "@/types/booking";

const statusOptions = [
  { value: "all", label: "All Status" },
  { value: "Confirmed", label: "Confirmed" },
  { value: "Pending", label: "Pending" },
  { value: "Cancelled", label: "Cancelled" },
];

const suiteOptions = [
  { value: "all", label: "All Suites" },
  { value: "Deluxe Studio", label: "Deluxe Studio" },
  { value: "Royal 1-Bedroom Suite", label: "Royal 1-Bedroom Suite" },
  { value: "Executive 2-Bedroom Suite", label: "Executive 2-Bedroom Suite" },
  { value: "Grand Family 2-Bedroom", label: "Grand Family 2-Bedroom" },
  { value: "Diplomatic 3-Bedroom Suite", label: "Diplomatic 3-Bedroom Suite" },
  { value: "Presidential Penthouse", label: "Presidential Penthouse" },
];

interface Reservation {
  id: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  suite: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  nights: number;
  amount: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
}

function bookingToReservation(b: Booking): Reservation {
  return {
    id: b.id,
    guestName: b.customerName,
    guestEmail: b.customerEmail,
    guestPhone: b.customerPhone,
    suite: b.suiteType,
    checkIn: b.checkIn,
    checkOut: b.checkOut,
    guests: b.guestCount,
    nights: b.nights,
    amount: b.totalAmount,
    status: b.bookingStatus.charAt(0).toUpperCase() + b.bookingStatus.slice(1),
    paymentStatus:
      {
        paid: "Paid",
        pending: "Unpaid",
        failed: "Failed",
        abandoned: "Abandoned",
      }[b.paymentStatus] || b.paymentStatus,
    createdAt: b.createdAt,
  };
}

const statusColors: Record<string, string> = {
  Confirmed: "text-emerald-600 bg-emerald-50",
  Pending: "text-amber-600 bg-amber-50",
  Cancelled: "text-red-600 bg-red-50",
};

const paymentColors: Record<string, string> = {
  Paid: "text-emerald-600 bg-emerald-50",
  Unpaid: "text-amber-600 bg-amber-50",
  Refunded: "text-gray-600 bg-gray-50",
  Failed: "text-red-600 bg-red-50",
  Abandoned: "text-gray-600 bg-gray-50",
};

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [statusFilter, setStatusFilter] = useState("all");
  const [suiteFilter, setSuiteFilter] = useState("all");
  const [dateRange, setDateRange] = useState("");
  const [showActionModal, setShowActionModal] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);

  const loadReservations = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);

    try {
      const data = await adminFetchBookings();
      setReservations(data.map(bookingToReservation));
    } catch (error) {
      setLoadError(
        error instanceof Error ? error.message : "Failed to load reservations."
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadReservations();
  }, [loadReservations]);

  const filteredReservations = reservations.filter((r) => {
    const matchStatus =
      statusFilter === "all" || r.status === statusFilter;
    const matchSuite = suiteFilter === "all" || r.suite === suiteFilter;
    const matchDate =
      !dateRange || r.checkIn === dateRange;
    return matchStatus && matchSuite && matchDate;
  });

  async function handleDelete(reservation: Reservation) {
    const confirmed = window.confirm(
      `Delete reservation for "${reservation.guestName}"? This cannot be undone.`
    );
    if (!confirmed) return;

    setDeletingId(reservation.id);
    setLoadError(null);

    try {
      const result = await adminDeleteBooking(reservation.id);
      if (!result.ok) {
        setLoadError(result.message);
        setDeletingId(null);
        return;
      }
      setReservations((prev) =>
        prev.filter((item) => item.id !== reservation.id)
      );
      if (selectedReservation?.id === reservation.id) {
        setShowActionModal(false);
        setSelectedReservation(null);
      }
    } catch (error) {
      setLoadError(
        error instanceof Error ? error.message : "Failed to delete reservation."
      );
    } finally {
      setDeletingId(null);
    }
  }

  const handleAction = (action: string) => {
    if (!selectedReservation) return;
    console.log(`${action} reservation ${selectedReservation.id}`);
    setShowActionModal(false);
    setSelectedReservation(null);
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif font-bold text-3xl text-navy">
            Reservations Management
          </h1>
          <p className="text-gray-600 mt-2">
            Manage all room reservations and bookings
          </p>
        </div>
        <Link
          href="/admin/reservations/new"
          className="inline-flex items-center gap-2 bg-navy text-white px-6 py-3 rounded-xl font-medium hover:bg-navy/90 transition-all"
        >
          <Plus className="w-4 h-4" />
          New Reservation
        </Link>
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

      {/* Filters */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-navy mb-2">
              Status Filter
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none text-sm text-navy bg-gray-50/50"
            >
              {statusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-navy mb-2">
              Suite Filter
            </label>
            <select
              value={suiteFilter}
              onChange={(e) => setSuiteFilter(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none text-sm text-navy bg-gray-50/50"
            >
              {suiteOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1 min-w-[250px]">
            <label className="block text-sm font-medium text-navy mb-2">
              Date Range (check-in)
            </label>
            <input
              type="date"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none text-sm text-navy bg-gray-50/50"
            />
          </div>
        </div>
      </div>

      {/* Reservations Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-6 py-4 text-sm font-medium text-gray-500 w-24">
                  ID
                </th>
                <th className="px-6 py-4 text-sm font-medium text-gray-500">
                  Guest
                </th>
                <th className="px-6 py-4 text-sm font-medium text-gray-500">
                  Suite
                </th>
                <th className="px-6 py-4 text-sm font-medium text-gray-500">
                  Dates
                </th>
                <th className="px-6 py-4 text-sm font-medium text-gray-500">
                  Guests
                </th>
                <th className="px-6 py-4 text-sm font-medium text-gray-500">
                  Amount
                </th>
                <th className="px-6 py-4 text-sm font-medium text-gray-500">
                  Payment
                </th>
                <th className="px-6 py-4 text-sm font-medium text-gray-500">
                  Status
                </th>
                <th className="px-6 py-4 text-sm font-medium text-gray-500 text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={9} className="px-6 py-20 text-center text-gray-500">
                    <Loader2 className="w-5 h-5 animate-spin mb-2" />
                    <p className="text-sm">Loading reservations…</p>
                  </td>
                </tr>
              ) : filteredReservations.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-20 text-center">
                    <div className="w-14 h-14 rounded-full bg-gold/10 text-gold flex items-center justify-center mx-auto mb-4">
                      <Trash2 className="w-7 h-7" />
                    </div>
                    <h3 className="font-serif font-bold text-lg text-navy">
                      No reservations found
                    </h3>
                    <p className="text-sm text-gray-500 mt-1 max-w-md mx-auto">
                      Adjust the filters above, or there are no bookings yet.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredReservations.map((res) => (
                  <tr
                    key={res.id}
                    className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors group"
                  >
                    <td className="px-6 py-4 text-sm text-gray-600 font-mono">
                      {res.id}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-navy">{res.guestName}</div>
                      <div className="text-xs text-gray-400">{res.guestEmail}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {res.suite}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <div className="font-medium">{res.checkIn}</div>
                      <div className="text-xs text-gray-400">{res.checkOut}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {res.guests} guest{res.guests !== 1 ? "s" : ""}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-navy">
                      ₦{res.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${paymentColors[res.paymentStatus]}`}>
                        {res.paymentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[res.status]}`}>
                        {res.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedReservation(res);
                            setShowActionModal(true);
                          }}
                          disabled={deletingId === res.id}
                          className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 hover:text-navy transition-colors disabled:opacity-50"
                          title="Manage Reservation"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => void handleDelete(res)}
                          disabled={deletingId === res.id}
                          className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-red-50 flex items-center justify-center text-gray-600 hover:text-red-600 transition-colors disabled:opacity-50"
                          title="Delete Reservation"
                        >
                          {deletingId === res.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Action Modal */}
      {showActionModal && selectedReservation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-3xl border border-gold/30 bg-white shadow-2xl">
            <div className="bg-navy px-6 py-4">
              <h2 className="font-serif font-bold text-xl text-white">
                Manage Reservation
              </h2>
              <p className="text-gray-300 text-sm mt-1">
                {selectedReservation.guestName}
              </p>
            </div>
            <div className="p-6 space-y-6">
              <div className="space-y-2">
                <p className="text-sm font-medium text-navy">Reservation ID</p>
                <p className="text-sm text-gray-600 font-mono">
                  {selectedReservation.id}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-navy">Current Status</p>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[selectedReservation.status]}`}>
                  {selectedReservation.status}
                </span>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-navy">Payment Status</p>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${paymentColors[selectedReservation.paymentStatus]}`}>
                  {selectedReservation.paymentStatus}
                </span>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-navy">Dates</p>
                <p className="text-sm text-gray-600">
                  {selectedReservation.checkIn} →{" "}
                  {selectedReservation.checkOut}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-navy">Guests / Nights</p>
                <p className="text-sm text-gray-600">
                  {selectedReservation.guests} guest{"s".repeat(Math.max(selectedReservation.guests - 1, 0))} ·{" "}
                  {selectedReservation.nights} night{"s".repeat(Math.max(selectedReservation.nights - 1, 0))}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-navy">Amount</p>
                <p className="text-sm font-medium text-navy">
                  ₦{selectedReservation.amount.toLocaleString()}
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => handleAction("Check-In")}
                  className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all ${
                    selectedReservation.status === "Confirmed"
                      ? "bg-emerald-600 text-white hover:bg-emerald-700"
                      : "bg-gray-200 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  Check-In
                </button>
                <button
                  onClick={() => handleAction("Check-Out")}
                  className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all ${
                    selectedReservation.status === "Confirmed"
                      ? "bg-navy text-white hover:bg-navy/90"
                      : "bg-gray-200 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  Check-Out
                </button>
              </div>
              <button
                onClick={() => handleAction("Cancel")}
                className="w-full px-4 py-3 rounded-xl bg-red-50 text-red-600 font-medium hover:bg-red-100 transition-all border border-red-200"
              >
                Issue Cancellation
              </button>
            </div>
            <div className="px-6 py-4 flex justify-end gap-2 bg-gray-50">
              <button
                onClick={() => {
                  setShowActionModal(false);
                  setSelectedReservation(null);
                }}
                className="px-6 py-2 rounded-lg text-gray-600 font-medium hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
