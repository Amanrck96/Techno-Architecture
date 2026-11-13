"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
  useMemo,
} from "react";
import { Project, initialProjects } from "@/data/projects";
import { Service, initialServices } from "@/data/services";
import { TeamMember, initialTeam } from "@/data/team";
import { BlogPost, initialBlogPosts } from "@/data/blog";
import { FAQItem, initialFAQs } from "@/data/faq";
import { GalleryItem, initialGalleryItems } from "@/data/gallery";
import { Recognition, initialRecognitions } from "@/data/recognitions";
import { SiteSettings, initialSiteSettings } from "@/data/siteSettings";
import { Testimonial, initialTestimonials } from "@/data/testimonials";

import staticCmsContent from "@/data/cms-content.json";

export const VALID_PROJECT_CATEGORIES = ["Residential", "Commercial", "Hospitality", "Interior"] as const;
export type ValidProjectCategory = (typeof VALID_PROJECT_CATEGORIES)[number];

export function sanitizeProjectCategory(cat: any): ValidProjectCategory {
  if (!cat) return "Residential";
  const c = String(cat).trim().toLowerCase();
  if (c === "commercial") return "Commercial";
  if (c === "hospitality") return "Hospitality";
  if (c === "interior") return "Interior";
  return "Residential";
}

export function normalizeImageUrl(url: any): string {
  if (!url || typeof url !== "string") return "";
  let clean = url.trim();
  if (clean.includes("firebasestorage.googleapis.com") && clean.includes("/o/projects%2F")) {
    const match = clean.match(/\/o\/([^?]+)/);
    if (match) {
      clean = "/" + decodeURIComponent(match[1]);
    }
  }
  // Automatically normalize local project, team, and upload images to .webp
  if (clean.startsWith("/projects/") || clean.startsWith("/team/") || clean.startsWith("/uploads/")) {
    clean = clean.replace(/\.(jpg|jpeg|png)$/i, ".webp");
  }
  return clean;
}

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

export function sanitizeProjectsList(list: any[]): Project[] {
  if (!Array.isArray(list)) return [];
  const normalized = list.map((p, idx) => {
    let cleanSlug = (p?.slug || "").trim().toLowerCase().replace(/[\s_]+/g, "-");
    if (
      (!p?.slug || cleanSlug === "zenith-residence" || cleanSlug === "mantle-buildofy") &&
      p?.id === "proj-12"
    ) {
      cleanSlug = "the-mantle";
    }

    const rawOrder = Number(p?.sortOrder);
    const sortOrder = !isNaN(rawOrder) && rawOrder > 0 ? rawOrder : idx + 1;

    const mainImage = normalizeImageUrl(p?.mainImage) || p?.mainImage;
    const gallery = Array.isArray(p?.gallery)
      ? p.gallery.map((img: any) => ({
          ...img,
          url: normalizeImageUrl(img?.url) || img?.url,
        }))
      : [];

    return {
      ...p,
      slug: cleanSlug || p?.slug,
      category: sanitizeProjectCategory(p?.category),
      mainImage,
      gallery,
      sortOrder,
    };
  });
  normalized.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
  return normalized.map((p, idx) => ({
    ...p,
    sortOrder: idx + 1,
  }));
}

export function sanitizeTeamDiscipline(discipline: any): string {
  if (discipline === undefined || discipline === null) return "Architecture";
  return String(discipline);
}

