"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { useCMSStore } from "@/lib/cmsStore";
import { ArrowLeft, ArrowUpRight, CheckCircle2 } from "lucide-react";

export default function ServiceDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const { services, projects } = useCMSStore();

  const service = services.find((s) => s.slug === slug);
  if (!service) return notFound();

  // Related projects that engaged this service
  const relatedProjects = projects.filter((p) =>
    service.relatedProjectSlugs?.includes(p.slug)
  );

  return (
    <article className="w-full py-10 md:py-16 px-6 md:px-12 lg:px-16 max-w-7xl mx-auto space-y-12">
      {/* Back to Services Breadcrumb */}
      <div className="border-b border-neutral-200 pb-4">
        <Link
          href="/services"
          className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] font-medium text-neutral-500 hover:text-black transition-colors"
        >
          <ArrowLeft size={13} />
          <span>ALL DISCIPLINES</span>
        </Link>
      </div>

      {/* Header */}
      <div className="space-y-4 max-w-4xl">
        <span className="text-[10px] uppercase tracking-[0.3em] font-semibold text-neutral-400 block">
          DISCIPLINE SPECIFICATION
        </span>
        <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-light text-neutral-900 tracking-tight">
          {service.title}
        </h1>
        <p className="text-sm md:text-base text-neutral-600 font-light leading-relaxed">
          {service.shortDescription}
        </p>
      </div>

      {/* Hero Visual */}
      <div className="relative w-full aspect-[21/9] sm:aspect-[16/7] bg-neutral-100 overflow-hidden">
        <Image
          src={service.image}
          alt={service.title}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </div>

      {/* Detailed Description & Process */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-6 border-t border-neutral-200">
        <div className="lg:col-span-6 space-y-6">
          <span className="text-[10px] uppercase tracking-[0.25em] text-neutral-400 block font-medium">
            ETHOS & TECTONIC CONVICTIONS
          </span>
          <p className="text-sm md:text-base text-neutral-800 leading-relaxed font-light">
            {service.detailedDescription}
          </p>

          {/* Deliverables Box */}
          <div className="p-6 bg-neutral-50 border border-neutral-200 space-y-3 mt-6">
            <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-neutral-900 block">
              TANGIBLE DELIVERABLES & DRAWING SETS
            </span>
            <ul className="space-y-2 text-xs text-neutral-700">
              {service.deliverables.map((del, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle2 size={14} className="text-black flex-shrink-0 mt-0.5" />
                  <span>{del}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Process Roadmap */}
        <div className="lg:col-span-6 space-y-6">
          <span className="text-[10px] uppercase tracking-[0.25em] text-neutral-400 block font-medium">
            EXECUTION PHASES & QUALITY GATES
          </span>

          <div className="space-y-4">
            {service.process.map((step, idx) => (
              <div key={idx} className="p-5 border border-neutral-200 space-y-1 bg-white">
                <div className="text-[10px] font-mono text-neutral-400">{step.step} / PHASE</div>
                <h3 className="text-sm font-semibold tracking-wide text-neutral-900">{step.title}</h3>
                <p className="text-xs text-neutral-600 leading-relaxed pt-1">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Related Projects in this discipline */}
      {relatedProjects.length > 0 && (
        <section className="pt-12 border-t border-neutral-200">
          <div className="mb-6">
            <span className="text-[10px] uppercase tracking-[0.3em] font-semibold text-neutral-900 block">
              EVIDENCE IN BUILT WORK
            </span>
            <p className="text-xs text-neutral-500 mt-1">
              Select projects highlighting our {service.title.toLowerCase()} capabilities
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {relatedProjects.map((p) => (
              <Link
                key={p.id}
                href={`/projects/${p.slug}`}
                className="group block bg-neutral-50 border border-neutral-200 overflow-hidden"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden">
                  <Image
                    src={p.mainImage}
                    alt={p.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-4 space-y-1">
                  <h4 className="font-display text-xs uppercase tracking-[0.2em] text-neutral-900 font-medium group-hover:text-black">
                    {p.title}
                  </h4>
                  <p className="text-[9px] text-neutral-500 uppercase tracking-wider">
                    {p.location} · {p.year}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Consultation CTA */}
      <div className="p-8 bg-neutral-900 text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="font-display text-lg font-light text-white">
            Engage Techno for {service.title}
          </h3>
          <p className="text-xs text-neutral-400 mt-0.5">
            Our teams are available for preliminary feasibility and RFP inquiries.
          </p>
        </div>
        <Link
          href="/contact"
          className="text-xs uppercase tracking-[0.2em] font-medium bg-white text-black px-5 py-2.5 hover:bg-neutral-200 transition-colors flex items-center gap-1.5"
        >
          <span>Schedule Discussion</span>
          <ArrowUpRight size={13} />
        </Link>
      </div>
    </article>
  );
}
