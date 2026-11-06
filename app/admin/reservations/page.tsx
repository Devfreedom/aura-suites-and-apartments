"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Edit3, Trash2 } from "lucide-react";

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

const reservations = [
  {
    id: "AURA_1748765432_abc123",
    guestName: "Dr. Amina Ibrahim",
    guestEmail: "amina@example.com",
    guestPhone: "+234 803 000 0001",
    suite: "Executive 2-Bedroom Suite",
    checkIn: "2026-11-10",
    checkOut: "2026-11-12",
    guests: 2,
    nights: 2,
    amount: 88000,
    status: "Confirmed",
    paymentStatus: "Paid",
    createdAt: "2026-10-28T10:00:00Z",
  },
  {
    id: "AURA_1748765433_def456",
    guestName: "Mr. Samuel Okafor",
    guestEmail: "samuel@example.com",
    guestPhone: "+234 803 000 0002",
    suite: "Deluxe Studio",
    checkIn: "2026-11-08",
    checkOut: "2026-11-09",
    guests: 2,
    nights: 1,
    amount: 20000,
    status: "Pending",
    paymentStatus: "Unpaid",
    createdAt: "2026-10-29T14:30:00Z",
  },
  {
    id: "AURA_1748765434_ghi789",
    guestName: "Ms. Grace Adebayo",
    guestEmail: "grace@example.com",
    guestPhone: "+234 803 000 0003",
    suite: "Presidential Penthouse",
    checkIn: "2026-11-15",
    checkOut: "2026-11-20",
    guests: 6,
    nights: 5,
    amount: 440000,
    status: "Confirmed",
    paymentStatus: "Paid",
    createdAt: "2026-10-30T09:15:00Z",
  },
  {
    id: "AURA_1748765435_jkl012",
    guestName: "Chief Bola Ahmed",
    guestEmail: "bola@example.com",
    guestPhone: "+234 803 000 0004",
    suite: "Royal 1-Bedroom Suite",
    checkIn: "2026-11-05",
    checkOut: "2026-11-07",
    guests: 2,
    nights: 2,
    amount: 64000,
    status: "Cancelled",
    paymentStatus: "Refunded",
    createdAt: "2026-10-31T16:45:00Z",
  },
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

const statusColors: Record<string, string> = {
  Confirmed: "text-emerald-600 bg-emerald-50",
  Pending: "text-amber-600 bg-amber-50",
  Cancelled: "text-red-600 bg-red-50",
};

const paymentColors: Record<string, string> = {
  Paid: "text-emerald-600 bg-emerald-50",
  Unpaid: "text-amber-600 bg-amber-50",
  Refunded: "text-gray-600 bg-gray-50",
};

export default function ReservationsPage() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [suiteFilter, setSuiteFilter] = useState("all");
  const [dateRange, setDateRange] = useState("");
  const [showActionModal, setShowActionModal] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);

  const filteredReservations = reservations.filter((r) => {
    const matchStatus =
      statusFilter === "all" || r.status === statusFilter;
    const matchSuite =
      suiteFilter === "all" || r.suite === suiteFilter;
    return matchStatus && matchSuite;
  });

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
              Date Range
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
              {filteredReservations.map((res) => (
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
                        className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 hover:text-navy transition-colors"
                        title="Manage Reservation"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-red-50 flex items-center justify-center text-gray-600 hover:text-red-600 transition-colors"
                        title="Delete Reservation"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
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
                onClick={() => setShowActionModal(false)}
                className="px-6 py-2 rounded-lg text-gray-600 font-medium hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
