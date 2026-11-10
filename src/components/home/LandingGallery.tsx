"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { Volume2, VolumeX, ArrowRight } from "lucide-react";
import BrandLogo from "@/components/common/BrandLogo";

export default function LandingGallery() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);

  // Guarantee continuous autoplay loop on mount with standard browser policy compliance (muted)
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Autoplay policy fallback
      });
    }
  }, []);

  // Toggle Mute / Unmute
  const toggleMute = useCallback((e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;

    const nextMuted = !video.muted;
    video.muted = nextMuted;
    setIsMuted(nextMuted);
  }, []);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-neutral-950 flex flex-col select-none">
      {/* 1. TOP HEADER — Official Brand Identity + Instant Studio Entry */}
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

        {/* Enter Studio Button in Top Header */}
        <Link
          href="/home"
          prefetch={true}
          className="inline-flex items-center gap-2 text-[9px] sm:text-[10px] md:text-[11px] font-medium tracking-[0.22em] uppercase text-neutral-800 hover:text-black transition-all px-3 sm:px-4 py-1.5 sm:py-2 border border-neutral-300 hover:border-black bg-neutral-50 hover:bg-white shrink-0 group cursor-pointer"
        >
          <span>ENTER STUDIO</span>
          <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
        </Link>
      </header>

      {/* 2. EXCLUSIVE FULLSCREEN VIDEO HERO (Continuous Ambient Background Loop) */}
      <div className="relative flex-1 w-full overflow-hidden bg-neutral-950 text-white select-none">
        <video
          ref={videoRef}
          src={process.env.NEXT_PUBLIC_HERO_VIDEO_URL || "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/media%2Fvideos%2Fbrindavan.mp4?alt=media&token=7fa378f0-ee17-4056-addf-a7c94fe86b93"}
          poster="/projects/aikya/elevation-east.jpg"
          autoPlay
          loop
          muted={isMuted}
          playsInline
          preload="metadata"
          className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
        />

        {/* Click anywhere on the video hero to enter the studio instantly */}
        <Link
          href="/home"
          prefetch={true}
          className="absolute inset-0 z-10 cursor-pointer focus:outline-none"
          aria-label="Enter Techno Architecture Studio"
          title="Click to Enter Studio"
        />

        {/* Ambient Vignette & Contrast Gradients for visual elegance & readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/30 pointer-events-none" />

        {/* 3. BOTTOM CAPTION & INTERACTIVE CONTROLS — Matching px-6 sm:px-10 lg:px-16 Grid Alignment */}
        <div className="absolute bottom-0 left-0 right-0 z-20 px-6 sm:px-10 lg:px-16 pb-6 sm:pb-8 lg:pb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4 pointer-events-none">
          {/* Architectural Statement / Brand Info — Flush Left Aligned with Top Logo */}
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
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 pointer-events-auto">
            {/* Audio Toggle Button (Symbol Only) */}
            <button
              type="button"
              onClick={toggleMute}
              title={isMuted ? "Unmute Audio" : "Mute Audio"}
              aria-label={isMuted ? "Unmute Audio" : "Mute Audio"}
              className="p-2.5 sm:p-3 bg-black/60 hover:bg-black text-white backdrop-blur-md border border-white/20 hover:border-white/40 transition-colors flex items-center justify-center cursor-pointer"
            >
              {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>

            {/* Explore Projects Button */}
            <Link
              href="/projects"
              prefetch={true}
              className="text-[9px] sm:text-[10px] tracking-[0.25em] uppercase font-medium text-neutral-200 hover:text-white transition-colors py-2.5 sm:py-3 px-3.5 sm:px-4 bg-black/60 hover:bg-black backdrop-blur-md border border-white/20 hover:border-white/40"
            >
              PROJECTS
            </Link>

            {/* Enter Studio Primary CTA — Instant Studio Entrance */}
            <Link
              href="/home"
              prefetch={true}
              className="inline-flex items-center gap-2 text-[9px] sm:text-[10px] tracking-[0.22em] uppercase font-semibold text-black bg-white hover:bg-neutral-200 transition-colors py-2.5 sm:py-3 px-4 sm:px-5 shadow-lg group cursor-pointer"
            >
              <span>ENTER STUDIO</span>
              <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
