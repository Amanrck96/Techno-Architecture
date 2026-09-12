import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export const metadata = {
  title: "About Us | Studio Vision, Mission & Ethics",
  description:
    "Learn about Techno's architectural vision, core ethos, leadership, and our commitment to contextual permanence and low-embodied carbon design.",
};

export default function AboutPage() {
  return (
    <div className="w-full py-10 md:py-16 px-6 md:px-12 lg:px-16 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="border-b border-neutral-200 pb-6 mb-12">
        <span className="text-[10px] uppercase tracking-[0.3em] font-semibold text-neutral-400 block">
          ABOUT TECHNO
        </span>
        <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-light text-neutral-900 tracking-tight mt-2">
          An architectural practice grounded in empathy, formal restraint, and material permanence.
        </h1>
      </div>

      {/* Main Full-Bleed Editorial Visual */}
      <div className="relative w-full aspect-[21/9] sm:aspect-[16/7] bg-neutral-100 overflow-hidden mb-16">
        <Image
          src="/projects/salut/salut-terrace-bar-screening-ambience.jpg"
          alt="SALUT Hospitality Architecture and Biophilic Design by Techno"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute bottom-4 right-4 bg-black/70 text-white text-[9px] uppercase tracking-[0.2em] px-3 py-1 backdrop-blur-sm">
          SALUT Gastro-Lounge, Bengaluru
        </div>
      </div>

      {/* Editorial Dual-Column Spatial Narrative (Inspired by studiobomb.in About Layout) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16 pb-16 border-b border-neutral-200">
        {/* Left Column: Leadership & Key Credits (md:col-span-4) */}
        <div className="md:col-span-4 space-y-8 text-xs text-neutral-800">
          <div>
            <span className="text-[10px] uppercase tracking-[0.25em] text-neutral-400 block mb-1">
              FOUNDER & PRINCIPAL ARCHITECT
            </span>
            <p className="font-medium text-sm text-black">Ar. Rajeshwari Menon</p>
            <p className="text-neutral-500 text-[11px] mt-0.5">M.Arch (AA London), B.Arch (SPA Delhi), IIA</p>
          </div>

          <div>
            <span className="text-[10px] uppercase tracking-[0.25em] text-neutral-400 block mb-1">
              PARTNER & DIRECTOR OF URBANISM
            </span>
            <p className="font-medium text-sm text-black">Vikramaditya Shenoy</p>
            <p className="text-neutral-500 text-[11px] mt-0.5">M.Sc Urbanism (TU Delft), B.Arch</p>
          </div>

          <div>
            <span className="text-[10px] uppercase tracking-[0.25em] text-neutral-400 block mb-1">
              DIRECTOR OF INTERIOR ARCHITECTURE
            </span>
            <p className="font-medium text-sm text-black">Divya Raghavan</p>
            <p className="text-neutral-500 text-[11px] mt-0.5">M.Des Spatial Design (Milano)</p>
          </div>

          <div className="pt-4 border-t border-neutral-100">
            <span className="text-[10px] uppercase tracking-[0.25em] text-neutral-400 block mb-2">
              STUDIO LOCATIONS
            </span>
            <p className="text-neutral-600">Bengaluru Headquarters (Basavanagudi)</p>
            <p className="text-neutral-600 mt-1">Hyderabad Regional Studio (Jubilee Hills)</p>
            <p className="text-neutral-600 mt-1">Dubai International Liaison (d3)</p>
          </div>

          <div className="pt-2">
            <Link
              href="/team"
              className="inline-flex items-center gap-1 text-[10px] uppercase tracking-[0.2em] font-semibold text-black hover:underline"
            >
              MEET FULL 18-MEMBER STUDIO →
            </Link>
          </div>
        </div>

        {/* Right Column: Editorial Narrative & Manifesto (md:col-span-8) */}
        <div className="md:col-span-8 space-y-6 text-sm md:text-base leading-relaxed text-neutral-700 font-light">
          <p className="text-base md:text-lg text-neutral-900 leading-relaxed font-normal">
            Techno was founded in 2016 in Bengaluru with a singular imperative: to create an architecture of uncompromising formal simplicity, structural honesty, and deep contextual resonance.
          </p>
          <p>
            Our work is an ongoing dialogue between the geological memory of a place and contemporary spatial life. Every commission—whether a serene desert residence in the United Arab Emirates or a mass-timber bio-campus in southern India—is approached without preconceived stylistic formulas. Instead, we begin with the physics of the site: the angle of equatorial solar radiation, prevailing seasonal winds, native soil hydrology, and the tectonic potential of local stones.
          </p>
          <p>
            We reject the disposable visual noise of fast construction. By employing cast-in-place board-formed concrete, hand-troweled lime mortars, cross-laminated timber, and regional basalt, our buildings age with dignity, gathering a rich patina under rain and sun rather than deteriorating into cosmetic fatigue.
          </p>
        </div>
      </div>

      {/* Vision, Mission, Core Values & USP (Structured Minimalist Grid) */}
      <div className="py-16 space-y-12">
        <div className="max-w-2xl">
          <span className="text-[10px] uppercase tracking-[0.3em] font-semibold text-neutral-400 block">
            CORE PRINCIPLES
          </span>
          <h2 className="font-display text-2xl md:text-3xl font-light text-neutral-900 mt-2">
            The Foundations of Our Practice
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Vision */}
          <div className="p-6 bg-neutral-50 border border-neutral-200 space-y-3">
            <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest block">
              01 / OUR VISION
            </span>
            <h3 className="text-sm font-semibold tracking-wider uppercase text-neutral-900">
              Enduring Architecture
            </h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              To pioneer a contemporary South Asian architectural language celebrated globally for its thermodynamic intelligence, spatial quietude, and ecological responsibility.
            </p>
          </div>

          {/* Mission */}
          <div className="p-6 bg-neutral-50 border border-neutral-200 space-y-3">
            <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest block">
              02 / OUR MISSION
            </span>
            <h3 className="text-sm font-semibold tracking-wider uppercase text-neutral-900">
              Restrained Spacemaking
            </h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              To deliver bespoke built environments through uncompromising technical rigor, rigorous Level-2 BIM coordination, and direct collaborations with master regional craftsmen.
            </p>
          </div>

          {/* Core Values */}
          <div className="p-6 bg-neutral-50 border border-neutral-200 space-y-3">
            <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest block">
              03 / ETHICAL PILLARS
            </span>
            <h3 className="text-sm font-semibold tracking-wider uppercase text-neutral-900">
              Material Honesty
            </h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Tectonic authenticity, zero superfluous ornamentation, low embodied carbon selection, and total transparency in client budgets and execution schedules.
            </p>
          </div>

          {/* USP */}
          <div className="p-6 bg-neutral-50 border border-neutral-200 space-y-3">
            <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest block">
              04 / OUR USP
            </span>
            <h3 className="text-sm font-semibold tracking-wider uppercase text-neutral-900">
              Microclimate Mastery
            </h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Proprietary computational microclimate simulations that engineer natural 4°C–6°C cooling differentials via courtyard physics and calibrated solar jali apertures.
            </p>
          </div>
        </div>
      </div>

      {/* Call to Action Bar */}
      <div className="mt-8 p-8 md:p-12 bg-neutral-950 text-white flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h3 className="font-display text-xl md:text-2xl font-light text-white">
            Have a site or commission in mind?
          </h3>
          <p className="text-xs text-neutral-400 mt-1">
            Our principals welcome discussions on residential, commercial, or civic architecture.
          </p>
        </div>
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-medium bg-white text-black px-6 py-3 hover:bg-neutral-200 transition-colors"
        >
          <span>Initiate Consultation</span>
          <ArrowUpRight size={14} />
        </Link>
      </div>
    </div>
  );
}
