import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { supabaseAnonKey, supabaseUrl } from "@/lib/supabase/config";

const LOGIN_PATH = "/auth/sign-in";
const ADMIN_LOGIN_PATH = "/admin/login";
const DEFAULT_ADMIN_PATH = "/admin/suites";
const DEFAULT_DASHBOARD_PATH = "/dashboard";

/**
 * Route protection for dashboard and admin areas.
 *
 * - /dashboard/:path*  → requires an active Supabase session
 * - /admin/:path*      → requires an active session AND role === 'admin' in public.profiles
 * - Public auth routes (/auth/sign-in, /auth/callback) are always allowed
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
  if (
    pathname === LOGIN_PATH ||
    pathname === "/auth/callback" ||
    pathname.startsWith("/auth/")
  ) {
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
      const url = request.nextUrl.clone();
      url.pathname = LOGIN_PATH;
      return NextResponse.redirect(url);
    }
    return response;
  }

  // Protect /admin/:path* — require an active session AND admin role
  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    // Admin login page is public
    const isAdminLoginRoute =
      pathname === ADMIN_LOGIN_PATH || pathname.startsWith(`${ADMIN_LOGIN_PATH}/`);

    if (!user) {
      if (isAdminLoginRoute) {
        return response;
      }
      const url = request.nextUrl.clone();
      url.pathname = LOGIN_PATH;
      return NextResponse.redirect(url);
    }

    if (isAdminLoginRoute) {
      // Already logged in, redirect to admin dashboard
      const url = request.nextUrl.clone();
      url.pathname = DEFAULT_ADMIN_PATH;
      return NextResponse.redirect(url);
    }

    // Verify admin role from public.profiles
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    if (!profile || profile.role !== "admin") {
      const url = request.nextUrl.clone();
      url.pathname = DEFAULT_DASHBOARD_PATH;
      return NextResponse.redirect(url);
    }

    return response;
  }

  return response;
}

function redirectWithCookies(
  request: NextRequest,
  source: NextResponse,
  pathname: string
) {
  const url = request.nextUrl.clone();
  url.pathname = pathname;
  url.search = "";

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
