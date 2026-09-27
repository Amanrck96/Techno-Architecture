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

export const STORAGE_KEYS = {
  PROJECTS: "techno_cms_projects_v6",
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
};

const SYNC_CHANNEL_NAME = "techno_cms_live_sync";
const SYNC_EVENT_NAME = "techno_cms_local_update";

function touchClientUpdate(): string {
  const now = new Date().toISOString();
  try {
    localStorage.setItem(STORAGE_KEYS.CLIENT_UPDATED_AT, now);
  } catch (_) {}
  return now;
}

// Helper to push updates to server with dual cookie + Authorization header authentication
export async function syncToServer(payload: {
  entity?: string;
  data?: any;
  allData?: any;
  reset?: boolean;
}): Promise<{ success: boolean; updatedAt?: string; error?: any }> {
  try {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("techno_admin_token") ||
          sessionStorage.getItem("techno_admin_token")
        : null;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
      headers["x-admin-token"] = token;
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
        } catch (_) {}
      }
      return { success: true, updatedAt: result.updatedAt };
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

  const lastServerUpdatedRef = useRef<string>("");

  // Function to apply complete dataset to state & local cache
  // Note: Empty arrays ([]) ARE valid and represent user deleting all items
  const applyDataset = useCallback((data: any) => {
    if (!data || typeof data !== "object") return;

    if (Array.isArray(data.projects)) {
      setProjects(data.projects);
      try { localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(data.projects)); } catch (_) {}
    }
    if (Array.isArray(data.services)) {
      setServices(data.services);
      try { localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(data.services)); } catch (_) {}
    }
    if (Array.isArray(data.team)) {
      const rajeshOnly = data.team
        .filter((m: TeamMember) => m.name?.toLowerCase().includes("rajesh"))
        .map((m: TeamMember) => ({ ...m, image: "" }));
      const finalTeam = rajeshOnly.length > 0 ? rajeshOnly : initialTeam;
      setTeam(finalTeam);
      try { localStorage.setItem(STORAGE_KEYS.TEAM, JSON.stringify(finalTeam)); } catch (_) {}
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
      const res = await fetch("/api/cms", {
        cache: "no-store",
      });
      if (!res.ok) return;

      const data = await res.json();
      if (!data) return;

      // 1. Check client vs server timestamps to prevent stale server data from overwriting local edits/deletions
      let clientTime = 0;
      try {
        const clientUpdated = localStorage.getItem(STORAGE_KEYS.CLIENT_UPDATED_AT);
        if (clientUpdated) {
          clientTime = new Date(clientUpdated).getTime();
        }
      } catch (_) {}

      const serverTime = data.updatedAt ? new Date(data.updatedAt).getTime() : 0;

      // If client has newer edits/deletions than the server's payload, NEVER overwrite client state!
      // Instead, preserve client data and re-sync it to the server.
      if (clientTime > 0 && clientTime > serverTime) {
        console.info("[CMS Store] Client has newer edits/deletions than server payload. Preserving local changes and syncing to server...");
        const localData: any = {};
        try {
          const sp = localStorage.getItem(STORAGE_KEYS.PROJECTS);
          if (sp) localData.projects = JSON.parse(sp);
          const ss = localStorage.getItem(STORAGE_KEYS.SERVICES);
          if (ss) localData.services = JSON.parse(ss);
          const st = localStorage.getItem(STORAGE_KEYS.TEAM);
          if (st) localData.team = JSON.parse(st);
          const sb = localStorage.getItem(STORAGE_KEYS.BLOG);
          if (sb) localData.blog = JSON.parse(sb);
          const sf = localStorage.getItem(STORAGE_KEYS.FAQ);
          if (sf) localData.faq = JSON.parse(sf);
          const sg = localStorage.getItem(STORAGE_KEYS.GALLERY);
          if (sg) localData.gallery = JSON.parse(sg);
          const sr = localStorage.getItem(STORAGE_KEYS.RECOGNITIONS);
          if (sr) localData.recognitions = JSON.parse(sr);
          const sset = localStorage.getItem(STORAGE_KEYS.SETTINGS);
          if (sset) localData.siteSettings = JSON.parse(sset);
          const stm = localStorage.getItem(STORAGE_KEYS.TESTIMONIALS);
          if (stm) localData.testimonials = JSON.parse(stm);
        } catch (_) {}

        if (Object.keys(localData).length > 0) {
          syncToServer({ allData: localData });
        }
        return;
      }

      // If server data has changed since last check, apply it
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

    // 1. Quick initial hydration from local cache if present
    try {
      const sp = localStorage.getItem(STORAGE_KEYS.PROJECTS);
      if (sp) setProjects(JSON.parse(sp));
      const ss = localStorage.getItem(STORAGE_KEYS.SERVICES);
      if (ss) setServices(JSON.parse(ss));
      const st = localStorage.getItem(STORAGE_KEYS.TEAM);
      if (st) {
        try {
          const parsed = JSON.parse(st);
          const filtered = Array.isArray(parsed)
            ? parsed.filter((m: TeamMember) => m.name?.toLowerCase().includes("rajesh"))
            : [];
          if (filtered.length > 0) {
            setTeam(filtered.map((m: TeamMember) => ({ ...m, image: "" })));
          } else {
            setTeam(initialTeam);
          }
        } catch (_) {
          setTeam(initialTeam);
        }
      }
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
            if (entity === "projects") setProjects(data);
            else if (entity === "services") setServices(data);
            else if (entity === "team") {
              const rajeshOnly = Array.isArray(data)
                ? data.filter((m: TeamMember) => m.name?.toLowerCase().includes("rajesh")).map((m) => ({ ...m, image: "" }))
                : initialTeam;
              setTeam(rajeshOnly.length > 0 ? rajeshOnly : initialTeam);
            }
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
        if (entity === "projects") setProjects(data);
        else if (entity === "services") setServices(data);
        else if (entity === "team") {
          const rajeshOnly = Array.isArray(data)
            ? data.filter((m: TeamMember) => m.name?.toLowerCase().includes("rajesh")).map((m: any) => ({ ...m, image: "" }))
            : initialTeam;
          setTeam(rajeshOnly.length > 0 ? rajeshOnly : initialTeam);
        }
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
    }, 8000); // Gentle 8s background poll to keep all viewers live

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

  // =========================================================
  // SAVE METHODS (INSTANT OPTIMISTIC UI + PERMANENT SERVER SYNC)
  // =========================================================

  const saveProjects = useCallback((newProjects: Project[]) => {
    setProjects(newProjects);
    try {
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(newProjects));
      touchClientUpdate();
    } catch (_) {}
    broadcastChange("projects", newProjects);
    syncToServer({ entity: "projects", data: newProjects });
  }, []);

  const saveServices = useCallback((newServices: Service[]) => {
    setServices(newServices);
    try {
      localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(newServices));
      touchClientUpdate();
    } catch (_) {}
    broadcastChange("services", newServices);
    syncToServer({ entity: "services", data: newServices });
  }, []);

  const saveTeam = useCallback((newTeam: TeamMember[]) => {
    const sanitized = newTeam
      .filter((m) => m.name?.toLowerCase().includes("rajesh"))
      .map((m) => ({ ...m, image: "" }));
    const finalTeam = sanitized.length > 0 ? sanitized : initialTeam;
    setTeam(finalTeam);
    try {
      localStorage.setItem(STORAGE_KEYS.TEAM, JSON.stringify(finalTeam));
      touchClientUpdate();
    } catch (_) {}
    broadcastChange("team", finalTeam);
    syncToServer({ entity: "team", data: finalTeam });
  }, []);

  const saveBlog = useCallback((newBlog: BlogPost[]) => {
    setBlog(newBlog);
    try {
      localStorage.setItem(STORAGE_KEYS.BLOG, JSON.stringify(newBlog));
      touchClientUpdate();
    } catch (_) {}
    broadcastChange("blog", newBlog);
    syncToServer({ entity: "blog", data: newBlog });
  }, []);

  const saveFaq = useCallback((newFaq: FAQItem[]) => {
    setFaq(newFaq);
    try {
      localStorage.setItem(STORAGE_KEYS.FAQ, JSON.stringify(newFaq));
      touchClientUpdate();
    } catch (_) {}
    broadcastChange("faq", newFaq);
    syncToServer({ entity: "faq", data: newFaq });
  }, []);

  const saveGallery = useCallback((newGallery: GalleryItem[]) => {
    setGallery(newGallery);
    try {
      localStorage.setItem(STORAGE_KEYS.GALLERY, JSON.stringify(newGallery));
      touchClientUpdate();
    } catch (_) {}
    broadcastChange("gallery", newGallery);
    syncToServer({ entity: "gallery", data: newGallery });
  }, []);

  const saveRecognitions = useCallback((newRecognitions: Recognition[]) => {
    setRecognitions(newRecognitions);
    try {
      localStorage.setItem(STORAGE_KEYS.RECOGNITIONS, JSON.stringify(newRecognitions));
      touchClientUpdate();
    } catch (_) {}
    broadcastChange("recognitions", newRecognitions);
    syncToServer({ entity: "recognitions", data: newRecognitions });
  }, []);

  const saveSiteSettings = useCallback((newSettings: SiteSettings) => {
    setSiteSettings(newSettings);
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(newSettings));
      touchClientUpdate();
    } catch (_) {}
    broadcastChange("siteSettings", newSettings);
    syncToServer({ entity: "siteSettings", data: newSettings });
  }, []);

  const saveTestimonials = useCallback((newTestimonials: Testimonial[]) => {
    setTestimonials(newTestimonials);
    try {
      localStorage.setItem(STORAGE_KEYS.TESTIMONIALS, JSON.stringify(newTestimonials));
      touchClientUpdate();
    } catch (_) {}
    broadcastChange("testimonials", newTestimonials);
    syncToServer({ entity: "testimonials", data: newTestimonials });
  }, []);

  // Force push all current state to server permanently
  const saveAllToCloud = useCallback(async () => {
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
    return res;
  }, [projects, services, team, blog, faq, gallery, recognitions, siteSettings, testimonials]);

  const resetAllToDefaults = useCallback(() => {
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
  };
}
