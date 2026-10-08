"use client";

import React, { useState, useMemo } from "react";
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
    { id: "Hospitality", label: "HOSPITALITY" },
    { id: "Interior", label: "INTERIOR" },
  ];

  const displayedProjects = useMemo(() => {
    return projects.filter((p) => {
      if (activeFilter === "all") return true;
      if (activeFilter === "completed") return p.status === "completed";
      if (activeFilter === "ongoing") return p.status === "ongoing";
      return p.category === activeFilter;
    });
  }, [projects, activeFilter]);

  return (
    <div className="w-full py-10 md:py-14 px-4 md:px-8 max-w-[1720px] mx-auto space-y-16">
      {/* Directory Header */}
      <div className="space-y-6">
        {/* Title and Description */}
        <div className="border-b border-neutral-200 pb-6">
          <span className="text-[10px] uppercase tracking-[0.3em] font-semibold text-neutral-400 block font-mono">
            PORTFOLIO ARCHIVE
          </span>
          <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-light text-neutral-900 tracking-tight mt-1">
            Projects
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 max-w-3xl mt-2 font-light leading-relaxed">
            Our portfolio brings together projects of different scales and uses, each developed in response to a particular client, site and way of living or working. Explore completed buildings and work currently in development.
          </p>
        </div>

        {/* Filter Navigation Tabs - Guaranteed Single Line */}
        <div className="flex items-center gap-1.5 sm:gap-2 md:gap-2.5 overflow-x-auto no-scrollbar whitespace-nowrap py-1">
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              type="button"
              className={cn(
                "text-[10px] tracking-[0.2em] uppercase py-1.5 px-3 transition-all duration-300 rounded-xs flex-shrink-0",
                activeFilter === tab.id
                  ? "bg-black text-white font-medium shadow-xs"
                  : "text-neutral-500 hover:text-black hover:bg-neutral-100"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Dedicated Views Sublinks */}
        <div className="flex flex-wrap items-center justify-between gap-4 text-[10px] tracking-[0.2em] uppercase text-neutral-400 px-1 pb-2 border-b border-neutral-100 mb-8">
          <div className="flex flex-wrap items-center gap-6">
            <span className="font-medium">Direct Views:</span>
            <Link href="/projects/completed" className="hover:text-black transition-colors font-medium text-neutral-700">
              COMPLETED PROJECTS →
            </Link>
            <Link href="/projects/ongoing" className="hover:text-black transition-colors font-medium text-neutral-700">
              ONGOING PROJECTS →
            </Link>
          </div>
          <div className="text-neutral-500 font-mono">
            {displayedProjects.length} {displayedProjects.length === 1 ? "PROJECT" : "PROJECTS"} EXHIBITED
          </div>
        </div>

        {/* 3-Column Reference-Style Architectural Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {displayedProjects.map((project: Project) => (
            <div
              key={project.id}
              className="group relative aspect-[4/3] w-full overflow-hidden bg-neutral-100"
            >
              <Link
                href={`/projects/${project.slug}`}
                className="block w-full h-full"
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

                  <div className="flex items-center justify-between text-[9px] tracking-[0.2em] text-neutral-300 uppercase font-light">
                    <span>{project.category} · {project.status.toUpperCase()}</span>
                    <span className="text-white/80 underline underline-offset-4">VIEW DOSSIER →</span>
                  </div>
                </div>
              </Link>

              {/* If Video Tour is Available, render an architectural badge */}
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
      </div>
    </div>
  );
}