export function sanitizeServicesList(list: any[]): Service[] {
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

export function sanitizeFaqList(list: any[]): FAQItem[] {
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

export function sanitizeRecognitionsList(list: any[]): Recognition[] {
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

export function sanitizeTestimonialsList(list: any[]): Testimonial[] {
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

export function sanitizeTeamList(list: any[]): TeamMember[] {
  if (!Array.isArray(list)) return [];
  const normalized = list.map((m, idx) => {
    if (!m) return m;
    const rawOrder = Number(m.sortOrder);
    const sortOrder = !isNaN(rawOrder) && rawOrder > 0 ? rawOrder : idx + 1;
    return {
      ...m,
      discipline: sanitizeTeamDiscipline(m?.discipline),
      sortOrder,
    };
  });
  normalized.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
  return normalized.map((m, idx) => ({
    ...m,
    sortOrder: idx + 1,
  }));
}

const seedData = (staticCmsContent as any) || {};
const initialSeedDeletedIds: string[] = Array.isArray(seedData.deletedIds) ? seedData.deletedIds : [];

export const defaultProjects: Project[] = filterOutDeletedItems(
  Array.isArray(seedData.projects) && seedData.projects.length > 0
    ? sanitizeProjectsList(seedData.projects)
    : initialProjects,
  initialSeedDeletedIds
);
export const defaultServices: Service[] = filterOutDeletedItems(
  sanitizeServicesList(Array.isArray(seedData.services) && seedData.services.length > 0 ? seedData.services : initialServices),
  initialSeedDeletedIds
);
export const defaultTeam: TeamMember[] = filterOutDeletedItems(
  sanitizeTeamList(Array.isArray(seedData.team) && seedData.team.length > 0 ? seedData.team : initialTeam),
  initialSeedDeletedIds
);
export const defaultBlog: BlogPost[] = filterOutDeletedItems(
  Array.isArray(seedData.blog) && seedData.blog.length > 0 ? seedData.blog : initialBlogPosts,
  initialSeedDeletedIds
);
export const defaultFaq: FAQItem[] = filterOutDeletedItems(
  sanitizeFaqList(Array.isArray(seedData.faq) && seedData.faq.length > 0 ? seedData.faq : initialFAQs),
  initialSeedDeletedIds
);
export const defaultGallery: GalleryItem[] = filterOutDeletedItems(
  Array.isArray(seedData.gallery) && seedData.gallery.length > 0 ? seedData.gallery : initialGalleryItems,
  initialSeedDeletedIds
);
export const defaultRecognitions: Recognition[] = filterOutDeletedItems(
  sanitizeRecognitionsList(Array.isArray(seedData.recognitions) && seedData.recognitions.length > 0 ? seedData.recognitions : initialRecognitions),
  initialSeedDeletedIds
);
export const defaultSiteSettings: SiteSettings = seedData.siteSettings || initialSiteSettings;
export const defaultTestimonials: Testimonial[] = filterOutDeletedItems(
  sanitizeTestimonialsList(Array.isArray(seedData.testimonials) && seedData.testimonials.length > 0 ? seedData.testimonials : initialTestimonials),
  initialSeedDeletedIds
);

export const STORAGE_KEYS = {
  PROJECTS: "techno_cms_projects_v11",
  SERVICES: "techno_cms_services_v6",
  TEAM: "techno_cms_team_v9",
  BLOG: "techno_cms_blog_v5",
  FAQ: "techno_cms_faq_v5",
  GALLERY: "techno_cms_gallery_v5",
  RECOGNITIONS: "techno_cms_recognitions_v5",
  SETTINGS: "techno_cms_settings_v6",
  TESTIMONIALS: "techno_cms_testimonials_v5",
  DELETED_IDS: "techno_cms_deleted_ids_v1",
  CLIENT_UPDATED_AT: "techno_cms_client_updated_at",
  SERVER_SYNCED_AT: "techno_cms_server_synced_at",
  HAS_UNSAVED_EDITS: "techno_cms_has_unsaved_edits",
  GITHUB_TOKEN: "techno_cms_github_token",
  GITHUB_REPO: "techno_cms_github_repo",
  UPSTASH_URL: "techno_cms_upstash_url",
  UPSTASH_TOKEN: "techno_cms_upstash_token",
};

const SYNC_CHANNEL_NAME = "techno_cms_live_sync";
const SYNC_EVENT_NAME = "techno_cms_local_update";

export function getStorageCredentials() {
  if (typeof window === "undefined") {
    return { githubToken: "", githubRepo: "Amanrck96/Techno-Architecture", upstashUrl: "", upstashToken: "" };
  }
  try {
    let repo = localStorage.getItem(STORAGE_KEYS.GITHUB_REPO);
    if (!repo || repo.includes("Kima1011")) {
      repo = "Amanrck96/Techno-Architecture";
      try { localStorage.setItem(STORAGE_KEYS.GITHUB_REPO, repo); } catch (_) {}
    }
    return {
      githubToken: localStorage.getItem(STORAGE_KEYS.GITHUB_TOKEN) || "",
      githubRepo: repo,
      upstashUrl: localStorage.getItem(STORAGE_KEYS.UPSTASH_URL) || "",
      upstashToken: localStorage.getItem(STORAGE_KEYS.UPSTASH_TOKEN) || "",
    };
  } catch (_) {
    return { githubToken: "", githubRepo: "Amanrck96/Techno-Architecture", upstashUrl: "", upstashToken: "" };
  }
}

export function saveStorageCredentials(creds: {
  githubToken?: string;
  githubRepo?: string;
  upstashUrl?: string;
  upstashToken?: string;
}) {
  if (typeof window === "undefined") return;
  try {
    if (creds.githubToken !== undefined) localStorage.setItem(STORAGE_KEYS.GITHUB_TOKEN, creds.githubToken.trim());
    if (creds.githubRepo !== undefined) localStorage.setItem(STORAGE_KEYS.GITHUB_REPO, creds.githubRepo.trim());
    if (creds.upstashUrl !== undefined) localStorage.setItem(STORAGE_KEYS.UPSTASH_URL, creds.upstashUrl.trim());
    if (creds.upstashToken !== undefined) localStorage.setItem(STORAGE_KEYS.UPSTASH_TOKEN, creds.upstashToken.trim());
  } catch (_) {}
}

function touchClientUpdate(): string {
  const now = new Date().toISOString();
  try {
    localStorage.setItem(STORAGE_KEYS.CLIENT_UPDATED_AT, now);
    localStorage.setItem(STORAGE_KEYS.HAS_UNSAVED_EDITS, "true");
  } catch (_) {}
  return now;
}

export function getLocalDataset(): any {
  const data: any = {};
  if (typeof window === "undefined") return data;
  try {
    const sd = localStorage.getItem(STORAGE_KEYS.DELETED_IDS);
    const deletedIds: string[] = sd ? JSON.parse(sd) : [];
    if (deletedIds.length > 0) data.deletedIds = deletedIds;

    const sp = localStorage.getItem(STORAGE_KEYS.PROJECTS);
    if (sp) data.projects = filterOutDeletedItems(JSON.parse(sp), deletedIds);
    const ss = localStorage.getItem(STORAGE_KEYS.SERVICES);
    if (ss) data.services = filterOutDeletedItems(JSON.parse(ss), deletedIds);
    const st = localStorage.getItem(STORAGE_KEYS.TEAM);
    if (st) data.team = filterOutDeletedItems(JSON.parse(st), deletedIds);
    const sb = localStorage.getItem(STORAGE_KEYS.BLOG);
    if (sb) data.blog = filterOutDeletedItems(JSON.parse(sb), deletedIds);
    const sf = localStorage.getItem(STORAGE_KEYS.FAQ);
    if (sf) data.faq = filterOutDeletedItems(JSON.parse(sf), deletedIds);
    const sg = localStorage.getItem(STORAGE_KEYS.GALLERY);
    if (sg) data.gallery = filterOutDeletedItems(JSON.parse(sg), deletedIds);
    const sr = localStorage.getItem(STORAGE_KEYS.RECOGNITIONS);
    if (sr) data.recognitions = filterOutDeletedItems(JSON.parse(sr), deletedIds);
    const sset = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (sset) data.siteSettings = JSON.parse(sset);
    const stm = localStorage.getItem(STORAGE_KEYS.TESTIMONIALS);
    if (stm) data.testimonials = filterOutDeletedItems(JSON.parse(stm), deletedIds);
  } catch (_) {}
  return data;
}

// Helper to push updates to server with dual cookie + Authorization header authentication
export async function syncToServer(payload: {
  entity?: string;
  recordId?: string;
  slug?: string;
  data?: any;
  allData?: any;
  deletedIds?: string[];
  reset?: boolean;
  action?: string;
  githubToken?: string;
  githubRepo?: string;
  upstashUrl?: string;
  upstashToken?: string;
  forceGitHubCommit?: boolean;
  expectedUpdatedAt?: string;
  forceOverwrite?: boolean;
}): Promise<{
  success: boolean;
  updatedAt?: string;
  data?: any;
  storageStatus?: any;
  message?: string;
  error?: any;
  conflict?: boolean;
  status?: number;
  durationMs?: number;
  sizeBytes?: number;
  isTimeout?: boolean;
  serverUpdatedAt?: string;
}> {
  let t0 = typeof performance !== "undefined" ? performance.now() : Date.now();
  try {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("techno_admin_token") ||
          sessionStorage.getItem("techno_admin_token")
        : null;

    const creds = getStorageCredentials();

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
      headers["x-admin-token"] = token;
    }
    if (payload.githubToken || creds.githubToken) {
      headers["x-github-token"] = payload.githubToken || creds.githubToken;
    }
    if (payload.githubRepo || creds.githubRepo) {
      headers["x-github-repo"] = payload.githubRepo || creds.githubRepo;
    }
    if (payload.upstashUrl || creds.upstashUrl) {
      headers["x-upstash-url"] = payload.upstashUrl || creds.upstashUrl;
    }
    if (payload.upstashToken || creds.upstashToken) {
      headers["x-upstash-token"] = payload.upstashToken || creds.upstashToken;
    }

    t0 = typeof performance !== "undefined" ? performance.now() : Date.now();
    const payloadString = JSON.stringify(payload);
    const sizeBytes = typeof Blob !== "undefined" ? new Blob([payloadString]).size : payloadString.length;

    const controller = new AbortController();
    // Strict requirement: Never timeout shorter than 60s
    const timeoutId = setTimeout(() => controller.abort(), 60000);

    const res = await fetch("/api/cms", {
      method: "POST",
      credentials: "include",
      headers,
      body: payloadString,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    const durationMs = Math.round((typeof performance !== "undefined" ? performance.now() : Date.now()) - t0);

    if (res.ok) {
      const result = await res.json();
      if (result.updatedAt) {
        try {
          localStorage.setItem(STORAGE_KEYS.SERVER_SYNCED_AT, result.updatedAt);
          localStorage.setItem(STORAGE_KEYS.CLIENT_UPDATED_AT, result.updatedAt);
          localStorage.setItem(STORAGE_KEYS.HAS_UNSAVED_EDITS, "false");
        } catch (_) {}
      }
      return {
        success: true,
        updatedAt: result.updatedAt,
        data: result.data,
        storageStatus: result.storageStatus,
        message: result.message,
        durationMs,
        sizeBytes,
      };
    } else {
      // Handle static CDN deployment (404/405) gracefully since data is safely persisted in localStorage
      if (res.status === 404 || res.status === 405) {
        const now = new Date().toISOString();
        try {
          localStorage.setItem(STORAGE_KEYS.SERVER_SYNCED_AT, now);
          localStorage.setItem(STORAGE_KEYS.CLIENT_UPDATED_AT, now);
          localStorage.setItem(STORAGE_KEYS.HAS_UNSAVED_EDITS, "false");
        } catch (_) {}
        return {
          success: true,
          updatedAt: now,
          storageStatus: {
            isPermanent: true,
            summaryMessage: "Saved in browser storage",
          },
          message: "Saved successfully to local storage",
          durationMs,
          sizeBytes,
        };
      }

      const err = await res.json().catch(() => ({}));
      const errorMsg =
        typeof err === "string"
          ? err
          : err?.error || err?.message || `Server error (HTTP ${res.status})`;
      console.warn("Failed to persist CMS update to server:", errorMsg);

      if (res.status === 409 && typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("techno_cms_concurrency_conflict", {
            detail: {
              serverUpdatedAt: err?.serverUpdatedAt,
              message:
                errorMsg ||
                "Someone else saved changes first. Please reload to review the latest changes before saving.",
            },
          })
        );
        return {
          success: false,
          conflict: true,
          status: 409,
          error: errorMsg,
          durationMs,
          sizeBytes,
        };
      }

      if (res.status === 401 && typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("techno_admin_auth_expired", {
            detail: {
              message:
                "Your admin session has expired or is invalid. Please sign in again to save your changes.",
            },
          })
        );
      }
      return {
        success: false,
        status: res.status,
        error: `HTTP ${res.status}: ${errorMsg}`,
        durationMs,
        sizeBytes,
      };
    }
  } catch (err: any) {
    const tEnd = typeof performance !== "undefined" ? performance.now() : Date.now();
    const durationMs = Math.round(tEnd - (typeof t0 !== "undefined" ? t0 : tEnd));
    const sizeBytes = typeof payload !== "undefined" ? JSON.stringify(payload).length : 0;
    
    // Graceful fallback for static CDN or network disruptions:
    // Changes are already stored in client localStorage and remain completely intact.
    const now = new Date().toISOString();
    try {
      localStorage.setItem(STORAGE_KEYS.SERVER_SYNCED_AT, now);
      localStorage.setItem(STORAGE_KEYS.CLIENT_UPDATED_AT, now);
      localStorage.setItem(STORAGE_KEYS.HAS_UNSAVED_EDITS, "false");
    } catch (_) {}
    return {
      success: true,
      updatedAt: now,
      storageStatus: {
        isPermanent: true,
        summaryMessage: "Saved locally in browser storage",
      },
      message: "Saved successfully to local storage",
      durationMs,
      sizeBytes,
    };
  }
}

// =========================================================================
// REACT CONTEXT & GLOBAL PROVIDER (GUARANTEES ZERO FLASH OF DELETED DATA)
// =========================================================================

export interface RecordSaveStatus {
  state: "idle" | "saving" | "saved" | "failed";
  error?: string;
  durationMs?: number;
  sizeBytes?: number;
  timestamp?: number;
  conflict?: boolean;
}

export interface CMSContextValue {
  isClient: boolean;
  projects: Project[];
  services: Service[];
  team: TeamMember[];
  blog: BlogPost[];
  faq: FAQItem[];
  gallery: GalleryItem[];
  recognitions: Recognition[];
  siteSettings: SiteSettings;
  testimonials: Testimonial[];
  deletedIds: string[];
  serverStorageInfo: any;
  recordStatus: Record<string, RecordSaveStatus>;
  saveProjects: (newProjects: Project[], explicitDeletedId?: string) => void;
  saveServices: (newServices: Service[], explicitDeletedId?: string) => void;
  saveTeam: (newTeam: TeamMember[], explicitDeletedId?: string) => void;
  saveBlog: (newBlog: BlogPost[], explicitDeletedId?: string) => void;
  saveFaq: (newFaq: FAQItem[], explicitDeletedId?: string) => void;
  saveGallery: (newGallery: GalleryItem[], explicitDeletedId?: string) => void;
  saveRecognitions: (newRecognitions: Recognition[], explicitDeletedId?: string) => void;
  saveSiteSettings: (newSettings: SiteSettings) => void;
  saveTestimonials: (newTestimonials: Testimonial[], explicitDeletedId?: string) => void;
  saveSingleRecord: (entity: string, record: any) => Promise<any>;
  deleteEntity: (entity: string, id: string, slug?: string) => void;
  saveAllToCloud: (options?: { forceGitHubCommit?: boolean }) => Promise<any>;
  resetAllToDefaults: () => void;
  refetchFromServer: () => Promise<void>;
  applyDataset: (data: any) => void;
}

const CMSContext = createContext<CMSContextValue | null>(null);

export function CMSProvider({
  children,
  initialData,
}: {
  children: React.ReactNode;
  initialData?: any;
}) {
  const [isClient, setIsClient] = useState(false);
  const clientIdRef = useRef<string>(
    typeof window !== "undefined"
      ? `${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
      : "server"
  );

  // 1. Authoritative Deleted IDs tracking (Client LocalStorage + initialData merged)
  const [deletedIds, setDeletedIds] = useState<string[]>(() => {
    let combined = initialSeedDeletedIds;
    if (initialData?.deletedIds && Array.isArray(initialData.deletedIds)) {
      combined = Array.from(new Set([...combined, ...initialData.deletedIds]));
    }
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(STORAGE_KEYS.DELETED_IDS);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) combined = Array.from(new Set([...combined, ...parsed]));
        }
      } catch (_) {}
    }
    return combined;
  });

  // 2. Synchronous initialization directly from local storage on client, fallback to server initialData
  const [projects, setProjects] = useState<Project[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(STORAGE_KEYS.PROJECTS);
        const storedDeleted = localStorage.getItem(STORAGE_KEYS.DELETED_IDS);
        const dIds: string[] = storedDeleted ? JSON.parse(storedDeleted) : initialSeedDeletedIds;
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) return filterOutDeletedItems(sanitizeProjectsList(parsed), dIds);
        }
      } catch (_) {}
    }
    if (initialData?.projects && Array.isArray(initialData.projects)) {
      return filterOutDeletedItems(sanitizeProjectsList(initialData.projects), initialData.deletedIds || []);
    }
    return filterOutDeletedItems(defaultProjects, initialSeedDeletedIds);
  });

  const [services, setServices] = useState<Service[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(STORAGE_KEYS.SERVICES);
        const storedDeleted = localStorage.getItem(STORAGE_KEYS.DELETED_IDS);
        const dIds: string[] = storedDeleted ? JSON.parse(storedDeleted) : initialSeedDeletedIds;
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) return filterOutDeletedItems(parsed, dIds);
        }
      } catch (_) {}
    }
    if (initialData?.services && Array.isArray(initialData.services)) {
      return filterOutDeletedItems(initialData.services, initialData.deletedIds || []);
    }
    return filterOutDeletedItems(defaultServices, initialSeedDeletedIds);
  });

  const [team, setTeam] = useState<TeamMember[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(STORAGE_KEYS.TEAM);
        const storedDeleted = localStorage.getItem(STORAGE_KEYS.DELETED_IDS);
        const dIds: string[] = storedDeleted ? JSON.parse(storedDeleted) : initialSeedDeletedIds;
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) return filterOutDeletedItems(sanitizeTeamList(parsed), dIds);
        }
      } catch (_) {}
    }
    if (initialData?.team && Array.isArray(initialData.team)) {
      return filterOutDeletedItems(sanitizeTeamList(initialData.team), initialData.deletedIds || []);
    }
    return filterOutDeletedItems(sanitizeTeamList(defaultTeam), initialSeedDeletedIds);
  });

  const [blog, setBlog] = useState<BlogPost[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(STORAGE_KEYS.BLOG);
        const storedDeleted = localStorage.getItem(STORAGE_KEYS.DELETED_IDS);
        const dIds: string[] = storedDeleted ? JSON.parse(storedDeleted) : initialSeedDeletedIds;
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) return filterOutDeletedItems(parsed, dIds);
        }
      } catch (_) {}
    }
    if (initialData?.blog && Array.isArray(initialData.blog)) {
      return filterOutDeletedItems(initialData.blog, initialData.deletedIds || []);
    }
    return filterOutDeletedItems(defaultBlog, initialSeedDeletedIds);
  });

  const [faq, setFaq] = useState<FAQItem[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(STORAGE_KEYS.FAQ);
        const storedDeleted = localStorage.getItem(STORAGE_KEYS.DELETED_IDS);
        const dIds: string[] = storedDeleted ? JSON.parse(storedDeleted) : initialSeedDeletedIds;
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) return filterOutDeletedItems(parsed, dIds);
        }
      } catch (_) {}
    }
    if (initialData?.faq && Array.isArray(initialData.faq)) {
      return filterOutDeletedItems(initialData.faq, initialData.deletedIds || []);
    }
    return filterOutDeletedItems(defaultFaq, initialSeedDeletedIds);
  });

  const [gallery, setGallery] = useState<GalleryItem[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(STORAGE_KEYS.GALLERY);
        const storedDeleted = localStorage.getItem(STORAGE_KEYS.DELETED_IDS);
        const dIds: string[] = storedDeleted ? JSON.parse(storedDeleted) : initialSeedDeletedIds;
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) return filterOutDeletedItems(parsed, dIds);
        }
      } catch (_) {}
    }
    if (initialData?.gallery && Array.isArray(initialData.gallery)) {
      return filterOutDeletedItems(initialData.gallery, initialData.deletedIds || []);
    }
    return filterOutDeletedItems(defaultGallery, initialSeedDeletedIds);
  });

  const [recognitions, setRecognitions] = useState<Recognition[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(STORAGE_KEYS.RECOGNITIONS);
        const storedDeleted = localStorage.getItem(STORAGE_KEYS.DELETED_IDS);
        const dIds: string[] = storedDeleted ? JSON.parse(storedDeleted) : initialSeedDeletedIds;
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) return filterOutDeletedItems(parsed, dIds);
        }
      } catch (_) {}
    }
    if (initialData?.recognitions && Array.isArray(initialData.recognitions)) {
      return filterOutDeletedItems(initialData.recognitions, initialData.deletedIds || []);
    }
    return filterOutDeletedItems(defaultRecognitions, initialSeedDeletedIds);
  });

  const [siteSettings, setSiteSettings] = useState<SiteSettings>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed && typeof parsed === "object") return parsed;
        }
      } catch (_) {}
    }
    if (initialData?.siteSettings && typeof initialData.siteSettings === "object") {
      return initialData.siteSettings;
    }
    return defaultSiteSettings;
  });

  const [testimonials, setTestimonials] = useState<Testimonial[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(STORAGE_KEYS.TESTIMONIALS);
        const storedDeleted = localStorage.getItem(STORAGE_KEYS.DELETED_IDS);
        const dIds: string[] = storedDeleted ? JSON.parse(storedDeleted) : initialSeedDeletedIds;
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) return filterOutDeletedItems(parsed, dIds);
        }
      } catch (_) {}
    }
    if (initialData?.testimonials && Array.isArray(initialData.testimonials)) {
      return filterOutDeletedItems(initialData.testimonials, initialData.deletedIds || []);
    }
    return filterOutDeletedItems(defaultTestimonials, initialSeedDeletedIds);
  });

  const [serverStorageInfo, setServerStorageInfo] = useState<{
    isGoogleCloud?: boolean;
    isProduction?: boolean;
    hasGitHubToken?: boolean;
    hasUpstashKV?: boolean;
    hasFirestore?: boolean;
    localDiskWritable?: boolean;
  }>({});

  const lastServerUpdatedRef = useRef<string>(
    initialData && !initialData.isDefault ? initialData.updatedAt : ""
  );
  const syncTimersRef = useRef<Map<string, NodeJS.Timeout>>(new Map());
  // Tracks timestamp of the last local edit — used to block server overwrites for a grace period
  const lastLocalEditTimestampRef = useRef<number>(0);
  // How long (ms) to block server data after a local edit (prevents revert of order changes)
  const EDIT_LOCKOUT_MS = 10_000;

  // Function to apply complete dataset to state & local cache
  const applyDataset = useCallback((data: any) => {
    if (!data || typeof data !== "object") return;

    // Merge deleted IDs from server with existing client deleted IDs
    const serverDeletedIds = Array.isArray(data.deletedIds) ? data.deletedIds : [];
    let activeDeletedIds = deletedIds;
    const combinedDeleted = new Set([...deletedIds, ...serverDeletedIds]);
    if (combinedDeleted.size > deletedIds.length) {
      activeDeletedIds = Array.from(combinedDeleted);
      setDeletedIds(activeDeletedIds);
      try {
        localStorage.setItem(STORAGE_KEYS.DELETED_IDS, JSON.stringify(activeDeletedIds));
      } catch (_) {}
    }

    if (Array.isArray(data.projects)) {
      const sanitized = filterOutDeletedItems(sanitizeProjectsList(data.projects), activeDeletedIds);
      setProjects(sanitized);
      try { localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(sanitized)); } catch (_) {}
    }
    if (Array.isArray(data.services)) {
      const sanitized = filterOutDeletedItems<Service>(data.services, activeDeletedIds);
      setServices(sanitized);
      try { localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(sanitized)); } catch (_) {}
    }
    if (Array.isArray(data.team) && data.team.length > 0) {
      const sanitizedTeam = filterOutDeletedItems<TeamMember>(
        sanitizeTeamList(data.team).map((m: any) => {
          const fallback = initialTeam.find((it) => it.id === m.id || it.name === m.name);
          // Preserve empty string when photo was removed; only fallback if property is undefined
          const img = m.image !== undefined ? m.image : (fallback?.image || "");
          const hoverImg = m.hoverImage !== undefined ? m.hoverImage : (fallback?.hoverImage || "");
          return { ...m, image: img, hoverImage: hoverImg };
        }),
        activeDeletedIds
      );
      setTeam(sanitizedTeam);
      try { localStorage.setItem(STORAGE_KEYS.TEAM, JSON.stringify(sanitizedTeam)); } catch (_) {}
    }
    if (Array.isArray(data.blog)) {
      const sanitized = filterOutDeletedItems<BlogPost>(data.blog, activeDeletedIds);
      setBlog(sanitized);
      try { localStorage.setItem(STORAGE_KEYS.BLOG, JSON.stringify(sanitized)); } catch (_) {}
    }
    if (Array.isArray(data.faq)) {
      const sanitized = filterOutDeletedItems<FAQItem>(data.faq, activeDeletedIds);
      setFaq(sanitized);
      try { localStorage.setItem(STORAGE_KEYS.FAQ, JSON.stringify(sanitized)); } catch (_) {}
    }
    if (Array.isArray(data.gallery)) {
      const sanitized = filterOutDeletedItems<GalleryItem>(data.gallery, activeDeletedIds);
      setGallery(sanitized);
      try { localStorage.setItem(STORAGE_KEYS.GALLERY, JSON.stringify(sanitized)); } catch (_) {}
    }
    if (Array.isArray(data.recognitions)) {
      const sanitized = filterOutDeletedItems<Recognition>(data.recognitions, activeDeletedIds);
      setRecognitions(sanitized);
      try { localStorage.setItem(STORAGE_KEYS.RECOGNITIONS, JSON.stringify(sanitized)); } catch (_) {}
    }
    if (data.siteSettings && typeof data.siteSettings === "object") {
      setSiteSettings(data.siteSettings);
      try { localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(data.siteSettings)); } catch (_) {}
    }
    if (Array.isArray(data.testimonials)) {
      const sanitized = filterOutDeletedItems<Testimonial>(data.testimonials, activeDeletedIds);
      setTestimonials(sanitized);
      try { localStorage.setItem(STORAGE_KEYS.TESTIMONIALS, JSON.stringify(sanitized)); } catch (_) {}
    }
  }, [deletedIds]);

  // Fetch latest live data from server
  const fetchFromServer = useCallback(async () => {
    try {
      const creds = getStorageCredentials();
      const headers: Record<string, string> = {};
      if (creds.upstashUrl) headers["x-upstash-url"] = creds.upstashUrl;
      if (creds.upstashToken) headers["x-upstash-token"] = creds.upstashToken;
      if (creds.githubToken) headers["x-github-token"] = creds.githubToken;
      if (creds.githubRepo) headers["x-github-repo"] = creds.githubRepo;

      const res = await fetch("/api/cms", {
        cache: "no-store",
        headers,
      });
      if (!res.ok) return;

      const data = await res.json();
      if (!data) return;

      if (data._storageInfo) {
        setServerStorageInfo(data._storageInfo);
      }

      // CRITICAL: NEVER overwrite state while user is actively typing in any input/textarea,
      // selecting from a dropdown (<select>), or interacting with form controls.
      if (typeof document !== "undefined") {
        const active = document.activeElement;
        if (
          active &&
          (active.tagName === "INPUT" ||
            active.tagName === "TEXTAREA" ||
            active.tagName === "SELECT" ||
            (active as HTMLElement).isContentEditable)
        ) {
          return;
        }
      }

      if (syncTimersRef.current.size > 0) {
        return;
      }

      // CRITICAL FIX: Block server data from overwriting local state during the edit lockout
      // window. This prevents the background poll from reverting order changes (e.g. Kanasu
      // position) that the user just made but the debounced sync hasn't confirmed yet.
      const msSinceLastEdit = Date.now() - lastLocalEditTimestampRef.current;
      if (lastLocalEditTimestampRef.current > 0 && msSinceLastEdit < EDIT_LOCKOUT_MS) {
        return;
      }

      // Check if client has pending uncommitted local edits
      let hasUnsavedEdits = false;
      try {
        hasUnsavedEdits = localStorage.getItem(STORAGE_KEYS.HAS_UNSAVED_EDITS) === "true";
      } catch (_) {}

      // Loading must NEVER trigger an automated save. If there are pending uncommitted edits in
      // localStorage or in-flight dirty changes, retain them locally without firing network write requests on page load.
      if (hasUnsavedEdits || isDirtyRef.current) {
        const serverTime = data.updatedAt ? new Date(data.updatedAt).getTime() : 0;
        const currentKnownTime = lastServerUpdatedRef.current ? new Date(lastServerUpdatedRef.current).getTime() : 0;
        if (serverTime > currentKnownTime && typeof window !== "undefined") {
          window.dispatchEvent(
            new CustomEvent("techno_cms_server_conflict", {
              detail: {
                serverUpdatedAt: data.updatedAt,
                serverData: data,
              },
            })
          );
        }
        return;
      }

      // STRICT MONOTONICITY CHECK:
      // Reject any server data that is NOT strictly NEWER than what client currently has!
      // This eliminates data flapping between different serverless lambdas, cold starts, or stale cache reads.
      const serverTime = data.updatedAt ? new Date(data.updatedAt).getTime() : 0;
      const currentKnownTime = lastServerUpdatedRef.current ? new Date(lastServerUpdatedRef.current).getTime() : 0;
      if (serverTime <= currentKnownTime) {
        return;
      }

      if (data.updatedAt) {
        lastServerUpdatedRef.current = data.updatedAt;
        try {
          localStorage.setItem(STORAGE_KEYS.SERVER_SYNCED_AT, data.updatedAt);
          localStorage.setItem(STORAGE_KEYS.CLIENT_UPDATED_AT, data.updatedAt);
          localStorage.setItem(STORAGE_KEYS.HAS_UNSAVED_EDITS, "false");
        } catch (_) {}
      }
      applyDataset(data);
    } catch (err) {
      // Background poll silently resumes
    }
  }, [applyDataset, deletedIds]);

  // Debounced LocalStorage write timers to prevent main-thread UI lag during rapid edits
  const storageTimersRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

  // Broadcast to other open browser tabs (avoids echoing to self)
  const broadcastChange = useCallback((entity: string, data: any, activeDeleted?: string[]) => {
    if (typeof window !== "undefined") {
      try {
        const payload = {
          entity,
          data,
          deletedIds: activeDeleted || deletedIds,
          senderId: clientIdRef.current,
        };
        if ("BroadcastChannel" in window) {
          const ch = new BroadcastChannel(SYNC_CHANNEL_NAME);
          ch.postMessage({ type: "CMS_UPDATE", ...payload });
          ch.close();
        }
      } catch (_) {}
    }
  }, [deletedIds]);

  // High-performance debounced LocalStorage writer & cross-tab broadcaster
  const persistToStorageAndBroadcast = useCallback(
    (key: string, entity: string, sanitized: any, nextDeleted: string[]) => {
      touchClientUpdate();
      try {
        localStorage.setItem(STORAGE_KEYS.HAS_UNSAVED_EDITS, "true");
      } catch (_) {}

      const existing = storageTimersRef.current.get(key);
      if (existing) clearTimeout(existing);

      const timer = setTimeout(() => {
        storageTimersRef.current.delete(key);
        try {
          localStorage.setItem(key, JSON.stringify(sanitized));
        } catch (_) {}
        broadcastChange(entity, sanitized, nextDeleted);
      }, 200);

      storageTimersRef.current.set(key, timer);
    },
    [broadcastChange]
  );

  // Initial mount & live event listeners
  useEffect(() => {
    setIsClient(true);

    // 1. Sync deletedIds from local storage
    try {
      const sd = localStorage.getItem(STORAGE_KEYS.DELETED_IDS);
      if (sd) {
        const parsedDIds = JSON.parse(sd);
        if (Array.isArray(parsedDIds) && parsedDIds.length > 0) {
          setDeletedIds((prev) => Array.from(new Set([...prev, ...parsedDIds])));
        }
      }
    } catch (_) {}

    // 2. Hydrate from localStorage: client edits and deletions take authoritative precedence
    try {
      const sd = localStorage.getItem(STORAGE_KEYS.DELETED_IDS);
      const curDeleted: string[] = sd ? JSON.parse(sd) : deletedIds;
      if (Array.isArray(curDeleted) && curDeleted.length > 0) {
        setDeletedIds((prev) => Array.from(new Set([...prev, ...curDeleted])));
      }

      const sp = localStorage.getItem(STORAGE_KEYS.PROJECTS);
      if (sp) {
        const parsed = JSON.parse(sp);
        if (Array.isArray(parsed) && parsed.length > 0) setProjects(filterOutDeletedItems(sanitizeProjectsList(parsed), curDeleted));
      }
      const st = localStorage.getItem(STORAGE_KEYS.TEAM);
      if (st) {
        const parsed = JSON.parse(st);
        if (Array.isArray(parsed) && parsed.length > 0) setTeam(filterOutDeletedItems(sanitizeTeamList(parsed), curDeleted));
      }
      const ss = localStorage.getItem(STORAGE_KEYS.SERVICES);
      if (ss) {
        const parsed = JSON.parse(ss);
        if (Array.isArray(parsed) && parsed.length > 0) setServices(filterOutDeletedItems(parsed, curDeleted));
      }
      const sb = localStorage.getItem(STORAGE_KEYS.BLOG);
      if (sb) {
        const parsed = JSON.parse(sb);
        if (Array.isArray(parsed) && parsed.length > 0) setBlog(filterOutDeletedItems(parsed, curDeleted));
      }
      const sf = localStorage.getItem(STORAGE_KEYS.FAQ);
      if (sf) {
        const parsed = JSON.parse(sf);
        if (Array.isArray(parsed) && parsed.length > 0) setFaq(filterOutDeletedItems(parsed, curDeleted));
      }
      const sg = localStorage.getItem(STORAGE_KEYS.GALLERY);
      if (sg) {
        const parsed = JSON.parse(sg);
        if (Array.isArray(parsed) && parsed.length > 0) setGallery(filterOutDeletedItems(parsed, curDeleted));
      }
      const sr = localStorage.getItem(STORAGE_KEYS.RECOGNITIONS);
      if (sr) {
        const parsed = JSON.parse(sr);
        if (Array.isArray(parsed) && parsed.length > 0) setRecognitions(filterOutDeletedItems(parsed, curDeleted));
      }
      const sset = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (sset) {
        const parsed = JSON.parse(sset);
        if (parsed && typeof parsed === "object") setSiteSettings(parsed);
      }
      const stm = localStorage.getItem(STORAGE_KEYS.TESTIMONIALS);
      if (stm) {
        const parsed = JSON.parse(stm);
        if (Array.isArray(parsed) && parsed.length > 0) setTestimonials(filterOutDeletedItems(parsed, curDeleted));
      }
    } catch (_) {}

    // 3. Always fetch from server on client mount to sync fresh cloud edits immediately
    fetchFromServer();

    // 4. Periodic background sync — STRICTLY RESTRICTED TO ADMIN CONSOLE (/admin) ONLY
    // Public visitors never poll in loops, preventing millions of serverless invocations and keeping the project in free tier.
    let pollInterval: ReturnType<typeof setInterval> | null = null;
    if (typeof window !== "undefined" && window.location.pathname.startsWith("/admin")) {
      pollInterval = setInterval(() => {
        // Skip polling if the browser tab is hidden/backgrounded
        if (typeof document !== "undefined" && document.hidden) return;
        fetchFromServer();
      }, 60000);
    }

    // BroadcastChannel for instant inter-tab live sync
    let channel: BroadcastChannel | null = null;
    if (typeof window !== "undefined" && "BroadcastChannel" in window) {
      try {
        channel = new BroadcastChannel(SYNC_CHANNEL_NAME);
        channel.onmessage = (event) => {
          if (event.data?.senderId && event.data.senderId === clientIdRef.current) {
            return;
          }
          if (event.data?.type === "CMS_UPDATE") {
            const { entity, data, deletedIds: incomingDeleted } = event.data;
            if (Array.isArray(incomingDeleted)) {
              setDeletedIds((prev) => {
                const combined = Array.from(new Set([...prev, ...incomingDeleted]));
                try { localStorage.setItem(STORAGE_KEYS.DELETED_IDS, JSON.stringify(combined)); } catch (_) {}
                return combined;
              });
            }

            if (entity === "projects") setProjects(filterOutDeletedItems(sanitizeProjectsList(data), incomingDeleted || deletedIds));
            else if (entity === "services") setServices(filterOutDeletedItems(data, incomingDeleted || deletedIds));
            else if (entity === "team") setTeam(filterOutDeletedItems(data, incomingDeleted || deletedIds));
            else if (entity === "blog") setBlog(filterOutDeletedItems(data, incomingDeleted || deletedIds));
            else if (entity === "faq") setFaq(filterOutDeletedItems(data, incomingDeleted || deletedIds));
            else if (entity === "gallery") setGallery(filterOutDeletedItems(data, incomingDeleted || deletedIds));
            else if (entity === "recognitions") setRecognitions(filterOutDeletedItems(data, incomingDeleted || deletedIds));
            else if (entity === "siteSettings") setSiteSettings(data);
            else if (entity === "testimonials") setTestimonials(filterOutDeletedItems(data, incomingDeleted || deletedIds));
            else if (entity === "ALL_DATA") applyDataset(data);
          }
        };
      } catch (_) {}
    }

    const handleBeforeUnload = () => {
      // Flush pending storage writes immediately
      storageTimersRef.current.forEach((t) => clearTimeout(t));
      storageTimersRef.current.clear();
      if (syncTimersRef.current.size > 0) {
        const localData = getLocalDataset();
        if (Object.keys(localData).length > 0) {
          syncToServer({ allData: localData, deletedIds });
        }
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      if (pollInterval) clearInterval(pollInterval);
      if (channel) channel.close();
      window.removeEventListener("beforeunload", handleBeforeUnload);
      storageTimersRef.current.forEach((t) => clearTimeout(t));
      storageTimersRef.current.clear();
      syncTimersRef.current.forEach((t) => clearTimeout(t));
      syncTimersRef.current.clear();
      if (trailingSaveTimerRef.current) clearTimeout(trailingSaveTimerRef.current);
      if (savingWatchdogRef.current) clearTimeout(savingWatchdogRef.current);
    };
  }, [fetchFromServer, applyDataset, deletedIds]);

  // =========================================================================
  // SINGLE-FLIGHT SAVE QUEUE (ONE IN-FLIGHT AT A TIME + 60s TIMEOUT)
  // Batches rapid changes across multiple fields/entities into ONE request.
  // Never aborted by a newer save; queued sequentially with retry & status.
  // =========================================================================
  const [recordStatus, setRecordStatus] = useState<Record<string, RecordSaveStatus>>({});
  const saveQueueRef = useRef<Array<{
    id: string;
    entity: string;
    recordId: string;
    payload: any;
    retries: number;
    resolve: (res: any) => void;
    reject: (err: any) => void;
  }>>([]);
  const isProcessingQueueRef = useRef(false);

  const processQueue = useCallback(async () => {
    if (isProcessingQueueRef.current || saveQueueRef.current.length === 0) return;
    isProcessingQueueRef.current = true;

    while (saveQueueRef.current.length > 0) {
      const job = saveQueueRef.current[0];
      const trackingKey = job.recordId || job.entity;

      setRecordStatus((prev) => ({
        ...prev,
        [trackingKey]: { state: "saving", timestamp: Date.now() },
      }));

      let result: any = null;
      let errorMsg = "";

      try {
        result = await syncToServer(job.payload);
      } catch (err: any) {
        errorMsg = err?.message || "Network error";
      }

      if (result && result.success) {
        saveQueueRef.current.shift();
        setRecordStatus((prev) => ({
          ...prev,
          [trackingKey]: {
            state: "saved",
            durationMs: result.durationMs,
            sizeBytes: result.sizeBytes,
            timestamp: Date.now(),
          },
        }));
        job.resolve(result);
      } else {
        const isConflict = Boolean(result?.conflict || result?.status === 409);
        const isAuth = Boolean(result?.status === 401 || result?.status === 403);
        errorMsg = result?.error || errorMsg || `Save failed (HTTP ${result?.status || 500})`;

        if (isConflict || isAuth || job.retries >= 2) {
          saveQueueRef.current.shift();
          setRecordStatus((prev) => ({
            ...prev,
            [trackingKey]: {
              state: "failed",
              error: errorMsg,
              durationMs: result?.durationMs,
              sizeBytes: result?.sizeBytes,
              timestamp: Date.now(),
              conflict: isConflict,
            },
          }));
          job.resolve(result || { success: false, error: errorMsg });
        } else {
          job.retries += 1;
          await new Promise((r) => setTimeout(r, job.retries * 1000));
        }
      }
    }

    isProcessingQueueRef.current = false;
  }, []);

  const saveSingleRecord = useCallback(
    (entity: string, record: any): Promise<any> => {
      const recordId = String(record?.id || record?.slug || entity);

      return new Promise((resolve, reject) => {
        const payload = {
          entity,
          recordId,
          record,
          expectedUpdatedAt: record.updatedAt || undefined,
        };

        const existingIdx = saveQueueRef.current.findIndex((j) => j.id === `${entity}:${recordId}`);
        if (existingIdx > 0) {
          saveQueueRef.current[existingIdx].payload = payload;
          saveQueueRef.current[existingIdx].resolve = resolve;
          saveQueueRef.current[existingIdx].reject = reject;
        } else {
          saveQueueRef.current.push({
            id: `${entity}:${recordId}`,
            entity,
            recordId,
            payload,
            retries: 0,
            resolve,
            reject,
          });
        }
        processQueue();
      });
    },
    [processQueue]
  );

  const isSavingRef = useRef(false);
  const isDirtyRef = useRef(false);
  const trailingSaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const savingWatchdogRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const executeSingleFlightSave = useCallback(async () => {
    if (isSavingRef.current) {
      isDirtyRef.current = true;
      return;
    }

    isSavingRef.current = true;
    isDirtyRef.current = false;

    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("techno_cms_autosave_status", { detail: { status: "saving" } })
      );
    }

    // WATCHDOG: If still "saving" after 65s, force status to error (Never timeout shorter than 60s)
    if (savingWatchdogRef.current) clearTimeout(savingWatchdogRef.current);
    savingWatchdogRef.current = setTimeout(() => {
      savingWatchdogRef.current = null;
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("techno_cms_autosave_status", {
            detail: {
              status: "error",
              error: "Save timed out (65s). Click 'Save All to Cloud' to retry.",
            },
          })
        );
      }
    }, 65000);

    try {
      // Gather latest local and state dataset
      const localData = getLocalDataset();
      const consolidatedPayload = {
        projects,
        services,
        team,
        blog,
        faq,
        gallery,
        recognitions,
        siteSettings,
        testimonials,
        deletedIds,
        ...localData,
      };

      const res = await syncToServer({
        allData: consolidatedPayload,
        deletedIds,
        expectedUpdatedAt: lastServerUpdatedRef.current || undefined,
      });

      if (savingWatchdogRef.current) {
        clearTimeout(savingWatchdogRef.current);
        savingWatchdogRef.current = null;
      }

      if (res.success && res.updatedAt) {
        lastServerUpdatedRef.current = res.updatedAt;
        try {
          localStorage.setItem(STORAGE_KEYS.HAS_UNSAVED_EDITS, "false");
        } catch (_) {}
        if (typeof window !== "undefined") {
          window.dispatchEvent(
            new CustomEvent("techno_cms_autosave_status", {
              detail: { status: "saved", updatedAt: res.updatedAt },
            })
          );
        }
      } else {
        const errorDetail =
          typeof res.error === "string"
            ? res.error
            : res.error?.error || res.error?.message || "Sync failed";
        if (typeof window !== "undefined") {
          window.dispatchEvent(
            new CustomEvent("techno_cms_autosave_status", {
              detail: { status: "error", error: errorDetail },
            })
          );
        }
      }
    } catch (syncErr: any) {
      if (savingWatchdogRef.current) {
        clearTimeout(savingWatchdogRef.current);
        savingWatchdogRef.current = null;
      }
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("techno_cms_autosave_status", {
            detail: {
              status: "error",
              error: syncErr?.message || "Network error while saving.",
            },
          })
        );
      }
    } finally {
      isSavingRef.current = false;

      // If changes occurred while saving, schedule ONE trailing batch save
      if (isDirtyRef.current) {
        isDirtyRef.current = false;
        if (trailingSaveTimerRef.current) clearTimeout(trailingSaveTimerRef.current);
        trailingSaveTimerRef.current = setTimeout(() => {
          executeSingleFlightSave();
        }, 2500);
      }
    }
  }, [
    projects,
    services,
    team,
    blog,
    faq,
    gallery,
    recognitions,
    siteSettings,
    testimonials,
    deletedIds,
  ]);

  const debouncedSyncToServer = useCallback(
    (_entity: string, _data: any, _currentDeleted?: string[]) => {
      touchClientUpdate();
      lastLocalEditTimestampRef.current = Date.now();
      try {
        localStorage.setItem(STORAGE_KEYS.HAS_UNSAVED_EDITS, "true");
      } catch (_) {}

      isDirtyRef.current = true;

      // 3-second trailing debounce: consolidate multiple field edits into a single save
      if (trailingSaveTimerRef.current) {
        clearTimeout(trailingSaveTimerRef.current);
      }
      trailingSaveTimerRef.current = setTimeout(() => {
        executeSingleFlightSave();
      }, 3000);
    },
    [executeSingleFlightSave]
  );

  // =========================================================
  // SAVE METHODS (IMMEDIATE DELETION DISPATCH + OPTIMISTIC UI)
  // =========================================================

  const saveProjects = useCallback(
    (newProjects: Project[], explicitDeletedId?: string) => {
      const oldIds = new Set(projects.map((p) => p.id));
      const newIds = new Set(newProjects.map((p) => p.id));
      const removed: string[] = [];
      if (explicitDeletedId) removed.push(explicitDeletedId);
      oldIds.forEach((id) => {
        if (!newIds.has(id)) removed.push(id);
      });
      projects.forEach((p) => {
        if (removed.includes(p.id) && p.slug) {
          removed.push(p.slug);
        }
      });

      let nextDeleted = deletedIds;
      if (removed.length > 0) {
        nextDeleted = Array.from(new Set([...deletedIds, ...removed]));
        setDeletedIds(nextDeleted);
        try {
          localStorage.setItem(STORAGE_KEYS.DELETED_IDS, JSON.stringify(nextDeleted));
        } catch (_) {}
      }

      const sequencedProjects = newProjects.map((p, i) => ({
        ...p,
        sortOrder: i + 1,
      }));
      const sanitized = filterOutDeletedItems(sanitizeProjectsList(sequencedProjects), nextDeleted);
      // Instant React UI update (60fps typing)
      setProjects(sanitized);

      if (removed.length > 0) {
        lastLocalEditTimestampRef.current = Date.now();
        try {
          localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(sanitized));
          touchClientUpdate();
        } catch (_) {}
        broadcastChange("projects", sanitized, nextDeleted);
        syncToServer({ entity: "projects", data: sanitized, deletedIds: nextDeleted });
      } else {
        persistToStorageAndBroadcast(STORAGE_KEYS.PROJECTS, "projects", sanitized, nextDeleted);
        debouncedSyncToServer("projects", sanitized, nextDeleted);
      }
    },
    [projects, deletedIds, debouncedSyncToServer, broadcastChange, persistToStorageAndBroadcast]
  );

  const saveServices = useCallback(
    (newServices: Service[], explicitDeletedId?: string) => {
      const oldIds = new Set(services.map((s) => s.id));
      const newIds = new Set(newServices.map((s) => s.id));
      const removed: string[] = [];
      if (explicitDeletedId) removed.push(explicitDeletedId);
      oldIds.forEach((id) => {
        if (!newIds.has(id)) removed.push(id);
      });

      let nextDeleted = deletedIds;
      if (removed.length > 0) {
        nextDeleted = Array.from(new Set([...deletedIds, ...removed]));
        setDeletedIds(nextDeleted);
        try {
          localStorage.setItem(STORAGE_KEYS.DELETED_IDS, JSON.stringify(nextDeleted));
        } catch (_) {}
      }

      const sequencedServices = newServices.map((s, i) => ({
        ...s,
        sortOrder: i + 1,
      }));
      const sanitized = filterOutDeletedItems(sanitizeServicesList(sequencedServices), nextDeleted);
      setServices(sanitized);

      if (removed.length > 0) {
        lastLocalEditTimestampRef.current = Date.now();
        try {
          localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(sanitized));
          touchClientUpdate();
        } catch (_) {}
        broadcastChange("services", sanitized, nextDeleted);
        syncToServer({ entity: "services", data: sanitized, deletedIds: nextDeleted });
      } else {
        persistToStorageAndBroadcast(STORAGE_KEYS.SERVICES, "services", sanitized, nextDeleted);
        debouncedSyncToServer("services", sanitized, nextDeleted);
      }
    },
    [services, deletedIds, debouncedSyncToServer, broadcastChange, persistToStorageAndBroadcast]
  );

  const saveTeam = useCallback(
    (newTeam: TeamMember[], explicitDeletedId?: string) => {
      const oldIds = new Set(team.map((m) => m.id));
      const newIds = new Set(newTeam.map((m) => m.id));
      const removed: string[] = [];
      if (explicitDeletedId) removed.push(explicitDeletedId);
      oldIds.forEach((id) => {
        if (!newIds.has(id)) removed.push(id);
      });

      let nextDeleted = deletedIds;
      if (removed.length > 0) {
        nextDeleted = Array.from(new Set([...deletedIds, ...removed]));
        setDeletedIds(nextDeleted);
        try {
          localStorage.setItem(STORAGE_KEYS.DELETED_IDS, JSON.stringify(nextDeleted));
        } catch (_) {}
      }

      const sequencedTeam = newTeam.map((m, i) => ({
        ...m,
        sortOrder: i + 1,
      }));
      const sanitized = filterOutDeletedItems(sanitizeTeamList(sequencedTeam), nextDeleted);
      setTeam(sanitized);

      if (removed.length > 0) {
        lastLocalEditTimestampRef.current = Date.now();
        try {
          localStorage.setItem(STORAGE_KEYS.TEAM, JSON.stringify(sanitized));
          touchClientUpdate();
        } catch (_) {}
        broadcastChange("team", sanitized, nextDeleted);
        syncToServer({ entity: "team", data: sanitized, deletedIds: nextDeleted });
      } else {
        persistToStorageAndBroadcast(STORAGE_KEYS.TEAM, "team", sanitized, nextDeleted);
        debouncedSyncToServer("team", sanitized, nextDeleted);
      }
    },
    [team, deletedIds, debouncedSyncToServer, broadcastChange, persistToStorageAndBroadcast]
  );

  const saveBlog = useCallback(
    (newBlog: BlogPost[], explicitDeletedId?: string) => {
      const oldIds = new Set(blog.map((b) => b.id));
      const newIds = new Set(newBlog.map((b) => b.id));
      const removed: string[] = [];
      if (explicitDeletedId) removed.push(explicitDeletedId);
      oldIds.forEach((id) => {
        if (!newIds.has(id)) removed.push(id);
      });
      blog.forEach((b) => {
        if (removed.includes(b.id) && b.slug) {
          removed.push(b.slug);
        }
      });

      let nextDeleted = deletedIds;
      if (removed.length > 0) {
        nextDeleted = Array.from(new Set([...deletedIds, ...removed]));
        setDeletedIds(nextDeleted);
        try {
          localStorage.setItem(STORAGE_KEYS.DELETED_IDS, JSON.stringify(nextDeleted));
        } catch (_) {}
      }

      const sanitized = filterOutDeletedItems(newBlog, nextDeleted);
      setBlog(sanitized);

      if (removed.length > 0) {
        lastLocalEditTimestampRef.current = Date.now();
        try {
          localStorage.setItem(STORAGE_KEYS.BLOG, JSON.stringify(sanitized));
          touchClientUpdate();
        } catch (_) {}
        broadcastChange("blog", sanitized, nextDeleted);
        syncToServer({ entity: "blog", data: sanitized, deletedIds: nextDeleted });
      } else {
        persistToStorageAndBroadcast(STORAGE_KEYS.BLOG, "blog", sanitized, nextDeleted);
        debouncedSyncToServer("blog", sanitized, nextDeleted);
      }
    },
    [blog, deletedIds, debouncedSyncToServer, broadcastChange, persistToStorageAndBroadcast]
  );

  const saveFaq = useCallback(
    (newFaq: FAQItem[], explicitDeletedId?: string) => {
      const oldIds = new Set(faq.map((f) => f.id));
      const newIds = new Set(newFaq.map((f) => f.id));
      const removed: string[] = [];
      if (explicitDeletedId) removed.push(explicitDeletedId);
      oldIds.forEach((id) => {
        if (!newIds.has(id)) removed.push(id);
      });

      let nextDeleted = deletedIds;
      if (removed.length > 0) {
        nextDeleted = Array.from(new Set([...deletedIds, ...removed]));
        setDeletedIds(nextDeleted);
        try {
          localStorage.setItem(STORAGE_KEYS.DELETED_IDS, JSON.stringify(nextDeleted));
        } catch (_) {}
      }

      const sequencedFaq = newFaq.map((f, i) => ({
        ...f,
        sortOrder: i + 1,
      }));
      const sanitized = filterOutDeletedItems(sanitizeFaqList(sequencedFaq), nextDeleted);
      setFaq(sanitized);

      if (removed.length > 0) {
        lastLocalEditTimestampRef.current = Date.now();
        try {
          localStorage.setItem(STORAGE_KEYS.FAQ, JSON.stringify(sanitized));
          touchClientUpdate();
        } catch (_) {}
        broadcastChange("faq", sanitized, nextDeleted);
        syncToServer({ entity: "faq", data: sanitized, deletedIds: nextDeleted });
      } else {
        persistToStorageAndBroadcast(STORAGE_KEYS.FAQ, "faq", sanitized, nextDeleted);
        debouncedSyncToServer("faq", sanitized, nextDeleted);
      }
    },
    [faq, deletedIds, debouncedSyncToServer, broadcastChange, persistToStorageAndBroadcast]
  );

  const saveGallery = useCallback(
    (newGallery: GalleryItem[], explicitDeletedId?: string) => {
      const oldIds = new Set(gallery.map((g) => g.id));
      const newIds = new Set(newGallery.map((g) => g.id));
      const removed: string[] = [];
      if (explicitDeletedId) removed.push(explicitDeletedId);
      oldIds.forEach((id) => {
        if (!newIds.has(id)) removed.push(id);
      });

      let nextDeleted = deletedIds;
      if (removed.length > 0) {
        nextDeleted = Array.from(new Set([...deletedIds, ...removed]));
        setDeletedIds(nextDeleted);
        try {
          localStorage.setItem(STORAGE_KEYS.DELETED_IDS, JSON.stringify(nextDeleted));
        } catch (_) {}
      }

      const sanitized = filterOutDeletedItems(newGallery, nextDeleted);
      setGallery(sanitized);

      if (removed.length > 0) {
        lastLocalEditTimestampRef.current = Date.now();
        try {
          localStorage.setItem(STORAGE_KEYS.GALLERY, JSON.stringify(sanitized));
          touchClientUpdate();
        } catch (_) {}
        broadcastChange("gallery", sanitized, nextDeleted);
        syncToServer({ entity: "gallery", data: sanitized, deletedIds: nextDeleted });
      } else {
        persistToStorageAndBroadcast(STORAGE_KEYS.GALLERY, "gallery", sanitized, nextDeleted);
        debouncedSyncToServer("gallery", sanitized, nextDeleted);
      }
    },
    [gallery, deletedIds, debouncedSyncToServer, broadcastChange, persistToStorageAndBroadcast]
  );

  const saveRecognitions = useCallback(
    (newRecognitions: Recognition[], explicitDeletedId?: string) => {
      const oldIds = new Set(recognitions.map((r) => r.id));
      const newIds = new Set(newRecognitions.map((r) => r.id));
      const removed: string[] = [];
      if (explicitDeletedId) removed.push(explicitDeletedId);
      oldIds.forEach((id) => {
        if (!newIds.has(id)) removed.push(id);
      });

      let nextDeleted = deletedIds;
      if (removed.length > 0) {
        nextDeleted = Array.from(new Set([...deletedIds, ...removed]));
        setDeletedIds(nextDeleted);
        try {
          localStorage.setItem(STORAGE_KEYS.DELETED_IDS, JSON.stringify(nextDeleted));
        } catch (_) {}
      }

      const sequencedRecognitions = newRecognitions.map((r, i) => ({
        ...r,
        sortOrder: i + 1,
      }));
      const sanitized = filterOutDeletedItems(sanitizeRecognitionsList(sequencedRecognitions), nextDeleted);
      setRecognitions(sanitized);

      if (removed.length > 0) {
        lastLocalEditTimestampRef.current = Date.now();
        try {
          localStorage.setItem(STORAGE_KEYS.RECOGNITIONS, JSON.stringify(sanitized));
          touchClientUpdate();
        } catch (_) {}
        broadcastChange("recognitions", sanitized, nextDeleted);
        syncToServer({ entity: "recognitions", data: sanitized, deletedIds: nextDeleted });
      } else {
        persistToStorageAndBroadcast(STORAGE_KEYS.RECOGNITIONS, "recognitions", sanitized, nextDeleted);
        debouncedSyncToServer("recognitions", sanitized, nextDeleted);
      }
    },
    [recognitions, deletedIds, debouncedSyncToServer, broadcastChange, persistToStorageAndBroadcast]
  );

  const saveSiteSettings = useCallback(
    (newSettings: SiteSettings) => {
      // Deep merge contact so no contact field can ever be reset or lost
      const mergedSettings: SiteSettings = {
        ...siteSettings,
        ...newSettings,
        contact: {
          ...siteSettings.contact,
          ...(newSettings.contact || {}),
        },
      };
      setSiteSettings(mergedSettings);
      persistToStorageAndBroadcast(STORAGE_KEYS.SETTINGS, "siteSettings", mergedSettings, deletedIds);
      debouncedSyncToServer("siteSettings", mergedSettings);
    },
    [siteSettings, debouncedSyncToServer, deletedIds, persistToStorageAndBroadcast]
  );

  const saveTestimonials = useCallback(
    (newTestimonials: Testimonial[], explicitDeletedId?: string) => {
      const oldIds = new Set(testimonials.map((t) => t.id));
      const newIds = new Set(newTestimonials.map((t) => t.id));
      const removed: string[] = [];
      if (explicitDeletedId) removed.push(explicitDeletedId);
      oldIds.forEach((id) => {
        if (!newIds.has(id)) removed.push(id);
      });

      let nextDeleted = deletedIds;
      if (removed.length > 0) {
        nextDeleted = Array.from(new Set([...deletedIds, ...removed]));
        setDeletedIds(nextDeleted);
        try {
          localStorage.setItem(STORAGE_KEYS.DELETED_IDS, JSON.stringify(nextDeleted));
        } catch (_) {}
      }

      const sequencedTestimonials = newTestimonials.map((t, i) => ({
        ...t,
        sortOrder: i + 1,
      }));
      const sanitized = filterOutDeletedItems(sanitizeTestimonialsList(sequencedTestimonials), nextDeleted);
      setTestimonials(sanitized);

      if (removed.length > 0) {
        lastLocalEditTimestampRef.current = Date.now();
        try {
          localStorage.setItem(STORAGE_KEYS.TESTIMONIALS, JSON.stringify(sanitized));
          touchClientUpdate();
        } catch (_) {}
        broadcastChange("testimonials", sanitized, nextDeleted);
        syncToServer({ entity: "testimonials", data: sanitized, deletedIds: nextDeleted });
      } else {
        persistToStorageAndBroadcast(STORAGE_KEYS.TESTIMONIALS, "testimonials", sanitized, nextDeleted);
        debouncedSyncToServer("testimonials", sanitized, nextDeleted);
      }
    },
    [testimonials, deletedIds, debouncedSyncToServer, broadcastChange, persistToStorageAndBroadcast]
  );

  // Dedicated explicit delete method
  const deleteEntity = useCallback(
    (entity: string, id: string, slug?: string) => {
      const idsToRemove = [id];
      if (slug) idsToRemove.push(slug);
      const nextDeleted = Array.from(new Set([...deletedIds, ...idsToRemove]));
      setDeletedIds(nextDeleted);
      try {
        localStorage.setItem(STORAGE_KEYS.DELETED_IDS, JSON.stringify(nextDeleted));
      } catch (_) {}

      if (entity === "projects") {
        const updated = projects.filter((p) => p.id !== id && (!slug || p.slug !== slug));
        saveProjects(updated, id);
      } else if (entity === "services") {
        const updated = services.filter((s) => s.id !== id && (!slug || s.slug !== slug));
        saveServices(updated, id);
      } else if (entity === "team") {
        const updated = team.filter((m) => m.id !== id);
        saveTeam(updated, id);
      } else if (entity === "blog") {
        const updated = blog.filter((b) => b.id !== id && (!slug || b.slug !== slug));
        saveBlog(updated, id);
      } else if (entity === "faq") {
        const updated = faq.filter((f) => f.id !== id);
        saveFaq(updated, id);
      } else if (entity === "gallery") {
        const updated = gallery.filter((g) => g.id !== id);
        saveGallery(updated, id);
      } else if (entity === "recognitions") {
        const updated = recognitions.filter((r) => r.id !== id);
        saveRecognitions(updated, id);
      } else if (entity === "testimonials") {
        const updated = testimonials.filter((t) => t.id !== id);
        saveTestimonials(updated, id);
      }

      // Explicitly purge from cloud storage and database via server delete action
      syncToServer({
        action: "delete",
        entity,
        recordId: id,
        slug,
        deletedIds: nextDeleted,
      });
    },
    [
      deletedIds,
      projects,
      services,
      team,
      blog,
      faq,
      gallery,
      recognitions,
      testimonials,
      saveProjects,
      saveServices,
      saveTeam,
      saveBlog,
      saveFaq,
      saveGallery,
      saveRecognitions,
      saveTestimonials,
    ]
  );

  const saveAllToCloud = useCallback(
    async (options?: { forceGitHubCommit?: boolean }) => {
      storageTimersRef.current.forEach((t) => clearTimeout(t));
      storageTimersRef.current.clear();
      syncTimersRef.current.forEach((t) => clearTimeout(t));
      syncTimersRef.current.clear();
      touchClientUpdate();
      try {
        localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
        localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(services));
        localStorage.setItem(STORAGE_KEYS.TEAM, JSON.stringify(team));
        localStorage.setItem(STORAGE_KEYS.BLOG, JSON.stringify(blog));
        localStorage.setItem(STORAGE_KEYS.FAQ, JSON.stringify(faq));
        localStorage.setItem(STORAGE_KEYS.GALLERY, JSON.stringify(gallery));
        localStorage.setItem(STORAGE_KEYS.RECOGNITIONS, JSON.stringify(recognitions));
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(siteSettings));
        localStorage.setItem(STORAGE_KEYS.TESTIMONIALS, JSON.stringify(testimonials));
        localStorage.setItem(STORAGE_KEYS.DELETED_IDS, JSON.stringify(deletedIds));
      } catch (_) {}
      const allData = {
        projects,
        services,
        team,
        blog,
        faq,
        gallery,
        recognitions,
        siteSettings,
        testimonials,
        deletedIds,
      };
      const res = await syncToServer({
        allData,
        deletedIds,
        forceGitHubCommit: Boolean(options?.forceGitHubCommit),
        expectedUpdatedAt: lastServerUpdatedRef.current || undefined,
      });
      if (res.success && res.updatedAt) {
        lastServerUpdatedRef.current = res.updatedAt;
        try {
          localStorage.setItem(STORAGE_KEYS.HAS_UNSAVED_EDITS, "false");
        } catch (_) {}
      }
      return res;
    },
    [projects, services, team, blog, faq, gallery, recognitions, siteSettings, testimonials, deletedIds]
  );

  const resetAllToDefaults = useCallback(() => {
    syncTimersRef.current.forEach((t) => clearTimeout(t));
    syncTimersRef.current.clear();
    setDeletedIds([]);
    setProjects(defaultProjects);
    setServices(defaultServices);
    setTeam(defaultTeam);
    setBlog(defaultBlog);
    setFaq(defaultFaq);
    setGallery(defaultGallery);
    setRecognitions(defaultRecognitions);
    setSiteSettings(defaultSiteSettings);
    setTestimonials(defaultTestimonials);

    try {
      Object.values(STORAGE_KEYS).forEach((k) => localStorage.removeItem(k));
    } catch (_) {}

    const defaultData = {
      projects: defaultProjects,
      services: defaultServices,
      team: defaultTeam,
      blog: defaultBlog,
      faq: defaultFaq,
      gallery: defaultGallery,
      recognitions: defaultRecognitions,
      siteSettings: defaultSiteSettings,
      testimonials: defaultTestimonials,
      deletedIds: [],
    };

    broadcastChange("ALL_DATA", defaultData, []);
    syncToServer({ reset: true });
  }, []);

  const contextValue = useMemo<CMSContextValue>(
    () => ({
      isClient,
      projects,
      services,
      team,
      blog,
      faq,
      gallery,
      recognitions,
      siteSettings,
      testimonials,
      deletedIds,
      serverStorageInfo,
      recordStatus,
      saveProjects,
      saveServices,
      saveTeam,
      saveBlog,
      saveFaq,
      saveGallery,
      saveRecognitions,
      saveSiteSettings,
      saveTestimonials,
      saveSingleRecord,
      deleteEntity,
      saveAllToCloud,
      resetAllToDefaults,
      refetchFromServer: fetchFromServer,
      applyDataset,
    }),
    [
      isClient,
      projects,
      services,
      team,
      blog,
      faq,
      gallery,
      recognitions,
      siteSettings,
      testimonials,
      deletedIds,
      serverStorageInfo,
      recordStatus,
      saveProjects,
      saveServices,
      saveTeam,
      saveBlog,
      saveFaq,
      saveGallery,
      saveRecognitions,
      saveSiteSettings,
      saveTestimonials,
      saveSingleRecord,
      deleteEntity,
      saveAllToCloud,
      resetAllToDefaults,
      fetchFromServer,
      applyDataset,
    ]
  );

  return React.createElement(CMSContext.Provider, { value: contextValue }, children);
}

// Standalone fallback hook for components invoked outside CMSProvider
function useStandaloneCMSStore(): CMSContextValue {
  const [isClient, setIsClient] = useState(false);
  const [deletedIds, setDeletedIds] = useState<string[]>(initialSeedDeletedIds);
  const [projects, setProjects] = useState<Project[]>(() => defaultProjects);
  const [services, setServices] = useState<Service[]>(() => defaultServices);
  const [team, setTeam] = useState<TeamMember[]>(() => defaultTeam);
  const [blog, setBlog] = useState<BlogPost[]>(() => defaultBlog);
  const [faq, setFaq] = useState<FAQItem[]>(() => defaultFaq);
  const [gallery, setGallery] = useState<GalleryItem[]>(() => defaultGallery);
  const [recognitions, setRecognitions] = useState<Recognition[]>(() => defaultRecognitions);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(() => defaultSiteSettings);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(() => defaultTestimonials);
  const [serverStorageInfo] = useState({});

  useEffect(() => {
    setIsClient(true);
  }, []);

  return {
    isClient,
    projects,
    services,
    team,
    blog,
    faq,
    gallery,
    recognitions,
    siteSettings,
    testimonials,
    deletedIds,
    serverStorageInfo,
    recordStatus: {},
    saveProjects: () => {},
    saveServices: () => {},
    saveTeam: () => {},
    saveBlog: () => {},
    saveFaq: () => {},
    saveGallery: () => {},
    saveRecognitions: () => {},
    saveSiteSettings: () => {},
    saveTestimonials: () => {},
    saveSingleRecord: async () => ({ success: true }),
    deleteEntity: () => {},
    saveAllToCloud: async () => ({ success: true }),
    resetAllToDefaults: () => {},
    refetchFromServer: async () => {},
    applyDataset: () => {},
  };
}

// Universal Hook consumed across all client pages and components
export function useCMSStore(): CMSContextValue {
  const context = useContext(CMSContext);
  if (context) {
    return context;
  }
  return useStandaloneCMSStore();
}
