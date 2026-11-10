"use client";

import React from "react";

interface StudioPreloaderProps {
  forceShow?: boolean;
  onComplete?: () => void;
}

export default function StudioPreloader({ onComplete }: StudioPreloaderProps) {
  // Render nothing to allow immediate, zero-latency access to the studio
  React.useEffect(() => {
    if (typeof document !== "undefined") {
      document.body.style.overflow = "";
    }
    if (onComplete) onComplete();
  }, [onComplete]);

  return null;
}
