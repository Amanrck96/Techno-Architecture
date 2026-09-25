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
    { id: "Hospitality", label: "HOSPITALITY" },
    { id: "Institutional", label: "INSTITUTIONAL" },
    { id: "Interior", label: "INTERIORS" },
  ];

  const projectLinks = [
    {
      name: "Techno Architecture",
      title: "Official Instagram Profile",
      url: "https://www.instagram.com/technoarchitecture_rajesh/",
      isSocial: true,
      actionText: "Open Instagram",
    },
    {
      name: "Echoes of Nirvana",
      title: "A 4000 Sq. Ft. Modern Courtyard Home in Bengaluru (House Tour)",
      url: "https://www.youtube.com/results?search_query=Echoes+of+Nirvana+Techno+Architecture+House+Tour",
      actionText: "Watch Video",
    },
    {
      name: "Kripa",
      title: "1,500 sq.ft. Compact Home in Bangalore (House Tour)",
      url: "https://www.youtube.com/results?search_query=Kripa+1500+sq+ft+Techno+Architecture+House+Tour",
      actionText: "Watch Video",
    },
    {
      name: "The Mantle",
      title: "The Mantle | Main Video Review 2",
      url: "https://www.youtube.com/results?search_query=The+Mantle+Techno+Architecture+Review",
      actionText: "Watch Video",
    },
    {
      name: "Between Two Trees",
      title: "House With a Traditional Chettinad Courtyard Between 2 Trees | Bengaluru | Technoarchitecture",
      url: "https://www.youtube.com/results?search_query=Between+Two+Trees+House+With+a+Traditional+Chettinad+Courtyard+Technoarchitecture",
      actionText: "Watch Video",
    },
    {
      name: "The Far Site",
      title: "2,400 sq.ft Compact House in Malleshwaram Bengaluru Karnataka Explores a Courtyard in a Unique Way",
      url: "https://www.youtube.com/results?search_query=2400+sqft+Compact+House+in+Malleshwaram+Bengaluru+The+Far+Site+Technoarchitecture",
      actionText: "Watch Video",
    },
    {
      name: "Aikya House",
      title: "4,800 sq.ft Aikya House in Bengaluru by Technoarchitecture (Home Tour)",
      url: "https://www.youtube.com/results?search_query=Aikya+House+Technoarchitecture+Home+Tour",
      actionText: "Watch Video",
    },
    {
      name: "Belaku Residence",
      title: "2400 sq.ft Compact Home in Bengaluru | Belaku Residence by Techno Architecture (Home Tour)",
      url: "https://www.youtube.com/results?search_query=Belaku+Residence+Techno+Architecture+Home+Tour",
      actionText: "Watch Video",
    },
    {
      name: "Kanasu",
      title: "Luxury Vastu House Kanasu in Bengaluru, Karnataka | Technoarchitecture (Home Tour)",
      url: "https://www.youtube.com/results?search_query=Luxury+Vastu+House+Kanasu+in+Bengaluru+Technoarchitecture+Home+Tour",
      actionText: "Watch Video",
    },
  ];

  const filtered = projects.filter((p) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "completed") return p.status === "completed";
    if (activeFilter === "ongoing") return p.status === "ongoing";
    return p.category === activeFilter;
  });

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

        {/* Dedicated Views Sublinks */}
        <div className="flex flex-wrap items-center gap-6 text-[10px] tracking-[0.2em] uppercase text-neutral-400 px-1 mb-8">
          <span className="font-medium">Direct Views:</span>
          <Link href="/projects/completed" className="hover:text-black transition-colors font-medium text-neutral-700">
            COMPLETED PROJECTS →
          </Link>
          <Link href="/projects/ongoing" className="hover:text-black transition-colors font-medium text-neutral-700">
            ONGOING PROJECTS →
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

      {/* Project Links & Selected Project Films (from PDF Page 7) */}
      <section className="pt-10 border-t border-neutral-200 space-y-6">
        <div>
          <span className="text-[10px] uppercase tracking-[0.3em] font-semibold text-neutral-400 block font-mono">
            CINEMATIC DOCUMENTATION
          </span>
          <h2 className="font-display text-2xl sm:text-3xl font-light text-neutral-900 tracking-tight mt-1">
            Project Links
          </h2>
          <p className="text-xs text-neutral-500 mt-1 max-w-xl font-light">
            Explore Techno Architecture&apos;s official social profile and selected project films.
          </p>
        </div>

        <div className="border border-neutral-200 overflow-hidden bg-white shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-neutral-900 text-white text-[10px] uppercase tracking-[0.2em] font-mono">
                  <th className="py-3 px-4 sm:px-6 font-medium">Project Name</th>
                  <th className="py-3 px-4 sm:px-6 font-medium">Title</th>
                  <th className="py-3 px-4 sm:px-6 font-medium text-right">Link</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 text-neutral-700">
                {projectLinks.map((item, idx) => (
                  <tr key={idx} className="hover:bg-neutral-50 transition-colors">
                    <td className="py-3.5 px-4 sm:px-6 font-medium text-neutral-900 whitespace-nowrap">
                      {item.name}
                    </td>
                    <td className="py-3.5 px-4 sm:px-6 text-neutral-600 font-light">
                      {item.title}
                    </td>
                    <td className="py-3.5 px-4 sm:px-6 text-right whitespace-nowrap">
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 font-medium text-black hover:underline uppercase text-[10px] tracking-[0.18em]"
                      >
                        <span>{item.actionText}</span>
                        <span aria-hidden="true">→</span>
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
