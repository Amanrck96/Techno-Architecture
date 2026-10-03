"use client";

import React from "react";
import Link from "next/link";
import { Mail, CheckCircle2, ArrowUpRight, ArrowLeft } from "lucide-react";

export default function CareersPage() {
  const applicationEmail = "technoarchitecture@gmail.com";
  const emailSubject = encodeURIComponent("Career Application - Your Name");

  return (
    <div className="w-full py-10 md:py-16 px-6 md:px-12 lg:px-16 max-w-5xl mx-auto space-y-16">
      {/* Breadcrumb / Top Link */}
      <div className="border-b border-neutral-200 pb-4">
        <Link
          href="/about#team"
          className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] font-medium text-neutral-500 hover:text-black transition-colors"
        >
          <ArrowLeft size={13} />
          <span>OUR STUDIO & TEAM</span>
        </Link>
      </div>

      {/* Page Header */}
      <div className="border-b border-neutral-200 pb-8 space-y-3">
        <span className="text-[10px] uppercase tracking-[0.3em] font-semibold text-neutral-400 block font-mono">
          JOIN OUR PRACTICE
        </span>
        <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-light text-neutral-900 tracking-tight">
          Careers
        </h1>
        <p className="text-sm md:text-base text-neutral-700 max-w-2xl font-light leading-relaxed pt-2">
          We welcome applications from architects and architectural interns who value thoughtful design, technical rigour and hands-on involvement from concept through execution.
        </p>
      </div>

      {/* How to Apply Section */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
        {/* Left Column: Requirements checklist (md:col-span-7) */}
        <div className="md:col-span-7 space-y-6">
          <div className="space-y-2">
            <span className="text-[10px] uppercase tracking-[0.25em] text-neutral-400 block font-semibold">
              SUBMISSION GUIDELINES
            </span>
            <h2 className="font-display text-2xl font-light text-neutral-900">
              How to Apply
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 font-light leading-relaxed">
              Please email{" "}
              <a
                href={`mailto:${applicationEmail}?subject=${emailSubject}`}
                className="font-medium text-black underline underline-offset-4 hover:text-neutral-600"
              >
                {applicationEmail}
              </a>{" "}
              with the subject line{" "}
              <code className="bg-neutral-100 px-2 py-0.5 text-xs text-neutral-800 font-mono">
                &ldquo;Career Application - Your Name&rdquo;
              </code>{" "}
              and include the following:
            </p>
          </div>

          <div className="space-y-3 pt-2">
            {[
              "CV or resume",
              "Selected portfolio in PDF format or as a web link",
              "A brief note introducing yourself and the role you are applying for",
              "Current location, availability and contact details",
            ].map((item, idx) => (
              <div key={idx} className="flex items-start gap-3 p-4 bg-neutral-50 border border-neutral-200">
                <CheckCircle2 size={16} className="text-neutral-900 flex-shrink-0 mt-0.5" />
                <span className="text-xs text-neutral-800 font-normal leading-relaxed">{item}</span>
              </div>
            ))}
          </div>

          <div className="p-4 bg-neutral-100/60 border-l-2 border-neutral-900 text-xs text-neutral-600 leading-relaxed font-light">
            Applications are reviewed according to current studio requirements. Shortlisted candidates will be contacted for the next stage.
          </div>
        </div>

        {/* Right Column: Direct Apply Card (md:col-span-5) */}
        <div className="md:col-span-5 p-8 bg-neutral-950 text-white space-y-6">
          <div className="space-y-2">
            <span className="text-[9px] uppercase tracking-[0.25em] text-neutral-400 block font-mono">
              DIRECT DISPATCH
            </span>
            <h3 className="font-display text-xl font-light text-white">
              Send Your Portfolio
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed font-light">
              We look forward to reviewing your architectural work, design curiosity, and spatial thinking.
            </p>
          </div>

          <div className="pt-4 border-t border-neutral-800 space-y-3">
            <div className="text-[11px] font-mono text-neutral-300">
              <span className="text-neutral-500 block text-[9px] uppercase tracking-wider mb-0.5">Contact Email</span>
              <a
                href={`mailto:${applicationEmail}?subject=${emailSubject}`}
                className="text-white hover:underline flex items-center gap-1.5"
              >
                <Mail size={13} className="text-neutral-400" />
                <span>{applicationEmail}</span>
              </a>
            </div>

            <div className="pt-2">
              <a
                href={`mailto:${applicationEmail}?subject=${emailSubject}`}
                className="inline-flex items-center justify-center gap-2 w-full py-3.5 px-4 bg-white text-black hover:bg-neutral-200 transition-colors text-xs uppercase tracking-[0.2em] font-medium"
              >
                <span>Draft Application Email</span>
                <ArrowUpRight size={13} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
