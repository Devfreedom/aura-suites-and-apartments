/**
 * Guest Storage Module
 * Auto-generates guest records without requiring password login.
 * In production, this would be replaced with a real database (PostgreSQL, MongoDB, etc.)
 */

export interface Guest {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalBookings: number;
  totalSpent: number;
  lastBookingDate: string | null;
  bookingHistory: GuestBooking[];
}

export interface GuestBooking {
  bookingId: string;
  suiteType: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  nights: number;
  totalAmount: number;
  paymentStatus: string;
  paymentReference: string;
  createdAt: string;
}

// In-memory store (mock database). In production, replace with real DB.
const guestsMap = new Map<string, Guest>();

/**
 * Get or create a guest record by email
 */
export function getOrCreateGuest(
  email: string,
  name: string,
  phone: string
): Guest {
  const existing = guestsMap.get(email.toLowerCase());

  if (existing) {
    return existing;
  }

  const newGuest: Guest = {
    id: `GUEST_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`,
    name,
    email,
    phone,
    totalBookings: 0,
    totalSpent: 0,
    lastBookingDate: null,
    bookingHistory: [],
  };

  guestsMap.set(email.toLowerCase(), newGuest);
  return newGuest;
}

/**
 * Add a booking to a guest's history
 */
export function addGuestBooking(
  email: string,
  booking: GuestBooking
): Guest | null {
  const guest = guestsMap.get(email.toLowerCase());

  if (!guest) {
    return null;
  }

  const updated: Guest = {
    ...guest,
    totalBookings: guest.totalBookings + 1,
    totalSpent: guest.totalSpent + booking.totalAmount,
    lastBookingDate: booking.createdAt,
    bookingHistory: [...guest.bookingHistory, booking],
  };

  guestsMap.set(email.toLowerCase(), updated);
  return updated;
}

/**
 * Get a guest by email
 */
export function getGuestByEmail(email: string): Guest | undefined {
  return guestsMap.get(email.toLowerCase());
}

/**
 * Get all guests (for admin use)
 */
export function getAllGuests(): Guest[] {
  return Array.from(guestsMap.values());
}

/**
 * Clear all guests (for testing/reset)
 */
export function clearAllGuests(): void {
  guestsMap.clear();
}
