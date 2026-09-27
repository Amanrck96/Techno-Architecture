"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCMSStore } from "@/lib/cmsStore";
import { Project, ProjectImage, VideoTour } from "@/data/projects";
import { Service } from "@/data/services";
import { TeamMember } from "@/data/team";
import { BlogPost } from "@/data/blog";
import { FAQItem } from "@/data/faq";
import { GalleryItem } from "@/data/gallery";
import { Recognition } from "@/data/recognitions";
import { SiteSettings, StudioMilestone, CoreValue, Differentiator, ServicesPageHeader } from "@/data/siteSettings";
import { Testimonial } from "@/data/testimonials";
import {
  FolderKanban,
  Wrench,
  Users,
  BookOpen,
  HelpCircle,
  Image as ImageIcon,
  Award,
  Settings,
  MessageSquareQuote,
  Plus,
  Save,
  RotateCcw,
  Download,
  Upload,
  CheckCircle2,
  Trash2,
  Lock,
  ShieldCheck,
  Eye,
  EyeOff,
  LogOut,
  ArrowLeft,
  AlertCircle,
  Building,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  X,
  Film,
  Video,
  Sparkles,
  Compass,
  ListChecks,
  Layers,
} from "lucide-react";
import { cn } from "@/lib/utils";

type AdminTab =
  | "projects"
  | "services"
  | "team"
  | "blog"
  | "faq"
  | "gallery"
  | "recognitions"
  | "testimonials"
  | "settings";

