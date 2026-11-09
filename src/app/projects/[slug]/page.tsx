import React from "react";
import { initialProjects } from "@/data/projects";
import ProjectDetailClient from "./ProjectDetailClient";

export const revalidate = 3600;

export function generateStaticParams() {
  return initialProjects.map((p) => ({
    slug: p.slug,
  }));
}

export default function ProjectDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  return <ProjectDetailClient params={params} />;
}
