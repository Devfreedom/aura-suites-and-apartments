/**
 * OAuth callback route for Supabase Auth.
 *
 * After a user signs in with an external provider (e.g. Google), Supabase
 * redirects back here with an auth code in the query string. We exchange that
 * code for a session, then redirect the user to the `next` URL (defaulting to
 * the admin dashboard for admin sign-in, or the homepage for public sign-in).
 */

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  // Default: admin sign-in goes to /admin/suites; public sign-in passes ?next=/
  const next = requestUrl.searchParams.get("next") ?? "/admin/suites";
  const isPublic = !next.startsWith("/admin");

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      const fallback = isPublic ? "/auth/sign-in" : "/admin/login";
      return NextResponse.redirect(
        `${requestUrl.origin}${fallback}?error=oauth_callback`
      );
    }
  }

  return NextResponse.redirect(`${requestUrl.origin}${next}`);
}
