import React from "react";
import AboutContent from "@/components/about/AboutContent";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "About Us | Techno Architecture",
  description:
    "Techno Architecture is an architecture and design practice led by Rajesh Shivaram, established in 2006 in Basavanagudi, Bengaluru.",
};

export default function AboutPage() {
  return <AboutContent />;
}

