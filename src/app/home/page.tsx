import React from "react";
import HomeIntro from "@/components/home/HomeIntro";
import HomeProjectsGrid from "@/components/home/HomeProjectsGrid";
import HomeTeamSection from "@/components/home/HomeTeamSection";
import WhyTechno from "@/components/home/WhyTechno";

export const metadata = {
  title: "HOME — Techno Architecture | Introduction · Projects · Team · Philosophy",
  description:
    "Explore Techno Architecture: Practice Introduction, Selected Architectural Projects, Architects & Specialists Team, and Why Techno Philosophy. Led by architect Rajesh Shivaram.",
};

export default function HomeDirectoryPage() {
  return (
    <div className="w-full flex flex-col">
      {/* a. Introduction */}
      <HomeIntro />

      {/* b. Projects (Only 10 Completed Projects) */}
      <HomeProjectsGrid />

      {/* c. Studio Practitioners & Specialists Team */}
      <HomeTeamSection />

      {/* d. Why Techno? */}
      <WhyTechno />
    </div>
  );
}
