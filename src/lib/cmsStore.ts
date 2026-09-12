"use client";

import { useEffect, useState, useCallback } from "react";
import { Project, initialProjects } from "@/data/projects";
import { Service, initialServices } from "@/data/services";
import { TeamMember, initialTeam } from "@/data/team";
import { BlogPost, initialBlogPosts } from "@/data/blog";
import { FAQItem, initialFAQs } from "@/data/faq";
import { GalleryItem, initialGalleryItems } from "@/data/gallery";
import { Recognition, initialRecognitions } from "@/data/recognitions";
import { SiteSettings, initialSiteSettings } from "@/data/siteSettings";
import { Testimonial, initialTestimonials } from "@/data/testimonials";

const STORAGE_KEYS = {
  PROJECTS: "techno_cms_projects_v3",
  SERVICES: "techno_cms_services_v3",
  TEAM: "techno_cms_team_v3",
  BLOG: "techno_cms_blog_v3",
  FAQ: "techno_cms_faq_v3",
  GALLERY: "techno_cms_gallery_v3",
  RECOGNITIONS: "techno_cms_recognitions_v3",
  SETTINGS: "techno_cms_settings_v3",
  TESTIMONIALS: "techno_cms_testimonials_v3",
};

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

  useEffect(() => {
    setIsClient(true);
    try {
      // Purge legacy storage keys
      ["techno_cms_projects_v1", "techno_cms_projects_v2", "techno_cms_projects"].forEach((key) => {
        try {
          localStorage.removeItem(key);
        } catch (_) {}
      });

      const storedProjects = localStorage.getItem(STORAGE_KEYS.PROJECTS);
      if (storedProjects) {
        const parsed = JSON.parse(storedProjects);
        const aikyaFresh = initialProjects.find((p) => p.id === "proj-1" || p.slug === "aikya");
        const belakuFresh = initialProjects.find((p) => p.id === "proj-2" || p.slug === "belaku");
        const sanitized = parsed.map((p: Project) => {
          if (
            p.id === "proj-1" ||
            p.slug === "monolith-house" ||
            p.slug === "aikya" ||
            p.title === "MONOLITH HOUSE"
          ) {
            return aikyaFresh || p;
          }
          if (
            p.id === "proj-2" ||
            p.slug === "corten-pavilion" ||
            p.slug === "belaku" ||
            p.title === "CORTEN PAVILION"
          ) {
            return belakuFresh || p;
          }
          let modified = p;
          if (p.relatedSlugs && (p.relatedSlugs.includes("monolith-house") || p.relatedSlugs.includes("corten-pavilion"))) {
            modified = {
              ...p,
              relatedSlugs: p.relatedSlugs.map((s) => {
                if (s === "monolith-house") return "aikya";
                if (s === "corten-pavilion") return "belaku";
                return s;
              }),
            };
          }
          return modified;
        });
        setProjects(sanitized);
        localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(sanitized));
      } else {
        setProjects(initialProjects);
        localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(initialProjects));
      }

      const storedServices = localStorage.getItem(STORAGE_KEYS.SERVICES);
      if (storedServices) {
        const parsed = JSON.parse(storedServices);
        const sanitizedServices = parsed.map((s: Service) => ({
          ...s,
          relatedProjectSlugs: s.relatedProjectSlugs?.map((slug) =>
            slug === "corten-pavilion" ? "belaku" : slug === "monolith-house" ? "aikya" : slug
          ),
        }));
        setServices(sanitizedServices);
        localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(sanitizedServices));
      }

      const storedTeam = localStorage.getItem(STORAGE_KEYS.TEAM);
      if (storedTeam) setTeam(JSON.parse(storedTeam));

      const storedBlog = localStorage.getItem(STORAGE_KEYS.BLOG);
      if (storedBlog) setBlog(JSON.parse(storedBlog));

      const storedFaq = localStorage.getItem(STORAGE_KEYS.FAQ);
      if (storedFaq) setFaq(JSON.parse(storedFaq));

      const storedGallery = localStorage.getItem(STORAGE_KEYS.GALLERY);
      if (storedGallery) {
        const parsed = JSON.parse(storedGallery);
        const gal3Fresh = initialGalleryItems.find((g) => g.id === "gal-3");
        let sanitizedGallery = parsed.map((g: GalleryItem) => {
          if (g.id === "gal-3" || g.projectSlug === "corten-pavilion" || g.projectTitle === "CORTEN PAVILION") {
            return gal3Fresh || g;
          }
          return g;
        });
        if (!sanitizedGallery.some((g: GalleryItem) => g.id === "gal-17")) {
          const gal17 = initialGalleryItems.find((g) => g.id === "gal-17");
          if (gal17) sanitizedGallery.push(gal17);
        }
        if (!sanitizedGallery.some((g: GalleryItem) => g.id === "gal-18")) {
          const gal18 = initialGalleryItems.find((g) => g.id === "gal-18");
          if (gal18) sanitizedGallery.push(gal18);
        }
        setGallery(sanitizedGallery);
        localStorage.setItem(STORAGE_KEYS.GALLERY, JSON.stringify(sanitizedGallery));
      }

      const storedRecognitions = localStorage.getItem(STORAGE_KEYS.RECOGNITIONS);
      if (storedRecognitions) {
        const parsed = JSON.parse(storedRecognitions);
        const rec6Fresh = initialRecognitions.find((r) => r.id === "rec-6");
        const sanitizedRecognitions = parsed.map((r: Recognition) => {
          if (r.id === "rec-6" || r.projectSlug === "corten-pavilion" || r.projectAssociated === "CORTEN PAVILION") {
            return rec6Fresh || r;
          }
          return r;
        });
        setRecognitions(sanitizedRecognitions);
        localStorage.setItem(STORAGE_KEYS.RECOGNITIONS, JSON.stringify(sanitizedRecognitions));
      }

      const storedSettings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (storedSettings) setSiteSettings(JSON.parse(storedSettings));

      const storedTestimonials = localStorage.getItem(STORAGE_KEYS.TESTIMONIALS);
      if (storedTestimonials) {
        const parsed = JSON.parse(storedTestimonials);
        const test2Fresh = initialTestimonials.find((t) => t.id === "test-2");
        const sanitizedTestimonials = parsed.map((t: Testimonial) => {
          if (t.id === "test-2" || t.projectAssociated === "CORTEN PAVILION") {
            return test2Fresh || t;
          }
          return t;
        });
        setTestimonials(sanitizedTestimonials);
        localStorage.setItem(STORAGE_KEYS.TESTIMONIALS, JSON.stringify(sanitizedTestimonials));
      }
    } catch (e) {
      console.warn("CMS Store hydration fallback to initial seeds:", e);
    }
  }, []);

  const saveProjects = useCallback((newProjects: Project[]) => {
    setProjects(newProjects);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(newProjects));
    }
  }, []);

  const saveServices = useCallback((newServices: Service[]) => {
    setServices(newServices);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(newServices));
    }
  }, []);

  const saveTeam = useCallback((newTeam: TeamMember[]) => {
    setTeam(newTeam);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.TEAM, JSON.stringify(newTeam));
    }
  }, []);

  const saveBlog = useCallback((newBlog: BlogPost[]) => {
    setBlog(newBlog);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.BLOG, JSON.stringify(newBlog));
    }
  }, []);

  const saveFaq = useCallback((newFaq: FAQItem[]) => {
    setFaq(newFaq);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.FAQ, JSON.stringify(newFaq));
    }
  }, []);

  const saveGallery = useCallback((newGallery: GalleryItem[]) => {
    setGallery(newGallery);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.GALLERY, JSON.stringify(newGallery));
    }
  }, []);

  const saveRecognitions = useCallback((newRecognitions: Recognition[]) => {
    setRecognitions(newRecognitions);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.RECOGNITIONS, JSON.stringify(newRecognitions));
    }
  }, []);

  const saveSiteSettings = useCallback((newSettings: SiteSettings) => {
    setSiteSettings(newSettings);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(newSettings));
    }
  }, []);

  const resetAllToDefaults = useCallback(() => {
    if (typeof window !== "undefined") {
      Object.values(STORAGE_KEYS).forEach((k) => localStorage.removeItem(k));
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
    resetAllToDefaults,
  };
}
