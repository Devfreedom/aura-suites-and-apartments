/**
 * Server-side Supabase client.
 *
 * Cookie-aware client for Server Components, Server Actions, and Route
 * Handlers. Create a new instance per request — never cache it globally.
 */

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { supabaseAnonKey, supabaseUrl } from "@/lib/supabase/config";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Called from a Server Component, where cookies are read-only.
          // The proxy refreshes sessions, so this can be safely ignored.
        }
      },
    },
  });
}
