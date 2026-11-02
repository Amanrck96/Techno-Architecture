"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useCMSStore, defaultTeam } from "@/lib/cmsStore";
import { TeamMember } from "@/data/team";

export default function HomeTeamSection() {
  const { team } = useCMSStore();
  const rawList: TeamMember[] = (team && team.length > 0) ? team : defaultTeam;
  const displayTeam: TeamMember[] = [...rawList].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));

  return (
    <section id="team" className="w-full py-14 md:py-20 px-6 sm:px-10 lg:px-16 bg-neutral-50/60 border-b border-neutral-200 scroll-mt-20">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-neutral-200 pb-5">
          <div>
            <span className="text-[10px] uppercase tracking-[0.25em] text-neutral-400 block font-mono font-semibold">
              STUDIO PRACTITIONERS
            </span>
            <h2 className="font-display text-2xl md:text-3xl font-light text-neutral-900 tracking-tight mt-1">
              Architects & Specialists ({displayTeam.length})
            </h2>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <p className="text-xs text-neutral-500 font-light max-w-md">
              Our multidisciplinary team collaborating across research, schematic design, technical BIM modeling, and on-site coordination.
            </p>
            <Link
              href="/about#team"
              className="text-[10px] tracking-[0.2em] uppercase text-neutral-600 hover:text-black transition-colors border-b border-neutral-300 hover:border-black pb-0.5 whitespace-nowrap self-start sm:self-end"
            >
              Full Leadership Profile →
            </Link>
          </div>
        </div>

        {/* 3-Column Responsive Architects & Specialists Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayTeam.map((member, mIdx) => (
            <div
              key={member.id || mIdx}
              className="group border border-neutral-200 bg-white hover:border-black transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-md"
            >
              <div>
                {/* Member Portrait */}
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
                          alt={`${member.name} alternate`}
                          fill
                          unoptimized
                          className="object-cover opacity-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                        />
                      )}
                    </>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-neutral-100 text-neutral-400">
                      <span className="font-display text-3xl font-light tracking-wider text-neutral-300">
                        {member.name.split(" ").map((n) => n[0]).join("")}
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
                    <h3 className="font-display text-lg font-medium text-neutral-900 tracking-tight group-hover:text-black">
                      {member.name}
                    </h3>
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

              {/* Socials / Direct Link */}
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
    </section>
  );
}
