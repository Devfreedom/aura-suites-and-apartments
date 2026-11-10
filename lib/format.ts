/**
 * Formatting helpers shared by dashboard components (booking cards,
 * receipts, stats).
 */

export const NAIRA_FORMATTER = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  minimumFractionDigits: 0,
});

export function formatPrice(amount: number): string {
  return NAIRA_FORMATTER.format(amount);
}

export function formatDate(value: string): string {
  if (!value) return "—";
  const d = new Date(value);
  return Number.isNaN(d.getTime())
    ? "—"
    : d.toLocaleDateString("en-NG", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
}

export const VENUE_ADDRESS = "No. 5 Kashim Ibrahim Road, Jos, Benue State";

/** Google Maps directions link for the property. */
export const DIRECTIONS_URL =
  "https://www.google.com/maps/dir/?api=1&destination=No.+5+Kashim+Ibrahim+Road,+Jos,+Benue+State,+Nigeria";

/** Today as a YYYY-MM-DD string, for comparing with booking check-in dates. */
export function todayISO(): string {
  return new Date().toISOString().split("T")[0];
}

/**
 * Format a 24-hour "HH:MM" string as a 12-hour time (e.g. "15:00" -> "3:00 PM").
 * Values that are not in "HH:MM" shape are returned untouched.
 */
export function formatTime12h(value: string): string {
  const match = /^(\d{1,2}):(\d{2})$/.exec(value?.trim() ?? "");
  if (!match) return value?.trim() || "";

  const hours = Number(match[1]);
  const minutes = match[2];
  if (hours > 23) return value;

  const suffix = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 === 0 ? 12 : hours % 12;

  return `${displayHours}:${minutes} ${suffix}`;
}
