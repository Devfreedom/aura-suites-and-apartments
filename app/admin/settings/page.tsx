"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  Building2,
  CheckCircle,
  Clock,
  CreditCard,
  Globe,
  Loader2,
  Mail,
  ShieldAlert,
  Save,
} from "lucide-react";

import { loadSiteSettings, saveSiteSettings } from "@/app/admin/settings/actions";
import type { SiteSettings, SiteSettingsInput } from "@/types/settings";
import { ToastContainer, useToast } from "@/components/ui/Toast";

const currencyOptions = [
  { value: "NGN", label: "Nigerian Naira (₦)" },
  { value: "USD", label: "US Dollar ($)" },
  { value: "GBP", label: "British Pound (£)" },
  { value: "EUR", label: "Euro (€)" },
];

const statusColor: Record<string, string> = {
  connected: "text-emerald-600 bg-emerald-50",
  disconnected: "text-red-600 bg-red-50",
};

export default function SettingsPage() {
  const { toasts, showToast, dismissToast } = useToast();
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState<SiteSettingsInput>({});

  const loadSettings = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await loadSiteSettings();
      setSettings(data);
      setForm({
        site_name: data.site_name,
        contact_email: data.contact_email,
        default_currency: data.default_currency,
        default_check_in: data.default_check_in,
        default_check_out: data.default_check_out,
        cancellation_policy: data.cancellation_policy,
      });
    } catch (error) {
      showToast({
        title: "Failed to load settings",
        description:
          error instanceof Error ? error.message : "Unknown error.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    void loadSettings();
  }, [loadSettings]);

  const handleInputChange = (
    key: keyof SiteSettingsInput,
    value: string
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);

    try {
      const result = await saveSiteSettings(form);

      if (!result.ok) {
        showToast({
          title: "Failed to save settings",
          description: result.message,
          type: "error",
        });
        return;
      }

      if (result.settings) setSettings(result.settings);
      showToast({
        title: "Settings saved",
        description: "Your changes have been applied successfully.",
        type: "success",
      });
    } catch (error) {
      showToast({
        title: "Failed to save settings",
        description:
          error instanceof Error ? error.message : "Unknown error.",
        type: "error",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="font-serif font-bold text-3xl text-navy">Settings</h1>
          <p className="text-gray-600 mt-2">
            Configure site-wide preferences for Aura Suites & Apartments
          </p>
        </div>
        <div className="flex items-center justify-center py-20 text-gray-500">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="ml-2 text-sm">Loading settings…</span>
        </div>
      </div>
    );
  }

  const s = settings!;

  return (
    <div className="space-y-8">
      {/* Toast Container */}
      <ToastContainer />

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif font-bold text-3xl text-navy">Settings</h1>
          <p className="text-gray-600 mt-2">
            Manage site-wide configuration for Aura Suites & Apartments
          </p>
        </div>
        <button
          type="button"
          onClick={() => void handleSave()}
          disabled={isSaving}
          className="inline-flex items-center gap-2 bg-navy text-white px-6 py-3.5 rounded-xl font-medium hover:bg-navy/90 transition-all disabled:opacity-60 min-h-[44px]"
        >
          <Save className="w-4 h-4" />
          {isSaving ? "Saving…" : "Save Changes"}
        </button>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); void handleSave(); }} className="space-y-8">
        {/* Section 1: General Site Settings */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-navy/10 text-navy flex items-center justify-center">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-lg text-navy">
                General Site Settings
              </h2>
              <p className="text-sm text-gray-500">
                Site name, contact email, and default currency
              </p>
            </div>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-navy">
                Site Name
              </label>
              <input
                type="text"
                name="site_name"
                value={form.site_name ?? s.site_name}
                onChange={(e) =>
                  handleInputChange("site_name", e.target.value)
                }
                className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none text-sm text-navy bg-gray-50/50 min-h-[44px]"
                disabled={isSaving}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-navy">
                Contact Email
              </label>
              <input
                type="email"
                name="contact_email"
                value={form.contact_email ?? s.contact_email}
                onChange={(e) =>
                  handleInputChange("contact_email", e.target.value)
                }
                className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none text-sm text-navy bg-gray-50/50 min-h-[44px]"
                disabled={isSaving}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-navy">
                Default Currency
              </label>
              <select
                name="default_currency"
                value={form.default_currency ?? s.default_currency}
                onChange={(e) =>
                  handleInputChange("default_currency", e.target.value)
                }
                className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none text-sm text-navy bg-gray-50/50 min-h-[44px]"
                disabled={isSaving}
              >
                {currencyOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: Booking & Apartment Rules */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gold/10 text-gold flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-lg text-navy">
                Booking & Apartment Rules
              </h2>
              <p className="text-sm text-gray-500">
                Default check-in/check-out times and cancellation policy
              </p>
            </div>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-navy">
                Default Check-in Time
              </label>
              <input
                type="time"
                name="default_check_in"
                value={form.default_check_in ?? s.default_check_in}
                onChange={(e) =>
                  handleInputChange("default_check_in", e.target.value)
                }
                className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none text-sm text-navy bg-gray-50/50 min-h-[44px]"
                disabled={isSaving}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-navy">
                Default Check-out Time
              </label>
              <input
                type="time"
                name="default_check_out"
                value={form.default_check_out ?? s.default_check_out}
                onChange={(e) =>
                  handleInputChange("default_check_out", e.target.value)
                }
                className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none text-sm text-navy bg-gray-50/50 min-h-[44px]"
                disabled={isSaving}
              />
            </div>
            <div className="md:col-span-3 space-y-2">
              <label className="block text-sm font-medium text-navy">
                Cancellation Policy
              </label>
              <textarea
                name="cancellation_policy"
                value={form.cancellation_policy ?? s.cancellation_policy}
                onChange={(e) =>
                  handleInputChange("cancellation_policy", e.target.value)
                }
                rows={4}
                className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none text-sm text-navy bg-gray-50/50 min-h-[44px]"
                disabled={isSaving}
              />
              <p className="text-xs text-gray-400 mt-1">
                This policy is shown to guests during booking.
              </p>
            </div>
          </div>
        </div>

        {/* Section 3: Google OAuth & Supabase Status */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-navy/10 text-navy flex items-center justify-center">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-lg text-navy">
                Google OAuth & Supabase Status
              </h2>
              <p className="text-sm text-gray-500">
                Authentication and database integration status
              </p>
            </div>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-7 h-7 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-medium text-navy">Google OAuth</h3>
                  <p className="text-xs text-gray-500">
                    Social sign-in for guests and admins
                  </p>
                </div>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor[s.google_oauth_configured ? "connected" : "disconnected"]}`}>
                {s.google_oauth_configured ? "Configured" : "Not configured"}
              </div>
              {!s.google_oauth_configured && (
                <p className="text-xs text-gray-500 mt-2">
                  Enable the Google provider in Supabase (Authentication →
                  Providers → Google) with a client id and secret.
                </p>
              )}
            </div>

            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-7 h-7 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                  <DatabaseIcon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-medium text-navy">Supabase</h3>
                  <p className="text-xs text-gray-500">
                    Backend database and auth provider
                  </p>
                </div>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor[s.supabase_configured ? "connected" : "disconnected"]}`}>
                {s.supabase_configured ? "Connected" : "Not connected"}
              </div>
              {!s.supabase_configured && (
                <p className="text-xs text-gray-500 mt-2">
                  Supabase URL and anon key are required.
                </p>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

function DatabaseIcon({ className }: { className: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
    </svg>
  );
}
