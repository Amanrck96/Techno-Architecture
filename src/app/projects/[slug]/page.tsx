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

  const currentIndex = projects.findIndex((p) => p.slug === slug);
  if (currentIndex === -1) {
    // If not found in current store, return 404
    return notFound();
  }

  const project = projects[currentIndex];

  // Calculate Previous and Next project
  const prevProject = projects[(currentIndex - 1 + projects.length) % projects.length];
  const nextProject = projects[(currentIndex + 1) % projects.length];

  // Related projects
  const related = projects.filter((p) => project.relatedSlugs?.includes(p.slug));

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
          </div>

          <div className="pt-4 border-t border-neutral-200 space-y-2">
            <span className="text-[9px] uppercase tracking-wider text-neutral-400 block">CREDITS & COLLABORATORS</span>
            <div className="text-[11px] text-neutral-600 space-y-1">
              <p><strong className="text-neutral-900 font-medium">Principal:</strong> {project.credits.principalArchitect}</p>
              <p><strong className="text-neutral-900 font-medium">Lead:</strong> {project.credits.projectLead}</p>
              <p><strong className="text-neutral-900 font-medium">Structural:</strong> {project.credits.structuralEngineer}</p>
              {project.credits.landscapeArchitect && (
                <p><strong className="text-neutral-900 font-medium">Landscape:</strong> {project.credits.landscapeArchitect}</p>
              )}
            </div>
          </div>
        </div>
      </div>

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
