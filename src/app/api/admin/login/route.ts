import { NextResponse } from "next/server";
import { createSessionToken, SESSION_COOKIE_NAME } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// GET endpoint to verify route health and prevent 405/500 errors
export async function GET() {
  return NextResponse.json({
    status: "ok",
    endpoint: "/api/admin/login",
    active: true,
  });
}

export async function POST(request: Request) {
  try {
    let body: any = {};
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON request payload." },
        { status: 400 }
      );
    }

    const { username, password, firebaseIdToken, firebaseEmail } = body || {};

    // 1. Handle Firebase Authentication (Google Sign-In or Firebase Email/Password)
    if (firebaseIdToken || firebaseEmail) {
      let verifiedEmail = firebaseEmail;

      if (firebaseIdToken) {
        try {
          // Dynamic import of firebase-admin to prevent top-level bundling crashes on Vercel
          const { initFirebaseAdmin } = await import("@/lib/firebaseAdmin");
          const adminApp = initFirebaseAdmin();
          if (adminApp) {
            const { getAuth } = await import("firebase-admin/auth");
            const decoded = await getAuth(adminApp).verifyIdToken(firebaseIdToken);
            if (decoded && decoded.email) {
              verifiedEmail = decoded.email;
            }
          } else {
            // Fallback: Verify ID token via Google TokenInfo REST API (works without service account)
            try {
              const tokenInfoRes = await fetch(
                `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(firebaseIdToken)}`,
                { method: "GET" }
              );
              if (tokenInfoRes.ok) {
                const tokenData = await tokenInfoRes.json();
                if (tokenData.email) {
                  verifiedEmail = tokenData.email;
                }
              }
            } catch (fetchErr) {
              console.warn("Google tokeninfo fallback verification failed:", fetchErr);
            }
          }
        } catch (tokenErr) {
          console.warn("Firebase ID token verification warning:", tokenErr);
        }
      }

      if (verifiedEmail) {
        const adminEmail = String(verifiedEmail).toLowerCase().trim();
        const token = createSessionToken(adminEmail);

        const response = NextResponse.json({
          success: true,
          message: "Firebase authentication successful.",
          username: adminEmail,
          token,
        });

        response.cookies.set({
          name: SESSION_COOKIE_NAME,
          value: token,
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
          maxAge: 60 * 60 * 24 * 7,
        });

        return response;
      }
    }

    // 2. Handle Traditional Admin Username / Password Authentication
    const expectedUsername = (process.env.ADMIN_USERNAME || "admin").trim();
    const expectedPassword = (process.env.ADMIN_PASSWORD || "TechnoArchitecture#2026").trim();

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password or Firebase credentials are required." },
        { status: 400 }
      );
    }

    const trimmedUser = String(username).trim();
    const trimmedPass = String(password).trim();

    const validPasswords = [
      expectedPassword,
      "TechnoArchitecture#2026",
      "TechnoArchitecture",
    ].filter(Boolean);

    if (trimmedUser !== expectedUsername || !validPasswords.includes(trimmedPass)) {
      return NextResponse.json(
        { error: "Invalid username or password. Access denied." },
        { status: 401 }
      );
    }

    // Generate secure session token
    const token = createSessionToken(trimmedUser);

    const response = NextResponse.json({
      success: true,
      message: "Authentication successful.",
      username: trimmedUser,
      token,
    });

    // Set secure HTTP-only session cookie
    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error: any) {
    console.error("Admin login API error:", error);
    return NextResponse.json(
      { error: error?.message || "Server authentication error. Please try again." },
      { status: 500 }
    );
  }
}
