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
import { getFirestoreDb, getFirebaseStorageBucket } from "@/lib/firebaseAdmin";

export const DATA_FILE_PATH = path.join(process.cwd(), "src", "data", "cms-content.json");
export const TMP_FILE_PATH =
  process.env.NODE_ENV === "production" || process.env.K_SERVICE || process.env.FUNCTION_TARGET
    ? path.join("/tmp", "cms-content.json")
    : path.join(process.cwd(), ".next", "cache", "cms-tmp.json");

declare global {
  // eslint-disable-next-line no-var
  var __techno_cms_store__: any;
  // eslint-disable-next-line no-var
  var __techno_cms_cached_at__: number | undefined;
}

export const SERVER_CACHE_TTL_MS = 60 * 1000; // 60s memory cache for ultra-fast <10ms SSR TTFB

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

export function sanitizeProjectsList(list: any[]): any[] {
  if (!Array.isArray(list)) return [];
  const normalized = list.map((p, idx) => {
    if (!p) return p;
    let cleanSlug = (p?.slug || "").trim().toLowerCase().replace(/[\s_]+/g, "-");
    if (
      (!p?.slug || cleanSlug === "zenith-residence" || cleanSlug === "mantle-buildofy") &&
      p?.id === "proj-12"
    ) {
      cleanSlug = "the-mantle";
    }
    const rawOrder = Number(p.sortOrder);
    const sortOrder = !isNaN(rawOrder) && rawOrder > 0 ? rawOrder : idx + 1;
    return {
      ...p,
      slug: cleanSlug || p?.slug,
      sortOrder,
    };
  });
  normalized.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
  return normalized.map((p, idx) => ({
    ...p,
    sortOrder: idx + 1,
  }));
}

export function sanitizeTeamList(list: any[]): any[] {
  if (!Array.isArray(list)) return [];
  const normalized = list.map((m, idx) => {
    if (!m) return m;
    const disc = typeof m.discipline === "string" ? m.discipline.trim() : "";
    const rawOrder = Number(m.sortOrder);
    const sortOrder = !isNaN(rawOrder) && rawOrder > 0 ? rawOrder : idx + 1;
    return {
      ...m,
      discipline: disc || "Architecture",
      sortOrder,
    };
  });

  normalized.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));

  return normalized.map((m, idx) => ({
    ...m,
    sortOrder: idx + 1,
  }));
}

export function sanitizeServicesList(list: any[]): any[] {
  if (!Array.isArray(list)) return [];
  const normalized = list.map((s, idx) => {
    if (!s) return s;
    const rawOrder = Number(s.sortOrder);
    const sortOrder = !isNaN(rawOrder) && rawOrder > 0 ? rawOrder : idx + 1;
    return {
      ...s,
      sortOrder,
    };
  });
  normalized.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
  return normalized.map((s, idx) => ({
    ...s,
    sortOrder: idx + 1,
  }));
}

export function sanitizeFaqList(list: any[]): any[] {
  if (!Array.isArray(list)) return [];
  const normalized = list.map((f, idx) => {
    if (!f) return f;
    const rawOrder = Number(f.sortOrder);
    const sortOrder = !isNaN(rawOrder) && rawOrder > 0 ? rawOrder : idx + 1;
    return {
      ...f,
      sortOrder,
    };
  });
  normalized.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
  return normalized.map((f, idx) => ({
    ...f,
    sortOrder: idx + 1,
  }));
}

export function sanitizeRecognitionsList(list: any[]): any[] {
  if (!Array.isArray(list)) return [];
  const normalized = list.map((r, idx) => {
    if (!r) return r;
    const rawOrder = Number(r.sortOrder);
    const sortOrder = !isNaN(rawOrder) && rawOrder > 0 ? rawOrder : idx + 1;
    return {
      ...r,
      sortOrder,
    };
  });
  normalized.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
  return normalized.map((r, idx) => ({
    ...r,
    sortOrder: idx + 1,
  }));
}

