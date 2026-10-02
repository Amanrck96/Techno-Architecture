import { NextResponse } from "next/server";
import { getFirestoreDb } from "@/lib/firebaseAdmin";

export const dynamic = "force-dynamic";

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
      honeypot,
    } = body;

    // 1. Honeypot spam check
    if (honeypot) {
      return NextResponse.json(
        { error: "Spam submission rejected." },
        { status: 400 }
      );
    }

    // 2. Required fields check (Name, Email, Message - budget, service, and consent checkbox are NOT required)
    if (!fullName || !email || !message) {
      return NextResponse.json(
        { error: "Please provide your name, email address, and project requirements." },
        { status: 422 }
      );
    }

    // 3. Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 422 }
      );
    }

    const timestamp = new Date().toISOString();
    const enquiryData = {
      fullName,
      email,
      phone: phone || "Not provided",
      company: company || "Not provided",
      service: service || "General Architecture & Design Inquiry",
      budget: budget || "Not specified",
      message,
      createdAt: timestamp,
      status: "new",
    };

    // 4. Save to Firestore (collection: "enquiries")
    let savedToFirestore = false;
    try {
      const db = getFirestoreDb();
      if (db) {
        await db.collection("enquiries").add(enquiryData);
        savedToFirestore = true;
        console.log("Enquiry successfully saved to Firestore 'enquiries' collection.");
      }
    } catch (dbErr) {
      console.warn("Firestore save notice:", dbErr);
    }

    // 5. Designated recipient emails:
    // Mail should come to Rajesh and enquiry mail
    const primaryRecipients = [
      process.env.RAJESH_EMAIL || "rajesh@technoarchitecture.in",
      process.env.ENQUIRY_EMAIL || "technoarchitecture@gmail.com",
    ];

    console.log("Techno Architecture Enquiry Received:", {
      ...enquiryData,
      savedToFirestore,
      dispatchedTo: primaryRecipients,
    });

    // 6. Optional SMTP / Resend dispatch if API key or SMTP is configured
    if (process.env.RESEND_API_KEY) {
      try {
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: process.env.EMAIL_FROM || "Techno Architecture <notifications@technoarchitecture.in>",
            to: primaryRecipients,
            subject: `New Architectural Enquiry from ${fullName}`,
            html: `
              <h2>New Project Enquiry</h2>
              <p><strong>Name:</strong> ${fullName}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Phone:</strong> ${phone || "N/A"}</p>
              <p><strong>Company:</strong> ${company || "N/A"}</p>
              <p><strong>Message:</strong></p>
              <blockquote style="background:#f4f4f4;padding:12px;border-left:3px solid #000;">${message.replace(/\n/g, "<br/>")}</blockquote>
              <p><small>Received at: ${timestamp}</small></p>
            `,
          }),
        });
      } catch (mailErr) {
        console.warn("Email service dispatch error:", mailErr);
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: "Thank you. Your architectural enquiry has been received and routed to Ar. Rajesh Shivaram and the studio team.",
        savedToFirestore,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Enquiry API error:", error);
    return NextResponse.json(
      { error: "An unexpected server error occurred. Please try again." },
      { status: 500 }
    );
  }
}
