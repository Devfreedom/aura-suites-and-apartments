"use client";

/**
 * Browser-side Supabase client.
 *
 * Uses `createBrowserClient` from `@supabase/ssr` so the auth session is stored
 * in cookies (not localStorage). That makes the session readable by the proxy
 * and by server components, and keeps client and server auth in sync.
 */

import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { supabaseAnonKey, supabaseUrl } from "@/lib/supabase/config";

let browserClient: SupabaseClient | undefined;

export function createClient(): SupabaseClient {
  if (!browserClient) {
    browserClient = createBrowserClient(supabaseUrl, supabaseAnonKey);
  }

  return browserClient;
}
