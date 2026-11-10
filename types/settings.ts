/**
 * Site settings model for the `public.site_settings` table.
 *
 * If the table does not exist yet, the settings helpers fall back to
 * environment variables and sensible defaults so the page still renders.
 */

export interface SiteSettings {
  id: string;
  site_name: string;
  contact_email: string;
  default_currency: string;
  default_check_in: string;
  default_check_out: string;
  cancellation_policy: string;
  google_oauth_configured: boolean;
  supabase_configured: boolean;
  updated_at: string;
}

export interface SiteSettingsInput {
  site_name?: string;
  contact_email?: string;
  default_currency?: string;
  default_check_in?: string;
  default_check_out?: string;
  cancellation_policy?: string;
}
