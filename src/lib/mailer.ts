import nodemailer from "nodemailer";

export interface EnquiryEmailPayload {
  fullName: string;
  email: string;
  phone?: string;
  company?: string;
  service?: string;
  budget?: string;
  message: string;
  createdAt?: string;
}

export interface MailerResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

// Default Studio Routing Targets
const DEFAULT_SMTP_USER = "rajesh@technoarchitecture.co.in";
const DEFAULT_PRIMARY_TO = "rajesh@technoarchitecture.co.in";
const DEFAULT_PERMANENT_CC = "enquiries@technoarchitecture.co.in";

/**
 * Creates a cached or on-demand nodemailer transporter for Google Workspace / SMTP.
 */
function getTransporter() {
  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const port = parseInt(process.env.SMTP_PORT || "465", 10);
  const secure = process.env.SMTP_SECURE === "false" ? false : port === 465;
  const user = process.env.SMTP_USER || DEFAULT_SMTP_USER;
  
  // Strip all whitespaces from Google App Password (e.g., 'yitc eiev figr boaj' -> 'yitceievfigrboaj')
  const pass = (process.env.SMTP_PASS || "yitceievfigrboaj").replace(/\s+/g, "");

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass,
    },
    tls: {
      rejectUnauthorized: true,
    },
  });
}

/**
 * Generates an architectural, minimalist HTML email notification.
 */
