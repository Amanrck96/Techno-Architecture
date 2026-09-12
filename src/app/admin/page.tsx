"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCMSStore } from "@/lib/cmsStore";
import { Project } from "@/data/projects";
import { Service } from "@/data/services";
import { TeamMember } from "@/data/team";
import { BlogPost } from "@/data/blog";
import { FAQItem } from "@/data/faq";
import { GalleryItem } from "@/data/gallery";
import { Recognition } from "@/data/recognitions";
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
  Upload,
  CheckCircle2,
  Trash2,
  ExternalLink,
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

  const [activeTab, setActiveTab] = useState<AdminTab>("projects");
  const [saveToast, setSaveToast] = useState(false);

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

  return (
    <div className="w-full py-8 md:py-12 px-4 md:px-10 max-w-7xl mx-auto space-y-8">
      {/* CMS Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-neutral-200 gap-4">
        <div>
          <div className="flex items-center space-x-2 text-[10px] font-mono uppercase tracking-widest text-neutral-400">
            <span>TECHNO CMS STUDIO</span>
            <span>·</span>
            <span className="text-emerald-600 font-semibold">LIVE CONNECTED</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-light text-neutral-900 mt-1">
            Headless Content Management Layer
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Non-developer editorial interface: modify live projects, disciplines, monographs, and photography without editing source code.
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
          <span>Entity updated and persisted. Website views refreshed in real time.</span>
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
                  client: "Private Client",
                  area: "5,000 sq.ft",
                  description: "A newly commissioned contemporary architectural study.",
                  processNarrative: "Initial schematic site exploration.",
                  mainImage: "/projects/aikya/elevation-east.jpg",
                  gallery: [],
                  servicesInvolved: ["Architectural Design"],
                  teamMembers: ["Ar. Rajeshwari Menon"],
                  credits: {
                    principalArchitect: "Techno Design Studio",
                    projectLead: "Ar. Rajeshwari Menon",
                    structuralEngineer: "Matrix Structural Consultants",
                  },
                  featured: true,
                  relatedSlugs: [],
                };
                saveProjects([newP, ...projects]);
                showNotification();
              }}
              type="button"
              className="flex items-center gap-1 bg-black text-white px-3 py-1.5 text-xs uppercase tracking-wider hover:bg-neutral-800 transition-colors"
            >
              <Plus size={13} />
              <span>Add New Project</span>
            </button>
          </div>

          <div className="space-y-4">
            {projects.map((p, idx) => (
              <div
                key={p.id}
                className="p-5 border border-neutral-200 bg-white space-y-4 rounded"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-100 pb-3">
                  <div className="flex items-center space-x-3">
                    <span className="font-display text-sm font-medium text-black">
                      {p.title}
                    </span>
                    <span className="text-[10px] font-mono uppercase bg-neutral-100 px-2 py-0.5 text-neutral-600">
                      {p.category}
                    </span>
                    <span
                      className={`text-[10px] font-mono uppercase px-2 py-0.5 ${
                        p.status === "completed"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {p.status}
                    </span>
                  </div>

                  <div className="flex items-center space-x-3 text-xs">
                    <Link
                      href={`/projects/${p.slug}`}
                      className="text-neutral-500 hover:text-black flex items-center gap-1"
                      target="_blank"
                    >
                      <span>Preview</span>
                      <ExternalLink size={12} />
                    </Link>
                    <button
                      onClick={() => {
                        if (confirm(`Delete project "${p.title}"?`)) {
                          saveProjects(projects.filter((x) => x.id !== p.id));
                          showNotification();
                        }
                      }}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* Edit Form */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                  <div>
                    <label className="block text-[10px] uppercase font-mono text-neutral-500 mb-1">
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
                    <label className="block text-[10px] uppercase font-mono text-neutral-500 mb-1">
                      Status
                    </label>
                    <select
                      value={p.status}
                      onChange={(e) => {
                        const updated = [...projects];
                        updated[idx].status = e.target.value as "completed" | "ongoing";
                        saveProjects(updated);
                        showNotification();
                      }}
                      className="w-full p-2 border border-neutral-300 bg-white rounded text-xs"
                    >
                      <option value="completed">Completed</option>
                      <option value="ongoing">Ongoing</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-mono text-neutral-500 mb-1">
                      Category
                    </label>
                    <select
                      value={p.category}
                      onChange={(e) => {
                        const updated = [...projects];
                        updated[idx].category = e.target.value as any;
                        saveProjects(updated);
                        showNotification();
                      }}
                      className="w-full p-2 border border-neutral-300 bg-white rounded text-xs"
                    >
                      <option value="Residential">Residential</option>
                      <option value="Commercial">Commercial</option>
                      <option value="Interior">Interior</option>
                      <option value="Cultural">Cultural</option>
                      <option value="Hospitality">Hospitality</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-mono text-neutral-500 mb-1">
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
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-mono text-neutral-500 mb-1">
                    Conceptual Description
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
            Services & Practice Disciplines ({services.length})
          </h2>
          <div className="space-y-4">
            {services.map((s, idx) => (
              <div key={s.id} className="p-5 border border-neutral-200 bg-white space-y-3 rounded">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-sm text-neutral-900">{s.title}</h3>
                  <Link
                    href={`/services/${s.slug}`}
                    target="_blank"
                    className="text-xs text-neutral-500 hover:text-black flex items-center gap-1"
                  >
                    <span>View Page</span>
                    <ExternalLink size={11} />
                  </Link>
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-mono text-neutral-500 mb-1">
                    Short Summary
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
                  <label className="block text-[10px] uppercase font-mono text-neutral-500 mb-1">
                    Detailed Methodology
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
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. TEAM TAB */}
      {activeTab === "team" && (
        <div className="space-y-6">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-900">
            Team & Leadership Directory ({team.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {team.map((m, idx) => (
              <div key={m.id} className="p-4 border border-neutral-200 bg-white space-y-2 rounded text-xs">
                <div className="flex justify-between">
                  <span className="font-semibold text-black">{m.name}</span>
                  <span className="text-[10px] font-mono text-neutral-400">{m.discipline}</span>
                </div>
                <input
                  type="text"
                  value={m.role}
                  onChange={(e) => {
                    const updated = [...team];
                    updated[idx].role = e.target.value;
                    saveTeam(updated);
                  }}
                  className="w-full p-1.5 border border-neutral-300 rounded text-xs"
                />
                <textarea
                  rows={2}
                  value={m.bio}
                  onChange={(e) => {
                    const updated = [...team];
                    updated[idx].bio = e.target.value;
                    saveTeam(updated);
                  }}
                  className="w-full p-1.5 border border-neutral-300 rounded text-xs leading-relaxed"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. BLOG TAB */}
      {activeTab === "blog" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-900">
              Architectural Monographs & Research ({blog.length})
            </h2>
            <button
              onClick={() => {
                const newPost: BlogPost = {
                  id: `blog-${Date.now()}`,
                  slug: `new-monograph-${blog.length + 1}`,
                  title: `New Architectural Monograph ${blog.length + 1}`,
                  excerpt: "An exploratory essay on spatial sequencing and materiality.",
                  category: "Materiality",
                  author: {
                    name: "Ar. Rajeshwari Menon",
                    role: "Principal Architect",
                    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
                  },
                  publishedAt: new Date().toISOString().split("T")[0],
                  readingTime: "6 min read",
                  heroImage: "/projects/aikya/elevation-evening.jpg",
                  featured: false,
                  content: {
                    introduction: "Introduction to this architectural thesis.",
                    sections: [],
                    conclusion: "Closing remarks on the tectonic implications.",
                  },
                  tags: ["Architecture", "Research"],
                  relatedSlugs: [],
                };
                saveBlog([newPost, ...blog]);
                showNotification();
              }}
              type="button"
              className="flex items-center gap-1 bg-black text-white px-3 py-1.5 text-xs uppercase tracking-wider hover:bg-neutral-800 transition-colors"
            >
              <Plus size={13} />
              <span>Draft New Monograph</span>
            </button>
          </div>

          <div className="space-y-4">
            {blog.map((post, idx) => (
              <div key={post.id} className="p-5 border border-neutral-200 bg-white space-y-3 rounded text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-sm text-neutral-900">{post.title}</span>
                  <div className="flex items-center gap-3">
                    <Link
                      href={`/blog/${post.slug}`}
                      target="_blank"
                      className="text-neutral-500 hover:text-black flex items-center gap-1"
                    >
                      <span>Read</span>
                      <ExternalLink size={11} />
                    </Link>
                    <button
                      onClick={() => {
                        if (confirm(`Delete post "${post.title}"?`)) {
                          saveBlog(blog.filter((b) => b.id !== post.id));
                          showNotification();
                        }
                      }}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    value={post.title}
                    onChange={(e) => {
                      const updated = [...blog];
                      updated[idx].title = e.target.value;
                      saveBlog(updated);
                    }}
                    className="p-2 border border-neutral-300 rounded text-xs font-medium"
                  />
                  <input
                    type="text"
                    value={post.excerpt}
                    onChange={(e) => {
                      const updated = [...blog];
                      updated[idx].excerpt = e.target.value;
                      saveBlog(updated);
                    }}
                    className="p-2 border border-neutral-300 rounded text-xs"
                  />
                </div>
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
              Frequently Addressed Questions ({faq.length})
            </h2>
            <button
              onClick={() => {
                const newF: FAQItem = {
                  id: `faq-${Date.now()}`,
                  question: "New Architectural Question?",
                  answer: "Comprehensive answer explaining the studio's methodology.",
                  category: "Engagement & Process",
                };
                saveFaq([newF, ...faq]);
                showNotification();
              }}
              type="button"
              className="flex items-center gap-1 bg-black text-white px-3 py-1.5 text-xs uppercase tracking-wider hover:bg-neutral-800 transition-colors"
            >
              <Plus size={13} />
              <span>Add Question</span>
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
    </div>
  );
}
