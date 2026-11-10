import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAnyAdminToken, SESSION_COOKIE_NAME } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const cookieStore = cookies();
    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);
    const authHeader = request.headers.get("authorization") || request.headers.get("x-admin-token");
    const tokenFromHeader = authHeader?.replace(/^Bearer\s+/i, "");

    const { valid, username, token: verifiedToken } = verifyAnyAdminToken([
      tokenFromHeader,
      request.headers.get("x-admin-token"),
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
