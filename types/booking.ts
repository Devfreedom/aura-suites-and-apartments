/**
 * Booking / reservation model for the `public.bookings` table.
 */

export type PaymentStatus = "pending" | "paid" | "failed" | "abandoned";
export type BookingStatus = "pending" | "confirmed" | "cancelled";

export interface Booking {
  id: string;
  reference: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  suiteType: string;
  checkIn: string;
  checkOut: string;
  guestCount: number;
  nights: number;
  totalAmount: number;
  paymentStatus: PaymentStatus;
  bookingStatus: BookingStatus;
  paymentUrl: string | null;
  paymentMethod: string | null;
  metadata: Record<string, unknown>;
  reminderSentAt: string | null;
  paidAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBookingInput {
  reference: string;
  customerName?: string;
  customerEmail: string;
  customerPhone?: string;
  suiteType?: string;
  checkIn?: string;
  checkOut?: string;
  guestCount?: number;
  nights?: number;
  totalAmount: number;
  paymentUrl?: string | null;
  metadata?: Record<string, unknown>;
}
