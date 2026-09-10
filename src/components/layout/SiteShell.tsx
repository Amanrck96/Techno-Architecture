"use client";

import React from "react";
import { usePathname } from "next/navigation";
import DesktopRailNav from "@/components/layout/DesktopRailNav";
import MobileNav from "@/components/layout/MobileNav";
import Footer from "@/components/layout/Footer";
import CookieConsent from "@/components/common/CookieConsent";
import CustomCursor from "@/components/common/CustomCursor";

export default function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLandingPage = pathname === "/";

  if (isLandingPage) {
    // Pure landing experience matching Studio Bomb: Only gallery animation + logo
    return (
      <>
        <CustomCursor />
        <main id="main-content" className="w-full h-screen overflow-hidden">
          {children}
        </main>
        <CookieConsent />
      </>
    );
  }

  // Second page & all other interior pages: Full architectural layout with navigation and footer
  return (
    <>
      {/* Accessible Skip Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 z-[9999] bg-black text-white px-4 py-2 text-xs uppercase tracking-widest outline-none"
      >
        Skip to main content
      </a>

      {/* Custom Subtle Architectural Cursor */}
      <CustomCursor />

      {/* Desktop Fixed Right-Rail Navigation */}
      <DesktopRailNav />

      {/* Mobile Top Header Navigation */}
      <MobileNav />

      {/* Main Content Area with Desktop Right-Rail Offset */}
      <div className="flex flex-col min-h-screen lg:mr-20 xl:mr-24 pt-[57px] lg:pt-0">
        <main id="main-content" className="flex-grow focus:outline-none">
          {children}
        </main>
        <Footer />
      </div>

      {/* Cookie Consent Banner */}
      <CookieConsent />
    </>
  );
}