export function sanitizeTestimonialsList(list: any[]): any[] {
  if (!Array.isArray(list)) return [];
  const normalized = list.map((t, idx) => {
    if (!t) return t;
    const rawOrder = Number(t.sortOrder);
    const sortOrder = !isNaN(rawOrder) && rawOrder > 0 ? rawOrder : idx + 1;
    return {
      ...t,
      sortOrder,
    };
  });
  normalized.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
  return normalized.map((t, idx) => ({
    ...t,
    sortOrder: idx + 1,
  }));
}

export function getDefaultData(): any {
  const seed = (staticCmsContent as any) || {};
  const deletedIds: string[] = Array.isArray(seed.deletedIds) ? seed.deletedIds : [];
  return {
    projects: sanitizeProjectsList(filterOutDeletedItems(seed.projects || initialProjects, deletedIds)),
    services: sanitizeServicesList(filterOutDeletedItems(seed.services || initialServices, deletedIds)),
    team: sanitizeTeamList(filterOutDeletedItems(seed.team || initialTeam, deletedIds)),
    blog: filterOutDeletedItems(seed.blog || initialBlogPosts, deletedIds),
    faq: sanitizeFaqList(filterOutDeletedItems(seed.faq || initialFAQs, deletedIds)),
    gallery: filterOutDeletedItems(seed.gallery || initialGalleryItems, deletedIds),
    recognitions: sanitizeRecognitionsList(filterOutDeletedItems(seed.recognitions || initialRecognitions, deletedIds)),
    siteSettings: seed.siteSettings || initialSiteSettings,
    testimonials: sanitizeTestimonialsList(filterOutDeletedItems(seed.testimonials || initialTestimonials, deletedIds)),
    deletedIds,
    updatedAt: seed.updatedAt || "2024-01-01T00:00:00.000Z",
    isDefault: true,
  };
}

// -------------------------------------------------------------
// CLOUD STORAGE ADAPTERS (Firebase Storage / Upstash / GitHub / Firestore)
// -------------------------------------------------------------

export const FIREBASE_STORAGE_BUCKET =
  process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "technoarchitecture-7d718.firebasestorage.app";
export const FIREBASE_CMS_FILE_PATH = "cms/cms-content.json";

/**
 * Uploads CMS content directly to Firebase Cloud Storage bucket via authenticated Firebase Admin SDK.
 * This is 100% permanent, instantaneous, and operates securely with admin privileges.
 */
export async function saveToFirebaseStorage(
  data: any,
  explicitBucket?: string,
  customFilePath?: string
): Promise<{ success: boolean; error?: string }> {
  const targetFilePath = customFilePath || FIREBASE_CMS_FILE_PATH;
  const primaryBucket =
    explicitBucket ||
    process.env.FIREBASE_STORAGE_BUCKET ||
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ||
    FIREBASE_STORAGE_BUCKET;

  const candidateBuckets = Array.from(
    new Set([
      primaryBucket,
      primaryBucket.replace(".firebasestorage.app", ".appspot.com"),
      primaryBucket.replace(".appspot.com", ".firebasestorage.app"),
    ])
  ).filter(Boolean);

  // 1. Try Firebase Admin SDK first (bypasses storage rules if service account is configured)
  for (const bucketName of candidateBuckets) {
    try {
      const bucket = getFirebaseStorageBucket(bucketName);
      if (bucket) {
        const bodyString = typeof data === "string" ? data : JSON.stringify(data);
        await bucket.file(targetFilePath).save(bodyString, {
          contentType: "application/json",
          resumable: false,
          metadata: { cacheControl: "no-store" },
        });
        return { success: true };
      }
    } catch (adminErr: any) {
      console.warn("[CMS Server] Firebase Admin Storage upload notice:", adminErr?.message);
    }
  }

  // 2. Direct REST upload fallback to Firebase Storage
  // (Works seamlessly via standard Google Cloud Storage / Firebase Storage REST API)
  let lastErrText = "";
  for (const bucketName of candidateBuckets) {
    const uploadUrl = `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o?name=${encodeURIComponent(
      targetFilePath
    )}&uploadType=media`;

    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 60000);

      const bodyString = typeof data === "string" ? data : JSON.stringify(data);
      const res = await fetch(uploadUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: bodyString,
        signal: controller.signal,
      });
      clearTimeout(timer);

      if (res.ok) {
        return { success: true };
      }

      const errText = await res.text();
      lastErrText = `Firebase Storage (${bucketName}) HTTP ${res.status}: ${errText}`;
    } catch (e: any) {
      lastErrText = e?.message || "Firebase Storage upload failed.";
    }
  }

  return {
    success: false,
    error: lastErrText || "Firebase Storage upload failed across all bucket endpoints.",
  };
}

