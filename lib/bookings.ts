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
 * Fetch all bookings belonging to a signed-in user.
 *
 * Newer bookings store `user_id` inside the `metadata` JSONB column; older
 * records (pre-suite-flow, e.g. guest checkouts) only carry `customer_email`,
 * so both identifiers are queried and merged.
 */
export async function getBookingsForUser(
  userId: string,
  customerEmail?: string
): Promise<Booking[]> {
  const supabase = createAdminClient();

  const [byUserIdResult, byEmailResult] = await Promise.all([
    supabase.from(TABLE).select("*").order("created_at", { ascending: false }),
    customerEmail
      ? supabase
          .from(TABLE)
          .select("*")
          .eq("customer_email", customerEmail.toLowerCase())
          .order("created_at", { ascending: false })
      : Promise.resolve({ data: [], error: null }),
  ]);

  const rows: BookingRow[] = [];
  const seen = new Set<string>();

  for (const result of [byUserIdResult, byEmailResult] as const) {
    if (result.error) {
      console.error("Failed to load bookings:", result.error.message);
      continue;
    }
    for (const row of (result.data ?? []) as BookingRow[]) {
      if (seen.has(row.id)) continue;
      // Only include rows that actually belong to this user
      const belongs =
        (row.metadata as Record<string, unknown> | null)?.user_id === userId ||
        row.customer_email?.toLowerCase() === customerEmail?.toLowerCase();
      if (belongs) {
        rows.push(row);
        seen.add(row.id);
      }
    }
  }

  return rows
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
    .map(mapRow);
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

/**
 * Fetch all bookings, most recent first.
 */
export async function getBookings(): Promise<Booking[]> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to load bookings: ${error.message}`);
  }

  return (data as BookingRow[]).map(mapRow);
}

/**
 * Cancel an upcoming confirmed booking after verifying ownership and that the
 * stay has not started yet (`check_in` strictly in the future).
 *
 * Returns a user-facing result so the dashboard server action can surface
 * accurate feedback in a toast.
 */
export async function cancelUpcomingBooking(
  reference: string,
  userId: string
): Promise<{ ok: boolean; message: string }> {
  const supabase = createAdminClient();

  const { data: row, error: fetchError } = await supabase
    .from(TABLE)
    .select("*")
    .eq("reference", reference)
    .maybeSingle();

  if (fetchError || !row) {
    return { ok: false, message: "We could not find that reservation." };
  }

  const booking = mapRow(row as BookingRow);

  const belongs =
    (booking.metadata as Record<string, unknown> | null)?.user_id === userId;
  if (!belongs) {
    return { ok: false, message: "You can only cancel your own reservations." };
  }

  if (booking.bookingStatus !== "confirmed") {
    return {
      ok: false,
      message: "Only confirmed bookings can be cancelled.",
    };
  }

  const today = new Date().toISOString().split("T")[0];
  if (!booking.checkIn || booking.checkIn <= today) {
    return {
      ok: false,
      message: "This stay has already started or passed, so it cannot be cancelled.",
    };
  }

  const { data: updated, error: updateError } = await supabase
    .from(TABLE)
    .update({ booking_status: "cancelled", updated_at: new Date().toISOString() })
    .eq("reference", reference)
    .eq("booking_status", "confirmed")
    .select("*")
    .maybeSingle();

  if (updateError || !updated) {
    console.error("Failed to cancel booking:", updateError?.message);
    return {
      ok: false,
      message: "Something went wrong while cancelling. Please try again.",
    };
  }

  return { ok: true, message: "Your reservation has been cancelled." };
}

/**
 * Delete a booking by id.
 */
export async function deleteBooking(id: string): Promise<void> {
  const supabase = createAdminClient();

  const { error } = await supabase.from(TABLE).delete().eq("id", id);

  if (error) {
    throw new Error(`Failed to delete booking: ${error.message}`);
  }
}

/**
 * Create a confirmed booking record after successful payment.
 * Stores user_id and suite_id in the metadata JSONB column since the table
 * does not have dedicated columns for them.
 */
export async function createConfirmedBooking(input: {
  reference: string;
  userId: string;
  suiteId: string;
  suiteType: string;
  checkIn: string;
  checkOut: string;
  guestCount: number;
  nights: number;
  totalAmount: number;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  paymentMethod?: string;
  paidAt?: string;
}): Promise<Booking | null> {
  const supabase = createAdminClient();
  const paidAt = input.paidAt ?? new Date().toISOString();

  const { data, error } = await supabase
    .from(TABLE)
    .insert({
      reference: input.reference,
      customer_name: input.customerName,
      customer_email: input.customerEmail,
      customer_phone: input.customerPhone ?? "",
      suite_type: input.suiteType,
      check_in: input.checkIn,
      check_out: input.checkOut,
      guest_count: input.guestCount,
      nights: input.nights,
      total_amount: input.totalAmount,
      payment_status: "paid",
      booking_status: "confirmed",
      payment_method: input.paymentMethod ?? "Paystack",
      paid_at: paidAt,
      metadata: {
        user_id: input.userId,
        suite_id: input.suiteId,
        payment_method: input.paymentMethod ?? "Paystack",
        paid_at: paidAt,
      },
    })
    .select("*")
    .single();

  if (error) {
    console.error("Failed to create confirmed booking:", error.message);
    return null;
  }

  return mapRow(data as BookingRow);
}
