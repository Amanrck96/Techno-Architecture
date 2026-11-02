"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useCMSStore } from "@/lib/cmsStore";
import { Project } from "@/data/projects";

const HOME_COMPLETED_LIMIT = 12;

export default function HomeProjectsGrid() {
  const { projects } = useCMSStore();

  // Show completed projects (up to 12 to cleanly fill 3-column architectural grid)
  const completedProjects = [...projects]
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
    .filter((p) => p.status === "completed")
    .slice(0, HOME_COMPLETED_LIMIT);

  const totalCompleted = projects.filter((p) => p.status === "completed").length;

  return (
    <section id="projects" className="w-full py-14 md:py-20 px-6 sm:px-10 lg:px-16 border-b border-neutral-200 scroll-mt-20">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-neutral-200 pb-5 gap-4">
          <div>
            <span className="text-[10px] uppercase tracking-[0.25em] text-neutral-400 block font-mono font-semibold">
              SELECTED PORTFOLIO
            </span>
            <h2 className="font-display text-2xl md:text-3xl font-light text-neutral-900 tracking-tight mt-1">
              Completed Projects ({totalCompleted})
            </h2>
            <p className="text-xs text-neutral-500 mt-1.5 tracking-wide font-light max-w-2xl">
              A curated selection of completed architectural works across residential, commercial, hospitality and interior design.
            </p>
          </div>

          <Link
            href="/projects?filter=completed"
            className="text-[10px] tracking-[0.2em] uppercase text-neutral-600 hover:text-black transition-colors border-b border-neutral-300 hover:border-black pb-0.5 whitespace-nowrap self-start md:self-end"
          >
            View All {totalCompleted} Completed →
          </Link>
        </div>

        {/* 3-Column Reference-Style Architectural Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {completedProjects.map((project: Project) => (
            <div
              key={project.id}
              className="group relative aspect-[4/3] w-full overflow-hidden bg-neutral-100 border border-neutral-200 hover:border-black transition-all duration-300 shadow-xs hover:shadow-md"
            >
              <Link
                href={`/projects/${project.slug}`}
                className="block w-full h-full"
              >
                {/* Project Image */}
                <Image
                  src={project.mainImage}
                  alt={`Techno Architecture — ${project.title}`}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 ease-editorial group-hover:scale-105"
                />

                {/* Reference Hover Overlay */}
                <div className="absolute inset-0 bg-neutral-900/80 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-between p-6 text-center text-white pointer-events-none">
                  <div className="text-[9px] tracking-[0.25em] text-neutral-400 uppercase">
                    {project.location} · {project.year}
                  </div>

                  <div className="my-auto px-4">
                    <h3 className="font-display text-xs md:text-sm tracking-[0.35em] uppercase text-white font-medium">
                      {project.title}
                    </h3>
                    <span className="block text-[8px] tracking-[0.25em] text-neutral-400 mt-2 uppercase">
                      {project.area}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[9px] tracking-[0.2em] text-neutral-300 uppercase font-light">
                    <span>{project.category} · COMPLETED</span>
                    <span className="text-white/80 underline underline-offset-4">VIEW DOSSIER →</span>
                  </div>
                </div>
              </Link>

              {/* Video Tour Badge if available */}
              {project.videoTour && (
                <a
                  href={project.videoTour.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={`${project.title} — ${project.videoTour.title}`}
                  className="absolute top-3 right-3 z-10 inline-flex items-center gap-1.5 px-2.5 py-1 bg-black/80 hover:bg-black text-white text-[9px] uppercase tracking-[0.2em] backdrop-blur-md border border-white/20 transition-all duration-300 hover:scale-105 shadow-sm group/btn"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                  <span>Watch Film</span>
                  <span className="text-[8px] opacity-70 group-hover/btn:opacity-100">↗</span>
                </a>
              )}
            </div>
          ))}
        </div>

        {/* View All Projects link */}
        <div className="pt-4 text-center">
          <Link
            href="/projects?filter=completed"
            className="inline-block text-[10px] tracking-[0.25em] uppercase font-semibold text-neutral-900 hover:text-neutral-600 border-b border-black pb-1 hover:border-neutral-400 transition-colors"
          >
            VIEW ALL COMPLETED ARCHITECTURAL WORKS ({totalCompleted}) →
          </Link>
        </div>
      </div>
    </section>
  );
}
