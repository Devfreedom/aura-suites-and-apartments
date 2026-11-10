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
 * Session cookies written during the exchange are copied onto the outgoing
 * redirect response (NextResponse does not automatically forward cookies set
 * via `cookies()`), so the browser actually ends up signed in after this.
 *
 * If the code exchange fails, we redirect back to /auth/sign-in?error=auth-failed.
 */

import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { supabaseAnonKey, supabaseUrl } from "@/lib/supabase/config";

interface Profile {
  id: string;
  role: string | null;
}

/** Cookie tuple collected from the Supabase client during the exchange. */
interface CookieToSet {
  name: string;
  value: string;
  options: Record<string, unknown>;
}

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  // Honour an optional ?next= path (e.g. redirectTo flows back to /checkout).
  let next = searchParams.get("next") ?? "/dashboard";
  if (!next.startsWith("/")) {
    next = "/dashboard";
  }

  if (!code) {
    return NextResponse.redirect(
      `${origin}/auth/sign-in?error=auth-failed`
    );
  }

  // Collect every cookie the Supabase client writes while exchanging the
  // code, because NextResponse.redirect below starts from a blank slate.
  const cookiesToSet: CookieToSet[] = [];

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(newCookies) {
        newCookies.forEach((cookie) => {
          request.cookies.set(cookie.name, cookie.value);
          cookiesToSet.push(cookie);
        });
      },
    },
  });

  const { error, data } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(
      `${origin}/auth/sign-in?error=auth-failed`
    );
  }

  // Determine the destination from the user's role.
  const user = data?.user;
  let destination = `${origin}${next}`;

  if (user) {
    const { data: profileData } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    const profile = profileData as Profile | null;

    if (profile?.role === "admin" && next === "/dashboard") {
      destination = `${origin}/admin`;
    }
  }

  // Build the redirect response and re-attach the freshly minted session
  // cookies so the browser is signed in when it follows this redirect.
  const response = NextResponse.redirect(destination);
  for (const { name, value, options } of cookiesToSet) {
    response.cookies.set(name, value, options);
  }

  return response;
}
