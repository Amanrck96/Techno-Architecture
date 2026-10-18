import fs from "fs/promises";
import path from "path";
import staticCmsContent from "@/data/cms-content.json";
import { initialProjects } from "@/data/projects";
import { initialServices } from "@/data/services";
import { initialTeam } from "@/data/team";
import { initialBlogPosts } from "@/data/blog";
import { initialFAQs } from "@/data/faq";
import { initialGalleryItems } from "@/data/gallery";
import { initialRecognitions } from "@/data/recognitions";
import { initialSiteSettings } from "@/data/siteSettings";
import { initialTestimonials } from "@/data/testimonials";
import { getFirestoreDb } from "@/lib/firebaseAdmin";

export const DATA_FILE_PATH = path.join(process.cwd(), "src", "data", "cms-content.json");
export const TMP_FILE_PATH = process.env.VERCEL
  ? path.join("/tmp", "cms-content.json")
  : path.join(process.cwd(), ".next", "cache", "cms-tmp.json");

declare global {
  // eslint-disable-next-line no-var
  var __techno_cms_store__: any;
}

// Universal filter to ensure any deleted item NEVER appears
export function filterOutDeletedItems<T = any>(
  items: T[],
  deletedIds: string[] = []
): T[] {
  if (!Array.isArray(items)) return [];
  if (!deletedIds || deletedIds.length === 0) return items;
  const set = new Set(deletedIds.map((s) => String(s).toLowerCase().trim()));
  return items.filter((item: any) => {
    if (!item) return false;
    if (item.id && set.has(String(item.id).toLowerCase().trim())) return false;
    if (item.slug && set.has(String(item.slug).toLowerCase().trim())) return false;
    return true;
  });
}

export function getDefaultData(): any {
  const seed = (staticCmsContent as any) || {};
  const deletedIds: string[] = Array.isArray(seed.deletedIds) ? seed.deletedIds : [];
  return {
    projects: filterOutDeletedItems(seed.projects || initialProjects, deletedIds),
    services: filterOutDeletedItems(seed.services || initialServices, deletedIds),
    team: filterOutDeletedItems(seed.team || initialTeam, deletedIds),
    blog: filterOutDeletedItems(seed.blog || initialBlogPosts, deletedIds),
    faq: filterOutDeletedItems(seed.faq || initialFAQs, deletedIds),
    gallery: filterOutDeletedItems(seed.gallery || initialGalleryItems, deletedIds),
    recognitions: filterOutDeletedItems(seed.recognitions || initialRecognitions, deletedIds),
    siteSettings: seed.siteSettings || initialSiteSettings,
    testimonials: filterOutDeletedItems(seed.testimonials || initialTestimonials, deletedIds),
    deletedIds,
    updatedAt: seed.updatedAt || "2024-01-01T00:00:00.000Z",
    isDefault: true,
  };
}

// -------------------------------------------------------------
// CLOUD STORAGE ADAPTERS (Upstash KV / GitHub / Firestore)
// -------------------------------------------------------------

export async function getFromUpstashKV(explicitUrl?: string, explicitToken?: string): Promise<any | null> {
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
    console.warn("[CMS Server] Upstash KV read notice:", e);
  }
  return null;
}

export async function saveToUpstashKV(
  data: any,
  explicitUrl?: string,
  explicitToken?: string
): Promise<{ success: boolean; error?: string }> {
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
    console.warn("[CMS Server] Upstash KV save notice:", e);
    return { success: false, error: e?.message || "Network error connecting to Upstash." };
  }
}

let isGitHubCommitInProgress = false;
let pendingGitHubCommit: { data: any; token?: string; repo?: string } | null = null;

