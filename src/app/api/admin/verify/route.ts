import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const cookieStore = cookies();
    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);

    if (!sessionCookie || !sessionCookie.value) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    const { valid, username } = verifySessionToken(sessionCookie.value);

    if (!valid) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    return NextResponse.json({
      authenticated: true,
      username: username || "admin",
    });
  } catch (error) {
    console.error("Admin verify session error:", error);
    return NextResponse.json({ authenticated: false }, { status: 500 });
  }
}
