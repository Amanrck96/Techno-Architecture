"use client";

import React from "react";
import { usePathname } from "next/navigation";
import DesktopRailNav from "@/components/layout/DesktopRailNav";
import MobileNav from "@/components/layout/MobileNav";
import Footer from "@/components/layout/Footer";
import CookieConsent from "@/components/common/CookieConsent";
import WhatsAppButton from "@/components/layout/WhatsAppButton";

export default function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLandingPage = pathname === "/";
  const isAdminPage = pathname.startsWith("/admin");

  if (isAdminPage) {
    // Dedicated full-width admin studio console without public site navigation rail or public footer
    return (
      <main id="main-content" className="w-full min-h-screen">
        {children}
      </main>
    );
  }

  if (isLandingPage) {
    // Pure landing experience matching Studio Bomb: Only gallery animation + logo
    return (
      <main id="main-content" className="w-full h-screen overflow-hidden">
        {children}
      </main>
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

      {/* Desktop Fixed Right-Rail Navigation */}
      <DesktopRailNav />

      {/* Mobile Top Header Navigation */}
      <MobileNav />

      {/* Main Content Area with Desktop Right-Rail Offset */}
      <div className="flex flex-col min-h-screen lg:mr-28 xl:mr-32 2xl:mr-36 pt-[57px] lg:pt-0">
        <main id="main-content" className="flex-grow focus:outline-none">
          {children}
        </main>
        <Footer />
      </div>

      {/* Floating WhatsApp Bot */}
      <WhatsAppButton />

      {/* Cookie Consent Banner */}
      <CookieConsent />
    </>
  );
}