export async function getFromGitHub(explicitToken?: string, explicitRepo?: string): Promise<any | null> {
  const token = explicitToken || process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
  const repo = explicitRepo || process.env.GITHUB_REPOSITORY || "Kima1011/Techno-Architecture";
  const filePath = "src/data/cms-content.json";
  if (!token) return null;

  try {
    // Timeout of 2.5s to prevent blocking SSR
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 2500);

    const res = await fetch(`https://api.github.com/repos/${repo}/contents/${filePath}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "Techno-Architecture-CMS",
      },
      cache: "no-store",
      signal: controller.signal,
    });
    clearTimeout(timer);

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
    // console.warn notice
  }
  return null;
}

export async function saveToGitHub(
  data: any,
  explicitToken?: string,
  explicitRepo?: string
): Promise<{ success: boolean; sha?: string; error?: string }> {
  const token = explicitToken || process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
  const repo = explicitRepo || process.env.GITHUB_REPOSITORY || "Kima1011/Techno-Architecture";
  const filePath = "src/data/cms-content.json";
  if (!token) return { success: false, error: "GitHub Personal Access Token not provided." };

  if (isGitHubCommitInProgress) {
    pendingGitHubCommit = { data, token: explicitToken, repo: explicitRepo };
    return { success: true, sha: "queued" };
  }

  isGitHubCommitInProgress = true;

  try {
    const contentStr = JSON.stringify(data, null, 2);
    const contentBase64 = Buffer.from(contentStr).toString("base64");

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
        await new Promise((r) => setTimeout(r, 400));
        continue;
      }

      const putErr = await putRes.text();
      return { success: false, error: `GitHub commit rejected (HTTP ${putRes.status}): ${putErr}` };
    }

    return { success: false, error: "Failed to commit to GitHub after 3 attempts." };
  } catch (err: any) {
    console.warn("[CMS Server] GitHub API commit error:", err);
    return { success: false, error: err?.message || "Network error connecting to GitHub API." };
  } finally {
    isGitHubCommitInProgress = false;

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

export async function readStore(
  customUpstashUrl?: string,
  customUpstashToken?: string,
  customGithubToken?: string,
  customGithubRepo?: string
): Promise<any> {
  const candidates: any[] = [];

  // 1. In-memory store (fastest, survives warm invocations)
  if (
    globalThis.__techno_cms_store__ &&
    typeof globalThis.__techno_cms_store__ === "object" &&
    globalThis.__techno_cms_store__.updatedAt
  ) {
    candidates.push(JSON.parse(JSON.stringify(globalThis.__techno_cms_store__)));
  }

  // 2. Cloud Firestore (Tier 0 persistence if service account configured)
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
    // Firestore read notice
  }

  // 3. Upstash KV
  try {
    const upstashData = await getFromUpstashKV(customUpstashUrl, customUpstashToken);
    if (upstashData && typeof upstashData === "object" && upstashData.updatedAt) {
      candidates.push(upstashData);
    }
  } catch (_) {}

  // 4. GitHub remote
  try {
    const ghData = await getFromGitHub(customGithubToken, customGithubRepo);
    if (ghData && typeof ghData === "object" && ghData.updatedAt) {
      candidates.push(ghData);
    }
  } catch (_) {}

  // 5. Local file on disk
  try {
    const raw = await fs.readFile(DATA_FILE_PATH, "utf-8");
    const data = JSON.parse(raw);
    if (data && typeof data === "object" && data.updatedAt) {
      candidates.push(data);
    }
  } catch (_) {}

  // 6. Temp cache file
  try {
    const raw = await fs.readFile(TMP_FILE_PATH, "utf-8");
    const data = JSON.parse(raw);
    if (data && typeof data === "object" && data.updatedAt) {
      candidates.push(data);
    }
  } catch (_) {}

  // 7. Seed defaults
  const defaultData = getDefaultData();
  candidates.push(defaultData);

  // Collect ALL deleted IDs across all storage tiers to guarantee deletions are NEVER lost
  const allDeletedIds = new Set<string>();
  candidates.forEach((c) => {
    if (Array.isArray(c.deletedIds)) {
      c.deletedIds.forEach((id: string) => allDeletedIds.add(id));
    }
  });

  // Pick candidate with newest updatedAt timestamp
  candidates.sort((a, b) => {
    const timeA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
    const timeB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
    return timeB - timeA;
  });

  const bestData = candidates[0] || defaultData;
  const mergedDeletedIds = Array.from(allDeletedIds);

  // Apply strict deletedIds filtering to guarantee deleted items NEVER appear
  const cleanData = {
    ...bestData,
    deletedIds: mergedDeletedIds,
    projects: filterOutDeletedItems(bestData.projects || [], mergedDeletedIds),
    services: filterOutDeletedItems(bestData.services || [], mergedDeletedIds),
    team: filterOutDeletedItems(bestData.team || [], mergedDeletedIds),
    blog: filterOutDeletedItems(bestData.blog || [], mergedDeletedIds),
    faq: filterOutDeletedItems(bestData.faq || [], mergedDeletedIds),
    gallery: filterOutDeletedItems(bestData.gallery || [], mergedDeletedIds),
    recognitions: filterOutDeletedItems(bestData.recognitions || [], mergedDeletedIds),
    siteSettings: bestData.siteSettings || initialSiteSettings,
    testimonials: filterOutDeletedItems(bestData.testimonials || [], mergedDeletedIds),
  };

  globalThis.__techno_cms_store__ = JSON.parse(JSON.stringify(cleanData));
  return cleanData;
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

export async function writeStore(
  data: any,
  options?: {
    githubToken?: string;
    githubRepo?: string;
    upstashUrl?: string;
    upstashToken?: string;
    forceGitHubCommit?: boolean;
    deletedIds?: string[];
  }
): Promise<WriteStoreResult> {
  // Merge and persist deletedIds
  const existingDeleted = new Set<string>(Array.isArray(data.deletedIds) ? data.deletedIds : []);
  if (Array.isArray(options?.deletedIds)) {
    options.deletedIds.forEach((id) => existingDeleted.add(id));
  }
  const mergedDeletedIds = Array.from(existingDeleted);

  const cleanData = {
    ...data,
    deletedIds: mergedDeletedIds,
    projects: filterOutDeletedItems(data.projects || [], mergedDeletedIds),
    services: filterOutDeletedItems(data.services || [], mergedDeletedIds),
    team: filterOutDeletedItems(data.team || [], mergedDeletedIds),
    blog: filterOutDeletedItems(data.blog || [], mergedDeletedIds),
    faq: filterOutDeletedItems(data.faq || [], mergedDeletedIds),
    gallery: filterOutDeletedItems(data.gallery || [], mergedDeletedIds),
    recognitions: filterOutDeletedItems(data.recognitions || [], mergedDeletedIds),
    siteSettings: data.siteSettings || initialSiteSettings,
    testimonials: filterOutDeletedItems(data.testimonials || [], mergedDeletedIds),
  };

  // Always update in-memory store immediately
  globalThis.__techno_cms_store__ = JSON.parse(JSON.stringify(cleanData));

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

  await Promise.allSettled([
    // Tier 0: Local file (for local development & persistent hosting)
    (async () => {
      try {
        const dir = path.dirname(DATA_FILE_PATH);
        await fs.mkdir(dir, { recursive: true });
        await fs.writeFile(DATA_FILE_PATH, JSON.stringify(cleanData, null, 2), "utf-8");
        result.localDisk = true;
      } catch (err: any) {
        if (err?.code !== "EROFS") {
          result.errorDetails.push(`Local disk error: ${err?.message}`);
        }
      }
    })(),

    // Tier 1: Cloud Firestore
    (async () => {
      try {
        const db = getFirestoreDb();
        if (db) {
          await db.collection("cms").doc("content").set(cleanData);
          result.firestore = true;
        }
      } catch (e: any) {
        result.errorDetails.push(`Firestore: ${e?.message}`);
      }
    })(),

    // Tier 2: Upstash KV
    (async () => {
      const upstashRes = await saveToUpstashKV(cleanData, options?.upstashUrl, options?.upstashToken);
      if (upstashRes.success) {
        result.upstash = true;
      } else if (options?.upstashUrl) {
        result.errorDetails.push(`Upstash: ${upstashRes.error}`);
      }
    })(),

    // Tier 3: GitHub direct commit (ONLY when explicitly requested via forceGitHubCommit or manual Save to Cloud)
    // NEVER run on automatic debounced background typing saves to prevent spamming GitHub commits and redeployments.
    (async () => {
      if (!options?.forceGitHubCommit) {
        return;
      }

      const ghRes = await saveToGitHub(cleanData, options?.githubToken, options?.githubRepo);
      if (ghRes.success) {
        result.github = true;
      } else if (options?.githubToken || process.env.GITHUB_TOKEN || process.env.GH_TOKEN) {
        result.errorDetails.push(`GitHub: ${ghRes.error}`);
      }
    })(),

    // Tier 4: /tmp or local cache file
    (async () => {
      try {
        const dir = path.dirname(TMP_FILE_PATH);
        await fs.mkdir(dir, { recursive: true });
        await fs.writeFile(TMP_FILE_PATH, JSON.stringify(cleanData, null, 2), "utf-8");
        result.tmp = true;
      } catch (err: any) {
        result.errorDetails.push(`Temp cache error: ${err?.message}`);
      }
    })(),
  ]);

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
      "Saved to temporary serverless memory (/tmp). Connect GitHub or Upstash in Settings for permanent cloud persistence across all visitors.";
  }

  return result;
}

// Top-level fast server helper for SSR Layout hydration
export async function getAuthoritativeCMSData(): Promise<any> {
  try {
    return await readStore();
  } catch (err) {
    console.warn("[CMS Server] Error fetching authoritative data for SSR:", err);
    return getDefaultData();
  }
}
