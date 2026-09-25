"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCMSStore } from "@/lib/cmsStore";
import { Recognition } from "@/data/recognitions";
import { Award, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function RecognitionsPage() {
  const { recognitions } = useCMSStore();
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = [
    "All",
    "Award",
    "Publication",
    "Certification",
    "Biennale / Exhibition",
  ];

  const filtered = recognitions.filter((r) =>
    selectedCategory === "All" ? true : r.category === selectedCategory
  );

  return (
    <div className="w-full py-10 md:py-16 px-6 md:px-12 lg:px-16 max-w-6xl mx-auto space-y-16">
      {/* Page Header */}
      <div className="border-b border-neutral-200 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="text-[10px] uppercase tracking-[0.3em] font-semibold text-neutral-400 block font-mono">
            HONORS & COMMENDATIONS
          </span>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-light text-neutral-900 tracking-tight mt-2">
            Awards and Recognitions
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 max-w-xl mt-2 tracking-wide font-light">
            Selected recognition of Techno Architecture&apos;s work across awards, publications, exhibitions and professional platforms.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCategory(c)}
              type="button"
              className={cn(
                "text-[10px] tracking-[0.2em] uppercase py-1 px-3 transition-all duration-300",
                selectedCategory === c
                  ? "bg-black text-white font-medium shadow-sm"
                  : "text-neutral-500 hover:text-black hover:bg-neutral-100"
              )}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Structured Minimal Timeline List */}
      <div className="space-y-6">
        {filtered.map((item: Recognition) => (
          <article
            key={item.id}
            className="p-6 md:p-8 border border-neutral-200 bg-white hover:border-black transition-colors flex flex-col md:flex-row justify-between items-start gap-6"
          >
            {/* Left: Year & Category */}
            <div className="md:w-48 flex-shrink-0 space-y-1">
              <span className="font-display text-2xl font-light text-black">
                {item.year}
              </span>
              <div className="text-[9px] uppercase font-mono tracking-widest text-neutral-400">
                {item.category}
              </div>
              {item.badge && (
                <span className="inline-block text-[8px] uppercase tracking-wider bg-neutral-100 text-neutral-800 font-semibold px-2 py-0.5 mt-2">
                  {item.badge}
                </span>
              )}
            </div>

            {/* Center: Title, Org, Description */}
            <div className="flex-grow space-y-2">
              <h2 className="font-display text-base sm:text-lg font-medium text-neutral-900 leading-snug">
                {item.title}
              </h2>
              <div className="text-xs font-semibold text-neutral-500">
                Conferred by: {item.organization}
              </div>
              <p className="text-xs text-neutral-600 leading-relaxed font-light pt-1">
                {item.description}
              </p>
            </div>

            {/* Right: Associated Project Link */}
            {item.projectAssociated && (
              <div className="md:w-44 flex-shrink-0 md:text-right pt-2 md:pt-0">
                <span className="text-[9px] uppercase tracking-wider text-neutral-400 block mb-1">
                  ASSOCIATED WORK
                </span>
                <Link
                  href={item.projectSlug ? `/projects/${item.projectSlug}` : "/projects"}
                  className="text-xs font-medium text-black hover:underline inline-flex items-center gap-1 group"
                >
                  <span>{item.projectAssociated}</span>
                  <ArrowUpRight size={11} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </Link>
              </div>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}
