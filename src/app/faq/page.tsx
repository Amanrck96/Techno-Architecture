"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCMSStore } from "@/lib/cmsStore";
import { Plus, Minus, Search, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function FAQPage() {
  const { faq } = useCMSStore();
  const [openIds, setOpenIds] = useState<string[]>(["faq-1"]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = [
    "All",
    "Design Philosophy",
    "Engagement & Process",
    "Fees & Timelines",
    "Sustainability",
    "Technical & BIM",
  ];

  const toggleFAQ = (id: string) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const filteredFAQs = faq.filter((item) => {
    const matchesCat =
      selectedCategory === "All" || item.category === selectedCategory;
    const matchesSearch =
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="w-full py-10 md:py-16 px-6 md:px-12 lg:px-16 max-w-5xl mx-auto space-y-12">
      {/* Page Header */}
      <div className="border-b border-neutral-200 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="text-[10px] uppercase tracking-[0.3em] font-semibold text-neutral-400 block">
            ENGAGEMENT CLARITY
          </span>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-light text-neutral-900 tracking-tight mt-2">
            Frequently Addressed Questions
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 max-w-xl mt-2 tracking-wide font-light">
            Inquiries regarding our architectural philosophy, fee structures, Level-2 BIM coordination, and commission timelines.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <input
            type="text"
            placeholder="Search questions or topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs py-2 pl-8 pr-3 border border-neutral-300 focus:border-black focus:outline-none transition-colors"
          />
          <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400" />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            type="button"
            className={cn(
              "text-[10px] tracking-[0.2em] uppercase py-1 px-3 transition-all duration-300",
              selectedCategory === cat
                ? "bg-black text-white font-medium shadow-sm"
                : "text-neutral-500 hover:text-black hover:bg-neutral-100"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Accordion List */}
      <div className="space-y-4">
        {filteredFAQs.map((item) => {
          const isOpen = openIds.includes(item.id);

          return (
            <div
              key={item.id}
              id={item.id}
              className="border border-neutral-200 bg-white transition-colors hover:border-neutral-400"
            >
              <button
                onClick={() => toggleFAQ(item.id)}
                aria-expanded={isOpen}
                className="w-full p-5 sm:p-6 text-left flex items-start justify-between gap-4 focus:outline-none"
              >
                <div>
                  <span className="text-[9px] uppercase font-mono tracking-widest text-neutral-400 block mb-1">
                    {item.category}
                  </span>
                  <h2 className="font-display text-sm sm:text-base font-medium text-neutral-900">
                    {item.question}
                  </h2>
                </div>

                <span className="text-neutral-400 hover:text-black p-1 flex-shrink-0 transition-transform">
                  {isOpen ? <Minus size={16} /> : <Plus size={16} />}
                </span>
              </button>

              {isOpen && (
                <div className="px-5 sm:px-6 pb-6 pt-0 text-xs sm:text-sm text-neutral-600 leading-relaxed font-light border-t border-neutral-100 mt-2 pt-4">
                  <p>{item.answer}</p>
                </div>
              )}
            </div>
          );
        })}

        {filteredFAQs.length === 0 && (
          <div className="p-12 text-center text-xs text-neutral-500 border border-dashed border-neutral-300">
            No matching questions found for &ldquo;{searchQuery}&rdquo;. Try another term or submit your query directly.
          </div>
        )}
      </div>

      {/* Unresolved Question Prompt */}
      <div className="p-8 bg-neutral-50 border border-neutral-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="font-display text-base font-medium text-neutral-900">
            Have a specific programmatic or site inquiry?
          </h3>
          <p className="text-xs text-neutral-500 mt-0.5">
            Our principals are glad to discuss plot feasibility and zoning parameters.
          </p>
        </div>
        <Link
          href="/contact"
          className="text-xs uppercase tracking-[0.2em] font-medium bg-black text-white px-5 py-2.5 hover:bg-neutral-800 transition-colors flex items-center gap-1.5"
        >
          <span>Submit Inquiry</span>
          <ArrowUpRight size={13} />
        </Link>
      </div>
    </div>
  );
}