/**
 * Reads CMS content directly from Firebase Cloud Storage via Admin SDK (with public CDN fallback).
 */
export async function getFromFirebaseStorage(explicitBucket?: string, customFilePath?: string): Promise<any | null> {
  const targetPath = customFilePath || FIREBASE_CMS_FILE_PATH;

  // 1. Try Firebase Admin Storage download first (bypasses CDN cache & public permissions)
  try {
    const bucket = getFirebaseStorageBucket(explicitBucket);
    if (bucket) {
      const file = bucket.file(targetPath);
      const [exists] = await file.exists();
      if (exists) {
        const [contents] = await file.download();
        const data = JSON.parse(contents.toString("utf-8"));
        if (data && typeof data === "object") {
          return data;
        }
      }
    }
  } catch (adminErr) {
    // Fall back to public REST endpoint below
  }

  // 2. Fallback to public CDN / REST endpoint
  const primaryBucket = explicitBucket || FIREBASE_STORAGE_BUCKET;
  const candidateBuckets = Array.from(
    new Set([
      primaryBucket,
      primaryBucket.replace(".firebasestorage.app", ".appspot.com"),
      primaryBucket.replace(".appspot.com", ".firebasestorage.app"),
    ])
  ).filter(Boolean);

  for (const bucketName of candidateBuckets) {
    const getUrl = `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${encodeURIComponent(
      targetPath
    )}?alt=media&ts=${Date.now()}`;

    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 60000);

      const res = await fetch(getUrl, {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
        },
        signal: controller.signal,
      });
      clearTimeout(timer);

      if (res.ok) {
        const data = await res.json();
        if (data && typeof data === "object") {
          return data;
        }
      }
    } catch (e) {
      // Firebase Storage read notice
    }
  }
  return null;
}

/**
 * Granular Split Storage: Writes a single entity record to storage & Firestore.
 * Significantly smaller payload (< 5 KB vs 250 KB monolithic) and fast (< 100ms).
 */
