"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BrandLogo from "@/components/common/BrandLogo";

interface StudioPreloaderProps {
  forceShow?: boolean;
  onComplete?: () => void;
}

export default function StudioPreloader({ forceShow = false, onComplete }: StudioPreloaderProps) {
  const [mounted, setMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("INITIALIZING SPATIAL ARCHIVES");
  const [isExiting, setIsExiting] = useState(false);

  const finishAndExit = useCallback(() => {
    // Unlock body scroll immediately so user can scroll without delay
    if (typeof document !== "undefined") {
      document.body.style.overflow = "";
    }
    setIsExiting(true);
    if (typeof window !== "undefined") {
      try {
        sessionStorage.setItem("techno_studio_intro_seen", "true");
      } catch {
        // Fallback for private browsing
      }
    }
    setTimeout(() => {
      setIsVisible(false);
      if (onComplete) onComplete();
    }, 400);
  }, [onComplete]);

  useEffect(() => {
    setMounted(true);

    if (typeof window === "undefined") return;

    // Check query params (?intro=cinematic or ?intro=1)
    const urlParams = new URLSearchParams(window.location.search);
    const hasIntroParam = urlParams.has("intro");

    let isReload = false;
    try {
      const navEntries = performance.getEntriesByType("navigation");
      if (navEntries.length > 0) {
        const navEntry = navEntries[0] as PerformanceNavigationTiming;
        isReload = navEntry.type === "reload";
      }
    } catch {
      isReload = false;
    }

    let hasSeenIntro = false;
    try {
      hasSeenIntro = sessionStorage.getItem("techno_studio_intro_seen") === "true";
    } catch {
      hasSeenIntro = false;
    }

    // Play if forced, has ?intro param, is a page reload, or has not been seen yet in this session
    if (forceShow || hasIntroParam || isReload || !hasSeenIntro) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
      return;
    }

    // Lock body scroll momentarily while preloader is active
    document.body.style.overflow = "hidden";

    // Fast, ultra-snappy cinematic progress counter (~480ms total duration)
    const startTime = Date.now();
    const duration = 480; // Rapid ~480ms

    // Safety watchdog: Guarantees exit after max 850ms under any browser throttling condition
    const safetyTimer = setTimeout(() => {
      clearInterval(timer);
      finishAndExit();
    }, 850);

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.floor((elapsed / duration) * 100));
      setProgress(pct);

      if (pct < 35) {
        setStatusText("INITIALIZING SPATIAL ARCHIVES · BENGALURU");
      } else if (pct < 70) {
        setStatusText("CALIBRATING LIGHT, VOLUME & MATERIALITY");
      } else if (pct < 100) {
        setStatusText("LOADING TECHNO ARCHITECTURE");
      } else {
        setStatusText("READY");
        clearInterval(timer);
        clearTimeout(safetyTimer);
        // Snappy 80ms pause at 100% before smooth shutter wipe
        setTimeout(() => {
          finishAndExit();
        }, 80);
      }
    }, 16);

    // Keyboard shortcut to skip immediately (ESC or Space)
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === " ") {
        clearInterval(timer);
        clearTimeout(safetyTimer);
        finishAndExit();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      clearInterval(timer);
      clearTimeout(safetyTimer);
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [forceShow, finishAndExit]);

  // Clean up body scroll lock on unmount
  useEffect(() => {
    if (!isVisible) {
      document.body.style.overflow = "";
    }
  }, [isVisible]);

  if (!mounted || !isVisible) return null;

  return (
    <AnimatePresence>
      {!isExiting ? (
        <motion.div
          key="techno-studio-preloader"
          initial={{ opacity: 1, y: 0 }}
          exit={{
            y: "-100%",
            transition: {
              duration: 0.45,
              ease: [0.76, 0, 0.24, 1], // Architectural shutter ease
            },
          }}
          className="fixed inset-0 z-[999999] bg-neutral-950 text-white flex flex-col justify-between p-6 sm:p-10 lg:p-14 select-none overflow-hidden cursor-pointer"
          onClick={finishAndExit}
          title="Click anywhere to skip"
          role="dialog"
          aria-label="Studio Opening Sequence"
        >
          {/* Subtle Ambient Vignette & Subtle Drafting Grid Lines */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.04)_0%,transparent_70%)] pointer-events-none" />
          <div className="absolute inset-x-8 top-1/2 -translate-y-1/2 h-[1px] bg-white/[0.04] pointer-events-none" />
          <div className="absolute inset-y-8 left-1/2 -translate-x-1/2 w-[1px] bg-white/[0.04] pointer-events-none" />

          {/* 1. TOP TELEMETRY BAR & DRAFTING CORNER TICKS */}
          <div className="relative z-10 w-full flex items-start justify-between text-[9px] sm:text-[10px] md:text-[11px] font-mono tracking-[0.25em] text-neutral-400 uppercase">
            <div className="flex items-center gap-2">
              <span className="text-white/40 font-mono">+</span>
              <span className="font-medium text-neutral-200">TECHNO ARCHITECTURE</span>
              <span className="text-neutral-600 hidden sm:inline">·</span>
              <span className="hidden sm:inline text-neutral-400">EST. 2006</span>
            </div>

            <div className="flex items-center gap-2 text-right">
              <span className="hidden md:inline text-neutral-400">12.9345° N, 77.5698° E</span>
              <span className="hidden md:inline text-neutral-600">·</span>
              <span className="text-neutral-300">BENGALURU, INDIA</span>
              <span className="text-white/40 font-mono">+</span>
            </div>
          </div>

          {/* 2. CENTERPIECE — LOGO REVEAL & PROGRESS ANIMATION */}
          <div className="relative z-10 my-auto flex flex-col items-center justify-center text-center max-w-2xl mx-auto w-full px-4">
            {/* The 4K White Brand Logo Reveal */}
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{
                opacity: progress > 10 ? 1 : progress / 10,
                y: progress > 10 ? 0 : 10 - (progress / 10) * 10,
                scale: 0.98 + (progress / 100) * 0.02,
              }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-[320px] sm:max-w-[440px] md:max-w-[500px] mb-8 sm:mb-10"
            >
              <BrandLogo
                theme="dark"
                priority
                align="center"
                className="w-full drop-shadow-[0_0_24px_rgba(255,255,255,0.1)]"
              />
            </motion.div>

            {/* Precision 1px Architectural Loading Line */}
            <div className="w-full max-w-[280px] sm:max-w-[360px] h-[1px] bg-neutral-800 relative overflow-hidden mb-3.5">
              <motion.div
                className="h-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.6)]"
                style={{ width: `${progress}%` }}
                transition={{ ease: "easeOut" }}
              />
            </div>

            {/* Dynamic Counter & Status telemetry */}
            <div className="w-full max-w-[280px] sm:max-w-[360px] flex items-center justify-between text-[9px] sm:text-[10px] font-mono tracking-[0.2em] text-neutral-400">
              <span className="truncate pr-2 text-neutral-500">{statusText}</span>
              <span className="text-neutral-200 font-medium tabular-nums shrink-0">
                {progress.toString().padStart(2, "0")}%
              </span>
            </div>
          </div>

          {/* 3. BOTTOM BAR — PHILOSOPHY STATEMENT & SKIP ACTION */}
          <div className="relative z-10 w-full flex items-end justify-between text-[9px] sm:text-[10px] md:text-[11px] font-mono tracking-[0.2em] text-neutral-400 uppercase pt-4 border-t border-white/[0.06]">
            <div className="flex items-center gap-2">
              <span className="text-white/40 font-mono">+</span>
              <span className="text-neutral-400 font-light hidden sm:inline">
                PEOPLE · PLACE · PURPOSE · SUSTAINABILITY
              </span>
              <span className="text-neutral-400 font-light sm:hidden">
                PEOPLE · PLACE · PURPOSE
              </span>
            </div>

            {/* Interactive Skip Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                finishAndExit();
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/5 hover:bg-white/15 border border-white/15 hover:border-white/30 text-neutral-200 hover:text-white transition-all text-[9px] sm:text-[10px] font-mono tracking-[0.2em] uppercase rounded-xs cursor-pointer"
              aria-label="Skip introduction"
            >
              <span>SKIP</span>
              <span className="text-neutral-500 text-[8px]">[ESC]</span>
            </button>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
