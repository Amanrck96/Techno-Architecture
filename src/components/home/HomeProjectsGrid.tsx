"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useCMSStore } from "@/lib/cmsStore";
import { Project } from "@/data/projects";

const HOME_COMPLETED_LIMIT = 10;

export default function HomeProjectsGrid() {
  const { projects } = useCMSStore();

  // Show ONLY completed projects, capped at 10
  const completedProjects = projects
    .filter((p) => p.status === "completed")
    .slice(0, HOME_COMPLETED_LIMIT);

  const totalCompleted = projects.filter((p) => p.status === "completed").length;

  return (
    <section id="projects" className="w-full pt-8 md:pt-10 pb-12 md:pb-16 px-4 md:px-8 scroll-mt-20">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-neutral-200 gap-4">
        <div>
          <h2 className="text-[11px] uppercase tracking-[0.3em] font-semibold text-neutral-900">
            COMPLETED PROJECTS
          </h2>
          <p className="text-xs text-neutral-500 mt-1 tracking-wide">
            A curated selection of {HOME_COMPLETED_LIMIT} completed works across residential, commercial, hospitality and interior design.
          </p>
        </div>

        <Link
          href="/projects?filter=completed"
          className="text-[10px] tracking-[0.2em] uppercase text-neutral-500 hover:text-black transition-colors border-b border-neutral-300 hover:border-black pb-0.5 whitespace-nowrap self-end"
        >
          View All {totalCompleted} Completed →
        </Link>
      </div>

      {/* 3-Column Reference-Style Architectural Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-2.5">
        {completedProjects.map((project: Project) => (
          <div
            key={project.id}
            className="group relative aspect-[4/3] w-full overflow-hidden bg-neutral-100"
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
      <div className="mt-10 text-center">
        <Link
          href="/projects?filter=completed"
          className="inline-block text-[10px] tracking-[0.25em] uppercase font-semibold text-neutral-900 hover:text-neutral-600 border-b border-black pb-1 hover:border-neutral-400 transition-colors"
        >
          VIEW ALL COMPLETED ARCHITECTURAL WORKS ({completedProjects.length}) →
        </Link>
      </div>
    </section>
  );
}
