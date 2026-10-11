"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Award, Compass, Eye, ShieldCheck, Building2, CheckCircle2, GraduationCap, Instagram } from "lucide-react";
import { useCMSStore, defaultTeam } from "@/lib/cmsStore";

export default function AboutContent() {
  const { siteSettings, team } = useCMSStore();
  const [activeValueIndex, setActiveValueIndex] = useState<number | null>(null);
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>("All");

  const displayTeam = (team && team.length > 0) ? team : defaultTeam;
  const rajesh =
    displayTeam.find((m) => m.name.toLowerCase().includes("rajesh")) ||
    defaultTeam[0];

  const disciplines = ["All", "Leadership", "Architecture", "Interiors", "BIM & Technical", "Research & Sustainability"];
  const filteredTeam = selectedDiscipline === "All"
    ? displayTeam
    : displayTeam.filter((m) => m.discipline === selectedDiscipline);

  const tagline = siteSettings?.tagline || "Architecture shaped around people, place and purpose.";
  const foundedYear = siteSettings?.foundedYear || 2006;
  const studioCity = siteSettings?.studios?.[0]?.city || "Basavanagudi, Bengaluru";

  const stats = (siteSettings?.milestones && siteSettings.milestones.length > 0)
    ? siteSettings.milestones
    : [
        { value: `${foundedYear}`, label: "Established Studio", detail: "Rooted in Basavanagudi" },
        { value: "20+", label: "Years Experience", detail: "Ar. Rajesh Shivaram" },
        { value: "100+", label: "Projects Designed", detail: "Contextual & Sustainable" },
        { value: "15+", label: "Recognitions", detail: "Awards, Publications & Monograph" },
      ];

  const coreValues = (siteSettings?.coreValues && siteSettings.coreValues.length > 0)
    ? siteSettings.coreValues
    : [
        {
          num: "01",
          title: "Design Integrity",
          desc: "We protect the central idea of a project from concept through completion.",
          tag: "Commitment",
        },
        {
          num: "02",
          title: "Client Partnership",
          desc: "We listen, explain choices clearly and make decisions collaboratively.",
          tag: "Dialogue",
        },
        {
          num: "03",
          title: "Context and Climate",
          desc: "We respond to orientation, light, ventilation, landscape and local conditions.",
          tag: "Sustainability",
        },
        {
          num: "04",
          title: "Practical Innovation",
          desc: "We explore new possibilities while respecting function, budget and construction realities.",
          tag: "Engineering",
        },
        {
          num: "05",
          title: "Responsible Practice",
          desc: "We favour durable solutions, efficient planning and environmentally conscious choices.",
          tag: "Lifecycle",
        },
        {
          num: "06",
          title: "Craft and Detail",
          desc: "We believe material junctions, proportions and execution determine the quality of the finished space.",
          tag: "Precision",
        },
      ];

  return (
    <div className="w-full pt-10 sm:pt-12 md:pt-14 pb-16 px-6 sm:px-10 lg:px-16 max-w-7xl mx-auto space-y-16 sm:space-y-20">
      {/* 1. Standardized Page Header */}
      <div className="border-b border-neutral-200 pb-6 sm:pb-8 space-y-2">
        <span className="text-[10px] uppercase tracking-[0.3em] font-semibold text-neutral-400 block font-mono">
          PRACTICE PROFILE & PHILOSOPHY
        </span>
        <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-light text-neutral-900 tracking-tight">
          About the Practice
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 max-w-3xl font-light leading-relaxed tracking-wide pt-1">
          {tagline} Established in 2006 by Ar. Rajesh Shivaram in Basavanagudi, Bengaluru — committed to architecture that is distinctive, environmentally responsible and grounded in everyday life.
        </p>
      </div>

      {/* 2. Main Full-Bleed Editorial Visual with Hover Zoom */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full aspect-[21/9] sm:aspect-[16/7] bg-neutral-950 overflow-hidden group shadow-lg"
      >
        <Image
          src="/projects/salut/salut-terrace-bar-screening-ambience.jpg"
          alt="Techno Architecture Studio Project"
          fill
          priority
          sizes="100vw"
          className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="absolute bottom-5 left-5 sm:bottom-6 sm:left-6 bg-black/80 backdrop-blur-md text-white text-[9.5px] uppercase tracking-[0.22em] font-mono px-4 py-2 border border-white/20 shadow-md"
        >
          Techno Architecture · {studioCity}
        </motion.div>
      </motion.div>

      {/* 4. Editorial Design Philosophy Statement */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="pb-16 border-b border-neutral-200"
      >
        <div className="max-w-4xl border-l-2 border-black pl-6 sm:pl-8 space-y-3">
          <span className="text-[10px] uppercase font-mono tracking-[0.3em] text-neutral-400 font-semibold block">
            DESIGN PHILOSOPHY
          </span>
          <p className="text-base sm:text-lg md:text-xl text-neutral-900 leading-relaxed font-normal">
            Techno Architecture is an architecture and design practice led by Rajesh Shivaram, a graduate of Bangalore Institute of Technology. The studio combines design exploration with practical problem-solving to create buildings and interiors that are clear in concept, comfortable to use and responsive to their environment.
          </p>
        </div>
      </motion.div>

      {/* 5. Core Values (All 6 from PDF Page 3) with Animated Cards */}
      <div className="pt-4 sm:pt-8 pb-12 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-[10px] uppercase tracking-[0.3em] font-semibold text-neutral-400 block font-mono">
              PRINCIPLES & ETHICS
            </span>
            <h2 className="font-display text-2xl md:text-3xl lg:text-4xl font-light text-neutral-900 mt-1">
              Core Values
            </h2>
          </div>
          <p className="text-xs text-neutral-500 font-light max-w-sm">
            Six foundational commitments guiding every schematic idea and construction review.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coreValues.map((val, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              whileHover={{ y: -4 }}
              onHoverStart={() => setActiveValueIndex(idx)}
              onHoverEnd={() => setActiveValueIndex(null)}
              className={`p-6 sm:p-7 border transition-all duration-300 relative rounded-xs ${
                activeValueIndex === idx
                  ? "bg-neutral-900 text-white border-neutral-900 shadow-xl"
                  : "bg-white text-neutral-900 border-neutral-200 hover:border-neutral-400 shadow-xs"
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <span
                  className={`text-[10px] font-mono uppercase tracking-widest font-semibold ${
                    activeValueIndex === idx ? "text-neutral-400" : "text-neutral-400"
                  }`}
                >
                  {val.num} / VALUE
                </span>
                <span
                  className={`text-[9px] uppercase tracking-[0.2em] font-mono px-2 py-0.5 rounded-full ${
                    activeValueIndex === idx
                      ? "bg-white/10 text-neutral-300"
                      : "bg-neutral-100 text-neutral-600"
                  }`}
                >
                  {val.tag}
                </span>
              </div>

              <h3 className="text-sm font-semibold uppercase tracking-wider mb-2">
                {val.title}
              </h3>
              <p
                className={`text-xs leading-relaxed font-light ${
                  activeValueIndex === idx ? "text-neutral-300" : "text-neutral-600"
                }`}
              >
                {val.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Studio Milestones Bar (Positioned Between Core Values & What Sets Us Apart) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-6 sm:p-8 bg-neutral-900 text-white rounded-sm shadow-xl my-4"
      >
        {stats.map((stat, sIdx) => (
          <motion.div
            key={sIdx}
            whileHover={{ y: -3 }}
            className="space-y-1 border-l border-neutral-700/60 pl-4 sm:pl-6 first:border-l-0"
          >
            <div className="font-display text-3xl sm:text-4xl md:text-5xl font-light tracking-tight text-white">
              {stat.value}
            </div>
            <div className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] font-medium text-neutral-300">
              {stat.label}
            </div>
            <div className="text-[10px] text-neutral-400 font-light font-mono">
              {stat.detail}
            </div>
          </motion.div>
        ))}
      </motion.div>



      {/* 8. OUR TEAM & PRACTICE LEADERSHIP (Studio Practitioners & Leadership) */}
      <section
        id="team"
        className="space-y-12 scroll-mt-24 pt-6"
      >
        <div className="border-t border-neutral-200 pt-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between pb-6 border-b border-neutral-200 gap-4">
            <div>
              <span className="text-[10px] uppercase tracking-[0.3em] font-mono font-semibold text-neutral-400 block">
                05 / PRACTICE LEADERSHIP & STUDIO TEAM
              </span>
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-light text-neutral-900 tracking-tight mt-1">
                Our Team
              </h2>
              <p className="text-xs sm:text-sm text-neutral-600 max-w-2xl mt-2 tracking-wide font-light leading-relaxed">
                Techno Architecture is led by Principal Architect Ar. Rajesh Shivaram and driven by a tight-knit, multidisciplinary studio of architects, interior specialists, computational designers, and technical planners.
              </p>
            </div>
            {rajesh?.socials?.[0]?.url && (
              <a
                href={rajesh.socials[0].url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-medium text-neutral-700 hover:text-black border border-neutral-300 hover:border-black px-4 py-2.5 transition-colors self-start md:self-end shrink-0 bg-white"
              >
                <Instagram size={14} />
                <span>Follow @technoarchitecture_rajesh</span>
                <ArrowUpRight size={12} />
              </a>
            )}
          </div>
        </div>

        {/* Principal Architect Feature Profile */}
        <div className="border border-neutral-200 bg-white p-6 sm:p-10 lg:p-12 space-y-10 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Leadership Portrait & Core Info */}
            <div className="lg:col-span-5 space-y-5">
              <div className="relative w-full aspect-[4/5] max-w-sm bg-neutral-100 border border-neutral-200 overflow-hidden shadow-sm group">
                <Image
                  src={rajesh?.image || "/team/rajesh-shivaram.jpg"}
                  alt={rajesh?.name || "Ar. Rajesh Shivaram"}
                  fill
                  unoptimized
                  className={`object-cover object-top transition-all duration-700 ${
                    rajesh?.hoverImage ? "group-hover:opacity-0 group-hover:scale-102" : "hover:scale-102"
                  }`}
                />
                {rajesh?.hoverImage && (
                  <Image
                    src={rajesh.hoverImage}
                    alt={`${rajesh?.name || "Ar. Rajesh Shivaram"} alternate`}
                    fill
                    unoptimized
                    className="object-cover object-top opacity-0 group-hover:opacity-100 group-hover:scale-102 transition-all duration-700"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="text-[9px] font-mono uppercase tracking-[0.25em] text-neutral-300 block">
                    FOUNDER & PRINCIPAL
                  </span>
                  <p className="font-display text-lg font-light text-white tracking-wide">
                    {rajesh?.name || "Ar. Rajesh Shivaram"}
                  </p>
                </div>
              </div>

              <div className="space-y-1.5 pt-1">
                <span className="text-[9.5px] font-mono uppercase tracking-[0.25em] text-neutral-400 block">
                  PRACTICE LEADERSHIP
                </span>
                <h3 className="font-display text-2xl sm:text-3xl font-light text-neutral-900 tracking-tight">
                  {rajesh?.name || "Ar. Rajesh Shivaram"}
                </h3>
                <p className="text-xs font-semibold uppercase tracking-wider text-black">
                  {rajesh?.role || "Principal Architect"}
                </p>
                <p className="text-xs text-neutral-500 font-mono">
                  {rajesh?.credentials || "B.Arch (Bangalore Institute of Technology)"}
                </p>
                <div className="pt-2">
                  <span className="inline-block text-[9px] uppercase tracking-[0.2em] font-mono bg-neutral-100 text-neutral-700 px-3 py-1 border border-neutral-200">
                    BASE: BASAVANAGUDI, BENGALURU · EST. 2006
                  </span>
                </div>
              </div>
            </div>

            {/* Leadership Narrative & Philosophy */}
            <div className="lg:col-span-7 space-y-5 text-neutral-700 leading-relaxed font-light text-xs sm:text-sm lg:border-l lg:border-neutral-200 lg:pl-10">
              <div className="border-l-2 border-neutral-900 pl-4 space-y-1">
                <span className="text-[10px] uppercase font-mono tracking-widest text-neutral-400">DESIGN STEWARDSHIP</span>
                <p className="text-sm sm:text-base text-neutral-900 font-normal leading-snug">
                  {rajesh?.bio || "A graduate of Bangalore Institute of Technology, Rajesh Shivaram is the Principal Architect of Techno Architecture and brings 20 years of professional experience to the practice."}
                </p>
              </div>
              <p>
                Our work is shaped through rigorous architectural dialogue. We listen carefully, study site contours and climatic paths, and translate each client&apos;s aspirations into a design that feels personal while remaining technically sound, durable, and buildable.
              </p>
              <p>
                Under Rajesh&apos;s direction, Techno Architecture provides a complete end-to-end delivery framework where masterplanning, architecture, interior detailing, structural coordination, and site construction are integrated as one seamless discipline. This eliminates fragmented handoffs and ensures every finished structure endures with poetic clarity.
              </p>
              <div className="p-4 bg-neutral-50 border border-neutral-200 space-y-1 mt-4">
                <span className="text-[9.5px] uppercase tracking-widest font-mono text-neutral-500 block font-semibold">
                  PRACTICE PHILOSOPHY
                </span>
                <p className="text-xs text-neutral-700 italic">
                  &ldquo;A building is not an isolated sculpture; it is an enduring relationship between climate, material craft, and the human lives it shelters.&rdquo;
                </p>
              </div>
            </div>
          </div>

          {/* Practice Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-8 border-t border-neutral-200">
            <div className="p-4 bg-neutral-50 border border-neutral-100 space-y-1.5">
              <div className="flex items-center gap-2 text-neutral-500">
                <GraduationCap size={15} />
                <span className="text-[9px] font-mono uppercase tracking-widest text-neutral-400">EDUCATION</span>
              </div>
              <h4 className="text-xs font-semibold text-neutral-900 uppercase tracking-wider">B.Arch Graduate</h4>
              <p className="text-[11px] text-neutral-600 font-light leading-relaxed">Bangalore Institute of Technology, grounding the studio in structural clarity and design exploration.</p>
            </div>

            <div className="p-4 bg-neutral-50 border border-neutral-100 space-y-1.5">
              <div className="flex items-center gap-2 text-neutral-500">
                <Award size={15} />
                <span className="text-[9px] font-mono uppercase tracking-widest text-neutral-400">EXPERIENCE</span>
              </div>
              <h4 className="text-xs font-semibold text-neutral-900 uppercase tracking-wider">20 Years Practice</h4>
              <p className="text-[11px] text-neutral-600 font-light leading-relaxed">Two decades of continuous architectural practice leading bespoke residential, commercial, hospitality and interior projects.</p>
            </div>

            <div className="p-4 bg-neutral-50 border border-neutral-100 space-y-1.5">
              <div className="flex items-center gap-2 text-neutral-500">
                <Building2 size={15} />
                <span className="text-[9px] font-mono uppercase tracking-widest text-neutral-400">ESTABLISHED</span>
              </div>
              <h4 className="text-xs font-semibold text-neutral-900 uppercase tracking-wider">2006 · Basavanagudi</h4>
              <p className="text-[11px] text-neutral-600 font-light leading-relaxed">Founded in heritage Basavanagudi, Bengaluru, creating enduring contextual architecture across South India.</p>
            </div>

            <div className="p-4 bg-neutral-50 border border-neutral-100 space-y-1.5">
              <div className="flex items-center gap-2 text-neutral-500">
                <Compass size={15} />
                <span className="text-[9px] font-mono uppercase tracking-widest text-neutral-400">APPROACH</span>
              </div>
              <h4 className="text-xs font-semibold text-neutral-900 uppercase tracking-wider">End-to-End Delivery</h4>
              <p className="text-[11px] text-neutral-600 font-light leading-relaxed">Integrated architecture, interior detailing, material prototyping and complete site execution support.</p>
            </div>
          </div>
        </div>

        {/* Studio Practitioners & Team Members Grid */}
        <div className="space-y-6 pt-4">
          <div className="space-y-4 border-b border-neutral-200 pb-5">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
              <div>
                <span className="text-[9.5px] uppercase tracking-[0.25em] text-neutral-400 block font-mono font-semibold">
                  STUDIO PRACTITIONERS
                </span>
                <h3 className="font-display text-2xl font-light text-neutral-900 tracking-tight">
                  Architects & Specialists ({filteredTeam.length})
                </h3>
              </div>
              <p className="text-xs text-neutral-500 font-light max-w-md">
                Our multidisciplinary team collaborating across research, schematic design, technical BIM modeling, and on-site coordination.
              </p>
            </div>

            {/* Discipline Filter Tabs */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              {disciplines.map((d) => {
                const count = d === "All" ? displayTeam.length : displayTeam.filter((m) => m.discipline === d).length;
                if (count === 0) return null;
                const isSelected = selectedDiscipline === d;
                return (
                  <button
                    key={d}
                    onClick={() => setSelectedDiscipline(d)}
                    className={`px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider transition-all duration-200 border ${
                      isSelected
                        ? "bg-neutral-900 text-white border-neutral-900 shadow-xs"
                        : "bg-white text-neutral-600 border-neutral-200 hover:border-neutral-900 hover:text-black"
                    }`}
                  >
                    <span>{d}</span>
                    <span className={`ml-1.5 opacity-70 text-[9px]`}>({count})</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTeam.map((member, mIdx) => (
              <div
                key={member.id || mIdx}
                className="group border border-neutral-200 bg-white hover:border-black transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-md"
              >
                <div>
                  {/* Member Photo */}
                  <div className="relative w-full aspect-square bg-neutral-100 overflow-hidden">
                    {member.image ? (
                      <>
                        <Image
                          src={member.image}
                          alt={member.name}
                          fill
                          unoptimized
                          className={`object-cover transition-all duration-500 ${
                            member.hoverImage && member.hoverImage !== member.image
                              ? "group-hover:opacity-0 group-hover:scale-105"
                              : "group-hover:scale-105"
                          }`}
                        />
                        {member.hoverImage && member.hoverImage !== member.image && (
                          <Image
                            src={member.hoverImage}
                            alt={`${member.name} alternate view`}
                            fill
                            unoptimized
                            className="object-cover opacity-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                          />
                        )}
                      </>
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-neutral-100 text-neutral-400">
                        <span className="font-display text-3xl font-light tracking-wider text-neutral-300">
                          {member.name.split(" ").map(n => n[0]).join("")}
                        </span>
                        <span className="text-[9px] font-mono uppercase tracking-widest mt-1">Techno Studio</span>
                      </div>
                    )}
                    <div className="absolute top-3 left-3 z-10">
                      <span className="text-[8.5px] font-mono uppercase tracking-wider px-2 py-0.5 bg-black/80 backdrop-blur-xs text-white">
                        {member.discipline || "Architecture"}
                      </span>
                    </div>
                  </div>

                  {/* Member Details */}
                  <div className="p-5 space-y-2.5">
                    <div>
                      <h4 className="font-display text-lg font-medium text-neutral-900 tracking-tight group-hover:text-black">
                        {member.name}
                      </h4>
                      <p className="text-xs font-medium text-neutral-700 uppercase tracking-wider">
                        {member.role}
                      </p>
                      {member.credentials && (
                        <p className="text-[11px] font-mono text-neutral-400 mt-0.5">
                          {member.credentials}
                        </p>
                      )}
                    </div>
                    {member.bio && (
                      <p className="text-xs text-neutral-600 font-light leading-relaxed line-clamp-3">
                        {member.bio}
                      </p>
                    )}
                  </div>
                </div>

                {member.socials && member.socials.length > 0 && (
                  <div className="px-5 pb-4 pt-1 border-t border-neutral-100 flex items-center gap-3">
                    {member.socials.map((s, sIdx) => (
                      <a
                        key={sIdx}
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] font-mono text-neutral-400 hover:text-black transition-colors uppercase tracking-wider flex items-center gap-1"
                      >
                        <span>{s.platform}</span>
                        <ArrowUpRight size={10} />
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Studio Culture & Teamwork Note */}
        <div className="p-6 md:p-8 border border-neutral-200 bg-neutral-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-xs">
          <div className="space-y-1.5">
            <span className="text-[9.5px] uppercase tracking-[0.25em] text-neutral-400 block font-semibold font-mono">
              STUDIO TEAM & CULTURE
            </span>
            <h4 className="font-display text-lg sm:text-xl font-light text-neutral-900">
              Collaborative Practice & Careers
            </h4>
            <p className="text-xs text-neutral-600 max-w-2xl leading-relaxed font-light">
              Every project is developed through teamwork. Architects and designers contribute across research, planning, visualisation, documentation, material prototyping and site coordination, allowing ideas to be tested at every stage.
            </p>
          </div>
          <Link
            href="/careers"
            className="text-[11px] uppercase tracking-[0.2em] font-medium bg-black text-white px-6 py-3.5 hover:bg-neutral-800 transition-colors whitespace-nowrap shrink-0 shadow-xs"
          >
            View Careers & Join Us
          </Link>
        </div>
      </section>


      {/* 10. Call to Action Banner */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="p-8 md:p-14 bg-neutral-950 text-white flex flex-col md:flex-row md:items-center justify-between gap-8 rounded-xs shadow-2xl relative overflow-hidden"
      >
        <div className="space-y-2 z-10">
          <span className="text-[9.5px] uppercase tracking-[0.3em] font-mono text-neutral-400 block">
            INITIATE DIALOGUE
          </span>
          <h3 className="font-display text-2xl md:text-3xl font-light text-white tracking-tight">
            Have a project in mind?
          </h3>
          <p className="text-xs text-neutral-400 max-w-xl font-light leading-relaxed">
            Let us discuss your project across residential, commercial, hospitality or bespoke interior spaces. We review site parameters and provide a structured design proposal.
          </p>
        </div>
        <Link
          href="/contact"
          className="z-10 inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-medium bg-white text-black px-7 py-4 hover:bg-neutral-200 transition-colors shadow-lg whitespace-nowrap self-start md:self-center"
        >
          <span>Start a Conversation</span>
          <ArrowUpRight size={14} />
        </Link>
      </motion.div>
    </div>
  );
}
