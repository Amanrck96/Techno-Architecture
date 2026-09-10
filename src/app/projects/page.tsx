"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCMSStore } from "@/lib/cmsStore";
import { Project } from "@/data/projects";
import { cn } from "@/lib/utils";

export default function ProjectsDirectoryPage() {
  const { projects } = useCMSStore();
  const [activeFilter, setActiveFilter] = useState<string>("all");

  const filterTabs = [
    { id: "all", label: "ALL WORKS" },
    { id: "completed", label: "COMPLETED" },
    { id: "ongoing", label: "ONGOING" },
    { id: "Residential", label: "RESIDENTIAL" },
    { id: "Commercial", label: "COMMERCIAL" },
    { id: "Interior", label: "INTERIOR" },
    { id: "Cultural", label: "CULTURAL" },
  ];

  const filtered = projects.filter((p) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "completed") return p.status === "completed";
    if (activeFilter === "ongoing") return p.status === "ongoing";
    return p.category === activeFilter;
  });

  return (
    <div className="w-full py-10 md:py-14 px-4 md:px-8 max-w-[1720px] mx-auto">
      {/* Directory Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-neutral-200 pb-6 mb-8 gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-[0.3em] font-semibold text-neutral-400 block">
            PORTFOLIO REPERTOIRE
          </span>
          <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-light text-neutral-900 tracking-tight mt-1">
            Selected Projects & Interventions ({filtered.length})
          </h1>
        </div>

        {/* Filter Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              type="button"
              className={cn(
                "text-[10px] tracking-[0.2em] uppercase py-1 px-3 transition-all duration-300",
                activeFilter === tab.id
                  ? "bg-black text-white font-medium shadow-sm"
                  : "text-neutral-500 hover:text-black hover:bg-neutral-100"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Sub-view shortcuts */}
      <div className="flex items-center space-x-6 text-[10px] tracking-[0.2em] uppercase text-neutral-400 mb-6 px-1">
        <span>Dedicated Views:</span>
        <Link href="/projects/completed" className="hover:text-black transition-colors font-medium">
          COMPLETED ARCHIVE →
        </Link>
        <Link href="/projects/ongoing" className="hover:text-black transition-colors font-medium">
          ONGOING / IN PROGRESS →
        </Link>
      </div>

      {/* 3-Column Reference-Style Architectural Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
        {filtered.map((project: Project) => (
          <Link
            key={project.id}
            href={`/projects/${project.slug}`}
            className="group relative block aspect-[4/3] w-full overflow-hidden bg-neutral-100"
          >
            <Image
              src={project.mainImage}
              alt={`Techno Architecture — ${project.title}`}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-700 ease-editorial group-hover:scale-105"
            />

            {/* Reference Hover Overlay */}
            <div className="absolute inset-0 bg-neutral-900/85 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-between p-6 text-center text-white pointer-events-none">
              <div className="text-[9px] tracking-[0.25em] text-neutral-400 uppercase">
                {project.location} · {project.year}
              </div>

              <div className="my-auto px-4">
                <h2 className="font-display text-xs md:text-sm tracking-[0.35em] uppercase text-white font-medium">
                  {project.title}
                </h2>
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
    </div>
  );
}
