"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, RefreshCw } from "lucide-react";

export default function ProjectErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="w-full min-h-[70vh] flex flex-col items-center justify-center px-6 py-20 max-w-2xl mx-auto text-center space-y-6">
      <div className="space-y-2">
        <span className="text-[10px] uppercase tracking-[0.3em] font-mono font-semibold text-neutral-400 block">
          ARCHITECTURAL ARCHIVE
        </span>
        <h1 className="font-display text-2xl sm:text-3xl font-light text-neutral-900 tracking-tight">
          Project Dossier Unavailable
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 font-light leading-relaxed max-w-md mx-auto">
          We encountered an issue preparing this project dossier. Please retry or browse our portfolio archive.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <button
          onClick={() => reset()}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-black text-white text-xs uppercase tracking-wider font-medium hover:bg-neutral-800 transition-colors"
        >
          <RefreshCw size={13} />
          <span>Reload Dossier</span>
        </button>

        <Link
          href="/projects"
          className="inline-flex items-center gap-2 px-5 py-2.5 border border-neutral-300 text-neutral-700 hover:text-black hover:border-black text-xs uppercase tracking-wider font-medium transition-colors"
        >
          <ArrowLeft size={13} />
          <span>View All Projects</span>
        </Link>
      </div>
    </div>
  );
}

