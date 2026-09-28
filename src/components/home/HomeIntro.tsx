"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { useCMSStore } from "@/lib/cmsStore";

export default function HomeIntro() {
  const { siteSettings } = useCMSStore();

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const tagline = siteSettings?.tagline || "Architecture shaped around people, place and purpose";
  const shortDesc =
    siteSettings?.shortDescription ||
    "Techno Architecture creates thoughtful spaces that balance creativity, comfort, luxury and practical living. From the first idea to the final detail, we approach every project with clarity, care and a strong understanding of how people use space.";
  const foundedYear = siteSettings?.foundedYear || 2006;
  const studioCity = siteSettings?.studios?.[0]?.city || "Basavanagudi, Bengaluru";

  return (
    <section
      id="introduction"
      className="w-full py-12 md:py-16 px-4 sm:px-6 md:px-12 bg-white border-b border-neutral-200 scroll-mt-20"
    >
      <div className="max-w-7xl mx-auto">
        {/* Sub-header breadcrumb */}
        <div className="flex flex-wrap items-center justify-between pb-4 mb-8 border-b border-neutral-200 gap-2">
          <div className="flex items-center space-x-2">
            <span className="text-[9.5px] uppercase tracking-[0.25em] font-semibold text-neutral-900 font-mono">
              TECHNO ARCHITECTURE · PRACTICE INTRODUCTION
            </span>
          </div>
          <span className="text-[9px] uppercase tracking-[0.22em] text-neutral-400 font-mono">
            EST. {foundedYear} · {studioCity.toUpperCase()}
          </span>
        </div>

        {/* Main Grid: Left Column Brand & Mission; Right Column Core Narrative */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left Column: Brand & Logo Presentation */}
          <div className="lg:col-span-5 space-y-6">
            <div className="relative w-56 sm:w-64 md:w-72 h-16 sm:h-20">
              <Image
                src="/techno-logo-transparent.png"
                alt="Techno Architecture"
                fill
                priority
                unoptimized
                sizes="576px"
                className="object-contain object-left"
              />
            </div>

            <div className="space-y-3">
              <h2 className="font-display text-xl sm:text-2xl text-neutral-900 font-light leading-snug">
                {tagline}
              </h2>
              <p className="text-sm md:text-base text-neutral-600 leading-relaxed font-light tracking-wide">
                {shortDesc}
              </p>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link
                href="/projects"
                className="inline-flex items-center gap-1.5 py-2 px-4 bg-neutral-900 text-white hover:bg-neutral-800 transition-colors text-[10px] tracking-[0.2em] uppercase font-medium"
              >
                <span>Explore Our Projects</span>
                <ArrowUpRight size={12} />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-1.5 py-2 px-4 border border-neutral-300 hover:border-black text-neutral-900 transition-colors text-[10px] tracking-[0.2em] uppercase font-medium"
              >
                <span>Start a Conversation</span>
              </Link>
            </div>

          </div>

          {/* Right Column: Page Directory (b. Projects, c. Why Techno?, d. Testimonials) */}
          <div className="lg:col-span-7 space-y-5 pt-1">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
              <span className="text-[10px] uppercase tracking-[0.25em] font-mono text-neutral-400 font-semibold">
                INDEX · PAGE DIRECTORY
              </span>
              <span className="text-[9px] uppercase tracking-[0.2em] font-mono text-neutral-400">
                03 SECTIONS
              </span>
            </div>

            {/* 3-Column Directory Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              {/* Card 1: b. Projects */}
              <button
                type="button"
                onClick={() => scrollTo("projects")}
                className="group text-left p-4 sm:p-4.5 bg-neutral-50 hover:bg-neutral-900 border border-neutral-200/80 hover:border-neutral-900 transition-all duration-300 flex flex-col justify-between h-full rounded-xs cursor-pointer shadow-2xs hover:shadow-md"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[8.5px] font-mono tracking-[0.2em] text-neutral-400 group-hover:text-neutral-400 uppercase font-semibold">
                      01 / SECTION B
                    </span>
                    <ArrowDown size={11} className="text-neutral-400 group-hover:text-white group-hover:translate-y-0.5 transition-all" />
                  </div>
                  <h3 className="font-display text-sm font-semibold tracking-wide text-neutral-900 group-hover:text-white transition-colors">
                    b. Projects
                  </h3>
                  <p className="text-[11px] text-neutral-500 group-hover:text-neutral-300 leading-relaxed font-light transition-colors">
                    Curated residential, commercial, interior and institutional commissions.
                  </p>
                </div>
                <div className="pt-3 mt-3 border-t border-neutral-200/70 group-hover:border-neutral-800 flex items-center justify-between text-[9px] font-mono uppercase tracking-[0.18em] text-neutral-500 group-hover:text-neutral-300">
                  <span>Explore Works</span>
                  <span>↓</span>
                </div>
              </button>

              {/* Card 2: c. Why Techno? */}
              <button
                type="button"
                onClick={() => scrollTo("why-techno")}
                className="group text-left p-4 sm:p-4.5 bg-neutral-50 hover:bg-neutral-900 border border-neutral-200/80 hover:border-neutral-900 transition-all duration-300 flex flex-col justify-between h-full rounded-xs cursor-pointer shadow-2xs hover:shadow-md"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[8.5px] font-mono tracking-[0.2em] text-neutral-400 group-hover:text-neutral-400 uppercase font-semibold">
                      02 / SECTION C
                    </span>
                    <ArrowDown size={11} className="text-neutral-400 group-hover:text-white group-hover:translate-y-0.5 transition-all" />
                  </div>
                  <h3 className="font-display text-sm font-semibold tracking-wide text-neutral-900 group-hover:text-white transition-colors">
                    c. Why Techno?
                  </h3>
                  <p className="text-[11px] text-neutral-500 group-hover:text-neutral-300 leading-relaxed font-light transition-colors">
                    Practice ethos, climate-led passive intelligence and coordinated execution.
                  </p>
                </div>
                <div className="pt-3 mt-3 border-t border-neutral-200/70 group-hover:border-neutral-800 flex items-center justify-between text-[9px] font-mono uppercase tracking-[0.18em] text-neutral-500 group-hover:text-neutral-300">
                  <span>Read Ethos</span>
                  <span>↓</span>
                </div>
              </button>

              {/* Card 3: d. Testimonials */}
              <button
                type="button"
                onClick={() => scrollTo("testimonials")}
                className="group text-left p-4 sm:p-4.5 bg-neutral-50 hover:bg-neutral-900 border border-neutral-200/80 hover:border-neutral-900 transition-all duration-300 flex flex-col justify-between h-full rounded-xs cursor-pointer shadow-2xs hover:shadow-md"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[8.5px] font-mono tracking-[0.2em] text-neutral-400 group-hover:text-neutral-400 uppercase font-semibold">
                      03 / SECTION D
                    </span>
                    <ArrowDown size={11} className="text-neutral-400 group-hover:text-white group-hover:translate-y-0.5 transition-all" />
                  </div>
                  <h3 className="font-display text-sm font-semibold tracking-wide text-neutral-900 group-hover:text-white transition-colors">
                    d. Testimonials
                  </h3>
                  <p className="text-[11px] text-neutral-500 group-hover:text-neutral-300 leading-relaxed font-light transition-colors">
                    Direct reflections and reviews from homeowners and institutional clients.
                  </p>
                </div>
                <div className="pt-3 mt-3 border-t border-neutral-200/70 group-hover:border-neutral-800 flex items-center justify-between text-[9px] font-mono uppercase tracking-[0.18em] text-neutral-500 group-hover:text-neutral-300">
                  <span>Read Reviews</span>
                  <span>↓</span>
                </div>
              </button>
            </div>

            {/* Quick jump pills */}
            <div className="pt-3 flex flex-wrap items-center gap-2 border-t border-neutral-100">
              <span className="text-[9px] uppercase tracking-[0.2em] font-mono text-neutral-400 mr-1">
                Quick Jump:
              </span>
              <button
                onClick={() => scrollTo("projects")}
                type="button"
                className="inline-flex items-center gap-1.5 py-1 px-3 bg-neutral-100 hover:bg-neutral-900 hover:text-white transition-colors rounded-xs text-neutral-800 text-[9px] uppercase font-mono tracking-[0.18em] font-medium cursor-pointer"
              >
                <span>b. Projects</span>
                <ArrowDown size={10} />
              </button>
              <button
                onClick={() => scrollTo("why-techno")}
                type="button"
                className="inline-flex items-center gap-1.5 py-1 px-3 bg-neutral-100 hover:bg-neutral-900 hover:text-white transition-colors rounded-xs text-neutral-800 text-[9px] uppercase font-mono tracking-[0.18em] font-medium cursor-pointer"
              >
                <span>c. Why Techno?</span>
                <ArrowDown size={10} />
              </button>
              <button
                onClick={() => scrollTo("testimonials")}
                type="button"
                className="inline-flex items-center gap-1.5 py-1 px-3 bg-neutral-100 hover:bg-neutral-900 hover:text-white transition-colors rounded-xs text-neutral-800 text-[9px] uppercase font-mono tracking-[0.18em] font-medium cursor-pointer"
              >
                <span>d. Testimonials</span>
                <ArrowDown size={10} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
