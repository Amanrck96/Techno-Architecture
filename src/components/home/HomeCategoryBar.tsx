"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface CategorySection {
  id: string;
  letter: string;
  title: string;
}

const sections: CategorySection[] = [
  { id: "introduction", letter: "a", title: "Introduction" },
  { id: "projects", letter: "b", title: "Projects" },
  { id: "why-techno", letter: "c", title: "Why Techno?" },
  { id: "testimonials", letter: "d", title: "Testimonials" },
];

export default function HomeCategoryBar() {
  const [activeSection, setActiveSection] = useState<string>("introduction");

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 160;

      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i].id);
        if (el) {
          const top = el.offsetTop;
          if (scrollPosition >= top) {
            setActiveSection(sections[i].id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-neutral-200/90 shadow-sm transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
        <div className="flex items-center justify-between py-2.5 sm:py-3 gap-2 sm:gap-4 overflow-x-auto no-scrollbar">
          {/* Home Category Tag */}
          <div className="flex items-center gap-2 flex-shrink-0 pr-3 sm:pr-4 border-r border-neutral-200">
            <span className="inline-block w-1.5 h-1.5 bg-neutral-900 rounded-full" />
            <span className="text-[9px] sm:text-[10px] uppercase font-mono tracking-[0.25em] font-semibold text-neutral-900">
              CATEGORY: HOME
            </span>
          </div>

          {/* Horizontal Order of Listed Details: a. Introduction, b. Projects, c. Why Techno?, d. Testimonials with Reduced Font Size */}
          <nav
            aria-label="Home category section navigation"
            className="flex items-center gap-1 sm:gap-2 flex-nowrap"
          >
            {sections.map((sec, idx) => {
              const isActive = activeSection === sec.id;
              return (
                <React.Fragment key={sec.id}>
                  {idx > 0 && (
                    <span
                      aria-hidden="true"
                      className="text-neutral-300 text-[10px] select-none px-0.5 sm:px-1"
                    >
                      /
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => scrollTo(sec.id)}
                    className={cn(
                      "inline-flex items-center gap-1 py-1 px-2 sm:px-2.5 rounded transition-all duration-200 whitespace-nowrap",
                      "text-[9px] sm:text-[10px] uppercase tracking-[0.18em] font-mono",
                      isActive
                        ? "bg-neutral-900 text-white font-medium shadow-xs"
                        : "text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100"
                    )}
                  >
                    <span
                      className={cn(
                        "font-semibold",
                        isActive ? "text-neutral-300" : "text-neutral-400"
                      )}
                    >
                      {sec.letter}.
                    </span>
                    <span>{sec.title}</span>
                  </button>
                </React.Fragment>
              );
            })}
          </nav>

          {/* Location / Studio tag */}
          <div className="hidden md:flex items-center text-[8.5px] sm:text-[9px] font-mono tracking-[0.22em] text-neutral-400 uppercase flex-shrink-0 pl-3 border-l border-neutral-200">
            BLR · HYD · DXB
          </div>
        </div>
      </div>
    </div>
  );
}
