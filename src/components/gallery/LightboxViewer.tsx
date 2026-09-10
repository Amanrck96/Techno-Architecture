"use client";

import React, { useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { GalleryItem } from "@/data/gallery";
import { X, ChevronLeft, ChevronRight, ArrowUpRight } from "lucide-react";

interface LightboxViewerProps {
  items: GalleryItem[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onSelectIndex: (index: number) => void;
}

export default function LightboxViewer({
  items,
  currentIndex,
  isOpen,
  onClose,
  onSelectIndex,
}: LightboxViewerProps) {
  const current = items[currentIndex];

  const handlePrev = useCallback(() => {
    onSelectIndex((currentIndex - 1 + items.length) % items.length);
  }, [currentIndex, items.length, onSelectIndex]);

  const handleNext = useCallback(() => {
    onSelectIndex((currentIndex + 1) % items.length);
  }, [currentIndex, items.length, onSelectIndex]);

  // Keyboard controls: ArrowLeft, ArrowRight, Escape
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handlePrev, handleNext, onClose]);

  // Lock scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen || !current) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Architectural image lightbox"
      className="fixed inset-0 z-[100] bg-neutral-950/95 backdrop-blur-md flex flex-col justify-between p-4 sm:p-8 select-none text-white animate-fadeIn"
    >
      {/* Top Header Bar */}
      <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
        <div className="flex items-center space-x-4">
          <span className="text-[10px] font-mono tracking-widest text-neutral-400">
            {String(currentIndex + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
          </span>
          <span className="text-[10px] uppercase tracking-[0.25em] text-neutral-300 hidden sm:inline">
            {current.category}
          </span>
        </div>

        <div className="flex items-center space-x-4">
          <Link
            href={`/projects/${current.projectSlug}`}
            className="text-[10px] uppercase tracking-[0.2em] text-neutral-300 hover:text-white flex items-center gap-1 transition-colors"
          >
            <span>View Case Study</span>
            <ArrowUpRight size={13} />
          </Link>
          <button
            onClick={onClose}
            type="button"
            aria-label="Close Lightbox"
            className="p-1.5 text-neutral-400 hover:text-white transition-colors rounded-full hover:bg-neutral-800"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Center Image Container */}
      <div className="relative flex-grow flex items-center justify-center my-4 overflow-hidden">
        {/* Previous Button */}
        <button
          onClick={handlePrev}
          type="button"
          aria-label="Previous Image"
          className="absolute left-2 sm:left-4 z-20 p-3 bg-neutral-900/60 hover:bg-neutral-800 text-white rounded-full transition-colors backdrop-blur-sm"
        >
          <ChevronLeft size={20} />
        </button>

        {/* Image */}
        <div className="relative w-full h-full max-h-[78vh] flex items-center justify-center">
          <Image
            src={current.imageUrl}
            alt={current.title}
            fill
            sizes="90vw"
            priority
            className="object-contain"
          />
        </div>

        {/* Next Button */}
        <button
          onClick={handleNext}
          type="button"
          aria-label="Next Image"
          className="absolute right-2 sm:right-4 z-20 p-3 bg-neutral-900/60 hover:bg-neutral-800 text-white rounded-full transition-colors backdrop-blur-sm"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Bottom Caption & Project Attribution */}
      <div className="border-t border-neutral-800 pt-3 flex flex-col sm:flex-row justify-between items-start sm:items-center text-xs text-neutral-400 gap-2">
        <div>
          <h3 className="text-xs uppercase tracking-[0.2em] font-medium text-white">
            {current.title} — {current.projectTitle}
          </h3>
          <p className="text-[11px] text-neutral-400 mt-0.5">{current.caption}</p>
        </div>
        <div className="text-[10px] uppercase font-mono tracking-widest text-neutral-500">
          {current.location} · {current.year}
        </div>
      </div>
    </div>
  );
}
