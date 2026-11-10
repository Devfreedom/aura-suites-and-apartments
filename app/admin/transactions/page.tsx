"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Calendar,
  CreditCard,
  Loader2,
  Mail,
  Search,
  Slash,
  Trash2,
  User,
  AlertCircle,
} from "lucide-react";

import { adminFetchTransactions } from "@/app/admin/actions";
import type { Transaction, TransactionStatus } from "@/types/transaction";
import { ToastContainer, useToast } from "@/components/ui/Toast";

const statusOptions: Array<{ value: TransactionStatus | "all"; label: string }> = [
  { value: "all", label: "All Status" },
  { value: "completed", label: "Completed" },
  { value: "pending", label: "Pending" },
  { value: "failed", label: "Failed" },
];

const statusColors: Record<string, string> = {
  completed: "text-emerald-600 bg-emerald-50",
  pending: "text-amber-600 bg-amber-50",
  failed: "text-red-600 bg-red-50",
};

export default function TransactionsPage() {
  const { toasts, showToast, dismissToast } = useToast();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [statusFilter, setStatusFilter] = useState<TransactionStatus | "all">(
    "all"
  );
  const [search, setSearch] = useState("");

  const loadTransactions = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);
    try {
      const result = await adminFetchTransactions({
        status: statusFilter,
        search,
      });

      setTransactions(result.transactions);

      if (result.tableMissing) {
        setLoadError(result.message);
      } else if (!result.transactions.length && !search && statusFilter === "all") {
        setLoadError(null);
      } else if (result.message !== "Transactions loaded.") {
        setLoadError(result.message);
      }
    } catch (error) {
      setLoadError(
        error instanceof Error ? error.message : "Failed to load transactions."
      );
      showToast({
        title: "Failed to load transactions",
        description:
          error instanceof Error ? error.message : "Unknown error.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter, search, showToast]);

  useEffect(() => {
    void loadTransactions();
  }, [loadTransactions]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const matchStatus =
        statusFilter === "all" || t.status === statusFilter;
      const searchLower = search.toLowerCase();
      const matchSearch =
        !search ||
        t.reference?.toLowerCase().includes(searchLower) ||
        t.customer_email?.toLowerCase().includes(searchLower) ||
        t.customer_name?.toLowerCase().includes(searchLower);
      return matchStatus && matchSearch;
    });
  }, [transactions, statusFilter, search]);

  const formatAmount = (amount: number | null) => {
    if (amount === null) return "—";
    return `₦${amount.toLocaleString()}`;
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="font-serif font-bold text-3xl text-navy">
            Transactions
          </h1>
          <p className="text-gray-600 mt-2">
            All payment transactions for Aura Suites & Apartments
          </p>
        </div>
        <div className="flex items-center justify-center py-20 text-gray-500">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="ml-2 text-sm">Loading transactions…</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Toast Container */}
      <ToastContainer />

      {loadError && (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700"
        >
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <p>{loadError}</p>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif font-bold text-3xl text-navy">
            Transactions
          </h1>
          <p className="text-gray-600 mt-2">
            View and filter all payment transactions
          </p>
        </div>
        <Link
          href="/admin/reservations"
          className="inline-flex items-center gap-2 bg-navy text-white px-6 py-3 rounded-xl font-medium hover:bg-navy/90 transition-all"
        >
          <ArrowRight className="w-4 h-4" />
          Back to Reservations
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 min-w-[250px]">
            <label className="block text-sm font-medium text-navy mb-2">
              Search
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Reference, email, or name…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none text-sm text-navy bg-gray-50/50"
              />
            </div>
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-navy mb-2">
              Status Filter
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as TransactionStatus | "all")}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none text-sm text-navy bg-gray-50/50"
            >
              {statusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-6 py-4 text-sm font-medium text-gray-500 w-24">
                  Transaction ID
                </th>
                <th className="px-6 py-4 text-sm font-medium text-gray-500">
                  Customer
                </th>
                <th className="px-6 py-4 text-sm font-medium text-gray-500">
                  Suite / Reference
                </th>
                <th className="px-6 py-4 text-sm font-medium text-gray-500">
                  Amount
                </th>
                <th className="px-6 py-4 text-sm font-medium text-gray-500">
                  Status
                </th>
                <th className="px-6 py-4 text-sm font-medium text-gray-500">
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center text-gray-500">
                    <Loader2 className="w-5 h-5 animate-spin mb-2" />
                    <p className="text-sm">Loading transactions…</p>
                  </td>
                </tr>
              ) : filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center">
                    <div className="w-14 h-14 rounded-full bg-gold/10 text-gold flex items-center justify-center mx-auto mb-4">
                      <Slash className="w-7 h-7" />
                    </div>
                    <h3 className="font-serif font-bold text-lg text-navy">
                      No transactions found
                    </h3>
                    <p className="text-sm text-gray-500 mt-1 max-w-md mx-auto">
                      Adjust the filters above, or there are no transactions yet.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((tx) => (
                  <tr
                    key={tx.id}
                    className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm font-mono text-gray-600">
                      {tx.reference}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-navy">
                        {tx.customer_name || "Unknown"}
                      </div>
                      <div className="text-xs text-gray-400">
                        {tx.customer_email || "—"}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <div>{tx.suite_type || "—"}</div>
                      <div className="text-xs text-gray-400">{tx.reference}</div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-navy">
                      {formatAmount(tx.amount)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[tx.status ?? "pending"]}`}>
                        {(tx.status?.charAt(0).toUpperCase() ?? "Pending") +
                          (tx.status?.slice(1) ?? "")}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(tx.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
