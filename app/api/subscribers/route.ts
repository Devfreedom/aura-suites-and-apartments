import { NextRequest, NextResponse } from "next/server";
import { subscribeEmail } from "@/lib/newsletter";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    const email = typeof body?.email === "string" ? body.email : "";

    if (!email) {
      return NextResponse.json(
        { error: "Email address is required." },
        { status: 400 }
      );
    }

    const result = await subscribeEmail(email);

    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: "You're subscribed. Welcome to the Aura circle.",
      email: result.email,
    });
  } catch (error) {
    console.error("Subscriber API error:", error);
    return NextResponse.json(
      { error: "Unable to subscribe right now. Please try again." },
      { status: 500 }
    );
  }
}