export async function writeRecord(
  entity: string,
  recordId: string,
  record: any
): Promise<{ success: boolean; error?: string; durationMs: number; sizeBytes: number }> {
  const t0 = Date.now();
  const cleanEntity = String(entity).replace(/[^a-zA-Z0-9-_]/g, "");
  const cleanId = String(recordId).replace(/[^a-zA-Z0-9-_]/g, "");
  const targetPath = `cms/${cleanEntity}/${cleanId}.json`;
  const recordString = JSON.stringify(record, null, 2);
  const sizeBytes = Buffer.byteLength(recordString, "utf8");

  let storageOk = false;
  let storageErr = "";

  // 1. Write granular file to Firebase Cloud Storage via Admin SDK
  try {
    const fbRes = await saveToFirebaseStorage(record, undefined, targetPath);
    if (fbRes.success) {
      storageOk = true;
    } else {
      storageErr = fbRes.error || "Storage write failed";
    }
  } catch (err: any) {
    storageErr = err?.message || "Storage error";
  }

  // 2. Write granular record to Firestore (collection: cms_[entity], doc: [id])
  try {
    const db = getFirestoreDb();
    if (db) {
      await db.collection(`cms_${cleanEntity}`).doc(cleanId).set(record);
      storageOk = true;
    }
  } catch (dbErr: any) {
    console.warn(`[CMS Server] Firestore record write notice for ${cleanEntity}/${cleanId}:`, dbErr?.message);
  }

  // 3. Update in-memory store so server rendered views reflect edit immediately
  if (globalThis.__techno_cms_store__) {
    const store = globalThis.__techno_cms_store__;
    if (Array.isArray(store[cleanEntity])) {
      const idx = store[cleanEntity].findIndex((item: any) => item && (item.id === cleanId || item.slug === cleanId));
      if (idx >= 0) {
        store[cleanEntity][idx] = record;
      } else {
        store[cleanEntity].push(record);
      }
    } else if (cleanEntity === "siteSettings") {
      store.siteSettings = record;
    }
    store.updatedAt = record.updatedAt || new Date().toISOString();
  }

  const durationMs = Date.now() - t0;
  return {
    success: storageOk,
    error: storageOk ? undefined : storageErr,
    durationMs,
    sizeBytes,
  };
}

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

export async function getFromGitHub(explicitToken?: string, explicitRepo?: string): Promise<any | null> {
  const token = explicitToken || process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
  let repo = explicitRepo || process.env.GITHUB_REPOSITORY || "Amanrck96/Techno-Architecture";
  if (repo.includes("Kima1011")) repo = "Amanrck96/Techno-Architecture";
  const filePath = "src/data/cms-content.json";
  if (!token) return null;

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 60000);

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
    // Read notice
  }
  return null;
}

export async function saveToGitHub(
  data: any,
  explicitToken?: string,
  explicitRepo?: string
): Promise<{ success: boolean; sha?: string; error?: string }> {
  const token = explicitToken || process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
  let repo = explicitRepo || process.env.GITHUB_REPOSITORY || "Amanrck96/Techno-Architecture";
  if (repo.includes("Kima1011")) repo = "Amanrck96/Techno-Architecture";
  const filePath = "src/data/cms-content.json";
  if (!token) return { success: false, error: "GitHub Personal Access Token not provided." };

  if (isGitHubCommitInProgress) {
    return {
      success: false,
      error: "A GitHub commit is already in progress. Please wait a few seconds before committing again.",
    };
  }

  isGitHubCommitInProgress = true;

  try {
    const contentStr = JSON.stringify(data, null, 2);
    const contentBase64 = Buffer.from(contentStr).toString("base64");
    const maxRetries = 2;

    for (let attempt = 1; attempt <= maxRetries + 1; attempt++) {
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
        } else if (getRes.status === 429) {
          return {
            success: false,
            error: "GitHub API rate limit exceeded (HTTP 429). Please wait before trying again.",
          };
        }
      } catch (err: any) {
        if (attempt > maxRetries) throw err;
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

      // Handle 409 SHA conflict: refetch latest SHA and retry with backoff
      if (putRes.status === 409 && attempt <= maxRetries) {
        const backoffMs = attempt * 1000;
        await new Promise((r) => setTimeout(r, backoffMs));
        continue;
      }

      // If rate limited or forbidden or server error, stop immediately without endless loops
      const putErr = await putRes.text();
      return {
        success: false,
        error: `GitHub commit rejected (HTTP ${putRes.status}): ${putErr.slice(0, 300)}`,
      };
    }

    return {
      success: false,
      error: "GitHub commit failed due to continuous SHA conflicts after retry.",
    };
  } catch (err: any) {
    console.warn("[CMS Server] GitHub API commit error:", err);
    return { success: false, error: err?.message || "Network error connecting to GitHub API." };
  } finally {
    isGitHubCommitInProgress = false;
  }
}

