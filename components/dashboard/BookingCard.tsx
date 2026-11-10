"use client";

/**
 * A single reservation card for the guest dashboard.
 *
 * Adds actionable buttons to the historical card layout:
 *  - Download PDF Receipt  → opens a print-ready invoice (save as PDF).
 *  - View Stay Details     → side drawer with check-in instructions,
 *                            directions and house rules.
 *  - Cancel Booking        → only for future-dated confirmed stays;
 *                            calls the `cancelBooking` server action.
 */

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Calendar,
  CreditCard,
  Users,
  Moon,
  X,
  Download,
  BookOpenText,
  Ban,
  Loader2,
  MapPin,
  Clock,
  KeyRound,
  ShieldCheck,
  Phone,
  ExternalLink,
  BadgeCheck,
} from "lucide-react";

import { cancelBooking } from "@/app/dashboard/actions";
import {
  formatDate,
  formatPrice,
  VENUE_ADDRESS,
  DIRECTIONS_URL,
} from "@/lib/format";
import type { Booking } from "@/types/booking";

/* ------------------------------------------------------------------ */
/* Receipt generator                                                   */
/* ------------------------------------------------------------------ */

/**
 * Builds a styled invoice document in a popup window and opens the print
 * dialog, so guests can save the receipt as a PDF without any extra
 * PDF-generation dependency.
 */
