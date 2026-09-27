"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useCMSStore } from "@/lib/cmsStore";
import {
  ArrowUpRight,
  CheckCircle2,
  Layers,
  Compass,
  Building,
  Hammer,
  Lightbulb,
  Maximize2,
  Users2,
  FileCheck,
  ShieldAlert,
} from "lucide-react";

export default function ServicesPage() {
  const { services, siteSettings } = useCMSStore();
  const [activeTab, setActiveTab] = useState<string>("architecture");

  const servicesHeader = siteSettings?.servicesHeader || {
    title: "Services",
    subtitle: "PRACTICE DISCIPLINES & SCOPE",
    description: "We provide integrated design services for new buildings and interior environments. Each appointment is structured around the project's scale, stage and specific requirements.",
  };

  const archService = services.find((s) => s.slug === "architecture") || services[0];
  const interiorService = services.find((s) => s.slug === "interior-design") || services[1];
  const structuralService = services.find((s) => s.slug === "structural-design") || services[2];
  const specialistService =
    services.find((s) => s.slug === "specialist-consultant-introductions") || services[3];

  const scrollTo = (id: string) => {
    setActiveTab(id);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="w-full py-10 md:py-16 px-6 md:px-12 lg:px-16 max-w-7xl mx-auto space-y-20">
      {/* 1. Header with Discipline Jump Navigation */}
      <div className="border-b border-neutral-200 pb-8 space-y-6">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-light text-neutral-900 tracking-tight">
            {servicesHeader.title}
          </h1>
          <span className="text-[10px] uppercase tracking-[0.3em] font-semibold text-neutral-400 block font-mono mt-2">
            {servicesHeader.subtitle}
          </span>
          <p className="text-xs sm:text-sm text-neutral-500 max-w-2xl mt-3 leading-relaxed tracking-wide font-light">
            {servicesHeader.description}
          </p>
        </div>

        {/* Interactive Discipline Jump Selector */}
        <div className="flex flex-wrap items-center gap-2 pt-2">
          {[
            { id: "architecture", label: "01 / Architecture" },
            { id: "interior-design", label: "02 / Interior Design" },
            { id: "structural-design", label: "03 / Structural Design" },
            { id: "specialist-consultant-introductions", label: "04 / Specialist Introductions" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => scrollTo(tab.id)}
              type="button"
              className={`text-[10.5px] uppercase tracking-[0.2em] font-mono py-2 px-4 rounded-xs transition-all duration-300 ${
                activeTab === tab.id
                  ? "bg-neutral-900 text-white font-medium shadow-md"
                  : "bg-neutral-100 text-neutral-600 hover:text-black hover:bg-neutral-200/80"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* CATEGORY 01: ARCHITECTURE (Flagship Full-Bleed Layout with 6-Stage Flow) */}
      {/* ========================================================================= */}
      {archService && (
        <section
          id="architecture"
          className="scroll-mt-24 pt-4 border-t-2 border-neutral-900 space-y-10"
        >
          {/* Category Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-mono text-neutral-400 uppercase tracking-widest block font-semibold">
                01 / CORE DISCIPLINE
              </span>
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-light uppercase tracking-tight text-neutral-900 mt-1">
                {archService.title}
              </h2>
            </div>
            <Link
              href={`/services/${archService.slug}`}
              className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] font-semibold text-black hover:translate-x-1 transition-transform"
            >
              <span>View Dedicated Protocol</span>
              <ArrowUpRight size={14} />
            </Link>
          </div>

          {/* Top Row: Hero Image Left + Scope & Philosophy Right */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            <div className="lg:col-span-6 relative aspect-[16/11] w-full bg-neutral-900 overflow-hidden shadow-xl group">
              <Image
                src={archService.image || "/projects/aikya/elevation-east.jpg"}
                alt={archService.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-md text-white text-[9.5px] uppercase font-mono tracking-widest px-3 py-1.5 border border-white/20">
                Contextual Spatial Form · Basavanagudi
              </div>
            </div>

            <div className="lg:col-span-6 space-y-6">
              <div className="border-l-2 border-neutral-900 pl-6 space-y-3">
                <span className="text-[10px] uppercase font-mono tracking-[0.25em] text-neutral-400 font-semibold block">
                  ARCHITECTURAL SCOPE & PHILOSOPHY
                </span>
                <p className="text-base sm:text-lg text-neutral-900 font-light leading-relaxed">
                  {archService.detailedDescription}
                </p>
              </div>

              {/* Core Pillars */}
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="p-4 bg-neutral-50 border border-neutral-200/80 space-y-1">
                  <span className="text-[9px] font-mono text-neutral-400 uppercase tracking-widest block">
                    CLIMATIC ORIENTATION
                  </span>
                  <div className="text-xs font-semibold text-neutral-900">Light, Breeze & Shading</div>
                  <p className="text-[11px] text-neutral-500 font-light">
                    Harnessing sun angles, cross-ventilation, and green courtyards.
                  </p>
                </div>
                <div className="p-4 bg-neutral-50 border border-neutral-200/80 space-y-1">
                  <span className="text-[9px] font-mono text-neutral-400 uppercase tracking-widest block">
                    MATERIAL AUTHENTICITY
                  </span>
                  <div className="text-xs font-semibold text-neutral-900">Tactile & Durable</div>
                  <p className="text-[11px] text-neutral-500 font-light">
                    Exposed concrete, corten steel, local stone and solid teakwood.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 6 Scope Stages in Architecture (Explicit 6 Stages as per PDF) */}
          <div className="space-y-4 pt-6">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <span className="text-[10px] uppercase font-mono tracking-[0.25em] text-neutral-900 font-semibold">
                SCOPE OF WORK — 6 COMPLETE DESIGN PHASES (AS PER PRACTICE BRIEF)
              </span>
              <span className="text-[10px] font-mono text-neutral-400">PHASES 01 — 06</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {archService.process.map((step, idx) => (
                <div
                  key={idx}
                  className="p-5 bg-white border border-neutral-200 hover:border-black transition-all duration-200 space-y-2 group shadow-2xs hover:shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-semibold text-neutral-400 group-hover:text-black transition-colors">
                      {step.step} / PHASE
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-neutral-300 group-hover:bg-black transition-colors" />
                  </div>
                  <h4 className="text-xs sm:text-sm font-semibold text-neutral-900">
                    {step.title}
                  </h4>
                  <p className="text-xs text-neutral-500 font-light leading-relaxed">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* CATEGORY 02: INTERIOR DESIGN (Inverted Editorial Warm Materiality Layout)  */}
      {/* ========================================================================= */}
      {interiorService && (
        <section
          id="interior-design"
          className="scroll-mt-24 pt-12 border-t border-neutral-200 space-y-10"
        >
          {/* Category Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-mono text-neutral-400 uppercase tracking-widest block font-semibold">
                02 / INTERIOR ENVIRONMENTS
              </span>
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-light uppercase tracking-tight text-neutral-900 mt-1">
                {interiorService.title}
              </h2>
            </div>
            <Link
              href={`/services/${interiorService.slug}`}
              className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] font-semibold text-black hover:translate-x-1 transition-transform"
            >
              <span>View Dedicated Protocol</span>
              <ArrowUpRight size={14} />
            </Link>
          </div>

          {/* Inverted Row: Content Left + Large Tactile Imagery Right */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left Col: Narrative & Material Highlights */}
            <div className="lg:col-span-6 space-y-6 order-2 lg:order-1">
              <div className="border-l-2 border-neutral-400 pl-6 space-y-3">
                <span className="text-[10px] uppercase font-mono tracking-[0.25em] text-neutral-400 font-semibold block">
                  INTERIOR ARCHITECTURE & CRAFT
                </span>
                <p className="text-base sm:text-lg text-neutral-900 font-light leading-relaxed">
                  {interiorService.detailedDescription}
                </p>
              </div>

              {/* Material Pill Tag Cloud */}
              <div className="p-5 bg-neutral-50 border border-neutral-200 space-y-3">
                <span className="text-[9.5px] uppercase font-mono tracking-widest text-neutral-400 block font-semibold">
                  INTEGRATED INTERIOR ELEMENTS
                </span>
                <div className="flex flex-wrap gap-2 text-[11px] font-mono">
                  <span className="px-2.5 py-1 bg-white border border-neutral-300 text-neutral-800">
                    Space & Circulation Planning
                  </span>
                  <span className="px-2.5 py-1 bg-white border border-neutral-300 text-neutral-800">
                    Custom Built-in Millwork
                  </span>
                  <span className="px-2.5 py-1 bg-white border border-neutral-300 text-neutral-800">
                    Architectural Lighting
                  </span>
                  <span className="px-2.5 py-1 bg-white border border-neutral-300 text-neutral-800">
                    Tactile Natural Stone
                  </span>
                  <span className="px-2.5 py-1 bg-white border border-neutral-300 text-neutral-800">
                    Bespoke Joinery Details
                  </span>
                </div>
              </div>
            </div>

            {/* Right Col: High-Res Interior Visual */}
            <div className="lg:col-span-6 order-1 lg:order-2 relative aspect-[16/11] w-full bg-neutral-900 overflow-hidden shadow-xl group">
              <Image
                src={interiorService.image || "/projects/salut/salut-terrace-bar-screening-ambience.jpg"}
                alt={interiorService.title}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur-md text-white text-[9.5px] uppercase font-mono tracking-widest px-3 py-1.5 border border-white/20">
                Curated Materials & Proportions
              </div>
            </div>
          </div>

          {/* 6 Scope Stages in Interior Design */}
          <div className="space-y-4 pt-6">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <span className="text-[10px] uppercase font-mono tracking-[0.25em] text-neutral-900 font-semibold">
                INTERIOR SCOPE OF WORK (6 METHODOLOGICAL PHASES)
              </span>
              <span className="text-[10px] font-mono text-neutral-400">PHASES 01 — 06</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {interiorService.process.map((step, idx) => (
                <div
                  key={idx}
                  className="p-5 bg-neutral-50/70 border border-neutral-200 hover:border-black transition-all duration-200 space-y-2 group shadow-2xs hover:shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-semibold text-neutral-400 group-hover:text-black transition-colors">
                      {step.step} / INTERIOR
                    </span>
                    <span className="text-[9px] font-mono text-neutral-400">STAGE</span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-semibold text-neutral-900">
                    {step.title}
                  </h4>
                  <p className="text-xs text-neutral-500 font-light leading-relaxed">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* CATEGORY 03: STRUCTURAL DESIGN (Blueprint & Technical Engineering Matrix) */}
      {/* ========================================================================= */}
      {structuralService && (
        <section
          id="structural-design"
          className="scroll-mt-24 pt-12 border-t border-neutral-200 space-y-10"
        >
          {/* Category Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-mono text-neutral-400 uppercase tracking-widest block font-semibold">
                03 / STRUCTURAL INTEGRITY
              </span>
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-light uppercase tracking-tight text-neutral-900 mt-1">
                {structuralService.title}
              </h2>
            </div>
            <Link
              href={`/services/${structuralService.slug}`}
              className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] font-semibold text-black hover:translate-x-1 transition-transform"
            >
              <span>View Dedicated Protocol</span>
              <ArrowUpRight size={14} />
            </Link>
          </div>

          {/* Technical Engineering Overview Bar */}
          <div className="p-8 bg-neutral-900 text-white rounded-xs space-y-6">
            <div className="max-w-3xl space-y-3">
              <span className="text-[9.5px] uppercase font-mono tracking-[0.3em] text-neutral-400 font-semibold block">
                INTEGRATED ENGINEERING LOGIC
              </span>
              <p className="text-sm sm:text-base text-neutral-200 font-light leading-relaxed">
                {structuralService.detailedDescription}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-neutral-800 text-xs text-neutral-300">
              <div className="space-y-1">
                <span className="text-neutral-400 font-mono text-[10px] block">01 / SAFETY & CODES</span>
                <p className="text-neutral-200 font-light">Seismic, gravity and wind analysis adhering strictly to national building codes.</p>
              </div>
              <div className="space-y-1">
                <span className="text-neutral-400 font-mono text-[10px] block">02 / SPATIAL FREEDOM</span>
                <p className="text-neutral-200 font-light">Long spans, column-free living volumes, and cantilevered terraces.</p>
              </div>
              <div className="space-y-1">
                <span className="text-neutral-400 font-mono text-[10px] block">03 / RESOURCE EFFICIENCY</span>
                <p className="text-neutral-200 font-light">Optimized steel and concrete consumption to minimize embodied carbon.</p>
              </div>
            </div>
          </div>

          {/* 6 Structural Scope Deliverables Matrix */}
          <div className="space-y-4 pt-4">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <span className="text-[10px] uppercase font-mono tracking-[0.25em] text-neutral-900 font-semibold">
                STRUCTURAL SCOPE & TECHNICAL DELIVERABLES (ALL 6 STAGES)
              </span>
              <span className="text-[10px] font-mono text-neutral-400">ENGINEERING WORKFLOW</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {structuralService.process.map((step, idx) => (
                <div
                  key={idx}
                  className="p-5 bg-white border border-neutral-200 hover:border-black transition-all duration-200 space-y-2 group shadow-2xs hover:shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-semibold text-neutral-400 group-hover:text-black">
                      {step.step} / ENGINEERING
                    </span>
                    <Hammer size={12} className="text-neutral-400 group-hover:text-black" />
                  </div>
                  <h4 className="text-xs sm:text-sm font-semibold text-neutral-900">
                    {step.title}
                  </h4>
                  <p className="text-xs text-neutral-500 font-light leading-relaxed">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* CATEGORY 04: SPECIALIST CONSULTANTS (Advisory Network & Coordination Grid) */}
      {/* ========================================================================= */}
      {specialistService && (
        <section
          id="specialist-consultant-introductions"
          className="scroll-mt-24 pt-12 border-t border-neutral-200 space-y-10"
        >
          {/* Category Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-mono text-neutral-400 uppercase tracking-widest block font-semibold">
                04 / MULTI-DISCIPLINARY COLLABORATION
              </span>
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-light uppercase tracking-tight text-neutral-900 mt-1">
                {specialistService.title}
              </h2>
            </div>
            <Link
              href={`/services/${specialistService.slug}`}
              className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] font-semibold text-black hover:translate-x-1 transition-transform"
            >
              <span>View Dedicated Protocol</span>
              <ArrowUpRight size={14} />
            </Link>
          </div>

          {/* Two-Column Advisory Banner */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7 space-y-4">
              <p className="text-base sm:text-lg text-neutral-900 font-light leading-relaxed border-l-2 border-neutral-900 pl-6">
                {specialistService.detailedDescription}
              </p>

              {/* Specialist Disciplines Grid */}
              <div className="pt-4 space-y-2">
                <span className="text-[10px] uppercase font-mono tracking-widest text-neutral-400 block font-semibold">
                  DISCIPLINES INTRODUCED & COORDINATED
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs text-neutral-800">
                  <div className="p-3 bg-neutral-50 border border-neutral-200">
                    <span className="font-semibold block text-neutral-900">MEP Services</span>
                    <span className="text-[10px] text-neutral-500">HVAC, PHE & Electrical</span>
                  </div>
                  <div className="p-3 bg-neutral-50 border border-neutral-200">
                    <span className="font-semibold block text-neutral-900">Lighting Design</span>
                    <span className="text-[10px] text-neutral-500">Daylight & Night Scenarios</span>
                  </div>
                  <div className="p-3 bg-neutral-50 border border-neutral-200">
                    <span className="font-semibold block text-neutral-900">Landscape Architecture</span>
                    <span className="text-[10px] text-neutral-500">Ecological Planting & Water</span>
                  </div>
                  <div className="p-3 bg-neutral-50 border border-neutral-200">
                    <span className="font-semibold block text-neutral-900">Acoustic Engineering</span>
                    <span className="text-[10px] text-neutral-500">Theatres & Sound Privacy</span>
                  </div>
                  <div className="p-3 bg-neutral-50 border border-neutral-200">
                    <span className="font-semibold block text-neutral-900">Sustainability & Solar</span>
                    <span className="text-[10px] text-neutral-500">Net-zero & Rain Harvesting</span>
                  </div>
                  <div className="p-3 bg-neutral-50 border border-neutral-200">
                    <span className="font-semibold block text-neutral-900">Cost & Quantity Survey</span>
                    <span className="text-[10px] text-neutral-500">Bill of Quantities (BOQ)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Notice Card */}
            <div className="lg:col-span-5 p-6 sm:p-8 bg-neutral-100 border border-neutral-300 space-y-4">
              <div className="flex items-center gap-2 text-neutral-900">
                <Users2 size={18} />
                <h4 className="text-xs uppercase font-mono tracking-wider font-semibold">
                  CLIENT DIRECT APPOINTMENT
                </h4>
              </div>
              <p className="text-xs text-neutral-600 leading-relaxed font-light">
                Specialist consultants are appointed directly by the client. Their scope, fees and deliverables are defined separately according to the project&apos;s requirements, while Techno Architecture coordinates and integrates all design information seamlessly.
              </p>
              <div className="pt-2">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 py-2 px-4 bg-black text-white text-[10px] uppercase font-mono tracking-widest hover:bg-neutral-800 transition-colors"
                >
                  <span>Inquire for Project Scope</span>
                  <ArrowUpRight size={12} />
                </Link>
              </div>
            </div>
          </div>

          {/* 6 Coordination Phases */}
          <div className="space-y-4 pt-4">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <span className="text-[10px] uppercase font-mono tracking-[0.25em] text-neutral-900 font-semibold">
                COORDINATION PROTOCOL (ALL 6 STAGES FROM PDF)
              </span>
              <span className="text-[10px] font-mono text-neutral-400">INTEGRATION MILESTONES</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {specialistService.process.map((step, idx) => (
                <div
                  key={idx}
                  className="p-5 bg-white border border-neutral-200 hover:border-black transition-all duration-200 space-y-2 group shadow-2xs hover:shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-semibold text-neutral-400 group-hover:text-black">
                      {step.step} / COORDINATION
                    </span>
                    <FileCheck size={13} className="text-neutral-400 group-hover:text-black" />
                  </div>
                  <h4 className="text-xs sm:text-sm font-semibold text-neutral-900">
                    {step.title}
                  </h4>
                  <p className="text-xs text-neutral-500 font-light leading-relaxed">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 5. Bottom Engagement CTA Banner */}
      <div className="mt-16 p-8 md:p-12 bg-neutral-950 text-white flex flex-col md:flex-row md:items-center justify-between gap-8 rounded-xs shadow-2xl">
        <div className="space-y-2">
          <span className="text-[9.5px] uppercase tracking-[0.3em] font-mono text-neutral-400 block">
            APPOINTMENT & SCOPE STRUCTURING
          </span>
          <h3 className="font-display text-2xl md:text-3xl font-light text-white tracking-tight">
            Structure your project appointment with us
          </h3>
          <p className="text-xs text-neutral-400 max-w-xl font-light leading-relaxed">
            Whether you are commissioning a new villa, commercial building, or complete interior, we define clear stages, scope, and professional fee proposals tailored to your site.
          </p>
        </div>
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-medium bg-white text-black px-7 py-3.5 hover:bg-neutral-200 transition-colors shadow-lg whitespace-nowrap self-start md:self-center"
        >
          <span>Start a Conversation</span>
          <ArrowUpRight size={14} />
        </Link>
      </div>
    </div>
  );
}
