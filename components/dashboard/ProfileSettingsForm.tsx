"use client";

/**
 * Profile settings card for the guest dashboard.
 *
 * - Reads existing values from `public.profiles` (falling back to the auth
 *   user's metadata so the form is never blank even on a cold profile row).
 * - Saves `full_name` to both the auth user metadata and the profiles row;
 *   `phone` and `emergency_contact` are persisted wherever the schema allows
 *   and always mirrored into auth metadata as the source of truth.
 * - Email is read-only (changing it requires a confirmation flow).
 */

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2, Mail, Phone, Save, ShieldAlert, User, UserRoundCog } from "lucide-react";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { saveProfile } from "@/app/dashboard/actions";

const inputClass =
  "w-full rounded-xl border border-gray-300 bg-white py-3.5 pl-11 pr-4 text-sm text-navy outline-none transition-colors placeholder:text-gray-400 focus:border-gold focus:ring-2 focus:ring-gold/20 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400 min-h-[44px]";

interface ProfileValues {
  fullName: string;
  email: string;
  phone: string;
  emergencyContact: string;
}

const EMPTY: ProfileValues = {
  fullName: "",
  email: "",
  phone: "",
  emergencyContact: "",
};

interface ProfileRow {
  id?: string;
  full_name: string | null;
  email: string | null;
  role?: string | null;
  avatar_url?: string | null;
  phone?: string | null;
  emergency_contact?: string | null;
}

export default function ProfileSettingsForm({ user }: { user: SupabaseUser }) {
  const [values, setValues] = useState<ProfileValues>(EMPTY);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadProfile() {
      const metadata = user.user_metadata ?? {};
      const fallback: ProfileValues = {
        fullName:
          (metadata.full_name as string | undefined) ??
          user.email?.split("@")[0] ??
          "Guest",
        email: user.email ?? "",
        phone: (metadata.phone as string | undefined) ?? "",
        emergencyContact:
          (metadata.emergency_contact as string | undefined) ?? "",
      };

      // Read the profile server-side: the browser client is subject to RLS
      // policies on `public.profiles`, and a self-referencing policy makes
      // every read fail (42P17 "infinite recursion detected in policy").
      let serverProfile: ProfileRow | null = null;
      try {
        const response = await fetch("/api/account/profile", {
          credentials: "include",
          cache: "no-store",
        });
        if (response.ok) {
          serverProfile = (await response.json()) as ProfileRow;
        }
      } catch {
        // Fall back to the auth metadata below.
      }

      if (cancelled) return;

      const merged: ProfileValues = !serverProfile
        ? fallback
        : {
            fullName: serverProfile.full_name || fallback.fullName,
            email: user.email ?? "",
            phone: serverProfile.phone || fallback.phone,
            emergencyContact:
              serverProfile.emergency_contact || fallback.emergencyContact,
          };

      setValues(merged);
      setIsLoaded(true);
    }

    void loadProfile();
    return () => {
      cancelled = true;
    };
  }, [user]);

  function update<K extends keyof ProfileValues>(key: K, value: string) {
    setValues((prev) => ({ ...prev, [key]: value }));
    setHasChanges(true);
  }

  async function handleSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!values.fullName.trim()) {
      toast.error("Full name cannot be empty.");
      return;
    }

    setIsSaving(true);

    try {
      // The server action writes the profiles row with the service-role
      // client and mirrors the values into the auth metadata.
      const result = await saveProfile({
        fullName: values.fullName.trim(),
        phone: values.phone.trim(),
        emergencyContact: values.emergencyContact.trim(),
      });

      if (!result.ok) {
        toast.error(result.message || "Could not save your profile.");
        return;
      }

      toast.success(result.message);
      setHasChanges(false);
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <section
      id="profile"
      className="rounded-3xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm scroll-mt-24"
    >
      <div className="flex items-start gap-4 mb-6">
        <div className="w-11 h-11 rounded-xl bg-navy/10 text-navy flex items-center justify-center shrink-0">
          <UserRoundCog className="w-5 h-5" />
        </div>
        <div>
          <h2 className="font-serif font-bold text-xl text-navy">
            Profile Settings
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Keep your contact details up to date so our team can reach you about
            your stays.
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Full name */}
        <div>
          <label htmlFor="profile-full-name" className="mb-2 block text-sm font-medium text-navy">
            Full Name
          </label>
          <div className="relative">
            <User className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              id="profile-full-name"
              type="text"
              autoComplete="name"
              disabled={!isLoaded || isSaving}
              value={values.fullName}
              onChange={(e) => update("fullName", e.target.value)}
              placeholder="Amina Ibrahim"
              className={`${inputClass} disabled:pl-11`}
            />
          </div>
        </div>

        {/* Email — read-only */}
        <div>
          <label htmlFor="profile-email" className="mb-2 block text-sm font-medium text-navy">
            Email Address
          </label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-300" />
            <input
              id="profile-email"
              type="email"
              disabled
              value={values.email}
              className={inputClass}
            />
          </div>
          <p className="mt-1.5 text-xs text-gray-400">
            Email changes require identity confirmation — contact us to update yours.
          </p>
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="profile-phone" className="mb-2 block text-sm font-medium text-navy">
            Phone Number
          </label>
          <div className="relative">
            <Phone className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              id="profile-phone"
              type="tel"
              autoComplete="tel"
              disabled={!isLoaded || isSaving}
              value={values.phone}
              onChange={(e) => update("phone", e.target.value)}
              placeholder="+234 800 000 0000"
              className={inputClass}
            />
          </div>
        </div>

        {/* Emergency contact */}
        <div>
          <label htmlFor="profile-emergency" className="mb-2 block text-sm font-medium text-navy">
            Emergency Contact
          </label>
          <div className="relative">
            <ShieldAlert className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              id="profile-emergency"
              type="text"
              disabled={!isLoaded || isSaving}
              value={values.emergencyContact}
              onChange={(e) => update("emergencyContact", e.target.value)}
              placeholder="Name · +234 800 000 0000"
              className={inputClass}
            />
          </div>
        </div>

        {/* Submit — spans the grid, right-aligned on desktop */}
        <div className="flex sm:col-span-2 sm:justify-end pt-2">
          <button
            type="submit"
            disabled={!isLoaded || isSaving || !hasChanges}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gold px-6 py-3 text-sm font-semibold text-white shadow-md transition-colors hover:bg-[#C5A028] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving…
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </section>
  );
}
