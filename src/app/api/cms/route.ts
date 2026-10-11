import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import fs from "fs/promises";
import path from "path";
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/lib/auth";
import { initialProjects } from "@/data/projects";
import { initialServices } from "@/data/services";
import { initialTeam } from "@/data/team";
import { BlogPost, initialBlogPosts } from "@/data/blog";
import { FAQItem, initialFAQs } from "@/data/faq";
import { GalleryItem, initialGalleryItems } from "@/data/gallery";
import { Recognition, initialRecognitions } from "@/data/recognitions";
import { SiteSettings, initialSiteSettings } from "@/data/siteSettings";
import { Testimonial, initialTestimonials } from "@/data/testimonials";
import staticCmsContent from "@/data/cms-content.json";
import { getFirestoreDb } from "@/lib/firebaseAdmin";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const DATA_FILE_PATH = path.join(process.cwd(), "src", "data", "cms-content.json");
// Use /tmp only in Vercel/serverless environments; use local project cache in dev to avoid writing to C:\tmp
const TMP_FILE_PATH = process.env.VERCEL
  ? path.join("/tmp", "cms-content.json")
  : path.join(process.cwd(), ".next", "cache", "cms-tmp.json");

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
// CLOUD STORAGE ADAPTERS (Upstash KV / Vercel KV / GitHub / Firestore)
// -------------------------------------------------------------

async function getFromUpstashKV(explicitUrl?: string, explicitToken?: string): Promise<any | null> {
  const url = explicitUrl || process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = explicitToken || process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
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
    console.warn("[CMS Store] Upstash KV read notice:", e);
  }
  return null;
}

async function saveToUpstashKV(data: any, explicitUrl?: string, explicitToken?: string): Promise<{ success: boolean; error?: string }> {
  const url = explicitUrl || process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = explicitToken || process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return { success: false, error: "Upstash KV credentials not configured." };
  try {
    const res = await fetch(`${url}/set/techno_cms_data`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(typeof data === "string" ? data : JSON.stringify(data)),
    });
    if (res.ok) {
      return { success: true };
    }
    const errText = await res.text();
    return { success: false, error: `Upstash returned HTTP ${res.status}: ${errText}` };
  } catch (e: any) {
    console.warn("[CMS Store] Upstash KV save notice:", e);
    return { success: false, error: e?.message || "Network error connecting to Upstash." };
  }
}

// Mutex and state to serialize GitHub commits and eliminate 409 SHA conflicts
let isGitHubCommitInProgress = false;
let pendingGitHubCommit: { data: any; token?: string; repo?: string } | null = null;

