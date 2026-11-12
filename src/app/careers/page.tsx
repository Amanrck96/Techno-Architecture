import React from "react";
import CareersClient from "./CareersClient";

export const dynamic = "force-static";
export const revalidate = 60;

export const metadata = {
  title: "Careers & Internships | Techno Architecture",
  description:
    "Explore architecture career and internship opportunities at Techno Architecture Studio, Basavanagudi, Bengaluru.",
};

export default function CareersPage() {
  return <CareersClient />;
}
