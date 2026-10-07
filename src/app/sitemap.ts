import { MetadataRoute } from "next";
import { initialProjects } from "@/data/projects";
import { initialBlogPosts } from "@/data/blog";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://technoarchitecture.com";

  const staticRoutes = [
    "",
    "/about",
    "/services",
    "/projects",
    "/projects/completed",
    "/projects/ongoing",
    "/careers",
    "/contact",
    "/blog",
    "/faq",
    "/gallery",
    "/recognitions",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  const projectRoutes = initialProjects.map((p) => ({
    url: `${baseUrl}/projects/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.9,
  }));

  const blogRoutes = initialBlogPosts.map((b) => ({
    url: `${baseUrl}/blog/${b.slug}`,
    lastModified: new Date(b.publishedAt),
    changeFrequency: "monthly" as const,
    priority: 0.75,
  }));

  return [...staticRoutes, ...projectRoutes, ...blogRoutes];
}
