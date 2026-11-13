import React from "react";
import ProjectsClient from "./ProjectsClient";

export const dynamic = "force-static";

export const metadata = {
  title: "PROJECTS — Techno Architecture | Selected Works & Portfolios",
  description:
    "Explore Techno Architecture portfolio: Residential, Commercial, Hospitality, and Interior architecture projects across Bengaluru and India. Led by architect Rajesh Shivaram.",
};

export default function ProjectsDirectoryPage() {
  return <ProjectsClient />;
}
