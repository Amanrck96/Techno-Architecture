"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "lucide-react";

export default function HomeIntro() {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

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
              SECTION A — PRACTICE INTRODUCTION
            </span>
          </div>
          <span className="text-[9px] uppercase tracking-[0.22em] text-neutral-400 font-mono">
            BENGALURU · HYDERABAD · DUBAI
          </span>
        </div>

        {/* Main Grid: Left Column Brand & Mission; Right Column Core Pillars */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left Column: Brand & Logo Presentation */}
          <div className="lg:col-span-5 space-y-6">
            <div className="relative w-56 sm:w-64 md:w-72 h-16 sm:h-20">
              <Image
                src="/techno-logo-transparent.png"
                alt="Techno Architecture"
                fill
                priority
                sizes="288px"
                className="object-contain object-left"
              />
            </div>

            <p className="text-sm md:text-base text-neutral-600 leading-relaxed font-light tracking-wide">
              An architectural practice devoted to the synthesis of structural clarity, thermal mass, and crafted materiality. We design residential sanctuaries, mass timber commercial spaces, and civic enclaves engineered to endure.
            </p>

            {/* In-page jump anchors in a clean horizontal order with reduced font size */}
            <div className="pt-2 flex flex-wrap items-center gap-2 text-[9px] sm:text-[9.5px] tracking-[0.18em] uppercase font-mono font-medium">
              <button
                onClick={() => scrollTo("projects")}
                type="button"
                className="inline-flex items-center gap-1 py-1.5 px-2.5 bg-neutral-100 hover:bg-neutral-900 hover:text-white transition-colors rounded-sm text-neutral-700"
              >
                <span>b. Projects</span>
                <ArrowDown size={10} />
              </button>
              <button
                onClick={() => scrollTo("why-techno")}
                type="button"
                className="inline-flex items-center gap-1 py-1.5 px-2.5 bg-neutral-100 hover:bg-neutral-900 hover:text-white transition-colors rounded-sm text-neutral-700"
              >
                <span>c. Why Techno?</span>
                <ArrowDown size={10} />
              </button>
              <button
                onClick={() => scrollTo("testimonials")}
                type="button"
                className="inline-flex items-center gap-1 py-1.5 px-2.5 bg-neutral-100 hover:bg-neutral-900 hover:text-white transition-colors rounded-sm text-neutral-700"
              >
                <span>d. Testimonials</span>
                <ArrowDown size={10} />
              </button>
            </div>
          </div>

          {/* Right Column: 4 Architectural Pillars */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 pt-1">
            <div className="space-y-2 border-l border-neutral-200 pl-4 sm:pl-5">
              <span className="text-[9.5px] tracking-[0.22em] font-mono text-neutral-400 block uppercase">
                01 / Form & Light
              </span>
              <h3 className="font-display text-xs sm:text-sm uppercase tracking-[0.15em] font-medium text-neutral-900">
                Spatial Choreography
              </h3>
              <p className="text-xs text-neutral-500 leading-relaxed font-light">
                Form emerges from climate, material restraint, and the timeless choreography of equatorial light through calculated apertures and brise-soleil screens.
              </p>
            </div>

            <div className="space-y-2 border-l border-neutral-200 pl-4 sm:pl-5">
              <span className="text-[9.5px] tracking-[0.22em] font-mono text-neutral-400 block uppercase">
                02 / Thermodynamics
              </span>
              <h3 className="font-display text-xs sm:text-sm uppercase tracking-[0.15em] font-medium text-neutral-900">
                Passive Physics
              </h3>
              <p className="text-xs text-neutral-500 leading-relaxed font-light">
                Heavy board-formed concrete envelopes, sunken basalt courtyards, and deep overhangs act as natural thermal buffers, drastically reducing active cooling needs.
              </p>
            </div>

            <div className="space-y-2 border-l border-neutral-200 pl-4 sm:pl-5">
              <span className="text-[9.5px] tracking-[0.22em] font-mono text-neutral-400 block uppercase">
                03 / Craft & Execution
              </span>
              <h3 className="font-display text-xs sm:text-sm uppercase tracking-[0.15em] font-medium text-neutral-900">
                Material Authenticity
              </h3>
              <p className="text-xs text-neutral-500 leading-relaxed font-light">
                Every material is celebrated in its natural tactile state — polished kota stone, solid teak joinery, architectural steel, and raw rammed earth.
              </p>
            </div>

            <div className="space-y-2 border-l border-neutral-200 pl-4 sm:pl-5">
              <span className="text-[9.5px] tracking-[0.22em] font-mono text-neutral-400 block uppercase">
                04 / Tri-City Hubs
              </span>
              <h3 className="font-display text-xs sm:text-sm uppercase tracking-[0.15em] font-medium text-neutral-900">
                Studio Reach
              </h3>
              <p className="text-xs text-neutral-500 leading-relaxed font-light">
                With studios in Bengaluru, Hyderabad, and collaborative projects in Dubai, our practice delivers bespoke residential and commercial commissions across the globe.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