async function getFromGitHub(
  explicitToken?: string,
  explicitRepo?: string
): Promise<any | null> {
  const token = explicitToken || process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
  const repo = explicitRepo || process.env.GITHUB_REPOSITORY || "Kima1011/Techno-Architecture";
  const filePath = "src/data/cms-content.json";
  if (!token) return null;

  try {
    const res = await fetch(`https://api.github.com/repos/${repo}/contents/${filePath}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "Techno-Architecture-CMS",
      },
      cache: "no-store",
    });

    if (res.ok) {
      const json = await res.json();
      if (json && json.content) {
        const decoded = Buffer.from(json.content, "base64").toString("utf-8");
        const parsed = JSON.parse(decoded);
        if (parsed && typeof parsed === "object" && parsed.updatedAt) {
          return parsed;
        }
      }
    }
  } catch (e) {
    console.warn("[CMS Store] GitHub candidate fetch notice:", e);
  }
  return null;
}

async function saveToGitHub(
  data: any,
  explicitToken?: string,
  explicitRepo?: string
): Promise<{ success: boolean; sha?: string; error?: string }> {
  const token = explicitToken || process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
  const repo = explicitRepo || process.env.GITHUB_REPOSITORY || "Kima1011/Techno-Architecture";
  const filePath = "src/data/cms-content.json";
  if (!token) return { success: false, error: "GitHub Personal Access Token not provided." };

  // If a commit is already in progress, queue the latest data so we don't conflict
  if (isGitHubCommitInProgress) {
    pendingGitHubCommit = { data, token: explicitToken, repo: explicitRepo };
    return { success: true, sha: "queued" };
  }

  isGitHubCommitInProgress = true;

  try {
    const contentStr = JSON.stringify(data, null, 2);
    const contentBase64 = Buffer.from(contentStr).toString("base64");

    // Retry loop for 409 Conflict (up to 3 attempts with fresh SHA fetch)
    for (let attempt = 1; attempt <= 3; attempt++) {
      let sha: string | undefined;

      try {
        const getRes = await fetch(`https://api.github.com/repos/${repo}/contents/${filePath}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/vnd.github.v3+json",
            "User-Agent": "Techno-Architecture-CMS",
          },
          cache: "no-store",
        });

        if (getRes.ok) {
          const fileInfo = await getRes.json();
          sha = fileInfo.sha;
        } else if (getRes.status === 401 || getRes.status === 403) {
          return {
            success: false,
            error: `GitHub authorization failed (HTTP ${getRes.status}). Verify your token has 'repo' access.`,
          };
        }
      } catch (err: any) {
        if (attempt === 3) throw err;
      }

      const putRes = await fetch(`https://api.github.com/repos/${repo}/contents/${filePath}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github.v3+json",
          "Content-Type": "application/json",
          "User-Agent": "Techno-Architecture-CMS",
        },
        body: JSON.stringify({
          message: `chore(cms): update studio content via admin portal [${new Date().toISOString()}]`,
          content: contentBase64,
          sha,
          branch: "main",
        }),
      });

      if (putRes.ok) {
        const putData = await putRes.json();
        return { success: true, sha: putData.content?.sha };
      }

      if (putRes.status === 409 && attempt < 3) {
        // Conflict on SHA: wait 400ms and retry with fresh SHA
        await new Promise((r) => setTimeout(r, 400));
        continue;
      }

      const putErr = await putRes.text();
      return { success: false, error: `GitHub commit rejected (HTTP ${putRes.status}): ${putErr}` };
    }

    return { success: false, error: "Failed to commit to GitHub after 3 attempts." };
  } catch (err: any) {
    console.warn("[CMS Store] GitHub API commit error:", err);
    return { success: false, error: err?.message || "Network error connecting to GitHub API." };
  } finally {
    isGitHubCommitInProgress = false;

    // Process queued commit if another save came in while committing
    if (pendingGitHubCommit) {
      const next = pendingGitHubCommit;
      pendingGitHubCommit = null;
      setTimeout(() => {
        saveToGitHub(next.data, next.token, next.repo);
      }, 500);
    }
  }
}

// -------------------------------------------------------------
// READ & WRITE STORE
// -------------------------------------------------------------

async function readStore(
  customUpstashUrl?: string,
  customUpstashToken?: string,
  customGithubToken?: string,
  customGithubRepo?: string
) {
  // Candidates for dataset
  const candidates: any[] = [];

  // 1. In production serverless warm containers, return in-memory cache if available
  if (globalThis.__techno_cms_store__ && typeof globalThis.__techno_cms_store__ === "object" && globalThis.__techno_cms_store__.updatedAt) {
    candidates.push(JSON.parse(JSON.stringify(globalThis.__techno_cms_store__)));
  }

  // 2. Try GitHub remote (single cloud source of truth for persistent deployments across all visitors)
  try {
    const ghData = await getFromGitHub(customGithubToken, customGithubRepo);
    if (ghData && typeof ghData === "object" && ghData.updatedAt) {
      candidates.push(ghData);
    }
  } catch (e) {
    console.warn("[CMS Store] GitHub candidate read notice:", e);
  }

  // 3. Try Cloud Firestore (Tier 0 persistence if service account configured)
  try {
    const db = getFirestoreDb();
    if (db) {
      const doc = await db.collection("cms").doc("content").get();
      if (doc.exists) {
        const data = doc.data();
        if (data && typeof data === "object" && data.updatedAt) {
          candidates.push(data);
        }
      }
    }
  } catch (e) {
    console.warn("[CMS Store] Firestore read notice:", e);
  }

  // 4. Try Upstash / Vercel KV if configured
  const upstashData = await getFromUpstashKV(customUpstashUrl, customUpstashToken);
  if (upstashData && typeof upstashData === "object" && upstashData.updatedAt) {
    candidates.push(upstashData);
  }

  // 5. Try reading from DATA_FILE_PATH (static or persistent disk)
  try {
    const raw = await fs.readFile(DATA_FILE_PATH, "utf-8");
    const data = JSON.parse(raw);
    if (data && typeof data === "object" && data.updatedAt) {
      candidates.push(data);
    }
  } catch (_) {}

  // 6. Try reading from TMP_FILE_PATH (written in serverless environments like Vercel)
  try {
    const raw = await fs.readFile(TMP_FILE_PATH, "utf-8");
    const data = JSON.parse(raw);
    if (data && typeof data === "object" && data.updatedAt) {
      candidates.push(data);
    }
  } catch (_) {}

  // 7. Statically bundled seed data from build
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

export interface WriteStoreResult {
  localDisk: boolean;
  tmp: boolean;
  upstash: boolean;
  github: boolean;
  firestore: boolean;
  isPermanent: boolean;
  summaryMessage: string;
  errorDetails: string[];
}

async function writeStore(
  data: any,
  options?: {
    githubToken?: string;
    githubRepo?: string;
    upstashUrl?: string;
    upstashToken?: string;
  }
): Promise<WriteStoreResult> {
  // Always update in-memory store immediately
  globalThis.__techno_cms_store__ = JSON.parse(JSON.stringify(data));

  const result: WriteStoreResult = {
    localDisk: false,
    tmp: false,
    upstash: false,
    github: false,
    firestore: false,
    isPermanent: false,
    summaryMessage: "",
    errorDetails: [],
  };

  // Multi-tier parallel persistence
  const tasks = await Promise.allSettled([
    // Tier 0: Local file (for local development & persistent hosting)
    (async () => {
      try {
        const dir = path.dirname(DATA_FILE_PATH);
        await fs.mkdir(dir, { recursive: true });
        await fs.writeFile(DATA_FILE_PATH, JSON.stringify(data, null, 2), "utf-8");
        result.localDisk = true;
      } catch (err: any) {
        // Read-only filesystem is expected on Vercel runtime
        if (err?.code !== "EROFS") {
          result.errorDetails.push(`Local disk error: ${err?.message}`);
        }
      }
    })(),

    // Tier 1: Cloud Firestore (if configured)
    (async () => {
      try {
        const db = getFirestoreDb();
        if (db) {
          await db.collection("cms").doc("content").set(data);
          result.firestore = true;
        }
      } catch (e: any) {
        console.warn("[CMS Store] Firestore write notice:", e);
        result.errorDetails.push(`Firestore: ${e?.message}`);
      }
    })(),

    // Tier 2: Upstash / Vercel KV (if configured or provided by admin)
    (async () => {
      const upstashRes = await saveToUpstashKV(data, options?.upstashUrl, options?.upstashToken);
      if (upstashRes.success) {
        result.upstash = true;
      } else if (options?.upstashUrl) {
        result.errorDetails.push(`Upstash: ${upstashRes.error}`);
      }
    })(),

    // Tier 3: GitHub direct commit (if configured or provided by admin)
    (async () => {
      const ghRes = await saveToGitHub(data, options?.githubToken, options?.githubRepo);
      if (ghRes.success) {
        result.github = true;
      } else if (options?.githubToken || process.env.GITHUB_TOKEN || process.env.GH_TOKEN) {
        result.errorDetails.push(`GitHub: ${ghRes.error}`);
      }
    })(),

    // Tier 4: /tmp or local cache file (for warm serverless execution)
    (async () => {
      try {
        const dir = path.dirname(TMP_FILE_PATH);
        await fs.mkdir(dir, { recursive: true });
        await fs.writeFile(TMP_FILE_PATH, JSON.stringify(data, null, 2), "utf-8");
        result.tmp = true;
      } catch (err: any) {
        result.errorDetails.push(`Temp cache error: ${err?.message}`);
      }
    })(),
  ]);

  // Determine if persistence is 100% permanent
  result.isPermanent = result.localDisk || result.github || result.upstash || result.firestore;

  if (result.github) {
    result.summaryMessage = "Committed permanently to GitHub repository (triggers production redeploy).";
  } else if (result.upstash) {
    result.summaryMessage = "Saved permanently to Upstash cloud key-value store.";
  } else if (result.firestore) {
    result.summaryMessage = "Saved permanently to Cloud Firestore.";
  } else if (result.localDisk) {
    result.summaryMessage = "Saved permanently to src/data/cms-content.json on disk.";
  } else {
    result.summaryMessage =
      "Saved to temporary serverless memory (/tmp). Notice: Changes will reset when the serverless function restarts. Connect GitHub or Upstash in Settings for 100% permanent cloud persistence across all visitors.";
  }

  return result;
}

// -------------------------------------------------------------
// API ROUTE HANDLERS (GET & POST)
// -------------------------------------------------------------

// GET: Public endpoint for live website data hydration
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const customUpstashUrl = request.headers.get("x-upstash-url") || url.searchParams.get("upstashUrl") || undefined;
    const customUpstashToken = request.headers.get("x-upstash-token") || url.searchParams.get("upstashToken") || undefined;
    const customGithubToken = request.headers.get("x-github-token") || url.searchParams.get("githubToken") || undefined;
    const customGithubRepo = request.headers.get("x-github-repo") || url.searchParams.get("githubRepo") || undefined;

    const data = await readStore(customUpstashUrl, customUpstashToken, customGithubToken, customGithubRepo);

    // Attach read-only metadata about storage health
    const storageInfo = {
      isVercel: Boolean(process.env.VERCEL),
      isProduction: process.env.NODE_ENV === "production",
      hasGitHubToken: Boolean(process.env.GITHUB_TOKEN || process.env.GH_TOKEN),
      hasUpstashKV: Boolean(process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL),
      hasFirestore: Boolean(getFirestoreDb()),
      localDiskWritable: process.env.NODE_ENV !== "production" || !process.env.VERCEL,
    };

    return NextResponse.json(
      {
        ...data,
        _storageInfo: storageInfo,
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      }
    );
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

    // Extract optional client-provided tokens from headers or request body
    const githubToken = request.headers.get("x-github-token") || body.githubToken;
    const githubRepo = request.headers.get("x-github-repo") || body.githubRepo;
    const upstashUrl = request.headers.get("x-upstash-url") || body.upstashUrl;
    const upstashToken = request.headers.get("x-upstash-token") || body.upstashToken;

    const storageOptions = {
      githubToken: githubToken || undefined,
      githubRepo: githubRepo || undefined,
      upstashUrl: upstashUrl || undefined,
      upstashToken: upstashToken || undefined,
    };

    // Action: Test credentials
    if (body.action === "test-connection") {
      const results: any = {};
      if (githubToken) {
        const ghTest = await saveToGitHub({ _test: true }, githubToken, githubRepo);
        results.github = ghTest;
      }
      if (upstashUrl && upstashToken) {
        const upTest = await saveToUpstashKV({ _test: true }, upstashUrl, upstashToken);
        results.upstash = upTest;
      }
      return NextResponse.json({ success: true, results });
    }

    const current = await readStore(upstashUrl, upstashToken, githubToken, githubRepo);

    if (body.reset === true) {
      const defaultData = getDefaultData();
      defaultData.updatedAt = new Date().toISOString();
      delete (defaultData as any).isDefault;
      delete (defaultData as any)._storageInfo;
      const storageStatus = await writeStore(defaultData, storageOptions);
      return NextResponse.json({
        success: true,
        message: "All data reset to initial seed defaults.",
        storageStatus,
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
      delete (updated as any)._storageInfo;
      const storageStatus = await writeStore(updated, storageOptions);
      return NextResponse.json({
        success: true,
        message: storageStatus.summaryMessage,
        storageStatus,
        data: updated,
        updatedAt: updated.updatedAt,
      });
    }

    if (body.entity && body.data !== undefined) {
      current[body.entity] = body.data;
      current.updatedAt = new Date().toISOString();
      delete (current as any).isDefault;
      delete (current as any)._storageInfo;
      const storageStatus = await writeStore(current, storageOptions);
      return NextResponse.json({
        success: true,
        entity: body.entity,
        data: current,
        message: storageStatus.summaryMessage,
        storageStatus,
        updatedAt: current.updatedAt,
      });
    }

    return NextResponse.json({ error: "Invalid request payload format." }, { status: 400 });
  } catch (error: any) {
    console.error("POST /api/cms error:", error);
    return NextResponse.json({ error: "Internal server error saving CMS data." }, { status: 500 });
  }
}
