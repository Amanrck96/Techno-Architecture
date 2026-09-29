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

  return (
    <section
      id="introduction"
      className="w-full bg-white pt-8 sm:pt-12 pb-16 sm:pb-24 px-6 sm:px-10 lg:px-16 border-b border-neutral-200 scroll-mt-20 select-text"
    >
      <div className="max-w-7xl mx-auto">
        {/* Subtle architectural top divider rule matching reference */}
        <div className="w-full border-t border-neutral-200 mb-10 sm:mb-14" />

        {/* Top 2-Column Grid: Left Brand Logo, Right Hero Editorial Statement & CTAs */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
          {/* Left Column: Official Techno Architecture Brand Logo */}
          <div className="lg:col-span-5 flex items-start">
            <Link
              href="/home"
              className="inline-block focus:outline-none transition-opacity hover:opacity-90"
              aria-label="Techno Architecture"
            >
              <div className="relative w-72 sm:w-80 md:w-96 lg:w-[400px] xl:w-[420px] aspect-[576/162]">
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
            </Link>
          </div>

          {/* Right Column: Editorial Title, Description, and Stacked Action Buttons */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-5 lg:pl-2">
            <h1 className="font-serif text-2xl sm:text-3xl lg:text-[32px] font-normal text-neutral-900 leading-[1.25] tracking-normal max-w-xl">
              {tagline}
            </h1>

            <p className="font-serif text-[15px] sm:text-base text-neutral-700 leading-relaxed font-light max-w-xl">
              {shortDesc}
            </p>

            {/* Stacked Action Buttons */}
            <div className="pt-2 sm:pt-3 flex flex-col items-start gap-2.5">
              <Link
                href="/projects"
                className="inline-flex items-center justify-between gap-5 px-5 py-2.5 sm:px-6 sm:py-3 bg-neutral-950 text-white hover:bg-neutral-800 transition-colors text-[10px] sm:text-[10.5px] tracking-[0.2em] uppercase font-sans font-medium"
              >
                <span>EXPLORE OUR PROJECTS</span>
                <ArrowUpRight size={13} className="shrink-0 stroke-[2]" />
              </Link>

              <Link
                href="/contact"
                className="inline-flex items-center px-5 py-2.5 sm:px-6 sm:py-3 bg-white border border-neutral-300 hover:border-black text-neutral-700 hover:text-black transition-colors text-[10px] sm:text-[10.5px] tracking-[0.2em] uppercase font-sans font-medium"
              >
                <span>START A CONVERSATION</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Section: Introduction Narrative */}
        <div className="mt-14 sm:mt-20 lg:mt-24 max-w-3xl space-y-4 sm:space-y-5">
          <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.28em] text-neutral-400 font-serif block">
            INTRODUCTION
          </span>

          <p className="font-serif text-[15px] sm:text-[16px] text-neutral-800 leading-[1.75] font-light">
            {longDesc}
          </p>

          <p className="font-serif text-[15px] sm:text-[16px] text-neutral-700 leading-[1.75] font-light">
            We work closely with clients from the earliest discussions through design development and execution. Together with our team and consultants, we make sure every project responds to its site, purpose, budget and the people who will inhabit it.
          </p>
        </div>
      </div>
    </section>
  );
}
