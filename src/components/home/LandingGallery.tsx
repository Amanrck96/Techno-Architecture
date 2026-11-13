"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Play, X, ArrowRight } from "lucide-react";
import BrandLogo from "@/components/common/BrandLogo";

export default function LandingGallery() {
  const router = useRouter();
  const [showVideoModal, setShowVideoModal] = useState(false);

  // Pre-load destination routes for instant 1-click opening
  useEffect(() => {
    router.prefetch("/home");
    router.prefetch("/projects");
  }, [router]);

  // Handle ESC key to close video modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowVideoModal(false);
    };
    if (showVideoModal) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showVideoModal]);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-neutral-950 flex flex-col select-none">
      {/* 1. TOP HEADER — Official Brand Identity Only */}
      <header className="relative z-30 w-full bg-white border-b border-neutral-200 px-6 sm:px-10 lg:px-16 py-3 sm:py-3.5 md:py-4 flex items-center justify-between shrink-0 shadow-xs">
        <Link
          href="/home"
          prefetch={true}
          className="inline-flex focus:outline-none transition-opacity hover:opacity-90"
          aria-label="Techno Architecture"
        >
          <BrandLogo
            priority
            className="w-48 sm:w-56 md:w-64 lg:w-72"
          />
        </Link>
      </header>

      {/* 2. EXCLUSIVE FULLSCREEN HERO (Ultra-Lightweight WebP Hero Poster) */}
      <div className="relative flex-1 w-full overflow-hidden bg-neutral-950 text-white select-none">
        {/* Optimized WebP Architectural Hero Backdrop (<150 KB) */}
        <Image
          src="/projects/aikya/elevation-east.webp"
          alt="Techno Architecture — Masterpiece Residence"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center pointer-events-none"
        />

        {/* Click anywhere on background to enter studio */}
        <Link
          href="/home"
          prefetch={true}
          className="absolute inset-0 z-10 cursor-pointer focus:outline-none"
          aria-label="Enter Techno Architecture Studio"
          title="Click to Enter Studio"
        />

        {/* Ambient Vignette & Contrast Gradients for visual elegance & readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/30 pointer-events-none" />

        {/* 3. BOTTOM CAPTION & INTERACTIVE CONTROLS */}
        <div className="absolute bottom-0 left-0 right-0 z-30 px-6 sm:px-10 lg:px-16 pb-6 sm:pb-8 lg:pb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4 pointer-events-none">
          {/* Architectural Statement / Brand Info */}
          <div className="space-y-1.5 max-w-xl pointer-events-auto">
            <span className="block text-[9px] md:text-[10px] tracking-[0.3em] text-neutral-300 uppercase font-mono drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
              CINEMATIC ARCHITECTURE · BENGALURU, INDIA
            </span>
            <h1 className="font-display text-lg sm:text-2xl md:text-3xl tracking-[0.16em] uppercase font-light text-white leading-tight drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">
              TECHNO ARCHITECTURE
            </h1>
            <p className="text-[11px] sm:text-xs text-neutral-300 tracking-wide font-light line-clamp-2 pt-0.5 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
              Architecture shaped around people, place and purpose. Thoughtful spaces balancing creativity, comfort, luxury and practical living.
            </p>
          </div>

          {/* Interactive Player Controls & CTAs */}
          <div className="relative z-50 flex flex-wrap items-center gap-2 sm:gap-2.5 pointer-events-auto">
            {/* On-Demand YouTube Film Modal Trigger (Zero background video transfer!) */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowVideoModal(true);
              }}
              title="Watch Studio Film (Streamed via YouTube)"
              aria-label="Watch Studio Film"
              className="inline-flex items-center gap-1.5 py-2.5 sm:py-3 px-3.5 sm:px-4 bg-black/70 hover:bg-black active:scale-95 text-white backdrop-blur-md border border-white/20 hover:border-white/40 transition-all cursor-pointer select-none text-[9px] sm:text-[10px] tracking-[0.22em] uppercase font-medium"
            >
              <Play size={13} className="text-amber-400 fill-amber-400" />
              <span>WATCH FILM</span>
            </button>

            {/* Explore Projects Button */}
            <Link
              href="/projects"
              prefetch={true}
              className="text-[9px] sm:text-[10px] tracking-[0.25em] uppercase font-medium text-neutral-200 hover:text-white active:scale-95 transition-all py-2.5 sm:py-3 px-3.5 sm:px-4 bg-black/70 hover:bg-black backdrop-blur-md border border-white/20 hover:border-white/40 cursor-pointer select-none inline-flex items-center justify-center"
            >
              PROJECTS
            </Link>

            {/* Explore Architecture Primary CTA */}
            <Link
              href="/home"
              prefetch={true}
              className="inline-flex items-center gap-2 text-[9px] sm:text-[10px] tracking-[0.22em] uppercase font-semibold text-black bg-white hover:bg-neutral-100 active:scale-95 transition-all py-2.5 sm:py-3 px-4 sm:px-5 shadow-xl group cursor-pointer select-none"
            >
              <span>EXPLORE ARCHITECTURE</span>
              <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>

      {/* 4. ON-DEMAND YOUTUBE FILM MODAL (Loads ONLY on user click, 0 egress bytes on initial page load) */}
      {showVideoModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-lg p-4 sm:p-8"
          onClick={() => setShowVideoModal(false)}
        >
          <div
            className="relative w-full max-w-5xl aspect-video bg-black rounded-lg overflow-hidden shadow-2xl border border-neutral-800"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setShowVideoModal(false)}
              className="absolute top-3 right-3 z-20 p-2 bg-black/80 hover:bg-black text-white rounded-full border border-white/20 transition-all cursor-pointer"
              aria-label="Close Film Modal"
            >
              <X size={18} />
            </button>
            <iframe
              src="https://www.youtube-nocookie.com/embed/9G3XbCqKq-o?autoplay=1&rel=0&modestbranding=1"
              title="Techno Architecture Studio Film"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full border-0"
            />
          </div>
        </div>
      )}
    </div>
  );
}
