"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCMSStore } from "@/lib/cmsStore";

export default function LandingGallery() {
  const router = useRouter();
  const { projects } = useCMSStore();
  const showcaseProjects = projects.filter(
    (p) => (p.featured || p.status === "completed") && !p.mainImage.startsWith("http")
  );

  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = useCallback(() => {
    if (showcaseProjects.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % showcaseProjects.length);
  }, [showcaseProjects.length]);

  const prevSlide = useCallback(() => {
    if (showcaseProjects.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + showcaseProjects.length) % showcaseProjects.length);
  }, [showcaseProjects.length]);

  // Autoplay gallery animation every 5.5 seconds
  useEffect(() => {
    if (showcaseProjects.length === 0) return;
    const interval = setInterval(nextSlide, 5500);
    return () => clearInterval(interval);
  }, [nextSlide, showcaseProjects.length]);

  if (showcaseProjects.length === 0) return null;

  const currentProject = showcaseProjects[currentIndex];
  // Select premier high-res landscape photograph from project or fallback to mainImage
  const heroImage =
    currentProject.gallery?.find((g) => g.aspect === "full" || g.aspect === "landscape")?.url ||
    currentProject.mainImage;

  const handleImageClick = () => {
    nextSlide();
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-neutral-950 flex flex-col select-none">
      {/* 1. TOP FULL BOX — ONLY LOGO & BENGALURU · INDIA (Landing Page) */}
      <header className="relative z-30 w-full bg-white border-b border-neutral-200 px-6 sm:px-10 lg:px-16 py-3 sm:py-3.5 md:py-4 flex items-center justify-between shrink-0 shadow-xs">
        {/* Official Brand Logo + Bengaluru · India below logo */}
        <Link
          href="/home"
          onClick={(e) => e.stopPropagation()}
          className="inline-flex flex-col items-start group focus:outline-none transition-opacity hover:opacity-90"
          aria-label="Techno Architecture — Enter Studio"
        >
          <div className="relative w-48 sm:w-60 md:w-72 lg:w-80 h-9 sm:h-11 md:h-12">
            <Image
              src="/techno-brand-logo.png"
              alt="Techno Architecture"
              fill
              priority
              unoptimized
              sizes="(max-width: 768px) 260px, 380px"
              className="object-contain object-left"
            />
          </div>
          <div className="mt-1.5 sm:mt-2 text-[9px] sm:text-[10px] md:text-[11px] font-semibold tracking-[0.28em] text-neutral-900 uppercase font-heading select-none">
            {"BENGALURU \u00B7 INDIA"}
          </div>
        </Link>
      </header>

      {/* 2. HERO IMAGE SLIDER AREA — Unobstructed Full Architectural Visual */}
      <div
        onClick={handleImageClick}
        className="relative flex-1 w-full overflow-hidden bg-neutral-950 text-white cursor-pointer"
        aria-label="Click to advance to next project"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentProject.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 z-0"
          >
            <Image
              src={heroImage}
              alt={`Techno Architecture — ${currentProject.title}`}
              fill
              priority
              unoptimized
              quality={100}
              sizes="100vw"
              className="object-cover object-center select-none"
              style={{ imageRendering: "auto" }}
            />
            {/* Subtle Legibility Vignette at bottom */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/10 pointer-events-none" />
          </motion.div>
        </AnimatePresence>

        {/* 3. BOTTOM CAPTION & INTERACTIVE NAVIGATION */}
        <div className="absolute bottom-0 left-0 right-0 z-20 p-4 sm:p-6 md:p-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4 pointer-events-none">
          <div className="space-y-1 bg-black/60 backdrop-blur-md p-3.5 sm:p-4 border border-white/15 max-w-lg pointer-events-auto">
            <span className="block text-[9px] md:text-[10px] tracking-[0.3em] text-neutral-300 uppercase font-mono">
              {currentProject.category} · {currentProject.location}
            </span>
            <h2 className="font-display text-base sm:text-xl md:text-2xl tracking-[0.18em] uppercase font-light text-white">
              {currentProject.title}
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 pointer-events-auto">
            {/* Slide Index Counter */}
            <div className="text-[10px] sm:text-[11px] font-mono tracking-[0.2em] text-neutral-300 bg-black/60 backdrop-blur-md px-3 py-2 border border-white/20">
              <span className="text-white font-semibold">
                {String(currentIndex + 1).padStart(2, "0")}
              </span>
              <span className="text-neutral-500 mx-1">/</span>
              <span className="text-neutral-400">
                {String(showcaseProjects.length).padStart(2, "0")}
              </span>
            </div>

            {/* Previous slide */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                prevSlide();
              }}
              aria-label="Previous Project"
              className="p-2 sm:p-2.5 bg-black/60 hover:bg-black text-white backdrop-blur-md border border-white/20 transition-colors"
            >
              <ChevronLeft size={16} />
            </button>

            {/* Next slide */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                nextSlide();
              }}
              aria-label="Next Project"
              className="p-2 sm:p-2.5 bg-black/60 hover:bg-black text-white backdrop-blur-md border border-white/20 transition-colors"
            >
              <ChevronRight size={16} />
            </button>

            {/* Direct Project Dossier Link */}
            <Link
              href={`/projects/${currentProject.slug}`}
              onClick={(e) => e.stopPropagation()}
              className="text-[9px] sm:text-[10px] tracking-[0.25em] uppercase font-medium text-neutral-200 hover:text-white transition-colors py-2 px-3.5 bg-black/60 hover:bg-black backdrop-blur-md border border-white/20"
            >
              VIEW DOSSIER →
            </Link>

            {/* Enter Studio CTA Button */}
            <Link
              href="/home"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1.5 text-[9px] sm:text-[10px] tracking-[0.2em] uppercase font-medium text-black bg-white hover:bg-neutral-200 transition-colors py-2 px-4 shadow-sm"
            >
              <span>ENTER STUDIO</span>
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
