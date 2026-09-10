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
    service: "Architectural Design",
    budget: "$250k - $500k",
    message: "",
    consent: false,
    honeypot: "",
  });

  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const budgetOptions = [
    "Under $100k / ₹80 Lakhs",
    "$100k - $250k / ₹80L - ₹2 Cr",
    "$250k - $500k / ₹2 Cr - ₹4 Cr",
    "$500k - $1M / ₹4 Cr - ₹8 Cr",
    "$1M+ / ₹8 Cr+",
  ];

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
        service: "Architectural Design",
        budget: "$250k - $500k",
        message: "",
        consent: false,
        honeypot: "",
      });
    } catch (err: any) {
      setStatus("error");
      setErrorMessage(err.message || "Failed to submit inquiry. Please try again.");
    }
  };

  return (
    <div className="w-full py-10 md:py-16 px-6 md:px-12 lg:px-16 max-w-7xl mx-auto space-y-16">
      {/* Page Header */}
      <div className="border-b border-neutral-200 pb-6">
        <span className="text-[10px] uppercase tracking-[0.3em] font-semibold text-neutral-400 block">
          COMMISSION & CONSULTATION INQUIRY
        </span>
        <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-light text-neutral-900 tracking-tight mt-2">
          Initiate a Dialogue with Techno
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 max-w-2xl mt-2 tracking-wide font-light">
          We welcome residential, commercial, and civic commissions. Please share details regarding your site, program, and anticipated timelines.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        {/* Left Form (lg:col-span-7) */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-10 border border-neutral-200">
          {status === "success" ? (
            <div className="py-12 text-center space-y-4">
              <CheckCircle2 size={48} className="mx-auto text-black" />
              <h2 className="font-display text-2xl font-light text-neutral-900">
                Inquiry Successfully Transmitted
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

              {/* Row 3: Service Required & Budget Range */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label htmlFor="service" className="text-[10px] uppercase tracking-[0.2em] font-semibold text-neutral-700 block">
                    Service Required
                  </label>
                  <select
                    id="service"
                    value={formData.service}
                    onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                    className="w-full text-xs p-3 border border-neutral-300 bg-white focus:border-black focus:outline-none transition-colors"
                  >
                    {services.map((s) => (
                      <option key={s.id} value={s.title}>
                        {s.title}
                      </option>
                    ))}
                    <option value="Full Turnkey Architecture & Interior">
                      Full Turnkey Architecture & Interior
                    </option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label htmlFor="budget" className="text-[10px] uppercase tracking-[0.2em] font-semibold text-neutral-700 block">
                    Estimated Budget Range
                  </label>
                  <select
                    id="budget"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    className="w-full text-xs p-3 border border-neutral-300 bg-white focus:border-black focus:outline-none transition-colors"
                  >
                    {budgetOptions.map((opt, idx) => (
                      <option key={idx} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
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

              {/* Consent Checkbox */}
              <div className="flex items-start space-x-3 pt-2">
                <input
                  id="consent"
                  type="checkbox"
                  required
                  checked={formData.consent}
                  onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                  className="mt-1 accent-black"
                />
                <label htmlFor="consent" className="text-[11px] text-neutral-600 leading-normal">
                  I agree that Techno Architecture may process my provided contact details for the sole purpose of responding to this project inquiry.
                </label>
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
                    <span>Submit Project Inquiry</span>
                    <Send size={13} />
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Right Info Cards (lg:col-span-5) */}
        <div className="lg:col-span-5 space-y-8">
          {/* Studio Locations */}
          <div className="space-y-6">
            <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-neutral-900 block pb-2 border-b border-neutral-200">
              PHYSICAL STUDIOS
            </span>

            {siteSettings.studios.map((st, idx) => (
              <div key={idx} className="p-5 bg-neutral-50 border border-neutral-200 space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-neutral-900 uppercase tracking-wider">
                    {st.city}
                  </h3>
                  {st.isHeadquarters && (
                    <span className="text-[8px] uppercase tracking-widest bg-black text-white px-2 py-0.5">
                      HQ
                    </span>
                  )}
                </div>
                <div className="flex items-start gap-2 text-neutral-600 pt-1">
                  <MapPin size={13} className="text-neutral-400 flex-shrink-0 mt-0.5" />
                  <p>{st.address}, {st.postalCode}</p>
                </div>
                <div className="flex items-center gap-2 text-neutral-600 pt-1 font-mono text-[11px]">
                  <Phone size={11} className="text-neutral-400" />
                  <a href={`tel:${st.phone}`} className="hover:underline">
                    {st.phone}
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Operating Hours & Direct Dispatch */}
          <div className="p-6 bg-neutral-900 text-white space-y-4 text-xs">
            <div className="flex items-center gap-2 text-neutral-400">
              <Clock size={14} />
              <span className="text-[10px] uppercase tracking-widest font-mono">
                {siteSettings.operatingHours}
              </span>
            </div>
            <div className="space-y-2 pt-2 border-t border-neutral-800 text-neutral-300">
              <p>
                <strong className="text-white block text-[10px] uppercase tracking-wider">Press & Media</strong>
                <a href={`mailto:${siteSettings.contact.pressEmail}`} className="hover:underline">
                  {siteSettings.contact.pressEmail}
                </a>
              </p>
              <p className="pt-1">
                <strong className="text-white block text-[10px] uppercase tracking-wider">Talent & Careers</strong>
                <a href={`mailto:${siteSettings.contact.careersEmail}`} className="hover:underline">
                  {siteSettings.contact.careersEmail}
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
