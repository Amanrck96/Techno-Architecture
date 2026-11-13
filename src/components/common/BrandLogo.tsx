"use client";

import React, { useState } from "react";
import Image from "next/image";
import { TECHNO_BRAND_LOGO_DATA_URI } from "./brandLogoData";

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
 * Uses embedded TECHNO_BRAND_LOGO_DATA_URI to guarantee 0ms instant render,
 * zero network requests, and absolute immunity against HTTP 509/404/402 or offline states.
 */
export default function BrandLogo({
  className = "w-48 sm:w-60 md:w-72 lg:w-80",
  theme = "light",
  priority = false,
  align = "left",
}: BrandLogoProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const isDark = theme === "dark";
  const textColor = isDark ? "#ffffff" : "#171717";
  const alignClass = align === "center" ? "items-center" : "items-start";
  const imgAlignClass = align === "center" ? "object-center" : "object-left";

  return (
    <div className={`flex flex-col select-none ${alignClass} ${className}`}>
      {/* 1. Main TECHNO ARCHITECTURE Monogram */}
      <div className="relative w-full aspect-[1024/290] overflow-hidden">
        {!imageFailed ? (
          <Image
            src={TECHNO_BRAND_LOGO_DATA_URI}
            alt="Techno Architecture"
            fill
            priority={priority}
            unoptimized
            sizes="(max-width: 768px) 320px, 480px"
            onError={() => setImageFailed(true)}
            className={`object-contain ${imgAlignClass} ${isDark ? "brightness-0 invert" : ""}`}
          />
        ) : (
          /* Robust Vector Fallback in the improbable event of an image failure */
          <div className="w-full h-full flex items-center">
            <span
              className="text-lg sm:text-xl md:text-2xl font-bold tracking-[0.2em] uppercase"
              style={{ color: textColor }}
            >
              TECHNO ARCHITECTURE
            </span>
          </div>
        )}
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
