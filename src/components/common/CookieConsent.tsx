"use client";

import React, { useState, useEffect } from "react";

export default function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("techno_cookie_consent");
    if (!consent) {
      const timer = setTimeout(() => setShow(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const accept = () => {
    localStorage.setItem("techno_cookie_consent", "accepted");
    setShow(false);
  };

  if (!show) return null;

  return (
    <aside
      aria-label="Cookie consent banner"
      className="fixed bottom-4 left-4 right-4 md:right-auto md:max-w-md z-40 bg-neutral-900 text-white p-5 border border-neutral-800 shadow-2xl flex flex-col space-y-3"
    >
      <p className="text-xs text-neutral-300 leading-relaxed font-normal">
        Techno uses essential cookies and anonymous analytics to understand spatial engagement and ensure optimal browsing performance.
      </p>
      <div className="flex items-center space-x-4 pt-1">
        <button
          onClick={accept}
          type="button"
          className="text-[10px] uppercase tracking-[0.2em] font-medium bg-white text-black px-4 py-1.5 hover:bg-neutral-200 transition-colors"
        >
          Accept
        </button>
        <button
          onClick={accept}
          type="button"
          className="text-[10px] uppercase tracking-[0.2em] font-medium text-neutral-400 hover:text-white transition-colors"
        >
          Essential Only
        </button>
      </div>
    </aside>
  );
}
