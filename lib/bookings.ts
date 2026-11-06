/**
 * Server-side booking persistence helpers.
 *
 * These functions are used by Paystack routes and the payment-reminder cron.
 */

import { createAdminClient } from "@/lib/supabase/admin";
import type {
  Booking,
  BookingStatus,
  CreateBookingInput,
  PaymentStatus,
} from "@/types/booking";

const TABLE = "bookings";

interface BookingRow {
  id: string;
  reference: string;
  customer_name: string | null;
  customer_email: string | null;
  customer_phone: string | null;
  suite_type: string | null;
  check_in: string | null;
  check_out: string | null;
  guest_count: number | null;
  nights: number | null;
  total_amount: number | string | null;
  payment_status: string | null;
  booking_status: string | null;
  payment_url: string | null;
  payment_method: string | null;
  metadata: Record<string, unknown> | null;
  reminder_sent_at: string | null;
  paid_at: string | null;
  created_at: string;
  updated_at: string;
}

function mapRow(row: BookingRow): Booking {
  return {
    id: row.id,
    reference: row.reference,
    customerName: row.customer_name ?? "",
    customerEmail: row.customer_email ?? "",
    customerPhone: row.customer_phone ?? "",
    suiteType: row.suite_type ?? "",
    checkIn: row.check_in ?? "",
    checkOut: row.check_out ?? "",
    guestCount: Number(row.guest_count ?? 0),
    nights: Number(row.nights ?? 0),
    totalAmount: Number(row.total_amount ?? 0),
    paymentStatus: (row.payment_status ?? "pending") as PaymentStatus,
    bookingStatus: (row.booking_status ?? "pending") as BookingStatus,
    paymentUrl: row.payment_url,
    paymentMethod: row.payment_method,
    metadata: row.metadata ?? {},
    reminderSentAt: row.reminder_sent_at,
    paidAt: row.paid_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function getBookingByReference(
  reference: string
): Promise<Booking | null> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("reference", reference)
    .maybeSingle();

  if (error) {
    console.error("Failed to load booking:", error.message);
    return null;
  }

  return data ? mapRow(data as BookingRow) : null;
}

/**
 * Create the pending reservation record before redirecting to Paystack.
 * Returns null (rather than throwing) so a database hiccup never blocks payment.
 */
export async function createPendingBooking(
  input: CreateBookingInput
): Promise<Booking | null> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from(TABLE)
    .insert({
      reference: input.reference,
      customer_name: input.customerName ?? "",
      customer_email: input.customerEmail,
      customer_phone: input.customerPhone ?? "",
      suite_type: input.suiteType ?? "",
      check_in: input.checkIn ?? "",
      check_out: input.checkOut ?? "",
      guest_count: input.guestCount ?? 1,
      nights: input.nights ?? 1,
      total_amount: input.totalAmount,
      payment_status: "pending",
      booking_status: "pending",
      payment_url: input.paymentUrl ?? null,
      metadata: input.metadata ?? {},
    })
    .select("*")
    .single();

  if (error) {
    // Duplicate reference is harmless — the booking already exists.
    if (error.code === "23505") {
      return getBookingByReference(input.reference);
    }

    console.error("Failed to create booking:", error.message);
    return null;
  }

  return mapRow(data as BookingRow);
}

/**
 * Atomically mark a booking as paid.
 *
 * Returns `justPaid: false` when the record was already paid, which callers use
 * to keep receipt emails idempotent across webhook retries and verify requests.
 */
export async function markBookingPaid(
  reference: string,
  options: { paymentMethod?: string; paidAt?: string } = {}
): Promise<{ booking: Booking | null; justPaid: boolean }> {
  const supabase = createAdminClient();
  const paidAt = options.paidAt ?? new Date().toISOString();

  const { data, error } = await supabase
    .from(TABLE)
    .update({
      payment_status: "paid",
      booking_status: "confirmed",
      payment_method: options.paymentMethod ?? "Paystack",
      paid_at: paidAt,
    })
    .eq("reference", reference)
    .eq("payment_status", "pending")
    .select("*")
    .maybeSingle();

  if (error) {
    console.error("Failed to mark booking paid:", error.message);
    return { booking: null, justPaid: false };
  }

  if (data) {
    return { booking: mapRow(data as BookingRow), justPaid: true };
  }

  // Nothing updated: either the booking is already paid, or it does not exist.
  const existing = await getBookingByReference(reference);
  return { booking: existing, justPaid: false };
}

/**
 * Fallback used by the webhook when no pending booking exists (for example a
 * payment created outside the app flow).
 */
export async function createPaidBookingFromWebhook(input: {
  reference: string;
  customerName?: string;
  customerEmail: string;
  customerPhone?: string;
  suiteType?: string;
  checkIn?: string;
  checkOut?: string;
  guestCount?: number;
  nights?: number;
  totalAmount: number;
  metadata?: Record<string, unknown>;
}): Promise<{ booking: Booking | null; justPaid: boolean }> {
  const supabase = createAdminClient();
  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from(TABLE)
    .insert({
      reference: input.reference,
      customer_name: input.customerName ?? "",
      customer_email: input.customerEmail,
      customer_phone: input.customerPhone ?? "",
      suite_type: input.suiteType ?? "",
      check_in: input.checkIn ?? "",
      check_out: input.checkOut ?? "",
      guest_count: input.guestCount ?? 1,
      nights: input.nights ?? 1,
      total_amount: input.totalAmount,
      payment_status: "paid",
      booking_status: "confirmed",
      payment_method: "Paystack",
      paid_at: now,
      metadata: input.metadata ?? {},
    })
    .select("*")
    .single();

  if (error) {
    if (error.code === "23505") {
      return markBookingPaid(input.reference);
    }
    console.error("Failed to create paid booking:", error.message);
    return { booking: null, justPaid: false };
  }

  return { booking: mapRow(data as BookingRow), justPaid: true };
}

/**
 * Pending bookings that are older than the reminder cutoff and have not been
 * reminded yet.
 */
export async function getBookingsDueForReminder(
  cutoffIso: string,
  limit = 100
): Promise<Booking[]> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("payment_status", "pending")
    .is("reminder_sent_at", null)
    .lt("created_at", cutoffIso)
    .order("created_at", { ascending: true })
    .limit(limit);

  if (error) {
    console.error("Failed to load pending bookings:", error.message);
    return [];
  }

  return (data as BookingRow[]).map(mapRow);
}

export async function markReminderSent(id: string): Promise<void> {
  const supabase = createAdminClient();

  const { error } = await supabase
    .from(TABLE)
    .update({ reminder_sent_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    console.error("Failed to mark reminder sent:", error.message);
  }
}
