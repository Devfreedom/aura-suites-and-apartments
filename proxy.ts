import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { supabaseAnonKey, supabaseUrl } from "@/lib/supabase/config";

const LOGIN_PATH = "/admin/login";
const DEFAULT_ADMIN_PATH = "/admin/suites";

/**
 * Route protection for the admin area.
 *
 * Note: in Next.js 16 the `middleware.ts` convention was renamed to `proxy.ts`.
 * The behaviour is identical — this runs before `/admin/*` routes render.
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
  const isLoginRoute =
    pathname === LOGIN_PATH || pathname.startsWith(`${LOGIN_PATH}/`);

  if (!user && !isLoginRoute) {
    return redirectWithCookies(request, response, LOGIN_PATH);
  }

  if (user && isLoginRoute) {
    return redirectWithCookies(request, response, DEFAULT_ADMIN_PATH);
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
  matcher: ["/admin/:path*"],
};
