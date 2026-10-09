"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useCMSStore } from "@/lib/cmsStore";
import { GalleryItem } from "@/data/gallery";
import LightboxViewer from "@/components/gallery/LightboxViewer";
import { Maximize2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function GalleryPage() {
  const { gallery } = useCMSStore();
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const categories = [
    { id: "All", label: "ALL" },
    { id: "Architecture", label: "ARCHITECTURE & FACADES" },
    { id: "Interiors", label: "INTERIORS" },
    { id: "Courtyards", label: "LANDSCAPES & COURTS" },
    { id: "Details", label: "DETAILS & MATERIALITY" },
  ];

  const filteredItems = gallery.filter((item) => {
    if (activeCategory === "All") return true;
    if (activeCategory === "Architecture") return item.category === "Facades" || (item.category as string) === "Architecture";
    if (activeCategory === "Interiors") return item.category === "Interiors";
    if (activeCategory === "Courtyards") return item.category === "Landscape & Courts";
    if (activeCategory === "Details") return item.category === "Detail Views" || item.category === "Materiality" || (item.category as string) === "Details";
    return item.category === activeCategory;
  });

  const openLightbox = (item: GalleryItem) => {
    const idx = filteredItems.findIndex((i) => i.id === item.id);
    setSelectedIndex(idx >= 0 ? idx : 0);
    setLightboxOpen(true);
  };

  return (
    <div className="w-full pt-10 sm:pt-12 md:pt-14 pb-16 px-6 sm:px-10 lg:px-16 max-w-7xl mx-auto space-y-12 sm:space-y-16">
      {/* Gallery Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-neutral-200 pb-6 sm:pb-8 gap-6">
        <div className="max-w-2xl space-y-2">
          <span className="text-[10px] uppercase tracking-[0.3em] font-semibold text-neutral-400 block font-mono">
            BROWSE THE GALLERY
          </span>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-light text-neutral-900 tracking-tight">
            Gallery
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 font-light leading-relaxed tracking-wide pt-1">
            A visual collection of spaces, materials, details, models and work in progress from across the studio&apos;s projects.
          </p>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              type="button"
              className={cn(
                "text-[10px] tracking-[0.2em] uppercase py-1 px-3 transition-all duration-300",
                activeCategory === cat.id
                  ? "bg-black text-white font-medium shadow-sm"
                  : "text-neutral-500 hover:text-black hover:bg-neutral-100"
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Large-Format Visual Grid */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => openLightbox(item)}
              className="group relative block aspect-[4/3] w-full overflow-hidden bg-neutral-100 border border-neutral-200 hover:border-black transition-all duration-300 shadow-xs hover:shadow-md cursor-pointer"
            >
              <Image
                src={item.imageUrl}
                alt={item.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover transition-transform duration-700 ease-editorial group-hover:scale-105"
              />

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-neutral-950/85 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-between p-6 text-center text-white pointer-events-none">
                <div className="flex justify-between items-center text-[9px] tracking-[0.25em] text-neutral-400 uppercase">
                  <span>{item.category}</span>
                  <Maximize2 size={13} className="text-white" />
                </div>

                <div className="my-auto px-4">
                  <h3 className="font-display text-xs md:text-sm tracking-[0.3em] uppercase text-white font-medium">
                    {item.title}
                  </h3>
                  <span className="block text-[8px] tracking-[0.25em] text-neutral-400 mt-2 uppercase">
                    {item.projectTitle}
                  </span>
                </div>

                <div className="text-[9px] tracking-[0.2em] text-neutral-400 uppercase font-light">
                  {item.location} · {item.year}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center border border-dashed border-neutral-300 bg-neutral-50/50 space-y-3">
          <span className="text-[10px] uppercase font-mono tracking-widest text-neutral-400 block font-semibold">
            GALLERY ARCHIVE
          </span>
          <h3 className="font-display text-lg text-neutral-900 font-medium">
            No Images in this Category Yet
          </h3>
          <p className="text-xs text-neutral-500 max-w-md mx-auto leading-relaxed font-light">
            Selected visual documentation is continuously curated as project dossiers are published.
          </p>
          <button
            onClick={() => setActiveCategory("All")}
            type="button"
            className="text-[10px] tracking-[0.2em] uppercase font-medium bg-black text-white px-5 py-2.5 hover:bg-neutral-800 transition-colors inline-block mt-2 cursor-pointer"
          >
            View All Images
          </button>
        </div>
      )}

      {/* Fullscreen Lightbox Modal */}
      <LightboxViewer
        items={filteredItems}
        currentIndex={selectedIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onSelectIndex={setSelectedIndex}
      />
    </div>
  );
}
