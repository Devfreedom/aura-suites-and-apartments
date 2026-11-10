import { NextResponse } from "next/server";
import { getSiteSettings } from "@/lib/settings";

export const instant = false;

export async function GET() {
  const s = await getSiteSettings();
  return NextResponse.json({
    site_name: s.site_name,
    contact_email: s.contact_email,
    default_currency: s.default_currency,
    default_check_in: s.default_check_in,
    default_check_out: s.default_check_out,
    cancellation_policy: s.cancellation_policy,
    google_oauth_configured: s.google_oauth_configured,
    supabase_configured: s.supabase_configured,
  });
}
