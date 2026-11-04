import { NextRequest, NextResponse } from "next/server";

// Mock existing bookings - in production, this would come from a database
const EXISTING_BOOKINGS: Array<{
  suiteId: string;
  checkIn: string;
  checkOut: string;
}> = [
  {
    suiteId: "Deluxe Studio",
    checkIn: "2026-11-10",
    checkOut: "2026-11-15",
  },
  {
    suiteId: "Royal 1-Bedroom Suite",
    checkIn: "2026-11-20",
    checkOut: "2026-11-25",
  },
  {
    suiteId: "Executive 2-Bedroom Suite",
    checkIn: "2026-12-01",
    checkOut: "2026-12-05",
  },
];

function datesOverlap(
  startA: string,
  endA: string,
  startB: string,
  endB: string
): boolean {
  return new Date(startA) < new Date(endB) && new Date(endA) > new Date(startB);
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const suiteId = searchParams.get("suiteId");
    const checkIn = searchParams.get("checkIn");
    const checkOut = searchParams.get("checkOut");

    if (!suiteId || !checkIn || !checkOut) {
      return NextResponse.json(
        { error: "Missing required parameters: suiteId, checkIn, checkOut" },
        { status: 400 }
      );
    }

    if (new Date(checkIn) >= new Date(checkOut)) {
      return NextResponse.json(
        { error: "Check-out date must be after check-in date" },
        { status: 400 }
      );
    }

    const overlapping = EXISTING_BOOKINGS.filter(
      (b) => b.suiteId === suiteId && datesOverlap(checkIn, checkOut, b.checkIn, b.checkOut)
    );

    const reservedDates = overlapping.map((b) => ({
      checkIn: b.checkIn,
      checkOut: b.checkOut,
    }));

    return NextResponse.json({
      available: overlapping.length === 0,
      reservedDates,
    });
  } catch (error) {
    console.error("Availability check error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