function renderHtmlTemplate(payload: EnquiryEmailPayload, timestamp: string): string {
  const { fullName, email, phone, company, service, budget, message } = payload;
  const formattedMessage = message ? message.replace(/\n/g, "<br/>") : "No narrative provided";

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Project Enquiry - Techno Architecture</title>
</head>
<body style="margin: 0; padding: 24px; background-color: #f7f7f7; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #171717;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 640px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e5e5e5; border-collapse: separate; border-radius: 0px;">
    <!-- Minimalist Architectural Header -->
    <tr>
      <td style="padding: 32px 36px; background-color: #0a0a0a; color: #ffffff;">
        <div style="font-size: 10px; font-weight: 600; letter-spacing: 0.28em; text-transform: uppercase; color: #a3a3a3; margin-bottom: 8px; font-family: monospace;">
          TECHNO ARCHITECTURE STUDIO
        </div>
        <h1 style="margin: 0; font-size: 22px; font-weight: 300; letter-spacing: 0.04em; color: #ffffff;">
          New Project Enquiry
        </h1>
        <div style="font-size: 12px; color: #737373; margin-top: 6px;">
          Transmitted on ${timestamp}
        </div>
      </td>
    </tr>

    <!-- Core Content -->
    <tr>
      <td style="padding: 36px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
          <tr>
            <td colspan="2" style="padding-bottom: 12px; border-bottom: 1px solid #171717;">
              <span style="font-size: 10px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; color: #171717;">
                CLIENT & SITE DOSSIER
              </span>
            </td>
          </tr>
          <tr>
            <td style="padding: 12px 0; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #737373; width: 35%;">
              Full Name
            </td>
            <td style="padding: 12px 0; font-size: 14px; font-weight: 600; color: #0a0a0a;">
              ${fullName}
            </td>
          </tr>
          <tr>
            <td style="padding: 12px 0; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #737373; border-top: 1px solid #f0f0f0;">
              Email Address
            </td>
            <td style="padding: 12px 0; font-size: 13px; color: #0a0a0a; border-top: 1px solid #f0f0f0;">
              <a href="mailto:${email}" style="color: #0a0a0a; text-decoration: underline;">${email}</a>
            </td>
          </tr>
          <tr>
            <td style="padding: 12px 0; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #737373; border-top: 1px solid #f0f0f0;">
              Phone Number
            </td>
            <td style="padding: 12px 0; font-size: 13px; color: #0a0a0a; border-top: 1px solid #f0f0f0; font-family: monospace;">
              ${phone ? `<a href="tel:${phone.replace(/\s+/g, '')}" style="color: #0a0a0a; text-decoration: none;">${phone}</a>` : "Not provided"}
            </td>
          </tr>
          <tr>
            <td style="padding: 12px 0; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #737373; border-top: 1px solid #f0f0f0;">
              Company / Org
            </td>
            <td style="padding: 12px 0; font-size: 13px; color: #0a0a0a; border-top: 1px solid #f0f0f0;">
              ${company || "Not provided"}
            </td>
          </tr>
          <tr>
            <td style="padding: 12px 0; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #737373; border-top: 1px solid #f0f0f0;">
              Discipline / Scope
            </td>
            <td style="padding: 12px 0; font-size: 13px; color: #0a0a0a; border-top: 1px solid #f0f0f0;">
              ${service || "General Architecture & Design Enquiry"}
            </td>
          </tr>
          ${budget ? `
          <tr>
            <td style="padding: 12px 0; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #737373; border-top: 1px solid #f0f0f0;">
              Budget Parameter
            </td>
            <td style="padding: 12px 0; font-size: 13px; color: #0a0a0a; border-top: 1px solid #f0f0f0;">
              ${budget}
            </td>
          </tr>` : ""}
        </table>

        <!-- Project Narrative -->
        <div style="margin-top: 28px;">
          <div style="font-size: 10px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; color: #171717; margin-bottom: 12px; border-bottom: 1px solid #171717; padding-bottom: 6px;">
            PROJECT NARRATIVE & SITE PARAMETERS
          </div>
          <div style="background-color: #f9f9f9; border-left: 3px solid #0a0a0a; padding: 18px 20px; font-size: 13px; line-height: 1.7; color: #262626;">
            ${formattedMessage}
          </div>
        </div>

        <!-- Quick Reply Callout -->
        <div style="margin-top: 32px; padding: 16px; background-color: #f5f5f5; border: 1px solid #e5e5e5; font-size: 12px; color: #525252;">
          <strong>Quick Action:</strong> Click <em>Reply</em> in your email client to respond directly to <strong>${fullName}</strong> (&lt;${email}&gt;).
        </div>
      </td>
    </tr>

    <!-- Routing Verification & Footer -->
    <tr>
      <td style="padding: 24px 36px; background-color: #fafafa; border-top: 1px solid #e5e5e5; font-size: 11px; color: #737373; line-height: 1.6;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td>
              <div style="font-family: monospace; font-size: 10px; color: #525252; margin-bottom: 6px;">
                ROUTING RECORD:
              </div>
              <div>Primary Recipient: <strong style="color: #171717;">rajesh@technoarchitecture.co.in</strong></div>
              <div>Permanent CC: <strong style="color: #171717;">enquiries@technoarchitecture.co.in</strong></div>
              <div>Direct Reply-To: <strong style="color: #171717;">${email}</strong></div>
            </td>
          </tr>
          <tr>
            <td style="padding-top: 16px; font-size: 10px; color: #a3a3a3; text-transform: uppercase; letter-spacing: 0.08em;">
              Techno Architecture &bull; No 9, Uttaradhi Mutt Road, Shankarpuram, Basavanagudi, Bengaluru 560004
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

/**
 * Plain-text fallback for maximum client compatibility and spam protection.
 */
function renderPlainText(payload: EnquiryEmailPayload, timestamp: string): string {
  const { fullName, email, phone, company, service, budget, message } = payload;
  return `
==================================================
TECHNO ARCHITECTURE STUDIO - NEW PROJECT ENQUIRY
==================================================
Date: ${timestamp}

CLIENT & SITE DOSSIER:
- Full Name: ${fullName}
- Email: ${email}
- Phone: ${phone || "Not provided"}
- Company / Org: ${company || "Not provided"}
- Discipline / Scope: ${service || "General Architecture & Design Enquiry"}
${budget ? `- Budget Parameter: ${budget}\n` : ""}

PROJECT NARRATIVE & SITE PARAMETERS:
--------------------------------------------------
${message || "No narrative provided"}
--------------------------------------------------

ROUTING DETAILS:
- Primary To: rajesh@technoarchitecture.co.in
- Permanent CC: enquiries@technoarchitecture.co.in
- Reply-To: ${fullName} <${email}>

Techno Architecture Studio, Bengaluru
==================================================
  `.trim();
}

/**
 * Dispatches the enquiry email notification to rajesh@technoarchitecture.co.in
 * with permanent CC to enquiries@technoarchitecture.co.in.
 */
export async function sendEnquiryNotification(payload: EnquiryEmailPayload): Promise<MailerResult> {
  const timestamp = payload.createdAt || new Date().toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    dateStyle: "full",
    timeStyle: "medium",
  });

  const primaryTo = process.env.PRIMARY_TO_EMAIL || DEFAULT_PRIMARY_TO;
  const permanentCc = process.env.PERMANENT_CC_EMAIL || DEFAULT_PERMANENT_CC;
  const senderUser = process.env.SMTP_USER || DEFAULT_SMTP_USER;

  try {
    const transporter = getTransporter();

    const mailOptions = {
      from: `"Techno Architecture Studio" <${senderUser}>`,
      to: primaryTo,
      cc: permanentCc,
      replyTo: `${payload.fullName} <${payload.email}>`,
      subject: `New Project Enquiry: ${payload.fullName} — Techno Architecture`,
      text: renderPlainText(payload, timestamp),
      html: renderHtmlTemplate(payload, timestamp),
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("Enquiry email successfully dispatched via SMTP:", {
      messageId: info.messageId,
      to: primaryTo,
      cc: permanentCc,
      replyTo: payload.email,
    });

    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error: any) {
    console.error("Failed to dispatch enquiry email via SMTP:", {
      error: error?.message || error,
      code: error?.code,
    });
    return {
      success: false,
      error: error?.message || "Failed to send email notification",
    };
  }
}
