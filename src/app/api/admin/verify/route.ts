import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const cookieStore = cookies();
    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);
    const authHeader = request.headers.get("authorization") || request.headers.get("x-admin-token");
    const tokenFromHeader = authHeader?.replace(/^Bearer\s+/i, "");

    const tokenToVerify = sessionCookie?.value || tokenFromHeader;

    if (!tokenToVerify) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    const { valid, username } = verifySessionToken(tokenToVerify);

    if (!valid) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    return NextResponse.json({
      authenticated: true,
      username: username || "admin",
      token: tokenToVerify,
    });
  } catch (error) {
    console.error("Admin verify session error:", error);
    return NextResponse.json({ authenticated: false }, { status: 500 });
  }
}
