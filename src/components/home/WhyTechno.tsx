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
            PRACTICE ETHOS
          </span>
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-light tracking-tight text-white mt-3 max-w-3xl leading-snug">
            Why Techno Architecture
          </h2>
        </div>

        {/* Narrative 5-Pillar Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 pt-6 border-t border-neutral-800/80 text-neutral-300">
          {/* Pillar 01 */}
          <div className="space-y-3 p-5 bg-neutral-900/40 border border-neutral-800/60">
            <span className="text-xs font-mono text-neutral-500 block">01 / CONTEXT LED DESIGN</span>
            <h3 className="text-sm uppercase tracking-[0.15em] font-medium text-white">
              Site, Climate & Brief
            </h3>
            <p className="text-xs leading-relaxed text-neutral-400 font-normal">
              Every project begins with the site, climate, surroundings and client brief.
            </p>
          </div>

          {/* Pillar 02 */}
          <div className="space-y-3 p-5 bg-neutral-900/40 border border-neutral-800/60">
            <span className="text-xs font-mono text-neutral-500 block">02 / BEAUTY & USE</span>
            <h3 className="text-sm uppercase tracking-[0.15em] font-medium text-white">
              A Balance of Beauty and Use
            </h3>
            <p className="text-xs leading-relaxed text-neutral-400 font-normal">
              We design expressive spaces that remain comfortable, efficient and practical.
            </p>
          </div>

          {/* Pillar 03 */}
          <div className="space-y-3 p-5 bg-neutral-900/40 border border-neutral-800/60">
            <span className="text-xs font-mono text-neutral-500 block">03 / END TO END DELIVERY</span>
            <h3 className="text-sm uppercase tracking-[0.15em] font-medium text-white">
              Coordinated Solution
            </h3>
            <p className="text-xs leading-relaxed text-neutral-400 font-normal">
              Architecture, interiors, structural design and execution support are coordinated as one complete solution.
            </p>
          </div>

          {/* Pillar 04 */}
          <div className="space-y-3 p-5 bg-neutral-900/40 border border-neutral-800/60">
            <span className="text-xs font-mono text-neutral-500 block">04 / RESPONSIBLE CHOICES</span>
            <h3 className="text-sm uppercase tracking-[0.15em] font-medium text-white">
              Passive & Resource-Conscious
            </h3>
            <p className="text-xs leading-relaxed text-neutral-400 font-normal">
              Passive design, durable materials and resource-conscious planning guide our decisions.
            </p>
          </div>

          {/* Pillar 05 */}
          <div className="space-y-3 p-5 bg-neutral-900/40 border border-neutral-800/60 md:col-span-2 lg:col-span-2">
            <span className="text-xs font-mono text-neutral-500 block">05 / SITE INVOLVEMENT</span>
            <h3 className="text-sm uppercase tracking-[0.15em] font-medium text-white">
              Attention Through Execution
            </h3>
            <p className="text-xs leading-relaxed text-neutral-400 font-normal">
              We maintain design clarity through drawings, coordination and site involvement.
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
