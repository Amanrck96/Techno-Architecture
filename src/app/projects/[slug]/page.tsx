"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { useCMSStore } from "@/lib/cmsStore";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";

export default function ProjectDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const { projects } = useCMSStore();

  const currentIndex = projects.findIndex(
    (p) =>
      p.slug === slug ||
      (slug === "monolith-house" && p.slug === "aikya") ||
      (slug === "corten-pavilion" && p.slug === "belaku") ||
      (slug === "dune-sanctuary" && p.slug === "between-two-trees") ||
      (slug === "atelier-basavanagudi" && p.slug === "brindavan") ||
      (slug === "shadow-house" && p.slug === "far-site-buildofy") ||
      (slug === "urban-veranda" && p.slug === "house-in-the-air") ||
      (slug === "kavya-residence" && p.slug === "kanasu") ||
      (slug === "timber-terrace" && p.slug === "kripa") ||
      (slug === "serene-penthouse" && p.slug === "salut") ||
      (slug === "zenith-residence" && p.slug === "mantle-buildofy") ||
      (slug === "mantle-buildofy" && p.slug === "zenith-residence")
  );
  if (currentIndex === -1) {
    // If not found in current store, return 404
    return notFound();
  }

  const rawProject = projects[currentIndex];

  const sanitizeProject = (p: (typeof projects)[0]) => {
    if (!p) return p;
    if (
      p.id === "proj-1" ||
      p.slug === "aikya" ||
      p.slug === "monolith-house" ||
      p.title === "MONOLITH HOUSE"
    ) {
      return {
        ...p,
        title: "AIKYA",
        slug: "aikya",
        mainImage: "/projects/aikya/elevation-east.jpg",
        videoTour: p.videoTour || {
          title: "4,800 sq.ft Aikya House in Bengaluru by Technoarchitecture (Home Tour)",
          url: "https://www.youtube.com/results?search_query=Aikya+House+Technoarchitecture+Home+Tour",
          platform: "YouTube",
          actionText: "Watch House Tour",
        },
      };
    }
    if (
      p.id === "proj-2" ||
      p.slug === "belaku" ||
      p.slug === "corten-pavilion" ||
      p.title === "CORTEN PAVILION"
    ) {
      return {
        ...p,
        title: "BELAKU",
        slug: "belaku",
        mainImage: "/projects/belaku/belaku-central-courtyard-entrance-vista.jpg",
        videoTour: p.videoTour || {
          title: "2400 sq.ft Compact Home in Bengaluru | Belaku Residence by Techno Architecture (Home Tour)",
          url: "https://www.youtube.com/results?search_query=Belaku+Residence+Techno+Architecture+Home+Tour",
          platform: "YouTube",
          actionText: "Watch House Tour",
        },
      };
    }
    if (
      p.id === "proj-3" ||
      p.slug === "between-two-trees" ||
      p.slug === "dune-sanctuary" ||
      p.title === "DUNE SANCTUARY"
    ) {
      return {
        ...p,
        title: "BETWEEN TWO TREES",
        slug: "between-two-trees",
        mainImage: "/projects/between-two-trees/between-two-trees-mandapa-court-nandi-pool.jpg",
        videoTour: p.videoTour || {
          title: "House With a Traditional Chettinad Courtyard Between 2 Trees | Bengaluru | Technoarchitecture",
          url: "https://www.youtube.com/results?search_query=Between+Two+Trees+House+With+a+Traditional+Chettinad+Courtyard+Technoarchitecture",
          platform: "YouTube",
          actionText: "Watch Video Tour",
        },
      };
    }
    if (
      p.id === "proj-4" ||
      p.slug === "brindavan" ||
      p.slug === "atelier-basavanagudi" ||
      p.title === "ATELIER BASAVANAGUDI"
    ) {
      return {
        ...p,
        title: "BRINDAVAN",
        slug: "brindavan",
        mainImage: "/projects/brindavan/brindavan-suspended-granite-staircase-motion.jpg",
      };
    }
    if (
      p.id === "proj-5" ||
      p.slug === "far-site-buildofy" ||
      p.slug === "shadow-house" ||
      p.title === "SHADOW HOUSE"
    ) {
      return {
        ...p,
        title: "FAR SITE BUILDOFY",
        slug: "far-site-buildofy",
        mainImage: "/projects/far-site-buildofy/far-site-buildofy-twilight-facade-sky-garden.jpg",
        videoTour: p.videoTour || {
          title: "2,400 sq.ft Compact House in Malleshwaram Bengaluru Karnataka Explores a Courtyard in a Unique Way",
          url: "https://www.youtube.com/results?search_query=2400+sqft+Compact+House+in+Malleshwaram+Bengaluru+The+Far+Site+Technoarchitecture",
          platform: "Buildofy",
          actionText: "Watch Buildofy Film",
        },
      };
    }
    if (
      p.id === "proj-6" ||
      p.slug === "house-in-the-air" ||
      p.slug === "urban-veranda" ||
      p.title === "URBAN VERANDA"
    ) {
      return {
        ...p,
        title: "HOUSE IN THE AIR",
        slug: "house-in-the-air",
        mainImage: "/projects/house-in-the-air/house-in-the-air-glass-prayer-sanctuary-foyer.jpg",
      };
    }
    if (
      p.id === "proj-7" ||
      p.slug === "kanasu" ||
      p.slug === "kavya-residence" ||
      p.title === "KAVYA RESIDENCE"
    ) {
      return {
        ...p,
        title: "KANASU",
        slug: "kanasu",
        mainImage: "/projects/kanasu/kanasu-rooftop-pool-timber-canopy.jpg",
        videoTour: p.videoTour || {
          title: "Luxury Vastu House Kanasu in Bengaluru, Karnataka | Technoarchitecture (Home Tour)",
          url: "https://www.youtube.com/results?search_query=Luxury+Vastu+House+Kanasu+in+Bengaluru+Technoarchitecture+Home+Tour",
          platform: "YouTube",
          actionText: "Watch House Tour",
        },
      };
    }
    if (
      p.id === "proj-8" ||
      p.slug === "kripa" ||
      p.slug === "timber-terrace" ||
      p.title === "TIMBER TERRACE"
    ) {
      return {
        ...p,
        title: "KRIPA",
        slug: "kripa",
        mainImage: "/projects/kripa/kripa-dining-room-indoor-outdoor-veranda.jpg",
        videoTour: p.videoTour || {
          title: "1,500 sq.ft. Compact Home in Bangalore (House Tour)",
          url: "https://www.youtube.com/results?search_query=Kripa+1500+sq+ft+Techno+Architecture+House+Tour",
          platform: "YouTube",
          actionText: "Watch House Tour",
        },
      };
    }
    if (
      p.id === "proj-10" ||
      p.slug === "salut" ||
      p.slug === "serene-penthouse" ||
      p.title === "SERENE PENTHOUSE"
    ) {
      return {
        ...p,
        title: "SALUT",
        slug: "salut",
        mainImage: "/projects/salut/salut-terracotta-jali-bar-atrium.jpg",
      };
    }
    if (
      p.id === "proj-12" ||
      p.slug === "mantle-buildofy" ||
      p.slug === "zenith-residence" ||
      p.title === "ZENITH RESIDENCE" ||
      p.title === "MANTLE BUILDOFY"
    ) {
      return {
        ...p,
        title: "MANTLE BUILDOFY",
        slug: "mantle-buildofy",
        mainImage: "/projects/mantle-buildofy/mantle-buildofy-double-height-living-atrium.jpg",
        videoTour: p.videoTour || {
          title: "The Mantle | Main Video Review 2",
          url: "https://www.youtube.com/results?search_query=The+Mantle+Techno+Architecture+Review",
          platform: "Buildofy",
          actionText: "Watch Video Review",
        },
      };
    }
    return p;
  };

  const project = sanitizeProject(rawProject);

  // Calculate Previous and Next project
  const prevProject = sanitizeProject(
    projects[(currentIndex - 1 + projects.length) % projects.length]
  );
  const nextProject = sanitizeProject(
    projects[(currentIndex + 1) % projects.length]
  );

  // Related projects with guaranteed fresh Aikya, Belaku, Between Two Trees, Brindavan & Far Site Buildofy metadata and image
  const related = projects
    .filter((p) => {
      // Don't show self in related
      if (p.slug === project.slug || p.id === project.id) return false;
      if (
        (project.slug === "aikya" || project.id === "proj-1" || project.slug === "monolith-house") &&
        (p.slug === "aikya" || p.slug === "monolith-house" || p.id === "proj-1")
      ) {
        return false;
      }
      if (
        (project.slug === "belaku" || project.id === "proj-2" || project.slug === "corten-pavilion") &&
        (p.slug === "belaku" || p.slug === "corten-pavilion" || p.id === "proj-2")
      ) {
        return false;
      }
      if (
        (project.slug === "between-two-trees" || project.id === "proj-3" || project.slug === "dune-sanctuary") &&
        (p.slug === "between-two-trees" || p.slug === "dune-sanctuary" || p.id === "proj-3")
      ) {
        return false;
      }
      if (
        (project.slug === "brindavan" || project.id === "proj-4" || project.slug === "atelier-basavanagudi") &&
        (p.slug === "brindavan" || p.slug === "atelier-basavanagudi" || p.id === "proj-4")
      ) {
        return false;
      }
      if (
        (project.slug === "far-site-buildofy" || project.id === "proj-5" || project.slug === "shadow-house") &&
        (p.slug === "far-site-buildofy" || p.slug === "shadow-house" || p.id === "proj-5")
      ) {
        return false;
      }
      if (
        (project.slug === "house-in-the-air" || project.id === "proj-6" || project.slug === "urban-veranda") &&
        (p.slug === "house-in-the-air" || p.slug === "urban-veranda" || p.id === "proj-6")
      ) {
        return false;
      }
      if (
        (project.slug === "kanasu" || project.id === "proj-7" || project.slug === "kavya-residence") &&
        (p.slug === "kanasu" || p.slug === "kavya-residence" || p.id === "proj-7")
      ) {
        return false;
      }
      if (
        (project.slug === "kripa" || project.id === "proj-8" || project.slug === "timber-terrace") &&
        (p.slug === "kripa" || p.slug === "timber-terrace" || p.id === "proj-8")
      ) {
        return false;
      }
      if (
        (project.slug === "mantle-buildofy" || project.id === "proj-12" || project.slug === "zenith-residence") &&
        (p.slug === "mantle-buildofy" || p.slug === "zenith-residence" || p.id === "proj-12")
      ) {
        return false;
      }

      return (
        project.relatedSlugs?.includes(p.slug) ||
        (project.relatedSlugs?.includes("monolith-house") && (p.slug === "aikya" || p.id === "proj-1")) ||
        (project.relatedSlugs?.includes("aikya") && (p.slug === "monolith-house" || p.id === "proj-1")) ||
        (project.relatedSlugs?.includes("corten-pavilion") && (p.slug === "belaku" || p.id === "proj-2")) ||
        (project.relatedSlugs?.includes("belaku") && (p.slug === "corten-pavilion" || p.id === "proj-2")) ||
        (project.relatedSlugs?.includes("dune-sanctuary") && (p.slug === "between-two-trees" || p.id === "proj-3")) ||
        (project.relatedSlugs?.includes("between-two-trees") && (p.slug === "dune-sanctuary" || p.id === "proj-3")) ||
        (project.relatedSlugs?.includes("atelier-basavanagudi") && (p.slug === "brindavan" || p.id === "proj-4")) ||
        (project.relatedSlugs?.includes("brindavan") && (p.slug === "atelier-basavanagudi" || p.id === "proj-4")) ||
        (project.relatedSlugs?.includes("shadow-house") && (p.slug === "far-site-buildofy" || p.id === "proj-5")) ||
        (project.relatedSlugs?.includes("far-site-buildofy") && (p.slug === "shadow-house" || p.id === "proj-5")) ||
        (project.relatedSlugs?.includes("urban-veranda") && (p.slug === "house-in-the-air" || p.id === "proj-6")) ||
        (project.relatedSlugs?.includes("house-in-the-air") && (p.slug === "urban-veranda" || p.id === "proj-6")) ||
        (project.relatedSlugs?.includes("kavya-residence") && (p.slug === "kanasu" || p.id === "proj-7")) ||
        (project.relatedSlugs?.includes("kanasu") && (p.slug === "kavya-residence" || p.id === "proj-7")) ||
        (project.relatedSlugs?.includes("timber-terrace") && (p.slug === "kripa" || p.id === "proj-8")) ||
        (project.relatedSlugs?.includes("kripa") && (p.slug === "timber-terrace" || p.id === "proj-8")) ||
        (project.relatedSlugs?.includes("zenith-residence") && (p.slug === "mantle-buildofy" || p.id === "proj-12")) ||
        (project.relatedSlugs?.includes("mantle-buildofy") && (p.slug === "zenith-residence" || p.id === "proj-12"))
      );
    })
    .map(sanitizeProject);

  return (
    <article className="w-full py-6 md:py-10 px-4 md:px-12 lg:px-16 max-w-7xl mx-auto space-y-12 md:space-y-16">
      {/* Breadcrumb Navigation & Back Link */}
      <div className="flex items-center justify-between border-b border-neutral-200 pb-4 text-[10px] tracking-[0.25em] uppercase text-neutral-400">
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
      <div className="space-y-4">
        <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-neutral-900 tracking-[0.1em] uppercase">
          {project.title}
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 font-mono tracking-wider">
          {project.location} · {project.year} · {project.area}
        </p>
      </div>

      {/* 2. Full-Screen / Large Opening Visual */}
      <div className="relative w-full aspect-[16/9] sm:aspect-[21/10] bg-neutral-100 overflow-hidden">
        <Image
          src={project.mainImage}
          alt={`${project.title} - Main Exterior Architecture`}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute bottom-4 left-4 bg-black/75 backdrop-blur-sm text-white text-[9px] uppercase tracking-[0.2em] px-3 py-1">
          {project.title} — {project.location}
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
              {project.servicesInvolved.map((serv, idx) => (
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
                <p><strong className="text-neutral-900 font-medium">Landscape:</strong> {project.credits.landscapeArchitect}</p>
              )}
            </div>
          </div>
        </div>
      </div>

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
        <div className="border-b border-neutral-200 pb-3">
          <span className="text-[10px] uppercase tracking-[0.3em] font-semibold text-neutral-400">
            IMAGE SEQUENCE & MATERIAL EVIDENCE
          </span>
        </div>

        <div className="space-y-6">
          {project.gallery.map((img, idx) => {
            if (img.aspect === "portrait") {
              return (
                <div key={idx} className="relative w-full md:w-3/4 mx-auto aspect-[3/4] bg-neutral-100 overflow-hidden">
                  <Image
                    src={img.url}
                    alt={img.caption || `${project.title} gallery frame ${idx + 1}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 75vw"
                    className="object-cover"
                  />
                  {img.caption && (
                    <div className="absolute bottom-3 right-3 bg-black/75 text-white text-[9px] tracking-wider px-3 py-1 backdrop-blur-sm">
                      {img.caption}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <div key={idx} className="relative w-full aspect-[16/9] sm:aspect-[21/10] bg-neutral-100 overflow-hidden">
                <Image
                  src={img.url}
                  alt={img.caption || `${project.title} gallery frame ${idx + 1}`}
                  fill
                  sizes="100vw"
                  className="object-cover"
                />
                {img.caption && (
                  <div className="absolute bottom-3 right-3 bg-black/75 text-white text-[9px] tracking-wider px-3 py-1 backdrop-blur-sm">
                    {img.caption}
                  </div>
                )}
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
            {related.map((rel) => (
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
        <Link
          href={`/projects/${prevProject.slug}`}
          className="flex items-center gap-2 text-neutral-600 hover:text-black transition-colors py-2 group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          <span className="hidden sm:inline text-neutral-400">PREVIOUS:</span>
          <span>{prevProject.title}</span>
        </Link>

        <Link
          href="/projects"
          className="text-[10px] text-neutral-400 hover:text-black transition-colors"
        >
          ALL PROJECTS
        </Link>

        <Link
          href={`/projects/${nextProject.slug}`}
          className="flex items-center gap-2 text-neutral-600 hover:text-black transition-colors py-2 group text-right"
        >
          <span className="hidden sm:inline text-neutral-400">NEXT:</span>
          <span>{nextProject.title}</span>
          <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </nav>
    </article>
  );
}
