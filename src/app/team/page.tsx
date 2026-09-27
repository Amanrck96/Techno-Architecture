"use client";

import React from "react";
import Link from "next/link";
import { useCMSStore } from "@/lib/cmsStore";
import { initialTeam } from "@/data/team";
import { Instagram, ArrowUpRight, Compass, Award, GraduationCap, Building2 } from "lucide-react";

export default function TeamPage() {
  const { team } = useCMSStore();

  // Keep exclusively Rajesh Shivaram details
  const rajesh =
    team.find((m) => m.name.toLowerCase().includes("rajesh")) ||
    initialTeam[0];

  return (
    <div className="w-full py-10 md:py-16 px-6 md:px-12 lg:px-16 max-w-7xl mx-auto space-y-16">
      {/* Page Header */}
      <div className="border-b border-neutral-200 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="text-[10px] uppercase tracking-[0.3em] font-semibold text-neutral-400 block font-mono">
            PRACTICE LEADERSHIP · STUDIO TEAM
          </span>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-light text-neutral-900 tracking-tight mt-2">
            Our Team
          </h1>
          <p className="text-xs sm:text-sm text-neutral-600 max-w-2xl mt-3 tracking-wide font-light leading-relaxed">
            Techno Architecture is an architecture and design practice led by Principal Architect Rajesh Shivaram. Combining design exploration with practical problem-solving, our studio creates buildings and interiors that are clear in concept, comfortable to use and responsive to their environment.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/contact"
            className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] font-medium bg-black text-white px-5 py-2.5 hover:bg-neutral-800 transition-colors whitespace-nowrap"
          >
            <span>Start a Project</span>
            <ArrowUpRight size={12} />
          </Link>
        </div>
      </div>

      {/* Leadership Profile: Rajesh Shivaram (No Photos, High-End Architectural Layout) */}
      <section className="border border-neutral-200 bg-white p-8 sm:p-12 lg:p-16 space-y-12">
        {/* Top Eyebrow & Status */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-8 border-b border-neutral-200 gap-4">
          <div className="space-y-1">
            <span className="text-[9.5px] font-mono uppercase tracking-[0.25em] text-neutral-400 block">
              01 / PRACTICE LEADERSHIP
            </span>
            <span className="text-xs font-mono uppercase tracking-widest text-neutral-500">
              LEADERSHIP & PRINCIPAL ARCHITECTURE
            </span>
          </div>

          {/* Socials / Direct Link */}
          {rajesh.socials && rajesh.socials.length > 0 && (
            <div className="flex items-center gap-3">
              {rajesh.socials.map((s, idx) => (
                <a
                  key={idx}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-medium text-neutral-700 hover:text-black border border-neutral-300 hover:border-black px-4 py-2 transition-colors"
                >
                  <Instagram size={14} />
                  <span>Follow @technoarchitecture_rajesh</span>
                  <ArrowUpRight size={12} />
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Identity & Credentials */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          <div className="lg:col-span-5 space-y-4">
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-light text-neutral-900 tracking-tight">
              {rajesh.name}
            </h2>
            <div className="space-y-1.5">
              <p className="text-sm font-medium uppercase tracking-wider text-black">
                {rajesh.role}
              </p>
              <p className="text-xs text-neutral-500 font-mono tracking-wide">
                {rajesh.credentials}
              </p>
            </div>
            <div className="pt-2">
              <span className="inline-block text-[9px] uppercase tracking-[0.2em] font-mono bg-neutral-100 text-neutral-700 px-3 py-1 border border-neutral-200">
                PRACTICE BASE: BASAVANAGUDI, BENGALURU · EST. 2006
              </span>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-6 text-neutral-700 leading-relaxed font-light text-sm md:text-base border-l border-neutral-200 pl-6 lg:pl-10">
            <p className="text-neutral-900 font-normal">
              {rajesh.bio}
            </p>
            <p>
              Our work is shaped through dialogue. We listen carefully, study the site and translate each client&apos;s priorities into a design that feels personal while remaining technically sound and buildable.
            </p>
            <p>
              Under Rajesh&apos;s direction, Techno Architecture provides an end-to-end approach in which architecture, interiors, structural planning and execution support are coordinated together. This continuity reduces fragmented decisions and keeps each completed commission cohesive from its boldest architectural forms down to its finest bespoke details.
            </p>
          </div>
        </div>

        {/* Key Architectural Practice Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-6 border-t border-neutral-200">
          <div className="p-5 bg-neutral-50 border border-neutral-100 space-y-2">
            <div className="flex items-center gap-2 text-neutral-500">
              <GraduationCap size={16} />
              <span className="text-[9px] font-mono uppercase tracking-widest text-neutral-400">
                EDUCATION
              </span>
            </div>
            <h3 className="text-xs font-semibold text-neutral-900 uppercase tracking-wider">
              B.Arch Graduate
            </h3>
            <p className="text-xs text-neutral-600 font-light leading-relaxed">
              Bangalore Institute of Technology, grounding the studio in structural clarity and design exploration.
            </p>
          </div>

          <div className="p-5 bg-neutral-50 border border-neutral-100 space-y-2">
            <div className="flex items-center gap-2 text-neutral-500">
              <Award size={16} />
              <span className="text-[9px] font-mono uppercase tracking-widest text-neutral-400">
                EXPERIENCE
              </span>
            </div>
            <h3 className="text-xs font-semibold text-neutral-900 uppercase tracking-wider">
              20 Years Practice
            </h3>
            <p className="text-xs text-neutral-600 font-light leading-relaxed">
              Two decades of continuous architectural practice leading bespoke residential, commercial and civic projects.
            </p>
          </div>

          <div className="p-5 bg-neutral-50 border border-neutral-100 space-y-2">
            <div className="flex items-center gap-2 text-neutral-500">
              <Building2 size={16} />
              <span className="text-[9px] font-mono uppercase tracking-widest text-neutral-400">
                ESTABLISHED
              </span>
            </div>
            <h3 className="text-xs font-semibold text-neutral-900 uppercase tracking-wider">
              2006 · Basavanagudi
            </h3>
            <p className="text-xs text-neutral-600 font-light leading-relaxed">
              Founded in heritage Basavanagudi, Bengaluru, creating enduring contextual architecture across South India.
            </p>
          </div>

          <div className="p-5 bg-neutral-50 border border-neutral-100 space-y-2">
            <div className="flex items-center gap-2 text-neutral-500">
              <Compass size={16} />
              <span className="text-[9px] font-mono uppercase tracking-widest text-neutral-400">
                APPROACH
              </span>
            </div>
            <h3 className="text-xs font-semibold text-neutral-900 uppercase tracking-wider">
              End-to-End Delivery
            </h3>
            <p className="text-xs text-neutral-600 font-light leading-relaxed">
              Integrated architecture, interior detailing, material prototyping and complete site execution support.
            </p>
          </div>
        </div>
      </section>

      {/* Studio Team & Careers Banner */}
      <div className="p-8 md:p-12 border border-neutral-200 bg-neutral-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <span className="text-[10px] uppercase tracking-[0.25em] text-neutral-400 block font-semibold font-mono">
            STUDIO TEAM & CULTURE
          </span>
          <h3 className="font-display text-xl sm:text-2xl font-light text-neutral-900 mt-1">
            Join Our Studio
          </h3>
          <p className="text-xs sm:text-sm text-neutral-600 mt-2 max-w-2xl leading-relaxed font-light">
            Every project is developed through teamwork. Architects and designers contribute across research, planning, visualisation, documentation, material development and site coordination, allowing ideas to be tested at every stage.
          </p>
        </div>
        <Link
          href="/careers"
          className="text-xs uppercase tracking-[0.2em] font-medium bg-black text-white px-6 py-3.5 hover:bg-neutral-800 transition-colors whitespace-nowrap"
        >
          View Careers and Apply
        </Link>
      </div>
    </div>
  );
}