export default function AdminCMSPage() {
  const {
    projects,
    services,
    team,
    blog,
    faq,
    gallery,
    recognitions,
    siteSettings,
    testimonials,
    saveProjects,
    saveServices,
    saveTeam,
    saveBlog,
    saveFaq,
    saveGallery,
    saveRecognitions,
    saveSiteSettings,
    saveTestimonials,
    resetAllToDefaults,
  } = useCMSStore();

  // Authentication states
  const [isVerifying, setIsVerifying] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentAdminUser, setCurrentAdminUser] = useState<string>("");
  const [usernameInput, setUsernameInput] = useState<string>("");
  const [passwordInput, setPasswordInput] = useState<string>("");
  const [authError, setAuthError] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isSubmittingAuth, setIsSubmittingAuth] = useState<boolean>(false);

  // Tab & Notification states
  const [activeTab, setActiveTab] = useState<AdminTab>("projects");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [expandedProjectId, setExpandedProjectId] = useState<string | null>(null);

  // File import ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 1. Verify Session on Mount via Server
  useEffect(() => {
    async function checkAuthSession() {
      try {
        const res = await fetch("/api/admin/verify");
        const data = await res.json();
        if (res.ok && data.authenticated) {
          setIsAuthenticated(true);
          setCurrentAdminUser(data.username || "admin");
        } else {
          setIsAuthenticated(false);
        }
      } catch (err) {
        setIsAuthenticated(false);
      } finally {
        setIsVerifying(false);
      }
    }
    checkAuthSession();
  }, []);

  // 2. Handle Login Submission to Secure API
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setIsSubmittingAuth(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: usernameInput,
          password: passwordInput,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Authentication failed.");
      }

      setIsAuthenticated(true);
      setCurrentAdminUser(data.username || usernameInput);
      setPasswordInput("");
      setAuthError("");
      showToast("Access granted. Welcome to Techno Architecture Admin Studio.");
    } catch (err: any) {
      setAuthError(err.message || "Invalid credentials. Please verify and try again.");
    } finally {
      setIsSubmittingAuth(false);
    }
  };

  // 3. Handle Logout
  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } catch (_) {}
    setIsAuthenticated(false);
    setCurrentAdminUser("");
    setUsernameInput("");
    setPasswordInput("");
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // 4. Export JSON
  const exportData = () => {
    const backup = {
      projects,
      services,
      team,
      blog,
      faq,
      gallery,
      recognitions,
      siteSettings,
      testimonials,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `techno-architecture-backup-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    showToast("Full website backup exported successfully.");
  };

  // 5. Import JSON
  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.projects && Array.isArray(parsed.projects)) saveProjects(parsed.projects);
        if (parsed.services && Array.isArray(parsed.services)) saveServices(parsed.services);
        if (parsed.team && Array.isArray(parsed.team)) saveTeam(parsed.team);
        if (parsed.blog && Array.isArray(parsed.blog)) saveBlog(parsed.blog);
        if (parsed.faq && Array.isArray(parsed.faq)) saveFaq(parsed.faq);
        if (parsed.gallery && Array.isArray(parsed.gallery)) saveGallery(parsed.gallery);
        if (parsed.recognitions && Array.isArray(parsed.recognitions)) saveRecognitions(parsed.recognitions);
        if (parsed.siteSettings) saveSiteSettings(parsed.siteSettings);
        if (parsed.testimonials && Array.isArray(parsed.testimonials)) saveTestimonials(parsed.testimonials);

        showToast("Backup imported and applied to website successfully.");
      } catch (err) {
        alert("Failed to parse JSON file. Please ensure it is a valid Techno backup file.");
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Loading state while verifying session
  if (isVerifying) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-8 h-8 border-2 border-neutral-300 border-t-black rounded-full animate-spin" />
        <span className="text-[10px] uppercase font-mono tracking-[0.25em] text-neutral-400">
          Verifying Security Credentials...
        </span>
      </div>
    );
  }

  // -------------------------------------------------------------
  // SECURE LOGIN SCREEN (If not authenticated)
  // -------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-white border border-neutral-200 shadow-2xl p-8 sm:p-10 space-y-6">
          {/* Header */}
          <div className="text-center space-y-3">
            <Link href="/" className="relative w-48 sm:w-56 h-12 mx-auto block" title="Techno Architecture">
              <Image
                src="/techno-logo-transparent.png"
                alt="Techno Architecture"
                fill
                priority
                unoptimized
                className="object-contain"
              />
            </Link>
            <div className="w-11 h-11 rounded-full bg-neutral-100 flex items-center justify-center mx-auto text-neutral-900 border border-neutral-200 mt-2">
              <Lock size={18} />
            </div>
            <span className="text-[10px] uppercase tracking-[0.3em] font-semibold text-neutral-400 block pt-1 font-mono">
              RESTRICTED ADMINISTRATION
            </span>
            <h1 className="font-display text-2xl font-light text-neutral-900 tracking-tight">
              Techno Admin Portal
            </h1>
            <p className="text-xs text-neutral-500 leading-relaxed max-w-xs mx-auto">
              Administrative access is strictly protected. Please sign in with your authorized studio administrator credentials.
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4 pt-2">
            {/* Username Input */}
            <div className="space-y-1.5">
              <label
                htmlFor="admin-username"
                className="text-[10px] uppercase tracking-wider font-semibold text-neutral-700 block font-mono"
              >
                Admin Username
              </label>
              <input
                id="admin-username"
                type="text"
                value={usernameInput}
                onChange={(e) => {
                  setUsernameInput(e.target.value);
                  if (authError) setAuthError("");
                }}
                placeholder="Enter admin username"
                required
                autoFocus
                className="w-full px-3.5 py-2.5 text-xs border border-neutral-300 rounded focus:outline-none focus:border-black transition-colors"
              />
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <label
                htmlFor="admin-password"
                className="text-[10px] uppercase tracking-wider font-semibold text-neutral-700 block font-mono"
              >
                Admin Password
              </label>
              <div className="relative">
                <input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    if (authError) setAuthError("");
                  }}
                  placeholder="Enter admin password"
                  required
                  className="w-full px-3.5 py-2.5 text-xs border border-neutral-300 rounded focus:outline-none focus:border-black transition-colors pr-10 font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {authError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded flex items-start gap-2 text-xs text-red-700">
                <AlertCircle size={15} className="flex-shrink-0 mt-0.5 text-red-500" />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmittingAuth}
              className="w-full py-3 bg-black text-white text-xs uppercase tracking-[0.2em] font-medium hover:bg-neutral-800 disabled:bg-neutral-400 transition-colors flex items-center justify-center gap-2"
            >
              {isSubmittingAuth ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <ShieldCheck size={15} />
                  <span>Secure Sign In</span>
                </>
              )}
            </button>
          </form>

          {/* Security Notice & Return Link */}
          <div className="pt-4 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-500">
            <span className="text-[10px] text-neutral-400">Encrypted server session</span>
            <Link
              href="/"
              className="inline-flex items-center gap-1 hover:text-black transition-colors font-medium"
            >
              <ArrowLeft size={12} />
              <span>Return to Public Site</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // AUTHENTICATED ADMIN DASHBOARD (FULL ACCESS)
  // -------------------------------------------------------------
  return (
    <div className="w-full min-h-screen bg-neutral-50/50 pb-16">
      {/* Hidden File Input for JSON Backup Import */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImportJSON}
        accept=".json"
        className="hidden"
      />

      {/* Top Header Background with Architectural Ambience & Logo */}
      <header className="w-full relative overflow-hidden bg-neutral-950 text-white border-b border-neutral-800 shadow-md">
        {/* Ambient Architectural Image Background */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <Image
            src="/projects/salut/salut-terrace-bar-screening-ambience.jpg"
            alt="Techno Architecture Dashboard Background"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center opacity-20 grayscale"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/95 to-neutral-900/90" />
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />
        </div>

        {/* Header Content Container */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-10 py-6 sm:py-8 space-y-6">
          {/* Top Navbar Row: Logo + Session Info + Quick Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-white/10 gap-4">
            {/* Logo Placement */}
            <div className="flex items-center gap-4 sm:gap-6">
              <Link
                href="/"
                title="Return to Public Site"
                className="relative w-44 sm:w-56 md:w-64 h-10 sm:h-12 block group"
              >
                <Image
                  src="/techno-logo-white-4k.png"
                  alt="Techno Architecture Logo"
                  fill
                  priority
                  unoptimized
                  sizes="320px"
                  className="object-contain object-left group-hover:opacity-90 transition-opacity"
                />
              </Link>
              <div className="hidden sm:block h-6 w-px bg-white/20" />
              <div className="hidden sm:flex flex-col">
                <span className="text-[9px] uppercase tracking-[0.25em] text-neutral-400 font-mono font-medium">
                  STUDIO CMS
                </span>
                <span className="text-[10px] tracking-wider text-emerald-400 font-mono">
                  MANAGEMENT CONSOLE
                </span>
              </div>
            </div>

            {/* Session Status & Navigation Actions */}
            <div className="flex flex-wrap items-center gap-2.5 text-xs">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-neutral-300 text-[11px] font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Admin: <strong className="text-white">{currentAdminUser}</strong></span>
              </div>

              <Link
                href="/"
                target="_blank"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded text-[11px] font-medium tracking-wide transition-colors border border-white/10"
              >
                <span>View Public Site</span>
                <ExternalLink size={11} />
              </Link>

              <button
                onClick={handleLogout}
                type="button"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-red-500/20 text-neutral-300 hover:text-red-200 border border-white/10 hover:border-red-500/30 rounded text-[11px] font-medium transition-colors"
              >
                <LogOut size={12} />
                <span>Sign Out</span>
              </button>
            </div>
          </div>

          {/* Bottom Header Row: Title, Subtitle, & Global Utilities */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pt-1">
            <div className="space-y-1.5">
              <span className="text-[9.5px] uppercase tracking-[0.25em] text-emerald-400 font-mono font-semibold block">
                FULL ADMINISTRATIVE ACCESS
              </span>
              <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-light text-white tracking-tight">
                Studio Content &amp; System Dashboard
              </h1>
              <p className="text-xs sm:text-sm text-neutral-400 max-w-2xl font-light leading-relaxed">
                Full administrative control over all architectural projects, services, practice leadership, monographs, FAQs, gallery, awards, testimonials, and site configuration.
              </p>
            </div>

            {/* Data Management Action Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={exportData}
                type="button"
                className="flex items-center gap-1.5 px-3.5 py-2 bg-white text-black hover:bg-neutral-200 transition-colors rounded text-xs font-medium uppercase tracking-wider"
                title="Download full JSON backup of website"
              >
                <Download size={13} />
                <span>Export Backup</span>
              </button>

              <button
                onClick={() => fileInputRef.current?.click()}
                type="button"
                className="flex items-center gap-1.5 px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/15 transition-colors rounded text-xs font-medium uppercase tracking-wider"
                title="Upload previously exported JSON backup"
              >
                <Upload size={13} />
                <span>Import JSON</span>
              </button>

              <button
                onClick={() => {
                  if (confirm("Reset all website data back to default initial seed data? Any unsaved edits will be replaced.")) {
                    resetAllToDefaults();
                    showToast("All entities reset to initial seed defaults.");
                  }
                }}
                type="button"
                className="flex items-center gap-1.5 px-3 py-2 bg-transparent hover:bg-red-500/20 text-neutral-400 hover:text-red-300 border border-white/10 hover:border-red-500/30 transition-colors rounded text-xs font-medium uppercase tracking-wider"
              >
                <RotateCcw size={13} />
                <span>Reset Defaults</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Dashboard Body: Tabs & Entity Editors */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 py-8 space-y-8">

      {/* Toast Notification */}
      {toastMessage && (
        <div className="p-3 bg-neutral-900 text-white text-xs flex items-center gap-2 rounded shadow-lg animate-fadeIn">
          <CheckCircle2 size={14} className="text-emerald-400 flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Tab Selector (9 Complete Categories) */}
      <div className="flex flex-wrap gap-1 border-b border-neutral-200 pb-2">
        <button
          onClick={() => setActiveTab("projects")}
          className={cn(
            "flex items-center gap-1.5 px-3.5 py-2 text-xs uppercase tracking-wider font-medium transition-colors",
            activeTab === "projects"
              ? "border-b-2 border-black text-black font-semibold"
              : "text-neutral-500 hover:text-black"
          )}
        >
          <FolderKanban size={14} />
          <span>Projects ({projects.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("services")}
          className={cn(
            "flex items-center gap-1.5 px-3.5 py-2 text-xs uppercase tracking-wider font-medium transition-colors",
            activeTab === "services"
              ? "border-b-2 border-black text-black font-semibold"
              : "text-neutral-500 hover:text-black"
          )}
        >
          <Wrench size={14} />
          <span>Services ({services.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("team")}
          className={cn(
            "flex items-center gap-1.5 px-3.5 py-2 text-xs uppercase tracking-wider font-medium transition-colors",
            activeTab === "team"
              ? "border-b-2 border-black text-black font-semibold"
              : "text-neutral-500 hover:text-black"
          )}
        >
          <Users size={14} />
          <span>Team ({team.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("blog")}
          className={cn(
            "flex items-center gap-1.5 px-3.5 py-2 text-xs uppercase tracking-wider font-medium transition-colors",
            activeTab === "blog"
              ? "border-b-2 border-black text-black font-semibold"
              : "text-neutral-500 hover:text-black"
          )}
        >
          <BookOpen size={14} />
          <span>Blog ({blog.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("faq")}
          className={cn(
            "flex items-center gap-1.5 px-3.5 py-2 text-xs uppercase tracking-wider font-medium transition-colors",
            activeTab === "faq"
              ? "border-b-2 border-black text-black font-semibold"
              : "text-neutral-500 hover:text-black"
          )}
        >
          <HelpCircle size={14} />
          <span>FAQs ({faq.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("gallery")}
          className={cn(
            "flex items-center gap-1.5 px-3.5 py-2 text-xs uppercase tracking-wider font-medium transition-colors",
            activeTab === "gallery"
              ? "border-b-2 border-black text-black font-semibold"
              : "text-neutral-500 hover:text-black"
          )}
        >
          <ImageIcon size={14} />
          <span>Gallery ({gallery.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("recognitions")}
          className={cn(
            "flex items-center gap-1.5 px-3.5 py-2 text-xs uppercase tracking-wider font-medium transition-colors",
            activeTab === "recognitions"
              ? "border-b-2 border-black text-black font-semibold"
              : "text-neutral-500 hover:text-black"
          )}
        >
          <Award size={14} />
          <span>Awards ({recognitions.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("testimonials")}
          className={cn(
            "flex items-center gap-1.5 px-3.5 py-2 text-xs uppercase tracking-wider font-medium transition-colors",
            activeTab === "testimonials"
              ? "border-b-2 border-black text-black font-semibold"
              : "text-neutral-500 hover:text-black"
          )}
        >
          <MessageSquareQuote size={14} />
          <span>Testimonials ({testimonials.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("settings")}
          className={cn(
            "flex items-center gap-1.5 px-3.5 py-2 text-xs uppercase tracking-wider font-medium transition-colors",
            activeTab === "settings"
              ? "border-b-2 border-black text-black font-semibold"
              : "text-neutral-500 hover:text-black"
          )}
        >
          <Settings size={14} />
          <span>Settings</span>
        </button>
      </div>

      {/* ========================================================= */}
      {/* 1. PROJECTS TAB (FULL ACCESS)                             */}
      {/* ========================================================= */}
      {activeTab === "projects" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-900">
                Architectural Projects Portfolio ({projects.length})
              </h2>
              <p className="text-xs text-neutral-500">
                Create, update, manage photo galleries, credits, and project specifications.
              </p>
            </div>
            <button
              onClick={() => {
                const newP: Project = {
                  id: `proj-${Date.now()}`,
                  slug: `project-${projects.length + 1}`,
                  title: `NEW ARCHITECTURAL WORK ${projects.length + 1}`,
                  category: "Residential",
                  status: "ongoing",
                  location: "Bengaluru, India",
                  year: new Date().getFullYear(),
                  client: "Private Client",
                  area: "4,500 sq.ft",
                  description: "A contemporary spatial exploration responding to tropical light, breezes and site context.",
                  processNarrative: "Detailed volumetric planning and climatic integration.",
                  mainImage: "/projects/aikya/elevation-east.jpg",
                  gallery: [
                    {
                      url: "/projects/aikya/elevation-east.jpg",
                      caption: "Frontal elevation and arrival court",
                      aspect: "full",
                    },
                  ],
                  servicesInvolved: ["Architectural Design", "Interior Architecture"],
                  teamMembers: ["Ar. Rajesh Shivaram"],
                  credits: {
                    principalArchitect: "Ar. Rajesh Shivaram",
                    projectLead: "Ar. Rajesh Shivaram",
                  },
                  featured: false,
                  relatedSlugs: [],
                };
                saveProjects([newP, ...projects]);
                setExpandedProjectId(newP.id);
                showToast("New project created. Edit details below.");
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-black text-white text-xs uppercase tracking-wider font-medium hover:bg-neutral-800 transition-colors rounded shadow-sm self-start"
            >
              <Plus size={14} />
              <span>Add New Project</span>
            </button>
          </div>

          <div className="grid grid-cols-1 gap-5">
            {projects.map((p, idx) => {
              const isExpanded = expandedProjectId === p.id;

              return (
                <div
                  key={p.id}
                  className="p-5 border border-neutral-200 bg-white rounded space-y-4 shadow-xs hover:border-neutral-400 transition-colors"
                >
                  {/* Project Summary Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-100 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-10 bg-neutral-100 rounded overflow-hidden flex-shrink-0">
                        <Image
                          src={p.mainImage || "/projects/aikya/elevation-east.jpg"}
                          alt={p.title}
                          fill
                          unoptimized
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400">
                            {p.category} · {p.year} · {p.area}
                          </span>
                          <span
                            className={cn(
                              "text-[8px] font-mono uppercase px-1.5 py-0.5 rounded",
                              p.status === "completed"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : "bg-amber-50 text-amber-700 border border-amber-200"
                            )}
                          >
                            {p.status}
                          </span>
                          {p.featured && (
                            <span className="text-[8px] font-mono uppercase px-1.5 py-0.5 rounded bg-neutral-900 text-white">
                              FEATURED
                            </span>
                          )}
                        </div>
                        <h3 className="font-display text-base font-medium text-neutral-900">
                          {p.title}
                        </h3>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Link
                        href={`/projects/${p.slug}`}
                        target="_blank"
                        className="text-neutral-500 hover:text-black text-xs font-mono px-2 py-1 border border-neutral-200 hover:border-black rounded transition-colors flex items-center gap-1"
                      >
                        <span>View Live</span>
                        <ExternalLink size={11} />
                      </Link>
                      <button
                        onClick={() => setExpandedProjectId(isExpanded ? null : p.id)}
                        type="button"
                        className="px-2.5 py-1 text-xs border border-neutral-200 hover:border-black rounded transition-colors flex items-center gap-1"
                      >
                        <span>{isExpanded ? "Collapse" : "Full Details"}</span>
                        {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Delete project "${p.title}" permanently?`)) {
                            saveProjects(projects.filter((x) => x.id !== p.id));
                            showToast(`Project "${p.title}" deleted.`);
                          }
                        }}
                        className="text-neutral-400 hover:text-red-600 p-1.5 transition-colors"
                        title="Delete Project"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Quick Edit Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                    <div>
                      <label className="text-[10px] uppercase font-mono text-neutral-500 block mb-1">
                        Title
                      </label>
                      <input
                        type="text"
                        value={p.title}
                        onChange={(e) => {
                          const updated = [...projects];
                          updated[idx].title = e.target.value;
                          saveProjects(updated);
                        }}
                        className="w-full p-2 border border-neutral-300 rounded text-xs focus:border-black focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-mono text-neutral-500 block mb-1">
                        Slug (URL)
                      </label>
                      <input
                        type="text"
                        value={p.slug}
                        onChange={(e) => {
                          const updated = [...projects];
                          updated[idx].slug = e.target.value;
                          saveProjects(updated);
                        }}
                        className="w-full p-2 border border-neutral-300 rounded text-xs font-mono focus:border-black focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-mono text-neutral-500 block mb-1">
                        Category
                      </label>
                      <select
                        value={p.category}
                        onChange={(e) => {
                          const updated = [...projects];
                          updated[idx].category = e.target.value as any;
                          saveProjects(updated);
                        }}
                        className="w-full p-2 border border-neutral-300 rounded text-xs bg-white focus:border-black focus:outline-none"
                      >
                        <option value="Residential">Residential</option>
                        <option value="Commercial">Commercial</option>
                        <option value="Hospitality">Hospitality</option>
                        <option value="Interior">Interior</option>
                        <option value="Cultural">Cultural</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-mono text-neutral-500 block mb-1">
                        Status
                      </label>
                      <select
                        value={p.status}
                        onChange={(e) => {
                          const updated = [...projects];
                          updated[idx].status = e.target.value as any;
                          saveProjects(updated);
                        }}
                        className="w-full p-2 border border-neutral-300 rounded text-xs bg-white focus:border-black focus:outline-none"
                      >
                        <option value="completed">Completed</option>
                        <option value="ongoing">Ongoing</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-mono text-neutral-500 block mb-1">
                      Main Display Image URL (Cover Photo)
                    </label>
                    <input
                      type="text"
                      value={p.mainImage}
                      onChange={(e) => {
                        const updated = [...projects];
                        updated[idx].mainImage = e.target.value;
                        saveProjects(updated);
                      }}
                      className="w-full p-2 border border-neutral-300 rounded text-xs font-mono focus:border-black focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-mono text-neutral-500 block mb-1">
                      Short Overview Description
                    </label>
                    <textarea
                      rows={2}
                      value={p.description}
                      onChange={(e) => {
                        const updated = [...projects];
                        updated[idx].description = e.target.value;
                        saveProjects(updated);
                      }}
                      className="w-full p-2 border border-neutral-300 rounded text-xs leading-relaxed focus:border-black focus:outline-none"
                    />
                  </div>

                  {/* Expanded Full Control Section */}
                  {isExpanded && (
                    <div className="pt-4 border-t border-neutral-200 space-y-5 bg-neutral-50/60 p-4 rounded">
                      <h4 className="text-[11px] uppercase tracking-wider font-semibold text-neutral-900">
                        Extended Project Specifications & Credits
                      </h4>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                        <div>
                          <label className="text-[10px] uppercase font-mono text-neutral-500 block mb-1">
                            Location
                          </label>
                          <input
                            type="text"
                            value={p.location}
                            onChange={(e) => {
                              const updated = [...projects];
                              updated[idx].location = e.target.value;
                              saveProjects(updated);
                            }}
                            className="w-full p-2 border border-neutral-300 rounded text-xs bg-white"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] uppercase font-mono text-neutral-500 block mb-1">
                            Year
                          </label>
                          <input
                            type="number"
                            value={p.year}
                            onChange={(e) => {
                              const updated = [...projects];
                              updated[idx].year = parseInt(e.target.value) || 2024;
                              saveProjects(updated);
                            }}
                            className="w-full p-2 border border-neutral-300 rounded text-xs bg-white"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] uppercase font-mono text-neutral-500 block mb-1">
                            Built-Up Area
                          </label>
                          <input
                            type="text"
                            value={p.area}
                            onChange={(e) => {
                              const updated = [...projects];
                              updated[idx].area = e.target.value;
                              saveProjects(updated);
                            }}
                            className="w-full p-2 border border-neutral-300 rounded text-xs bg-white"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] uppercase font-mono text-neutral-500 block mb-1">
                            Client
                          </label>
                          <input
                            type="text"
                            value={p.client}
                            onChange={(e) => {
                              const updated = [...projects];
                              updated[idx].client = e.target.value;
                              saveProjects(updated);
                            }}
                            className="w-full p-2 border border-neutral-300 rounded text-xs bg-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] uppercase font-mono text-neutral-500 block mb-1">
                          In-Depth Process & Architectural Narrative
                        </label>
                        <textarea
                          rows={3}
                          value={p.processNarrative}
                          onChange={(e) => {
                            const updated = [...projects];
                            updated[idx].processNarrative = e.target.value;
                            saveProjects(updated);
                          }}
                          className="w-full p-2 border border-neutral-300 rounded text-xs leading-relaxed bg-white"
                        />
                      </div>

                      {/* Project Credits */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                        <div>
                          <label className="text-[10px] uppercase font-mono text-neutral-500 block mb-1">
                            Principal Architect
                          </label>
                          <input
                            type="text"
                            value={p.credits?.principalArchitect || ""}
                            onChange={(e) => {
                              const updated = [...projects];
                              updated[idx].credits = {
                                ...updated[idx].credits,
                                principalArchitect: e.target.value,
                              };
                              saveProjects(updated);
                            }}
                            className="w-full p-2 border border-neutral-300 rounded text-xs bg-white"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] uppercase font-mono text-neutral-500 block mb-1">
                            Project Lead
                          </label>
                          <input
                            type="text"
                            value={p.credits?.projectLead || ""}
                            onChange={(e) => {
                              const updated = [...projects];
                              updated[idx].credits = {
                                ...updated[idx].credits,
                                projectLead: e.target.value,
                              };
                              saveProjects(updated);
                            }}
                            className="w-full p-2 border border-neutral-300 rounded text-xs bg-white"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] uppercase font-mono text-neutral-500 block mb-1">
                            Featured on Showcase Carousel?
                          </label>
                          <div className="pt-2">
                            <label className="inline-flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={p.featured}
                                onChange={(e) => {
                                  const updated = [...projects];
                                  updated[idx].featured = e.target.checked;
                                  saveProjects(updated);
                                }}
                                className="accent-black w-4 h-4"
                              />
                              <span className="text-xs font-medium text-neutral-800">
                                Feature in top homepage gallery
                              </span>
                            </label>
                          </div>
                        </div>
                      </div>

                      {/* Cinematic Film / Video Tour Manager */}
                      <div className="p-4 bg-neutral-50/90 border border-neutral-200 rounded space-y-3">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <Film size={15} className="text-neutral-800" />
                            <span className="text-[10px] uppercase font-mono tracking-wider font-semibold text-neutral-800">
                              Cinematic Film / Video Tour Link
                            </span>
                            {p.videoTour ? (
                              <span className="text-[9px] font-mono uppercase px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full font-medium">
                                Active ({p.videoTour.platform || "Video"})
                              </span>
                            ) : (
                              <span className="text-[9px] font-mono uppercase px-2 py-0.5 bg-neutral-200 text-neutral-600 rounded-full">
                                Not Configured
                              </span>
                            )}
                          </div>
                          {p.videoTour ? (
                            <button
                              type="button"
                              onClick={() => {
                                if (confirm(`Remove the video tour link from "${p.title}"?`)) {
                                  const updated = [...projects];
                                  delete updated[idx].videoTour;
                                  saveProjects(updated);
                                  showToast("Video tour link removed.");
                                }
                              }}
                              className="text-[10px] text-red-600 hover:text-red-800 hover:underline flex items-center gap-1 font-medium"
                            >
                              <Trash2 size={11} />
                              <span>Remove Video Tour</span>
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                const updated = [...projects];
                                updated[idx].videoTour = {
                                  title: `${p.title} | Architectural House Tour`,
                                  url: "https://www.youtube.com/results?search_query=" + encodeURIComponent(p.title + " Techno Architecture House Tour"),
                                  platform: "YouTube",
                                  actionText: "Watch Video Tour →",
                                };
                                saveProjects(updated);
                                showToast(`Video tour added to "${p.title}".`);
                              }}
                              className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider font-semibold text-black hover:underline"
                            >
                              <Plus size={11} />
                              <span>+ Add Video Tour / Film Link</span>
                            </button>
                          )}
                        </div>

                        {p.videoTour && (
                          <div className="space-y-3 pt-3 border-t border-neutral-200/80 text-xs">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div className="sm:col-span-2">
                                <label className="text-[10px] uppercase font-mono text-neutral-500 block mb-1">
                                  Film / Tour Headline Title
                                </label>
                                <input
                                  type="text"
                                  value={p.videoTour.title || ""}
                                  onChange={(e) => {
                                    const updated = [...projects];
                                    if (updated[idx].videoTour) {
                                      updated[idx].videoTour = { ...updated[idx].videoTour!, title: e.target.value };
                                      saveProjects(updated);
                                    }
                                  }}
                                  placeholder="e.g. Echoes of Nirvana | A 4000 Sq. Ft. Modern Courtyard Home"
                                  className="w-full p-2 border border-neutral-300 rounded text-xs bg-white"
                                />
                              </div>

                              <div>
                                <label className="text-[10px] uppercase font-mono text-neutral-500 block mb-1">
                                  Video Link URL (YouTube, Buildofy, Instagram, or Vimeo)
                                </label>
                                <div className="flex gap-2">
                                  <input
                                    type="url"
                                    value={p.videoTour.url || ""}
                                    onChange={(e) => {
                                      const updated = [...projects];
                                      if (updated[idx].videoTour) {
                                        updated[idx].videoTour = { ...updated[idx].videoTour!, url: e.target.value };
                                        saveProjects(updated);
                                      }
                                    }}
                                    placeholder="https://www.youtube.com/watch?v=..."
                                    className="flex-1 p-2 border border-neutral-300 rounded text-xs font-mono bg-white"
                                  />
                                  {p.videoTour.url && (
                                    <a
                                      href={p.videoTour.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="px-2.5 py-1.5 bg-neutral-200 hover:bg-neutral-300 text-neutral-800 rounded text-[11px] font-mono flex items-center gap-1 transition-colors flex-shrink-0"
                                      title="Open link in new tab"
                                    >
                                      <ExternalLink size={12} />
                                      <span>Test</span>
                                    </a>
                                  )}
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <label className="text-[10px] uppercase font-mono text-neutral-500 block mb-1">
                                    Host Platform
                                  </label>
                                  <select
                                    value={p.videoTour.platform || "YouTube"}
                                    onChange={(e) => {
                                      const updated = [...projects];
                                      if (updated[idx].videoTour) {
                                        updated[idx].videoTour = { ...updated[idx].videoTour!, platform: e.target.value as any };
                                        saveProjects(updated);
                                      }
                                    }}
                                    className="w-full p-2 border border-neutral-300 rounded text-xs bg-white"
                                  >
                                    <option value="YouTube">YouTube</option>
                                    <option value="Buildofy">Buildofy</option>
                                    <option value="Instagram">Instagram</option>
                                    <option value="Vimeo">Vimeo</option>
                                  </select>
                                </div>

                                <div>
                                  <label className="text-[10px] uppercase font-mono text-neutral-500 block mb-1">
                                    Button Action Text
                                  </label>
                                  <input
                                    type="text"
                                    value={p.videoTour.actionText || "Watch Video Tour →"}
                                    onChange={(e) => {
                                      const updated = [...projects];
                                      if (updated[idx].videoTour) {
                                        updated[idx].videoTour = { ...updated[idx].videoTour!, actionText: e.target.value };
                                        saveProjects(updated);
                                      }
                                    }}
                                    placeholder="Watch Video Tour →"
                                    className="w-full p-2 border border-neutral-300 rounded text-xs bg-white"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Project Gallery Manager */}
                      <div className="space-y-3 pt-3 border-t border-neutral-200">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] uppercase tracking-wider font-semibold text-neutral-700">
                            Project Gallery Photography ({p.gallery?.length || 0} images)
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              const updated = [...projects];
                              const newImg: ProjectImage = {
                                url: "/projects/aikya/elevation-evening.jpg",
                                caption: "New interior photograph",
                                aspect: "full",
                              };
                              updated[idx].gallery = [...(updated[idx].gallery || []), newImg];
                              saveProjects(updated);
                              showToast("New image added to project gallery.");
                            }}
                            className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider font-semibold text-black hover:underline"
                          >
                            <Plus size={12} />
                            <span>Add Photo to Gallery</span>
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {p.gallery?.map((img, gIdx) => (
                            <div
                              key={gIdx}
                              className="p-3 bg-white border border-neutral-200 rounded flex gap-3 items-start"
                            >
                              <div className="relative w-16 h-14 bg-neutral-100 rounded overflow-hidden flex-shrink-0">
                                <Image
                                  src={img.url}
                                  alt={img.caption || "Gallery photo"}
                                  fill
                                  unoptimized
                                  className="object-cover"
                                />
                              </div>
                              <div className="flex-1 space-y-1.5">
                                <input
                                  type="text"
                                  value={img.url}
                                  onChange={(e) => {
                                    const updated = [...projects];
                                    updated[idx].gallery[gIdx].url = e.target.value;
                                    saveProjects(updated);
                                  }}
                                  placeholder="Image URL"
                                  className="w-full p-1 border border-neutral-300 rounded text-[11px] font-mono"
                                />
                                <input
                                  type="text"
                                  value={img.caption}
                                  onChange={(e) => {
                                    const updated = [...projects];
                                    updated[idx].gallery[gIdx].caption = e.target.value;
                                    saveProjects(updated);
                                  }}
                                  placeholder="Photo caption"
                                  className="w-full p-1 border border-neutral-300 rounded text-[11px]"
                                />
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = [...projects];
                                  updated[idx].gallery = updated[idx].gallery.filter((_, i) => i !== gIdx);
                                  saveProjects(updated);
                                }}
                                className="text-neutral-400 hover:text-red-500 p-1"
                                title="Remove photo"
                              >
                                <X size={14} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. SERVICES TAB (FULL ACCESS)                             */}
      {/* ========================================================= */}
      {activeTab === "services" && (
        <div className="space-y-8">
          {/* Services Page Header & Scope Banner Settings */}
          <div className="p-6 bg-neutral-50 border border-neutral-200 rounded space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-neutral-200 gap-2">
              <div className="flex items-center gap-2">
                <Layers size={16} className="text-neutral-800" />
                <h3 className="text-xs uppercase tracking-wider font-semibold text-neutral-900">
                  Services Page Header &amp; Top Banner
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  saveSiteSettings(siteSettings);
                  showToast("Services page header settings updated.");
                }}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-black text-white text-xs uppercase tracking-wider font-medium hover:bg-neutral-800 transition-colors rounded self-start sm:self-auto"
              >
                <Save size={12} />
                <span>Save Header</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="text-[10px] uppercase font-mono text-neutral-500 block mb-1">
                  Primary Page Topic / Heading
                </label>
                <input
                  type="text"
                  value={siteSettings.servicesHeader?.title ?? "Services"}
                  onChange={(e) => {
                    const currentHeader = siteSettings.servicesHeader || {
                      title: "Services",
                      subtitle: "PRACTICE DISCIPLINES & SCOPE",
                      description: "We provide integrated design services for new buildings and interior environments. Each appointment is structured around the project's scale, stage and specific requirements.",
                    };
                    saveSiteSettings({
                      ...siteSettings,
                      servicesHeader: { ...currentHeader, title: e.target.value },
                    });
                  }}
                  placeholder="Services"
                  className="w-full p-2 border border-neutral-300 rounded text-xs bg-white font-medium"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-mono text-neutral-500 block mb-1">
                  Scope Sub-heading / Monospace Tag (Below Topic)
                </label>
                <input
                  type="text"
                  value={siteSettings.servicesHeader?.subtitle ?? "PRACTICE DISCIPLINES & SCOPE"}
                  onChange={(e) => {
                    const currentHeader = siteSettings.servicesHeader || {
                      title: "Services",
                      subtitle: "PRACTICE DISCIPLINES & SCOPE",
                      description: "We provide integrated design services for new buildings and interior environments. Each appointment is structured around the project's scale, stage and specific requirements.",
                    };
                    saveSiteSettings({
                      ...siteSettings,
                      servicesHeader: { ...currentHeader, subtitle: e.target.value },
                    });
                  }}
                  placeholder="PRACTICE DISCIPLINES & SCOPE"
                  className="w-full p-2 border border-neutral-300 rounded text-xs bg-white font-mono"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-[10px] uppercase font-mono text-neutral-500 block mb-1">
                  Services Introduction Narrative
                </label>
                <textarea
                  rows={2}
                  value={
                    siteSettings.servicesHeader?.description ??
                    "We provide integrated design services for new buildings and interior environments. Each appointment is structured around the project's scale, stage and specific requirements."
                  }
                  onChange={(e) => {
                    const currentHeader = siteSettings.servicesHeader || {
                      title: "Services",
                      subtitle: "PRACTICE DISCIPLINES & SCOPE",
                      description: "We provide integrated design services for new buildings and interior environments. Each appointment is structured around the project's scale, stage and specific requirements.",
                    };
                    saveSiteSettings({
                      ...siteSettings,
                      servicesHeader: { ...currentHeader, description: e.target.value },
                    });
                  }}
                  className="w-full p-2 border border-neutral-300 rounded text-xs bg-white leading-relaxed"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-900">
                Studio Disciplines &amp; Services ({services.length})
              </h2>
              <p className="text-xs text-neutral-500">
                Edit scope, deliverables, and stage-gate process for each discipline.
              </p>
            </div>
            <button
              onClick={() => {
                const newS: Service = {
                  id: `serv-${Date.now()}`,
                  slug: `service-${services.length + 1}`,
                  title: `New Discipline ${services.length + 1}`,
                  shortDescription: "Comprehensive architectural and specialist consultation service.",
                  detailedDescription: "Structured design methodology delivering integrated architectural solutions.",
                  image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=85",
                  process: [
                    { step: "01", title: "Brief Analysis", description: "Site study and program requirements." },
                    { step: "02", title: "Concept Design", description: "Spatial volume and material explorations." },
                    { step: "03", title: "Documentation", description: "Working drawings and specifications." },
                    { step: "04", title: "Site Review", description: "Construction coordination." },
                  ],
                  deliverables: ["Initial consultation", "Schematic drawings", "Execution drawings"],
                  relatedProjectSlugs: [],
                };
                saveServices([...services, newS]);
                showToast("New service created.");
              }}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-black text-white text-xs uppercase tracking-wider font-medium hover:bg-neutral-800 transition-colors rounded"
            >
              <Plus size={13} />
              <span>Add Discipline</span>
            </button>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {services.map((s, idx) => (
              <div key={s.id} className="p-5 border border-neutral-200 bg-white rounded space-y-4 shadow-xs">
                <div className="flex justify-between items-center border-b border-neutral-100 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono font-bold text-neutral-400">0{idx + 1}</span>
                    <input
                      type="text"
                      value={s.title}
                      onChange={(e) => {
                        const updated = [...services];
                        updated[idx].title = e.target.value;
                        saveServices(updated);
                      }}
                      className="font-display text-base font-semibold text-neutral-900 border-b border-transparent hover:border-neutral-300 focus:border-black focus:outline-none px-1"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Link
                      href={`/services/${s.slug}`}
                      target="_blank"
                      className="text-neutral-500 hover:text-black text-xs font-mono px-2 py-1 border border-neutral-200 rounded"
                    >
                      View Live →
                    </Link>
                    <button
                      onClick={() => {
                        if (confirm(`Delete service "${s.title}"?`)) {
                          saveServices(services.filter((x) => x.id !== s.id));
                          showToast(`Service "${s.title}" deleted.`);
                        }
                      }}
                      className="text-neutral-400 hover:text-red-500 p-1"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="text-[10px] uppercase font-mono text-neutral-500 block mb-1">
                      Slug (URL)
                    </label>
                    <input
                      type="text"
                      value={s.slug}
                      onChange={(e) => {
                        const updated = [...services];
                        updated[idx].slug = e.target.value;
                        saveServices(updated);
                      }}
                      className="w-full p-2 border border-neutral-300 rounded font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-mono text-neutral-500 block mb-1">
                      Cover Image URL
                    </label>
                    <input
                      type="text"
                      value={s.image}
                      onChange={(e) => {
                        const updated = [...services];
                        updated[idx].image = e.target.value;
                        saveServices(updated);
                      }}
                      className="w-full p-2 border border-neutral-300 rounded font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] uppercase font-mono text-neutral-500 block mb-1">
                    Short Summary (Catalog View)
                  </label>
                  <input
                    type="text"
                    value={s.shortDescription}
                    onChange={(e) => {
                      const updated = [...services];
                      updated[idx].shortDescription = e.target.value;
                      saveServices(updated);
                    }}
                    className="w-full p-2 border border-neutral-300 rounded text-xs"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-mono text-neutral-500 block mb-1">
                    Detailed Scope Description
                  </label>
                  <textarea
                    rows={3}
                    value={s.detailedDescription}
                    onChange={(e) => {
                      const updated = [...services];
                      updated[idx].detailedDescription = e.target.value;
                      saveServices(updated);
                    }}
                    className="w-full p-2 border border-neutral-300 rounded text-xs leading-relaxed"
                  />
                </div>

                {/* Deliverables Checklist Manager */}
                <div className="pt-2 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-neutral-600">
                      Deliverables Checklist ({s.deliverables?.length || 0})
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const updated = [...services];
                        updated[idx].deliverables = [...(updated[idx].deliverables || []), "New deliverable scope item"];
                        saveServices(updated);
                      }}
                      className="text-[10px] uppercase font-semibold text-black hover:underline inline-flex items-center gap-1"
                    >
                      <Plus size={11} />
                      <span>Add Deliverable</span>
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {s.deliverables?.map((del, dIdx) => (
                      <div key={dIdx} className="flex items-center gap-2 bg-neutral-50 p-1.5 border border-neutral-200 rounded">
                        <input
                          type="text"
                          value={del}
                          onChange={(e) => {
                            const updated = [...services];
                            updated[idx].deliverables[dIdx] = e.target.value;
                            saveServices(updated);
                          }}
                          className="flex-1 bg-transparent text-xs focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const updated = [...services];
                            updated[idx].deliverables = updated[idx].deliverables.filter((_, i) => i !== dIdx);
                            saveServices(updated);
                          }}
                          className="text-neutral-400 hover:text-red-500 p-0.5"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Scope of Work — Methodological Phases Manager */}
                <div className="pt-3 border-t border-neutral-200 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <ListChecks size={15} className="text-neutral-800" />
                      <span className="text-[10px] uppercase font-mono tracking-wider font-semibold text-neutral-800">
                        Scope of Work — Design Phases ({s.process?.length || 0} Stages)
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const updated = [...services];
                        const nextStepNum = String((updated[idx].process?.length || 0) + 1).padStart(2, "0");
                        const newStep = {
                          step: nextStepNum,
                          title: `New Phase ${nextStepNum}`,
                          description: "Comprehensive deliverables, technical drawings, and coordination protocols.",
                        };
                        updated[idx].process = [...(updated[idx].process || []), newStep];
                        saveServices(updated);
                        showToast(`Phase ${nextStepNum} added to "${s.title}".`);
                      }}
                      className="text-[10px] uppercase font-semibold text-black hover:underline inline-flex items-center gap-1"
                    >
                      <Plus size={11} />
                      <span>+ Add Scope Phase</span>
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {s.process?.map((phase, pIdx) => (
                      <div
                        key={pIdx}
                        className="p-3 bg-neutral-50/80 border border-neutral-200 rounded space-y-2 text-xs"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 flex-1">
                            <span className="text-[10px] uppercase font-mono text-neutral-400 font-semibold">
                              Phase
                            </span>
                            <input
                              type="text"
                              value={phase.step}
                              onChange={(e) => {
                                const updated = [...services];
                                updated[idx].process[pIdx].step = e.target.value;
                                saveServices(updated);
                              }}
                              className="w-14 p-1 border border-neutral-300 rounded font-mono text-xs bg-white text-center font-bold"
                              placeholder="01"
                            />
                            <input
                              type="text"
                              value={phase.title}
                              onChange={(e) => {
                                const updated = [...services];
                                updated[idx].process[pIdx].title = e.target.value;
                                saveServices(updated);
                              }}
                              className="flex-1 p-1 border border-neutral-300 rounded font-medium text-xs bg-white"
                              placeholder="Phase Title"
                            />
                          </div>

                          <div className="flex items-center gap-1">
                            {/* Move Up */}
                            {pIdx > 0 && (
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = [...services];
                                  const temp = updated[idx].process[pIdx - 1];
                                  updated[idx].process[pIdx - 1] = updated[idx].process[pIdx];
                                  updated[idx].process[pIdx] = temp;
                                  saveServices(updated);
                                }}
                                className="p-1 text-neutral-400 hover:text-black"
                                title="Move Phase Up"
                              >
                                <ChevronUp size={14} />
                              </button>
                            )}

                            {/* Move Down */}
                            {pIdx < (s.process?.length || 0) - 1 && (
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = [...services];
                                  const temp = updated[idx].process[pIdx + 1];
                                  updated[idx].process[pIdx + 1] = updated[idx].process[pIdx];
                                  updated[idx].process[pIdx] = temp;
                                  saveServices(updated);
                                }}
                                className="p-1 text-neutral-400 hover:text-black"
                                title="Move Phase Down"
                              >
                                <ChevronDown size={14} />
                              </button>
                            )}

                            {/* Delete Phase */}
                            <button
                              type="button"
                              onClick={() => {
                                if (confirm(`Delete phase "${phase.title}"?`)) {
                                  const updated = [...services];
                                  updated[idx].process = updated[idx].process.filter((_, i) => i !== pIdx);
                                  saveServices(updated);
                                  showToast("Phase removed.");
                                }
                              }}
                              className="text-neutral-400 hover:text-red-500 p-1"
                              title="Delete Phase"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>

                        <textarea
                          rows={2}
                          value={phase.description}
                          onChange={(e) => {
                            const updated = [...services];
                            updated[idx].process[pIdx].description = e.target.value;
                            saveServices(updated);
                          }}
                          placeholder="Phase deliverables, milestones, and scope summary"
                          className="w-full p-2 border border-neutral-300 rounded text-xs bg-white leading-relaxed"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 3. TEAM TAB (FULL ACCESS)                                 */}
      {/* ========================================================= */}
      {activeTab === "team" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-900">
                Studio Leadership & Practitioners ({team.length})
              </h2>
              <p className="text-xs text-neutral-500">
                Manage practitioner bios, credentials, roles, and photography.
              </p>
            </div>
            <button
              onClick={() => {
                const newT: TeamMember = {
                  id: `team-${Date.now()}`,
                  name: `Architect Name ${team.length + 1}`,
                  role: "Project Architect",
                  discipline: "Architecture",
                  credentials: "B.Arch",
                  bio: "Practitioner contributing to innovative spatial planning and craftsmanship.",
                  image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=85",
                  socials: [],
                };
                saveTeam([...team, newT]);
                showToast("New team member added.");
              }}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-black text-white text-xs uppercase tracking-wider font-medium hover:bg-neutral-800 transition-colors rounded"
            >
              <Plus size={13} />
              <span>Add Member</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {team.map((m, idx) => (
              <div key={m.id} className="p-4 border border-neutral-200 bg-white space-y-3 rounded shadow-xs text-xs">
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-14 bg-neutral-100 rounded overflow-hidden flex-shrink-0">
                    {m.image ? (
                      <Image
                        src={m.image}
                        alt={m.name}
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-neutral-400 font-mono text-[8px] uppercase">
                        No Photo
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <input
                      type="text"
                      value={m.name}
                      onChange={(e) => {
                        const updated = [...team];
                        updated[idx].name = e.target.value;
                        saveTeam(updated);
                      }}
                      className="w-full font-semibold text-sm border-b border-neutral-300 focus:border-black focus:outline-none pb-0.5"
                    />
                    <input
                      type="text"
                      value={m.role}
                      onChange={(e) => {
                        const updated = [...team];
                        updated[idx].role = e.target.value;
                        saveTeam(updated);
                      }}
                      className="w-full text-xs text-neutral-600 mt-1 border-b border-neutral-200 focus:border-black focus:outline-none"
                    />
                  </div>
                  <button
                    onClick={() => {
                      if (confirm(`Remove ${m.name} from studio team?`)) {
                        saveTeam(team.filter((x) => x.id !== m.id));
                        showToast(`Removed ${m.name}.`);
                      }
                    }}
                    className="text-neutral-400 hover:text-red-500 p-1"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[9px] uppercase font-mono text-neutral-400 block mb-0.5">Discipline</label>
                    <select
                      value={m.discipline}
                      onChange={(e) => {
                        const updated = [...team];
                        updated[idx].discipline = e.target.value as any;
                        saveTeam(updated);
                      }}
                      className="w-full p-1.5 border border-neutral-300 rounded text-xs bg-white"
                    >
                      <option value="Leadership">Leadership</option>
                      <option value="Architecture">Architecture</option>
                      <option value="Interiors">Interiors</option>
                      <option value="BIM & Technical">BIM & Technical</option>
                      <option value="Research & Sustainability">Research & Sustainability</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[9px] uppercase font-mono text-neutral-400 block mb-0.5">Credentials</label>
                    <input
                      type="text"
                      value={m.credentials}
                      onChange={(e) => {
                        const updated = [...team];
                        updated[idx].credentials = e.target.value;
                        saveTeam(updated);
                      }}
                      className="w-full p-1.5 border border-neutral-300 rounded text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[9px] uppercase font-mono text-neutral-400 block mb-0.5">Photo URL</label>
                  <input
                    type="text"
                    value={m.image}
                    onChange={(e) => {
                      const updated = [...team];
                      updated[idx].image = e.target.value;
                      saveTeam(updated);
                    }}
                    className="w-full p-1.5 border border-neutral-300 rounded text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="text-[9px] uppercase font-mono text-neutral-400 block mb-0.5">Biography</label>
                  <textarea
                    rows={3}
                    value={m.bio}
                    onChange={(e) => {
                      const updated = [...team];
                      updated[idx].bio = e.target.value;
                      saveTeam(updated);
                    }}
                    className="w-full p-2 border border-neutral-300 rounded text-xs leading-relaxed"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 4. BLOG TAB (FULL ACCESS)                                 */}
      {/* ========================================================= */}
      {activeTab === "blog" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-900">
                Monographs & Research Articles ({blog.length})
              </h2>
              <p className="text-xs text-neutral-500">
                Publish spatial theory, material research, and monograph releases.
              </p>
            </div>
            <button
              onClick={() => {
                const newB: BlogPost = {
                  id: `blog-${Date.now()}`,
                  slug: `monograph-${blog.length + 1}`,
                  title: `Spatial Study ${blog.length + 1}: Contemporary Materiality`,
                  excerpt: "An architectural exploration of texture, proportion, and climatic light.",
                  category: "Spatial Theory",
                  author: {
                    name: "Ar. Rajesh Shivaram",
                    role: "Principal Architect",
                    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=85",
                  },
                  publishedAt: new Date().toISOString().split("T")[0],
                  readingTime: "6 min read",
                  heroImage: "/projects/aikya/elevation-evening.jpg",
                  featured: false,
                  content: {
                    introduction: "Architecture emerges at the confluence of light, matter, and human experience.",
                    sections: [
                      {
                        heading: "I. Tectonic Synthesis",
                        body: ["Exploration of natural light filtering through textured planes."],
                      },
                    ],
                    conclusion: "Spatial clarity endures when rooted in restraint.",
                  },
                  tags: ["Materiality", "Theory"],
                  relatedSlugs: [],
                };
                saveBlog([newB, ...blog]);
                showToast("New monograph created.");
              }}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-black text-white text-xs uppercase tracking-wider font-medium hover:bg-neutral-800 transition-colors rounded"
            >
              <Plus size={13} />
              <span>Write New Monograph</span>
            </button>
          </div>

          <div className="space-y-4">
            {blog.map((b, idx) => (
              <div key={b.id} className="p-5 border border-neutral-200 bg-white rounded space-y-3 text-xs shadow-xs">
                <div className="flex justify-between items-center border-b border-neutral-100 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-neutral-400 uppercase">{b.category}</span>
                    <span>·</span>
                    <span className="text-[10px] font-mono text-neutral-400">{b.publishedAt}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Link
                      href={`/blog/${b.slug}`}
                      target="_blank"
                      className="text-neutral-500 hover:text-black text-xs font-mono px-2 py-0.5 border border-neutral-200 rounded"
                    >
                      Read Live →
                    </Link>
                    <button
                      onClick={() => {
                        if (confirm(`Delete monograph "${b.title}"?`)) {
                          saveBlog(blog.filter((x) => x.id !== b.id));
                          showToast(`Deleted "${b.title}".`);
                        }
                      }}
                      className="text-neutral-400 hover:text-red-500 p-1"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="text-[10px] uppercase font-mono text-neutral-500 block mb-1">Title</label>
                    <input
                      type="text"
                      value={b.title}
                      onChange={(e) => {
                        const updated = [...blog];
                        updated[idx].title = e.target.value;
                        saveBlog(updated);
                      }}
                      className="w-full p-2 border border-neutral-300 rounded font-medium"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-mono text-neutral-500 block mb-1">Slug</label>
                    <input
                      type="text"
                      value={b.slug}
                      onChange={(e) => {
                        const updated = [...blog];
                        updated[idx].slug = e.target.value;
                        saveBlog(updated);
                      }}
                      className="w-full p-2 border border-neutral-300 rounded font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] uppercase font-mono text-neutral-500 block mb-1">Excerpt</label>
                  <textarea
                    rows={2}
                    value={b.excerpt}
                    onChange={(e) => {
                      const updated = [...blog];
                      updated[idx].excerpt = e.target.value;
                      saveBlog(updated);
                    }}
                    className="w-full p-2 border border-neutral-300 rounded text-xs leading-relaxed"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 5. FAQ TAB (FULL ACCESS)                                  */}
      {/* ========================================================= */}
      {activeTab === "faq" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-900">
                Frequently Asked Questions ({faq.length})
              </h2>
              <p className="text-xs text-neutral-500">
                Maintain questions, detailed answers, and categorization.
              </p>
            </div>
            <button
              onClick={() => {
                const newF: FAQItem = {
                  id: `faq-${Date.now()}`,
                  question: "New architectural question?",
                  answer: "Detailed answer explaining studio methodology and project deliverables.",
                  category: "Engagement & Process",
                };
                saveFaq([newF, ...faq]);
                showToast("New FAQ question added.");
              }}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-black text-white text-xs uppercase tracking-wider font-medium hover:bg-neutral-800 transition-colors rounded"
            >
              <Plus size={13} />
              <span>Add FAQ</span>
            </button>
          </div>

          <div className="space-y-4">
            {faq.map((item, idx) => (
              <div key={item.id} className="p-4 border border-neutral-200 bg-white space-y-2 rounded shadow-xs text-xs">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-neutral-100 pb-2">
                  <div className="flex items-center gap-2 flex-1">
                    <span className="text-[10px] font-mono text-neutral-400">Q{idx + 1}.</span>
                    <input
                      type="text"
                      value={item.question}
                      onChange={(e) => {
                        const updated = [...faq];
                        updated[idx].question = e.target.value;
                        saveFaq(updated);
                      }}
                      className="w-full p-1 font-semibold text-neutral-900 border-b border-transparent hover:border-neutral-300 focus:border-black focus:outline-none"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <select
                      value={item.category}
                      onChange={(e) => {
                        const updated = [...faq];
                        updated[idx].category = e.target.value as any;
                        saveFaq(updated);
                      }}
                      className="p-1 border border-neutral-300 rounded text-[11px] bg-white"
                    >
                      <option value="Design Philosophy">Design Philosophy</option>
                      <option value="Engagement & Process">Engagement & Process</option>
                      <option value="Fees & Timelines">Fees & Timelines</option>
                      <option value="Sustainability">Sustainability</option>
                      <option value="Technical & BIM">Technical & BIM</option>
                    </select>
                    <button
                      onClick={() => {
                        saveFaq(faq.filter((f) => f.id !== item.id));
                        showToast("FAQ removed.");
                      }}
                      className="text-neutral-400 hover:text-red-500 p-1"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
                <textarea
                  rows={3}
                  value={item.answer}
                  onChange={(e) => {
                    const updated = [...faq];
                    updated[idx].answer = e.target.value;
                    saveFaq(updated);
                  }}
                  className="w-full p-2 border border-neutral-300 rounded text-xs leading-relaxed focus:border-black focus:outline-none"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 6. GALLERY TAB (FULL ACCESS)                              */}
      {/* ========================================================= */}
      {activeTab === "gallery" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-900">
                Visual Gallery Records ({gallery.length})
              </h2>
              <p className="text-xs text-neutral-500">
                Manage architectural photography, detail shots, drawings, and on-site captures.
              </p>
            </div>
            <button
              onClick={() => {
                const newG: GalleryItem = {
                  id: `gal-${Date.now()}`,
                  title: `Architectural Detail ${gallery.length + 1}`,
                  caption: "Volumetric junction and material expression.",
                  imageUrl: "/projects/aikya/elevation-east.jpg",
                  projectTitle: "AIKYA",
                  projectSlug: "aikya",
                  category: "Facades",
                  aspect: "landscape",
                  year: new Date().getFullYear(),
                  location: "Bengaluru, India",
                };
                saveGallery([newG, ...gallery]);
                showToast("New gallery asset added.");
              }}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-black text-white text-xs uppercase tracking-wider font-medium hover:bg-neutral-800 transition-colors rounded"
            >
              <Plus size={13} />
              <span>Add Image</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {gallery.map((g, idx) => (
              <div key={g.id} className="p-3 border border-neutral-200 bg-white space-y-2 rounded shadow-xs text-xs">
                <div className="relative aspect-[16/10] w-full bg-neutral-100 rounded overflow-hidden">
                  <Image
                    src={g.imageUrl}
                    alt={g.title}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                  <button
                    onClick={() => {
                      saveGallery(gallery.filter((x) => x.id !== g.id));
                      showToast("Gallery asset deleted.");
                    }}
                    className="absolute top-2 right-2 p-1.5 bg-black/70 hover:bg-red-600 text-white rounded transition-colors"
                    title="Delete image"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>

                <div className="space-y-1">
                  <input
                    type="text"
                    value={g.title}
                    onChange={(e) => {
                      const updated = [...gallery];
                      updated[idx].title = e.target.value;
                      saveGallery(updated);
                    }}
                    className="w-full p-1.5 border border-neutral-300 rounded font-semibold text-xs"
                    placeholder="Photo title"
                  />
                  <input
                    type="text"
                    value={g.caption}
                    onChange={(e) => {
                      const updated = [...gallery];
                      updated[idx].caption = e.target.value;
                      saveGallery(updated);
                    }}
                    className="w-full p-1.5 border border-neutral-300 rounded text-xs"
                    placeholder="Caption"
                  />
                  <input
                    type="text"
                    value={g.imageUrl}
                    onChange={(e) => {
                      const updated = [...gallery];
                      updated[idx].imageUrl = e.target.value;
                      saveGallery(updated);
                    }}
                    className="w-full p-1.5 border border-neutral-300 rounded text-[11px] font-mono"
                    placeholder="Image URL"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1 border-t border-neutral-100">
                  <select
                    value={g.category}
                    onChange={(e) => {
                      const updated = [...gallery];
                      updated[idx].category = e.target.value as any;
                      saveGallery(updated);
                    }}
                    className="p-1 border border-neutral-300 rounded text-[10px] bg-white"
                  >
                    <option value="Facades">Facades</option>
                    <option value="Interiors">Interiors</option>
                    <option value="Materiality">Materiality</option>
                    <option value="Landscape & Courts">Landscape & Courts</option>
                    <option value="Detail Views">Detail Views</option>
                  </select>
                  <input
                    type="text"
                    value={g.projectTitle}
                    onChange={(e) => {
                      const updated = [...gallery];
                      updated[idx].projectTitle = e.target.value;
                      saveGallery(updated);
                    }}
                    placeholder="Associated Project"
                    className="p-1 border border-neutral-300 rounded text-[10px]"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 7. AWARDS & RECOGNITIONS TAB (FULL ACCESS)                */}
      {/* ========================================================= */}
      {activeTab === "recognitions" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-900">
                Awards, Publications & Recognitions ({recognitions.length})
              </h2>
              <p className="text-xs text-neutral-500">
                Manage architectural awards, citations, biennale participations, and features.
              </p>
            </div>
            <button
              onClick={() => {
                const newR: Recognition = {
                  id: `rec-${Date.now()}`,
                  year: new Date().getFullYear(),
                  title: `Excellence Citation — Architectural Design`,
                  category: "Award",
                  organization: "Indian Institute of Architects (IIA)",
                  projectAssociated: "AIKYA",
                  projectSlug: "aikya",
                  description: "Commended for exemplary environmental response and tectonic execution.",
                  badge: "Citation Award",
                };
                saveRecognitions([newR, ...recognitions]);
                showToast("New award recognition added.");
              }}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-black text-white text-xs uppercase tracking-wider font-medium hover:bg-neutral-800 transition-colors rounded"
            >
              <Plus size={13} />
              <span>Add Recognition</span>
            </button>
          </div>

          <div className="space-y-4">
            {recognitions.map((r, idx) => (
              <div key={r.id} className="p-4 border border-neutral-200 bg-white space-y-3 rounded shadow-xs text-xs">
                <div className="flex justify-between items-center border-b border-neutral-100 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-neutral-900">{r.year}</span>
                    <span className="text-[10px] font-mono text-neutral-400 uppercase">({r.category})</span>
                  </div>
                  <button
                    onClick={() => {
                      saveRecognitions(recognitions.filter((x) => x.id !== r.id));
                      showToast("Recognition deleted.");
                    }}
                    className="text-neutral-400 hover:text-red-500 p-1"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="text-[10px] uppercase font-mono text-neutral-400 block mb-0.5">Award / Citation Title</label>
                    <input
                      type="text"
                      value={r.title}
                      onChange={(e) => {
                        const updated = [...recognitions];
                        updated[idx].title = e.target.value;
                        saveRecognitions(updated);
                      }}
                      className="w-full p-1.5 border border-neutral-300 rounded font-semibold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-mono text-neutral-400 block mb-0.5">Conferred By (Organization)</label>
                    <input
                      type="text"
                      value={r.organization}
                      onChange={(e) => {
                        const updated = [...recognitions];
                        updated[idx].organization = e.target.value;
                        saveRecognitions(updated);
                      }}
                      className="w-full p-1.5 border border-neutral-300 rounded"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] uppercase font-mono text-neutral-400 block mb-0.5">Award Summary & Citation</label>
                  <textarea
                    rows={2}
                    value={r.description}
                    onChange={(e) => {
                      const updated = [...recognitions];
                      updated[idx].description = e.target.value;
                      saveRecognitions(updated);
                    }}
                    className="w-full p-2 border border-neutral-300 rounded text-xs leading-relaxed"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 8. TESTIMONIALS TAB (FULL ACCESS)                         */}
      {/* ========================================================= */}
      {activeTab === "testimonials" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-900">
                Client Testimonials & Trust ({testimonials.length})
              </h2>
              <p className="text-xs text-neutral-500">
                Manage client quotes displayed in the homepage Testimonials section.
              </p>
            </div>
            <button
              onClick={() => {
                const newT: Testimonial = {
                  id: `test-${Date.now()}`,
                  clientName: "Client Name",
                  designation: "Homeowner",
                  company: "Private Residence",
                  projectAssociated: "AIKYA",
                  quote: "Techno Architecture delivered exceptional quality, thoughtful natural lighting and meticulous spatial craft.",
                  year: new Date().getFullYear(),
                };
                saveTestimonials([newT, ...testimonials]);
                showToast("New client testimonial added.");
              }}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-black text-white text-xs uppercase tracking-wider font-medium hover:bg-neutral-800 transition-colors rounded"
            >
              <Plus size={13} />
              <span>Add Testimonial</span>
            </button>
          </div>

          <div className="space-y-4">
            {testimonials.map((t, idx) => (
              <div key={t.id} className="p-4 border border-neutral-200 bg-white space-y-3 rounded shadow-xs text-xs">
                <div className="flex justify-between items-center border-b border-neutral-100 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-neutral-900">{t.clientName}</span>
                    <span className="text-neutral-400">·</span>
                    <span className="text-neutral-500">{t.designation}</span>
                  </div>
                  <button
                    onClick={() => {
                      saveTestimonials(testimonials.filter((x) => x.id !== t.id));
                      showToast("Testimonial removed.");
                    }}
                    className="text-neutral-400 hover:text-red-500 p-1"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[10px] uppercase font-mono text-neutral-400 block mb-0.5">Client Name</label>
                    <input
                      type="text"
                      value={t.clientName}
                      onChange={(e) => {
                        const updated = [...testimonials];
                        updated[idx].clientName = e.target.value;
                        saveTestimonials(updated);
                      }}
                      className="w-full p-1.5 border border-neutral-300 rounded font-medium"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-mono text-neutral-400 block mb-0.5">Designation</label>
                    <input
                      type="text"
                      value={t.designation}
                      onChange={(e) => {
                        const updated = [...testimonials];
                        updated[idx].designation = e.target.value;
                        saveTestimonials(updated);
                      }}
                      className="w-full p-1.5 border border-neutral-300 rounded"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-mono text-neutral-400 block mb-0.5">Associated Project</label>
                    <input
                      type="text"
                      value={t.projectAssociated}
                      onChange={(e) => {
                        const updated = [...testimonials];
                        updated[idx].projectAssociated = e.target.value;
                        saveTestimonials(updated);
                      }}
                      className="w-full p-1.5 border border-neutral-300 rounded"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] uppercase font-mono text-neutral-400 block mb-0.5">Client Quote</label>
                  <textarea
                    rows={3}
                    value={t.quote}
                    onChange={(e) => {
                      const updated = [...testimonials];
                      updated[idx].quote = e.target.value;
                      saveTestimonials(updated);
                    }}
                    className="w-full p-2 border border-neutral-300 rounded text-xs leading-relaxed"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 9. SETTINGS TAB (FULL ACCESS)                             */}
      {/* ========================================================= */}
      {activeTab === "settings" && (
        <div className="space-y-8">
          <div className="flex justify-between items-center border-b border-neutral-200 pb-4">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-900">
                Studio Settings & Core Identity
              </h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                Update practice metadata, contact channels, operating hours, and studio locations.
              </p>
            </div>
            <button
              onClick={() => {
                saveSiteSettings(siteSettings);
                showToast("All studio settings saved and published.");
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-black text-white text-xs uppercase tracking-wider font-medium hover:bg-neutral-800 transition-colors rounded shadow-sm"
            >
              <Save size={13} />
              <span>Save Settings</span>
            </button>
          </div>

          {/* Section A: Practice Identity */}
          <div className="p-6 bg-neutral-50 border border-neutral-200 rounded space-y-4">
            <div className="flex items-center gap-2">
              <Building size={16} className="text-neutral-800" />
              <h3 className="text-xs uppercase tracking-wider font-semibold text-neutral-900">
                Practice Identity & Tagline
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="text-[10px] uppercase font-mono text-neutral-500 block mb-1">
                  Practice Name
                </label>
                <input
                  type="text"
                  value={siteSettings.name}
                  onChange={(e) => {
                    saveSiteSettings({ ...siteSettings, name: e.target.value });
                  }}
                  className="w-full p-2 border border-neutral-300 rounded text-xs bg-white"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-mono text-neutral-500 block mb-1">
                  Tagline
                </label>
                <input
                  type="text"
                  value={siteSettings.tagline}
                  onChange={(e) => {
                    saveSiteSettings({ ...siteSettings, tagline: e.target.value });
                  }}
                  className="w-full p-2 border border-neutral-300 rounded text-xs bg-white"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-mono text-neutral-500 block mb-1">
                  Founded Year
                </label>
                <input
                  type="number"
                  value={siteSettings.foundedYear}
                  onChange={(e) => {
                    saveSiteSettings({ ...siteSettings, foundedYear: parseInt(e.target.value) || 2006 });
                  }}
                  className="w-full p-2 border border-neutral-300 rounded text-xs bg-white"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-mono text-neutral-500 block mb-1">
                  Business Hours
                </label>
                <input
                  type="text"
                  value={siteSettings.operatingHours}
                  onChange={(e) => {
                    saveSiteSettings({ ...siteSettings, operatingHours: e.target.value });
                  }}
                  className="w-full p-2 border border-neutral-300 rounded text-xs bg-white"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-[10px] uppercase font-mono text-neutral-500 block mb-1">
                  Sitewide Short Statement (Footer Copy)
                </label>
                <input
                  type="text"
                  value={siteSettings.shortDescription}
                  onChange={(e) => {
                    saveSiteSettings({ ...siteSettings, shortDescription: e.target.value });
                  }}
                  className="w-full p-2 border border-neutral-300 rounded text-xs bg-white"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-[10px] uppercase font-mono text-neutral-500 block mb-1">
                  Long Introduction Statement (Homepage & About)
                </label>
                <textarea
                  rows={3}
                  value={siteSettings.longDescription}
                  onChange={(e) => {
                    saveSiteSettings({ ...siteSettings, longDescription: e.target.value });
                  }}
                  className="w-full p-2 border border-neutral-300 rounded text-xs leading-relaxed bg-white"
                />
              </div>
            </div>
          </div>

          {/* Section B: Contact & Correspondence */}
          <div className="p-6 bg-neutral-50 border border-neutral-200 rounded space-y-4">
            <div className="flex items-center gap-2">
              <Mail size={16} className="text-neutral-800" />
              <h3 className="text-xs uppercase tracking-wider font-semibold text-neutral-900">
                Official Inboxes & Phone
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="text-[10px] uppercase font-mono text-neutral-500 block mb-1">
                  General Inquiry Email
                </label>
                <input
                  type="email"
                  value={siteSettings.contact.email}
                  onChange={(e) => {
                    saveSiteSettings({
                      ...siteSettings,
                      contact: { ...siteSettings.contact, email: e.target.value },
                    });
                  }}
                  className="w-full p-2 border border-neutral-300 rounded text-xs bg-white"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-mono text-neutral-500 block mb-1">
                  Direct Office Phone
                </label>
                <input
                  type="text"
                  value={siteSettings.contact.phone}
                  onChange={(e) => {
                    saveSiteSettings({
                      ...siteSettings,
                      contact: { ...siteSettings.contact, phone: e.target.value },
                    });
                  }}
                  className="w-full p-2 border border-neutral-300 rounded text-xs bg-white"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-mono text-neutral-500 block mb-1">
                  Press Email
                </label>
                <input
                  type="email"
                  value={siteSettings.contact.pressEmail}
                  onChange={(e) => {
                    saveSiteSettings({
                      ...siteSettings,
                      contact: { ...siteSettings.contact, pressEmail: e.target.value },
                    });
                  }}
                  className="w-full p-2 border border-neutral-300 rounded text-xs bg-white"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-mono text-neutral-500 block mb-1">
                  Careers & Portfolio Email
                </label>
                <input
                  type="email"
                  value={siteSettings.contact.careersEmail}
                  onChange={(e) => {
                    saveSiteSettings({
                      ...siteSettings,
                      contact: { ...siteSettings.contact, careersEmail: e.target.value },
                    });
                  }}
                  className="w-full p-2 border border-neutral-300 rounded text-xs bg-white"
                />
              </div>
            </div>
          </div>

          {/* Section C: Studio Location & Socials */}
          <div className="p-6 bg-neutral-50 border border-neutral-200 rounded space-y-4">
            <div className="flex items-center gap-2">
              <MapPin size={16} className="text-neutral-800" />
              <h3 className="text-xs uppercase tracking-wider font-semibold text-neutral-900">
                Studio Address & Social Coordinates
              </h3>
            </div>

            {siteSettings.studios.map((st, sIdx) => (
              <div key={sIdx} className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="text-[10px] uppercase font-mono text-neutral-500 block mb-1">
                    Studio Location Label
                  </label>
                  <input
                    type="text"
                    value={st.city}
                    onChange={(e) => {
                      const updated = [...siteSettings.studios];
                      updated[sIdx].city = e.target.value;
                      saveSiteSettings({ ...siteSettings, studios: updated });
                    }}
                    className="w-full p-2 border border-neutral-300 rounded bg-white"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-[10px] uppercase font-mono text-neutral-500 block mb-1">
                    Street Address
                  </label>
                  <input
                    type="text"
                    value={st.address}
                    onChange={(e) => {
                      const updated = [...siteSettings.studios];
                      updated[sIdx].address = e.target.value;
                      saveSiteSettings({ ...siteSettings, studios: updated });
                    }}
                    className="w-full p-2 border border-neutral-300 rounded bg-white"
                  />
                </div>
              </div>
            ))}

            <div className="pt-4 border-t border-neutral-200 space-y-3">
              <span className="text-[10px] uppercase font-mono text-neutral-500 block">
                Social Media Coordinates & Links
              </span>
              {(siteSettings.socials || []).map((soc, socIdx) => (
                <div key={socIdx} className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="text-[9px] uppercase font-mono text-neutral-400 block mb-0.5">
                      Platform
                    </label>
                    <input
                      type="text"
                      value={soc.platform}
                      onChange={(e) => {
                        const updated = [...(siteSettings.socials || [])];
                        updated[socIdx] = { ...updated[socIdx], platform: e.target.value };
                        saveSiteSettings({ ...siteSettings, socials: updated });
                      }}
                      className="w-full p-2 border border-neutral-300 rounded bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] uppercase font-mono text-neutral-400 block mb-0.5">
                      Handle / Label
                    </label>
                    <input
                      type="text"
                      value={soc.handle}
                      onChange={(e) => {
                        const updated = [...(siteSettings.socials || [])];
                        updated[socIdx] = { ...updated[socIdx], handle: e.target.value };
                        saveSiteSettings({ ...siteSettings, socials: updated });
                      }}
                      className="w-full p-2 border border-neutral-300 rounded bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] uppercase font-mono text-neutral-400 block mb-0.5">
                      URL
                    </label>
                    <input
                      type="url"
                      value={soc.url}
                      onChange={(e) => {
                        const updated = [...(siteSettings.socials || [])];
                        updated[socIdx] = { ...updated[socIdx], url: e.target.value };
                        saveSiteSettings({ ...siteSettings, socials: updated });
                      }}
                      className="w-full p-2 border border-neutral-300 rounded bg-white"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section D: About Page — Studio Milestones & Statistics */}
          <div className="p-6 bg-neutral-50 border border-neutral-200 rounded space-y-4">
            <div className="flex flex-wrap items-center justify-between pb-3 border-b border-neutral-200 gap-2">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-neutral-800" />
                <h3 className="text-xs uppercase tracking-wider font-semibold text-neutral-900">
                  About Page — Studio Milestones &amp; Statistics Banner
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  const current = siteSettings.milestones || [
                    { value: "2006", label: "Established Studio", detail: "Rooted in Basavanagudi" },
                    { value: "20+", label: "Years Experience", detail: "Ar. Rajesh Shivaram" },
                    { value: "100+", label: "Projects Designed", detail: "Contextual & Sustainable" },
                    { value: "15+", label: "Recognitions", detail: "Awards, Publications & Monograph" },
                  ];
                  const newStat: StudioMilestone = {
                    value: "50+",
                    label: "New Milestone",
                    detail: "Studio Recognition",
                  };
                  saveSiteSettings({ ...siteSettings, milestones: [...current, newStat] });
                  showToast("New milestone statistic added.");
                }}
                className="text-[10px] uppercase font-semibold text-black hover:underline inline-flex items-center gap-1"
              >
                <Plus size={11} />
                <span>+ Add Milestone Metric</span>
              </button>
            </div>

            <p className="text-xs text-neutral-500">
              The high-impact dark statistics banner featured on the About page between Core Values and What Sets Us Apart.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {(siteSettings.milestones || [
                { value: "2006", label: "Established Studio", detail: "Rooted in Basavanagudi" },
                { value: "20+", label: "Years Experience", detail: "Ar. Rajesh Shivaram" },
                { value: "100+", label: "Projects Designed", detail: "Contextual & Sustainable" },
                { value: "15+", label: "Recognitions", detail: "Awards, Publications & Monograph" },
              ]).map((m, mIdx) => (
                <div key={mIdx} className="p-3 bg-white border border-neutral-200 rounded space-y-2 text-xs relative group">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-mono font-semibold text-neutral-400">
                      METRIC 0{mIdx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const current = siteSettings.milestones || [
                          { value: "2006", label: "Established Studio", detail: "Rooted in Basavanagudi" },
                          { value: "20+", label: "Years Experience", detail: "Ar. Rajesh Shivaram" },
                          { value: "100+", label: "Projects Designed", detail: "Contextual & Sustainable" },
                          { value: "15+", label: "Recognitions", detail: "Awards, Publications & Monograph" },
                        ];
                        const updated = current.filter((_, i) => i !== mIdx);
                        saveSiteSettings({ ...siteSettings, milestones: updated });
                        showToast("Milestone statistic removed.");
                      }}
                      className="text-neutral-400 hover:text-red-500 p-0.5"
                      title="Remove Metric"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>

                  <div>
                    <label className="text-[9px] uppercase font-mono text-neutral-400 block mb-0.5">
                      Stat Display (e.g. 2006, 20+, 100+)
                    </label>
                    <input
                      type="text"
                      value={m.value}
                      onChange={(e) => {
                        const current = [...(siteSettings.milestones || [
                          { value: "2006", label: "Established Studio", detail: "Rooted in Basavanagudi" },
                          { value: "20+", label: "Years Experience", detail: "Ar. Rajesh Shivaram" },
                          { value: "100+", label: "Projects Designed", detail: "Contextual & Sustainable" },
                          { value: "15+", label: "Recognitions", detail: "Awards, Publications & Monograph" },
                        ])];
                        current[mIdx] = { ...current[mIdx], value: e.target.value };
                        saveSiteSettings({ ...siteSettings, milestones: current });
                      }}
                      className="w-full p-1.5 border border-neutral-300 rounded font-display text-sm font-semibold"
                    />
                  </div>

                  <div>
                    <label className="text-[9px] uppercase font-mono text-neutral-400 block mb-0.5">
                      Label
                    </label>
                    <input
                      type="text"
                      value={m.label}
                      onChange={(e) => {
                        const current = [...(siteSettings.milestones || [
                          { value: "2006", label: "Established Studio", detail: "Rooted in Basavanagudi" },
                          { value: "20+", label: "Years Experience", detail: "Ar. Rajesh Shivaram" },
                          { value: "100+", label: "Projects Designed", detail: "Contextual & Sustainable" },
                          { value: "15+", label: "Recognitions", detail: "Awards, Publications & Monograph" },
                        ])];
                        current[mIdx] = { ...current[mIdx], label: e.target.value };
                        saveSiteSettings({ ...siteSettings, milestones: current });
                      }}
                      className="w-full p-1.5 border border-neutral-300 rounded text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-[9px] uppercase font-mono text-neutral-400 block mb-0.5">
                      Detail Note
                    </label>
                    <input
                      type="text"
                      value={m.detail}
                      onChange={(e) => {
                        const current = [...(siteSettings.milestones || [
                          { value: "2006", label: "Established Studio", detail: "Rooted in Basavanagudi" },
                          { value: "20+", label: "Years Experience", detail: "Ar. Rajesh Shivaram" },
                          { value: "100+", label: "Projects Designed", detail: "Contextual & Sustainable" },
                          { value: "15+", label: "Recognitions", detail: "Awards, Publications & Monograph" },
                        ])];
                        current[mIdx] = { ...current[mIdx], detail: e.target.value };
                        saveSiteSettings({ ...siteSettings, milestones: current });
                      }}
                      className="w-full p-1.5 border border-neutral-300 rounded text-[11px] font-mono"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section E: About Page — Vision & Mission */}
          <div className="p-6 bg-neutral-50 border border-neutral-200 rounded space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-neutral-200">
              <Compass size={16} className="text-neutral-800" />
              <h3 className="text-xs uppercase tracking-wider font-semibold text-neutral-900">
                About Page — Vision &amp; Mission Orientation
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="text-[10px] uppercase font-mono text-neutral-500 block mb-1">
                  Vision Statement
                </label>
                <textarea
                  rows={4}
                  value={
                    siteSettings.vision ??
                    "To create architecture that improves everyday life, responds responsibly to its environment and remains meaningful over time."
                  }
                  onChange={(e) => {
                    saveSiteSettings({ ...siteSettings, vision: e.target.value });
                  }}
                  className="w-full p-2 border border-neutral-300 rounded text-xs bg-white leading-relaxed"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-mono text-neutral-500 block mb-1">
                  Mission Statement
                </label>
                <textarea
                  rows={4}
                  value={
                    siteSettings.mission ??
                    "To guide every project through a clear and collaborative design process, bringing together creativity, technical rigour, environmental awareness and careful execution. We aim to deliver spaces that reflect each client's needs while contributing positively to their setting."
                  }
                  onChange={(e) => {
                    saveSiteSettings({ ...siteSettings, mission: e.target.value });
                  }}
                  className="w-full p-2 border border-neutral-300 rounded text-xs bg-white leading-relaxed"
                />
              </div>
            </div>
          </div>

          {/* Section F: About Page — Core Values (Principles & Ethics) */}
          <div className="p-6 bg-neutral-50 border border-neutral-200 rounded space-y-4">
            <div className="flex flex-wrap items-center justify-between pb-3 border-b border-neutral-200 gap-2">
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-neutral-800" />
                <h3 className="text-xs uppercase tracking-wider font-semibold text-neutral-900">
                  About Page — Core Values &amp; Principles ({(siteSettings.coreValues || []).length || 6} Values)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  const current = siteSettings.coreValues || [
                    { num: "01", title: "Design Integrity", desc: "We protect the central idea of a project from concept through completion.", tag: "Commitment" },
                    { num: "02", title: "Client Partnership", desc: "We listen, explain choices clearly and make decisions collaboratively.", tag: "Dialogue" },
                    { num: "03", title: "Context and Climate", desc: "We respond to orientation, light, ventilation, landscape and local conditions.", tag: "Sustainability" },
                    { num: "04", title: "Practical Innovation", desc: "We explore new possibilities while respecting function, budget and construction realities.", tag: "Engineering" },
                    { num: "05", title: "Responsible Practice", desc: "We favour durable solutions, efficient planning and environmentally conscious choices.", tag: "Lifecycle" },
                    { num: "06", title: "Craft and Detail", desc: "We believe material junctions, proportions and execution determine the quality of the finished space.", tag: "Precision" },
                  ];
                  const nextNum = String(current.length + 1).padStart(2, "0");
                  const newVal: CoreValue = {
                    num: nextNum,
                    title: `New Principle ${nextNum}`,
                    tag: "Ethics",
                    desc: "Commitment to enduring architectural quality, honest materiality, and environmental stewardship.",
                  };
                  saveSiteSettings({ ...siteSettings, coreValues: [...current, newVal] });
                  showToast(`Core value ${nextNum} added.`);
                }}
                className="text-[10px] uppercase font-semibold text-black hover:underline inline-flex items-center gap-1"
              >
                <Plus size={11} />
                <span>+ Add Core Value</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {(siteSettings.coreValues || [
                { num: "01", title: "Design Integrity", desc: "We protect the central idea of a project from concept through completion.", tag: "Commitment" },
                { num: "02", title: "Client Partnership", desc: "We listen, explain choices clearly and make decisions collaboratively.", tag: "Dialogue" },
                { num: "03", title: "Context and Climate", desc: "We respond to orientation, light, ventilation, landscape and local conditions.", tag: "Sustainability" },
                { num: "04", title: "Practical Innovation", desc: "We explore new possibilities while respecting function, budget and construction realities.", tag: "Engineering" },
                { num: "05", title: "Responsible Practice", desc: "We favour durable solutions, efficient planning and environmentally conscious choices.", tag: "Lifecycle" },
                { num: "06", title: "Craft and Detail", desc: "We believe material junctions, proportions and execution determine the quality of the finished space.", tag: "Precision" },
              ]).map((v, vIdx) => (
                <div key={vIdx} className="p-3.5 bg-white border border-neutral-200 rounded space-y-2 text-xs">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={v.num}
                        onChange={(e) => {
                          const current = [...(siteSettings.coreValues || [
                            { num: "01", title: "Design Integrity", desc: "We protect the central idea of a project from concept through completion.", tag: "Commitment" },
                            { num: "02", title: "Client Partnership", desc: "We listen, explain choices clearly and make decisions collaboratively.", tag: "Dialogue" },
                            { num: "03", title: "Context and Climate", desc: "We respond to orientation, light, ventilation, landscape and local conditions.", tag: "Sustainability" },
                            { num: "04", title: "Practical Innovation", desc: "We explore new possibilities while respecting function, budget and construction realities.", tag: "Engineering" },
                            { num: "05", title: "Responsible Practice", desc: "We favour durable solutions, efficient planning and environmentally conscious choices.", tag: "Lifecycle" },
                            { num: "06", title: "Craft and Detail", desc: "We believe material junctions, proportions and execution determine the quality of the finished space.", tag: "Precision" },
                          ])];
                          current[vIdx] = { ...current[vIdx], num: e.target.value };
                          saveSiteSettings({ ...siteSettings, coreValues: current });
                        }}
                        className="w-12 p-1 border border-neutral-300 rounded font-mono text-center font-bold text-xs"
                        placeholder="01"
                      />
                      <input
                        type="text"
                        value={v.tag}
                        onChange={(e) => {
                          const current = [...(siteSettings.coreValues || [
                            { num: "01", title: "Design Integrity", desc: "We protect the central idea of a project from concept through completion.", tag: "Commitment" },
                            { num: "02", title: "Client Partnership", desc: "We listen, explain choices clearly and make decisions collaboratively.", tag: "Dialogue" },
                            { num: "03", title: "Context and Climate", desc: "We respond to orientation, light, ventilation, landscape and local conditions.", tag: "Sustainability" },
                            { num: "04", title: "Practical Innovation", desc: "We explore new possibilities while respecting function, budget and construction realities.", tag: "Engineering" },
                            { num: "05", title: "Responsible Practice", desc: "We favour durable solutions, efficient planning and environmentally conscious choices.", tag: "Lifecycle" },
                            { num: "06", title: "Craft and Detail", desc: "We believe material junctions, proportions and execution determine the quality of the finished space.", tag: "Precision" },
                          ])];
                          current[vIdx] = { ...current[vIdx], tag: e.target.value };
                          saveSiteSettings({ ...siteSettings, coreValues: current });
                        }}
                        className="w-24 p-1 border border-neutral-300 rounded font-mono text-[11px]"
                        placeholder="Tag"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const current = siteSettings.coreValues || [
                          { num: "01", title: "Design Integrity", desc: "We protect the central idea of a project from concept through completion.", tag: "Commitment" },
                          { num: "02", title: "Client Partnership", desc: "We listen, explain choices clearly and make decisions collaboratively.", tag: "Dialogue" },
                          { num: "03", title: "Context and Climate", desc: "We respond to orientation, light, ventilation, landscape and local conditions.", tag: "Sustainability" },
                          { num: "04", title: "Practical Innovation", desc: "We explore new possibilities while respecting function, budget and construction realities.", tag: "Engineering" },
                          { num: "05", title: "Responsible Practice", desc: "We favour durable solutions, efficient planning and environmentally conscious choices.", tag: "Lifecycle" },
                          { num: "06", title: "Craft and Detail", desc: "We believe material junctions, proportions and execution determine the quality of the finished space.", tag: "Precision" },
                        ];
                        const updated = current.filter((_, i) => i !== vIdx);
                        saveSiteSettings({ ...siteSettings, coreValues: updated });
                        showToast("Core value removed.");
                      }}
                      className="text-neutral-400 hover:text-red-500 p-0.5"
                      title="Remove Value"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>

                  <div>
                    <label className="text-[9px] uppercase font-mono text-neutral-400 block mb-0.5">
                      Principle Title
                    </label>
                    <input
                      type="text"
                      value={v.title}
                      onChange={(e) => {
                        const current = [...(siteSettings.coreValues || [
                          { num: "01", title: "Design Integrity", desc: "We protect the central idea of a project from concept through completion.", tag: "Commitment" },
                          { num: "02", title: "Client Partnership", desc: "We listen, explain choices clearly and make decisions collaboratively.", tag: "Dialogue" },
                          { num: "03", title: "Context and Climate", desc: "We respond to orientation, light, ventilation, landscape and local conditions.", tag: "Sustainability" },
                          { num: "04", title: "Practical Innovation", desc: "We explore new possibilities while respecting function, budget and construction realities.", tag: "Engineering" },
                          { num: "05", title: "Responsible Practice", desc: "We favour durable solutions, efficient planning and environmentally conscious choices.", tag: "Lifecycle" },
                          { num: "06", title: "Craft and Detail", desc: "We believe material junctions, proportions and execution determine the quality of the finished space.", tag: "Precision" },
                        ])];
                        current[vIdx] = { ...current[vIdx], title: e.target.value };
                        saveSiteSettings({ ...siteSettings, coreValues: current });
                      }}
                      className="w-full p-1.5 border border-neutral-300 rounded font-medium text-xs"
                      placeholder="Title"
                    />
                  </div>

                  <div>
                    <label className="text-[9px] uppercase font-mono text-neutral-400 block mb-0.5">
                      Description Narrative
                    </label>
                    <textarea
                      rows={2}
                      value={v.desc}
                      onChange={(e) => {
                        const current = [...(siteSettings.coreValues || [
                          { num: "01", title: "Design Integrity", desc: "We protect the central idea of a project from concept through completion.", tag: "Commitment" },
                          { num: "02", title: "Client Partnership", desc: "We listen, explain choices clearly and make decisions collaboratively.", tag: "Dialogue" },
                          { num: "03", title: "Context and Climate", desc: "We respond to orientation, light, ventilation, landscape and local conditions.", tag: "Sustainability" },
                          { num: "04", title: "Practical Innovation", desc: "We explore new possibilities while respecting function, budget and construction realities.", tag: "Engineering" },
                          { num: "05", title: "Responsible Practice", desc: "We favour durable solutions, efficient planning and environmentally conscious choices.", tag: "Lifecycle" },
                          { num: "06", title: "Craft and Detail", desc: "We believe material junctions, proportions and execution determine the quality of the finished space.", tag: "Precision" },
                        ])];
                        current[vIdx] = { ...current[vIdx], desc: e.target.value };
                        saveSiteSettings({ ...siteSettings, coreValues: current });
                      }}
                      className="w-full p-1.5 border border-neutral-300 rounded text-xs leading-relaxed"
                      placeholder="Narrative description"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section G: About Page — What Sets Us Apart */}
          <div className="p-6 bg-neutral-50 border border-neutral-200 rounded space-y-4">
            <div className="flex flex-wrap items-center justify-between pb-3 border-b border-neutral-200 gap-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-neutral-800" />
                <h3 className="text-xs uppercase tracking-wider font-semibold text-neutral-900">
                  About Page — What Sets Us Apart ({(siteSettings.differentiators || []).length || 3} Differentiators)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  const current = siteSettings.differentiators || [
                    { title: "End-to-End Coordination", desc: "Architecture, interiors, structural design and execution support are coordinated together as one cohesive team. This continuity prevents fragmented compromises and guarantees seamless execution." },
                    { title: "Bespoke Spatial Character", desc: "Our designs combine creativity with comfort, luxury with restraint, and ambition with practical planning. Every building is individual to the client rather than copied from a formula." },
                    { title: "Climate & Passive Intelligence", desc: "Deep overhangs, natural stack ventilation, shaded courtyards, and honest materiality keep buildings thermally comfortable and resource-conscious for generations." },
                  ];
                  const newDiff: Differentiator = {
                    title: "Collaborative Delivery",
                    desc: "Rigorous milestone coordination from site study to final handover ensures pristine execution fidelity.",
                  };
                  saveSiteSettings({ ...siteSettings, differentiators: [...current, newDiff] });
                  showToast("New differentiator added.");
                }}
                className="text-[10px] uppercase font-semibold text-black hover:underline inline-flex items-center gap-1"
              >
                <Plus size={11} />
                <span>+ Add Differentiator</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {(siteSettings.differentiators || [
                { title: "End-to-End Coordination", desc: "Architecture, interiors, structural design and execution support are coordinated together as one cohesive team. This continuity prevents fragmented compromises and guarantees seamless execution." },
                { title: "Bespoke Spatial Character", desc: "Our designs combine creativity with comfort, luxury with restraint, and ambition with practical planning. Every building is individual to the client rather than copied from a formula." },
                { title: "Climate & Passive Intelligence", desc: "Deep overhangs, natural stack ventilation, shaded courtyards, and honest materiality keep buildings thermally comfortable and resource-conscious for generations." },
              ]).map((diff, dIdx) => (
                <div key={dIdx} className="p-3.5 bg-white border border-neutral-200 rounded space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-mono text-neutral-400 font-semibold">
                      ATTRIBUTE 0{dIdx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const current = siteSettings.differentiators || [
                          { title: "End-to-End Coordination", desc: "Architecture, interiors, structural design and execution support are coordinated together as one cohesive team. This continuity prevents fragmented compromises and guarantees seamless execution." },
                          { title: "Bespoke Spatial Character", desc: "Our designs combine creativity with comfort, luxury with restraint, and ambition with practical planning. Every building is individual to the client rather than copied from a formula." },
                          { title: "Climate & Passive Intelligence", desc: "Deep overhangs, natural stack ventilation, shaded courtyards, and honest materiality keep buildings thermally comfortable and resource-conscious for generations." },
                        ];
                        const updated = current.filter((_, i) => i !== dIdx);
                        saveSiteSettings({ ...siteSettings, differentiators: updated });
                        showToast("Differentiator removed.");
                      }}
                      className="text-neutral-400 hover:text-red-500 p-0.5"
                      title="Remove"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>

                  <div>
                    <label className="text-[9px] uppercase font-mono text-neutral-400 block mb-0.5">
                      Attribute Title
                    </label>
                    <input
                      type="text"
                      value={diff.title}
                      onChange={(e) => {
                        const current = [...(siteSettings.differentiators || [
                          { title: "End-to-End Coordination", desc: "Architecture, interiors, structural design and execution support are coordinated together as one cohesive team. This continuity prevents fragmented compromises and guarantees seamless execution." },
                          { title: "Bespoke Spatial Character", desc: "Our designs combine creativity with comfort, luxury with restraint, and ambition with practical planning. Every building is individual to the client rather than copied from a formula." },
                          { title: "Climate & Passive Intelligence", desc: "Deep overhangs, natural stack ventilation, shaded courtyards, and honest materiality keep buildings thermally comfortable and resource-conscious for generations." },
                        ])];
                        current[dIdx] = { ...current[dIdx], title: e.target.value };
                        saveSiteSettings({ ...siteSettings, differentiators: current });
                      }}
                      className="w-full p-1.5 border border-neutral-300 rounded font-medium text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-[9px] uppercase font-mono text-neutral-400 block mb-0.5">
                      Narrative Detail
                    </label>
                    <textarea
                      rows={3}
                      value={diff.desc}
                      onChange={(e) => {
                        const current = [...(siteSettings.differentiators || [
                          { title: "End-to-End Coordination", desc: "Architecture, interiors, structural design and execution support are coordinated together as one cohesive team. This continuity prevents fragmented compromises and guarantees seamless execution." },
                          { title: "Bespoke Spatial Character", desc: "Our designs combine creativity with comfort, luxury with restraint, and ambition with practical planning. Every building is individual to the client rather than copied from a formula." },
                          { title: "Climate & Passive Intelligence", desc: "Deep overhangs, natural stack ventilation, shaded courtyards, and honest materiality keep buildings thermally comfortable and resource-conscious for generations." },
                        ])];
                        current[dIdx] = { ...current[dIdx], desc: e.target.value };
                        saveSiteSettings({ ...siteSettings, differentiators: current });
                      }}
                      className="w-full p-1.5 border border-neutral-300 rounded text-xs leading-relaxed"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Save Action Footer */}
          <div className="pt-4 border-t border-neutral-200 flex justify-end">
            <button
              onClick={() => {
                saveSiteSettings(siteSettings);
                showToast("All settings saved and published.");
              }}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-black text-white text-xs uppercase tracking-widest font-medium hover:bg-neutral-800 transition-colors rounded shadow"
            >
              <Save size={14} />
              <span>Save & Publish All Settings</span>
            </button>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
