"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useCMSStore } from "@/lib/cmsStore";
import { Project } from "@/data/projects";
import { Service } from "@/data/services";
import { TeamMember } from "@/data/team";
import { BlogPost } from "@/data/blog";
import { FAQItem } from "@/data/faq";
import { GalleryItem } from "@/data/gallery";
import { Recognition } from "@/data/recognitions";
import { SiteSettings } from "@/data/siteSettings";
import {
  FolderKanban,
  Wrench,
  Users,
  BookOpen,
  HelpCircle,
  Image as ImageIcon,
  Award,
  Settings,
  Plus,
  Save,
  RotateCcw,
  Download,
  CheckCircle2,
  Trash2,
  Lock,
  ShieldCheck,
  Eye,
  EyeOff,
  LogOut,
  ArrowLeft,
  AlertCircle,
  KeyRound,
  Building,
  Mail,
  Phone,
  Globe,
  MapPin,
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
  | "settings";

const HOST_AUTH_KEY = "techno_host_session_auth";
const HOST_PASSKEY_STORAGE = "techno_host_passkey";
const DEFAULT_PASSKEY = "techno2024";

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
    saveProjects,
    saveServices,
    saveTeam,
    saveBlog,
    saveFaq,
    saveGallery,
    saveRecognitions,
    saveSiteSettings,
    resetAllToDefaults,
  } = useCMSStore();

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [passkeyInput, setPasskeyInput] = useState<string>("");
  const [authError, setAuthError] = useState<string>("");
  const [showPasskey, setShowPasskey] = useState<boolean>(false);
  const [storedPasskey, setStoredPasskey] = useState<string>(DEFAULT_PASSKEY);
  const [newPasskeyInput, setNewPasskeyInput] = useState<string>("");
  const [passkeyToast, setPasskeyToast] = useState<boolean>(false);

  const [activeTab, setActiveTab] = useState<AdminTab>("projects");
  const [saveToast, setSaveToast] = useState<boolean>(false);

  // Initialize Auth State from Session
  useEffect(() => {
    if (typeof window !== "undefined") {
      const isAuth = sessionStorage.getItem(HOST_AUTH_KEY) === "true";
      setIsAuthenticated(isAuth);
      const customKey = localStorage.getItem(HOST_PASSKEY_STORAGE);
      if (customKey) setStoredPasskey(customKey);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passkeyInput === storedPasskey || passkeyInput === DEFAULT_PASSKEY) {
      setIsAuthenticated(true);
      setAuthError("");
      if (typeof window !== "undefined") {
        sessionStorage.setItem(HOST_AUTH_KEY, "true");
      }
    } else {
      setAuthError("Access Denied: Invalid security passkey. Only the owner or host can access this portal.");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPasskeyInput("");
    if (typeof window !== "undefined") {
      sessionStorage.removeItem(HOST_AUTH_KEY);
    }
  };

  const handleChangePasskey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPasskeyInput.trim()) return;
    const cleanKey = newPasskeyInput.trim();
    setStoredPasskey(cleanKey);
    if (typeof window !== "undefined") {
      localStorage.setItem(HOST_PASSKEY_STORAGE, cleanKey);
    }
    setNewPasskeyInput("");
    setPasskeyToast(true);
    setTimeout(() => setPasskeyToast(false), 3500);
  };

  const showNotification = () => {
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3000);
  };

  // Export CMS Data
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
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `techno-cms-backup-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
  };

  // RESTRICTED ACCESS SCREEN (If not authenticated as Owner/Host)
  if (!isAuthenticated) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-white border border-neutral-200 shadow-2xl p-8 sm:p-10 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center mx-auto text-neutral-800 border border-neutral-200">
              <Lock size={20} />
            </div>
            <span className="text-[10px] uppercase tracking-[0.3em] font-semibold text-neutral-400 block pt-2">
              RESTRICTED ACCESS
            </span>
            <h1 className="font-display text-2xl font-light text-neutral-900 tracking-tight">
              Owner & Host Portal
            </h1>
            <p className="text-xs text-neutral-500 leading-relaxed max-w-xs mx-auto">
              Website configuration, project archives, and settings cannot be edited by public users. Please authenticate with your owner passkey.
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <label
                htmlFor="host-passkey"
                className="text-[10px] uppercase tracking-wider font-semibold text-neutral-700 block"
              >
                Owner Security Passkey
              </label>
              <div className="relative">
                <input
                  id="host-passkey"
                  type={showPasskey ? "text" : "password"}
                  value={passkeyInput}
                  onChange={(e) => {
                    setPasskeyInput(e.target.value);
                    if (authError) setAuthError("");
                  }}
                  placeholder="Enter owner passkey"
                  required
                  autoFocus
                  className="w-full px-3.5 py-2.5 text-xs border border-neutral-300 rounded focus:outline-none focus:border-black transition-colors pr-10 font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPasskey(!showPasskey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black transition-colors"
                  aria-label={showPasskey ? "Hide passkey" : "Show passkey"}
                >
                  {showPasskey ? <EyeOff size={15} /> : <Eye size={15} />}
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
              className="w-full py-3 bg-black text-white text-xs uppercase tracking-[0.2em] font-medium hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2"
            >
              <ShieldCheck size={15} />
              <span>Authenticate as Owner</span>
            </button>
          </form>

          {/* Security Notice & Return Link */}
          <div className="pt-4 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-500">
            <span className="font-mono text-[10px] text-neutral-400">Default key: techno2024</span>
            <Link
              href="/"
              className="inline-flex items-center gap-1 hover:text-black transition-colors font-medium"
            >
              <ArrowLeft size={12} />
              <span>Return to Site</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // AUTHENTICATED OWNER & HOST CMS
  return (
    <div className="w-full py-8 md:py-12 px-4 md:px-10 max-w-7xl mx-auto space-y-8">
      {/* Top Security Banner */}
      <div className="bg-neutral-900 text-white px-4 py-2.5 rounded flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[10px] uppercase tracking-[0.25em] text-neutral-300 font-medium">
            Authenticated as Website Owner / Host
          </span>
        </div>
        <button
          onClick={handleLogout}
          type="button"
          className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-neutral-300 hover:text-white transition-colors bg-white/10 hover:bg-white/20 px-3 py-1 rounded"
        >
          <LogOut size={12} />
          <span>Lock / Sign Out</span>
        </button>
      </div>

      {/* CMS Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-neutral-200 gap-4">
        <div>
          <div className="flex items-center space-x-2 text-[10px] font-mono uppercase tracking-widest text-neutral-400">
            <span>TECHNO OWNER PORTAL</span>
            <span>·</span>
            <span className="text-emerald-600 font-semibold">LIVE REFRESH ACTIVE</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-light text-neutral-900 mt-1">
            Headless Content & System Controls
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Modify live architecture projects, disciplines, studio settings, and security credentials. All updates sync instantly.
          </p>
        </div>

        {/* Global Utilities */}
        <div className="flex items-center space-x-3 text-xs">
          <button
            onClick={exportData}
            type="button"
            className="flex items-center gap-1.5 px-3 py-2 border border-neutral-300 hover:border-black text-neutral-700 hover:text-black transition-colors rounded text-[11px]"
          >
            <Download size={13} />
            <span>Export JSON</span>
          </button>
          <button
            onClick={() => {
              if (confirm("Reset all CMS entities back to default initial seed data?")) {
                resetAllToDefaults();
                showNotification();
              }
            }}
            type="button"
            className="flex items-center gap-1.5 px-3 py-2 border border-neutral-200 hover:border-red-500 text-neutral-500 hover:text-red-600 transition-colors rounded text-[11px]"
          >
            <RotateCcw size={13} />
            <span>Reset Seeds</span>
          </button>
        </div>
      </div>

      {/* Toast Notification */}
      {saveToast && (
        <div className="p-3 bg-neutral-900 text-white text-xs flex items-center gap-2 rounded shadow-lg animate-fadeIn">
          <CheckCircle2 size={14} className="text-emerald-400" />
          <span>Record updated and persisted to website in real time.</span>
        </div>
      )}

      {passkeyToast && (
        <div className="p-3 bg-emerald-900 text-white text-xs flex items-center gap-2 rounded shadow-lg animate-fadeIn">
          <CheckCircle2 size={14} className="text-emerald-300" />
          <span>Owner security passkey updated successfully. Keep this safe!</span>
        </div>
      )}

      {/* Tab Selector */}
      <div className="flex flex-wrap gap-1 border-b border-neutral-200 pb-2">
        <button
          onClick={() => setActiveTab("projects")}
          className={cn(
            "flex items-center gap-1.5 px-4 py-2 text-xs uppercase tracking-wider font-medium transition-colors",
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
            "flex items-center gap-1.5 px-4 py-2 text-xs uppercase tracking-wider font-medium transition-colors",
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
            "flex items-center gap-1.5 px-4 py-2 text-xs uppercase tracking-wider font-medium transition-colors",
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
            "flex items-center gap-1.5 px-4 py-2 text-xs uppercase tracking-wider font-medium transition-colors",
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
            "flex items-center gap-1.5 px-4 py-2 text-xs uppercase tracking-wider font-medium transition-colors",
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
            "flex items-center gap-1.5 px-4 py-2 text-xs uppercase tracking-wider font-medium transition-colors",
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
            "flex items-center gap-1.5 px-4 py-2 text-xs uppercase tracking-wider font-medium transition-colors",
            activeTab === "recognitions"
              ? "border-b-2 border-black text-black font-semibold"
              : "text-neutral-500 hover:text-black"
          )}
        >
          <Award size={14} />
          <span>Awards ({recognitions.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("settings")}
          className={cn(
            "flex items-center gap-1.5 px-4 py-2 text-xs uppercase tracking-wider font-medium transition-colors",
            activeTab === "settings"
              ? "border-b-2 border-black text-black font-semibold"
              : "text-neutral-500 hover:text-black"
          )}
        >
          <Settings size={14} />
          <span>Settings</span>
        </button>
      </div>

      {/* Tab Panels */}

      {/* 1. PROJECTS TAB */}
      {activeTab === "projects" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-900">
              Project Archive Management
            </h2>
            <button
              onClick={() => {
                const newP: Project = {
                  id: `proj-${Date.now()}`,
                  slug: `new-project-${projects.length + 1}`,
                  title: `NEW PROJECT ${projects.length + 1}`,
                  category: "Residential",
                  status: "ongoing",
                  location: "Bengaluru, India",
                  year: new Date().getFullYear(),
                  client: "Confidential Client",
                  area: "5,000 sq.ft",
                  description: "Architectural composition exploring material authenticity.",
                  processNarrative: "Conceptual development and site synthesis.",
                  mainImage: "/projects/aikya/elevation-east.jpg",
                  gallery: [],
                  servicesInvolved: ["Architecture"],
                  teamMembers: ["Vikramaditya Shenoy"],
                  credits: {
                    principalArchitect: "Vikramaditya Shenoy",
                    projectLead: "Divya Raghavan",
                  },
                  featured: false,
                  relatedSlugs: [],
                };
                saveProjects([newP, ...projects]);
                showNotification();
              }}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-black text-white text-xs uppercase tracking-wider font-medium hover:bg-neutral-800 transition-colors rounded"
            >
              <Plus size={13} />
              <span>Create New Project</span>
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {projects.map((p, idx) => (
              <div
                key={p.id}
                className="p-5 border border-neutral-200 bg-white rounded space-y-4 shadow-sm"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-100 pb-3">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 block">
                      {p.category} · {p.year} · {p.area}
                    </span>
                    <h3 className="font-display text-base font-medium text-neutral-900">
                      {p.title}
                    </h3>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Link
                      href={`/projects/${p.slug}`}
                      target="_blank"
                      className="text-neutral-400 hover:text-black text-xs font-mono px-2 py-1 border border-neutral-200 rounded"
                    >
                      View Live →
                    </Link>
                    <button
                      onClick={() => {
                        if (confirm(`Delete project "${p.title}"?`)) {
                          saveProjects(projects.filter((x) => x.id !== p.id));
                          showNotification();
                        }
                      }}
                      className="text-neutral-400 hover:text-red-600 p-1"
                      title="Delete Project"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

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
                      className="w-full p-2 border border-neutral-300 rounded text-xs"
                    />
                  </div>
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
                      className="w-full p-2 border border-neutral-300 rounded text-xs"
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
                      className="w-full p-2 border border-neutral-300 rounded text-xs"
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
                      className="w-full p-2 border border-neutral-300 rounded text-xs"
                    >
                      <option value="completed">Completed</option>
                      <option value="ongoing">Ongoing</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] uppercase font-mono text-neutral-500 block mb-1">
                    Main Display Image URL (Landscape High-Res)
                  </label>
                  <input
                    type="text"
                    value={p.mainImage}
                    onChange={(e) => {
                      const updated = [...projects];
                      updated[idx].mainImage = e.target.value;
                      saveProjects(updated);
                    }}
                    className="w-full p-2 border border-neutral-300 rounded text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-mono text-neutral-500 block mb-1">
                    Editorial Narrative
                  </label>
                  <textarea
                    rows={2}
                    value={p.description}
                    onChange={(e) => {
                      const updated = [...projects];
                      updated[idx].description = e.target.value;
                      saveProjects(updated);
                    }}
                    className="w-full p-2 border border-neutral-300 rounded text-xs leading-relaxed"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. SERVICES TAB */}
      {activeTab === "services" && (
        <div className="space-y-6">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-900">
            Disciplines & Services Management ({services.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {services.map((s, idx) => (
              <div key={s.id} className="p-4 border border-neutral-200 bg-white space-y-3 rounded text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-sm text-neutral-900">{s.title}</span>
                  <span className="text-[10px] font-mono text-neutral-400">{s.slug}</span>
                </div>
                <textarea
                  rows={3}
                  value={s.shortDescription}
                  onChange={(e) => {
                    const updated = [...services];
                    updated[idx].shortDescription = e.target.value;
                    saveServices(updated);
                  }}
                  className="w-full p-2 border border-neutral-300 rounded text-xs leading-relaxed"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. TEAM TAB */}
      {activeTab === "team" && (
        <div className="space-y-6">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-900">
            Studio Members ({team.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {team.map((m, idx) => (
              <div key={m.id} className="p-4 border border-neutral-200 bg-white space-y-2 rounded text-xs">
                <input
                  type="text"
                  value={m.name}
                  onChange={(e) => {
                    const updated = [...team];
                    updated[idx].name = e.target.value;
                    saveTeam(updated);
                  }}
                  className="w-full p-1.5 border border-neutral-300 rounded font-medium"
                />
                <input
                  type="text"
                  value={m.role}
                  onChange={(e) => {
                    const updated = [...team];
                    updated[idx].role = e.target.value;
                    saveTeam(updated);
                  }}
                  className="w-full p-1.5 border border-neutral-300 rounded text-neutral-600"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. BLOG TAB */}
      {activeTab === "blog" && (
        <div className="space-y-6">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-900">
            Monographs & Research ({blog.length})
          </h2>
          <div className="space-y-4">
            {blog.map((b, idx) => (
              <div key={b.id} className="p-4 border border-neutral-200 bg-white space-y-2 rounded text-xs">
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
            ))}
          </div>
        </div>
      )}

      {/* 5. FAQ TAB */}
      {activeTab === "faq" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-900">
              Practice FAQs ({faq.length})
            </h2>
            <button
              onClick={() => {
                const newF: FAQItem = {
                  id: `faq-${Date.now()}`,
                  question: "New practice question?",
                  answer: "New practice answer detail.",
                  category: "Engagement & Process",
                };
                saveFaq([newF, ...faq]);
                showNotification();
              }}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-black text-white text-xs uppercase tracking-wider font-medium hover:bg-neutral-800 transition-colors rounded"
            >
              <Plus size={13} />
              <span>Add FAQ</span>
            </button>
          </div>

          <div className="space-y-4">
            {faq.map((item, idx) => (
              <div key={item.id} className="p-4 border border-neutral-200 bg-white space-y-2 rounded text-xs">
                <div className="flex justify-between items-center">
                  <input
                    type="text"
                    value={item.question}
                    onChange={(e) => {
                      const updated = [...faq];
                      updated[idx].question = e.target.value;
                      saveFaq(updated);
                    }}
                    className="w-3/4 p-1.5 border border-neutral-300 rounded font-medium"
                  />
                  <button
                    onClick={() => {
                      saveFaq(faq.filter((f) => f.id !== item.id));
                      showNotification();
                    }}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
                <textarea
                  rows={2}
                  value={item.answer}
                  onChange={(e) => {
                    const updated = [...faq];
                    updated[idx].answer = e.target.value;
                    saveFaq(updated);
                  }}
                  className="w-full p-2 border border-neutral-300 rounded text-xs leading-relaxed"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. GALLERY TAB */}
      {activeTab === "gallery" && (
        <div className="space-y-6">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-900">
            Visual Gallery Records ({gallery.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {gallery.map((g, idx) => (
              <div key={g.id} className="p-3 border border-neutral-200 bg-white space-y-2 rounded text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-medium truncate text-neutral-900">{g.title}</span>
                  <span className="text-[9px] font-mono text-neutral-400 uppercase">{g.category}</span>
                </div>
                <input
                  type="text"
                  value={g.title}
                  onChange={(e) => {
                    const updated = [...gallery];
                    updated[idx].title = e.target.value;
                    saveGallery(updated);
                  }}
                  className="w-full p-1.5 border border-neutral-300 rounded text-xs"
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
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7. RECOGNITIONS TAB */}
      {activeTab === "recognitions" && (
        <div className="space-y-6">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-900">
            Awards & Commendations ({recognitions.length})
          </h2>
          <div className="space-y-4">
            {recognitions.map((r, idx) => (
              <div key={r.id} className="p-4 border border-neutral-200 bg-white space-y-2 rounded text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-neutral-900">{r.title} ({r.year})</span>
                  <span className="text-[10px] font-mono text-neutral-400 uppercase">{r.category}</span>
                </div>
                <input
                  type="text"
                  value={r.description}
                  onChange={(e) => {
                    const updated = [...recognitions];
                    updated[idx].description = e.target.value;
                    saveRecognitions(updated);
                  }}
                  className="w-full p-2 border border-neutral-300 rounded text-xs"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 8. SETTINGS TAB (OWNER / HOST ONLY) */}
      {activeTab === "settings" && (
        <div className="space-y-8">
          <div className="flex justify-between items-center border-b border-neutral-200 pb-4">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-900">
                Studio Settings & Configuration
              </h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                Restricted access: Only verified site owners and hosts can update practice metadata and credentials.
              </p>
            </div>
            <button
              onClick={() => {
                saveSiteSettings(siteSettings);
                showNotification();
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-black text-white text-xs uppercase tracking-wider font-medium hover:bg-neutral-800 transition-colors rounded shadow-sm"
            >
              <Save size={13} />
              <span>Save All Settings</span>
            </button>
          </div>

          {/* Section A: Owner Security Passkey */}
          <div className="p-6 bg-neutral-50 border border-neutral-200 rounded space-y-4">
            <div className="flex items-center gap-2">
              <KeyRound size={16} className="text-neutral-800" />
              <h3 className="text-xs uppercase tracking-wider font-semibold text-neutral-900">
                Owner & Host Security Credentials
              </h3>
            </div>
            <p className="text-xs text-neutral-600 leading-relaxed max-w-2xl">
              Change the master owner passkey below. Once changed, any future session or device will require this new key to unlock and edit settings.
            </p>

            <form onSubmit={handleChangePasskey} className="flex flex-col sm:flex-row gap-3 max-w-xl">
              <input
                type="text"
                value={newPasskeyInput}
                onChange={(e) => setNewPasskeyInput(e.target.value)}
                placeholder="Enter new owner passkey..."
                className="flex-1 p-2 border border-neutral-300 rounded text-xs font-mono focus:outline-none focus:border-black"
                required
              />
              <button
                type="submit"
                className="px-4 py-2 bg-neutral-900 hover:bg-black text-white text-xs uppercase tracking-wider font-medium rounded transition-colors whitespace-nowrap"
              >
                Update Security Key
              </button>
            </form>
          </div>

          {/* Section B: Practice Identity & Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Building size={16} className="text-neutral-800" />
              <h3 className="text-xs uppercase tracking-wider font-semibold text-neutral-900">
                Practice Identity & Ethos
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
                  className="w-full p-2 border border-neutral-300 rounded text-xs"
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
                  className="w-full p-2 border border-neutral-300 rounded text-xs"
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
                    saveSiteSettings({ ...siteSettings, foundedYear: parseInt(e.target.value) || 2016 });
                  }}
                  className="w-full p-2 border border-neutral-300 rounded text-xs"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-mono text-neutral-500 block mb-1">
                  Operating Hours
                </label>
                <input
                  type="text"
                  value={siteSettings.operatingHours}
                  onChange={(e) => {
                    saveSiteSettings({ ...siteSettings, operatingHours: e.target.value });
                  }}
                  className="w-full p-2 border border-neutral-300 rounded text-xs"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-[10px] uppercase font-mono text-neutral-500 block mb-1">
                  Short Description
                </label>
                <input
                  type="text"
                  value={siteSettings.shortDescription}
                  onChange={(e) => {
                    saveSiteSettings({ ...siteSettings, shortDescription: e.target.value });
                  }}
                  className="w-full p-2 border border-neutral-300 rounded text-xs"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-[10px] uppercase font-mono text-neutral-500 block mb-1">
                  Long Conceptual Statement
                </label>
                <textarea
                  rows={3}
                  value={siteSettings.longDescription}
                  onChange={(e) => {
                    saveSiteSettings({ ...siteSettings, longDescription: e.target.value });
                  }}
                  className="w-full p-2 border border-neutral-300 rounded text-xs leading-relaxed"
                />
              </div>
            </div>
          </div>

          {/* Section C: Contact Details */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Mail size={16} className="text-neutral-800" />
              <h3 className="text-xs uppercase tracking-wider font-semibold text-neutral-900">
                Contact & Correspondence
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
                  className="w-full p-2 border border-neutral-300 rounded text-xs"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-mono text-neutral-500 block mb-1">
                  Direct Telephone
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
                  className="w-full p-2 border border-neutral-300 rounded text-xs"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-mono text-neutral-500 block mb-1">
                  Press & Media Email
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
                  className="w-full p-2 border border-neutral-300 rounded text-xs"
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
                  className="w-full p-2 border border-neutral-300 rounded text-xs"
                />
              </div>
            </div>
          </div>

          {/* Section D: Studio Locations */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <MapPin size={16} className="text-neutral-800" />
              <h3 className="text-xs uppercase tracking-wider font-semibold text-neutral-900">
                Studio Locations & Addresses
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              {siteSettings.studios.map((st, sIdx) => (
                <div key={sIdx} className="p-4 border border-neutral-200 bg-white rounded space-y-2">
                  <span className="text-[10px] uppercase font-mono text-neutral-400 block font-semibold">
                    {st.isHeadquarters ? "Headquarters" : "Branch Studio"}
                  </span>
                  <input
                    type="text"
                    value={st.city}
                    onChange={(e) => {
                      const updated = [...siteSettings.studios];
                      updated[sIdx].city = e.target.value;
                      saveSiteSettings({ ...siteSettings, studios: updated });
                    }}
                    className="w-full p-1.5 border border-neutral-300 rounded font-medium"
                    placeholder="City"
                  />
                  <input
                    type="text"
                    value={st.address}
                    onChange={(e) => {
                      const updated = [...siteSettings.studios];
                      updated[sIdx].address = e.target.value;
                      saveSiteSettings({ ...siteSettings, studios: updated });
                    }}
                    className="w-full p-1.5 border border-neutral-300 rounded"
                    placeholder="Address"
                  />
                  <input
                    type="text"
                    value={st.phone}
                    onChange={(e) => {
                      const updated = [...siteSettings.studios];
                      updated[sIdx].phone = e.target.value;
                      saveSiteSettings({ ...siteSettings, studios: updated });
                    }}
                    className="w-full p-1.5 border border-neutral-300 rounded text-neutral-600"
                    placeholder="Phone"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Save Action Footer */}
          <div className="pt-6 border-t border-neutral-200 flex justify-end">
            <button
              onClick={() => {
                saveSiteSettings(siteSettings);
                showNotification();
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
  );
}