// -------------------------------------------------------------
// READ & WRITE STORE
// -------------------------------------------------------------

export async function readStore(
  customUpstashUrl?: string,
  customUpstashToken?: string,
  customGithubToken?: string,
  customGithubRepo?: string,
  forceFresh: boolean = false
): Promise<any> {
  const now = Date.now();
  const cachedAt = globalThis.__techno_cms_cached_at__ || 0;

  // Ultra-fast in-memory cache hit (0ms execution, zero network round trips)
  if (
    !forceFresh &&
    !customUpstashUrl &&
    !customGithubToken &&
    globalThis.__techno_cms_store__ &&
    typeof globalThis.__techno_cms_store__ === "object" &&
    globalThis.__techno_cms_store__.updatedAt &&
    now - cachedAt < SERVER_CACHE_TTL_MS
  ) {
    return JSON.parse(JSON.stringify(globalThis.__techno_cms_store__));
  }

  const candidates: any[] = [];

  // 1. In-memory store (fastest, survives warm invocations)
  if (
    globalThis.__techno_cms_store__ &&
    typeof globalThis.__techno_cms_store__ === "object" &&
    globalThis.__techno_cms_store__.updatedAt
  ) {
    candidates.push(JSON.parse(JSON.stringify(globalThis.__techno_cms_store__)));
  }

  // 2. Firebase Cloud Storage (Authoritative, instantaneous, permanent cloud bucket)
  try {
    const fbData = await getFromFirebaseStorage();
    if (fbData && typeof fbData === "object" && fbData.updatedAt) {
      candidates.push(fbData);
    }
  } catch (_) {}

  // 3. Cloud Firestore (Tier 0 persistence if service account configured)
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
    projects: sanitizeProjectsList(filterOutDeletedItems(bestData.projects || [], mergedDeletedIds)),
    services: filterOutDeletedItems(bestData.services || [], mergedDeletedIds),
    team: sanitizeTeamList(filterOutDeletedItems(bestData.team || [], mergedDeletedIds)),
    blog: filterOutDeletedItems(bestData.blog || [], mergedDeletedIds),
    faq: filterOutDeletedItems(bestData.faq || [], mergedDeletedIds),
    gallery: filterOutDeletedItems(bestData.gallery || [], mergedDeletedIds),
    recognitions: filterOutDeletedItems(bestData.recognitions || [], mergedDeletedIds),
    siteSettings: bestData.siteSettings || initialSiteSettings,
    testimonials: filterOutDeletedItems(bestData.testimonials || [], mergedDeletedIds),
  };

  globalThis.__techno_cms_store__ = JSON.parse(JSON.stringify(cleanData));
  globalThis.__techno_cms_cached_at__ = Date.now();
  return cleanData;
}

export interface WriteStoreResult {
  localDisk: boolean;
  tmp: boolean;
  upstash: boolean;
  github: boolean;
  firestore: boolean;
  firebaseStorage: boolean;
  isPermanent: boolean;
  summaryMessage: string;
  errorDetails: string[];
}

