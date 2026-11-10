/**
 * Server-side profile lookups.
 *
 * The `public.profiles` table is protected by RLS, and reading it through a
 * user-scoped client is fragile: a policy that references the table it is
 * defined on makes every read fail with
 * `42P17: infinite recursion detected in policy for relation "profiles"`.
 *
 * The service-role client bypasses RLS, so role checks (admin gating in the
 * proxy, the account menu in the Navbar) stay reliable regardless of how the
 * policies are configured.
 */

import { createAdminClient } from "@/lib/supabase/admin";

export interface AccountProfile {
  id: string;
  full_name: string | null;
  email: string | null;
  role: string | null;
  avatar_url: string | null;
}

/**
 * Fetch the profile row for a user id.
 *
 * Returns `null` when no row exists (e.g. the user signed up before the
 * profiles trigger was installed) or when the lookup fails — callers treat
 * that as "not an admin".
 */
export async function getProfileByUserId(
  userId: string
): Promise<AccountProfile | null> {
  if (!userId) return null;

  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, email, role, avatar_url")
    .eq("id", userId)
    .maybeSingle<AccountProfile>();

  if (error) {
    console.error("Failed to load profile:", error.message);
    return null;
  }

  return data ?? null;
}

/**
 * True when the given user id has the admin role.
 *
 * The role is compared case-insensitively so `Admin` or `ADMIN` still match.
 */
export async function isAdminUser(userId: string): Promise<boolean> {
  const profile = await getProfileByUserId(userId);
  return profile?.role?.trim().toLowerCase() === "admin";
}
