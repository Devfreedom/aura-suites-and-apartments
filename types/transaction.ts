/**
 * Transaction model for the `public.transactions` table.
 *
 * Joined with `public.profiles` to fetch the customer's name and email.
 */

export interface Transaction {
  id: string;
  reference: string;
  customer_name: string | null;
  customer_email: string | null;
  suite_type: string | null;
  amount: number | null;
  status: string | null;
  created_at: string;
  updated_at: string;
}

export type TransactionStatus = "completed" | "pending" | "failed";

export interface TransactionFilter {
  status: TransactionStatus | "all";
  search: string;
}
