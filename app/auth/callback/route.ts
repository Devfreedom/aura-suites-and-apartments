/**
 * OAuth callback route for Supabase Auth.
 *
 * After a user signs in with an external provider (e.g. Google), Supabase
 * redirects back here with an auth code in the query string. We exchange that
 * code for a session, look up the user's role in the `public.profiles` table,
 * and redirect accordingly:
 *  - role === 'admin'  → /admin
 *  - anything else     → /dashboard
 *
 * If the code exchange fails, we redirect back to /auth/sign-in?error=auth-failed.
 */

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

interface Profile {
  id: string;
  role: string | null;
  full_name: string | null;
  avatar_url: string | null;
  email: string | null;
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(
      `${requestUrl.origin}/auth/sign-in?error=auth-failed`
    );
  }

  const supabase = await createClient();
  const { error, data } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(
      `${requestUrl.origin}/auth/sign-in?error=auth-failed`
    );
  }

  const user = data?.user;
  if (user) {
    const { data: profileData } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    const profile = profileData as Profile | null;

    if (profile?.role === "admin") {
      return NextResponse.redirect(`${requestUrl.origin}/admin`);
    }
  }

  return NextResponse.redirect(`${requestUrl.origin}/dashboard`);
}
