"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useCMSStore } from "@/lib/cmsStore";
import { Service } from "@/data/services";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";

export default function ServicesPage() {
  const { services } = useCMSStore();

  return (
    <div className="w-full py-10 md:py-16 px-6 md:px-12 lg:px-16 max-w-7xl mx-auto space-y-16">
      {/* Page Header */}
      <div className="border-b border-neutral-200 pb-6">
        <span className="text-[10px] uppercase tracking-[0.3em] font-semibold text-neutral-400 block">
          PRACTICE SERVICES
        </span>
        <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-light text-neutral-900 tracking-tight mt-2">
          Services
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 max-w-2xl mt-3 leading-relaxed tracking-wide">
          We provide integrated design services for new buildings and interior environments. Each appointment is structured around the project&apos;s scale, stage and specific requirements.
        </p>
      </div>

      {/* Services Grid & Deep Dives */}
      <div className="space-y-20">
        {services.map((service: Service, idx: number) => (
          <article
            key={service.id}
            id={service.slug}
            className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 pt-10 border-t border-neutral-200 items-start"
          >
            {/* Left Col: Number, Title, Imagery (lg:col-span-5) */}
            <div className="lg:col-span-5 space-y-4">
              <span className="text-xs font-mono text-neutral-400 block">
                0{idx + 1} / DISCIPLINE
              </span>
              <h2 className="font-display text-2xl md:text-3xl font-light uppercase tracking-wide text-neutral-900">
                {service.title}
              </h2>
              <div className="relative aspect-[16/10] w-full bg-neutral-100 overflow-hidden mt-4">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 40vw"
                  className="object-cover"
                />
              </div>

              <div className="pt-2">
                <Link
                  href={`/services/${service.slug}`}
                  className="inline-flex items-center gap-1.5 text-[10px] tracking-[0.2em] uppercase font-semibold text-black hover:underline"
                >
                  <span>View Dedicated Service Protocol</span>
                  <ArrowUpRight size={13} />
                </Link>
              </div>
            </div>

            {/* Right Col: Scope, Process Stages & Deliverables (lg:col-span-7) */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <span className="text-[9px] uppercase tracking-[0.25em] text-neutral-400 block mb-2 font-medium">
                  SCOPE & APPROACH
                </span>
                <p className="text-sm md:text-base text-neutral-800 leading-relaxed font-light">
                  {service.detailedDescription}
                </p>
              </div>

              {/* 4 Process Steps */}
              <div className="space-y-3 pt-4 border-t border-neutral-100">
                <span className="text-[9px] uppercase tracking-[0.25em] text-neutral-400 block mb-2 font-medium">
                  STAGE-GATE METHODOLOGY
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {service.process.map((step, sIdx) => (
                    <div key={sIdx} className="p-3.5 bg-neutral-50 border border-neutral-100 space-y-1">
                      <div className="text-[9px] font-mono text-neutral-400">{step.step} / PHASE</div>
                      <div className="text-xs font-semibold text-neutral-900">{step.title}</div>
                      <p className="text-[11px] text-neutral-500 leading-relaxed">{step.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Deliverables Checklist */}
              <div className="pt-4 border-t border-neutral-100">
                <span className="text-[9px] uppercase tracking-[0.25em] text-neutral-400 block mb-3 font-medium">
                  CORE DELIVERABLES
                </span>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-neutral-700">
                  {service.deliverables.map((del, dIdx) => (
                    <li key={dIdx} className="flex items-center gap-2">
                      <CheckCircle2 size={13} className="text-neutral-400 flex-shrink-0" />
                      <span>{del}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
