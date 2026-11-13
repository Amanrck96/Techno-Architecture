import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAnyAdminToken, createSessionToken, SESSION_COOKIE_NAME } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const cookieStore = cookies();
    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);
    const authHeader = request.headers.get("authorization") || request.headers.get("x-admin-token");
    const tokenFromHeader = authHeader?.replace(/^Bearer\s+/i, "")?.trim();
    const xToken = request.headers.get("x-admin-token")?.trim();

    // 1. Direct password match check
    const adminPassword = (process.env.ADMIN_PASSWORD || process.env.ADMIN_PASS || "TechnoArchitecture#2026").trim();
    if (
      adminPassword &&
      (tokenFromHeader === adminPassword ||
        xToken === adminPassword ||
        sessionCookie?.value === adminPassword)
    ) {
      const freshToken = createSessionToken("admin");
      return NextResponse.json({
        authenticated: true,
        username: "admin",
        token: freshToken,
      });
    }

    // 2. Multi-candidate HMAC session token verification
    const { valid, username, token: verifiedToken } = verifyAnyAdminToken([
      tokenFromHeader,
      xToken,
      sessionCookie?.value,
    ]);

    if (!valid) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    return NextResponse.json({
      authenticated: true,
      username: username || "admin",
      token: verifiedToken || tokenFromHeader || sessionCookie?.value,
    });
  } catch (error) {
    console.error("Admin verify session error:", error);
    return NextResponse.json({ authenticated: false }, { status: 500 });
  }
}
