import React from "react";
import { initialBlogPosts } from "@/data/blog";
import BlogArticleClient from "./BlogArticleClient";

export const revalidate = 3600;

export function generateStaticParams() {
  return initialBlogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export default function BlogArticlePage({
  params,
}: {
  params: { slug: string };
}) {
  return <BlogArticleClient params={params} />;
}
