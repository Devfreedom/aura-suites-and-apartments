/**
 * Server-side site settings helpers.
 *
 * Reads/writes the `public.site_settings` table. Falls back to environment
 * variables and defaults when the table does not exist yet.
 *
 * NOTE: this module uses the service-role client, so it must only ever be
 * imported from server code (server actions / route handlers) — never from a
 * client component.
 */

import { createAdminClient } from "@/lib/supabase/admin";
import { supabaseAnonKey, supabaseUrl } from "@/lib/supabase/config";
import type { SiteSettings, SiteSettingsInput } from "@/types/settings";

const TABLE = "site_settings";

const DEFAULT_SETTINGS: SiteSettings = {
  id: "",
  site_name: process.env.NEXT_PUBLIC_SITE_NAME || "Aura Suites & Apartments",
  contact_email:
    process.env.NEXT_PUBLIC_CONTACT_EMAIL || "reservations@aurasuitessapartments.com",
  default_currency: process.env.NEXT_PUBLIC_DEFAULT_CURRENCY || "NGN",
  default_check_in: process.env.NEXT_PUBLIC_DEFAULT_CHECK_IN || "15:00",
  default_check_out: process.env.NEXT_PUBLIC_DEFAULT_CHECK_OUT || "11:00",
  cancellation_policy:
    "Free cancellation up to 24 hours before check-in. After that, 50% of the booking total is charged.",
  google_oauth_configured: false,
  supabase_configured: Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ),
  updated_at: new Date().toISOString(),
};

/**
 * The live table uses `currency` / `check_in_time` / `check_out_time`, but
 * earlier builds wrote `default_currency` / `default_check_in` /
 * `default_check_out`. Both shapes are accepted when reading.
 */
interface SettingsRow {
  id: string | number;
  site_name: string | null;
  contact_email: string | null;
  currency?: string | null;
  default_currency?: string | null;
  check_in_time?: string | null;
  default_check_in?: string | null;
  check_out_time?: string | null;
  default_check_out?: string | null;
  cancellation_policy: string | null;
  google_oauth_configured?: boolean | null;
  supabase_configured?: boolean | null;
  updated_at: string;
}

function mapRow(row: SettingsRow): SiteSettings {
  return {
    id: String(row.id ?? ""),
    site_name: row.site_name ?? DEFAULT_SETTINGS.site_name,
    contact_email: row.contact_email ?? DEFAULT_SETTINGS.contact_email,
    default_currency:
      row.currency ??
      row.default_currency ??
      DEFAULT_SETTINGS.default_currency,
    default_check_in:
      row.check_in_time ??
      row.default_check_in ??
      DEFAULT_SETTINGS.default_check_in,
    default_check_out:
      row.check_out_time ??
      row.default_check_out ??
      DEFAULT_SETTINGS.default_check_out,
    cancellation_policy:
      row.cancellation_policy ?? DEFAULT_SETTINGS.cancellation_policy,
    google_oauth_configured:
      row.google_oauth_configured ?? DEFAULT_SETTINGS.google_oauth_configured,
    supabase_configured:
      row.supabase_configured ?? DEFAULT_SETTINGS.supabase_configured,
    updated_at: row.updated_at,
  };
}

/**
 * Detect whether the Google OAuth provider is really enabled in Supabase.
 *
 * The provider credentials live in the Supabase dashboard (Authentication ->
 * Providers -> Google), NOT in this app's environment, so an env-var check
 * alone always reports "not configured". Probing the authorize endpoint is
 * the only reliable, credential-free signal: when Google is enabled Supabase
 * redirects to accounts.google.com with the client id.
 */
async function detectGoogleOAuth(): Promise<boolean> {
  if (!supabaseUrl || !supabaseAnonKey) return false;

  const redirectTo =
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "http://localhost:3000";

  const authorizeUrl = `${supabaseUrl}/auth/v1/authorize?provider=google&redirect_to=${encodeURIComponent(
    `${redirectTo}/auth/callback`
  )}`;

  try {
    const response = await fetch(authorizeUrl, {
      method: "GET",
      redirect: "manual",
      headers: { apikey: supabaseAnonKey },
      cache: "no-store",
    });

    const location = response.headers.get("location") ?? "";
    const isGoogleRedirect =
      response.status >= 300 &&
      response.status < 400 &&
      location.includes("accounts.google.com");

    if (isGoogleRedirect) return true;
  } catch {
    // Network error — fall through to the env-var signal.
  }

  // Fallback: the mirror of the credentials configured in Supabase.
  return Boolean(process.env.GOOGLE_CLIENT_ID);
}

/**
 * Fetch the current site settings. Returns defaults if the table is empty
 * or does not exist yet.
 */
export async function getSiteSettings(): Promise<SiteSettings> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    // Table may not exist yet — return defaults instead of throwing.
    console.warn("site_settings table unavailable:", error.message);
    return {
      ...DEFAULT_SETTINGS,
      google_oauth_configured: await detectGoogleOAuth(),
    };
  }

  if (!data) {
    return {
      ...DEFAULT_SETTINGS,
      google_oauth_configured: await detectGoogleOAuth(),
    };
  }

  // The provider status is detected live — a stale stored boolean must never
  // report "not configured" for a provider that is working.
  return {
    ...mapRow(data as SettingsRow),
    google_oauth_configured: await detectGoogleOAuth(),
  };
}

/**
 * Update (upsert) the site settings.
 *
 * Writes whichever column naming the table actually uses, and keeps the
 * existing row id so the table never grows a second row.
 */
export async function updateSiteSettings(
  input: SiteSettingsInput
): Promise<SiteSettings> {
  const supabase = createAdminClient();

  // Reuse the id of the current row (the live table uses a fixed id).
  const { data: current } = await supabase
    .from(TABLE)
    .select("id")
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const base = {
    site_name: input.site_name,
    contact_email: input.contact_email,
    cancellation_policy: input.cancellation_policy,
    updated_at: new Date().toISOString(),
    ...(current?.id !== undefined ? { id: current.id } : {}),
  };

  // Preferred (live) column names first, then the legacy ones.
  const attempts: Array<Record<string, unknown>> = [
    {
      ...base,
      currency: input.default_currency,
      check_in_time: input.default_check_in,
      check_out_time: input.default_check_out,
    },
    {
      ...base,
      default_currency: input.default_currency,
      default_check_in: input.default_check_in,
      default_check_out: input.default_check_out,
    },
  ];

  let lastError: string | null = null;

  for (const payload of attempts) {
    const { data, error } = await supabase
      .from(TABLE)
      .upsert(payload as never, { onConflict: "id" })
      .select("*")
      .maybeSingle();

    if (!error) {
      return {
        ...mapRow(data as SettingsRow),
        google_oauth_configured: await detectGoogleOAuth(),
      };
    }

    lastError = error.message;
    // Only retry when the failure looks like a column-name mismatch.
    if (!/column .* does not exist/i.test(error.message)) break;
  }

  throw new Error(`Failed to save settings: ${lastError}`);
}
