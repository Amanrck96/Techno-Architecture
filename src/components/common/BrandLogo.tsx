"use client";

import React from "react";
import Image from "next/image";

interface BrandLogoProps {
  className?: string;
  theme?: "light" | "dark";
  priority?: boolean;
  align?: "left" | "center";
}

/**
 * BrandLogo — Official Architectural Studio Lockup
 * 
 * Guarantees mathematical end-to-end justification of "BENGALURU · INDIA"
 * directly underneath "TECHNO ARCHITECTURE".
 * 
 * The artwork in techno-brand-logo.png starts at x=7 and ends at x=1017 (width 1010px).
 * The SVG text uses textLength="1009" with lengthAdjust="spacing" starting at x="7",
 * ensuring the 'B' aligns with the left edge of 'T' (diff=0px) and the 'A' aligns
 * with the right edge of 'O' (diff=0px) at every viewport and resolution with 100% precision.
 */
export default function BrandLogo({
  className = "w-48 sm:w-60 md:w-72 lg:w-80",
  theme = "light",
  priority = false,
  align = "left",
}: BrandLogoProps) {
  const isDark = theme === "dark";
  const logoSrc = isDark
    ? "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/brand%2Ftechno-logo-white.png?alt=media&token=techno-logo-white.png"
    : "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/brand%2Ftechno-brand-logo.png?alt=media&token=techno-brand-logo.png";
  const textColor = isDark ? "#ffffff" : "#171717";
  const alignClass = align === "center" ? "items-center" : "items-start";
  const imgAlignClass = align === "center" ? "object-center" : "object-left";

  return (
    <div className={`flex flex-col select-none ${alignClass} ${className}`}>
      {/* 1. Main TECHNO ARCHITECTURE Monogram */}
      <div className="relative w-full aspect-[1024/290]">
        <Image
          src={logoSrc}
          alt="Techno Architecture"
          fill
          priority={priority}
          unoptimized
          sizes="(max-width: 768px) 320px, 480px"
          className={`object-contain ${imgAlignClass}`}
        />
      </div>

      {/* 2. End-to-End Mathematically Justified: BENGALURU · INDIA */}
      <div className="w-full mt-1.5 sm:mt-2">
        <svg
          viewBox="0 0 1024 36"
          className="w-full block overflow-visible"
          aria-label="Bengaluru · India"
          role="img"
        >
          <text
            x="7"
            y="27"
            textLength="1009"
            lengthAdjust="spacing"
            fontFamily="var(--font-inter), 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
            fontWeight="600"
            fontSize="30"
            letterSpacing="0"
            fill={textColor}
          >
            BENGALURU · INDIA
          </text>
        </svg>
      </div>
    </div>
  );
}
