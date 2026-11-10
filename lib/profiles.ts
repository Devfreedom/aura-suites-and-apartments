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
  phone: string | null;
  emergency_contact: string | null;
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

  // `select("*")` keeps this working on schemas that do not yet have the
  // optional phone / emergency_contact columns (a named column that is
  // missing makes the whole query fail).
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle<Record<string, unknown>>();

  if (error) {
    console.error("Failed to load profile:", error.message);
    return null;
  }

  if (!data) return null;

  const row = data as Record<string, unknown>;

  return {
    id: (row.id as string) ?? userId,
    full_name: (row.full_name as string | null) ?? null,
    email: (row.email as string | null) ?? null,
    role: (row.role as string | null) ?? null,
    avatar_url: (row.avatar_url as string | null) ?? null,
    phone: (row.phone as string | null) ?? null,
    emergency_contact: (row.emergency_contact as string | null) ?? null,
  };
}

/**
 * Persist profile edits for a user.
 *
 * Writes the `profiles` row with the service-role client (RLS bypass) and
 * mirrors the values into the auth user's metadata, which is always writable
 * and acts as the fallback source of truth.
 */
export async function updateProfileForUser(
  userId: string,
  values: {
    fullName: string;
    phone?: string;
    emergencyContact?: string;
  }
): Promise<{ ok: boolean; message: string }> {
  if (!userId) {
    return { ok: false, message: "You must be signed in to update your profile." };
  }

  const supabase = createAdminClient();

  const patch: Record<string, unknown> = { full_name: values.fullName };
  if (values.phone !== undefined) patch.phone = values.phone;
  if (values.emergencyContact !== undefined) {
    patch.emergency_contact = values.emergencyContact;
  }

  const { error } = await supabase
    .from("profiles")
    .update(patch)
    .eq("id", userId);

  if (error) {
    // Older schemas may not have the optional columns — retry with the
    // columns that always exist.
    const { error: fallbackError } = await supabase
      .from("profiles")
      .update({ full_name: values.fullName })
      .eq("id", userId);

    if (fallbackError) {
      console.error("Failed to update profile:", fallbackError.message);
      return {
        ok: false,
        message: "We could not save your profile. Please try again.",
      };
    }
  }

  // Keep the auth metadata in sync (guaranteed-writable fallback).
  try {
    const { error: authError } = await supabase.auth.admin.updateUserById(
      userId,
      {
        user_metadata: {
          full_name: values.fullName,
          ...(values.phone !== undefined ? { phone: values.phone } : {}),
          ...(values.emergencyContact !== undefined
            ? { emergency_contact: values.emergencyContact }
            : {}),
        },
      }
    );
    if (authError) console.error("Failed to sync auth metadata:", authError.message);
  } catch (err) {
    console.error("Failed to sync auth metadata:", err);
  }

  return { ok: true, message: "Profile updated successfully." };
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
