"use server";

/**
 * Server actions for the admin panel.
 *
 * The admin pages are client components, but their data access happens here
 * on the server with the service-role client. Doing it in the browser was the
 * reason the panels rendered empty: the browser-side Supabase client never
 * attaches the user's JWT, so RLS evaluated the queries as `anon` and the
 * `to authenticated` policies returned nothing.
 */

import { revalidatePath } from "next/cache";

import { deleteBooking, getBookings } from "@/lib/bookings";
import { getTransactions } from "@/lib/transactions";
import {
  adminCreateSuite,
  adminDeleteSuite,
  adminGetSuites,
  adminUpdateSuite,
} from "@/lib/admin-suites";
import type { Booking } from "@/types/booking";
import type { Suite, SuiteInput } from "@/types/suite";
import type { Transaction } from "@/types/transaction";

export interface AdminActionResult {
  ok: boolean;
  message: string;
}

/* ----------------------------- bookings ------------------------------ */

export async function adminFetchBookings(): Promise<Booking[]> {
  return getBookings();
}

export async function adminDeleteBooking(id: string): Promise<AdminActionResult> {
  try {
    await deleteBooking(id);
    revalidatePath("/admin/reservations");
    return { ok: true, message: "Reservation deleted." };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to delete reservation.",
    };
  }
}

/* ------------------------------ suites ------------------------------- */

export async function adminFetchSuites(): Promise<Suite[]> {
  return adminGetSuites();
}

export async function adminSaveSuite(
  input: SuiteInput,
  id?: string
): Promise<AdminActionResult & { suite?: Suite }> {
  try {
    const suite = id
      ? await adminUpdateSuite(id, input)
      : await adminCreateSuite(input);

    revalidatePath("/admin/suites");
    revalidatePath("/suites");
    return { ok: true, message: "Suite saved.", suite };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to save suite.",
    };
  }
}

export async function adminDeleteSuiteAction(
  id: string
): Promise<AdminActionResult> {
  try {
    await adminDeleteSuite(id);
    revalidatePath("/admin/suites");
    revalidatePath("/suites");
    return { ok: true, message: "Suite deleted." };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to delete suite.",
    };
  }
}

/* --------------------------- transactions ---------------------------- */

export interface AdminTransactionsResult {
  transactions: Transaction[];
  /** True when the `transactions` table has not been created yet. */
  tableMissing: boolean;
  message: string;
}

export async function adminFetchTransactions(
  filters: { status?: string; search?: string } = {}
): Promise<AdminTransactionsResult> {
  try {
    const transactions = await getTransactions(filters);
    return {
      transactions,
      tableMissing: false,
      message: "Transactions loaded.",
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to load transactions.";

    // The table ships with the schema but may not exist yet on a fresh
    // database — explain that instead of showing a raw PostgREST error.
    if (/could not find the table|does not exist|42P01/i.test(message)) {
      return {
        transactions: [],
        tableMissing: true,
        message:
          "The `transactions` table has not been created in this database yet. Run the transactions DDL from supabase/schema.sql in the Supabase SQL Editor.",
      };
    }

    return { transactions: [], tableMissing: false, message };
  }
}
