/**
 * Server-only Supabase client for trusted operations (webhooks, cron jobs).
 *
 * Uses SUPABASE_SERVICE_ROLE_KEY when available so RLS can be bypassed safely.
 * Falls back to the anon key for local development, where the permissive
 * policies in `supabase/schema.sql` allow the same operations.
 */

import { createClient } from "@supabase/supabase-js";
import { supabaseAnonKey, supabaseUrl } from "@/lib/supabase/config";

export function createAdminClient() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey;

  return createClient(supabaseUrl, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export function hasServiceRoleKey(): boolean {
  return Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);
}
