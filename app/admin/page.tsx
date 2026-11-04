import Link from "next/link";
import {
  TrendingUp,
  DollarSign,
  Users,
  Clock,
  ChevronRight,
} from "lucide-react";

const recentReservations = [
  {
    id: "AURA_1748765432_abc123",
    guestName: "Dr. Amina Ibrahim",
    suite: "Executive 2-Bedroom Suite",
    checkIn: "2026-11-10",
    checkOut: "2026-11-12",
    status: "Confirmed",
    amount: 88000,
  },
  {
    id: "AURA_1748765433_def456",
    guestName: "Mr. Samuel Okafor",
    suite: "Deluxe Studio",
    checkIn: "2026-11-08",
    checkOut: "2026-11-09",
    status: "Pending",
    amount: 20000,
  },
  {
    id: "AURA_1748765434_ghi789",
    guestName: "Ms. Grace Adebayo",
    suite: "Presidential Penthouse",
    checkIn: "2026-11-15",
    checkOut: "2026-11-20",
    status: "Confirmed",
    amount: 440000,
  },
  {
    id: "AURA_1748765435_jkl012",
    guestName: "Chief Bola Ahmed",
    suite: "Royal 1-Bedroom Suite",
    checkIn: "2026-11-05",
    checkOut: "2026-11-07",
    status: "Cancelled",
    amount: 64000,
  },
];

export default function AdminPage() {
  const totalRevenue = 542000;
  const occupancyRate = 78;
  const activeGuests = 12;
  const pendingCheckIns = 3;

  const statusColors: Record<string, string> = {
    Confirmed: "text-emerald-600 bg-emerald-50",
    Pending: "text-amber-600 bg-amber-50",
    Cancelled: "text-red-600 bg-red-50",
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="font-serif font-bold text-3xl text-navy">Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Welcome back to Aura Suites & Apartments admin panel
        </p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Revenue</p>
              <p className="font-serif font-bold text-2xl text-navy">
                ₦{totalRevenue.toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center text-gold">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-3">
            ▲ 12% vs last month
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Occupancy Rate</p>
              <p className="font-serif font-bold text-2xl text-navy">
                {occupancyRate}%
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center text-gold">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-3">
            ▲ 5% vs last month
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Active Guests</p>
              <p className="font-serif font-bold text-2xl text-navy">
                {activeGuests}
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center text-gold">
              <Users className="w-6 h-6" />
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-3">
            ▲ 2 guests today
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Pending Check-ins</p>
              <p className="font-serif font-bold text-2xl text-navy">
                {pendingCheckIns}
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber/10 flex items-center justify-center text-amber-600">
              <Clock className="w-6 h-6" />
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-3">
            ▲ 1 new this morning
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-4">
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
          <table className="w-full text-left">
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
              {recentReservations.map((res) => (
                <tr key={res.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-600 font-mono">
                    {res.id}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-navy">
                    {res.guestName}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {res.suite}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <div>{res.checkIn}</div>
                    <div className="text-xs text-gray-400">{res.checkOut}</div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-navy">
                    ₦{res.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[res.status]}`}>
                      {res.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
