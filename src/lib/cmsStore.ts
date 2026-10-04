"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { Project, initialProjects } from "@/data/projects";
import { Service, initialServices } from "@/data/services";
import { TeamMember, initialTeam } from "@/data/team";
import { BlogPost, initialBlogPosts } from "@/data/blog";
import { FAQItem, initialFAQs } from "@/data/faq";
import { GalleryItem, initialGalleryItems } from "@/data/gallery";
import { Recognition, initialRecognitions } from "@/data/recognitions";
import { SiteSettings, initialSiteSettings } from "@/data/siteSettings";
import { Testimonial, initialTestimonials } from "@/data/testimonials";

export const VALID_PROJECT_CATEGORIES = ["Residential", "Commercial", "Hospitality", "Interior"] as const;
export type ValidProjectCategory = (typeof VALID_PROJECT_CATEGORIES)[number];

export function sanitizeProjectCategory(cat: any): ValidProjectCategory {
  if ((VALID_PROJECT_CATEGORIES as readonly string[]).includes(cat)) return cat as ValidProjectCategory;
  return "Residential";
}

export function sanitizeProjectsList(list: any[]): Project[] {
  if (!Array.isArray(list)) return [];
  return list.map((p) => ({
    ...p,
    category: sanitizeProjectCategory(p?.category),
  }));
}

export const STORAGE_KEYS = {
  PROJECTS: "techno_cms_projects_v9",
  SERVICES: "techno_cms_services_v5",
  TEAM: "techno_cms_team_v5",
  BLOG: "techno_cms_blog_v5",
  FAQ: "techno_cms_faq_v5",
  GALLERY: "techno_cms_gallery_v5",
  RECOGNITIONS: "techno_cms_recognitions_v5",
  SETTINGS: "techno_cms_settings_v5",
  TESTIMONIALS: "techno_cms_testimonials_v5",
  CLIENT_UPDATED_AT: "techno_cms_client_updated_at",
  SERVER_SYNCED_AT: "techno_cms_server_synced_at",
  GITHUB_TOKEN: "techno_cms_github_token",
  GITHUB_REPO: "techno_cms_github_repo",
  UPSTASH_URL: "techno_cms_upstash_url",
  UPSTASH_TOKEN: "techno_cms_upstash_token",
};

const SYNC_CHANNEL_NAME = "techno_cms_live_sync";
const SYNC_EVENT_NAME = "techno_cms_local_update";

export function getStorageCredentials() {
  if (typeof window === "undefined") {
    return { githubToken: "", githubRepo: "Kima1011/Techno-Architecture", upstashUrl: "", upstashToken: "" };
  }
  try {
    return {
      githubToken: localStorage.getItem(STORAGE_KEYS.GITHUB_TOKEN) || "",
      githubRepo: localStorage.getItem(STORAGE_KEYS.GITHUB_REPO) || "Kima1011/Techno-Architecture",
      upstashUrl: localStorage.getItem(STORAGE_KEYS.UPSTASH_URL) || "",
      upstashToken: localStorage.getItem(STORAGE_KEYS.UPSTASH_TOKEN) || "",
    };
  } catch (_) {
    return { githubToken: "", githubRepo: "Kima1011/Techno-Architecture", upstashUrl: "", upstashToken: "" };
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
  } catch (_) {}
  return now;
}

export function getLocalDataset(): any {
  const data: any = {};
  if (typeof window === "undefined") return data;
  try {
    const sp = localStorage.getItem(STORAGE_KEYS.PROJECTS);
    if (sp) data.projects = JSON.parse(sp);
    const ss = localStorage.getItem(STORAGE_KEYS.SERVICES);
    if (ss) data.services = JSON.parse(ss);
    const st = localStorage.getItem(STORAGE_KEYS.TEAM);
    if (st) data.team = JSON.parse(st);
    const sb = localStorage.getItem(STORAGE_KEYS.BLOG);
    if (sb) data.blog = JSON.parse(sb);
    const sf = localStorage.getItem(STORAGE_KEYS.FAQ);
    if (sf) data.faq = JSON.parse(sf);
    const sg = localStorage.getItem(STORAGE_KEYS.GALLERY);
    if (sg) data.gallery = JSON.parse(sg);
    const sr = localStorage.getItem(STORAGE_KEYS.RECOGNITIONS);
    if (sr) data.recognitions = JSON.parse(sr);
    const sset = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (sset) data.siteSettings = JSON.parse(sset);
    const stm = localStorage.getItem(STORAGE_KEYS.TESTIMONIALS);
    if (stm) data.testimonials = JSON.parse(stm);
  } catch (_) {}
  return data;
}

