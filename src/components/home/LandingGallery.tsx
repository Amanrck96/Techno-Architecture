"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
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

  // Autoplay gallery animation every 5 seconds
  useEffect(() => {
    if (showcaseProjects.length === 0) return;
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [nextSlide, showcaseProjects.length]);

  if (showcaseProjects.length === 0) return null;

  const currentProject = showcaseProjects[currentIndex];
  // Select premier high-res landscape photograph from project or fallback to mainImage
  const heroImage =
    currentProject.gallery?.find((g) => g.aspect === "full" || g.aspect === "landscape")?.url ||
    currentProject.mainImage;

  const handlePageClick = () => {
    router.push("/home");
  };

  return (
    <div
      onClick={handlePageClick}
      className="relative w-screen h-screen overflow-hidden bg-neutral-950 text-white cursor-pointer select-none"
      aria-label="Click to enter Techno Architecture"
    >
      {/* 1. Full-Screen Architectural Gallery Animation in Original Quality */}
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
          {/* Subtle Legibility Vignettes — Preserves 100% Original Photo Contrast & Vibrant Colors */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/25 pointer-events-none" />
        </motion.div>
      </AnimatePresence>

      {/* 2. Top-Left: Techno Architecture Logo (Exact Reference Font Style) */}
      <div className="relative z-20 w-full h-full p-8 md:p-14 lg:p-16 flex flex-col justify-between pointer-events-none">
        <div className="flex items-start justify-between">
          <Link
            href="/home"
            onClick={(e) => {
              e.stopPropagation();
            }}
            className="pointer-events-auto inline-block group focus:outline-none focus-visible:ring-2 focus-visible:ring-white rounded transition-transform duration-300 hover:scale-[1.03]"
            aria-label="Techno Architecture Logo — Click to enter second page"
          >
            {/* Logo in exact font style from reference */}
            <div className="relative w-52 sm:w-64 md:w-80 lg:w-96 h-14 sm:h-18 md:h-22 drop-shadow-2xl">
              <Image
                src="/techno-logo-white.png"
                alt="Techno Architecture"
                fill
                priority
                sizes="(max-width: 768px) 260px, 384px"
                className="object-contain object-left filter"
              />
            </div>
          </Link>

          {/* Minimal Slide Index */}
          <div className="text-[11px] font-mono tracking-[0.25em] text-neutral-300 bg-black/40 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/15">
            <span className="text-white font-semibold">
              {String(currentIndex + 1).padStart(2, "0")}
            </span>
            <span className="text-neutral-500 mx-1">/</span>
            <span className="text-neutral-400">
              {String(showcaseProjects.length).padStart(2, "0")}
            </span>
          </div>
        </div>

        {/* 3. Bottom Bar: Project Label & Direct Navigation */}
        <div className="flex items-end justify-between border-t border-white/15 pt-4 backdrop-blur-[2px]">
          <div className="space-y-0.5">
            <span className="block text-[9px] md:text-[10px] tracking-[0.3em] text-neutral-400 uppercase font-mono">
              {currentProject.category} · {currentProject.location}
            </span>
            <h2 className="font-display text-base sm:text-lg md:text-xl tracking-[0.18em] uppercase font-light text-white">
              {currentProject.title}
            </h2>
          </div>

          <Link
            href="/home"
            onClick={(e) => e.stopPropagation()}
            className="pointer-events-auto text-[10px] md:text-[11px] tracking-[0.25em] uppercase font-medium text-neutral-300 hover:text-white transition-colors py-1.5 px-3.5 rounded bg-black/40 backdrop-blur-sm border border-white/15"
          >
            Enter Studio →
          </Link>
        </div>
      </div>
    </div>
  );
}
