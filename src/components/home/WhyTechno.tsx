import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export default function WhyTechno() {
  return (
    <section id="why-techno" className="w-full py-16 md:py-24 px-6 md:px-12 bg-neutral-950 text-white border-y border-neutral-800 scroll-mt-20">
      <div className="max-w-7xl mx-auto">
        {/* Section Label */}
        <div className="mb-12">
          <span className="text-[10px] uppercase tracking-[0.35em] text-neutral-400 block font-medium">
            Philosophy & Differentiation
          </span>
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-light tracking-tight text-white mt-3 max-w-3xl leading-snug">
            Why Techno? An architectural discipline forged at the nexus of restraint, science, and sensory resonance.
          </h2>
        </div>

        {/* Narrative Essay Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-14 pt-6 border-t border-neutral-800/80 text-neutral-300">
          {/* Pillar 01 */}
          <div className="space-y-4">
            <span className="text-xs font-mono text-neutral-500 block">01 / TECTONIC CLARITY</span>
            <h3 className="text-sm uppercase tracking-[0.2em] font-medium text-white">
              The Architecture of Truth
            </h3>
            <p className="text-xs leading-relaxed text-neutral-400 font-normal">
              We reject cosmetic facades and transient stylistic fads. Every column, cantilever, and shadow line in a Techno building serves an unequivocal thermodynamic and structural purpose. We celebrate raw board-formed concrete, native granite, and mass timber in their unadorned authenticity.
            </p>
          </div>

          {/* Pillar 02 */}
          <div className="space-y-4">
            <span className="text-xs font-mono text-neutral-500 block">02 / PASSIVE PHYSICS</span>
            <h3 className="text-sm uppercase tracking-[0.2em] font-medium text-white">
              Climate-Responsive Engineering
            </h3>
            <p className="text-xs leading-relaxed text-neutral-400 font-normal">
              Architecture must respond to its equatorial context. By leveraging heavy thermal mass, calibrated jali solar filters, and internal courtyard microclimates, our structures achieve up to a 6°C thermal differential naturally, radically cutting energy dependence before active systems are deployed.
            </p>
          </div>

          {/* Pillar 03 */}
          <div className="space-y-4">
            <span className="text-xs font-mono text-neutral-500 block">03 / LEVEL-2 BIM PRECISION</span>
            <h3 className="text-sm uppercase tracking-[0.2em] font-medium text-white">
              Digital Rigor & Execution Control
            </h3>
            <p className="text-xs leading-relaxed text-neutral-400 font-normal">
              Our concepts are never compromised by poor construction. Through complete Level-2 BIM coordination and virtual clash resolution, we guarantee millimeter accuracy from early design models through to on-site concrete pours, ensuring budget predictability and zero execution surprises.
            </p>
          </div>
        </div>

        {/* Key Metrics / Footprint */}
        <div className="mt-16 pt-10 border-t border-neutral-800 grid grid-cols-2 md:grid-cols-4 gap-8 text-center sm:text-left">
          <div>
            <div className="font-display text-3xl md:text-4xl text-white font-light">18+</div>
            <div className="text-[9px] uppercase tracking-[0.25em] text-neutral-500 mt-1">
              Years Combined Practice
            </div>
          </div>
          <div>
            <div className="font-display text-3xl md:text-4xl text-white font-light">42+</div>
            <div className="text-[9px] uppercase tracking-[0.25em] text-neutral-500 mt-1">
              Commissions Realized
            </div>
          </div>
          <div>
            <div className="font-display text-3xl md:text-4xl text-white font-light">68%</div>
            <div className="text-[9px] uppercase tracking-[0.25em] text-neutral-500 mt-1">
              Average Embodied Carbon Reduction
            </div>
          </div>
          <div>
            <div className="font-display text-3xl md:text-4xl text-white font-light">3</div>
            <div className="text-[9px] uppercase tracking-[0.25em] text-neutral-500 mt-1">
              Global Studio Hubs
            </div>
          </div>
        </div>

        {/* Link to About */}
        <div className="mt-12 text-right">
          <Link
            href="/about"
            className="inline-flex items-center gap-1.5 text-[10px] tracking-[0.25em] uppercase text-neutral-300 hover:text-white transition-colors group font-medium"
          >
            <span>Learn More About Our Team & Ethics</span>
            <ArrowUpRight size={13} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
