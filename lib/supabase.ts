/**
 * Supabase client singleton
 *
 * Uses the standard `@supabase/supabase-js` JavaScript client. The client is
 * cached on `globalThis` during development so hot reloads do not create
 * duplicate instances (and duplicate realtime/auth listeners).
 */

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!rawUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase environment variables. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local."
  );
}

/**
 * Supabase exposes both the project URL (`https://xyz.supabase.co`) and the
 * REST endpoint (`https://xyz.supabase.co/rest/v1/`). `createClient` expects
 * the project URL, so normalise it even if the REST path is supplied.
 */
const supabaseUrl = rawUrl
  .replace(/\/rest\/v1\/?$/, "")
  .replace(/\/+$/, "");

const globalForSupabase = globalThis as unknown as {
  supabase?: SupabaseClient;
};

export const supabase: SupabaseClient =
  globalForSupabase.supabase ??
  createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  });

if (process.env.NODE_ENV !== "production") {
  globalForSupabase.supabase = supabase;
}

export default supabase;
