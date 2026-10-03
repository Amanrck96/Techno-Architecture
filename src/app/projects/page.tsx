"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Shuffle, RotateCcw } from "lucide-react";
import { useCMSStore } from "@/lib/cmsStore";
import { Project } from "@/data/projects";
import { cn } from "@/lib/utils";

export default function ProjectsDirectoryPage() {
  const { projects } = useCMSStore();
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [shuffledOrder, setShuffledOrder] = useState<string[] | null>(null);

  const filterTabs = [
    { id: "all", label: "ALL WORKS" },
    { id: "completed", label: "COMPLETED" },
    { id: "ongoing", label: "ONGOING" },
    { id: "Residential", label: "RESIDENTIAL" },
    { id: "Commercial", label: "COMMERCIAL" },
    { id: "Hospitality", label: "HOSPITALITY" },
    { id: "Interior", label: "INTERIOR" },
    { id: "Cultural", label: "CULTURAL" },
  ];

  const handleShuffle = () => {
    const ids = projects.map((p) => p.id);
    for (let i = ids.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [ids[i], ids[j]] = [ids[j], ids[i]];
    }
    setShuffledOrder(ids);
  };

  const handleResetOrder = () => {
    setShuffledOrder(null);
  };

  const displayedProjects = useMemo(() => {
    const list = projects.filter((p) => {
      if (activeFilter === "all") return true;
      if (activeFilter === "completed") return p.status === "completed";
      if (activeFilter === "ongoing") return p.status === "ongoing";
      return p.category === activeFilter;
    });

    if (shuffledOrder && shuffledOrder.length > 0) {
      return [...list].sort((a, b) => {
        const idxA = shuffledOrder.indexOf(a.id);
        const idxB = shuffledOrder.indexOf(b.id);
        if (idxA === -1) return 1;
        if (idxB === -1) return -1;
        return idxA - idxB;
      });
    }

    return list;
  }, [projects, activeFilter, shuffledOrder]);

  return (
    <div className="w-full py-10 md:py-14 px-4 md:px-8 max-w-[1720px] mx-auto space-y-16">
      {/* Directory Header */}
      <div>
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-neutral-200 pb-6 mb-6 gap-4">
          <div>
            <span className="text-[10px] uppercase tracking-[0.3em] font-semibold text-neutral-400 block font-mono">
              PORTFOLIO ARCHIVE
            </span>
            <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-light text-neutral-900 tracking-tight mt-1">
              Projects
            </h1>
            <p className="text-xs sm:text-sm text-neutral-500 max-w-2xl mt-2 font-light leading-relaxed">
              Our portfolio brings together projects of different scales and uses, each developed in response to a particular client, site and way of living or working. Explore completed buildings and work currently in development.
            </p>
          </div>

          {/* Filter Navigation Tabs */}
          <div className="flex flex-wrap items-center gap-2 md:gap-2.5">
            {filterTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                type="button"
                className={cn(
                  "text-[10px] tracking-[0.2em] uppercase py-1.5 px-3 transition-all duration-300 rounded-xs",
                  activeFilter === tab.id
                    ? "bg-black text-white font-medium shadow-xs"
                    : "text-neutral-500 hover:text-black hover:bg-neutral-100"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Dedicated Views Sublinks & Shuffle Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 text-[10px] tracking-[0.2em] uppercase text-neutral-400 px-1 mb-8">
          <div className="flex flex-wrap items-center gap-6">
            <span className="font-medium">Direct Views:</span>
            <Link href="/projects/completed" className="hover:text-black transition-colors font-medium text-neutral-700">
              COMPLETED PROJECTS →
            </Link>
            <Link href="/projects/ongoing" className="hover:text-black transition-colors font-medium text-neutral-700">
              ONGOING PROJECTS →
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleShuffle}
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xs border text-[10px] tracking-[0.2em] uppercase font-medium transition-all duration-200 cursor-pointer",
                shuffledOrder
                  ? "bg-black text-white border-black shadow-xs hover:bg-neutral-800"
                  : "bg-white text-neutral-700 border-neutral-300 hover:text-black hover:border-black"
              )}
              title="Shuffle / randomize projects order"
            >
              <Shuffle size={12} />
              <span>{shuffledOrder ? "Shuffle Again" : "Shuffle Projects"}</span>
            </button>
            {shuffledOrder && (
              <button
                type="button"
                onClick={handleResetOrder}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 text-neutral-500 hover:text-black transition-colors text-[10px] tracking-[0.18em] uppercase cursor-pointer"
                title="Reset to default order"
              >
                <RotateCcw size={11} />
                <span>Reset</span>
              </button>
            )}
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
