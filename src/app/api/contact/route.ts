import { NextResponse } from "next/server";
import { getFirestoreDb } from "@/lib/firebaseAdmin";
import { sendEnquiryNotification } from "@/lib/mailer";

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

    // 2. Required fields check (Name, Email, Message - budget, service, and consent checkbox are optional)
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
      service: service || "General Architecture & Design Enquiry",
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

    // 5. Send Email via Google Workspace SMTP:
    // TO: rajesh@technoarchitecture.co.in
    // CC (permanent): enquiries@technoarchitecture.co.in
    // Reply-To: client email
    let emailDispatched = false;
    let emailMessageId: string | undefined;

    try {
      const mailResult = await sendEnquiryNotification(enquiryData);
      if (mailResult.success) {
        emailDispatched = true;
        emailMessageId = mailResult.messageId;
        console.log("Enquiry notification dispatched to rajesh@technoarchitecture.co.in (CC: enquiries@technoarchitecture.co.in)");
      } else {
        console.warn("SMTP notification returned unsuccessful:", mailResult.error);
      }
    } catch (mailErr) {
      console.error("Error during SMTP email dispatch:", mailErr);
    }

    // 6. Optional fallback: Resend dispatch if configured
    if (!emailDispatched && process.env.RESEND_API_KEY) {
      try {
        const primaryRecipients = [
          process.env.PRIMARY_TO_EMAIL || "rajesh@technoarchitecture.co.in",
          process.env.PERMANENT_CC_EMAIL || "enquiries@technoarchitecture.co.in",
        ];
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: process.env.EMAIL_FROM || "Techno Architecture <notifications@technoarchitecture.co.in>",
            to: primaryRecipients,
            reply_to: email,
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
        emailDispatched = true;
      } catch (resendErr) {
        console.warn("Resend fallback dispatch error:", resendErr);
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: "Thank you. Your architectural enquiry has been received and routed to Ar. Rajesh Shivaram and the studio team.",
        savedToFirestore,
        emailDispatched,
        messageId: emailMessageId,
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
