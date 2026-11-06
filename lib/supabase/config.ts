/**
 * Shared Supabase environment configuration.
 *
 * `NEXT_PUBLIC_SUPABASE_URL` should be the project URL
 * (https://xyz.supabase.co). If the REST endpoint was supplied instead, strip
 * the trailing `/rest/v1` segment so every SDK receives the same base URL.
 */

const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!rawUrl || !anonKey) {
  throw new Error(
    "Missing Supabase environment variables. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local."
  );
}

export const supabaseUrl = rawUrl
  .replace(/\/rest\/v1\/?$/, "")
  .replace(/\/+$/, "");

export const supabaseAnonKey = anonKey;
