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
import staticCmsContent from "@/data/cms-content.json";

export const dynamic = "force-dynamic";

const DATA_FILE_PATH = path.join(process.cwd(), "src", "data", "cms-content.json");
const TMP_FILE_PATH = path.join("/tmp", "cms-content.json");

// Dedicated cloud KV bucket for zero-config persistence on Vercel/serverless
const KVDB_BUCKET_ID = process.env.KVDB_BUCKET_ID || "p9uN8c3T84jL1K2x9Z7a";

// In-memory store on globalThis to survive serverless warm invocations
declare global {
  // eslint-disable-next-line no-var
  var __techno_cms_store__: any;
}

function getDefaultData() {
  const seed = (staticCmsContent as any) || {};
  return {
    projects: seed.projects || initialProjects,
    services: seed.services || initialServices,
    team: seed.team || initialTeam,
    blog: seed.blog || initialBlogPosts,
    faq: seed.faq || initialFAQs,
    gallery: seed.gallery || initialGalleryItems,
    recognitions: seed.recognitions || initialRecognitions,
    siteSettings: seed.siteSettings || initialSiteSettings,
    testimonials: seed.testimonials || initialTestimonials,
    // Baseline static timestamp marked as default seed so client edits are NEVER overwritten
    updatedAt: seed.updatedAt || "2024-01-01T00:00:00.000Z",
    isDefault: true,
  };
}

// -------------------------------------------------------------
// CLOUD STORAGE ADAPTERS (Upstash KV / Vercel KV / GitHub / KVdb)
// -------------------------------------------------------------

async function getFromUpstashKV(): Promise<any | null> {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  try {
    const res = await fetch(`${url}/get/techno_cms_data`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (res.ok) {
      const json = await res.json();
      if (json && json.result) {
        const parsed = typeof json.result === "string" ? JSON.parse(json.result) : json.result;
        if (parsed && typeof parsed === "object") return parsed;
      }
    }
  } catch (e) {
    console.warn("Upstash KV read notice:", e);
  }
  return null;
}

async function saveToUpstashKV(data: any): Promise<boolean> {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return false;
  try {
    const res = await fetch(`${url}/set/techno_cms_data`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(typeof data === "string" ? data : JSON.stringify(data)),
    });
    return res.ok;
  } catch (e) {
    console.warn("Upstash KV save notice:", e);
    return false;
  }
}

async function getFromCloudKV(): Promise<any | null> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2500);
    const res = await fetch(`https://kvdb.io/${KVDB_BUCKET_ID}/techno_cms_content`, {
      cache: "no-store",
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (res.ok) {
      const json = await res.json();
      if (json && typeof json === "object" && json.updatedAt) {
        return json;
      }
    }
  } catch (_) {}
  return null;
}

async function saveToCloudKV(data: any): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);
    const res = await fetch(`https://kvdb.io/${KVDB_BUCKET_ID}/techno_cms_content`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      signal: controller.signal,
    });
    clearTimeout(timeout);
    return res.ok;
  } catch (_) {
    return false;
  }
}

async function saveToGitHub(data: any): Promise<boolean> {
  const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
  const repo = process.env.GITHUB_REPOSITORY || "Kima1011/Techno-Architecture";
  const filePath = "src/data/cms-content.json";
  if (!token) return false;

  try {
    const getRes = await fetch(`https://api.github.com/repos/${repo}/contents/${filePath}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.v3+json",
      },
      cache: "no-store",
    });

    let sha: string | undefined;
    if (getRes.ok) {
      const fileInfo = await getRes.json();
      sha = fileInfo.sha;
    }

    const contentStr = JSON.stringify(data, null, 2);
    const contentBase64 = Buffer.from(contentStr).toString("base64");

    const putRes = await fetch(`https://api.github.com/repos/${repo}/contents/${filePath}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.v3+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: `chore(cms): update studio content via admin portal [${new Date().toISOString()}]`,
        content: contentBase64,
        sha,
        branch: "main",
      }),
    });

    return putRes.ok;
  } catch (err) {
    console.warn("GitHub API commit error:", err);
    return false;
  }
}

// -------------------------------------------------------------
// READ & WRITE STORE
// -------------------------------------------------------------

async function readStore() {
  // 1. If in-memory store is already populated in this container, return a clone
  if (globalThis.__techno_cms_store__) {
    return JSON.parse(JSON.stringify(globalThis.__techno_cms_store__));
  }

  // Candidates for dataset
  const candidates: any[] = [];

  // 2. Try Upstash / Vercel KV if configured
  const upstashData = await getFromUpstashKV();
  if (upstashData && typeof upstashData === "object" && upstashData.updatedAt) {
    candidates.push(upstashData);
  }

  // 3. Try Cloud KV bucket
  const cloudData = await getFromCloudKV();
  if (cloudData && typeof cloudData === "object" && cloudData.updatedAt) {
    candidates.push(cloudData);
  }

  // 4. Try reading from /tmp (written in serverless environments like Vercel)
  try {
    const raw = await fs.readFile(TMP_FILE_PATH, "utf-8");
    const data = JSON.parse(raw);
    if (data && typeof data === "object" && data.updatedAt) {
      candidates.push(data);
    }
  } catch (_) {}

  // 5. Try reading from DATA_FILE_PATH (static or persistent disk)
  try {
    const raw = await fs.readFile(DATA_FILE_PATH, "utf-8");
    const data = JSON.parse(raw);
    if (data && typeof data === "object" && data.updatedAt) {
      candidates.push(data);
    }
  } catch (_) {}

  // 6. Statically bundled seed data from build
  const defaultData = getDefaultData();
  candidates.push(defaultData);

  // Pick candidate with newest updatedAt timestamp
  candidates.sort((a, b) => {
    const timeA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
    const timeB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
    return timeB - timeA;
  });

  const bestData = candidates[0] || defaultData;
  globalThis.__techno_cms_store__ = JSON.parse(JSON.stringify(bestData));
  return bestData;
}

async function writeStore(data: any) {
  // Always update in-memory store immediately
  globalThis.__techno_cms_store__ = JSON.parse(JSON.stringify(data));

  // Multi-tier parallel persistence
  await Promise.allSettled([
    // Tier 1: Local file (for local development & persistent hosting)
    (async () => {
      try {
        const dir = path.dirname(DATA_FILE_PATH);
        await fs.mkdir(dir, { recursive: true });
        await fs.writeFile(DATA_FILE_PATH, JSON.stringify(data, null, 2), "utf-8");
      } catch (_) {}
    })(),

    // Tier 2: /tmp file (for warm serverless execution)
    (async () => {
      try {
        await fs.writeFile(TMP_FILE_PATH, JSON.stringify(data, null, 2), "utf-8");
      } catch (_) {}
    })(),

    // Tier 3: Upstash / Vercel KV (if configured)
    saveToUpstashKV(data),

    // Tier 4: Cloud KV (zero-config persistence for Vercel)
    saveToCloudKV(data),

    // Tier 5: GitHub commit (if GITHUB_TOKEN configured)
    saveToGitHub(data),
  ]);
}

// -------------------------------------------------------------
// API ROUTE HANDLERS (GET & POST)
// -------------------------------------------------------------

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
      defaultData.updatedAt = new Date().toISOString();
      delete (defaultData as any).isDefault;
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
      delete (updated as any).isDefault;
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
      delete (current as any).isDefault;
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
