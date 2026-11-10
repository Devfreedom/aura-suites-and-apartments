import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { supabaseAnonKey, supabaseUrl } from "@/lib/supabase/config";
import { isAdminUser } from "@/lib/profiles";

const LOGIN_PATH = "/auth/sign-in";
const ADMIN_LOGIN_PATH = "/admin/login";
const DEFAULT_ADMIN_PATH = "/admin";
const DEFAULT_DASHBOARD_PATH = "/dashboard";

/**
 * Route protection for the guest dashboard and the admin panel.
 *
 * - /dashboard/:path*  → requires an active Supabase session
 * - /admin/:path*      → requires an active session AND role === 'admin'
 *                        in public.profiles; non-admins go to /dashboard
 * - /admin/login       → public, but signed-in users are bounced onward
 * - Public auth routes (/auth/*) are always allowed
 * - Static assets and images are always allowed
 *
 * Note: in Next.js 16 the `middleware.ts` convention was renamed to `proxy.ts`.
 * This file is the actual middleware — it runs before protected routes render.
 */
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  // `getUser()` validates the session against Supabase Auth. Do not trust
  // `getSession()` here, because it only reads the (potentially forged) cookie.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // Always allow public auth routes
  if (pathname.startsWith("/auth/")) {
    return response;
  }

  // Always allow static assets and images
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    pathname === "/favicon.ico" ||
    pathname.match(/\.(?:png|jpg|jpeg|gif|svg|ico|webp|avif|css|js|woff2?)$/i)
  ) {
    return response;
  }

  // Protect /dashboard/:path* — require an active session
  if (pathname === "/dashboard" || pathname.startsWith("/dashboard/")) {
    if (!user) {
      // `redirectWithCookies` forwards any session cookies refreshed above, so
      // a token rotation mid-redirect never logs the guest out.
      return redirectWithCookies(
        request,
        response,
        `${LOGIN_PATH}?redirectTo=${encodeURIComponent(pathname)}`
      );
    }
    return response;
  }

  // Protect /admin/:path* — require an active session AND the admin role
  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    const isAdminLoginRoute =
      pathname === ADMIN_LOGIN_PATH || pathname.startsWith(`${ADMIN_LOGIN_PATH}/`);

    // --- Unauthenticated ---
    if (!user) {
      // The admin sign-in page itself must stay reachable.
      if (isAdminLoginRoute) return response;

      // Everyone else is sent to the public sign-in page, remembering where
      // they were headed so they can be returned there after logging in.
      return redirectWithCookies(
        request,
        response,
        `${LOGIN_PATH}?redirectTo=${encodeURIComponent(pathname)}`
      );
    }

    // --- Authenticated: resolve the role from public.profiles ---
    //
    // The lookup uses the service-role client (RLS bypass) so the check
    // cannot break because of a policy on the profiles table. It still fails
    // closed: a missing profile or a failed lookup is never treated as admin.
    const isAdmin = await isAdminUser(user.id);

    if (isAdminLoginRoute) {
      // Already signed in with enough rights — skip the login form.
      return redirectWithCookies(
        request,
        response,
        isAdmin ? DEFAULT_ADMIN_PATH : DEFAULT_DASHBOARD_PATH
      );
    }

    if (!isAdmin) {
      return redirectWithCookies(request, response, DEFAULT_DASHBOARD_PATH);
    }

    return response;
  }

  return response;
}

/**
 * Build a redirect that carries over any cookies Supabase refreshed while
 * validating the session, so the browser does not lose its new tokens.
 */
function redirectWithCookies(
  request: NextRequest,
  source: NextResponse,
  target: string
) {
  const url = request.nextUrl.clone();

  // Allow `target` to carry its own query string (e.g. ?redirectTo=/admin).
  const [pathname, search = ""] = target.split("?");
  url.pathname = pathname;
  url.search = search ? `?${search}` : "";

  const redirect = NextResponse.redirect(url);
  source.cookies.getAll().forEach(({ name, value, ...options }) => {
    redirect.cookies.set(name, value, options);
  });

  return redirect;
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/auth/sign-in",
    "/auth/callback",
    "/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};