function downloadReceipt(booking: Booking) {
  const win = window.open("", "_blank", "width=800,height=1000");

  if (!win) {
    toast.error(
      "Your browser blocked the receipt window. Please allow pop-ups and try again."
    );
    return;
  }

  const escape = (value: string) =>
    value.replace(/[&<>"']/g, (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] ?? c
    );

  const winDoc = win.document;
  winDoc.open();
  winDoc.write(`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>Receipt ${escape(booking.reference)} · Aura Suites &amp; Apartments</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: Georgia, "Times New Roman", serif; color: #1B365D; padding: 48px; }
  .brand { text-align: center; border-bottom: 3px solid #D4AF37; padding-bottom: 24px; margin-bottom: 28px; }
  .brand .mark { display: inline-flex; width: 56px; height: 56px; border-radius: 14px; align-items: center; justify-content: center; background: #1B365D; color: #D4AF37; font-size: 26px; font-weight: 700; margin-bottom: 12px; }
  .brand h1 { font-size: 26px; letter-spacing: 3px; }
  .brand p { font-size: 11px; letter-spacing: 4px; color: #D4AF37; font-weight: 700; margin-top: 4px; text-transform: uppercase; }
  .receipt-title { text-align: center; font-size: 14px; letter-spacing: 3px; text-transform: uppercase; color: #6b7280; margin-bottom: 24px; }
  table.line-items { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
  table.line-items th { text-align: left; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #6b7280; border-bottom: 1px solid #e5e7eb; padding: 10px 8px; }
  table.line-items td { padding: 12px 8px; border-bottom: 1px solid #f3f4f6; font-size: 13px; font-family: Georgia, serif; }
  .totals { text-align: right; margin-top: 8px; }
  .totals .grand { font-size: 20px; font-weight: 700; color: #1B365D; border-top: 3px solid #D4AF37; display: inline-block; padding-top: 10px; margin-top: 8px; margin-left: auto; }
  .meta { display: grid; grid-template-columns: 1fr 1fr; gap: 6px 24px; background: #f8fafc; border: 1px solid #e5e7eb; border-radius: 12px; padding: 18px 22px; margin-bottom: 24px; font-family: Arial, sans-serif; font-size: 12px; }
  .meta span { color: #6b7280; }
  footer { margin-top: 36px; text-align: center; font-size: 11px; color: #6b7280; font-family: Arial, sans-serif; }
  @media print { body { padding: 24px; } }
</style>
</head>
<body>
  <div class="brand">
    <span class="mark">A</span>
    <h1>AURA</h1>
    <p>Suites &amp; Apartments</p>
  </div>

  <div class="receipt-title">Stay Invoice · ${escape(booking.reference)}</div>

  <div class="meta">
    <div><span>Reference:</span> <strong>${escape(booking.reference)}</strong></div>
    <div><span>Date issued:</span> <strong>${new Date().toLocaleDateString("en-NG", { day: "numeric", month: "long", year: "numeric" })}</strong></div>
    <div><span>Guest:</span> <strong>${escape(booking.customerName || "—")}</strong></div>
    <div><span>Email:</span> <strong>${escape(booking.customerEmail || "—")}</strong></div>
  </div>

  <table class="line-items">
    <thead>
      <tr><th>Description</th><th>Detail</th><th style="text-align:right">Amount</th></tr>
    </thead>
    <tbody>
      <tr>
        <td>${escape(booking.suiteType || "Suite reservation")}</td>
        <td>${formatDate(booking.checkIn)} → ${formatDate(booking.checkOut)} · ${booking.nights || "—"} night(s) · ${booking.guestCount || "—"} guest(s)</td>
        <td style="text-align:right">${formatPrice(booking.totalAmount)}</td>
      </tr>
    </tbody>
  </table>

  <div class="totals">
    <p><span style="color:#6b7280">Payment method:</span> ${escape(booking.paymentMethod || "Paystack")}${booking.paidAt ? ` · ${formatDate(booking.paidAt)}` : ""}</p>
    <p class="grand">Total Paid: ${formatPrice(booking.totalAmount)}</p>
  </div>

  <footer>
    Aura Suites &amp; Apartments · ${"No. 5 Kashim Ibrahim Road, Jos, Benue State"}<br/>
    Thank you for choosing Aura — where elegance meets modern innovation.
  </footer>
</body>
</html>`);
  winDoc.close();

  // Give the popup a beat to render, then trigger Save-as-PDF via the dialog.
  win.focus();
  win.print();
}

/* ------------------------------------------------------------------ */
/* Stay details drawer                                                 */
/* ------------------------------------------------------------------ */

const HOUSE_RULES = [
  "Quiet hours between 10:00 PM and 6:00 AM — our suites are rest-first spaces.",
  "No smoking indoors; designated smoking areas are available on the premises.",
  "Party/event hosting is not permitted inside the suites.",
  "Maximum occupancy is the guest count stated on your reservation.",
  "A valid means of ID is required at check-in for security registration.",
  "Pets are welcome on request — please confirm with the concierge before arrival.",
  "Kitchen and cooking equipment are for light preparation; leave them as you met them.",
];

function StayDetailsDrawer({
  booking,
  open,
  onClose,
}: {
  booking: Booking;
  open: boolean;
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Stay details for ${booking.reference}`}
      className="fixed inset-0 z-[70]"
    >
      {/* Backdrop */}
      <button
        aria-label="Close stay details"
        onClick={onClose}
        className="absolute inset-0 w-full h-full bg-navy/60 backdrop-blur-sm cursor-default"
      />

      {/* Panel */}
      <div className="absolute top-0 right-0 h-full w-full sm:max-w-md bg-white shadow-2xl overflow-y-auto">
        <div className="sticky top-0 flex items-center justify-between bg-navy px-6 py-5 text-white">
          <div>
            <p className="text-[11px] uppercase tracking-[0.25em] text-gold font-semibold">
              Stay Details
            </p>
            <p className="font-serif text-lg font-bold">Ref: {booking.reference}</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded-lg p-2 text-white/80 transition-colors hover:bg-white/10 hover:text-gold"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* Booking snapshot */}
          <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
            <h3 className="font-serif font-bold text-navy text-lg mb-1">
              {booking.suiteType || "Suite reservation"}
            </h3>
            <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gold shrink-0" />
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-gray-400">Check-in</p>
                  <p className="font-medium text-navy">{formatDate(booking.checkIn)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gold shrink-0" />
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-gray-400">Check-out</p>
                  <p className="font-medium text-navy">{formatDate(booking.checkOut)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-gold shrink-0" />
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-gray-400">Guests</p>
                  <p className="font-medium text-navy">{booking.guestCount || "—"}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Moon className="w-4 h-4 text-gold shrink-0" />
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-gray-400">Nights</p>
                  <p className="font-medium text-navy">{booking.nights || "—"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Directions */}
          <div>
            <h4 className="flex items-center gap-2 font-serif font-bold text-navy mb-2">
              <MapPin className="w-4 h-4 text-gold" />
              Getting Here
            </h4>
            <p className="text-sm text-gray-600 leading-relaxed">
              We are located at <span className="font-medium text-navy">{VENUE_ADDRESS}</span>.
              Free on-site parking is available for all guests. Use the link below for
              turn-by-turn navigation.
            </p>
            <a
              href={DIRECTIONS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-2 rounded-xl border border-gold/40 bg-gold/10 px-4 py-2.5 text-sm font-semibold text-navy transition-colors hover:bg-gold/20"
            >
              <MapPin className="h-4 w-4 text-gold" />
              Open in Google Maps
              <ExternalLink className="h-3.5 w-3.5 text-gray-400" />
            </a>
          </div>

          {/* Check-in instructions */}
          <div>
            <h4 className="flex items-center gap-2 font-serif font-bold text-navy mb-2">
              <KeyRound className="w-4 h-4 text-gold" />
              Check-In Instructions
            </h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <Clock className="mt-1 h-3.5 w-3.5 text-gold shrink-0" />
                Check-in from <strong className="text-navy">2:00 PM</strong>; check-out by
                <strong className="text-navy"> 12:00 noon</strong>. Early check-in is subject
                to availability.
              </li>
              <li className="flex items-start gap-2">
                <BadgeCheck className="mt-1 h-3.5 w-3.5 text-gold shrink-0" />
                Present your booking reference
                <span className="font-mono text-xs bg-gray-100 rounded px-1.5 py-0.5 text-navy">
                  {booking.reference}
                </span>
                and a valid ID at the front desk.
              </li>
              <li className="flex items-start gap-2">
                <Phone className="mt-1 h-3.5 w-3.5 text-gold shrink-0" />
                Arriving late? Call the concierge and we will hold your key and
                arrange a staff-assisted check-in.
              </li>
              <li className="flex items-start gap-2">
                <ShieldCheck className="mt-1 h-3.5 w-3.5 text-gold shrink-0" />
                The suite is pre-conditioned (24/7 power) and cleaned to hotel
                standard before you arrive — no deposit required.
              </li>
            </ul>
          </div>

          {/* House rules */}
          <div>
            <h4 className="flex items-center gap-2 font-serif font-bold text-navy mb-2">
              <BookOpenText className="w-4 h-4 text-gold" />
              House Rules
            </h4>
            <ul className="space-y-2 text-sm text-gray-600">
              {HOUSE_RULES.map((rule) => (
                <li key={rule} className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-gold shrink-0" />
                  {rule}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="rounded-2xl bg-navy p-5 text-white">
            <p className="font-serif font-bold text-lg">Need anything?</p>
            <p className="mt-1 text-sm text-gray-300">
              Our concierge desk is available 24/7 throughout your stay.
            </p>
            <Link
              href="/contact"
              className="mt-3 inline-flex items-center gap-2 rounded-xl bg-gold px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#C5A028]"
            >
              Contact Reservations
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Booking card                                                        */
/* ------------------------------------------------------------------ */

export default function BookingCard({ booking }: { booking: Booking }) {
  const router = useRouter();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [, startTransition] = useTransition();

  function formatDateSafe(value: string) {
    return formatDate(value);
  }

  const canCancel =
    booking.bookingStatus === "confirmed" &&
    !!booking.checkIn &&
    booking.checkIn > new Date().toISOString().split("T")[0];
  const isCancelled = booking.bookingStatus === "cancelled";

  async function handleCancel() {
    const confirmed = window.confirm(
      `Cancel reservation ${booking.reference}? This cannot be undone. Refunds, if any, are processed to your original payment method.`
    );
    if (!confirmed) return;

    setIsCancelling(true);
    try {
      const result = await cancelBooking(booking.reference);
      if (result.ok) {
        toast.success(result.message);
        startTransition(() => router.refresh());
      } else {
        toast.error(result.message);
      }
    } catch {
      toast.error("Something went wrong while cancelling. Please try again.");
    } finally {
      setIsCancelling(false);
    }
  }

  return (
    <>
      <div
        className={`rounded-2xl border bg-white p-5 shadow-sm flex flex-col gap-4 transition-colors ${
          isCancelled ? "border-gray-200 opacity-70" : "border-gray-200"
        }`}
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                isCancelled ? "bg-gray-100 text-gray-400" : "bg-navy text-gold"
              }`}
            >
              <CreditCard className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="font-serif font-bold text-lg text-navy leading-tight truncate">
                {booking.suiteType || "Suite reservation"}
              </h3>
              <p className="text-xs text-gray-400">Ref: {booking.reference}</p>
            </div>
          </div>
          {isCancelled ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700 border border-red-200">
              Cancelled
            </span>
          ) : booking.bookingStatus === "confirmed" || booking.paymentStatus === "paid" ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200">
              Confirmed
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 border border-amber-200">
              Awaiting payment
            </span>
          )}
        </div>

        {/* Dates and occupancy */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-gray-100 pt-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gold shrink-0" />
            <div className="min-w-0">
              <p className="text-[11px] uppercase tracking-wider text-gray-400 font-medium">
                Check-in
              </p>
              <p className="text-sm font-medium text-navy">
                {formatDateSafe(booking.checkIn)}
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
                {formatDateSafe(booking.checkOut)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-gold shrink-0" />
            <div>
              <p className="text-[11px] uppercase tracking-wider text-gray-400 font-medium">
                Guests
              </p>
              <p className="text-sm font-medium text-navy">{booking.guestCount || "—"}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Moon className="w-4 h-4 text-gold shrink-0" />
            <div>
              <p className="text-[11px] uppercase tracking-wider text-gray-400 font-medium">
                Nights
              </p>
              <p className="text-sm font-medium text-navy">{booking.nights || "—"}</p>
            </div>
          </div>
        </div>

        {/* Payment summary */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-gray-100 pt-4">
          <p className="text-sm text-gray-500">
            Paid with{" "}
            <span className="font-medium text-navy">
              {booking.paymentMethod || "Paystack"}
            </span>
            {booking.paidAt ? ` · ${formatDateSafe(booking.paidAt)}` : ""}
          </p>
          <p className="font-serif font-bold text-xl text-navy">
            {formatPrice(booking.totalAmount)}
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2 border-t border-gray-100 pt-4">
          {booking.paymentStatus === "paid" && (
            <button
              onClick={() => downloadReceipt(booking)}
              className="inline-flex flex-1 sm:flex-none items-center justify-center gap-2 rounded-xl border border-navy/15 bg-navy/5 px-4 py-2.5 text-sm font-semibold text-navy transition-colors hover:bg-navy/10"
            >
              <Download className="h-4 w-4" />
              Download PDF Receipt
            </button>
          )}

          <button
            onClick={() => setIsDrawerOpen(true)}
            className="inline-flex flex-1 sm:flex-none items-center justify-center gap-2 rounded-xl border border-gold/40 bg-gold/10 px-4 py-2.5 text-sm font-semibold text-navy transition-colors hover:bg-gold/20"
          >
            <BookOpenText className="h-4 w-4" />
            View Stay Details
          </button>

          {canCancel && (
            <button
              onClick={handleCancel}
              disabled={isCancelling}
              className="inline-flex flex-1 sm:flex-none items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-700 transition-colors hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60 sm:ml-auto"
            >
              {isCancelling ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Cancelling…
                </>
              ) : (
                <>
                  <Ban className="h-4 w-4" />
                  Cancel Booking
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Stay details side drawer */}
      <StayDetailsDrawer
        booking={booking}
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </>
  );
}
