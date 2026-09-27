"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Award, Compass, Eye, ShieldCheck, Sparkles, Building2, CheckCircle2 } from "lucide-react";
import { useCMSStore } from "@/lib/cmsStore";

export default function AboutContent() {
  const { siteSettings } = useCMSStore();
  const [activeValueIndex, setActiveValueIndex] = useState<number | null>(null);

  const tagline = siteSettings?.tagline || "Architecture shaped around people, place and purpose.";
  const foundedYear = siteSettings?.foundedYear || 2006;
  const studioCity = siteSettings?.studios?.[0]?.city || "Basavanagudi, Bengaluru";
  const address = siteSettings?.studios?.[0]?.address || "No. 9, Uttaradi Mutt Road, Shankarpuram, Basavanagudi, Bengaluru";

  const stats = [
    { value: `${foundedYear}`, label: "Established Studio", detail: "Rooted in Basavanagudi" },
    { value: "20+", label: "Years Experience", detail: "Ar. Rajesh Shivaram" },
    { value: "100+", label: "Projects Designed", detail: "Contextual & Sustainable" },
    { value: "15+", label: "Recognitions", detail: "Awards, Publications & Monograph" },
  ];

  const coreValues = [
    {
      num: "01",
      title: "Design Integrity",
      desc: "We protect the central idea of a project from concept through completion.",
      tag: "Commitment",
    },
    {
      num: "02",
      title: "Client Partnership",
      desc: "We listen, explain choices clearly and make decisions collaboratively.",
      tag: "Dialogue",
    },
    {
      num: "03",
      title: "Context and Climate",
      desc: "We respond to orientation, light, ventilation, landscape and local conditions.",
      tag: "Sustainability",
    },
    {
      num: "04",
      title: "Practical Innovation",
      desc: "We explore new possibilities while respecting function, budget and construction realities.",
      tag: "Engineering",
    },
    {
      num: "05",
      title: "Responsible Practice",
      desc: "We favour durable solutions, efficient planning and environmentally conscious choices.",
      tag: "Lifecycle",
    },
    {
      num: "06",
      title: "Craft and Detail",
      desc: "We believe material junctions, proportions and execution determine the quality of the finished space.",
      tag: "Precision",
    },
  ];

  const differentiators = [
    {
      title: "End-to-End Coordination",
      desc: "Architecture, interiors, structural design and execution support are coordinated together as one cohesive team. This continuity prevents fragmented compromises and guarantees seamless execution.",
    },
    {
      title: "Bespoke Spatial Character",
      desc: "Our designs combine creativity with comfort, luxury with restraint, and ambition with practical planning. Every building is individual to the client rather than copied from a formula.",
    },
    {
      title: "Climate & Passive Intelligence",
      desc: "Deep overhangs, natural stack ventilation, shaded courtyards, and honest materiality keep buildings thermally comfortable and resource-conscious for generations.",
    },
  ];

  return (
    <div className="w-full py-10 md:py-16 px-6 md:px-12 lg:px-16 max-w-7xl mx-auto space-y-16 sm:space-y-20">
      {/* 1. Header with Staggered Fade-Up */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="border-b border-neutral-200 pb-8"
      >
        <div className="flex items-center gap-2 mb-3">
          <span className="w-2 h-2 rounded-full bg-neutral-900 animate-pulse" />
          <span className="text-[10px] uppercase tracking-[0.3em] font-semibold text-neutral-500 font-mono">
            PRACTICE ARCHIVE & PROFILE
          </span>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-neutral-900 tracking-tight max-w-4xl leading-[1.12]">
          {tagline}
        </h1>
      </motion.div>

      {/* 2. Main Full-Bleed Editorial Visual with Hover Zoom */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full aspect-[21/9] sm:aspect-[16/7] bg-neutral-950 overflow-hidden group shadow-lg"
      >
        <Image
          src="/projects/salut/salut-terrace-bar-screening-ambience.jpg"
          alt="Techno Architecture Studio Project"
          fill
          priority
          sizes="100vw"
          className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="absolute bottom-5 left-5 sm:bottom-6 sm:left-6 bg-black/80 backdrop-blur-md text-white text-[9.5px] uppercase tracking-[0.22em] font-mono px-4 py-2 border border-white/20 shadow-md"
        >
          Techno Architecture · {studioCity}
        </motion.div>
      </motion.div>

      {/* 4. Editorial Dual-Column Spatial Narrative */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16 pb-16 border-b border-neutral-200">
        {/* Left Column: Leadership & Studio Information */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="md:col-span-5 space-y-6 text-xs text-neutral-800"
        >
          <div className="p-6 bg-neutral-50 border border-neutral-200 space-y-3 relative overflow-hidden group hover:border-black transition-colors duration-300">
            <span className="text-[9.5px] uppercase tracking-[0.25em] text-neutral-400 block font-mono font-semibold">
              01 / PRACTICE LEADERSHIP
            </span>
            <div>
              <p className="font-medium text-base text-black tracking-wide">Ar. Rajesh Shivaram</p>
              <p className="text-neutral-500 text-xs mt-1">Graduate of Bangalore Institute of Technology</p>
              <p className="text-neutral-500 text-xs">20 Years of Professional Architectural Practice</p>
            </div>
            <div className="pt-2 text-[11px] text-neutral-600 leading-relaxed font-light">
              Leading the firm since inception, shaping a portfolio of notable private villas, commercial hubs, and institutional complexes across South India.
            </div>
          </div>

          <div className="p-6 bg-neutral-50 border border-neutral-200 space-y-3 hover:border-black transition-colors duration-300">
            <span className="text-[9.5px] uppercase tracking-[0.25em] text-neutral-400 block font-mono font-semibold">
              02 / STUDIO HEADQUARTERS
            </span>
            <p className="text-neutral-900 font-medium text-sm">Established in {foundedYear}</p>
            <p className="text-neutral-600 leading-relaxed">{address}</p>
            <p className="text-neutral-500 text-[11px] font-mono">Bengaluru, Karnataka, India</p>
          </div>

          <div className="pt-2">
            <Link
              href="/team"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-semibold text-black hover:translate-x-1 transition-transform"
            >
              <span>Explore Studio Practitioners & Team</span>
              <ArrowUpRight size={14} />
            </Link>
          </div>
        </motion.div>

        {/* Right Column: Narrative from PDF Page 3 */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="md:col-span-7 space-y-6 text-sm md:text-base leading-relaxed text-neutral-700 font-light"
        >
          <div className="border-l-2 border-black pl-6 sm:pl-8 space-y-4">
            <span className="text-[10px] uppercase font-mono tracking-[0.3em] text-neutral-400 font-semibold block">
              DESIGN PHILOSOPHY
            </span>
            <p className="text-base sm:text-lg text-neutral-900 leading-relaxed font-normal">
              Techno Architecture is an architecture and design practice led by Rajesh Shivaram, a graduate of Bangalore Institute of Technology. The studio combines design exploration with practical problem-solving to create buildings and interiors that are clear in concept, comfortable to use and responsive to their environment.
            </p>
          </div>

          <p className="text-neutral-600 leading-relaxed pl-6 sm:pl-8">
            Our work is shaped through dialogue. We listen carefully, study the site and translate each client&apos;s priorities into a design that feels personal while remaining technically sound and buildable.
          </p>

          <p className="text-neutral-600 leading-relaxed pl-6 sm:pl-8">
            By keeping planning, materiality, daylight and climatic responsiveness tightly integrated, every project delivers durable spatial harmony and enduring human value.
          </p>
        </motion.div>
      </div>

      {/* 5. Animated Vision & Mission Cards with Hover Elevation */}
      <div className="py-8">
        <div className="mb-8">
          <span className="text-[10px] uppercase tracking-[0.3em] font-semibold text-neutral-400 block font-mono">
            CORE ORIENTATION
          </span>
          <h2 className="font-display text-2xl sm:text-3xl font-light text-neutral-900 mt-1">
            Vision & Mission
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Vision Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -6 }}
            transition={{ duration: 0.4 }}
            className="p-8 sm:p-10 bg-gradient-to-br from-neutral-50 via-white to-neutral-100 border border-neutral-200 hover:border-black rounded-xs shadow-xs hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
          >
            <div className="flex items-center justify-between mb-6">
              <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest font-semibold">
                01 / VISION
              </span>
              <div className="w-9 h-9 rounded-full bg-neutral-900 text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                <Compass size={18} />
              </div>
            </div>
            <h3 className="font-display text-2xl sm:text-3xl font-light text-neutral-900 mb-4 tracking-tight">
              Vision
            </h3>
            <p className="text-sm md:text-base text-neutral-700 leading-relaxed font-light">
              To create architecture that improves everyday life, responds responsibly to its environment and remains meaningful over time.
            </p>
            <div className="mt-6 pt-4 border-t border-neutral-200/70 text-[11px] font-mono text-neutral-400">
              PURPOSE-DRIVEN ARCHITECTURE
            </div>
          </motion.div>

          {/* Mission Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -6 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="p-8 sm:p-10 bg-gradient-to-br from-neutral-50 via-white to-neutral-100 border border-neutral-200 hover:border-black rounded-xs shadow-xs hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
          >
            <div className="flex items-center justify-between mb-6">
              <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest font-semibold">
                02 / MISSION
              </span>
              <div className="w-9 h-9 rounded-full bg-neutral-900 text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                <Sparkles size={18} />
              </div>
            </div>
            <h3 className="font-display text-2xl sm:text-3xl font-light text-neutral-900 mb-4 tracking-tight">
              Mission
            </h3>
            <p className="text-sm md:text-base text-neutral-700 leading-relaxed font-light">
              To guide every project through a clear and collaborative design process, bringing together creativity, technical rigour, environmental awareness and careful execution. We aim to deliver spaces that reflect each client&apos;s needs while contributing positively to their setting.
            </p>
            <div className="mt-6 pt-4 border-t border-neutral-200/70 text-[11px] font-mono text-neutral-400">
              COLLABORATIVE PROCESS & RIGOUR
            </div>
          </motion.div>
        </div>
      </div>

      {/* 6. Core Values (All 6 from PDF Page 3) with Animated Cards */}
      <div className="py-12 border-t border-neutral-200 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-[10px] uppercase tracking-[0.3em] font-semibold text-neutral-400 block font-mono">
              PRINCIPLES & ETHICS
            </span>
            <h2 className="font-display text-2xl md:text-3xl lg:text-4xl font-light text-neutral-900 mt-1">
              Core Values
            </h2>
          </div>
          <p className="text-xs text-neutral-500 font-light max-w-sm">
            Six foundational commitments guiding every schematic idea and construction review.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coreValues.map((val, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              whileHover={{ y: -4 }}
              onHoverStart={() => setActiveValueIndex(idx)}
              onHoverEnd={() => setActiveValueIndex(null)}
              className={`p-6 sm:p-7 border transition-all duration-300 relative rounded-xs ${
                activeValueIndex === idx
                  ? "bg-neutral-900 text-white border-neutral-900 shadow-xl"
                  : "bg-white text-neutral-900 border-neutral-200 hover:border-neutral-400 shadow-xs"
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <span
                  className={`text-[10px] font-mono uppercase tracking-widest font-semibold ${
                    activeValueIndex === idx ? "text-neutral-400" : "text-neutral-400"
                  }`}
                >
                  {val.num} / VALUE
                </span>
                <span
                  className={`text-[9px] uppercase tracking-[0.2em] font-mono px-2 py-0.5 rounded-full ${
                    activeValueIndex === idx
                      ? "bg-white/10 text-neutral-300"
                      : "bg-neutral-100 text-neutral-600"
                  }`}
                >
                  {val.tag}
                </span>
              </div>

              <h3 className="text-sm font-semibold uppercase tracking-wider mb-2">
                {val.title}
              </h3>
              <p
                className={`text-xs leading-relaxed font-light ${
                  activeValueIndex === idx ? "text-neutral-300" : "text-neutral-600"
                }`}
              >
                {val.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Studio Milestones Bar (Positioned Between Core Values & What Sets Us Apart) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-6 sm:p-8 bg-neutral-900 text-white rounded-sm shadow-xl my-4"
      >
        {stats.map((stat, sIdx) => (
          <motion.div
            key={sIdx}
            whileHover={{ y: -3 }}
            className="space-y-1 border-l border-neutral-700/60 pl-4 sm:pl-6 first:border-l-0"
          >
            <div className="font-display text-3xl sm:text-4xl md:text-5xl font-light tracking-tight text-white">
              {stat.value}
            </div>
            <div className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] font-medium text-neutral-300">
              {stat.label}
            </div>
            <div className="text-[10px] text-neutral-400 font-light font-mono">
              {stat.detail}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* 7. What Sets Us Apart (PDF Page 3) */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="py-12 border-t border-neutral-200 space-y-8"
      >
        <div>
          <span className="text-[10px] uppercase tracking-[0.3em] font-semibold text-neutral-400 block font-mono">
            DIFFERENTIATION
          </span>
          <h2 className="font-display text-2xl md:text-3xl font-light text-neutral-900 mt-1">
            What Sets Us Apart
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {differentiators.map((diff, dIdx) => (
            <motion.div
              key={dIdx}
              whileHover={{ y: -4 }}
              className="p-6 bg-neutral-50 border border-neutral-200 hover:border-black transition-colors rounded-xs space-y-3"
            >
              <span className="text-xs font-mono text-neutral-400">0{dIdx + 1} / ATTRIBUTE</span>
              <h3 className="font-display text-lg font-light text-neutral-900 tracking-tight">
                {diff.title}
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed font-light">
                {diff.desc}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="p-4 bg-neutral-100/70 border-l-2 border-neutral-900 text-xs text-neutral-700 font-mono">
          Established in {foundedYear}, Techno Architecture is based in {address}.
        </div>
      </motion.div>

      {/* 8. Call to Action Banner */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="p-8 md:p-14 bg-neutral-950 text-white flex flex-col md:flex-row md:items-center justify-between gap-8 rounded-xs shadow-2xl relative overflow-hidden"
      >
        <div className="space-y-2 z-10">
          <span className="text-[9.5px] uppercase tracking-[0.3em] font-mono text-neutral-400 block">
            INITIATE DIALOGUE
          </span>
          <h3 className="font-display text-2xl md:text-3xl font-light text-white tracking-tight">
            Have a project in mind?
          </h3>
          <p className="text-xs text-neutral-400 max-w-xl font-light leading-relaxed">
            Let us discuss your project across residential, commercial, hospitality or institutional spaces. We review site parameters and provide a structured design proposal.
          </p>
        </div>
        <Link
          href="/contact"
          className="z-10 inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-medium bg-white text-black px-7 py-4 hover:bg-neutral-200 transition-colors shadow-lg whitespace-nowrap self-start md:self-center"
        >
          <span>Start a Conversation</span>
          <ArrowUpRight size={14} />
        </Link>
      </motion.div>
    </div>
  );
}
