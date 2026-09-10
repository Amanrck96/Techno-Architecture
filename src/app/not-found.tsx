import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="w-full min-h-[70vh] flex flex-col items-center justify-center text-center px-6 py-20 space-y-6">
      <span className="text-[10px] font-mono uppercase tracking-[0.35em] text-neutral-400">
        ERROR 404 / VOID
      </span>
      <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-light text-neutral-900 tracking-tight">
        Spatial Coordinate Not Found
      </h1>
      <p className="text-xs sm:text-sm text-neutral-500 max-w-md mx-auto leading-relaxed font-light">
        The architectural record or drawing set you are attempting to access has either transitioned to another index or does not exist within our digital archive.
      </p>
      <div className="pt-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-medium bg-black text-white px-6 py-3 hover:bg-neutral-800 transition-colors"
        >
          <ArrowLeft size={13} />
          <span>Return to Studio Home</span>
        </Link>
      </div>
    </div>
  );
}
