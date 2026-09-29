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
      className="w-full bg-white pt-8 sm:pt-12 pb-16 sm:pb-24 px-6 sm:px-10 lg:px-16 border-b border-neutral-200 scroll-mt-20 select-text"
    >
      <div className="max-w-7xl mx-auto">
        {/* Subtle architectural top divider rule matching reference */}
        <div className="w-full border-t border-neutral-200 mb-10 sm:mb-14" />

        {/* Top 2-Column Grid: Left Brand Logo, Right Hero Editorial Statement & CTAs */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
          {/* Left Column: Official Techno Architecture Brand Logo + Centralized Location Subtext */}
          <div className="lg:col-span-5 flex flex-col items-start">
            <Link
              href="/home"
              className="inline-flex flex-col items-center group focus:outline-none transition-opacity hover:opacity-90 w-72 sm:w-80 md:w-96 lg:w-[400px] xl:w-[420px]"
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
                  className="object-contain object-center"
                />
              </div>

              {/* Bengaluru · India centralized below logo */}
              <div className="mt-3 sm:mt-3.5 w-full text-center text-[11px] sm:text-xs md:text-[13px] font-semibold tracking-[0.28em] pl-[0.28em] text-neutral-900 uppercase font-heading select-none">
                {"BENGALURU \u00B7 INDIA"}
              </div>
            </Link>
          </div>

          {/* Right Column: Editorial Title, Description, and Stacked Action Buttons */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-5 lg:pl-2">
            <h1 className="font-heading text-2xl sm:text-3xl lg:text-[34px] font-medium text-neutral-900 leading-[1.2] tracking-tight max-w-xl">
              {tagline}
            </h1>

            <p className="text-[15px] sm:text-base text-neutral-600 leading-relaxed font-light max-w-xl">
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

        {/* Bottom Section: Introduction Narrative & Blue-Circled Leadership / Location Cards */}
        <div className="mt-14 sm:mt-18 lg:mt-22 w-full space-y-8 sm:space-y-10">
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
                Established in {foundedYear}, delivering contextual residential, commercial, hospitality and institutional works.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
