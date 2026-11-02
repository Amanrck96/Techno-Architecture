"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useCMSStore } from "@/lib/cmsStore";
import { Project } from "@/data/projects";

export default function OngoingProjectsPage() {
  const { projects } = useCMSStore();
  const ongoing = [...projects]
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
    .filter((p) => p.status === "ongoing");

  return (
    <div className="w-full pt-10 sm:pt-12 md:pt-14 pb-16 px-6 sm:px-10 lg:px-16 max-w-7xl mx-auto space-y-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-neutral-200 pb-6 sm:pb-8 gap-6">
        <div className="max-w-3xl space-y-2">
          <div className="flex items-center space-x-2 text-[10px] uppercase tracking-[0.3em] font-semibold text-neutral-400 font-mono">
            <Link href="/projects" className="hover:text-black transition-colors">
              PROJECTS
            </Link>
            <span>/</span>
            <span className="text-black">ONGOING</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-light text-neutral-900 tracking-tight">
            Ongoing Projects ({ongoing.length})
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 font-light leading-relaxed tracking-wide pt-1">
            Our ongoing portfolio offers a view into the design process. These projects are presented through drawings, models, renders and on-site progress, with their current execution milestone stated clearly.
          </p>
        </div>

        <Link
          href="/projects/completed"
          className="text-[10px] tracking-[0.2em] uppercase font-semibold text-neutral-500 hover:text-black transition-colors pb-1 shrink-0"
        >
          SWITCH TO COMPLETED WORKS ({projects.filter((p) => p.status === "completed").length}) →
        </Link>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {ongoing.map((project: Project) => (
          <Link
            key={project.id}
            href={`/projects/${project.slug}`}
            className="group relative block aspect-[4/3] w-full overflow-hidden bg-neutral-100 border border-neutral-200 hover:border-black transition-all duration-300 shadow-xs hover:shadow-md"
          >
            <Image
              src={project.mainImage}
              alt={`Techno Architecture — ${project.title}`}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-700 ease-editorial group-hover:scale-105"
            />

            <div className="absolute inset-0 bg-neutral-900/85 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-between p-6 text-center text-white pointer-events-none">
              <div className="text-[9px] tracking-[0.25em] text-neutral-400 uppercase">
                {project.location} · TARGET {project.year}
              </div>

              <div className="my-auto px-4">
                <h2 className="font-display text-xs md:text-sm tracking-[0.35em] uppercase text-white font-medium">
                  {project.title}
                </h2>
                <span className="block text-[8px] tracking-[0.25em] text-neutral-400 mt-2 uppercase">
                  {project.area}
                </span>
              </div>

              <div className="flex items-center justify-between text-[9px] tracking-[0.2em] text-amber-300 uppercase font-light">
                <span>{project.category} · UNDER EXECUTION</span>
                <span className="text-white/80 underline underline-offset-4">VIEW DOSSIER →</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
