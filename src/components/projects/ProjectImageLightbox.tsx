"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { X, ChevronLeft, ChevronRight, Maximize2, Minimize2 } from "lucide-react";

export interface LightboxImage {
  url: string;
  caption?: string;
  aspect?: "landscape" | "portrait" | "full";
}

interface ProjectImageLightboxProps {
  images: LightboxImage[];
  currentIndex: number | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
  projectTitle: string;
  photographyCredit?: string;
}

export default function ProjectImageLightbox({
  images,
  currentIndex,
  onClose,
  onNavigate,
  projectTitle,
  photographyCredit,
}: ProjectImageLightboxProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartXRef = useRef<number | null>(null);

  const isOpen = currentIndex !== null && currentIndex >= 0 && currentIndex < images.length;
  const currentImage = isOpen ? images[currentIndex] : null;

  const handlePrev = useCallback(() => {
    if (currentIndex === null) return;
    const prev = (currentIndex - 1 + images.length) % images.length;
    onNavigate(prev);
  }, [currentIndex, images.length, onNavigate]);

  const handleNext = useCallback(() => {
    if (currentIndex === null) return;
    const next = (currentIndex + 1) % images.length;
    onNavigate(next);
  }, [currentIndex, images.length, onNavigate]);

  // Lock body scroll when lightbox is open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        handlePrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        handleNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose, handlePrev, handleNext]);

  // Fullscreen API toggle
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  // Touch swipe support
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const deltaX = touchEndX - touchStartXRef.current;
    touchStartXRef.current = null;

    if (deltaX > 50) {
      handlePrev();
    } else if (deltaX < -50) {
      handleNext();
    }
  };

  if (!isOpen || !currentImage) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between select-none animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-label={`${projectTitle} fullscreen image viewer`}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Top Bar Header */}
      <header className="relative z-20 flex items-center justify-between px-4 sm:px-8 py-4 bg-gradient-to-b from-black/80 to-transparent text-white">
        <div className="flex items-center gap-3">
          <span className="font-display tracking-[0.2em] text-xs sm:text-sm uppercase font-light text-neutral-200">
            {projectTitle}
          </span>
          <span className="text-neutral-500 font-mono text-xs">/</span>
          <span className="font-mono text-[11px] sm:text-xs text-neutral-400 tracking-wider">
            {currentIndex + 1} OF {images.length}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Toggle Fullscreen button */}
          <button
            onClick={toggleFullscreen}
            aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            className="p-2 text-neutral-400 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          >
            {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
          </button>

          {/* Close button */}
          <button
            onClick={onClose}
            aria-label="Close fullscreen image viewer"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-neutral-300 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors cursor-pointer font-mono tracking-wider"
            title="Close (Esc)"
          >
            <X size={16} />
            <span className="hidden sm:inline text-[10px] uppercase">ESC</span>
          </button>
        </div>
      </header>

      {/* Main Image Stage */}
      <main
        className="relative flex-1 flex items-center justify-center px-2 sm:px-16 md:px-24 py-2 overflow-hidden"
        onClick={(e) => {
          // If clicking backdrop directly, close
          if (e.target === e.currentTarget) {
            onClose();
          }
        }}
      >
        {/* Previous Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handlePrev();
          }}
          aria-label="Previous image"
          className="absolute left-2 sm:left-4 z-20 p-2.5 sm:p-3 text-white/70 hover:text-white bg-black/40 hover:bg-black/80 border border-white/10 hover:border-white/30 rounded-full backdrop-blur-sm transition-all duration-200 hover:scale-105 cursor-pointer shadow-lg"
          title="Previous (Left Arrow)"
        >
          <ChevronLeft size={22} />
        </button>

        {/* High Resolution Centered Image */}
        <div
          className="relative max-h-[78vh] sm:max-h-[82vh] max-w-[92vw] sm:max-w-[88vw] w-auto h-auto flex items-center justify-center"
          onClick={(e) => e.stopPropagation()}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={currentImage.url}
            alt={currentImage.caption || `${projectTitle} photo ${currentIndex + 1}`}
            className="max-h-[78vh] sm:max-h-[82vh] max-w-[92vw] sm:max-w-[88vw] object-contain shadow-2xl rounded-sm"
          />
        </div>

        {/* Next Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleNext();
          }}
          aria-label="Next image"
          className="absolute right-2 sm:right-4 z-20 p-2.5 sm:p-3 text-white/70 hover:text-white bg-black/40 hover:bg-black/80 border border-white/10 hover:border-white/30 rounded-full backdrop-blur-sm transition-all duration-200 hover:scale-105 cursor-pointer shadow-lg"
          title="Next (Right Arrow)"
        >
          <ChevronRight size={22} />
        </button>
      </main>

      {/* Bottom Bar Footer (Caption & Photography Credit) */}
      <footer className="relative z-20 px-4 sm:px-8 py-3 sm:py-4 bg-gradient-to-t from-black/90 via-black/70 to-transparent text-white space-y-1.5">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          {/* Caption */}
          <div className="flex-1">
            {currentImage.caption ? (
              <p className="text-xs sm:text-sm text-neutral-200 font-light tracking-wide leading-relaxed">
                {currentImage.caption}
              </p>
            ) : (
              <p className="text-xs text-neutral-400 font-light">
                {projectTitle} — Frame {currentIndex + 1}
              </p>
            )}
          </div>

          {/* Photography Credit */}
          {photographyCredit && (
            <div className="shrink-0 text-[10px] sm:text-[11px] font-mono tracking-wider text-neutral-400 uppercase bg-white/5 border border-white/10 px-2.5 py-1 rounded">
              Photography: <span className="text-neutral-200">{photographyCredit}</span>
            </div>
          )}
        </div>

        {/* Navigation hint */}
        <div className="text-center">
          <span className="text-[9px] uppercase tracking-[0.2em] font-mono text-neutral-500">
            Use ← → arrow keys to navigate · Esc to close
          </span>
        </div>
      </footer>
    </div>
  );
}
