"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCMSStore } from "@/lib/cmsStore";
import { Project } from "@/data/projects";
import { cn } from "@/lib/utils";

export default function HomeProjectsGrid() {
  const { projects } = useCMSStore();
  const [filter, setFilter] = useState<string>("all");

  const categories = [
    { id: "all", label: "ALL WORKS" },
    { id: "Residential", label: "RESIDENTIAL" },
    { id: "Commercial", label: "COMMERCIAL" },
    { id: "Interior", label: "INTERIOR" },
    { id: "completed", label: "COMPLETED" },
    { id: "ongoing", label: "ONGOING" },
  ];

  const filteredProjects = projects.filter((p) => {
    if (filter === "all") return true;
    if (filter === "completed") return p.status === "completed";
    if (filter === "ongoing") return p.status === "ongoing";
    return p.category === filter;
  });

  return (
    <section id="projects" className="w-full py-12 md:py-16 px-4 md:px-8 scroll-mt-20">
      {/* Section Header & Architectural Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-neutral-200 gap-4">
        <div>
          <h2 className="text-[11px] uppercase tracking-[0.3em] font-semibold text-neutral-900">
            SELECTED ARCHITECTURAL ARCHIVE
          </h2>
          <p className="text-xs text-neutral-500 mt-1 tracking-wide">
            Curated spatial commissions across India and the United Arab Emirates
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 md:gap-4">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilter(cat.id)}
              type="button"
              className={cn(
                "text-[10px] tracking-[0.2em] uppercase py-1 px-2.5 transition-all duration-300",
                filter === cat.id
                  ? "bg-black text-white font-medium"
                  : "text-neutral-500 hover:text-black hover:bg-neutral-100"
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3-Column Reference-Style Architectural Grid (0.5% margin rhythm) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-2.5">
        {filteredProjects.map((project: Project) => (
          <Link
            key={project.id}
            href={`/projects/${project.slug}`}
            className="group relative block aspect-[4/3] w-full overflow-hidden bg-neutral-100"
          >
            {/* Project Image */}
            <Image
              src={project.mainImage}
              alt={`Techno Architecture — ${project.title}`}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-700 ease-editorial group-hover:scale-105"
            />

            {/* Reference Hover Overlay with Center 5px Letterspaced Title & Bottom Category */}
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

              <div className="text-[9px] tracking-[0.2em] text-neutral-300 uppercase font-light">
                {project.category} · {project.status.toUpperCase()}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* View All Projects link */}
      <div className="mt-10 text-center">
        <Link
          href="/projects"
          className="inline-block text-[10px] tracking-[0.25em] uppercase font-semibold text-neutral-900 hover:text-neutral-600 border-b border-black pb-1 hover:border-neutral-400 transition-colors"
        >
          VIEW COMPLETE PROJECT REPERTOIRE ({projects.length}) →
        </Link>
      </div>
    </section>
  );
}
