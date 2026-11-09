"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCMSStore } from "@/lib/cmsStore";
import { BlogPost } from "@/data/blog";
import { formatDate } from "@/lib/utils";
import { Search, Clock, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function BlogListingClient() {
  const { blog } = useCMSStore();
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const categories = [
    "All",
    "Materiality",
    "Sustainability",
    "Spatial Theory",
    "Monographs",
    "Urbanism",
  ];

  const filteredPosts = blog.filter((post) => {
    const matchesCat =
      selectedCategory === "All" || post.category === selectedCategory;
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const featured = blog.find((p) => p.featured) || blog[0];

  return (
    <div className="w-full pt-10 sm:pt-12 md:pt-14 pb-16 px-6 sm:px-10 lg:px-16 max-w-7xl mx-auto space-y-12 sm:space-y-16">
      {/* Page Header */}
      <div className="border-b border-neutral-200 pb-6 sm:pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="max-w-3xl space-y-2">
          <span className="text-[10px] uppercase tracking-[0.3em] font-semibold text-neutral-400 block font-mono">
            RESEARCH & WRITING
          </span>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-light text-neutral-900 tracking-tight">
            Architectural Monographs & Essays
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 font-light leading-relaxed tracking-wide pt-1">
            Critical observations on concrete tectonics, mass timber futures, passive thermodynamics, and heritage restoration.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="relative w-full md:w-72">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search essays or materials..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-neutral-300 rounded text-xs focus:outline-none focus:border-black font-light"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2 pt-1 border-b border-neutral-100 pb-4">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={cn(
              "text-[10px] uppercase font-mono tracking-widest px-3 py-1.5 transition-colors cursor-pointer",
              selectedCategory === cat
                ? "bg-black text-white font-semibold"
                : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Featured Article Hero (Shown when All is selected & no search query) */}
      {selectedCategory === "All" && !searchQuery && featured && (
        <section className="space-y-4">
          <span className="text-[9px] uppercase tracking-[0.25em] font-semibold text-neutral-400 font-mono block">
            FEATURED MONOGRAPH
          </span>
          <Link
            href={`/blog/${featured.slug}`}
            className="group grid grid-cols-1 lg:grid-cols-12 gap-8 bg-neutral-50 border border-neutral-200 p-6 sm:p-8 hover:border-black transition-all"
          >
            <div className="lg:col-span-7 relative aspect-[16/10] bg-neutral-100 overflow-hidden">
              <Image
                src={featured.heroImage}
                alt={featured.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 60vw"
                unoptimized={featured.heroImage?.startsWith("data:")}
                className="object-cover group-hover:scale-105 transition-transform duration-700"
                style={{
                  objectPosition: `${featured.imagePositionX ?? 50}% ${featured.imagePositionY ?? 50}%`,
                  transform: featured.imageScale && featured.imageScale !== 1 ? `scale(${featured.imageScale})` : undefined,
                }}
              />
            </div>
            <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-[10px] uppercase font-mono tracking-widest text-neutral-400">
                  <span className="text-black font-semibold">{featured.category}</span>
                  <span>·</span>
                  <span>{formatDate(featured.publishedAt)}</span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Clock size={11} />
                    {featured.readingTime}
                  </span>
                </div>
                <h2 className="font-display text-2xl sm:text-3xl font-light text-neutral-900 group-hover:underline leading-snug">
                  {featured.title}
                </h2>
                <p className="text-xs sm:text-sm text-neutral-600 font-light leading-relaxed">
                  {featured.excerpt}
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-neutral-200">
                <div className="text-[10px] text-neutral-500 font-mono">
                  By {featured.author?.name || "Techno Architecture"}
                </div>
                <div className="inline-flex items-center gap-1 text-[10px] font-semibold text-black uppercase tracking-wider group-hover:translate-x-1 transition-transform">
                  <span>Read Monograph</span>
                  <ArrowUpRight size={13} />
                </div>
              </div>
            </div>
          </Link>
        </section>
      )}

      {/* Article Grid */}
      <section className="space-y-6">
        <div className="flex justify-between items-center text-[10px] uppercase font-mono text-neutral-400 border-b border-neutral-100 pb-2">
          <span>{filteredPosts.length} Research Essays</span>
          <span>Category: {selectedCategory}</span>
        </div>

        {filteredPosts.length === 0 ? (
          <div className="text-center py-16 space-y-2">
            <p className="text-sm text-neutral-600 font-light">No essays found matching your criteria.</p>
            <button
              onClick={() => {
                setSelectedCategory("All");
                setSearchQuery("");
              }}
              className="text-xs underline text-neutral-900"
            >
              Reset filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group flex flex-col justify-between bg-white border border-neutral-200 hover:border-black transition-all p-5 space-y-4"
              >
                <div className="space-y-3">
                  <div className="relative aspect-[16/10] bg-neutral-100 overflow-hidden">
                    <Image
                      src={post.heroImage}
                      alt={post.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      unoptimized={post.heroImage?.startsWith("data:")}
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                      style={{
                        objectPosition: `${post.imagePositionX ?? 50}% ${post.imagePositionY ?? 50}%`,
                        transform: post.imageScale && post.imageScale !== 1 ? `scale(${post.imageScale})` : undefined,
                      }}
                    />
                  </div>
                  <div className="flex items-center space-x-2 text-[9px] uppercase font-mono tracking-widest text-neutral-400">
                    <span className="text-black font-semibold">{post.category}</span>
                    <span>·</span>
                    <span>{formatDate(post.publishedAt)}</span>
                  </div>
                  <h3 className="font-display text-base font-medium text-neutral-900 group-hover:underline line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-xs text-neutral-500 font-light line-clamp-2 leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>

                <div className="pt-3 border-t border-neutral-100 flex items-center justify-between text-[10px]">
                  <span className="text-neutral-400 font-mono">{post.readingTime}</span>
                  <span className="font-semibold text-black inline-flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                    <span>Read</span>
                    <ArrowUpRight size={11} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

