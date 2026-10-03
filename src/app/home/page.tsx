import React from "react";
import HomeIntro from "@/components/home/HomeIntro";
import HomeProjectsGrid from "@/components/home/HomeProjectsGrid";
import WhyTechno from "@/components/home/WhyTechno";

export const metadata = {
  title: "HOME — Techno Architecture | Introduction · Projects · Philosophy",
  description:
    "Explore Techno Architecture: Practice Introduction, Selected Architectural Projects, and Why Techno Philosophy. Led by architect Rajesh Shivaram.",
};

export default function HomeDirectoryPage() {
  return (
    <div className="w-full flex flex-col">
      {/* a. Introduction */}
      <HomeIntro />

      {/* b. Projects */}
      <HomeProjectsGrid />

      {/* c. Why Techno? */}
      <WhyTechno />
    </div>
  );
}
