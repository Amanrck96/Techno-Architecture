import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      fullName,
      email,
      phone,
      company,
      service,
      budget,
      message,
      consent,
      honeypot,
    } = body;

    // Honeypot spam check
    if (honeypot) {
      return NextResponse.json(
        { error: "Spam submission rejected." },
        { status: 400 }
      );
    }

    // Required fields check
    if (!fullName || !email || !message || !consent) {
      return NextResponse.json(
        { error: "Please fill all required fields and accept the privacy policy." },
        { status: 422 }
      );
    }

    // Basic email regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 422 }
      );
    }

    // In a production app, here we send via Resend, SendGrid, or save to DB.
    // For now, log the submission cleanly.
    console.log("Techno Architecture Inquiry received:", {
      fullName,
      email,
      phone,
      company,
      service,
      budget,
      message,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      {
        success: true,
        message: "Thank you. Your architectural inquiry has been routed to our principals.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json(
      { error: "An unexpected server error occurred. Please try again." },
      { status: 500 }
    );
  }
}
