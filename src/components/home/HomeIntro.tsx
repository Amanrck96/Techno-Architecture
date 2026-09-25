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
              TECHNO ARCHITECTURE · PRACTICE INTRODUCTION
            </span>
          </div>
          <span className="text-[9px] uppercase tracking-[0.22em] text-neutral-400 font-mono">
            EST. 2006 · BASAVANAGUDI, BENGALURU
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
                Architecture shaped around people, place and purpose
              </h2>
              <p className="text-sm md:text-base text-neutral-600 leading-relaxed font-light tracking-wide">
                Techno Architecture creates thoughtful spaces that balance creativity, comfort, luxury and practical living. From the first idea to the final detail, we approach every project with clarity, care and a strong understanding of how people use space.
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

            {/* In-page jump anchors */}
            <div className="pt-4 flex flex-wrap items-center gap-2 text-[9px] sm:text-[9.5px] tracking-[0.18em] uppercase font-mono font-medium border-t border-neutral-100">
              <button
                onClick={() => scrollTo("projects")}
                type="button"
                className="inline-flex items-center gap-1 py-1 px-2.5 bg-neutral-100 hover:bg-neutral-900 hover:text-white transition-colors rounded-sm text-neutral-700"
              >
                <span>b. Projects</span>
                <ArrowDown size={10} />
              </button>
              <button
                onClick={() => scrollTo("why-techno")}
                type="button"
                className="inline-flex items-center gap-1 py-1 px-2.5 bg-neutral-100 hover:bg-neutral-900 hover:text-white transition-colors rounded-sm text-neutral-700"
              >
                <span>c. Why Techno?</span>
                <ArrowDown size={10} />
              </button>
              <button
                onClick={() => scrollTo("testimonials")}
                type="button"
                className="inline-flex items-center gap-1 py-1 px-2.5 bg-neutral-100 hover:bg-neutral-900 hover:text-white transition-colors rounded-sm text-neutral-700"
              >
                <span>d. Testimonials</span>
                <ArrowDown size={10} />
              </button>
            </div>
          </div>

          {/* Right Column: Introduction Section from PDF */}
          <div className="lg:col-span-7 space-y-6 pt-1">
            <div className="space-y-4 border-l-2 border-neutral-900 pl-6 sm:pl-8">
              <span className="text-[10px] uppercase tracking-[0.25em] font-mono text-neutral-400 block font-semibold">
                INTRODUCTION
              </span>
              <p className="text-base sm:text-lg text-neutral-900 leading-relaxed font-light">
                Led by architect <strong className="font-medium text-black">Rajesh Shivaram</strong>, Techno Architecture is a design practice committed to architecture that is distinctive, environmentally responsible and grounded in everyday life. Our work brings together planning, material expression, natural light and careful detailing to create spaces with lasting value.
              </p>
              <p className="text-sm md:text-base text-neutral-600 leading-relaxed font-light">
                We work closely with clients from the earliest discussions through design development and execution. This collaborative process helps each project respond to its site, purpose, budget and the people who will inhabit it.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
              <div className="p-4 bg-neutral-50 border border-neutral-100 space-y-1">
                <span className="text-[9px] font-mono text-neutral-400 uppercase tracking-widest block">01 / PRACTICE LEADERSHIP</span>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-900">Ar. Rajesh Shivaram</h4>
                <p className="text-xs text-neutral-500 font-light leading-relaxed">
                  Graduate of Bangalore Institute of Technology bringing 20 years of professional architectural experience.
                </p>
              </div>
              <div className="p-4 bg-neutral-50 border border-neutral-100 space-y-1">
                <span className="text-[9px] font-mono text-neutral-400 uppercase tracking-widest block">02 / STUDIO LOCATION</span>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-900">Basavanagudi, Bengaluru</h4>
                <p className="text-xs text-neutral-500 font-light leading-relaxed">
                  Established in 2006, delivering contextual residential, commercial, hospitality and institutional works.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
