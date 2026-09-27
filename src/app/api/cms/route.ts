import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import fs from "fs/promises";
import path from "path";
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/lib/auth";
import { initialProjects } from "@/data/projects";
import { initialServices } from "@/data/services";
import { initialTeam } from "@/data/team";
import { initialBlogPosts } from "@/data/blog";
import { initialFAQs } from "@/data/faq";
import { initialGalleryItems } from "@/data/gallery";
import { initialRecognitions } from "@/data/recognitions";
import { initialSiteSettings } from "@/data/siteSettings";
import { initialTestimonials } from "@/data/testimonials";

export const dynamic = "force-dynamic";

const DATA_FILE_PATH = path.join(process.cwd(), "src", "data", "cms-content.json");
const TMP_FILE_PATH = path.join("/tmp", "cms-content.json");

// In-memory store on globalThis to survive serverless warm invocations
declare global {
  // eslint-disable-next-line no-var
  var __techno_cms_store__: any;
}

function getDefaultData() {
  return {
    projects: initialProjects,
    services: initialServices,
    team: initialTeam,
    blog: initialBlogPosts,
    faq: initialFAQs,
    gallery: initialGalleryItems,
    recognitions: initialRecognitions,
    siteSettings: initialSiteSettings,
    testimonials: initialTestimonials,
    updatedAt: new Date().toISOString(),
  };
}

async function readStore() {
  // 1. If in-memory store is populated, return a clone
  if (globalThis.__techno_cms_store__) {
    return JSON.parse(JSON.stringify(globalThis.__techno_cms_store__));
  }

  // 2. Try reading from /tmp (written in serverless environments like Vercel)
  try {
    const raw = await fs.readFile(TMP_FILE_PATH, "utf-8");
    const data = JSON.parse(raw);
    if (data && typeof data === "object") {
      globalThis.__techno_cms_store__ = data;
      return JSON.parse(JSON.stringify(data));
    }
  } catch (_) {}

  // 3. Try reading from DATA_FILE_PATH (static or persistent disk)
  try {
    const raw = await fs.readFile(DATA_FILE_PATH, "utf-8");
    const data = JSON.parse(raw);
    if (data && typeof data === "object") {
      if (Array.isArray(data.team)) {
        const rajeshOnly = data.team
          .filter((m: any) => m.name?.toLowerCase().includes("rajesh"))
          .map((m: any) => ({ ...m, image: "" }));
        data.team = rajeshOnly.length > 0 ? rajeshOnly : initialTeam;
      }
      globalThis.__techno_cms_store__ = data;
      return JSON.parse(JSON.stringify(data));
    }
  } catch (err: any) {
    if (err.code !== "ENOENT") {
      console.warn("Notice reading CMS store file:", err?.message);
    }
  }

  // 4. Fallback to default initial seed data
  const defaultData = getDefaultData();
  globalThis.__techno_cms_store__ = defaultData;
  return defaultData;
}

async function writeStore(data: any) {
  // Always update in-memory store
  globalThis.__techno_cms_store__ = JSON.parse(JSON.stringify(data));

  // Try writing to DATA_FILE_PATH (works in development & persistent environments)
  let wroteToDataFile = false;
  try {
    const dir = path.dirname(DATA_FILE_PATH);
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(DATA_FILE_PATH, JSON.stringify(data, null, 2), "utf-8");
    wroteToDataFile = true;
  } catch (err: any) {
    // Expected on read-only serverless platforms like Vercel
  }

  // Also write to /tmp/cms-content.json (always writable in AWS Lambda / Vercel Serverless)
  try {
    await fs.writeFile(TMP_FILE_PATH, JSON.stringify(data, null, 2), "utf-8");
  } catch (tmpErr) {
    if (!wroteToDataFile) {
      console.warn("Notice writing to /tmp:", tmpErr);
    }
  }
}

// GET: Public endpoint for live website data hydration
export async function GET() {
  try {
    const data = await readStore();
    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
  } catch (error) {
    console.error("GET /api/cms error:", error);
    return NextResponse.json(getDefaultData(), { status: 200 });
  }
}

// POST: Admin endpoint for live persistent updates
export async function POST(request: Request) {
  try {
    // 1. Verify admin session cookie OR Authorization / x-admin-token header
    const cookieStore = cookies();
    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);
    const authHeader = request.headers.get("authorization") || request.headers.get("x-admin-token");
    const tokenFromHeader = authHeader?.replace(/^Bearer\s+/i, "");

    const tokenToVerify = sessionCookie?.value || tokenFromHeader;

    if (!tokenToVerify) {
      return NextResponse.json({ error: "Unauthorized: Admin session required." }, { status: 401 });
    }

    const { valid } = verifySessionToken(tokenToVerify);
    if (!valid) {
      return NextResponse.json({ error: "Unauthorized: Invalid or expired admin session." }, { status: 401 });
    }

    // 2. Parse payload
    const body = await request.json();
    const current = await readStore();

    if (body.reset === true) {
      const defaultData = getDefaultData();
      await writeStore(defaultData);
      return NextResponse.json({
        success: true,
        message: "All data reset to initial seed defaults.",
        data: defaultData,
        updatedAt: defaultData.updatedAt,
      });
    }

    if (body.allData) {
      const updated = {
        ...current,
        ...body.allData,
        updatedAt: new Date().toISOString(),
      };
      await writeStore(updated);
      return NextResponse.json({
        success: true,
        message: "Full store updated permanently.",
        data: updated,
        updatedAt: updated.updatedAt,
      });
    }

    if (body.entity && body.data !== undefined) {
      current[body.entity] = body.data;
      current.updatedAt = new Date().toISOString();
      await writeStore(current);
      return NextResponse.json({
        success: true,
        entity: body.entity,
        message: `Entity "${body.entity}" updated permanently.`,
        updatedAt: current.updatedAt,
      });
    }

    return NextResponse.json({ error: "Invalid request payload format." }, { status: 400 });
  } catch (error: any) {
    console.error("POST /api/cms error:", error);
    return NextResponse.json({ error: "Internal server error saving CMS data." }, { status: 500 });
  }
}
