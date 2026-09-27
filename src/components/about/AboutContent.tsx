"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useCMSStore } from "@/lib/cmsStore";

export default function AboutContent() {
  const { siteSettings } = useCMSStore();

  const tagline = siteSettings?.tagline || "Architecture shaped around people, place and purpose.";
  const foundedYear = siteSettings?.foundedYear || 2006;
  const studioCity = siteSettings?.studios?.[0]?.city || "Basavanagudi, Bengaluru";
  const address = siteSettings?.studios?.[0]?.address || "Basavanagudi, Bengaluru";

  return (
    <div className="w-full py-10 md:py-16 px-6 md:px-12 lg:px-16 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="border-b border-neutral-200 pb-6 mb-12">
        <span className="text-[10px] uppercase tracking-[0.3em] font-semibold text-neutral-400 block">
          ABOUT US
        </span>
        <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-light text-neutral-900 tracking-tight mt-2">
          {tagline}
        </h1>
      </div>

      {/* Main Full-Bleed Editorial Visual */}
      <div className="relative w-full aspect-[21/9] sm:aspect-[16/7] bg-neutral-100 overflow-hidden mb-16">
        <Image
          src="/projects/salut/salut-terrace-bar-screening-ambience.jpg"
          alt="Techno Architecture Studio Project"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute bottom-4 right-4 bg-black/70 text-white text-[9px] uppercase tracking-[0.2em] px-3 py-1 backdrop-blur-sm">
          Techno Architecture · {studioCity}
        </div>
      </div>

      {/* Editorial Dual-Column Spatial Narrative */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16 pb-16 border-b border-neutral-200">
        {/* Left Column: Leadership & Studio Information (md:col-span-4) */}
        <div className="md:col-span-4 space-y-8 text-xs text-neutral-800">
          <div>
            <span className="text-[10px] uppercase tracking-[0.25em] text-neutral-400 block mb-1">
              PRINCIPAL ARCHITECT & PRACTICE LEAD
            </span>
            <p className="font-medium text-sm text-black">Rajesh Shivaram</p>
            <p className="text-neutral-500 text-[11px] mt-0.5">Graduate of Bangalore Institute of Technology</p>
            <p className="text-neutral-500 text-[11px]">20 Years Professional Experience</p>
          </div>

          <div className="pt-4 border-t border-neutral-100">
            <span className="text-[10px] uppercase tracking-[0.25em] text-neutral-400 block mb-2">
              PRACTICE BASE
            </span>
            <p className="text-neutral-700 font-medium">Established in {foundedYear}</p>
            <p className="text-neutral-600 mt-1">{address}</p>
            <p className="text-neutral-500 text-[11px] mt-1">Karnataka, India</p>
          </div>

          <div className="pt-2">
            <Link
              href="/team"
              className="inline-flex items-center gap-1 text-[10px] uppercase tracking-[0.2em] font-semibold text-black hover:underline"
            >
              OUR TEAM & LEADERSHIP →
            </Link>
          </div>
        </div>

        {/* Right Column: Narrative from PDF Page 3 */}
        <div className="md:col-span-8 space-y-6 text-sm md:text-base leading-relaxed text-neutral-700 font-light">
          <p className="text-base md:text-lg text-neutral-900 leading-relaxed font-normal">
            Techno Architecture is an architecture and design practice led by Rajesh Shivaram, a graduate of Bangalore Institute of Technology. The studio combines design exploration with practical problem-solving to create buildings and interiors that are clear in concept, comfortable to use and responsive to their environment.
          </p>
          <p>
            Our work is shaped through dialogue. We listen carefully, study the site and translate each client&apos;s priorities into a design that feels personal while remaining technically sound and buildable.
          </p>
        </div>
      </div>

      {/* Vision & Mission */}
      <div className="py-16 grid grid-cols-1 md:grid-cols-2 gap-8 border-b border-neutral-200">
        <div className="p-8 bg-neutral-50 border border-neutral-200 space-y-4">
          <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest block">
            01 / VISION
          </span>
          <h2 className="font-display text-2xl font-light text-neutral-900">
            Vision
          </h2>
          <p className="text-sm text-neutral-700 leading-relaxed font-light">
            To create architecture that improves everyday life, responds responsibly to its environment and remains meaningful over time.
          </p>
        </div>

        <div className="p-8 bg-neutral-50 border border-neutral-200 space-y-4">
          <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest block">
            02 / MISSION
          </span>
          <h2 className="font-display text-2xl font-light text-neutral-900">
            Mission
          </h2>
          <p className="text-sm text-neutral-700 leading-relaxed font-light">
            To guide every project through a clear and collaborative design process, bringing together creativity, technical rigour, environmental awareness and careful execution. We aim to deliver spaces that reflect each client&apos;s needs while contributing positively to their setting.
          </p>
        </div>
      </div>

      {/* Core Values (6 items from PDF) */}
      <div className="py-16 space-y-8 border-b border-neutral-200">
        <div>
          <span className="text-[10px] uppercase tracking-[0.3em] font-semibold text-neutral-400 block">
            PRINCIPLES & ETHICS
          </span>
          <h2 className="font-display text-2xl md:text-3xl font-light text-neutral-900 mt-2">
            Core Values
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 bg-white border border-neutral-200 space-y-2">
            <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest block">01</span>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-900">Design Integrity</h3>
            <p className="text-xs text-neutral-600 leading-relaxed font-light">
              We protect the central idea of a project from concept through completion.
            </p>
          </div>

          <div className="p-6 bg-white border border-neutral-200 space-y-2">
            <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest block">02</span>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-900">Client Partnership</h3>
            <p className="text-xs text-neutral-600 leading-relaxed font-light">
              We listen, explain choices clearly and make decisions collaboratively.
            </p>
          </div>

          <div className="p-6 bg-white border border-neutral-200 space-y-2">
            <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest block">03</span>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-900">Context and Climate</h3>
            <p className="text-xs text-neutral-600 leading-relaxed font-light">
              We respond to orientation, light, ventilation, landscape and local conditions.
            </p>
          </div>

          <div className="p-6 bg-white border border-neutral-200 space-y-2">
            <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest block">04</span>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-900">Practical Innovation</h3>
            <p className="text-xs text-neutral-600 leading-relaxed font-light">
              We explore new possibilities while respecting function, budget and construction realities.
            </p>
          </div>

          <div className="p-6 bg-white border border-neutral-200 space-y-2">
            <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest block">05</span>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-900">Responsible Practice</h3>
            <p className="text-xs text-neutral-600 leading-relaxed font-light">
              We favour durable solutions, efficient planning and environmentally conscious choices.
            </p>
          </div>

          <div className="p-6 bg-white border border-neutral-200 space-y-2">
            <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest block">06</span>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-900">Craft and Detail</h3>
            <p className="text-xs text-neutral-600 leading-relaxed font-light">
              We believe material junctions, proportions and execution determine the quality of the finished space.
            </p>
          </div>
        </div>
      </div>

      {/* What Sets Us Apart */}
      <div className="py-16 space-y-6">
        <div>
          <span className="text-[10px] uppercase tracking-[0.3em] font-semibold text-neutral-400 block">
            DIFFERENTIATION
          </span>
          <h2 className="font-display text-2xl md:text-3xl font-light text-neutral-900 mt-2">
            What Sets Us Apart
          </h2>
        </div>

        <div className="space-y-4 max-w-4xl text-sm md:text-base leading-relaxed text-neutral-700 font-light">
          <p>
            Techno Architecture offers an end to end approach in which architecture, interiors, structural design and execution support are coordinated together. This continuity reduces fragmented decisions and keeps the completed project consistent from its overall form to its smallest details.
          </p>
          <p>
            Our designs combine creativity with comfort, luxury with restraint, and ambition with practical planning. The result is architecture that is individual to the client rather than shaped by a fixed visual formula.
          </p>
          <p className="font-medium text-neutral-900 pt-2">
            Established in {foundedYear}, Techno Architecture is based in {studioCity}.
          </p>
        </div>
      </div>

      {/* Call to Action Bar */}
      <div className="mt-8 p-8 md:p-12 bg-neutral-950 text-white flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h3 className="font-display text-xl md:text-2xl font-light text-white">
            Have a project in mind?
          </h3>
          <p className="text-xs text-neutral-400 mt-1">
            Let us discuss your project across residential, commercial, hospitality or institutional spaces.
          </p>
        </div>
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-medium bg-white text-black px-6 py-3 hover:bg-neutral-200 transition-colors"
        >
          <span>Start a Conversation</span>
          <ArrowUpRight size={14} />
        </Link>
      </div>
    </div>
  );
}
