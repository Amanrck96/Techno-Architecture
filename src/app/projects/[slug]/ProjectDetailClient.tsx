"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { useCMSStore, defaultProjects } from "@/lib/cmsStore";
import { initialProjects, Project, ProjectImage } from "@/data/projects";
import { ArrowLeft, ArrowRight, ArrowUpRight, ArrowUp, Maximize2 } from "lucide-react";
import ProjectImageLightbox from "@/components/projects/ProjectImageLightbox";

const normalizeSlug = (s: string) =>
  (s || "")
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, "-");

const projectAliases: Record<string, string[]> = {
  "proj-1": ["aikya", "monolith-house"],
  "proj-2": ["belaku", "corten-pavilion"],
  "proj-3": ["between-two-trees", "dune-sanctuary"],
  "proj-4": ["brindavan", "atelier-basavanagudi"],
  "proj-5": ["far-site-buildofy", "shadow-house"],
  "proj-6": ["house-in-the-air", "urban-veranda"],
  "proj-7": ["kanasu", "kavya-residence"],
  "proj-8": ["kripa", "timber-terrace"],
  "proj-10": ["salut", "serene-penthouse"],
  "proj-12": ["the-mantle", "mantle", "the mantle", "mantle-buildofy", "the-mantle-residence", "zenith-residence"],
  "proj-13": ["echoes-of-nirvana", "echoes", "nirvana", "echoes of nirvana"],
  "proj-ongoing-1": ["jagan-residence"],
  "proj-ongoing-2": ["anandam-residence"],
  "proj-ongoing-3": ["suhas-residence"],
  "proj-ongoing-4": ["sneha-residence"],
  "proj-ongoing-5": ["smrithi-residence"],
  "proj-ongoing-6": ["ruchi-sharma-residence"],
  "proj-ongoing-7": ["praana-villas"],
  "proj-ongoing-8": ["vidyanidhi-campus", "vidyanidhi", "college"],
  "proj-ongoing-9": ["maddur-commercial-retreat", "maddur", "maddur-retreat"],
  "proj-ongoing-10": ["urvi-commercial-hub", "urvi", "urvi-commercial"],
  "proj-ongoing-11": ["prana-commercial-commons", "prana-commercial", "prana", "praana-commercial"],
};

const matchesProjectSlug = (p: { id?: string; slug?: string; title?: string }, targetSlug: string) => {
  if (!p) return false;
  const pSlugNorm = normalizeSlug(p.slug || "");
  const targetNorm = normalizeSlug(decodeURIComponent(targetSlug || ""));

  if (!targetNorm) return false;
  if (p.slug === targetSlug || pSlugNorm === targetNorm) return true;
  if (p.id && (p.id.toLowerCase() === targetNorm || normalizeSlug(p.id) === targetNorm)) return true;
  if (p.title && normalizeSlug(p.title) === targetNorm) return true;

  // Check alias groups
  for (const [projId, aliasList] of Object.entries(projectAliases)) {
    const allKnownSlugs = aliasList.map(normalizeSlug);
    const isTargetInGroup = allKnownSlugs.includes(targetNorm) || normalizeSlug(projId) === targetNorm;
    const isProjectInGroup =
      p.id === projId ||
      allKnownSlugs.includes(pSlugNorm) ||
      (projId === "proj-12" && (p.title?.toLowerCase().includes("mantle") || p.id === "proj-12"));

    if (isTargetInGroup && isProjectInGroup) {
      return true;
    }
  }

  return false;
};

