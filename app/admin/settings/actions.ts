"use server";

/**
 * Server actions for the admin settings page.
 *
 * The settings helpers use the service-role client, so they must run on the
 * server — these actions keep them out of the browser bundle.
 */

import { revalidatePath } from "next/cache";

import { getSiteSettings, updateSiteSettings } from "@/lib/settings";
import type { SiteSettings, SiteSettingsInput } from "@/types/settings";

export interface SettingsActionResult {
  ok: boolean;
  message: string;
}

/** Load the current site settings. */
export async function loadSiteSettings(): Promise<SiteSettings> {
  return getSiteSettings();
}

/** Persist the site settings form. */
export async function saveSiteSettings(
  input: SiteSettingsInput
): Promise<SettingsActionResult & { settings?: SiteSettings }> {
  try {
    const settings = await updateSiteSettings(input);
    revalidatePath("/admin/settings");
    return { ok: true, message: "Settings saved.", settings };
  } catch (error) {
    return {
      ok: false,
      message:
        error instanceof Error ? error.message : "Failed to save settings.",
    };
  }
}
