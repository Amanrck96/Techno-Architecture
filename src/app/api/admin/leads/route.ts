import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/lib/auth";
import { getAllLeads, updateLeadStatus } from "@/lib/leadsStore";

export const dynamic = "force-dynamic";

// ───── Auth helper (aligned with official verifySessionToken) ─────
function isAdminAuthorized(request: Request): boolean {
  const cookieStore = cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  const authHeader =
    request.headers.get("authorization") ||
    request.headers.get("Authorization") ||
    "";
  const xToken = request.headers.get("x-admin-token") || "";
  const tokenFromHeader = authHeader.replace(/^Bearer\s+/i, "").trim() || xToken.trim();

  const tokenToVerify = sessionCookie || tokenFromHeader;
  if (!tokenToVerify) return false;

  // 1. Direct password match fallback (only if ADMIN_PASSWORD is set in env)
  const adminPassword = process.env.ADMIN_PASSWORD?.trim();
  if (adminPassword && tokenToVerify === adminPassword) {
    return true;
  }

  // 2. HMAC session token verification
  const { valid } = verifySessionToken(tokenToVerify);
  return valid;
}

export async function GET(request: Request) {
  if (!isAdminAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const leads = await getAllLeads();
    return NextResponse.json({ leads }, { status: 200 });
  } catch (err: any) {
    console.error("Leads API error:", err);
    return NextResponse.json(
      { error: "Failed to fetch leads.", detail: err?.message },
      { status: 500 }
    );
  }
}

// PATCH — update lead status (new → reviewed → archived)
export async function PATCH(request: Request) {
  if (!isAdminAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id, status } = await request.json();
    if (!id || !status) {
      return NextResponse.json(
        { error: "Missing id or status." },
        { status: 422 }
      );
    }

    const updated = await updateLeadStatus(id, status);
    if (!updated) {
      return NextResponse.json({ error: "Lead not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Failed to update lead.", detail: err?.message },
      { status: 500 }
    );
  }
}
