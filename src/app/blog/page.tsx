"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCMSStore } from "@/lib/cmsStore";
import { BlogPost } from "@/data/blog";
import { formatDate } from "@/lib/utils";
import { Search, Clock, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function BlogListingPage() {
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
    <div className="w-full py-10 md:py-16 px-6 md:px-12 lg:px-16 max-w-7xl mx-auto space-y-16">
      {/* Page Header */}
      <div className="border-b border-neutral-200 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="text-[10px] uppercase tracking-[0.3em] font-semibold text-neutral-400 block">
            RESEARCH & WRITING
          </span>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-light text-neutral-900 tracking-tight mt-2">
            Architectural Monographs & Essays
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 max-w-xl mt-2 tracking-wide font-light">
            Critical observations on concrete tectonics, mass timber futures, passive thermodynamics, and heritage restoration.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <input
            type="text"
            placeholder="Search essays or materials..."
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

      {/* Featured Lead Monograph */}
      {featured && selectedCategory === "All" && !searchQuery && (
        <article className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 bg-neutral-50 p-6 sm:p-10 border border-neutral-200 items-center">
          <div className="lg:col-span-7 relative aspect-[16/10] w-full bg-neutral-200 overflow-hidden">
            <Image
              src={featured.heroImage}
              alt={featured.title}
              fill
              sizes="(max-width: 1024px) 100vw, 60vw"
              priority
              className="object-cover"
            />
          </div>

          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center space-x-3 text-[10px] uppercase font-mono tracking-widest text-neutral-400">
              <span className="text-black font-semibold">{featured.category}</span>
              <span>·</span>
              <span>{featured.readingTime}</span>
            </div>

            <h2 className="font-display text-xl sm:text-2xl font-light text-neutral-900 leading-snug">
              <Link href={`/blog/${featured.slug}`} className="hover:underline">
                {featured.title}
              </Link>
            </h2>

            <p className="text-xs text-neutral-600 leading-relaxed font-light">
              {featured.excerpt}
            </p>

            <div className="pt-4 flex items-center justify-between border-t border-neutral-200">
              <div className="text-[10px] text-neutral-500 font-mono">
                By {featured.author.name} · {formatDate(featured.publishedAt)}
              </div>
              <Link
                href={`/blog/${featured.slug}`}
                className="text-[10px] uppercase tracking-[0.2em] font-medium text-black hover:underline flex items-center gap-1"
              >
                <span>Read Monograph</span>
                <ArrowUpRight size={12} />
              </Link>
            </div>
          </div>
        </article>
      )}

      {/* Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredPosts.map((post: BlogPost) => (
          <article
            key={post.id}
            className="group flex flex-col justify-between border border-neutral-200 bg-white overflow-hidden hover:border-black transition-colors"
          >
            <div>
              <div className="relative aspect-[16/10] w-full bg-neutral-100 overflow-hidden">
                <Image
                  src={post.heroImage}
                  alt={post.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-editorial"
                />
              </div>

              <div className="p-6 space-y-3">
                <div className="flex items-center justify-between text-[9px] uppercase font-mono tracking-widest text-neutral-400">
                  <span className="text-neutral-800 font-semibold">{post.category}</span>
                  <span className="flex items-center gap-1">
                    <Clock size={10} />
                    {post.readingTime}
                  </span>
                </div>

                <h3 className="font-display text-base font-medium text-neutral-900 leading-snug group-hover:underline">
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </h3>

                <p className="text-xs text-neutral-600 leading-relaxed line-clamp-3 font-light">
                  {post.excerpt}
                </p>
              </div>
            </div>

            <div className="p-6 pt-0 border-t border-neutral-100 flex items-center justify-between text-[10px] text-neutral-500 font-mono mt-4">
              <span>{formatDate(post.publishedAt)}</span>
              <Link
                href={`/blog/${post.slug}`}
                className="uppercase tracking-[0.15em] font-medium text-black hover:underline flex items-center gap-0.5"
              >
                <span>Read</span>
                <ArrowUpRight size={11} />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
