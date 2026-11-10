/**
 * GET /api/account/profile
 *
 * Returns the signed-in user's profile (full_name, email, role, avatar_url).
 *
 * The read happens server-side with the service-role client so it is immune
 * to RLS policy problems on `public.profiles`; the browser client would be
 * subject to those policies.
 */

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

import { supabaseAnonKey, supabaseUrl } from "@/lib/supabase/config";
import { getProfileByUserId } from "@/lib/profiles";

// Reads cookies + live profile data — never prerender this route.
export const instant = false;

export async function GET() {
  const cookieStore = await cookies();

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll() {
        // Read-only in a Route Handler
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const profile = await getProfileByUserId(user.id);

  const metadata = user.user_metadata ?? {};

  return NextResponse.json({
    id: user.id,
    full_name:
      profile?.full_name ?? (metadata.full_name as string | undefined) ?? null,
    email: profile?.email ?? user.email ?? null,
    role: profile?.role ?? "guest",
    avatar_url:
      profile?.avatar_url ?? (metadata.avatar_url as string | undefined) ?? null,
    phone: profile?.phone ?? (metadata.phone as string | undefined) ?? null,
    emergency_contact:
      profile?.emergency_contact ??
      (metadata.emergency_contact as string | undefined) ??
      null,
  });
}
