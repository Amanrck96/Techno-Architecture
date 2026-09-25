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
    { id: "Architecture", label: "ARCHITECTURE" },
    { id: "Interiors", label: "INTERIORS" },
    { id: "Details", label: "DETAILS" },
    { id: "Models and Drawings", label: "MODELS AND DRAWINGS" },
    { id: "On Site", label: "ON SITE" },
  ];

  const filteredItems = gallery.filter((item) => {
    if (activeCategory === "All") return true;
    if (activeCategory === "Architecture") return item.category === "Facades" || (item.category as string) === "Architecture";
    if (activeCategory === "Interiors") return item.category === "Interiors";
    if (activeCategory === "Details") return item.category === "Detail Views" || item.category === "Materiality" || (item.category as string) === "Details";
    if (activeCategory === "Models and Drawings") return (item.category as string) === "Models and Drawings" || item.category === "Landscape & Courts";
    if (activeCategory === "On Site") return (item.category as string) === "On Site";
    return item.category === activeCategory;
  });

  const openLightbox = (item: GalleryItem) => {
    const idx = filteredItems.findIndex((i) => i.id === item.id);
    setSelectedIndex(idx >= 0 ? idx : 0);
    setLightboxOpen(true);
  };

  return (
    <div className="w-full py-10 md:py-14 px-4 md:px-8 max-w-[1720px] mx-auto space-y-8">
      {/* Gallery Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-neutral-200 pb-6 gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-[0.3em] font-semibold text-neutral-400 block font-mono">
            BROWSE THE GALLERY
          </span>
          <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-light text-neutral-900 tracking-tight mt-1">
            Gallery
          </h1>
          <p className="text-xs text-neutral-500 max-w-xl mt-1.5 font-light leading-relaxed">
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            onClick={() => openLightbox(item)}
            className="group relative block aspect-[4/3] w-full overflow-hidden bg-neutral-100 cursor-pointer"
          >
            <Image
              src={item.imageUrl}
              alt={item.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-700 ease-editorial group-hover:scale-105"
            />

            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-neutral-950/85 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-between p-6 text-center text-white">
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
