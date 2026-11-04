import { NextRequest, NextResponse } from "next/server";
import { sendConfirmationEmail } from "@/lib/email";
import { getOrCreateGuest, addGuestBooking } from "@/lib/guests";

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
    if (!email || !guestName || !suiteName || !checkIn || !checkOut || !reference) {
      return NextResponse.json(
        { error: "Missing required fields: email, guestName, suiteName, checkIn, checkOut, reference" },
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

    // 3. Send confirmation email
    const emailResult = await sendConfirmationEmail({
      to: email,
      guestName,
      suiteName,
      checkIn,
      checkOut,
      guests,
      totalAmount,
      reference,
      address: address || "No. 5 Kashim Ibrahim Road, Jos, Plateau State",
      hostContact: hostContact || "+234 (0) 800 AURA STAY",
    });

    if (!emailResult.success) {
      // Log but don't fail - booking is still confirmed
      console.error("Confirmation email failed:", emailResult.error);
    }

    return NextResponse.json({
      success: true,
      message: "Booking confirmed and email sent",
      reference,
      guest: {
        id: guest.id,
        name: guest.name,
        email: guest.email,
        totalBookings: updatedGuest.totalBookings,
        totalSpent: updatedGuest.totalSpent,
      },
      emailSent: emailResult.success,
    });
  } catch (error) {
    console.error("Booking confirmation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
