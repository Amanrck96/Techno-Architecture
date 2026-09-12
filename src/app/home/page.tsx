import React from "react";
import HomeCategoryBar from "@/components/home/HomeCategoryBar";
import HomeIntro from "@/components/home/HomeIntro";
import HomeProjectsGrid from "@/components/home/HomeProjectsGrid";
import WhyTechno from "@/components/home/WhyTechno";
import TestimonialsSection from "@/components/home/TestimonialsSection";

export const metadata = {
  title: "HOME — Techno Architecture | Introduction · Projects · Philosophy · Testimonials",
  description:
    "Explore Techno Architecture: Practice Introduction, Selected Architectural Projects, Why Techno Philosophy, and Client Testimonials.",
};

export default function HomeDirectoryPage() {
  return (
    <div className="w-full flex flex-col">
      {/* Home Category Header Bar: Arranged in Horizontal Order with Reduced Font Size */}
      <HomeCategoryBar />

      {/* a. Introduction */}
      <HomeIntro />

      {/* b. Projects */}
      <HomeProjectsGrid />

      {/* c. Why Techno? */}
      <WhyTechno />

      {/* d. Testimonials */}
      <TestimonialsSection />
    </div>
  );
}
