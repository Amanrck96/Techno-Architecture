"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { primaryNavigation } from "@/data/navigation";
import { ArrowUp, Instagram, Linkedin, Facebook, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

export default function DesktopRailNav() {
  const pathname = usePathname();
  const [showTopBtn, setShowTopBtn] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowTopBtn(window.scrollY > 350);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <aside
      aria-label="Sidebar Navigation"
      className="hidden lg:flex fixed top-0 right-0 h-screen w-28 xl:w-32 2xl:w-36 z-50 flex-col justify-between items-center py-8 xl:py-10 px-2 xl:px-3 bg-white border-l border-neutral-200 transition-colors duration-300"
    >
      {/* Brand Monogram / Logo */}
      <div className="flex flex-col items-center px-2">
        <Link
          href="/"
          className="group flex flex-col items-center text-center transition-transform hover:scale-105"
          aria-label="Techno Architecture Home"
        >
          <div className="relative w-16 xl:w-20 h-8 xl:h-10">
            <Image
              src="/techno-logo-transparent.png"
              alt="Techno Architecture"
              fill
              sizes="80px"
              className="object-contain"
            />
          </div>
        </Link>
      </div>

      {/* Vertical Navigation Links */}
      <nav className="my-auto py-4" aria-label="Primary Desktop Menu">
        <ul className="flex flex-col space-y-3.5 xl:space-y-4 2xl:space-y-5 text-center w-full">
          {primaryNavigation.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href));

            return (
              <li key={item.href} className="relative group w-full">
                <Link
                  href={item.href}
                  className={cn(
                    "block text-[10px] xl:text-[11px] font-medium tracking-[0.18em] xl:tracking-[0.2em] transition-all duration-300 uppercase py-1.5 px-3 rounded-sm mx-1.5",
                    isActive
                      ? "text-black font-semibold tracking-[0.22em] bg-neutral-100/80"
                      : "text-neutral-500 hover:text-black hover:tracking-[0.22em] hover:bg-neutral-50"
                  )}
                >
                  {item.label}
                  {isActive && (
                    <span
                      aria-hidden="true"
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-neutral-900 rounded-full"
                    />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Social Icons & Utilities */}
      <div className="flex flex-col items-center space-y-4">
        {/* Owner Portal link */}
        <Link
          href="/admin"
          title="Owner & Host Portal"
          aria-label="Owner & Host Portal"
          className="text-neutral-400 hover:text-black transition-all hover:scale-110 duration-300 p-1"
        >
          <Lock size={13} />
        </Link>

        {/* Social Icons */}
        <div className="flex flex-col items-center space-y-3 text-neutral-400">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Techno on Instagram"
            className="hover:text-black hover:scale-110 transition-transform duration-300"
          >
            <Instagram size={13} />
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Techno on LinkedIn"
            className="hover:text-black hover:scale-110 transition-transform duration-300"
          >
            <Linkedin size={13} />
          </a>
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Techno on Facebook"
            className="hover:text-black hover:scale-110 transition-transform duration-300"
          >
            <Facebook size={13} />
          </a>
        </div>

        {/* Back to top button */}
        <button
          onClick={scrollToTop}
          type="button"
          aria-label="Scroll back to top"
          className={cn(
            "p-2 text-neutral-500 hover:text-black transition-all duration-300 rounded-full border border-neutral-200 hover:border-neutral-900 hover:bg-neutral-50",
            showTopBtn ? "opacity-100 scale-100" : "opacity-0 scale-75 pointer-events-none"
          )}
        >
          <ArrowUp size={13} />
        </button>
      </div>
    </aside>
  );
}