// Helper to push updates to server with dual cookie + Authorization header authentication
export async function syncToServer(payload: {
  entity?: string;
  data?: any;
  allData?: any;
  reset?: boolean;
  action?: string;
  githubToken?: string;
  githubRepo?: string;
  upstashUrl?: string;
  upstashToken?: string;
}): Promise<{
  success: boolean;
  updatedAt?: string;
  storageStatus?: any;
  message?: string;
  error?: any;
}> {
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

    const res = await fetch("/api/cms", {
      method: "POST",
      credentials: "include",
      headers,
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      const result = await res.json();
      if (result.updatedAt) {
        try {
          localStorage.setItem(STORAGE_KEYS.SERVER_SYNCED_AT, result.updatedAt);
          localStorage.setItem(STORAGE_KEYS.CLIENT_UPDATED_AT, result.updatedAt);
        } catch (_) {}
      }
      return {
        success: true,
        updatedAt: result.updatedAt,
        storageStatus: result.storageStatus,
        message: result.message,
      };
    } else {
      const err = await res.json().catch(() => ({}));
      console.warn("Failed to persist CMS update to server:", err);
      return { success: false, error: err };
    }
  } catch (err) {
    console.warn("Network error saving to /api/cms:", err);
    return { success: false, error: err };
  }
}

