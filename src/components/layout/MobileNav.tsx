"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { primaryNavigation } from "@/data/navigation";
import { Menu, X, Instagram, Linkedin, Facebook, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Close on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Lock body scroll when menu open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-neutral-200">
      <div className="flex items-center justify-between px-6 py-3.5">
        {/* Mobile Brand Logo */}
        <Link
          href="/"
          className="flex items-center"
          aria-label="Techno Architecture Home"
        >
          <div className="relative w-36 sm:w-44 h-8 sm:h-9">
            <Image
              src="/techno-logo-transparent.png"
              alt="Techno Architecture"
              fill
              sizes="180px"
              priority
              className="object-contain object-left"
            />
          </div>
        </Link>

        {/* Hamburger Toggle */}
        <div className="flex items-center space-x-3">
          <Link
            href="/admin"
            className="text-neutral-500 hover:text-black p-1"
            title="Admin CMS"
            aria-label="Admin CMS"
          >
            <Settings size={15} />
          </Link>
          <button
            onClick={() => setIsOpen(!isOpen)}
            type="button"
            aria-expanded={isOpen}
            aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
            className="p-1.5 text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-400"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Slideout Fullscreen / Drawer Menu */}
      <div
        className={cn(
          "fixed inset-x-0 top-[57px] bottom-0 bg-white transition-all duration-500 ease-in-out z-40 flex flex-col justify-between px-8 py-10 overflow-y-auto",
          isOpen ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-4 pointer-events-none"
        )}
      >
        <nav aria-label="Mobile Menu Navigation">
          <ul className="flex flex-col space-y-5">
            {primaryNavigation.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/" && pathname.startsWith(item.href));

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "block text-sm font-medium tracking-[0.2em] uppercase transition-colors",
                      isActive ? "text-black font-semibold" : "text-neutral-600 hover:text-black"
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Mobile Footer & Socials */}
        <div className="pt-8 border-t border-neutral-100 flex flex-col space-y-4">
          <div className="flex items-center space-x-6 text-neutral-500">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="hover:text-black"
            >
              <Instagram size={16} />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="hover:text-black"
            >
              <Linkedin size={16} />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="hover:text-black"
            >
              <Facebook size={16} />
            </a>
          </div>
          <p className="text-[10px] tracking-wider text-neutral-400">
            © {new Date().getFullYear()} TECHNO ARCHITECTURE STUDIO.
          </p>
        </div>
      </div>
    </header>
  );
}
