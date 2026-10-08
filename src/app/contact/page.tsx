"use client";

import React, { useState } from "react";
import { useCMSStore } from "@/lib/cmsStore";
import { Mail, Phone, Clock, MapPin, CheckCircle2, AlertCircle, Send } from "lucide-react";

export default function ContactPage() {
  const { siteSettings, services } = useCMSStore();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    company: "",
    message: "",
    honeypot: "",
  });

  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Submission failed");
      }

      setStatus("success");
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        company: "",
        message: "",
        honeypot: "",
      });
    } catch (err: any) {
      setStatus("error");
      setErrorMessage(err.message || "Failed to submit enquiry. Please try again.");
    }
  };

  return (
    <div className="w-full py-10 md:py-16 px-6 md:px-12 lg:px-16 max-w-7xl mx-auto space-y-16">
      {/* Page Header */}
      <div className="border-b border-neutral-200 pb-6">
        <span className="text-[10px] uppercase tracking-[0.3em] font-semibold text-neutral-400 block font-mono">
          CONTACT US
        </span>
        <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-light text-neutral-900 tracking-tight mt-2">
          Let us discuss your project
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 max-w-2xl mt-2 tracking-wide font-light">
          Whether you are planning a new building, an interior or an early-stage feasibility study, share a few details with us. Our team will review your enquiry and respond with the most relevant next step.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        {/* Left Form (lg:col-span-7) */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-10 border border-neutral-200">
          {status === "success" ? (
            <div className="py-12 text-center space-y-4">
              <CheckCircle2 size={48} className="mx-auto text-black" />
              <h2 className="font-display text-2xl font-light text-neutral-900">
                Enquiry Successfully Transmitted
              </h2>
              <p className="text-xs text-neutral-600 max-w-md mx-auto leading-relaxed">
                Thank you. Your dossier has been routed directly to our principals. We will review your site parameters and respond within two business days.
              </p>
              <button
                onClick={() => setStatus("idle")}
                type="button"
                className="text-[10px] uppercase tracking-[0.2em] font-medium bg-black text-white px-5 py-2.5 hover:bg-neutral-800 transition-colors mt-4"
              >
                Send Another Note
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Spam Honeypot - hidden from real users */}
              <input
                type="text"
                name="honeypot"
                value={formData.honeypot}
                onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
                className="hidden"
                tabIndex={-1}
                autoComplete="off"
              />

              {status === "error" && (
                <div className="p-4 bg-red-50 border border-red-200 flex items-center gap-3 text-red-700 text-xs">
                  <AlertCircle size={16} className="flex-shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Row 1: Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label htmlFor="fullName" className="text-[10px] uppercase tracking-[0.2em] font-semibold text-neutral-700 block">
                    Full Name *
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    required
                    placeholder="e.g. Anand Sharma"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full text-xs p-3 border border-neutral-300 focus:border-black focus:outline-none transition-colors"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="email" className="text-[10px] uppercase tracking-[0.2em] font-semibold text-neutral-700 block">
                    Email Address *
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    placeholder="name@domain.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full text-xs p-3 border border-neutral-300 focus:border-black focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Row 2: Phone & Company */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label htmlFor="phone" className="text-[10px] uppercase tracking-[0.2em] font-semibold text-neutral-700 block">
                    Phone / WhatsApp
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full text-xs p-3 border border-neutral-300 focus:border-black focus:outline-none transition-colors"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="company" className="text-[10px] uppercase tracking-[0.2em] font-semibold text-neutral-700 block">
                    Company / Organization
                  </label>
                  <input
                    id="company"
                    type="text"
                    placeholder="Optional"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full text-xs p-3 border border-neutral-300 focus:border-black focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Message */}
              <div className="space-y-1">
                <label htmlFor="message" className="text-[10px] uppercase tracking-[0.2em] font-semibold text-neutral-700 block">
                  Project Narrative & Site Context *
                </label>
                <textarea
                  id="message"
                  required
                  rows={5}
                  placeholder="Describe your site location, plot size, functional requirements, and expected construction start date..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full text-xs p-3 border border-neutral-300 focus:border-black focus:outline-none transition-colors leading-relaxed"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={status === "submitting"}
                className="w-full text-xs uppercase tracking-[0.25em] font-medium bg-black text-white py-3.5 hover:bg-neutral-800 disabled:bg-neutral-400 transition-colors flex items-center justify-center gap-2"
              >
                {status === "submitting" ? (
                  <span>Transmitting Dossier...</span>
                ) : (
                  <>
                    <span>Submit Enquiry</span>
                    <Send size={13} />
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Right Info Cards (lg:col-span-5) */}
        <div className="lg:col-span-5 space-y-8">
          {/* Contact Details Card */}
          <div className="p-6 bg-neutral-50 border border-neutral-200 space-y-6 text-xs">
            <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-neutral-900 block pb-2 border-b border-neutral-200">
              CONTACT DETAILS
            </span>

            <div className="space-y-1">
              <span className="text-[9px] uppercase font-mono tracking-wider text-neutral-400 block">Studio Address</span>
              <p className="text-neutral-800 leading-relaxed font-normal">
                {siteSettings?.studios?.[0]?.address
                  ? `${siteSettings.studios[0].address}, Bengaluru, ${siteSettings.studios[0].postalCode || "Karnataka 560004"}`
                  : "No 9, Uttaradhi Mutt Road, Shankarpuram, Basavanagudi, Bengaluru, Karnataka 560004"}
              </p>
              <div className="pt-1">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    siteSettings?.studios?.[0]?.address
                      ? `${siteSettings.studios[0].address}, Bengaluru, ${siteSettings.studios[0].postalCode || "Karnataka 560004"}`
                      : "TechnoArchitecture, No 9, Uttaradhi Mutt Road, Shankarpuram, Basavanagudi, Bengaluru, Karnataka 560004"
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] text-black font-medium underline hover:text-neutral-600"
                >
                  <MapPin size={12} />
                  <span>Open in Google Maps</span>
                </a>
              </div>
            </div>

            {/* Office Landlines */}
            <div className="space-y-2 pt-3 border-t border-neutral-200">
              <span className="text-[9px] uppercase font-mono tracking-wider text-neutral-400 block">Office Landlines</span>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-neutral-500 font-mono text-[10px]">Office Primary</span>
                  <a
                    href="tel:+918042103764"
                    className="text-neutral-900 font-mono text-xs sm:text-sm hover:underline font-medium"
                  >
                    +91 80 4210 3764
                  </a>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-neutral-500 font-mono text-[10px]">Office No BSNL</span>
                  <a
                    href="tel:+918029914561"
                    className="text-neutral-900 font-mono text-xs sm:text-sm hover:underline font-medium"
                  >
                    +91 80 2991 4561
                  </a>
                </div>
              </div>
            </div>

            {/* Direct WhatsApp Channel */}
            <div className="space-y-1.5 pt-3 border-t border-neutral-200">
              <span className="text-[9px] uppercase font-mono tracking-wider text-neutral-400 block">WhatsApp Direct</span>
              <a
                href="https://wa.me/919180014561?text=Hello%20Techno%20Architecture%2C%20I%20would%20like%20to%20enquire%20about%20architectural%20and%20interior%20design%20services."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[#25D366] hover:text-[#128C7E] font-mono text-xs sm:text-sm font-medium transition-colors"
              >
                <span>+91 91800 14561</span>
                <span className="text-[10px] px-1.5 py-0.5 bg-[#25D366]/10 text-[#128C7E] rounded-xs font-sans font-semibold">Chat Online</span>
              </a>
            </div>

            <div className="space-y-1 pt-3 border-t border-neutral-200">
              <span className="text-[9px] uppercase font-mono tracking-wider text-neutral-400 block">Email</span>
              <a
                href={`mailto:${siteSettings?.contact?.email || "technoarchitecture@gmail.com"}`}
                className="text-neutral-900 font-mono text-xs hover:underline block"
              >
                {siteSettings?.contact?.email || "technoarchitecture@gmail.com"}
              </a>
            </div>

            <div className="space-y-1 pt-3 border-t border-neutral-200">
              <span className="text-[9px] uppercase font-mono tracking-wider text-neutral-400 block">Business Hours</span>
              <p className="text-neutral-700 leading-relaxed">
                {siteSettings?.operatingHours || "Monday to Friday, 10:00 AM to 6:30 PM"}<br />
                <span className="text-neutral-500">Saturday closed</span>
              </p>
            </div>

            <div className="space-y-1 pt-3 border-t border-neutral-200">
              <span className="text-[9px] uppercase font-mono tracking-wider text-neutral-400 block">Official Instagram</span>
              <a
                href={
                  siteSettings?.socials?.find((s) => s.platform.toLowerCase() === "instagram")?.url ||
                  "https://www.instagram.com/technoarchitecture_rajesh/"
                }
                target="_blank"
                rel="noopener noreferrer"
                className="text-black font-medium hover:underline inline-flex items-center gap-1.5"
              >
                <span>
                  {siteSettings?.socials?.find((s) => s.platform.toLowerCase() === "instagram")?.handle ||
                    "@technoarchitecture_rajesh"}
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
