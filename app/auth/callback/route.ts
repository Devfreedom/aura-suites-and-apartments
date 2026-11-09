/**
 * OAuth callback route for Supabase Auth.
 *
 * After a user signs in with an external provider (e.g. Google), Supabase
 * redirects back here with an auth code in the query string. We exchange that
 * code for a session, then redirect the user to the admin dashboard.
 */

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") ?? "/admin/suites";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      return NextResponse.redirect(
        `${requestUrl.origin}/admin/login?error=oauth_callback`
      );
    }
  }

  return NextResponse.redirect(`${requestUrl.origin}${next}`);
}
