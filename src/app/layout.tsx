import type { Metadata } from "next";
import "@/styles/globals.css";
import SiteShell from "@/components/layout/SiteShell";

export const metadata: Metadata = {
  metadataBase: new URL("https://technoarchitecture.com"),
  title: {
    default: "TECHNO ARCHITECTURE — Architecture · Space · Form",
    template: "%s | TECHNO ARCHITECTURE",
  },
  description:
    "Techno Architecture is an architecture and design practice creating thoughtful, practical and environmentally responsive spaces.",
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
        url: "/projects/aikya/elevation-east.jpg",
        width: 1200,
        height: 630,
        alt: "Techno Architecture AIKYA",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TECHNO ARCHITECTURE",
    description:
      "Contemporary architecture and spatial design practice crafting context-driven environments.",
    images: ["/projects/aikya/elevation-east.jpg"],
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
      "Techno Architecture is an architecture and design practice creating thoughtful, practical and environmentally responsive spaces.",
    telephone: "080 4210 3764",
    email: "technoarchitecture@gmail.com",
    address: {
      "@type": "PostalAddress",
      streetAddress: "No. 9, Uttaradi Mutt Road, Shankarpuram, Basavanagudi",
      addressLocality: "Bengaluru",
      addressRegion: "Karnataka",
      postalCode: "560004",
      addressCountry: "IN",
    },
    sameAs: [
      "https://www.instagram.com/technoarchitecture_rajesh/",
    ],
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased min-h-screen bg-white text-neutral-900 selection:bg-black selection:text-white">
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
