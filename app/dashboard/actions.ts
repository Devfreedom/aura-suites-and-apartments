"use server";

/**
 * Authenticated mutations for the guest dashboard. Every action re-checks the
 * session server-side and validates ownership before touching the database.
 */

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { createServerClient } from "@supabase/ssr";

import { supabaseUrl, supabaseAnonKey } from "@/lib/supabase/config";
import { cancelUpcomingBooking } from "@/lib/bookings";
import { updateProfileForUser } from "@/lib/profiles";

export interface DashboardActionResult {
  ok: boolean;
  message: string;
}

async function requireUser() {
  const cookieStore = await cookies();
  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll() {
        // Read-only inside Server Actions for the initial auth check
      },
    },
  });

  const { data } = await supabase.auth.getUser();
  return data.user;
}

/**
 * Save the signed-in user's profile details.
 *
 * Runs server-side with the service-role client so it is not affected by
 * RLS policies on `public.profiles`.
 */
export async function saveProfile(values: {
  fullName: string;
  phone: string;
  emergencyContact: string;
}): Promise<DashboardActionResult> {
  const user = await requireUser();
  if (!user) {
    return { ok: false, message: "Your session expired. Please sign in again." };
  }

  const fullName = values.fullName.trim();
  if (!fullName) {
    return { ok: false, message: "Full name cannot be empty." };
  }

  const result = await updateProfileForUser(user.id, {
    fullName,
    phone: values.phone.trim(),
    emergencyContact: values.emergencyContact.trim(),
  });

  if (result.ok) {
    revalidatePath("/dashboard");
  }

  return result;
}

/** Cancel a confirmed, future-dated booking owned by the signed-in user. */
export async function cancelBooking(
  reference: string
): Promise<DashboardActionResult> {
  const user = await requireUser();
  if (!user) {
    return {
      ok: false,
      message: "Your session expired. Please sign in again.",
    };
  }

  const result = await cancelUpcomingBooking(reference, user.id);

  if (result.ok) {
    revalidatePath("/dashboard");
  }

  return result;
}
