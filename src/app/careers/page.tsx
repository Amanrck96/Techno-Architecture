"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Mail,
  CheckCircle2,
  ArrowUpRight,
  ArrowLeft,
  Copy,
  Check,
  X,
} from "lucide-react";

export default function CareersPage() {
  const applicationEmail = "technoarchitecture@gmail.com";
  const rawSubject = "Career Application - Your Name";
  const emailSubject = encodeURIComponent(rawSubject);

  const rawTemplateBody = `Dear Techno Architecture Studio,

I am writing to submit my application for an architectural position at Techno Architecture.

Applicant Details:
- Full Name: [Your Name]
- Role Applied For: [Architect / Architectural Intern]
- Current Location: [City, Country]
- Availability: [Immediate / Notice Period]
- Portfolio: [Insert link or note attached PDF]
- CV / Resume: [Insert link or note attached PDF]

Brief Introduction:
[A brief note introducing yourself and why you value working with Techno Architecture]

Best regards,
[Your Name]
[Phone Number]`;

  const encodedBody = encodeURIComponent(rawTemplateBody);

  const gmailWebUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${applicationEmail}&su=${emailSubject}&body=${encodedBody}`;
  const outlookWebUrl = `https://outlook.office.com/mail/deeplink/compose?to=${applicationEmail}&subject=${emailSubject}&body=${encodedBody}`;
  const mailtoUrl = `mailto:${applicationEmail}?subject=${emailSubject}&body=${encodedBody}`;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsModalOpen(false);
      }
    };

    if (isModalOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isModalOpen]);

  const copyToClipboard = async (text: string, key: string) => {
    try {
      if (typeof navigator !== "undefined" && navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2500);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="w-full pt-10 sm:pt-12 md:pt-14 pb-16 px-6 sm:px-10 lg:px-16 max-w-7xl mx-auto space-y-12 sm:space-y-16">
      {/* Page Header */}
      <div className="border-b border-neutral-200 pb-6 sm:pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="max-w-3xl space-y-2">
          <span className="text-[10px] uppercase tracking-[0.3em] font-semibold text-neutral-400 block font-mono">
            JOIN OUR PRACTICE
          </span>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-light text-neutral-900 tracking-tight">
            Careers
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 font-light leading-relaxed tracking-wide pt-1">
            We welcome applications from architects and architectural interns who value thoughtful design, technical rigour and hands-on involvement from concept through execution.
          </p>
        </div>

        <Link
          href="/about#team"
          className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] font-mono font-medium text-neutral-500 hover:text-black transition-colors pb-1 shrink-0"
        >
          <ArrowLeft size={13} />
          <span>OUR STUDIO & TEAM</span>
        </Link>
      </div>

      {/* How to Apply Section */}
      <div className="space-y-8">
        {/* Section Header */}
        <div className="space-y-2 max-w-2xl">
          <span className="text-[10px] uppercase tracking-[0.25em] text-neutral-400 block font-semibold">
            SUBMISSION GUIDELINES
          </span>
          <h2 className="font-display text-2xl font-light text-neutral-900">
            How to Apply
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 font-light leading-relaxed">
            Please email{" "}
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="font-medium text-black underline underline-offset-4 hover:text-neutral-600 inline"
            >
              {applicationEmail}
            </button>{" "}
            with the subject line{" "}
            <code className="bg-neutral-100 px-2 py-0.5 text-xs text-neutral-800 font-mono">
              &ldquo;Career Application - Your Name&rdquo;
            </code>{" "}
            and include the following:
          </p>
        </div>

        {/* Two-Column Aligned Boxes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-10 items-stretch">
          {/* Left Column: Requirements checklist (md:col-span-7) */}
          <div className="md:col-span-7 flex flex-col justify-between gap-3">
            {[
              "CV or resume",
              "Selected portfolio in PDF format or as a web link",
              "A brief note introducing yourself and the role you are applying for",
              "Current location, availability and contact details",
            ].map((item, idx) => (
              <div
                key={idx}
                className="flex-1 flex items-center gap-3 p-4 bg-neutral-50 border border-neutral-200"
              >
                <CheckCircle2 size={16} className="text-neutral-900 flex-shrink-0" />
                <span className="text-xs text-neutral-800 font-normal leading-relaxed">{item}</span>
              </div>
            ))}
          </div>

          {/* Right Column: Direct Apply Card (md:col-span-5) */}
          <div className="md:col-span-5 p-8 bg-neutral-950 text-white flex flex-col justify-between">
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

            <div className="pt-6 border-t border-neutral-800 space-y-3 mt-6">
              <div className="text-[11px] font-mono text-neutral-300">
                <span className="text-neutral-500 block text-[9px] uppercase tracking-wider mb-0.5">
                  Contact Email
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(true)}
                    className="text-white hover:underline flex items-center gap-1.5"
                  >
                    <Mail size={13} className="text-neutral-400" />
                    <span>{applicationEmail}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(applicationEmail, "card-email")}
                    className="text-neutral-400 hover:text-white text-[10px] uppercase font-mono px-1.5 py-0.5 border border-neutral-800 hover:border-neutral-600 transition-colors ml-auto"
                    title="Copy email address"
                  >
                    {copiedKey === "card-email" ? "Copied" : "Copy"}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="inline-flex items-center justify-center gap-2 w-full py-3.5 px-4 bg-white text-black hover:bg-neutral-200 transition-colors text-xs uppercase tracking-[0.2em] font-medium cursor-pointer"
                >
                  <span>Draft Application Email</span>
                  <ArrowUpRight size={13} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Review Note */}
        <div className="p-4 bg-neutral-100/60 border-l-2 border-neutral-900 text-xs text-neutral-600 leading-relaxed font-light">
          Applications are reviewed according to current studio requirements. Shortlisted candidates will be contacted for the next stage.
        </div>
      </div>

      {/* Dispatch Modal */}
      {isModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-neutral-950 border border-neutral-800 text-white w-full max-w-lg p-6 sm:p-8 space-y-6 shadow-2xl relative my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 border-b border-neutral-800 pb-5">
              <div className="space-y-1">
                <span className="text-[9px] uppercase tracking-[0.25em] text-neutral-400 block font-mono">
                  DIRECT DISPATCH
                </span>
                <h3 className="font-display text-2xl font-light text-white">
                  Draft Your Application
                </h3>
                <p className="text-xs text-neutral-400 font-light">
                  Choose your email client or copy the formatted application template below.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-neutral-400 hover:text-white p-1.5 transition-colors"
                aria-label="Close dialog"
              >
                <X size={18} />
              </button>
            </div>

            {/* Application Parameters */}
            <div className="space-y-3 bg-neutral-900/60 p-4 border border-neutral-800/80 text-xs">
              <div className="flex items-center justify-between gap-2">
                <div className="font-mono text-neutral-300 truncate">
                  <span className="text-neutral-500 uppercase text-[9px] tracking-wider block">Recipient</span>
                  <span>{applicationEmail}</span>
                </div>
                <button
                  type="button"
                  onClick={() => copyToClipboard(applicationEmail, "modal-email")}
                  className="flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider text-neutral-300 hover:text-white bg-neutral-800 hover:bg-neutral-700 px-2.5 py-1 transition-colors flex-shrink-0"
                >
                  {copiedKey === "modal-email" ? (
                    <>
                      <Check size={11} className="text-emerald-400" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy size={11} />
                      <span>Copy Email</span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center justify-between gap-2 pt-2 border-t border-neutral-800/60">
                <div className="font-mono text-neutral-300 truncate">
                  <span className="text-neutral-500 uppercase text-[9px] tracking-wider block">Subject</span>
                  <span>{rawSubject}</span>
                </div>
                <button
                  type="button"
                  onClick={() => copyToClipboard(rawSubject, "modal-subject")}
                  className="flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider text-neutral-300 hover:text-white bg-neutral-800 hover:bg-neutral-700 px-2.5 py-1 transition-colors flex-shrink-0"
                >
                  {copiedKey === "modal-subject" ? (
                    <>
                      <Check size={11} className="text-emerald-400" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy size={11} />
                      <span>Copy Subject</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Launch Actions */}
            <div className="space-y-2.5">
              <span className="text-[9px] uppercase tracking-[0.2em] font-mono text-neutral-400 block">
                Open in Your Email Client
              </span>

              {/* Gmail Web */}
              <a
                href={gmailWebUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3.5 bg-white text-black hover:bg-neutral-200 transition-colors group"
              >
                <div className="space-y-0.5">
                  <div className="text-xs uppercase tracking-[0.15em] font-medium flex items-center gap-2">
                    <span>Open in Gmail (Web)</span>
                    <span className="text-[9px] font-mono bg-neutral-200 text-neutral-800 px-1.5 py-0.5">Recommended</span>
                  </div>
                  <div className="text-[11px] text-neutral-600 font-normal">
                    Launches Gmail composer in browser with pre-filled details
                  </div>
                </div>
                <ArrowUpRight size={16} className="text-black group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform flex-shrink-0" />
              </a>

              {/* Outlook Web */}
              <a
                href={outlookWebUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3.5 bg-neutral-900 border border-neutral-800 hover:border-neutral-600 transition-colors text-white group"
              >
                <div className="space-y-0.5">
                  <div className="text-xs uppercase tracking-[0.15em] font-medium">
                    Open in Outlook (Web)
                  </div>
                  <div className="text-[11px] text-neutral-400 font-light">
                    Opens Office 365 / Outlook Web composer
                  </div>
                </div>
                <ArrowUpRight size={15} className="text-neutral-400 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all flex-shrink-0" />
              </a>

              {/* Default App Mailto */}
              <a
                href={mailtoUrl}
                className="flex items-center justify-between p-3.5 bg-neutral-900 border border-neutral-800 hover:border-neutral-600 transition-colors text-white group"
              >
                <div className="space-y-0.5">
                  <div className="text-xs uppercase tracking-[0.15em] font-medium">
                    Open Default Mail Client
                  </div>
                  <div className="text-[11px] text-neutral-400 font-light">
                    Apple Mail, Outlook Desktop, or Windows Mail
                  </div>
                </div>
                <ArrowUpRight size={15} className="text-neutral-400 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all flex-shrink-0" />
              </a>
            </div>

            {/* Template Copy Section */}
            <div className="pt-2 border-t border-neutral-800">
              <button
                type="button"
                onClick={() => copyToClipboard(rawTemplateBody, "modal-template")}
                className="flex items-center justify-center gap-2 w-full py-2.5 px-3 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 hover:text-white text-xs font-mono uppercase tracking-[0.15em] transition-colors"
              >
                {copiedKey === "modal-template" ? (
                  <>
                    <Check size={13} className="text-emerald-400" />
                    <span>Application Template Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy size={13} />
                    <span>Copy Full Application Template</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
