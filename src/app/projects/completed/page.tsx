"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useCMSStore } from "@/lib/cmsStore";
import { Project } from "@/data/projects";

export default function CompletedProjectsPage() {
  const { projects } = useCMSStore();
  const completed = projects.filter((p) => p.status === "completed");

  return (
    <div className="w-full py-10 md:py-14 px-4 md:px-8 max-w-[1720px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-neutral-200 pb-6 mb-8 gap-4">
        <div>
          <div className="flex items-center space-x-2 text-[10px] uppercase tracking-[0.3em] font-semibold text-neutral-400">
            <Link href="/projects" className="hover:text-black transition-colors">
              PROJECTS
            </Link>
            <span>/</span>
            <span className="text-black">COMPLETED</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-light text-neutral-900 tracking-tight mt-2">
            Completed Architecture & Realized Commissions ({completed.length})
          </h1>
        </div>

        <Link
          href="/projects/ongoing"
          className="text-[10px] tracking-[0.2em] uppercase font-semibold text-neutral-500 hover:text-black transition-colors"
        >
          SWITCH TO ONGOING WORKS ({projects.filter((p) => p.status === "ongoing").length}) →
        </Link>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
        {completed.map((project: Project) => (
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
                {project.category} · COMPLETED
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
