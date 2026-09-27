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
  try {
    const raw = await fs.readFile(DATA_FILE_PATH, "utf-8");
    return JSON.parse(raw);
  } catch (err: any) {
    if (err.code === "ENOENT") {
      const defaultData = getDefaultData();
      await fs.writeFile(DATA_FILE_PATH, JSON.stringify(defaultData, null, 2), "utf-8");
      return defaultData;
    }
    console.error("Error reading CMS store file:", err);
    return getDefaultData();
  }
}

async function writeStore(data: any) {
  const dir = path.dirname(DATA_FILE_PATH);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(DATA_FILE_PATH, JSON.stringify(data, null, 2), "utf-8");
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
    // 1. Verify admin session cookie
    const cookieStore = cookies();
    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);

    if (!sessionCookie || !sessionCookie.value) {
      return NextResponse.json({ error: "Unauthorized: Admin session required." }, { status: 401 });
    }

    const { valid } = verifySessionToken(sessionCookie.value);
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
      });
    }

    if (body.allData) {
      const updated = {
        ...current,
        ...body.allData,
        updatedAt: new Date().toISOString(),
      };
      await writeStore(updated);
      return NextResponse.json({ success: true, message: "Full store updated permanently.", data: updated });
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
