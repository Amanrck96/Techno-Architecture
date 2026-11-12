"use client";

import { useEffect } from "react";

interface StudioPreloaderProps {
  forceShow?: boolean;
  onComplete?: () => void;
}

/**
 * StudioPreloader has been completely disabled and removed per user requirements.
 * Navigation is instant across all pages without preloader overlays or click interception.
 */
export default function StudioPreloader({ onComplete }: StudioPreloaderProps) {
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.body.style.overflow = "";
    }
    if (onComplete) {
      onComplete();
    }
  }, [onComplete]);

  return null;
}
