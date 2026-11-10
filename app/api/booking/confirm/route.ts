import { NextRequest, NextResponse } from "next/server";
import { markBookingPaid, createPaidBookingFromWebhook } from "@/lib/bookings";
import { sendConfirmationEmail } from "@/lib/email";
import { getOrCreateGuest, addGuestBooking } from "@/lib/guests";
import { createTransaction } from "@/lib/transactions";

interface ConfirmBookingRequest {
  reference: string;
  email: string;
  guestName: string;
  guestPhone: string;
  suiteName: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  nights: number;
  totalAmount: number;
  address?: string;
  hostContact?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: ConfirmBookingRequest = await request.json();

    const {
      reference,
      email,
      guestName,
      guestPhone,
      suiteName,
      checkIn,
      checkOut,
      guests,
      nights,
      totalAmount,
      address,
      hostContact,
    } = body;

    // Validate required fields
    if (
      !email ||
      !guestName ||
      !suiteName ||
      !checkIn ||
      !checkOut ||
      !reference
    ) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: email, guestName, suiteName, checkIn, checkOut, reference",
        },
        { status: 400 }
      );
    }

    // 1. Auto-generate guest record (no password login required)
    const guest = getOrCreateGuest(email, guestName, guestPhone);

    // 2. Add this booking to the guest's history
    const bookingRecord = {
      bookingId: reference,
      suiteType: suiteName,
      checkIn,
      checkOut,
      guests,
      nights,
      totalAmount,
      paymentStatus: "Paid",
      paymentReference: reference,
      createdAt: new Date().toISOString(),
    };

    const updatedGuest = addGuestBooking(email, bookingRecord);

    if (!updatedGuest) {
      return NextResponse.json(
        { error: "Failed to create guest record" },
        { status: 500 }
      );
    }

    // 3. Reconcile the persisted booking. `markBookingPaid` is idempotent, so a
    // refreshed verify page or a webhook that arrived first will not trigger a
    // second receipt.
    const { booking, justPaid } = await markBookingPaid(reference);

    let bookingForEmail = booking;

    if (!bookingForEmail) {
      // No persisted row (for example the database is not configured yet).
      // Create one so the booking is recorded and the receipt can be sent once.
      const created = await createPaidBookingFromWebhook({
        reference,
        customerName: guestName,
        customerEmail: email,
        customerPhone: guestPhone,
        suiteType: suiteName,
        checkIn,
        checkOut,
        guestCount: guests,
        nights,
        totalAmount,
      });
      bookingForEmail = created.booking;
    }

    let emailSent = false;
    const shouldSendEmail = justPaid || !booking;

    if (shouldSendEmail) {
      const emailResult = await sendConfirmationEmail({
        to: email,
        guestName,
        suiteName,
        checkIn,
        checkOut,
        guests,
        nights,
        totalAmount,
        reference,
        address: address || "No. 5 Kashim Ibrahim Road, Jos, Plateau State",
        hostContact: hostContact || "+234 (0) 800 AURA STAY",
        paymentMethod: bookingForEmail?.paymentMethod || "Paystack",
        paidAt: bookingForEmail?.paidAt || new Date().toISOString(),
      });

      emailSent = emailResult.success;

      if (!emailResult.success) {
        // Log but don't fail - booking is still confirmed
        console.error("Confirmation email failed:", emailResult.error);
      }
    }

    // Create a corresponding transaction record.
    await createTransaction({
      reference,
      customer_name: guestName,
      customer_email: email,
      suite_type: suiteName,
      amount: totalAmount,
      status: "completed",
    });

    return NextResponse.json({
      success: true,
      message: emailSent
        ? "Booking confirmed and email sent"
        : "Booking already confirmed",
      reference,
      guest: {
        id: guest.id,
        name: guest.name,
        email: guest.email,
        totalBookings: updatedGuest.totalBookings,
        totalSpent: updatedGuest.totalSpent,
      },
      emailSent,
    });
  } catch (error) {
    console.error("Booking confirmation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
