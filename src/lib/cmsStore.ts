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
        const bttFresh = initialProjects.find((p) => p.id === "proj-3" || p.slug === "between-two-trees");
        const brindavanFresh = initialProjects.find((p) => p.id === "proj-4" || p.slug === "brindavan");
        const farSiteFresh = initialProjects.find((p) => p.id === "proj-5" || p.slug === "far-site-buildofy");
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
          if (
            p.id === "proj-3" ||
            p.slug === "dune-sanctuary" ||
            p.slug === "between-two-trees" ||
            p.title === "DUNE SANCTUARY"
          ) {
            return bttFresh || p;
          }
          if (
            p.id === "proj-4" ||
            p.slug === "atelier-basavanagudi" ||
            p.slug === "brindavan" ||
            p.title === "ATELIER BASAVANAGUDI"
          ) {
            return brindavanFresh || p;
          }
          if (
            p.id === "proj-5" ||
            p.slug === "shadow-house" ||
            p.slug === "far-site-buildofy" ||
            p.title === "SHADOW HOUSE"
          ) {
            return farSiteFresh || p;
          }
          let modified = p;
          if (p.relatedSlugs && (p.relatedSlugs.includes("monolith-house") || p.relatedSlugs.includes("corten-pavilion") || p.relatedSlugs.includes("dune-sanctuary") || p.relatedSlugs.includes("atelier-basavanagudi") || p.relatedSlugs.includes("shadow-house"))) {
            modified = {
              ...p,
              relatedSlugs: p.relatedSlugs.map((s) => {
                if (s === "monolith-house") return "aikya";
                if (s === "corten-pavilion") return "belaku";
                if (s === "dune-sanctuary") return "between-two-trees";
                if (s === "atelier-basavanagudi") return "brindavan";
                if (s === "shadow-house") return "far-site-buildofy";
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
            slug === "corten-pavilion"
              ? "belaku"
              : slug === "monolith-house"
              ? "aikya"
              : slug === "dune-sanctuary"
              ? "between-two-trees"
              : slug === "atelier-basavanagudi"
              ? "brindavan"
              : slug === "shadow-house"
              ? "far-site-buildofy"
              : slug
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
        const gal4Fresh = initialGalleryItems.find((g) => g.id === "gal-4");
        const gal5Fresh = initialGalleryItems.find((g) => g.id === "gal-5");
        const gal6Fresh = initialGalleryItems.find((g) => g.id === "gal-6");
        const gal7Fresh = initialGalleryItems.find((g) => g.id === "gal-7");
        const gal9Fresh = initialGalleryItems.find((g) => g.id === "gal-9");
        const gal11Fresh = initialGalleryItems.find((g) => g.id === "gal-11");
        let sanitizedGallery = parsed.map((g: GalleryItem) => {
          if (g.id === "gal-3" || g.projectSlug === "corten-pavilion" || g.projectTitle === "CORTEN PAVILION") {
            return gal3Fresh || g;
          }
          if (g.id === "gal-4" || (g.projectSlug === "dune-sanctuary" && g.id === "gal-4")) {
            return gal4Fresh || g;
          }
          if (g.id === "gal-5" || (g.projectSlug === "dune-sanctuary" && g.id === "gal-5")) {
            return gal5Fresh || g;
          }
          if (g.id === "gal-6" || (g.projectSlug === "shadow-house" && g.id === "gal-6")) {
            return gal6Fresh || g;
          }
          if (g.id === "gal-7" || g.projectSlug === "atelier-basavanagudi" || g.projectTitle === "ATELIER BASAVANAGUDI") {
            return gal7Fresh || g;
          }
          if (g.id === "gal-9" || (g.projectSlug === "dune-sanctuary" && g.id === "gal-9")) {
            return gal9Fresh || g;
          }
          if (g.id === "gal-11" || (g.projectSlug === "shadow-house" && g.id === "gal-11")) {
            return gal11Fresh || g;
          }
          if (g.projectSlug === "dune-sanctuary") {
            return {
              ...g,
              projectSlug: "between-two-trees",
              projectTitle: "BETWEEN TWO TREES",
            };
          }
          if (g.projectSlug === "atelier-basavanagudi") {
            return {
              ...g,
              projectSlug: "brindavan",
              projectTitle: "BRINDAVAN",
            };
          }
          if (g.projectSlug === "shadow-house") {
            return {
              ...g,
              projectSlug: "far-site-buildofy",
              projectTitle: "FAR SITE BUILDOFY",
            };
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
        if (!sanitizedGallery.some((g: GalleryItem) => g.id === "gal-19")) {
          const gal19 = initialGalleryItems.find((g) => g.id === "gal-19");
          if (gal19) sanitizedGallery.push(gal19);
        }
        if (!sanitizedGallery.some((g: GalleryItem) => g.id === "gal-20")) {
          const gal20 = initialGalleryItems.find((g) => g.id === "gal-20");
          if (gal20) sanitizedGallery.push(gal20);
        }
        if (!sanitizedGallery.some((g: GalleryItem) => g.id === "gal-21")) {
          const gal21 = initialGalleryItems.find((g) => g.id === "gal-21");
          if (gal21) sanitizedGallery.push(gal21);
        }
        if (!sanitizedGallery.some((g: GalleryItem) => g.id === "gal-22")) {
          const gal22 = initialGalleryItems.find((g) => g.id === "gal-22");
          if (gal22) sanitizedGallery.push(gal22);
        }
        if (!sanitizedGallery.some((g: GalleryItem) => g.id === "gal-23")) {
          const gal23 = initialGalleryItems.find((g) => g.id === "gal-23");
          if (gal23) sanitizedGallery.push(gal23);
        }
        if (!sanitizedGallery.some((g: GalleryItem) => g.id === "gal-24")) {
          const gal24 = initialGalleryItems.find((g) => g.id === "gal-24");
          if (gal24) sanitizedGallery.push(gal24);
        }
        if (!sanitizedGallery.some((g: GalleryItem) => g.id === "gal-25")) {
          const gal25 = initialGalleryItems.find((g) => g.id === "gal-25");
          if (gal25) sanitizedGallery.push(gal25);
        }
        if (!sanitizedGallery.some((g: GalleryItem) => g.id === "gal-26")) {
          const gal26 = initialGalleryItems.find((g) => g.id === "gal-26");
          if (gal26) sanitizedGallery.push(gal26);
        }
        if (!sanitizedGallery.some((g: GalleryItem) => g.id === "gal-27")) {
          const gal27 = initialGalleryItems.find((g) => g.id === "gal-27");
          if (gal27) sanitizedGallery.push(gal27);
        }
        if (!sanitizedGallery.some((g: GalleryItem) => g.id === "gal-28")) {
          const gal28 = initialGalleryItems.find((g) => g.id === "gal-28");
          if (gal28) sanitizedGallery.push(gal28);
        }
        if (!sanitizedGallery.some((g: GalleryItem) => g.id === "gal-29")) {
          const gal29 = initialGalleryItems.find((g) => g.id === "gal-29");
          if (gal29) sanitizedGallery.push(gal29);
        }
        if (!sanitizedGallery.some((g: GalleryItem) => g.id === "gal-30")) {
          const gal30 = initialGalleryItems.find((g) => g.id === "gal-30");
          if (gal30) sanitizedGallery.push(gal30);
        }
        if (!sanitizedGallery.some((g: GalleryItem) => g.id === "gal-31")) {
          const gal31 = initialGalleryItems.find((g) => g.id === "gal-31");
          if (gal31) sanitizedGallery.push(gal31);
        }
        if (!sanitizedGallery.some((g: GalleryItem) => g.id === "gal-32")) {
          const gal32 = initialGalleryItems.find((g) => g.id === "gal-32");
          if (gal32) sanitizedGallery.push(gal32);
        }
        if (!sanitizedGallery.some((g: GalleryItem) => g.id === "gal-33")) {
          const gal33 = initialGalleryItems.find((g) => g.id === "gal-33");
          if (gal33) sanitizedGallery.push(gal33);
        }
        if (!sanitizedGallery.some((g: GalleryItem) => g.id === "gal-34")) {
          const gal34 = initialGalleryItems.find((g) => g.id === "gal-34");
          if (gal34) sanitizedGallery.push(gal34);
        }
        if (!sanitizedGallery.some((g: GalleryItem) => g.id === "gal-35")) {
          const gal35 = initialGalleryItems.find((g) => g.id === "gal-35");
          if (gal35) sanitizedGallery.push(gal35);
        }
        if (!sanitizedGallery.some((g: GalleryItem) => g.id === "gal-36")) {
          const gal36 = initialGalleryItems.find((g) => g.id === "gal-36");
          if (gal36) sanitizedGallery.push(gal36);
        }
        if (!sanitizedGallery.some((g: GalleryItem) => g.id === "gal-37")) {
          const gal37 = initialGalleryItems.find((g) => g.id === "gal-37");
          if (gal37) sanitizedGallery.push(gal37);
        }
        if (!sanitizedGallery.some((g: GalleryItem) => g.id === "gal-38")) {
          const gal38 = initialGalleryItems.find((g) => g.id === "gal-38");
          if (gal38) sanitizedGallery.push(gal38);
        }
        if (!sanitizedGallery.some((g: GalleryItem) => g.id === "gal-39")) {
          const gal39 = initialGalleryItems.find((g) => g.id === "gal-39");
          if (gal39) sanitizedGallery.push(gal39);
        }
        if (!sanitizedGallery.some((g: GalleryItem) => g.id === "gal-40")) {
          const gal40 = initialGalleryItems.find((g) => g.id === "gal-40");
          if (gal40) sanitizedGallery.push(gal40);
        }
        if (!sanitizedGallery.some((g: GalleryItem) => g.id === "gal-41")) {
          const gal41 = initialGalleryItems.find((g) => g.id === "gal-41");
          if (gal41) sanitizedGallery.push(gal41);
        }
        if (!sanitizedGallery.some((g: GalleryItem) => g.id === "gal-42")) {
          const gal42 = initialGalleryItems.find((g) => g.id === "gal-42");
          if (gal42) sanitizedGallery.push(gal42);
        }
        if (!sanitizedGallery.some((g: GalleryItem) => g.id === "gal-43")) {
          const gal43 = initialGalleryItems.find((g) => g.id === "gal-43");
          if (gal43) sanitizedGallery.push(gal43);
        }
        if (!sanitizedGallery.some((g: GalleryItem) => g.id === "gal-44")) {
          const gal44 = initialGalleryItems.find((g) => g.id === "gal-44");
          if (gal44) sanitizedGallery.push(gal44);
        }
        if (!sanitizedGallery.some((g: GalleryItem) => g.id === "gal-45")) {
          const gal45 = initialGalleryItems.find((g) => g.id === "gal-45");
          if (gal45) sanitizedGallery.push(gal45);
        }
        if (!sanitizedGallery.some((g: GalleryItem) => g.id === "gal-46")) {
          const gal46 = initialGalleryItems.find((g) => g.id === "gal-46");
          if (gal46) sanitizedGallery.push(gal46);
        }
        if (!sanitizedGallery.some((g: GalleryItem) => g.id === "gal-47")) {
          const gal47 = initialGalleryItems.find((g) => g.id === "gal-47");
          if (gal47) sanitizedGallery.push(gal47);
        }
        if (!sanitizedGallery.some((g: GalleryItem) => g.id === "gal-48")) {
          const gal48 = initialGalleryItems.find((g) => g.id === "gal-48");
          if (gal48) sanitizedGallery.push(gal48);
        }
        setGallery(sanitizedGallery);
        localStorage.setItem(STORAGE_KEYS.GALLERY, JSON.stringify(sanitizedGallery));
      }

      const storedRecognitions = localStorage.getItem(STORAGE_KEYS.RECOGNITIONS);
      if (storedRecognitions) {
        const parsed = JSON.parse(storedRecognitions);
        const rec3Fresh = initialRecognitions.find((r) => r.id === "rec-3");
        const rec6Fresh = initialRecognitions.find((r) => r.id === "rec-6");
        const rec8Fresh = initialRecognitions.find((r) => r.id === "rec-8");
        const sanitizedRecognitions = parsed.map((r: Recognition) => {
          if (r.id === "rec-3" || r.projectSlug === "dune-sanctuary" || r.projectAssociated === "DUNE SANCTUARY") {
            return rec3Fresh || r;
          }
          if (r.id === "rec-6" || r.projectSlug === "corten-pavilion" || r.projectAssociated === "CORTEN PAVILION") {
            return rec6Fresh || r;
          }
          if (r.id === "rec-8" || r.projectSlug === "atelier-basavanagudi" || r.projectAssociated === "ATELIER BASAVANAGUDI") {
            return rec8Fresh || r;
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
        const test3Fresh = initialTestimonials.find((t) => t.id === "test-3");
        const test4Fresh = initialTestimonials.find((t) => t.id === "test-4");
        const sanitizedTestimonials = parsed.map((t: Testimonial) => {
          if (t.id === "test-2" || t.projectAssociated === "CORTEN PAVILION") {
            return test2Fresh || t;
          }
          if (t.id === "test-3" || t.projectAssociated === "DUNE SANCTUARY") {
            return test3Fresh || t;
          }
          if (t.id === "test-4" || t.projectAssociated === "SHADOW HOUSE") {
            return test4Fresh || t;
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
