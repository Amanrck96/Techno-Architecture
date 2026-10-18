"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { useCMSStore } from "@/lib/cmsStore";

export default function Footer() {
  const { siteSettings } = useCMSStore();

  const shortDesc =
    siteSettings?.shortDescription ||
    "Techno Architecture is an architecture and design practice creating thoughtful, practical and environmentally responsive spaces.";
  const email = siteSettings?.contact?.email || "technoarchitecture@gmail.com";
  const phone = siteSettings?.contact?.phone || "+91 80 4210 3764";
  const phoneBsnl = siteSettings?.contact?.phoneBsnl || "+91 80 2991 4561";
  const rawHours = siteSettings?.operatingHours || "Monday to Friday, 10:00 AM to 6:30 PM";
  const hours = rawHours.replace(/;\s*Saturday\s*closed/gi, "").trim();
  const address =
    siteSettings?.studios?.[0]?.address
      ? `${siteSettings.studios[0].address}, Bengaluru, ${siteSettings.studios[0].postalCode || "Karnataka 560004"}`
      : "No 9, Uttaradhi Mutt Road, Shankarpuram, Basavanagudi, Bengaluru, Karnataka 560004";
  const instagram =
    siteSettings?.socials?.find((s) => s.platform.toLowerCase() === "instagram")?.url ||
    "https://www.instagram.com/technoarchitecture_rajesh/";

  return (
    <footer className="w-full border-t border-neutral-200 bg-neutral-50 text-neutral-900 pt-16 pb-24 px-6 sm:px-10 lg:px-16">
      <div className="max-w-7xl mx-auto">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Col 1: Brand & Statement from PDF Page 14 */}
          <div className="space-y-4">
            <div className="relative w-44 h-11">
              <Image
                src="/techno-logo-transparent.png"
                alt="Techno Architecture"
                fill
                unoptimized
                sizes="360px"
                className="object-contain object-left"
              />
            </div>
            <p className="text-xs leading-relaxed text-neutral-600 max-w-sm tracking-wide font-light">
              {shortDesc}
            </p>
            <div className="pt-2">
              <span className="text-[10px] tracking-[0.2em] uppercase text-neutral-400 block mb-1">
                General Inquiries
              </span>
              <a
                href={`mailto:${email}`}
                className="text-xs text-black hover:underline flex items-center gap-1 group font-medium"
              >
                {email}
                <ArrowUpRight size={12} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            </div>
          </div>

          {/* Col 2: Studio Information */}
          <div className="space-y-3">
            <h3 className="text-[11px] font-semibold tracking-[0.25em] text-neutral-900 uppercase mb-4">
              Studio
            </h3>
            <div className="text-xs text-neutral-600 space-y-1 font-light">
              <strong className="text-neutral-900 block font-medium">Techno Architecture</strong>
              <p className="leading-relaxed">{address}</p>
              <div className="pt-2 text-[11px] font-mono text-neutral-800 space-y-0.5">
                <p>
                  <span className="text-neutral-400 font-sans text-[10px] uppercase tracking-wider mr-1">Office:</span>
                  <a href={`tel:${phone.replace(/\s+/g, "")}`} className="hover:underline">{phone}</a>
                </p>
                {phoneBsnl && (
                  <p>
                    <span className="text-neutral-400 font-sans text-[10px] uppercase tracking-wider mr-1">BSNL:</span>
                    <a href={`tel:${phoneBsnl.replace(/\s+/g, "")}`} className="hover:underline">{phoneBsnl}</a>
                  </p>
                )}
              </div>
              <p className="text-[11px] text-neutral-500 pt-1">{hours}</p>
            </div>
            <div className="pt-2">
              <a
                href={instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-black font-medium hover:underline inline-flex items-center gap-1"
              >
                <span>@technoarchitecture_rajesh</span>
                <ArrowUpRight size={11} />
              </a>
            </div>
          </div>

          {/* Col 3: Navigation Index (All 10 links from PDF Page 14) */}
          <div>
            <h3 className="text-[11px] font-semibold tracking-[0.25em] text-neutral-900 uppercase mb-4">
              Index
            </h3>
            <ul className="grid grid-cols-2 gap-2 text-xs text-neutral-600">
              <li>
                <Link href="/" className="hover:text-black transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-black transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-black transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/projects" className="hover:text-black transition-colors">
                  Projects
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-black transition-colors">
                  Gallery
                </Link>
              </li>
              <li>
                <Link href="/about#team" className="hover:text-black transition-colors">
                  Team
                </Link>
              </li>
              <li>
                <Link href="/careers" className="hover:text-black transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-black transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-black transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/recognitions" className="hover:text-black transition-colors">
                  Recognitions
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Dispatch / Newsletter */}
          <div className="space-y-4">
            <h3 className="text-[11px] font-semibold tracking-[0.25em] text-neutral-900 uppercase mb-4">
              Monograph Dispatch
            </h3>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Occasional dispatches documenting spatial research, material experiments, and monograph releases.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert("Thank you for subscribing to Techno Architecture monographs.");
              }}
              className="flex items-center border-b border-neutral-300 py-1 focus-within:border-black transition-colors"
            >
              <input
                type="email"
                required
                placeholder="Enter email address"
                aria-label="Email address for monograph dispatch"
                className="bg-transparent text-xs w-full focus:outline-none placeholder:text-neutral-400 text-black"
              />
              <button
                type="submit"
                aria-label="Subscribe"
                className="text-[10px] tracking-widest uppercase font-medium text-neutral-800 hover:text-black ml-2"
              >
                JOIN
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-neutral-200 flex flex-col sm:flex-row justify-between items-center text-[10px] tracking-wider text-neutral-400 gap-4">
          <p>© {new Date().getFullYear()} TECHNO ARCHITECTURE & DESIGN STUDIO. ALL RIGHTS RESERVED.</p>
          <div className="flex items-center space-x-6">
            <Link href="/faq" className="hover:text-neutral-600 transition-colors">
              Privacy & Cookies
            </Link>
            <Link href="/about" className="hover:text-neutral-600 transition-colors">
              Legal Notice
            </Link>
            <Link href="/admin" className="text-neutral-600 hover:text-black font-semibold transition-colors">
              Owner Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
