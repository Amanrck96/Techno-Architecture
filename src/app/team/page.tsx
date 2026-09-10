"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useCMSStore } from "@/lib/cmsStore";
import { TeamMember } from "@/data/team";
import { Linkedin, Instagram } from "lucide-react";
import { cn } from "@/lib/utils";

export default function TeamPage() {
  const { team } = useCMSStore();
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>("All");

  const disciplines = [
    "All",
    "Leadership",
    "Architecture",
    "Interiors",
    "BIM & Technical",
    "Research & Sustainability",
  ];

  const filteredTeam = team.filter((m) =>
    selectedDiscipline === "All" ? true : m.discipline === selectedDiscipline
  );

  return (
    <div className="w-full py-10 md:py-16 px-6 md:px-12 lg:px-16 max-w-7xl mx-auto space-y-16">
      {/* Page Header */}
      <div className="border-b border-neutral-200 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-[0.3em] font-semibold text-neutral-400 block">
            STUDIO PRACTITIONERS
          </span>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-light text-neutral-900 tracking-tight mt-2">
            The Minds & Hands Behind Techno
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 max-w-xl mt-2 tracking-wide font-light">
            A tight collective of architects, computational engineers, urbanists, and craftsmen operating across Bengaluru, Hyderabad, and Dubai.
          </p>
        </div>

        {/* Discipline Filters */}
        <div className="flex flex-wrap gap-2">
          {disciplines.map((d) => (
            <button
              key={d}
              onClick={() => setSelectedDiscipline(d)}
              type="button"
              className={cn(
                "text-[10px] tracking-[0.2em] uppercase py-1 px-3 transition-all duration-300",
                selectedDiscipline === d
                  ? "bg-black text-white font-medium"
                  : "text-neutral-500 hover:text-black hover:bg-neutral-100"
              )}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Editorial Team Roster (Large Monospaced Portraits with Bios) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
        {filteredTeam.map((member: TeamMember) => (
          <article key={member.id} className="space-y-4 group">
            {/* Portrait */}
            <div className="relative aspect-[3/4] w-full bg-neutral-100 overflow-hidden">
              <Image
                src={member.image}
                alt={member.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 ease-editorial group-hover:scale-105"
              />
            </div>

            {/* Member Details */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-mono uppercase tracking-widest text-neutral-400">
                  {member.discipline}
                </span>
                {member.socials && member.socials.length > 0 && (
                  <div className="flex items-center space-x-2 text-neutral-400">
                    {member.socials.map((s, idx) => (
                      <a
                        key={idx}
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${member.name} on ${s.platform}`}
                        className="hover:text-black transition-colors"
                      >
                        {s.platform === "LinkedIn" ? <Linkedin size={11} /> : <Instagram size={11} />}
                      </a>
                    ))}
                  </div>
                )}
              </div>

              <h2 className="font-display text-base font-medium tracking-wide text-neutral-900">
                {member.name}
              </h2>
              <p className="text-xs text-black font-normal">{member.role}</p>
              <p className="text-[10px] text-neutral-400 font-mono tracking-wider">
                {member.credentials}
              </p>
              <p className="text-xs text-neutral-600 leading-relaxed pt-2 font-light line-clamp-4 group-hover:line-clamp-none transition-all">
                {member.bio}
              </p>
            </div>
          </article>
        ))}
      </div>

      {/* Careers Inquiries Banner */}
      <div className="p-8 md:p-12 border border-neutral-200 bg-neutral-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <span className="text-[10px] uppercase tracking-[0.25em] text-neutral-400 block font-semibold">
            JOIN THE STUDIO
          </span>
          <h3 className="font-display text-xl font-light text-neutral-900 mt-1">
            We are always in search of thoughtful spatial thinkers.
          </h3>
          <p className="text-xs text-neutral-500 mt-1 max-w-xl">
            Passionate about board-formed concrete, mass timber, and computational microclimates? Send your portfolio (PDF &lt; 15MB) to careers@technoarchitecture.com.
          </p>
        </div>
        <a
          href="mailto:careers@technoarchitecture.com"
          className="text-xs uppercase tracking-[0.2em] font-medium bg-black text-white px-6 py-3 hover:bg-neutral-800 transition-colors"
        >
          Submit Portfolio
        </a>
      </div>
    </div>
  );
}
