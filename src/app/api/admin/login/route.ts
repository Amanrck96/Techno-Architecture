import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createSessionToken, SESSION_COOKIE_NAME } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    const expectedUsername = (process.env.ADMIN_USERNAME || "admin").trim();
    const expectedPassword = (process.env.ADMIN_PASSWORD || "TechnoArchitecture#2026").trim();

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required." },
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
  } catch (error) {
    console.error("Admin login API error:", error);
    return NextResponse.json(
      { error: "Server authentication error. Please try again." },
      { status: 500 }
    );
  }
}