export function useCMSStore() {
  const [isClient, setIsClient] = useState(false);
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [services, setServices] = useState<Service[]>(initialServices);
  const [team, setTeam] = useState<TeamMember[]>(initialTeam);
  const [blog, setBlog] = useState<BlogPost[]>(initialBlogPosts);
  const [faq, setFaq] = useState<FAQItem[]>(initialFAQs);
  const [gallery, setGallery] = useState<GalleryItem[]>(initialGalleryItems);
  const [recognitions, setRecognitions] = useState<Recognition[]>(initialRecognitions);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(initialSiteSettings);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(initialTestimonials);

  // Storage health status from server
  const [serverStorageInfo, setServerStorageInfo] = useState<{
    isVercel?: boolean;
    isProduction?: boolean;
    hasGitHubToken?: boolean;
    hasUpstashKV?: boolean;
    hasFirestore?: boolean;
    localDiskWritable?: boolean;
  }>({});

  const lastServerUpdatedRef = useRef<string>("");
  const syncTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Function to apply complete dataset to state & local cache
  const applyDataset = useCallback((data: any) => {
    if (!data || typeof data !== "object") return;

    if (Array.isArray(data.projects)) {
      const sanitized = sanitizeProjectsList(data.projects);
      setProjects(sanitized);
      try { localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(sanitized)); } catch (_) {}
    }
    if (Array.isArray(data.services)) {
      setServices(data.services);
      try { localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(data.services)); } catch (_) {}
    }
    if (Array.isArray(data.team)) {
      setTeam(data.team);
      try { localStorage.setItem(STORAGE_KEYS.TEAM, JSON.stringify(data.team)); } catch (_) {}
    }
    if (Array.isArray(data.blog)) {
      setBlog(data.blog);
      try { localStorage.setItem(STORAGE_KEYS.BLOG, JSON.stringify(data.blog)); } catch (_) {}
    }
    if (Array.isArray(data.faq)) {
      setFaq(data.faq);
      try { localStorage.setItem(STORAGE_KEYS.FAQ, JSON.stringify(data.faq)); } catch (_) {}
    }
    if (Array.isArray(data.gallery)) {
      setGallery(data.gallery);
      try { localStorage.setItem(STORAGE_KEYS.GALLERY, JSON.stringify(data.gallery)); } catch (_) {}
    }
    if (Array.isArray(data.recognitions)) {
      setRecognitions(data.recognitions);
      try { localStorage.setItem(STORAGE_KEYS.RECOGNITIONS, JSON.stringify(data.recognitions)); } catch (_) {}
    }
    if (data.siteSettings && typeof data.siteSettings === "object") {
      setSiteSettings(data.siteSettings);
      try { localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(data.siteSettings)); } catch (_) {}
    }
    if (Array.isArray(data.testimonials)) {
      setTestimonials(data.testimonials);
      try { localStorage.setItem(STORAGE_KEYS.TESTIMONIALS, JSON.stringify(data.testimonials)); } catch (_) {}
    }
  }, []);

  // Fetch latest live data from server permanently with client-timestamp protection
  const fetchFromServer = useCallback(async () => {
    try {
      const creds = getStorageCredentials();
      const headers: Record<string, string> = {};
      if (creds.upstashUrl) headers["x-upstash-url"] = creds.upstashUrl;
      if (creds.upstashToken) headers["x-upstash-token"] = creds.upstashToken;

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

      // 1. Check client vs server timestamps to prevent stale server data from overwriting local edits/deletions
      let clientTime = 0;
      try {
        const clientUpdated = localStorage.getItem(STORAGE_KEYS.CLIENT_UPDATED_AT);
        if (clientUpdated) {
          clientTime = new Date(clientUpdated).getTime();
        }
      } catch (_) {}

      const serverTime = data.updatedAt ? new Date(data.updatedAt).getTime() : 0;

      // 2. If server returns default seed data, NEVER overwrite client edits!
      if (data.isDefault) {
        if (clientTime > 0) {
          console.info("[CMS Store] Server returned default baseline seed. Syncing local client edits to server...");
          const localData = getLocalDataset();
          if (Object.keys(localData).length > 0) {
            syncToServer({ allData: localData });
          }
          return;
        }
        // If client has no local cache (e.g. public visitor or new device), apply the server data!
        applyDataset(data);
        return;
      }

      // 3. If client has local edits that are newer than or equal to the server data, NEVER overwrite!
      if (clientTime > 0 && clientTime >= serverTime) {
        console.info("[CMS Store] Local changes are newer than or equal to server payload. Preserving local edits...");
        const localData = getLocalDataset();
        if (Object.keys(localData).length > 0) {
          syncToServer({ allData: localData });
        }
        return;
      }

      // 4. If server data has changed since last check and is legitimately newer, apply it
      if (data.updatedAt && data.updatedAt === lastServerUpdatedRef.current) {
        return;
      }
      if (data.updatedAt) {
        lastServerUpdatedRef.current = data.updatedAt;
      }
      applyDataset(data);
    } catch (err) {
      console.warn("CMS Store could not reach /api/cms:", err);
    }
  }, [applyDataset]);

  // Initial mount & live event listeners
  useEffect(() => {
    setIsClient(true);

    // 1. Quick initial hydration from local cache if present (purging legacy caches)
    try {
      localStorage.removeItem("techno_cms_projects_v7");
      localStorage.removeItem("techno_cms_projects_v6");
      localStorage.removeItem("techno_cms_projects_v5");
      const sp = localStorage.getItem(STORAGE_KEYS.PROJECTS);
      if (sp) {
        const parsed = JSON.parse(sp);
        setProjects(sanitizeProjectsList(parsed));
      }
      const ss = localStorage.getItem(STORAGE_KEYS.SERVICES);
      if (ss) setServices(JSON.parse(ss));
      const st = localStorage.getItem(STORAGE_KEYS.TEAM);
      if (st) setTeam(JSON.parse(st));
      const sb = localStorage.getItem(STORAGE_KEYS.BLOG);
      if (sb) setBlog(JSON.parse(sb));
      const sf = localStorage.getItem(STORAGE_KEYS.FAQ);
      if (sf) setFaq(JSON.parse(sf));
      const sg = localStorage.getItem(STORAGE_KEYS.GALLERY);
      if (sg) setGallery(JSON.parse(sg));
      const sr = localStorage.getItem(STORAGE_KEYS.RECOGNITIONS);
      if (sr) setRecognitions(JSON.parse(sr));
      const sset = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (sset) setSiteSettings(JSON.parse(sset));
      const stm = localStorage.getItem(STORAGE_KEYS.TESTIMONIALS);
      if (stm) setTestimonials(JSON.parse(stm));
    } catch (_) {}

    // 2. Fetch fresh live data from the server single source of truth
    fetchFromServer();

    // 3. Set up BroadcastChannel for instant inter-tab live sync
    let channel: BroadcastChannel | null = null;
    if (typeof window !== "undefined" && "BroadcastChannel" in window) {
      try {
        channel = new BroadcastChannel(SYNC_CHANNEL_NAME);
        channel.onmessage = (event) => {
          if (event.data?.type === "CMS_UPDATE") {
            const { entity, data } = event.data;
            if (entity === "projects") setProjects(sanitizeProjectsList(data));

            else if (entity === "services") setServices(data);
            else if (entity === "team") setTeam(data);
            else if (entity === "blog") setBlog(data);
            else if (entity === "faq") setFaq(data);
            else if (entity === "gallery") setGallery(data);
            else if (entity === "recognitions") setRecognitions(data);
            else if (entity === "siteSettings") setSiteSettings(data);
            else if (entity === "testimonials") setTestimonials(data);
            else if (entity === "ALL_DATA") applyDataset(data);
          }
        };
      } catch (_) {}
    }

    // 4. Custom window event listener for same-tab instant sync
    const handleLocalUpdate = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail) {
        const { entity, data } = customEvent.detail;
        if (entity === "projects") setProjects(sanitizeProjectsList(data));
        else if (entity === "services") setServices(data);
        else if (entity === "team") setTeam(data);
        else if (entity === "blog") setBlog(data);
        else if (entity === "faq") setFaq(data);
        else if (entity === "gallery") setGallery(data);
        else if (entity === "recognitions") setRecognitions(data);
        else if (entity === "siteSettings") setSiteSettings(data);
        else if (entity === "testimonials") setTestimonials(data);
        else if (entity === "ALL_DATA") applyDataset(data);
      }
    };
    window.addEventListener(SYNC_EVENT_NAME, handleLocalUpdate);

    // 5. Automatic live sync when user refocuses tab or periodically
    const handleFocus = () => {
      fetchFromServer();
    };
    window.addEventListener("focus", handleFocus);

    const intervalId = setInterval(() => {
      fetchFromServer();
    }, 15000); // Gentle 15s background poll to keep all viewers live

    return () => {
      if (channel) channel.close();
      window.removeEventListener(SYNC_EVENT_NAME, handleLocalUpdate);
      window.removeEventListener("focus", handleFocus);
      clearInterval(intervalId);
    };
  }, [fetchFromServer, applyDataset]);

  // Broadcast helper
  const broadcastChange = (entity: string, data: any) => {
    if (typeof window !== "undefined") {
      try {
        window.dispatchEvent(new CustomEvent(SYNC_EVENT_NAME, { detail: { entity, data } }));
        if ("BroadcastChannel" in window) {
          const ch = new BroadcastChannel(SYNC_CHANNEL_NAME);
          ch.postMessage({ type: "CMS_UPDATE", entity, data });
          ch.close();
        }
      } catch (_) {}
    }
  };

  // Debounced server sync queue: guarantees 0ms instant UI and prevents network spam while typing
  const debouncedSyncToServer = useCallback((entity: string, data: any) => {
    if (syncTimerRef.current) {
      clearTimeout(syncTimerRef.current);
    }
    syncTimerRef.current = setTimeout(() => {
      syncToServer({ entity, data });
    }, 600);
  }, []);

  // =========================================================
  // SAVE METHODS (INSTANT OPTIMISTIC UI + PERMANENT SERVER SYNC)
  // =========================================================

  const saveProjects = useCallback((newProjects: Project[]) => {
    const sanitized = sanitizeProjectsList(newProjects);
    setProjects(sanitized);
    try {
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(sanitized));
      touchClientUpdate();
    } catch (_) {}
    broadcastChange("projects", sanitized);
    debouncedSyncToServer("projects", sanitized);
  }, [debouncedSyncToServer]);

  const saveServices = useCallback((newServices: Service[]) => {
    setServices(newServices);
    try {
      localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(newServices));
      touchClientUpdate();
    } catch (_) {}
    broadcastChange("services", newServices);
    debouncedSyncToServer("services", newServices);
  }, [debouncedSyncToServer]);

  const saveTeam = useCallback((newTeam: TeamMember[]) => {
    setTeam(newTeam);
    try {
      localStorage.setItem(STORAGE_KEYS.TEAM, JSON.stringify(newTeam));
      touchClientUpdate();
    } catch (_) {}
    broadcastChange("team", newTeam);
    debouncedSyncToServer("team", newTeam);
  }, [debouncedSyncToServer]);

  const saveBlog = useCallback((newBlog: BlogPost[]) => {
    setBlog(newBlog);
    try {
      localStorage.setItem(STORAGE_KEYS.BLOG, JSON.stringify(newBlog));
      touchClientUpdate();
    } catch (_) {}
    broadcastChange("blog", newBlog);
    debouncedSyncToServer("blog", newBlog);
  }, [debouncedSyncToServer]);

  const saveFaq = useCallback((newFaq: FAQItem[]) => {
    setFaq(newFaq);
    try {
      localStorage.setItem(STORAGE_KEYS.FAQ, JSON.stringify(newFaq));
      touchClientUpdate();
    } catch (_) {}
    broadcastChange("faq", newFaq);
    debouncedSyncToServer("faq", newFaq);
  }, [debouncedSyncToServer]);

  const saveGallery = useCallback((newGallery: GalleryItem[]) => {
    setGallery(newGallery);
    try {
      localStorage.setItem(STORAGE_KEYS.GALLERY, JSON.stringify(newGallery));
      touchClientUpdate();
    } catch (_) {}
    broadcastChange("gallery", newGallery);
    debouncedSyncToServer("gallery", newGallery);
  }, [debouncedSyncToServer]);

  const saveRecognitions = useCallback((newRecognitions: Recognition[]) => {
    setRecognitions(newRecognitions);
    try {
      localStorage.setItem(STORAGE_KEYS.RECOGNITIONS, JSON.stringify(newRecognitions));
      touchClientUpdate();
    } catch (_) {}
    broadcastChange("recognitions", newRecognitions);
    debouncedSyncToServer("recognitions", newRecognitions);
  }, [debouncedSyncToServer]);

  const saveSiteSettings = useCallback((newSettings: SiteSettings) => {
    setSiteSettings(newSettings);
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(newSettings));
      touchClientUpdate();
    } catch (_) {}
    broadcastChange("siteSettings", newSettings);
    debouncedSyncToServer("siteSettings", newSettings);
  }, [debouncedSyncToServer]);

  const saveTestimonials = useCallback((newTestimonials: Testimonial[]) => {
    setTestimonials(newTestimonials);
    try {
      localStorage.setItem(STORAGE_KEYS.TESTIMONIALS, JSON.stringify(newTestimonials));
      touchClientUpdate();
    } catch (_) {}
    broadcastChange("testimonials", newTestimonials);
    debouncedSyncToServer("testimonials", newTestimonials);
  }, [debouncedSyncToServer]);

  // Force push all current state to server permanently (immediate, flushes queue)
  const saveAllToCloud = useCallback(async () => {
    if (syncTimerRef.current) {
      clearTimeout(syncTimerRef.current);
      syncTimerRef.current = null;
    }
    touchClientUpdate();
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
    };
    const res = await syncToServer({ allData });
    if (res.updatedAt) {
      lastServerUpdatedRef.current = res.updatedAt;
    }
    return res;
  }, [projects, services, team, blog, faq, gallery, recognitions, siteSettings, testimonials]);

  const resetAllToDefaults = useCallback(() => {
    if (syncTimerRef.current) {
      clearTimeout(syncTimerRef.current);
      syncTimerRef.current = null;
    }
    setProjects(initialProjects);
    setServices(initialServices);
    setTeam(initialTeam);
    setBlog(initialBlogPosts);
    setFaq(initialFAQs);
    setGallery(initialGalleryItems);
    setRecognitions(initialRecognitions);
    setSiteSettings(initialSiteSettings);
    setTestimonials(initialTestimonials);

    try {
      Object.values(STORAGE_KEYS).forEach((k) => localStorage.removeItem(k));
    } catch (_) {}

    const defaultData = {
      projects: initialProjects,
      services: initialServices,
      team: initialTeam,
      blog: initialBlogPosts,
      faq: initialFAQs,
      gallery: initialGalleryItems,
      recognitions: initialRecognitions,
      siteSettings: initialSiteSettings,
      testimonials: initialTestimonials,
    };

    broadcastChange("ALL_DATA", defaultData);
    syncToServer({ reset: true });
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
    serverStorageInfo,
    saveProjects,
    saveServices,
    saveTeam,
    saveBlog,
    saveFaq,
    saveGallery,
    saveRecognitions,
    saveSiteSettings,
    saveTestimonials,
    saveAllToCloud,
    resetAllToDefaults,
    refetchFromServer: fetchFromServer,
  };
}
