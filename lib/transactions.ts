/**
 * Server-side transaction helpers.
 *
 * Reads the `public.transactions` table joined with `public.profiles` to fetch
 * the customer's name and email. Ordered by `created_at` descending.
 */

import { createAdminClient } from "@/lib/supabase/admin";
import type { Transaction } from "@/types/transaction";

const TABLE = "transactions";

interface TransactionRow {
  id: string;
  reference: string;
  customer_name: string | null;
  customer_email: string | null;
  suite_type: string | null;
  amount: number | string | null;
  status: string | null;
  created_at: string;
  updated_at: string;
}

function mapRow(row: TransactionRow): Transaction {
  return {
    id: row.id,
    reference: row.reference,
    customer_name: row.customer_name,
    customer_email: row.customer_email,
    suite_type: row.suite_type,
    amount: row.amount !== null ? Number(row.amount) : null,
    status: row.status,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

/**
 * Fetch all transactions, ordered by creation date descending.
 * Optionally filtered by status and/or a search query (email or reference).
 */
export async function getTransactions({
  status = "all",
  search = "",
}: { status?: string; search?: string } = {}): Promise<Transaction[]> {
  const supabase = createAdminClient();

  let query = supabase
    .from(TABLE)
    .select(
      `
      *,
      profiles:profiles (full_name, email)
    `
    )
    .order("created_at", { ascending: false });

  if (status && status !== "all") {
    query = query.eq("status", status);
  }

  if (search) {
    query = query.or(
      `reference.ilike.%${search}%,profiles.email.ilike.%${search}%`
    );
  }

  const { data, error } = await query;

  if (error) {
    // Surface the failure (e.g. the table has not been created yet) so the
    // admin panel can explain it instead of showing an empty table.
    throw new Error(error.message);
  }

  return (data as TransactionRow[]).map(mapRow);
}

/**
 * Create a new transaction record.
 * If the `transactions` table does not exist yet, this logs a warning
 * and returns null instead of throwing.
 */
export async function createTransaction(input: {
  reference: string;
  customer_name?: string | null;
  customer_email?: string | null;
  suite_type?: string | null;
  amount?: number | null;
  status?: string | null;
}): Promise<Transaction | null> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from(TABLE)
    .insert({
      reference: input.reference,
      customer_name: input.customer_name ?? null,
      customer_email: input.customer_email ?? null,
      suite_type: input.suite_type ?? null,
      amount: input.amount ?? null,
      status: input.status ?? "completed",
    })
    .select("*")
    .single();

  if (error) {
    // Table may not exist yet — log and return null rather than throwing.
    console.warn(
      "transactions table unavailable (create):",
      error.message
    );
    return null;
  }

  return mapRow(data as TransactionRow);
}
