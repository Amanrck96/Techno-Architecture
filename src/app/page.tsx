import HeroSection from "@/components/home/HeroSection";
import HomeProjectsGrid from "@/components/home/HomeProjectsGrid";
import WhyTechno from "@/components/home/WhyTechno";
import TestimonialsSection from "@/components/home/TestimonialsSection";

export const metadata = {
  title: "TECHNO ARCHITECTURE — Architecture · Space · Form",
  description:
    "An award-winning architecture and spatial design practice crafting contemporary, context-driven residential, commercial, and civic environments.",
};

export default function HomePage() {
  return (
    <div className="w-full flex flex-col">
      {/* Hero with Positioning Statement */}
      <HeroSection />

      {/* Curated Project Grid in reference-style 3-column format */}
      <HomeProjectsGrid />

      {/* Why Techno? In-depth narrative and metrics */}
      <WhyTechno />

      {/* Testimonials */}
      <TestimonialsSection />
    </div>
  );
}
