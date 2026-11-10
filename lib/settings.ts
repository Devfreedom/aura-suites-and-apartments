/**
 * Server-side site settings helpers.
 *
 * Reads/writes the `public.site_settings` table. Falls back to environment
 * variables and defaults when the table does not exist yet.
 */

import { createAdminClient } from "@/lib/supabase/admin";
import type { SiteSettings, SiteSettingsInput } from "@/types/settings";

const TABLE = "site_settings";

const DEFAULT_SETTINGS: SiteSettings = {
  id: "",
  site_name: process.env.NEXT_PUBLIC_SITE_NAME || "Aura Suites & Apartments",
  contact_email:
    process.env.NEXT_PUBLIC_CONTACT_EMAIL || "hello@aurasuites.example",
  default_currency: process.env.NEXT_PUBLIC_DEFAULT_CURRENCY || "NGN",
  default_check_in: process.env.NEXT_PUBLIC_DEFAULT_CHECK_IN || "15:00",
  default_check_out: process.env.NEXT_PUBLIC_DEFAULT_CHECK_OUT || "11:00",
  cancellation_policy:
    "Free cancellation up to 24 hours before check-in. After that, 50% of the booking total is charged.",
  google_oauth_configured: Boolean(
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
  ),
  supabase_configured: Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ),
  updated_at: new Date().toISOString(),
};

interface SettingsRow {
  id: string;
  site_name: string | null;
  contact_email: string | null;
  default_currency: string | null;
  default_check_in: string | null;
  default_check_out: string | null;
  cancellation_policy: string | null;
  google_oauth_configured: boolean | null;
  supabase_configured: boolean | null;
  updated_at: string;
}

function mapRow(row: SettingsRow): SiteSettings {
  return {
    id: row.id,
    site_name: row.site_name ?? DEFAULT_SETTINGS.site_name,
    contact_email: row.contact_email ?? DEFAULT_SETTINGS.contact_email,
    default_currency: row.default_currency ?? DEFAULT_SETTINGS.default_currency,
    default_check_in: row.default_check_in ?? DEFAULT_SETTINGS.default_check_in,
    default_check_out: row.default_check_out ?? DEFAULT_SETTINGS.default_check_out,
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
 * Fetch the current site settings. Returns defaults if the table is empty
 * or does not exist yet.
 */
export async function getSiteSettings(): Promise<SiteSettings> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .order("updated_at", { ascending: false })
    .maybeSingle();

  if (error) {
    // Table may not exist yet — return defaults instead of throwing.
    console.warn("site_settings table unavailable:", error.message);
    return DEFAULT_SETTINGS;
  }

  if (!data) {
    return DEFAULT_SETTINGS;
  }

  return mapRow(data as SettingsRow);
}

/**
 * Update (upsert) the site settings.
 */
export async function updateSiteSettings(
  input: SiteSettingsInput
): Promise<SiteSettings> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from(TABLE)
    .upsert(
      {
        ...input,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" }
    )
    .select("*")
    .single();

  if (error) {
    throw new Error(`Failed to save settings: ${error.message}`);
  }

  return mapRow(data as SettingsRow);
}
