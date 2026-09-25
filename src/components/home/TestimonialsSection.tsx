"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCMSStore } from "@/lib/cmsStore";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";

export default function TestimonialsSection() {
  const { testimonials } = useCMSStore();
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!testimonials || testimonials.length === 0) return null;

  const prev = () => {
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const next = () => {
    setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const current = testimonials[currentIndex];

  return (
    <section id="testimonials" className="w-full py-16 md:py-24 px-6 md:px-12 bg-white border-b border-neutral-200 scroll-mt-20">
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-12 pb-4 border-b border-neutral-200">
          <div>
            <span className="text-[10px] uppercase tracking-[0.3em] font-semibold text-neutral-900 block">
              TESTIMONIALS
            </span>
            <span className="text-xs text-neutral-500 mt-1 block tracking-wide font-light">
              Our strongest projects grow from trust, open communication and a shared commitment to quality.
            </span>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center space-x-2">
            <button
              onClick={prev}
              type="button"
              aria-label="Previous testimonial"
              className="p-2 border border-neutral-200 hover:border-black text-neutral-600 hover:text-black transition-colors rounded-full"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={next}
              type="button"
              aria-label="Next testimonial"
              className="p-2 border border-neutral-200 hover:border-black text-neutral-600 hover:text-black transition-colors rounded-full"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Testimonial Presentation */}
        <div className="relative min-h-[220px] flex flex-col justify-between">
          <div className="flex items-start gap-4">
            <Quote size={28} className="text-neutral-300 flex-shrink-0 mt-1" />
            <blockquote className="font-display text-base sm:text-xl md:text-2xl text-neutral-900 font-light leading-relaxed">
              &ldquo;{current.quote}&rdquo;
            </blockquote>
          </div>

          <div className="mt-8 pt-6 border-t border-neutral-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-black">
                {current.clientName}
              </div>
              <div className="text-[10px] tracking-wider text-neutral-500 mt-0.5">
                {current.designation} {current.company && `· ${current.company}`}
              </div>
            </div>

            <div className="text-[10px] uppercase tracking-[0.2em] text-neutral-400">
              Project:{" "}
              <Link
                href="/projects"
                className="text-black font-medium hover:underline ml-1"
              >
                {current.projectAssociated} ({current.year})
              </Link>
            </div>
          </div>
        </div>

        {/* Carousel Indicators */}
        <div className="flex justify-center space-x-2 mt-8">
          {testimonials.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-1 transition-all duration-300 ${
                idx === currentIndex ? "w-8 bg-black" : "w-2 bg-neutral-300"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