export default function ProjectDetailClient({
  params,
}: {
  params?: { slug?: string };
}) {
  const routeParams = useParams();
  const rawSlug = (params?.slug || routeParams?.slug) as string | string[] | undefined;
  const slug = decodeURIComponent(Array.isArray(rawSlug) ? rawSlug[0] : (rawSlug || "")).trim();
  const { projects, testimonials } = useCMSStore();

  const primaryList = Array.isArray(projects) && projects.length > 0 ? projects : defaultProjects;
  let currentIndex = primaryList.findIndex((p) => matchesProjectSlug(p, slug));
  let sourceList = primaryList;

  if (currentIndex === -1 && Array.isArray(defaultProjects) && defaultProjects.length > 0) {
    currentIndex = defaultProjects.findIndex((p) => matchesProjectSlug(p, slug));
    if (currentIndex !== -1) sourceList = defaultProjects;
  }

  if (currentIndex === -1 && Array.isArray(initialProjects) && initialProjects.length > 0) {
    currentIndex = initialProjects.findIndex((p) => matchesProjectSlug(p, slug));
    if (currentIndex !== -1) sourceList = initialProjects;
  }

  if (currentIndex === -1) {
    if (!slug) {
      return (
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="animate-pulse text-xs uppercase tracking-widest font-mono text-neutral-400">
            Loading architectural dossier...
          </div>
        </div>
      );
    }
    return notFound();
  }

  const rawProject = sourceList[currentIndex];

  const sanitizeProject = (p: Project | any): Project | null => {
    if (!p) return null;
    const defaultImage =
      p.id === "proj-1" ? "/projects/aikya/elevation-east.jpg" :
      p.id === "proj-2" ? "/projects/belaku/belaku-central-courtyard-entrance-vista.jpg" :
      p.id === "proj-3" ? "/projects/between-two-trees/between-two-trees-mandapa-court-nandi-pool.jpg" :
      p.id === "proj-4" ? "/projects/brindavan/brindavan-suspended-granite-staircase-motion.jpg" :
      p.id === "proj-5" ? "/projects/far-site-buildofy/far-site-buildofy-twilight-facade-sky-garden.jpg" :
      p.id === "proj-6" ? "/projects/house-in-the-air/house-in-the-air-glass-prayer-sanctuary-foyer.jpg" :
      p.id === "proj-7" ? "/projects/kanasu/kanasu-rooftop-pool-timber-canopy.jpg" :
      p.id === "proj-8" ? "/projects/kripa/kripa-dining-room-indoor-outdoor-veranda.jpg" :
      p.id === "proj-10" ? "/projects/salut/salut-terracotta-jali-bar-atrium.jpg" :
      (p.id === "proj-12" || matchesProjectSlug(p, "the-mantle")) ? "/projects/mantle-buildofy/mantle-buildofy-double-height-living-atrium.jpg" :
      (p.id === "proj-13" || matchesProjectSlug(p, "echoes-of-nirvana")) ? "/projects/echoes-of-nirvana/echoes-of-nirvana-cantilever-sky-elevation.jpg" :
      p.id === "proj-ongoing-8" ? "/projects/vidyanidhi-campus/vidyanidhi-atrium-dusk-cantilever.jpg" :
      p.id === "proj-ongoing-9" ? "/projects/maddur-retreat/maddur-entrance-pavilion.jpg" :
      p.id === "proj-ongoing-10" ? "/projects/urvi-commercial/urvi-facade-dusk.jpg" :
      p.id === "proj-ongoing-11" ? "/projects/prana-commercial/prana-commercial-facade.jpg" :
      "/projects/aikya/elevation-east.jpg";

    return {
      ...p,
      title: p.title || "Untitled Project",
      slug: p.slug || normalizeSlug(p.title || p.id),
      mainImage: p.mainImage || defaultImage,
      gallery: Array.isArray(p.gallery) ? p.gallery : [],
      servicesInvolved: Array.isArray(p.servicesInvolved) ? p.servicesInvolved : ["Architectural Design"],
      teamMembers: Array.isArray(p.teamMembers) ? p.teamMembers : ["Ar. Rajesh Shivaram"],
      relatedSlugs: Array.isArray(p.relatedSlugs) ? p.relatedSlugs : [],
      credits: p.credits || { principalArchitect: "Ar. Rajesh Shivaram" },
    } as Project;
  };

  const project: Project = sanitizeProject(rawProject)!;

  const testimonial =
    project.testimonial ||
    testimonials?.find(
      (t) =>
        t.projectAssociated?.toLowerCase().trim() === project.title.toLowerCase().trim() ||
        t.projectAssociated?.toLowerCase().trim() === project.slug.toLowerCase().trim()
    );

  // Calculate Previous and Next project safely
  const prevProject = sanitizeProject(
    sourceList[(currentIndex - 1 + sourceList.length) % sourceList.length]
  );
  const nextProject = sanitizeProject(
    sourceList[(currentIndex + 1) % sourceList.length]
  );

  // Related projects with guaranteed fresh metadata and alias handling
  const related: Project[] = sourceList
    .filter((p) => {
      if (!p) return false;
      // Don't show self in related
      if (p.slug === project.slug || p.id === project.id) return false;

      // Group self-exclusion check: don't show the same project under an alias
      for (const [projId, aliasList] of Object.entries(projectAliases)) {
        const normalizedAliases = aliasList.map(normalizeSlug);
        const isProjectInGroup =
          project.id === projId ||
          normalizedAliases.includes(normalizeSlug(project.slug)) ||
          (projId === "proj-12" && (project.title?.toLowerCase().includes("mantle") || project.id === "proj-12"));
        const isCandidateInGroup =
          p.id === projId ||
          normalizedAliases.includes(normalizeSlug(p.slug)) ||
          (projId === "proj-12" && (p.title?.toLowerCase().includes("mantle") || p.id === "proj-12"));

        if (isProjectInGroup && isCandidateInGroup) return false;
      }

      // Match relatedSlugs
      if (Array.isArray(project.relatedSlugs) && project.relatedSlugs.length > 0) {
        return project.relatedSlugs.some((relSlug: string) => matchesProjectSlug(p, relSlug));
      }

      return false;
    })
    .map(sanitizeProject)
    .filter((p): p is Project => p !== null);

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const photographyCredit =
    project.credits?.photography ||
    (project.slug === "between-two-trees"
      ? "Anand Jaju"
      : project.slug === "house-in-the-air" || project.slug === "salut"
      ? "Technoarchitecture Studio"
      : "Shamanth Patil Photography");

  const allLightboxImages = [
    {
      url: project.mainImage,
      caption: `${project.title} — Main Architectural Vista (${project.location})`,
      aspect: "full" as const,
    },
    ...(project.gallery || []).map((img: ProjectImage) => ({
      url: img.url,
      caption: img.caption,
      aspect: img.aspect,
    })),
  ];

  return (
    <article className="w-full pt-10 sm:pt-12 md:pt-14 pb-16 px-6 sm:px-10 lg:px-16 max-w-7xl mx-auto space-y-12 sm:space-y-16">
      {/* Breadcrumb Navigation & Back Link */}
      <div className="flex items-center justify-between border-b border-neutral-200 pb-4 text-[10px] tracking-[0.25em] uppercase text-neutral-400 font-mono">
        <Link
          href="/projects"
          className="flex items-center gap-1.5 text-neutral-600 hover:text-black transition-colors font-medium"
        >
          <ArrowLeft size={13} />
          <span>PROJECTS ARCHIVE</span>
        </Link>
        <span>
          {project.category} · {project.status.toUpperCase()}
        </span>
      </div>

      {/* 1. Project Title & Key Metadata Header */}
      <div className="space-y-2">
        <span className="text-[10px] uppercase tracking-[0.3em] font-semibold text-neutral-400 block font-mono">
          ARCHITECTURAL DOSSIER
        </span>
        <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-neutral-900 tracking-[0.06em] uppercase">
          {project.title}
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 font-mono tracking-wider pt-1">
          {project.location} · {project.year} · {project.area}
        </p>
      </div>

      {/* 2. Full-Screen / Large Opening Visual */}
      <div
        onClick={() => setLightboxIndex(0)}
        className="relative w-full aspect-[16/9] sm:aspect-[21/10] bg-neutral-100 overflow-hidden cursor-zoom-in group"
        title="Click to view full screen"
      >
        <Image
          src={project.mainImage}
          alt={`${project.title} - Main Exterior Architecture`}
          fill
          priority
          sizes="100vw"
          className="object-cover group-hover:scale-[1.01] transition-transform duration-500"
        />
        <div className="absolute bottom-4 left-4 bg-black/75 backdrop-blur-sm text-white text-[9px] uppercase tracking-[0.2em] px-3 py-1">
          {project.title} — {project.location}
        </div>
        <div className="absolute top-4 right-4 bg-black/60 hover:bg-black/90 text-white px-2.5 py-1.5 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-1.5 text-[9px] uppercase tracking-widest font-mono rounded-sm">
          <Maximize2 size={12} />
          <span className="hidden sm:inline">VIEW FULLSCREEN</span>
        </div>
      </div>

      {/* 3. Narrative Introduction & Structured Metadata Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-4 pb-12 border-b border-neutral-200">
        {/* Left Narrative Column (lg:col-span-7) */}
        <div className="lg:col-span-7 space-y-6">
          <span className="text-[10px] uppercase tracking-[0.3em] font-semibold text-neutral-400 block">
            CONCEPTUAL NARRATIVE
          </span>
          <p className="font-display text-lg sm:text-xl text-neutral-900 font-light leading-relaxed">
            {project.description}
          </p>
          <div className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-light space-y-4 pt-2">
            <p>{project.processNarrative}</p>
          </div>

          {/* Services Involved Pills */}
          <div className="pt-4">
            <span className="text-[9px] uppercase tracking-[0.25em] text-neutral-400 block mb-2 font-medium">
              DISCIPLINES ENGAGED
            </span>
            <div className="flex flex-wrap gap-2">
              {project.servicesInvolved.map((serv: string, idx: number) => (
                <span
                  key={idx}
                  className="text-[10px] tracking-wider uppercase bg-neutral-100 text-neutral-700 px-2.5 py-1"
                >
                  {serv}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Metadata Table (lg:col-span-5) */}
        <div className="lg:col-span-5 bg-neutral-50 p-6 sm:p-8 border border-neutral-200 space-y-4 text-xs">
          <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-neutral-900 block pb-2 border-b border-neutral-200">
            PROJECT DOSSIER
          </span>

          <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-neutral-600">
            <div>
              <span className="text-[9px] uppercase tracking-wider text-neutral-400 block">LOCATION</span>
              <span className="font-medium text-black text-xs">{project.location}</span>
            </div>
            <div>
              <span className="text-[9px] uppercase tracking-wider text-neutral-400 block">COMPLETION</span>
              <span className="font-medium text-black text-xs">{project.year}</span>
            </div>
            <div>
              <span className="text-[9px] uppercase tracking-wider text-neutral-400 block">BUILT AREA</span>
              <span className="font-medium text-black text-xs">{project.area}</span>
            </div>
            <div>
              <span className="text-[9px] uppercase tracking-wider text-neutral-400 block">STATUS</span>
              <span className="font-medium text-black text-xs uppercase">{project.status}</span>
            </div>
            <div>
              <span className="text-[9px] uppercase tracking-wider text-neutral-400 block">CLIENT</span>
              <span className="font-medium text-black text-xs">{project.client}</span>
            </div>
            <div>
              <span className="text-[9px] uppercase tracking-wider text-neutral-400 block">TYPOLOGY</span>
              <span className="font-medium text-black text-xs">{project.category}</span>
            </div>

            {project.videoTour && (
              <div className="col-span-2 pt-2 border-t border-neutral-200">
                <span className="text-[9px] uppercase tracking-wider text-neutral-400 block mb-1">
                  OFFICIAL FILM / TOUR
                </span>
                <a
                  href={project.videoTour.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 font-medium text-black hover:underline uppercase text-[10px] tracking-[0.18em]"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
                  <span>{project.videoTour.actionText || "Watch Video Tour"}</span>
                  <span aria-hidden="true">↗</span>
                </a>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-neutral-200 space-y-2">
            <span className="text-[9px] uppercase tracking-wider text-neutral-400 block">CREDITS & COLLABORATORS</span>
            <div className="text-[11px] text-neutral-600 space-y-1">
              <p><strong className="text-neutral-900 font-medium">Principal Architect:</strong> {project.credits?.principalArchitect || "Ar. Rajesh Shivaram"}</p>
              {(project.credits?.projectArchitect || project.credits?.projectLead) && (
                <p><strong className="text-neutral-900 font-medium">Project Architect:</strong> {project.credits?.projectArchitect || project.credits?.projectLead}</p>
              )}
              {(project.credits?.team || (project.teamMembers && project.teamMembers.length > 0)) && (
                <p><strong className="text-neutral-900 font-medium">Team:</strong> {project.credits?.team || project.teamMembers?.join(", ")}</p>
              )}
              {project.credits?.landscapeArchitect && (
                <p><strong className="text-neutral-900 font-medium">Landscape Architect:</strong> {project.credits.landscapeArchitect}</p>
              )}
              <p>
                <strong className="text-neutral-900 font-medium">Photography:</strong>{" "}
                {photographyCredit}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Client Reflection / Testimonial Section */}
      {testimonial && (
        <section className="bg-neutral-50/90 border border-neutral-200 p-8 sm:p-12 md:p-14 relative overflow-hidden space-y-6">
          <div className="space-y-1">
            <span className="text-[10px] uppercase tracking-[0.3em] font-mono font-semibold text-neutral-400 block">
              CLIENT REFLECTION · TESTIMONIAL
            </span>
            <p className="text-xs text-neutral-500 font-light">
              Our strongest projects grow from trust, open communication and a shared commitment to architectural quality.
            </p>
          </div>

          <div className="relative pl-6 sm:pl-8 border-l-2 border-black space-y-4">
            <blockquote className="font-display text-lg sm:text-xl md:text-2xl font-light text-neutral-900 leading-relaxed italic">
              &ldquo;{testimonial.quote}&rdquo;
            </blockquote>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-neutral-200/80">
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-black">
                  {testimonial.clientName}
                </h4>
                <p className="text-[11px] text-neutral-500 font-mono mt-0.5">
                  {[testimonial.designation, testimonial.company].filter(Boolean).join(" | ") || "Client"}
                </p>
              </div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400">
                PROJECT: {project.title.toUpperCase()} ({project.year})
              </span>
            </div>
          </div>
        </section>
      )}

      {/* Cinematic Film & Walkthrough Showcase Banner (if available) */}
      {project.videoTour && (
        <section className="bg-neutral-950 text-white p-6 sm:p-8 md:p-10 border border-neutral-800 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden group">
          <div className="space-y-2 max-w-2xl relative z-10">
            <div className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-red-500 animate-ping" />
              <span className="text-[10px] uppercase tracking-[0.3em] font-mono text-neutral-400">
                CINEMATIC DOCUMENTATION · {project.videoTour.platform?.toUpperCase() || "FILM"}
              </span>
            </div>
            <h2 className="font-display text-lg sm:text-xl md:text-2xl font-light text-white tracking-wide leading-snug">
              {project.videoTour.title}
            </h2>
            <p className="text-xs text-neutral-400 font-light leading-relaxed">
              Experience the spatial volumes, daylight choreography, and materiality of {project.title} through this curated architectural film walkthrough.
            </p>
          </div>

          <div className="relative z-10 shrink-0">
            <a
              href={project.videoTour.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 bg-white text-black hover:bg-neutral-200 px-6 py-3.5 text-[10px] uppercase tracking-[0.25em] font-medium transition-all duration-300 shadow-md hover:scale-105"
            >
              <span>{project.videoTour.actionText || "Watch Video Tour"}</span>
              <span aria-hidden="true">↗</span>
            </a>
          </div>

          {/* Subtle background ambient graphic */}
          <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-neutral-800/30 rounded-full blur-2xl pointer-events-none" />
        </section>
      )}

      {/* 4. Curated Image Sequence & Gallery Flow (Alternating Full-Bleed and Split Portraits) */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-neutral-200 pb-3">
          <span className="text-[10px] uppercase tracking-[0.3em] font-semibold text-neutral-400">
            IMAGE SEQUENCE & MATERIAL EVIDENCE
          </span>
          <span className="text-[10px] uppercase tracking-[0.18em] text-neutral-500 font-mono">
            Photography: {photographyCredit}
          </span>
        </div>

        <div className="space-y-6">
          {project.gallery.map((img: ProjectImage, idx: number) => {
            const galleryIndex = idx + 1;
            if (img.aspect === "portrait") {
              return (
                <div
                  key={idx}
                  onClick={() => setLightboxIndex(galleryIndex)}
                  className="relative w-full md:w-3/4 mx-auto aspect-[3/4] bg-neutral-100 overflow-hidden cursor-zoom-in group"
                  title="Click to view full screen"
                >
                  <Image
                    src={img.url}
                    alt={img.caption || `${project.title} gallery frame ${idx + 1}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 75vw"
                    className="object-cover group-hover:scale-[1.01] transition-transform duration-500"
                  />
                  {img.caption && (
                    <div className="absolute bottom-3 right-3 bg-black/75 text-white text-[9px] tracking-wider px-3 py-1 backdrop-blur-sm">
                      {img.caption}
                    </div>
                  )}
                  <div className="absolute top-3 right-3 bg-black/60 hover:bg-black/90 text-white p-1.5 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-sm">
                    <Maximize2 size={13} />
                  </div>
                </div>
              );
            }

            return (
              <div
                key={idx}
                onClick={() => setLightboxIndex(galleryIndex)}
                className="relative w-full aspect-[16/9] sm:aspect-[21/10] bg-neutral-100 overflow-hidden cursor-zoom-in group"
                title="Click to view full screen"
              >
                <Image
                  src={img.url}
                  alt={img.caption || `${project.title} gallery frame ${idx + 1}`}
                  fill
                  sizes="100vw"
                  className="object-cover group-hover:scale-[1.01] transition-transform duration-500"
                />
                {img.caption && (
                  <div className="absolute bottom-3 right-3 bg-black/75 text-white text-[9px] tracking-wider px-3 py-1 backdrop-blur-sm">
                    {img.caption}
                  </div>
                )}
                <div className="absolute top-3 right-3 bg-black/60 hover:bg-black/90 text-white p-1.5 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-sm">
                  <Maximize2 size={13} />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. Related Projects Section */}
      {related.length > 0 && (
        <section className="pt-8 border-t border-neutral-200">
          <div className="mb-6 flex justify-between items-center">
            <span className="text-[10px] uppercase tracking-[0.3em] font-semibold text-neutral-900">
              RELATED ARCHITECTURAL WORKS
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {related.map((rel: Project) => (
              <Link
                key={rel.id}
                href={`/projects/${rel.slug}`}
                className="group block bg-neutral-50 border border-neutral-200 overflow-hidden"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden">
                  <Image
                    src={rel.mainImage}
                    alt={rel.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-4 space-y-1">
                  <h3 className="font-display text-xs uppercase tracking-[0.2em] text-neutral-900 font-medium group-hover:text-black">
                    {rel.title}
                  </h3>
                  <p className="text-[9px] text-neutral-500 uppercase tracking-wider">
                    {rel.location} · {rel.category}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 6. Previous / Next Project Navigation Bar */}
      <nav aria-label="Project pager" className="pt-8 border-t border-neutral-300 flex items-center justify-between text-xs tracking-[0.2em] uppercase font-medium">
        {prevProject?.slug ? (
          <Link
            href={`/projects/${prevProject.slug}`}
            className="flex items-center gap-2 text-neutral-600 hover:text-black transition-colors py-2 group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            <span className="hidden sm:inline text-neutral-400">PREVIOUS:</span>
            <span>{prevProject.title}</span>
          </Link>
        ) : <div />}

        <Link
          href="/projects"
          className="text-[10px] text-neutral-400 hover:text-black transition-colors"
        >
          ALL PROJECTS
        </Link>

        {nextProject?.slug ? (
          <Link
            href={`/projects/${nextProject.slug}`}
            className="flex items-center gap-2 text-neutral-600 hover:text-black transition-colors py-2 group text-right"
          >
            <span className="hidden sm:inline text-neutral-400">NEXT:</span>
            <span>{nextProject.title}</span>
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        ) : <div />}
      </nav>

      {/* 7. Bottom Direct "Back to Top" Button */}
      <div className="pt-8 pb-4 flex flex-col items-center justify-center gap-2 border-t border-neutral-200">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="inline-flex items-center gap-2.5 px-7 py-3.5 border border-neutral-300 bg-white hover:bg-neutral-900 hover:text-white hover:border-neutral-900 transition-all duration-300 text-[10px] uppercase tracking-[0.25em] font-medium shadow-sm group cursor-pointer"
          aria-label="Back to top of project page"
        >
          <ArrowUp size={14} className="group-hover:-translate-y-1 transition-transform duration-300" />
          <span>BACK TO TOP</span>
        </button>
        <span className="text-[9px] uppercase tracking-widest text-neutral-400 font-mono">
          Return to top of page
        </span>
      </div>

      {/* Floating Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Scroll back to top"
          className="fixed bottom-24 right-6 lg:right-32 xl:right-36 2xl:right-40 z-40 p-3 sm:p-3.5 bg-neutral-900/90 hover:bg-black text-white shadow-2xl backdrop-blur-md border border-neutral-700/60 rounded-full transition-all duration-300 hover:scale-110 group cursor-pointer"
          title="Back to top"
        >
          <ArrowUp size={16} className="group-hover:-translate-y-0.5 transition-transform" />
        </button>
      )}

      {/* Fullscreen Lightbox Modal */}
      <ProjectImageLightbox
        images={allLightboxImages}
        currentIndex={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNavigate={(idx) => setLightboxIndex(idx)}
        projectTitle={project.title}
        photographyCredit={photographyCredit}
      />
    </article>
  );
}
