"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "lucide-react";

export default function HeroSection() {
  const scrollToProjects = () => {
    const el = document.getElementById("curated-projects");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative w-full h-[88vh] lg:h-[94vh] flex flex-col justify-between p-6 md:p-12 lg:p-16 overflow-hidden bg-neutral-900 text-white">
      {/* Background Architectural Visual with Subtle Pan Effect */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2400&q=90"
          alt="Techno Architecture Monolith House board-formed concrete facade"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-60 scale-105 transition-transform duration-1000 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/50" />
      </div>

      {/* Top Header Tagline */}
      <div className="relative z-10 flex justify-between items-start pt-2">
        <div className="flex flex-col">
          <span className="text-[10px] md:text-[11px] uppercase tracking-[0.35em] text-neutral-300 font-medium">
            Techno Architecture & Design Studio
          </span>
          <span className="text-[9px] uppercase tracking-[0.25em] text-neutral-400 mt-1">
            Bengaluru · Hyderabad · Dubai
          </span>
        </div>
        <div className="hidden sm:block text-right">
          <span className="text-[9px] uppercase tracking-[0.25em] text-neutral-400">
            Selected Works (2018 — 2026)
          </span>
        </div>
      </div>

      {/* Center / Lower Positioning Statement */}
      <div className="relative z-10 max-w-4xl space-y-6 my-auto">
        <h1 className="font-display text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-light tracking-tight leading-[1.12] text-white">
          Form emerges from climate, material restraint, and the timeless choreography of light.
        </h1>
        <p className="text-xs sm:text-sm text-neutral-300 max-w-2xl font-normal leading-relaxed tracking-wide">
          An architectural practice devoted to the synthesis of structural clarity, thermal mass, and crafted materiality. We design residential sanctuaries, mass timber commercial spaces, and civic enclaves engineered to endure.
        </p>
      </div>

      {/* Bottom Bar: Action CTAs & Scroll Indicator */}
      <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-white/20">
        <div className="flex items-center space-x-6 text-[10px] sm:text-[11px] tracking-[0.2em] uppercase font-medium">
          <button
            onClick={scrollToProjects}
            type="button"
            className="flex items-center gap-2 text-white hover:text-neutral-300 transition-colors py-1 group"
          >
            <span>Explore Projects</span>
            <ArrowDown size={13} className="group-hover:translate-y-0.5 transition-transform" />
          </button>
          <Link
            href="/contact"
            className="flex items-center gap-1.5 text-neutral-300 hover:text-white transition-colors py-1 group"
          >
            <span>Initiate Inquiry</span>
            <ArrowUpRight size={12} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>

        <div className="text-[9px] tracking-[0.2em] text-neutral-400 uppercase">
          Tectonic Purity · Environmental Balance
        </div>
      </div>
    </section>
  );
}
