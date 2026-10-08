"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useCMSStore } from "@/lib/cmsStore";

export default function HomeIntro() {
  const { siteSettings } = useCMSStore();

  const tagline =
    siteSettings?.tagline || "Architecture shaped around people, place and purpose";
  const shortDesc =
    siteSettings?.shortDescription ||
    "Techno Architecture is an architecture and design practice creating thoughtful, practical and environmentally responsive spaces.";
  const longDesc =
    siteSettings?.longDescription ||
    "Led by architect Rajesh Shivaram, Techno Architecture is a design practice committed to architecture that is distinctive, environmentally responsible and grounded in everyday life. Our work brings together planning, material expression, natural light and careful detailing to create spaces with lasting value.";
  const foundedYear = siteSettings?.foundedYear || 2006;
  const studioCity = siteSettings?.studios?.[0]?.city || "Bengaluru Studio";

  return (
    <section
      id="introduction"
      className="w-full bg-white pt-8 sm:pt-12 pb-8 sm:pb-10 px-6 sm:px-10 lg:px-16 border-b border-neutral-200 scroll-mt-20 select-text"
    >
      <div className="max-w-7xl mx-auto">
        {/* Subtle architectural top divider rule matching reference */}
        <div className="w-full border-t border-neutral-200 mb-10 sm:mb-14" />

        {/* Top 2-Column Grid: Left Brand Logo, Right Hero Editorial Statement & CTAs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-start">
          {/* Left Column: Official Techno Architecture Brand Logo + Location Subtext */}
          <div className="flex flex-col items-start pt-0.5 sm:pt-1">
            <Link
              href="/home"
              className="inline-flex flex-col items-start group focus:outline-none transition-opacity hover:opacity-90 w-full max-w-[380px] sm:max-w-[400px] lg:max-w-[420px]"
              aria-label="Techno Architecture"
            >
              <div className="relative w-full aspect-[1024/290]">
                <Image
                  src="/techno-brand-logo.png"
                  alt="Techno Architecture"
                  fill
                  priority
                  unoptimized
                  sizes="(max-width: 768px) 320px, 420px"
                  className="object-contain object-left"
                />
              </div>

              {/* Bengaluru · India aligned with logo & text */}
              <div className="mt-2.5 sm:mt-3 w-full text-left text-[10px] sm:text-[11px] md:text-xs font-semibold tracking-[0.28em] text-neutral-900 uppercase font-heading select-none">
                {"BENGALURU \u00B7 INDIA"}
              </div>
            </Link>
          </div>

          {/* Right Column: Editorial Title, Description, and Stacked Action Buttons */}
          <div className="space-y-3.5 sm:space-y-4">
            <h1 className="font-heading text-2xl sm:text-3xl lg:text-[32px] font-medium text-neutral-900 leading-[1.22] tracking-tight">
              {tagline}
            </h1>

            <p className="text-[14.5px] sm:text-[15.5px] text-neutral-600 leading-relaxed font-light">
              {shortDesc}
            </p>

            {/* Action Buttons */}
            <div className="pt-2 sm:pt-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Link
                href="/projects"
                className="inline-flex items-center justify-between gap-5 px-5 py-2.5 sm:px-6 sm:py-3 bg-neutral-950 text-white hover:bg-neutral-800 transition-colors text-[10px] sm:text-[10.5px] tracking-[0.2em] uppercase font-sans font-medium"
              >
                <span>EXPLORE OUR PROJECTS</span>
                <ArrowUpRight size={13} className="shrink-0 stroke-[2]" />
              </Link>

              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-5 py-2.5 sm:px-6 sm:py-3 bg-white border border-neutral-300 hover:border-black text-neutral-700 hover:text-black transition-colors text-[10px] sm:text-[10.5px] tracking-[0.2em] uppercase font-sans font-medium"
              >
                <span>START A CONVERSATION</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Section: Introduction Narrative & Blue-Circled Leadership / Location Cards */}
        <div className="mt-20 sm:mt-28 lg:mt-36 xl:mt-44 w-full space-y-8 sm:space-y-10">
          <div className="w-full space-y-4 sm:space-y-5">
            <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.28em] text-neutral-400 font-mono block font-semibold">
              INTRODUCTION
            </span>

            {/* Content brought across to this end - eliminates blank right area */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 w-full">
              <p className="text-[15px] sm:text-[16.5px] text-neutral-900 leading-[1.8] font-light">
                {longDesc}
              </p>

              <p className="text-[15px] sm:text-[16.5px] text-neutral-700 leading-[1.8] font-light">
                We work closely with clients from the earliest discussions through design development and execution. Together with our team and consultants, we make sure every project responds to its site, purpose, budget and the people who will inhabit it.
              </p>
            </div>
          </div>

          {/* The Blue Color Content: 01 / PRACTICE LEADERSHIP & 02 / STUDIO LOCATION */}
          {/* Positioned directly below introduction paragraph, spanning across to this end */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 pt-2 w-full">
            <div className="p-5 sm:p-6 bg-neutral-50 border border-neutral-200/90 rounded-sm space-y-1.5 hover:border-neutral-300 transition-colors">
              <span className="text-[9.5px] font-mono text-neutral-500 uppercase tracking-widest block font-semibold">
                01 / PRACTICE LEADERSHIP
              </span>
              <h3 className="font-heading text-xs sm:text-sm font-semibold uppercase tracking-wider text-neutral-900">
                Ar. Rajesh Shivaram
              </h3>
              <p className="text-xs sm:text-[13px] text-neutral-600 font-light leading-relaxed">
                Graduate of Bangalore Institute of Technology bringing 20 years of professional architectural experience.
              </p>
            </div>

            <div className="p-5 sm:p-6 bg-neutral-50 border border-neutral-200/90 rounded-sm space-y-1.5 hover:border-neutral-300 transition-colors">
              <span className="text-[9.5px] font-mono text-neutral-500 uppercase tracking-widest block font-semibold">
                02 / STUDIO LOCATION
              </span>
              <h3 className="font-heading text-xs sm:text-sm font-semibold uppercase tracking-wider text-neutral-900">
                {studioCity}
              </h3>
              <p className="text-xs sm:text-[13px] text-neutral-600 font-light leading-relaxed">
                Established in {foundedYear}, delivering contextual residential, commercial, hospitality and bespoke interior architecture.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
