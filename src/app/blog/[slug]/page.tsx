"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { useCMSStore } from "@/lib/cmsStore";
import { formatDate } from "@/lib/utils";
import { ArrowLeft, ArrowUpRight, Clock } from "lucide-react";

export default function BlogArticlePage() {
  const params = useParams();
  const slug = params?.slug as string;
  const { blog } = useCMSStore();

  const post = blog.find((p) => p.slug === slug);
  if (!post) return notFound();

  const related = blog.filter((p) => post.relatedSlugs?.includes(p.slug));

  return (
    <article className="w-full pt-10 sm:pt-12 md:pt-14 pb-16 px-6 sm:px-10 lg:px-16 max-w-7xl mx-auto space-y-12">
      {/* Breadcrumbs */}
      <div className="border-b border-neutral-200 pb-4">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] font-mono font-medium text-neutral-500 hover:text-black transition-colors"
        >
          <ArrowLeft size={13} />
          <span>ALL MONOGRAPHS & ESSAYS</span>
        </Link>
      </div>

      {/* Article Header */}
      <div className="space-y-4">
        <div className="flex items-center space-x-3 text-[10px] uppercase font-mono tracking-widest text-neutral-400">
          <span className="text-black font-semibold">{post.category}</span>
          <span>·</span>
          <span>{formatDate(post.publishedAt)}</span>
          <span>·</span>
          <span className="flex items-center gap-1">
            <Clock size={11} />
            {post.readingTime}
          </span>
        </div>

        <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-light text-neutral-900 leading-tight">
          {post.title}
        </h1>

        {/* Author Bio Snippet */}
        <div className="flex items-center space-x-3 pt-3">
          <div className="relative w-10 h-10 rounded-full overflow-hidden bg-neutral-200">
            <Image
              src={post.author.avatar}
              alt={post.author.name}
              fill
              className="object-cover"
            />
          </div>
          <div>
            <div className="text-xs font-semibold text-neutral-900">{post.author.name}</div>
            <div className="text-[10px] text-neutral-500 font-mono">{post.author.role}</div>
          </div>
        </div>
      </div>

      {/* Hero Image */}
      <div className="relative w-full aspect-[16/9] bg-neutral-100 overflow-hidden">
        <Image
          src={post.heroImage}
          alt={post.title}
          fill
          priority
          sizes="100vw"
          unoptimized={post.heroImage.startsWith("data:")}
          className="object-cover"
          style={{
            objectPosition: `${post.imagePositionX ?? 50}% ${post.imagePositionY ?? 50}%`,
            transform: post.imageScale && post.imageScale !== 1 ? `scale(${post.imageScale})` : undefined,
          }}
        />
      </div>

      {/* Article Body Content */}
      <div className="space-y-8 text-neutral-800 font-light leading-relaxed text-sm md:text-base">
        <p className="text-base md:text-lg text-neutral-900 leading-relaxed font-normal border-l-2 border-black pl-4 my-6 italic">
          {post.content.introduction}
        </p>

        {post.content.sections.map((sec, idx) => (
          <section key={idx} className="space-y-4 pt-4">
            <h2 className="font-display text-xl sm:text-2xl font-medium text-neutral-900 tracking-tight">
              {sec.heading}
            </h2>
            {sec.body.map((p, pIdx) => (
              <p key={pIdx} className="leading-relaxed">
                {p}
              </p>
            ))}
            {sec.image && (
              <figure className="my-6 space-y-2">
                <div className="relative w-full aspect-[16/10] bg-neutral-100 overflow-hidden rounded">
                  <Image
                    src={sec.image}
                    alt={sec.heading}
                    fill
                    sizes="(max-width: 1024px) 100vw, 800px"
                    unoptimized={sec.image.startsWith("data:")}
                    className="object-cover"
                    style={{
                      objectPosition: `${sec.imagePositionX ?? 50}% ${sec.imagePositionY ?? 50}%`,
                    }}
                  />
                </div>
                {sec.imageCaption && (
                  <figcaption className="text-[11px] text-neutral-500 font-mono italic text-center">
                    {sec.imageCaption}
                  </figcaption>
                )}
              </figure>
            )}
            {sec.quote && (
              <blockquote className="p-6 bg-neutral-50 border-y border-neutral-200 text-base md:text-lg font-display text-neutral-900 font-light italic my-6">
                &ldquo;{sec.quote}&rdquo;
              </blockquote>
            )}
          </section>
        ))}

        <div className="pt-6 border-t border-neutral-200">
          <p className="font-medium text-neutral-900">
            {post.content.conclusion}
          </p>
        </div>

        {/* Tags */}
        <div className="pt-6 flex flex-wrap gap-2">
          {post.tags.map((t, idx) => (
            <span
              key={idx}
              className="text-[9px] uppercase tracking-wider bg-neutral-100 text-neutral-600 px-2.5 py-1"
            >
              #{t}
            </span>
          ))}
        </div>
      </div>

      {/* Related Essays */}
      {related.length > 0 && (
        <section className="pt-12 border-t border-neutral-200 space-y-6">
          <h3 className="text-[10px] uppercase tracking-[0.3em] font-semibold text-neutral-900">
            RELATED RESEARCH MONOGRAPHS
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {related.map((rel) => (
              <Link
                key={rel.id}
                href={`/blog/${rel.slug}`}
                className="p-5 bg-neutral-50 border border-neutral-200 hover:border-black transition-colors block space-y-2 group"
              >
                <div className="text-[9px] uppercase font-mono tracking-widest text-neutral-400">
                  {rel.category} · {rel.readingTime}
                </div>
                <h4 className="font-display text-sm font-medium text-neutral-900 group-hover:underline">
                  {rel.title}
                </h4>
                <div className="text-[10px] text-black font-semibold flex items-center gap-1 pt-1">
                  <span>Read Monograph</span>
                  <ArrowUpRight size={11} />
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
