"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full border-t border-neutral-200 bg-neutral-50 text-neutral-900 pt-16 pb-24 px-6 md:px-12 lg:pr-28">
      <div className="max-w-7xl mx-auto">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Col 1: Brand & Statement */}
          <div className="space-y-4">
            <div className="relative w-44 h-11">
              <Image
                src="/techno-logo-transparent.png"
                alt="Techno Architecture"
                fill
                sizes="180px"
                className="object-contain object-left"
              />
            </div>
            <p className="text-xs leading-relaxed text-neutral-500 max-w-sm tracking-wide">
              An architectural and interior design practice dedicated to formal restraint, material permanence, and deep contextual sensitivity.
            </p>
            <div className="pt-2">
              <span className="text-[10px] tracking-[0.2em] uppercase text-neutral-400 block mb-1">
                General Inquiries
              </span>
              <a
                href="mailto:studio@technoarchitecture.com"
                className="text-xs text-black hover:underline flex items-center gap-1 group font-medium"
              >
                studio@technoarchitecture.com
                <ArrowUpRight size={12} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            </div>
          </div>

          {/* Col 2: Studios */}
          <div className="space-y-3">
            <h3 className="text-[11px] font-semibold tracking-[0.25em] text-neutral-900 uppercase mb-4">
              Studios
            </h3>
            <div className="text-xs text-neutral-500 space-y-1">
              <strong className="text-neutral-800 block font-medium">Bengaluru HQ</strong>
              <p>No. 44, 4th Main Road, Basavanagudi</p>
              <p>Karnataka 560004, India</p>
              <p className="pt-1 text-[11px] text-neutral-400">+91 80 2661 4820</p>
            </div>
            <div className="text-xs text-neutral-500 space-y-1 pt-3">
              <strong className="text-neutral-800 block font-medium">Hyderabad</strong>
              <p>Road No. 36, Jubilee Hills</p>
              <p>Telangana 500033, India</p>
            </div>
            <div className="text-xs text-neutral-500 space-y-1 pt-3">
              <strong className="text-neutral-800 block font-medium">Dubai Collaborations</strong>
              <p>Building 04, Dubai Design District (d3)</p>
            </div>
          </div>

          {/* Col 3: Navigation Index */}
          <div>
            <h3 className="text-[11px] font-semibold tracking-[0.25em] text-neutral-900 uppercase mb-4">
              Index
            </h3>
            <ul className="grid grid-cols-2 gap-2 text-xs text-neutral-600">
              <li>
                <Link href="/projects" className="hover:text-black transition-colors">
                  Projects
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-black transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-black transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/team" className="hover:text-black transition-colors">
                  Our Team
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-black transition-colors">
                  Gallery
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-black transition-colors">
                  Monographs
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
              <li>
                <Link href="/contact" className="hover:text-black transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-black transition-colors font-medium">
                  Owner Portal
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
