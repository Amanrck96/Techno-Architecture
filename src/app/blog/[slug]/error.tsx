"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, RefreshCw } from "lucide-react";

export default function BlogError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Monograph route error caught:", error);
  }, [error]);

  return (
    <div className="w-full min-h-[65vh] flex flex-col items-center justify-center px-6 py-20 text-center">
      <div className="max-w-md space-y-5">
        <span className="text-[10px] uppercase tracking-[0.3em] font-mono text-neutral-400 font-semibold block">
          MONOGRAPH ARCHIVE
        </span>
        <h1 className="font-display text-2xl sm:text-3xl font-light text-neutral-900 tracking-tight">
          Unable to Open Monograph
        </h1>
        <p className="text-xs sm:text-sm text-neutral-600 font-light leading-relaxed">
          The requested architectural essay or research monograph could not be displayed. You can try refreshing or browse all monographs in the archive.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
          <button
            onClick={() => reset()}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-black text-white text-[11px] uppercase tracking-widest font-medium hover:bg-neutral-800 transition-colors shadow-xs cursor-pointer"
          >
            <RefreshCw size={13} />
            <span>Try Again</span>
          </button>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-5 py-2.5 border border-neutral-300 text-neutral-800 text-[11px] uppercase tracking-widest font-medium hover:border-black hover:text-black transition-colors bg-white shadow-xs"
          >
            <ArrowLeft size={13} />
            <span>All Monographs</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

