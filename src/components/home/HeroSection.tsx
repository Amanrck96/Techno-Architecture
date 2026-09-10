"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowUpRight } from "lucide-react";
import { useCMSStore } from "@/lib/cmsStore";

export default function HeroSection() {
  const { projects } = useCMSStore();
  const showcaseProjects = projects.filter((p) => p.featured || p.status === "completed").slice(0, 5);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    if (showcaseProjects.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % showcaseProjects.length);
  }, [showcaseProjects.length]);

  const prevSlide = useCallback(() => {
    if (showcaseProjects.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + showcaseProjects.length) % showcaseProjects.length);
  }, [showcaseProjects.length]);

  // Autoplay slider every 5.5 seconds
  useEffect(() => {
    if (isPaused || showcaseProjects.length === 0) return;
    const interval = setInterval(nextSlide, 5500);
    return () => clearInterval(interval);
  }, [nextSlide, isPaused, showcaseProjects.length]);

  if (showcaseProjects.length === 0) return null;

  const currentProject = showcaseProjects[currentIndex];

  return (
    <section
      className="relative w-full h-[88vh] lg:h-[94vh] flex flex-col justify-between overflow-hidden bg-neutral-950 text-white select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-label="Techno Architecture Showcase Gallery"
    >
      {/* 1. Animated Architectural Background Slides (Studio Bomb Reference) */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentProject.id}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 z-0"
        >
          <Image
            src={currentProject.mainImage}
            alt={`Techno Architecture — ${currentProject.title}`}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          {/* Architectural Contrast Overlay */}
          <div className="absolute inset-0 bg-black/45 backdrop-brightness-95" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />
        </motion.div>
      </AnimatePresence>

      {/* 2. Top Bar: Slide Counter & Studio Reference Badge */}
      <div className="relative z-20 flex items-center justify-between p-6 md:p-10 lg:p-14">
        {/* Minimal Corner Mark */}
        <Link
          href="/"
          className="focus:outline-none focus-visible:ring-2 focus-visible:ring-white rounded"
          aria-label="Techno Architecture Home"
        >
          <div className="relative w-40 sm:w-52 md:w-60 h-10 sm:h-13 md:h-15 opacity-90 hover:opacity-100 transition-opacity">
            <Image
              src="/techno-logo-white.png"
              alt="Techno Architecture"
              fill
              priority
              sizes="(max-width: 768px) 200px, 240px"
              className="object-contain object-left"
            />
          </div>
        </Link>

        {/* Slide Counter (e.g. 01 / 04) */}
        <div className="flex items-center space-x-2 text-[11px] tracking-[0.25em] font-mono text-neutral-200 bg-black/40 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/15">
          <span className="text-white font-semibold">
            {String(currentIndex + 1).padStart(2, "0")}
          </span>
          <span className="text-neutral-500">/</span>
          <span className="text-neutral-400">
            {String(showcaseProjects.length).padStart(2, "0")}
          </span>
        </div>
      </div>

      {/* 4. Bottom Bar: Active Project Metadata & Slide Controls */}
      <div className="relative z-20 p-6 md:p-10 lg:p-14 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 border-t border-white/15 backdrop-blur-[3px]">
        {/* Active Project Title & Link */}
        <div className="space-y-1 max-w-xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentProject.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="block text-[9px] md:text-[10px] tracking-[0.3em] text-neutral-400 uppercase font-mono">
                {currentProject.category} · {currentProject.location}
              </span>
              <Link
                href={`/projects/${currentProject.slug}`}
                className="group inline-flex items-center gap-2.5 text-white hover:text-neutral-200 transition-colors mt-0.5"
              >
                <h2 className="font-display text-lg sm:text-xl md:text-2xl tracking-[0.2em] uppercase font-light">
                  {currentProject.title}
                </h2>
                <ArrowUpRight
                  size={20}
                  className="opacity-70 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all"
                />
              </Link>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Gallery Controls */}
        <div className="flex items-center space-x-4">
          {/* Progress Indicators */}
          <div className="hidden md:flex items-center space-x-2">
            {showcaseProjects.map((proj, idx) => (
              <button
                key={proj.id}
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Go to slide ${idx + 1}: ${proj.title}`}
                className={`h-1 transition-all duration-500 rounded-full ${
                  currentIndex === idx ? "w-8 bg-white" : "w-3 bg-white/35 hover:bg-white/70"
                }`}
              />
            ))}
          </div>

          {/* Prev / Next Chevrons */}
          <div className="flex items-center space-x-2">
            <button
              onClick={prevSlide}
              aria-label="Previous Project"
              type="button"
              className="p-3 rounded-full bg-black/40 hover:bg-black/70 active:scale-95 text-white transition-all backdrop-blur-md border border-white/15"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={nextSlide}
              aria-label="Next Project"
              type="button"
              className="p-3 rounded-full bg-black/40 hover:bg-black/70 active:scale-95 text-white transition-all backdrop-blur-md border border-white/15"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
