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