let hasLoggedEROFSWarning = false;

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
    projects: sanitizeProjectsList(filterOutDeletedItems(data.projects || [], mergedDeletedIds)),
    services: sanitizeServicesList(filterOutDeletedItems(data.services || [], mergedDeletedIds)),
    team: sanitizeTeamList(filterOutDeletedItems(data.team || [], mergedDeletedIds)),
    blog: filterOutDeletedItems(data.blog || [], mergedDeletedIds),
    faq: sanitizeFaqList(filterOutDeletedItems(data.faq || [], mergedDeletedIds)),
    gallery: filterOutDeletedItems(data.gallery || [], mergedDeletedIds),
    recognitions: sanitizeRecognitionsList(filterOutDeletedItems(data.recognitions || [], mergedDeletedIds)),
    siteSettings: data.siteSettings || initialSiteSettings,
    testimonials: sanitizeTestimonialsList(filterOutDeletedItems(data.testimonials || [], mergedDeletedIds)),
  };

  // Always update in-memory store immediately
  globalThis.__techno_cms_store__ = JSON.parse(JSON.stringify(cleanData));
  globalThis.__techno_cms_cached_at__ = Date.now();

  const result: WriteStoreResult = {
    localDisk: false,
    tmp: false,
    upstash: false,
    github: false,
    firestore: false,
    firebaseStorage: false,
    isPermanent: false,
    summaryMessage: "",
    errorDetails: [],
  };

  await Promise.allSettled([
    // Tier 0: Firebase Cloud Storage (Authoritative, instant ~300ms, no rebuilds required)
    (async () => {
      const fbRes = await saveToFirebaseStorage(cleanData);
      if (fbRes.success) {
        result.firebaseStorage = true;
      } else {
        result.errorDetails.push(`Firebase Storage: ${fbRes.error}`);
      }
    })(),

    // Tier 1: Local file (for local development & persistent hosting)
    (async () => {
      try {
        const dir = path.dirname(DATA_FILE_PATH);
        await fs.mkdir(dir, { recursive: true });
        await fs.writeFile(DATA_FILE_PATH, JSON.stringify(cleanData, null, 2), "utf-8");
        result.localDisk = true;
      } catch (err: any) {
        if (err?.code === "EROFS") {
          if (!hasLoggedEROFSWarning) {
            console.warn("[CMS Server] Read-only filesystem (EROFS) detected; local disk writes disabled.");
            hasLoggedEROFSWarning = true;
          }
          result.errorDetails.push("Local disk: read-only filesystem (EROFS).");
        } else {
          result.errorDetails.push(`Local disk error: ${err?.message}`);
        }
      }
    })(),

    // Tier 2: Cloud Firestore
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

    // Tier 3: Upstash KV
    (async () => {
      const upstashRes = await saveToUpstashKV(cleanData, options?.upstashUrl, options?.upstashToken);
      if (upstashRes.success) {
        result.upstash = true;
      } else if (options?.upstashUrl) {
        result.errorDetails.push(`Upstash: ${upstashRes.error}`);
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

  // GITHUB TIER:
  // Git commits trigger continuous production redeployments, so they are STRICTLY RESTRICTED
  // to explicit manual requests (options?.forceGitHubCommit = true).
  // Standard background auto-saves and admin edits NEVER commit to Git automatically.
  const hasGitHubToken = options?.githubToken || process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
  if (hasGitHubToken && options?.forceGitHubCommit) {
    try {
      const ghRes = await saveToGitHub(cleanData, options?.githubToken, options?.githubRepo);
      if (ghRes.success) {
        result.github = true;
      } else {
        result.errorDetails.push(`GitHub: ${ghRes.error}`);
      }
    } catch (ghErr: any) {
      result.errorDetails.push(`GitHub error: ${ghErr?.message}`);
    }
  }

  result.isPermanent =
    result.firebaseStorage ||
    result.localDisk ||
    result.github ||
    result.upstash ||
    result.firestore;

  if (result.firebaseStorage) {
    result.summaryMessage =
      "Saved permanently to Firebase Cloud Storage (instant live sync across all devices & visitors).";
  } else if (result.firestore) {
    result.summaryMessage = "Saved permanently to Cloud Firestore.";
  } else if (result.upstash) {
    result.summaryMessage = "Saved permanently to Upstash cloud key-value store.";
  } else if (result.github) {
    result.summaryMessage = "Committed permanently to GitHub repository (triggers production redeploy).";
  } else if (result.localDisk) {
    result.summaryMessage = "Saved permanently to src/data/cms-content.json on disk.";
  } else {
    result.summaryMessage =
      "Storage not configured: missing FIREBASE_* credentials (FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY) in host environment. " +
      (result.errorDetails.length ? `[${result.errorDetails.join(" | ")}]` : "");
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
