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
        const filtered = parsed.filter(
          (p: Project) =>
            p.id !== "proj-9" &&
            p.slug !== "hillside-monastery" &&
            p.title !== "HILLSIDE MEDITATION RETREAT" &&
            p.id !== "proj-11" &&
            p.slug !== "solaris-masterplan" &&
            p.title !== "SOLARIS BIODIVERSE CAMPUS"
        );
        const aikyaFresh = initialProjects.find((p) => p.id === "proj-1" || p.slug === "aikya");
        const belakuFresh = initialProjects.find((p) => p.id === "proj-2" || p.slug === "belaku");
        const bttFresh = initialProjects.find((p) => p.id === "proj-3" || p.slug === "between-two-trees");
        const brindavanFresh = initialProjects.find((p) => p.id === "proj-4" || p.slug === "brindavan");
        const farSiteFresh = initialProjects.find((p) => p.id === "proj-5" || p.slug === "far-site-buildofy");
        const houseInTheAirFresh = initialProjects.find((p) => p.id === "proj-6" || p.slug === "house-in-the-air");
        const kanasuFresh = initialProjects.find((p) => p.id === "proj-7" || p.slug === "kanasu");
        const kripaFresh = initialProjects.find((p) => p.id === "proj-8" || p.slug === "kripa");
        const salutFresh = initialProjects.find((p) => p.id === "proj-10" || p.slug === "salut");
        const sanitized = filtered.map((p: Project) => {
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
          if (
            p.id === "proj-6" ||
            p.slug === "urban-veranda" ||
            p.slug === "house-in-the-air" ||
            p.title === "URBAN VERANDA"
          ) {
            return houseInTheAirFresh || p;
          }
          if (
            p.id === "proj-7" ||
            p.slug === "kavya-residence" ||
            p.slug === "kanasu" ||
            p.title === "KAVYA RESIDENCE"
          ) {
            return kanasuFresh || p;
          }
          if (
            p.id === "proj-8" ||
            p.slug === "timber-terrace" ||
            p.slug === "kripa" ||
            p.title === "TIMBER TERRACE"
          ) {
            return kripaFresh || p;
          }
          if (
            p.id === "proj-10" ||
            p.slug === "serene-penthouse" ||
            p.slug === "salut" ||
            p.title === "SERENE PENTHOUSE"
          ) {
            return salutFresh || p;
          }
          let modified = p;
          if (p.relatedSlugs) {
            modified = {
              ...p,
              relatedSlugs: p.relatedSlugs
                .filter((s) => s !== "hillside-monastery" && s !== "solaris-masterplan")
                .map((s) => {
                  if (s === "monolith-house") return "aikya";
                  if (s === "corten-pavilion") return "belaku";
                  if (s === "dune-sanctuary") return "between-two-trees";
                  if (s === "atelier-basavanagudi") return "brindavan";
                  if (s === "shadow-house") return "far-site-buildofy";
                  if (s === "urban-veranda") return "house-in-the-air";
                  if (s === "kavya-residence") return "kanasu";
                  if (s === "timber-terrace") return "kripa";
                  if (s === "serene-penthouse") return "salut";
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
          relatedProjectSlugs: s.relatedProjectSlugs
            ?.filter((slug) => slug !== "solaris-masterplan" && slug !== "hillside-monastery")
            .map((slug) =>
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
                : slug === "urban-veranda"
                ? "house-in-the-air"
                : slug === "kavya-residence"
                ? "kanasu"
                : slug === "timber-terrace"
                ? "kripa"
                : slug === "serene-penthouse"
                ? "salut"
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
        const filteredGallery = parsed.filter(
          (g: GalleryItem) =>
            g.id !== "gal-10" &&
            g.projectSlug !== "hillside-monastery" &&
            g.projectSlug !== "solaris-masterplan" &&
            g.projectTitle !== "HILLSIDE MEDITATION RETREAT" &&
            g.projectTitle !== "SOLARIS BIODIVERSE CAMPUS"
        );
        const gal3Fresh = initialGalleryItems.find((g) => g.id === "gal-3");
        const gal4Fresh = initialGalleryItems.find((g) => g.id === "gal-4");
        const gal5Fresh = initialGalleryItems.find((g) => g.id === "gal-5");
        const gal6Fresh = initialGalleryItems.find((g) => g.id === "gal-6");
        const gal7Fresh = initialGalleryItems.find((g) => g.id === "gal-7");
        const gal9Fresh = initialGalleryItems.find((g) => g.id === "gal-9");
        const gal11Fresh = initialGalleryItems.find((g) => g.id === "gal-11");
        const gal14Fresh = initialGalleryItems.find((g) => g.id === "gal-14");
        const gal8Fresh = initialGalleryItems.find((g) => g.id === "gal-8");
        const gal12Fresh = initialGalleryItems.find((g) => g.id === "gal-12");
        let sanitizedGallery = filteredGallery.map((g: GalleryItem) => {
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
          if (g.id === "gal-8" || g.projectSlug === "timber-terrace" || g.projectTitle === "TIMBER TERRACE") {
            return gal8Fresh || g;
          }
          if (g.id === "gal-9" || (g.projectSlug === "dune-sanctuary" && g.id === "gal-9")) {
            return gal9Fresh || g;
          }
          if (g.id === "gal-11" || (g.projectSlug === "shadow-house" && g.id === "gal-11")) {
            return gal11Fresh || g;
          }
          if (g.id === "gal-12" || g.projectSlug === "serene-penthouse" || g.projectTitle === "SERENE PENTHOUSE") {
            return gal12Fresh || g;
          }
          if (g.id === "gal-14" || g.projectSlug === "urban-veranda" || g.projectTitle === "URBAN VERANDA") {
            return gal14Fresh || g;
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
          if (g.projectSlug === "urban-veranda") {
            return {
              ...g,
              projectSlug: "house-in-the-air",
              projectTitle: "HOUSE IN THE AIR",
            };
          }
          if (g.projectSlug === "kavya-residence") {
            return {
              ...g,
              projectSlug: "kanasu",
              projectTitle: "KANASU",
            };
          }
          if (g.projectSlug === "timber-terrace") {
            return {
              ...g,
              projectSlug: "kripa",
              projectTitle: "KRIPA",
            };
          }
          if (g.projectSlug === "serene-penthouse") {
            return {
              ...g,
              projectSlug: "salut",
              projectTitle: "SALUT",
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
        if (!sanitizedGallery.some((g: GalleryItem) => g.id === "gal-49")) {
          const gal49 = initialGalleryItems.find((g) => g.id === "gal-49");
          if (gal49) sanitizedGallery.push(gal49);
        }
        if (!sanitizedGallery.some((g: GalleryItem) => g.id === "gal-50")) {
          const gal50 = initialGalleryItems.find((g) => g.id === "gal-50");
          if (gal50) sanitizedGallery.push(gal50);
        }
        if (!sanitizedGallery.some((g: GalleryItem) => g.id === "gal-51")) {
          const gal51 = initialGalleryItems.find((g) => g.id === "gal-51");
          if (gal51) sanitizedGallery.push(gal51);
        }
        if (!sanitizedGallery.some((g: GalleryItem) => g.id === "gal-52")) {
          const gal52 = initialGalleryItems.find((g) => g.id === "gal-52");
          if (gal52) sanitizedGallery.push(gal52);
        }
        if (!sanitizedGallery.some((g: GalleryItem) => g.id === "gal-53")) {
          const gal53 = initialGalleryItems.find((g) => g.id === "gal-53");
          if (gal53) sanitizedGallery.push(gal53);
        }
        if (!sanitizedGallery.some((g: GalleryItem) => g.id === "gal-54")) {
          const gal54 = initialGalleryItems.find((g) => g.id === "gal-54");
          if (gal54) sanitizedGallery.push(gal54);
        }
        if (!sanitizedGallery.some((g: GalleryItem) => g.id === "gal-55")) {
          const gal55 = initialGalleryItems.find((g) => g.id === "gal-55");
          if (gal55) sanitizedGallery.push(gal55);
        }
        if (!sanitizedGallery.some((g: GalleryItem) => g.id === "gal-56")) {
          const gal56 = initialGalleryItems.find((g) => g.id === "gal-56");
          if (gal56) sanitizedGallery.push(gal56);
        }
        if (!sanitizedGallery.some((g: GalleryItem) => g.id === "gal-57")) {
          const gal57 = initialGalleryItems.find((g) => g.id === "gal-57");
          if (gal57) sanitizedGallery.push(gal57);
        }
        if (!sanitizedGallery.some((g: GalleryItem) => g.id === "gal-58")) {
          const gal58 = initialGalleryItems.find((g) => g.id === "gal-58");
          if (gal58) sanitizedGallery.push(gal58);
        }
        if (!sanitizedGallery.some((g: GalleryItem) => g.id === "gal-59")) {
          const gal59 = initialGalleryItems.find((g) => g.id === "gal-59");
          if (gal59) sanitizedGallery.push(gal59);
        }
        if (!sanitizedGallery.some((g: GalleryItem) => g.id === "gal-60")) {
          const gal60 = initialGalleryItems.find((g) => g.id === "gal-60");
          if (gal60) sanitizedGallery.push(gal60);
        }
        if (!sanitizedGallery.some((g: GalleryItem) => g.id === "gal-61")) {
          const gal61 = initialGalleryItems.find((g) => g.id === "gal-61");
          if (gal61) sanitizedGallery.push(gal61);
        }
        if (!sanitizedGallery.some((g: GalleryItem) => g.id === "gal-62")) {
          const gal62 = initialGalleryItems.find((g) => g.id === "gal-62");
          if (gal62) sanitizedGallery.push(gal62);
        }
        if (!sanitizedGallery.some((g: GalleryItem) => g.id === "gal-63")) {
          const gal63 = initialGalleryItems.find((g) => g.id === "gal-63");
          if (gal63) sanitizedGallery.push(gal63);
        }
        if (!sanitizedGallery.some((g: GalleryItem) => g.id === "gal-64")) {
          const gal64 = initialGalleryItems.find((g) => g.id === "gal-64");
          if (gal64) sanitizedGallery.push(gal64);
        }
        if (!sanitizedGallery.some((g: GalleryItem) => g.id === "gal-65")) {
          const gal65 = initialGalleryItems.find((g) => g.id === "gal-65");
          if (gal65) sanitizedGallery.push(gal65);
        }
        if (!sanitizedGallery.some((g: GalleryItem) => g.id === "gal-66")) {
          const gal66 = initialGalleryItems.find((g) => g.id === "gal-66");
          if (gal66) sanitizedGallery.push(gal66);
        }
        if (!sanitizedGallery.some((g: GalleryItem) => g.id === "gal-67")) {
          const gal67 = initialGalleryItems.find((g) => g.id === "gal-67");
          if (gal67) sanitizedGallery.push(gal67);
        }
        if (!sanitizedGallery.some((g: GalleryItem) => g.id === "gal-68")) {
          const gal68 = initialGalleryItems.find((g) => g.id === "gal-68");
          if (gal68) sanitizedGallery.push(gal68);
        }
        if (!sanitizedGallery.some((g: GalleryItem) => g.id === "gal-69")) {
          const gal69 = initialGalleryItems.find((g) => g.id === "gal-69");
          if (gal69) sanitizedGallery.push(gal69);
        }
        if (!sanitizedGallery.some((g: GalleryItem) => g.id === "gal-70")) {
          const gal70 = initialGalleryItems.find((g) => g.id === "gal-70");
          if (gal70) sanitizedGallery.push(gal70);
        }
        if (!sanitizedGallery.some((g: GalleryItem) => g.id === "gal-71")) {
          const gal71 = initialGalleryItems.find((g) => g.id === "gal-71");
          if (gal71) sanitizedGallery.push(gal71);
        }
        if (!sanitizedGallery.some((g: GalleryItem) => g.id === "gal-72")) {
          const gal72 = initialGalleryItems.find((g) => g.id === "gal-72");
          if (gal72) sanitizedGallery.push(gal72);
        }
        if (!sanitizedGallery.some((g: GalleryItem) => g.id === "gal-73")) {
          const gal73 = initialGalleryItems.find((g) => g.id === "gal-73");
          if (gal73) sanitizedGallery.push(gal73);
        }
        if (!sanitizedGallery.some((g: GalleryItem) => g.id === "gal-74")) {
          const gal74 = initialGalleryItems.find((g) => g.id === "gal-74");
          if (gal74) sanitizedGallery.push(gal74);
        }
        if (!sanitizedGallery.some((g: GalleryItem) => g.id === "gal-75")) {
          const gal75 = initialGalleryItems.find((g) => g.id === "gal-75");
          if (gal75) sanitizedGallery.push(gal75);
        }
        if (!sanitizedGallery.some((g: GalleryItem) => g.id === "gal-76")) {
          const gal76 = initialGalleryItems.find((g) => g.id === "gal-76");
          if (gal76) sanitizedGallery.push(gal76);
        }
        if (!sanitizedGallery.some((g: GalleryItem) => g.id === "gal-77")) {
          const gal77 = initialGalleryItems.find((g) => g.id === "gal-77");
          if (gal77) sanitizedGallery.push(gal77);
        }
        if (!sanitizedGallery.some((g: GalleryItem) => g.id === "gal-78")) {
          const gal78 = initialGalleryItems.find((g) => g.id === "gal-78");
          if (gal78) sanitizedGallery.push(gal78);
        }
        if (!sanitizedGallery.some((g: GalleryItem) => g.id === "gal-79")) {
          const gal79 = initialGalleryItems.find((g) => g.id === "gal-79");
          if (gal79) sanitizedGallery.push(gal79);
        }
        if (!sanitizedGallery.some((g: GalleryItem) => g.id === "gal-80")) {
          const gal80 = initialGalleryItems.find((g) => g.id === "gal-80");
          if (gal80) sanitizedGallery.push(gal80);
        }
        if (!sanitizedGallery.some((g: GalleryItem) => g.id === "gal-81")) {
          const gal81 = initialGalleryItems.find((g) => g.id === "gal-81");
          if (gal81) sanitizedGallery.push(gal81);
        }
        if (!sanitizedGallery.some((g: GalleryItem) => g.id === "gal-82")) {
          const gal82 = initialGalleryItems.find((g) => g.id === "gal-82");
          if (gal82) sanitizedGallery.push(gal82);
        }
        if (!sanitizedGallery.some((g: GalleryItem) => g.id === "gal-83")) {
          const gal83 = initialGalleryItems.find((g) => g.id === "gal-83");
          if (gal83) sanitizedGallery.push(gal83);
        }
        if (!sanitizedGallery.some((g: GalleryItem) => g.id === "gal-84")) {
          const gal84 = initialGalleryItems.find((g) => g.id === "gal-84");
          if (gal84) sanitizedGallery.push(gal84);
        }
        if (!sanitizedGallery.some((g: GalleryItem) => g.id === "gal-85")) {
          const gal85 = initialGalleryItems.find((g) => g.id === "gal-85");
          if (gal85) sanitizedGallery.push(gal85);
        }
        if (!sanitizedGallery.some((g: GalleryItem) => g.id === "gal-86")) {
          const gal86 = initialGalleryItems.find((g) => g.id === "gal-86");
          if (gal86) sanitizedGallery.push(gal86);
        }
        if (!sanitizedGallery.some((g: GalleryItem) => g.id === "gal-87")) {
          const gal87 = initialGalleryItems.find((g) => g.id === "gal-87");
          if (gal87) sanitizedGallery.push(gal87);
        }
        if (!sanitizedGallery.some((g: GalleryItem) => g.id === "gal-88")) {
          const gal88 = initialGalleryItems.find((g) => g.id === "gal-88");
          if (gal88) sanitizedGallery.push(gal88);
        }
        if (!sanitizedGallery.some((g: GalleryItem) => g.id === "gal-89")) {
          const gal89 = initialGalleryItems.find((g) => g.id === "gal-89");
          if (gal89) sanitizedGallery.push(gal89);
        }
        if (!sanitizedGallery.some((g: GalleryItem) => g.id === "gal-90")) {
          const gal90 = initialGalleryItems.find((g) => g.id === "gal-90");
          if (gal90) sanitizedGallery.push(gal90);
        }
        if (!sanitizedGallery.some((g: GalleryItem) => g.id === "gal-91")) {
          const gal91 = initialGalleryItems.find((g) => g.id === "gal-91");
          if (gal91) sanitizedGallery.push(gal91);
        }
        if (!sanitizedGallery.some((g: GalleryItem) => g.id === "gal-92")) {
          const gal92 = initialGalleryItems.find((g) => g.id === "gal-92");
          if (gal92) sanitizedGallery.push(gal92);
        }
        if (!sanitizedGallery.some((g: GalleryItem) => g.id === "gal-93")) {
          const gal93 = initialGalleryItems.find((g) => g.id === "gal-93");
          if (gal93) sanitizedGallery.push(gal93);
        }
        if (!sanitizedGallery.some((g: GalleryItem) => g.id === "gal-94")) {
          const gal94 = initialGalleryItems.find((g) => g.id === "gal-94");
          if (gal94) sanitizedGallery.push(gal94);
        }
        if (!sanitizedGallery.some((g: GalleryItem) => g.id === "gal-95")) {
          const gal95 = initialGalleryItems.find((g) => g.id === "gal-95");
          if (gal95) sanitizedGallery.push(gal95);
        }
        if (!sanitizedGallery.some((g: GalleryItem) => g.id === "gal-96")) {
          const gal96 = initialGalleryItems.find((g) => g.id === "gal-96");
          if (gal96) sanitizedGallery.push(gal96);
        }
        if (!sanitizedGallery.some((g: GalleryItem) => g.id === "gal-97")) {
          const gal97 = initialGalleryItems.find((g) => g.id === "gal-97");
          if (gal97) sanitizedGallery.push(gal97);
        }
        if (!sanitizedGallery.some((g: GalleryItem) => g.id === "gal-98")) {
          const gal98 = initialGalleryItems.find((g) => g.id === "gal-98");
          if (gal98) sanitizedGallery.push(gal98);
        }
        if (!sanitizedGallery.some((g: GalleryItem) => g.id === "gal-99")) {
          const gal99 = initialGalleryItems.find((g) => g.id === "gal-99");
          if (gal99) sanitizedGallery.push(gal99);
        }
        if (!sanitizedGallery.some((g: GalleryItem) => g.id === "gal-100")) {
          const gal100 = initialGalleryItems.find((g) => g.id === "gal-100");
          if (gal100) sanitizedGallery.push(gal100);
        }
        if (!sanitizedGallery.some((g: GalleryItem) => g.id === "gal-101")) {
          const gal101 = initialGalleryItems.find((g) => g.id === "gal-101");
          if (gal101) sanitizedGallery.push(gal101);
        }
        if (!sanitizedGallery.some((g: GalleryItem) => g.id === "gal-102")) {
          const gal102 = initialGalleryItems.find((g) => g.id === "gal-102");
          if (gal102) sanitizedGallery.push(gal102);
        }
        if (!sanitizedGallery.some((g: GalleryItem) => g.id === "gal-103")) {
          const gal103 = initialGalleryItems.find((g) => g.id === "gal-103");
          if (gal103) sanitizedGallery.push(gal103);
        }
        if (!sanitizedGallery.some((g: GalleryItem) => g.id === "gal-104")) {
          const gal104 = initialGalleryItems.find((g) => g.id === "gal-104");
          if (gal104) sanitizedGallery.push(gal104);
        }
        if (!sanitizedGallery.some((g: GalleryItem) => g.id === "gal-105")) {
          const gal105 = initialGalleryItems.find((g) => g.id === "gal-105");
          if (gal105) sanitizedGallery.push(gal105);
        }
        if (!sanitizedGallery.some((g: GalleryItem) => g.id === "gal-106")) {
          const gal106 = initialGalleryItems.find((g) => g.id === "gal-106");
          if (gal106) sanitizedGallery.push(gal106);
        }
        if (!sanitizedGallery.some((g: GalleryItem) => g.id === "gal-107")) {
          const gal107 = initialGalleryItems.find((g) => g.id === "gal-107");
          if (gal107) sanitizedGallery.push(gal107);
        }
        if (!sanitizedGallery.some((g: GalleryItem) => g.id === "gal-108")) {
          const gal108 = initialGalleryItems.find((g) => g.id === "gal-108");
          if (gal108) sanitizedGallery.push(gal108);
        }
        if (!sanitizedGallery.some((g: GalleryItem) => g.id === "gal-109")) {
          const gal109 = initialGalleryItems.find((g) => g.id === "gal-109");
          if (gal109) sanitizedGallery.push(gal109);
        }
        if (!sanitizedGallery.some((g: GalleryItem) => g.id === "gal-110")) {
          const gal110 = initialGalleryItems.find((g) => g.id === "gal-110");
          if (gal110) sanitizedGallery.push(gal110);
        }
        if (!sanitizedGallery.some((g: GalleryItem) => g.id === "gal-111")) {
          const gal111 = initialGalleryItems.find((g) => g.id === "gal-111");
          if (gal111) sanitizedGallery.push(gal111);
        }
        if (!sanitizedGallery.some((g: GalleryItem) => g.id === "gal-112")) {
          const gal112 = initialGalleryItems.find((g) => g.id === "gal-112");
          if (gal112) sanitizedGallery.push(gal112);
        }
        if (!sanitizedGallery.some((g: GalleryItem) => g.id === "gal-113")) {
          const gal113 = initialGalleryItems.find((g) => g.id === "gal-113");
          if (gal113) sanitizedGallery.push(gal113);
        }
        if (!sanitizedGallery.some((g: GalleryItem) => g.id === "gal-114")) {
          const gal114 = initialGalleryItems.find((g) => g.id === "gal-114");
          if (gal114) sanitizedGallery.push(gal114);
        }
        if (!sanitizedGallery.some((g: GalleryItem) => g.id === "gal-115")) {
          const gal115 = initialGalleryItems.find((g) => g.id === "gal-115");
          if (gal115) sanitizedGallery.push(gal115);
        }
        if (!sanitizedGallery.some((g: GalleryItem) => g.id === "gal-116")) {
          const gal116 = initialGalleryItems.find((g) => g.id === "gal-116");
          if (gal116) sanitizedGallery.push(gal116);
        }
        if (!sanitizedGallery.some((g: GalleryItem) => g.id === "gal-117")) {
          const gal117 = initialGalleryItems.find((g) => g.id === "gal-117");
          if (gal117) sanitizedGallery.push(gal117);
        }
        if (!sanitizedGallery.some((g: GalleryItem) => g.id === "gal-118")) {
          const gal118 = initialGalleryItems.find((g) => g.id === "gal-118");
          if (gal118) sanitizedGallery.push(gal118);
        }
        if (!sanitizedGallery.some((g: GalleryItem) => g.id === "gal-119")) {
          const gal119 = initialGalleryItems.find((g) => g.id === "gal-119");
          if (gal119) sanitizedGallery.push(gal119);
        }
        if (!sanitizedGallery.some((g: GalleryItem) => g.id === "gal-120")) {
          const gal120 = initialGalleryItems.find((g) => g.id === "gal-120");
          if (gal120) sanitizedGallery.push(gal120);
        }
        if (!sanitizedGallery.some((g: GalleryItem) => g.id === "gal-121")) {
          const gal121 = initialGalleryItems.find((g) => g.id === "gal-121");
          if (gal121) sanitizedGallery.push(gal121);
        }
        if (!sanitizedGallery.some((g: GalleryItem) => g.id === "gal-122")) {
          const gal122 = initialGalleryItems.find((g) => g.id === "gal-122");
          if (gal122) sanitizedGallery.push(gal122);
        }
        if (!sanitizedGallery.some((g: GalleryItem) => g.id === "gal-123")) {
          const gal123 = initialGalleryItems.find((g) => g.id === "gal-123");
          if (gal123) sanitizedGallery.push(gal123);
        }
        if (!sanitizedGallery.some((g: GalleryItem) => g.id === "gal-124")) {
          const gal124 = initialGalleryItems.find((g) => g.id === "gal-124");
          if (gal124) sanitizedGallery.push(gal124);
        }
        if (!sanitizedGallery.some((g: GalleryItem) => g.id === "gal-125")) {
          const gal125 = initialGalleryItems.find((g) => g.id === "gal-125");
          if (gal125) sanitizedGallery.push(gal125);
        }
        if (!sanitizedGallery.some((g: GalleryItem) => g.id === "gal-126")) {
          const gal126 = initialGalleryItems.find((g) => g.id === "gal-126");
          if (gal126) sanitizedGallery.push(gal126);
        }
        if (!sanitizedGallery.some((g: GalleryItem) => g.id === "gal-127")) {
          const gal127 = initialGalleryItems.find((g) => g.id === "gal-127");
          if (gal127) sanitizedGallery.push(gal127);
        }
        if (!sanitizedGallery.some((g: GalleryItem) => g.id === "gal-128")) {
          const gal128 = initialGalleryItems.find((g) => g.id === "gal-128");
          if (gal128) sanitizedGallery.push(gal128);
        }
        setGallery(sanitizedGallery);
        localStorage.setItem(STORAGE_KEYS.GALLERY, JSON.stringify(sanitizedGallery));
      }

      const storedRecognitions = localStorage.getItem(STORAGE_KEYS.RECOGNITIONS);
      if (storedRecognitions) {
        const parsed = JSON.parse(storedRecognitions);
        const filteredRecognitions = parsed.filter(
          (r: Recognition) =>
            r.id !== "rec-7" &&
            r.projectSlug !== "hillside-monastery" &&
            r.projectSlug !== "solaris-masterplan" &&
            r.projectAssociated !== "HILLSIDE MEDITATION RETREAT" &&
            r.projectAssociated !== "SOLARIS BIODIVERSE CAMPUS"
        );
        const rec3Fresh = initialRecognitions.find((r) => r.id === "rec-3");
        const rec4Fresh = initialRecognitions.find((r) => r.id === "rec-4");
        const rec6Fresh = initialRecognitions.find((r) => r.id === "rec-6");
        const rec8Fresh = initialRecognitions.find((r) => r.id === "rec-8");
        const sanitizedRecognitions = filteredRecognitions.map((r: Recognition) => {
          if (r.id === "rec-3" || r.projectSlug === "dune-sanctuary" || r.projectAssociated === "DUNE SANCTUARY") {
            return rec3Fresh || r;
          }
          if (r.id === "rec-4" || r.projectSlug === "timber-terrace" || r.projectAssociated === "TIMBER TERRACE") {
            return rec4Fresh || r;
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
