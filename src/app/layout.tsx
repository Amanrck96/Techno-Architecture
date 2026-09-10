import type { Metadata } from "next";
import { Source_Sans_3, Archivo } from "next/font/google";
import "@/styles/globals.css";
import DesktopRailNav from "@/components/layout/DesktopRailNav";
import MobileNav from "@/components/layout/MobileNav";
import Footer from "@/components/layout/Footer";
import CookieConsent from "@/components/common/CookieConsent";
import CustomCursor from "@/components/common/CustomCursor";

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-source-sans",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://technoarchitecture.com"),
  title: {
    default: "TECHNO ARCHITECTURE — Architecture · Space · Form",
    template: "%s | TECHNO ARCHITECTURE",
  },
  description:
    "Techno is an award-winning contemporary architecture and spatial design practice crafting context-driven residential, commercial, and civic environments.",
  keywords: [
    "Techno Architecture",
    "contemporary architects Bangalore",
    "luxury residential architects",
    "mass timber commercial architecture",
    "minimalist architectural design",
    "interior architecture studio",
    "sustainable passive buildings",
  ],
  authors: [{ name: "Techno Architecture Studio" }],
  creator: "Techno Architecture",
  publisher: "Techno Architecture",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "TECHNO ARCHITECTURE — Architecture · Space · Form",
    description:
      "Award-winning contemporary architecture and spatial design practice crafting context-driven environments.",
    url: "https://technoarchitecture.com",
    siteName: "Techno Architecture",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
        width: 1200,
        height: 630,
        alt: "Techno Architecture Monolith House",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TECHNO ARCHITECTURE",
    description:
      "Contemporary architecture and spatial design practice crafting context-driven environments.",
    images: ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ArchitecturalFirm",
    name: "Techno Architecture & Design Studio",
    url: "https://technoarchitecture.com",
    logo: "https://technoarchitecture.com/logo.png",
    description:
      "Contemporary architecture and spatial design practice crafting context-driven residential, commercial, and civic environments.",
    telephone: "+91 80 2661 4820",
    email: "studio@technoarchitecture.com",
    address: {
      "@type": "PostalAddress",
      streetAddress: "No. 44, 4th Main Road, Basavanagudi",
      addressLocality: "Bengaluru",
      addressRegion: "Karnataka",
      postalCode: "560004",
      addressCountry: "IN",
    },
    sameAs: [
      "https://instagram.com/techno.architecture",
      "https://linkedin.com/company/techno-architecture",
    ],
  };

  return (
    <html lang="en" className={`${sourceSans.variable} ${archivo.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased min-h-screen bg-white text-neutral-900 selection:bg-black selection:text-white">
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

        {/* Main Content Area — Offset for Desktop Right Rail (w-20 / w-24) */}
        <div className="flex flex-col min-h-screen lg:mr-20 xl:mr-24 pt-[57px] lg:pt-0">
          <main id="main-content" className="flex-grow focus:outline-none">
            {children}
          </main>
          <Footer />
        </div>

        {/* Cookie Consent Banner */}
        <CookieConsent />
      </body>
    </html>
  );
}
