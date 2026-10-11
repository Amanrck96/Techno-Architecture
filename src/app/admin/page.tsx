"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  useCMSStore,
  getStorageCredentials,
  saveStorageCredentials,
  syncToServer,
} from "@/lib/cmsStore";
import {
  loginWithGoogle,
  loginWithEmail,
  logout as firebaseLogout,
  uploadToFirebaseStorage,
} from "@/lib/firebaseClient";
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
  Shuffle,
  ArrowUp,
  ArrowDown,
  Save,
  RotateCcw,
  Download,
  Upload,
  Cloud,
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
  GitBranch,
  Database,
  HardDrive,
  Key,
  Check,
  Camera,
  Inbox,
  RefreshCw,
  Clock,
  CheckCheck,
  Archive,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ImageMouseAdjuster } from "@/components/admin/ImageMouseAdjuster";

type AdminTab =
  | "projects"
  | "services"
  | "team"
  | "blog"
  | "faq"
  | "gallery"
  | "recognitions"
  | "testimonials"
  | "settings"
  | "leads";

interface EnquiryLead {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  company: string;
  service: string;
  budget: string;
  message: string;
  status: "new" | "reviewed" | "archived";
  createdAt: string;
}

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
    serverStorageInfo,
    saveProjects,
    saveServices,
    saveTeam,
    saveBlog,
    saveFaq,
    saveGallery,
    saveRecognitions,
    saveSiteSettings,
    saveTestimonials,
    saveAllToCloud,
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
  const [isSyncingCloud, setIsSyncingCloud] = useState<boolean>(false);

  // Storage & Persistence Configuration
  const [githubTokenInput, setGithubTokenInput] = useState<string>("");
  const [githubRepoInput, setGithubRepoInput] = useState<string>("Kima1011/Techno-Architecture");
  const [upstashUrlInput, setUpstashUrlInput] = useState<string>("");
  const [upstashTokenInput, setUpstashTokenInput] = useState<string>("");
  const [isCommittingGit, setIsCommittingGit] = useState<boolean>(false);
  const [storageFeedback, setStorageFeedback] = useState<{ type: "success" | "error" | "info"; msg: string } | null>(null);

  // Initialize storage credentials from local storage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const creds = getStorageCredentials();
      if (creds.githubToken) setGithubTokenInput(creds.githubToken);
      if (creds.githubRepo) setGithubRepoInput(creds.githubRepo);
      if (creds.upstashUrl) setUpstashUrlInput(creds.upstashUrl);
      if (creds.upstashToken) setUpstashTokenInput(creds.upstashToken);
    }
  }, []);

  // Tab & Notification states
  const [activeTab, setActiveTab] = useState<AdminTab>("projects");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [expandedProjectId, setExpandedProjectId] = useState<string | null>(null);
  const [expandedBlogId, setExpandedBlogId] = useState<string | null>(null);

  // Leads state
  const [leads, setLeads] = useState<EnquiryLead[]>([]);
  const [leadsLoading, setLeadsLoading] = useState(false);
  const [leadsError, setLeadsError] = useState<string | null>(null);
  const [expandedLeadId, setExpandedLeadId] = useState<string | null>(null);
  const [leadsFilter, setLeadsFilter] = useState<"all" | "new" | "reviewed" | "archived">("all");

  // File import ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 1. Verify Session on Mount via Server
  useEffect(() => {
    async function checkAuthSession() {
      try {
        const storedToken =
          typeof window !== "undefined"
            ? localStorage.getItem("techno_admin_token") ||
              sessionStorage.getItem("techno_admin_token")
            : null;

        const headers: Record<string, string> = {};
        if (storedToken) {
          headers["Authorization"] = `Bearer ${storedToken}`;
          headers["x-admin-token"] = storedToken;
        }

        const res = await fetch("/api/admin/verify", {
          credentials: "include",
          headers,
        });
        const data = await res.json();
        if (res.ok && data.authenticated) {
          setIsAuthenticated(true);
          setCurrentAdminUser(data.username || "admin");
          if (data.token) {
            try {
              localStorage.setItem("techno_admin_token", data.token);
              sessionStorage.setItem("techno_admin_token", data.token);
            } catch (_) {}
          }
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

  // Fetch leads from Firestore whenever the leads tab is activated
  const fetchLeads = async () => {
    setLeadsLoading(true);
    setLeadsError(null);
    try {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("techno_admin_token") ||
            sessionStorage.getItem("techno_admin_token")
          : null;
      const headers: Record<string, string> = {};
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
        headers["x-admin-token"] = token;
      }
      const res = await fetch("/api/admin/leads", { headers, cache: "no-store" });
      let data: any = null;
      try {
        const text = await res.text();
        data = text ? JSON.parse(text) : {};
      } catch (_) {
        data = { error: `Server response error (HTTP ${res.status}).` };
      }
      if (!res.ok) throw new Error(data?.error || `Failed to fetch leads (${res.status})`);
      setLeads(data?.leads || []);
    } catch (err: any) {
      setLeadsError(err.message || "Failed to load enquiry leads.");
    } finally {
      setLeadsLoading(false);
    }
  };

  const updateLeadStatus = async (id: string, status: string) => {
    try {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("techno_admin_token") ||
            sessionStorage.getItem("techno_admin_token")
          : null;
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
        headers["x-admin-token"] = token;
      }
      const res = await fetch("/api/admin/leads", {
        method: "PATCH",
        headers,
        body: JSON.stringify({ id, status }),
      });
      let data: any = null;
      try {
        const text = await res.text();
        data = text ? JSON.parse(text) : {};
      } catch (_) {
        data = { error: `Server error (HTTP ${res.status}).` };
      }
      if (!res.ok) throw new Error(data?.error || "Failed to update status on server.");
      setLeads((prev) =>
        prev.map((l) => (l.id === id ? { ...l, status: status as any } : l))
      );
      showToast(`Lead marked as ${status}.`);
    } catch (err: any) {
      showToast("Failed to update lead status: " + (err?.message || "Unknown error"));
    }
  };

  // 2. Handle Login Submission (Password & Firebase Email)
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setIsSubmittingAuth(true);

    try {
      // First attempt: Server API login
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          username: usernameInput,
          password: passwordInput,
        }),
      });

      let data: any = null;
      try {
        const text = await res.text();
        data = text ? JSON.parse(text) : {};
      } catch (parseErr) {
        console.warn("Server response was not JSON:", parseErr);
        data = { error: `Server error (${res.status}). Please try again shortly.` };
      }

      if (res.ok && data?.success) {
        setIsAuthenticated(true);
        setCurrentAdminUser(data.username || usernameInput);
        if (data.token) {
          try {
            localStorage.setItem("techno_admin_token", data.token);
            sessionStorage.setItem("techno_admin_token", data.token);
          } catch (_) {}
        }
        setPasswordInput("");
        setAuthError("");
        showToast("Access granted. Welcome to Techno Architecture Admin Studio.");
        return;
      }

      // Second attempt: If username looks like an email, attempt Firebase Email/Password
      if (usernameInput.includes("@")) {
        try {
          const userCred = await loginWithEmail(usernameInput.trim(), passwordInput.trim());
          const user = userCred.user;
          const idToken = await user.getIdToken();

          const syncRes = await fetch("/api/admin/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
              firebaseIdToken: idToken,
              firebaseEmail: user.email,
            }),
          });
          let syncData: any = null;
          try {
            const syncText = await syncRes.text();
            syncData = syncText ? JSON.parse(syncText) : {};
          } catch (_) {
            syncData = {};
          }

          if (syncRes.ok || user) {
            setIsAuthenticated(true);
            setCurrentAdminUser(user.email || usernameInput);
            if (syncData?.token) {
              try {
                localStorage.setItem("techno_admin_token", syncData.token);
                sessionStorage.setItem("techno_admin_token", syncData.token);
              } catch (_) {}
            }
            setPasswordInput("");
            setAuthError("");
            showToast(`Welcome, ${user.email}! Authenticated via Firebase.`);
            return;
          }
        } catch (fbErr: any) {
          console.warn("Firebase Email Login attempt:", fbErr);
        }
      }

      throw new Error(data?.error || "Invalid username or password. Access denied.");
    } catch (err: any) {
      setAuthError(err.message || "Invalid credentials. Please verify and try again.");
    } finally {
      setIsSubmittingAuth(false);
    }
  };

  // 2b. Handle Google Sign-In Submission
  const handleGoogleLogin = async () => {
    setAuthError("");
    setIsSubmittingAuth(true);
    try {
      const userCred = await loginWithGoogle();
      const user = userCred.user;
      const idToken = await user.getIdToken();

      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          firebaseIdToken: idToken,
          firebaseEmail: user.email,
        }),
      });

      let data: any = null;
      try {
        const text = await res.text();
        data = text ? JSON.parse(text) : {};
      } catch (_) {
        data = {};
      }

      setIsAuthenticated(true);
      setCurrentAdminUser(user.email || user.displayName || "Google Admin");
      if (data?.token) {
        try {
          localStorage.setItem("techno_admin_token", data.token);
          sessionStorage.setItem("techno_admin_token", data.token);
        } catch (_) {}
      }
      setPasswordInput("");
      setAuthError("");
      showToast(`Welcome, ${user.displayName || user.email}! Signed in via Google.`);
    } catch (err: any) {
      if (err.code === "auth/popup-closed-by-user") {
        setAuthError("Google Sign-In popup was closed before completion.");
      } else if (err.code === "auth/unauthorized-domain") {
        setAuthError("Unauthorized Domain: Please add 'localhost' to Firebase Console > Authentication > Settings > Authorized Domains.");
      } else {
        setAuthError(err.message || "Google Sign-In failed.");
      }
    } finally {
      setIsSubmittingAuth(false);
    }
  };

  // 3. Handle Logout
  const handleLogout = async () => {
    try {
      await firebaseLogout();
    } catch (_) {}
    try {
      await fetch("/api/admin/logout", { method: "POST", credentials: "include" });
    } catch (_) {}
    try {
      localStorage.removeItem("techno_admin_token");
      sessionStorage.removeItem("techno_admin_token");
    } catch (_) {}
    setIsAuthenticated(false);
    setCurrentAdminUser("");
    setUsernameInput("");
    setPasswordInput("");
  };

  const handleForceSaveCloud = async () => {
    setIsSyncingCloud(true);
    try {
      const res = await saveAllToCloud();
      if (res && res.success) {
        showToast(res.message || "All changes saved & synced permanently.");
      } else {
        showToast("Saved locally. Notice: " + (res?.error?.message || "Server returned warning."));
      }
    } catch (e: any) {
      showToast("Saved locally. Network error reaching server.");
    } finally {
      setIsSyncingCloud(false);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSaveStorageCredentials = () => {
    saveStorageCredentials({
      githubToken: githubTokenInput.trim(),
      githubRepo: githubRepoInput.trim() || "Kima1011/Techno-Architecture",
      upstashUrl: upstashUrlInput.trim(),
      upstashToken: upstashTokenInput.trim(),
    });
    setStorageFeedback({
      type: "success",
      msg: "Credentials saved securely in your browser! Future CMS saves will use these credentials automatically.",
    });
    showToast("Storage credentials saved successfully.");
  };

  const handleCommitToGitHub = async () => {
    if (!githubTokenInput.trim()) {
      setStorageFeedback({
        type: "error",
        msg: "Please enter your GitHub Personal Access Token first.",
      });
      return;
    }
    setIsCommittingGit(true);
    setStorageFeedback(null);
    try {
      // Save credentials first
      saveStorageCredentials({
        githubToken: githubTokenInput.trim(),
        githubRepo: githubRepoInput.trim() || "Kima1011/Techno-Architecture",
      });

      const allData = {
        projects,
        services,
        team,
        blog,
        faq,
        gallery,
        recognitions,
        siteSettings,
        testimonials,
      };

      const res = await syncToServer({
        allData,
        githubToken: githubTokenInput.trim(),
        githubRepo: githubRepoInput.trim() || "Kima1011/Techno-Architecture",
      });

      if (res.success && res.storageStatus?.github) {
        setStorageFeedback({
          type: "success",
          msg: "✅ Successfully committed directly to GitHub repository (main branch)! Vercel will automatically rebuild and deploy the new content.",
        });
        showToast("Committed to GitHub! Vercel redeployment triggered.");
      } else {
        const errDetail = res.storageStatus?.errorDetails?.join("; ") || res.error?.message || "GitHub commit failed.";
        setStorageFeedback({
          type: "error",
          msg: `❌ GitHub commit failed: ${errDetail}`,
        });
      }
    } catch (e: any) {
      setStorageFeedback({
        type: "error",
        msg: `❌ Network error: ${e?.message}`,
      });
    } finally {
      setIsCommittingGit(false);
    }
  };

  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [uploadingTargetId, setUploadingTargetId] = useState<string | null>(null);

  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  const handleUploadPhoto = async (
    file: File,
    onSuccess: (url: string) => void,
    folder: string = "uploads"
  ) => {
    setIsUploadingPhoto(true);
    setUploadProgress(0);
    const isVideo = file.type.startsWith("video/");
    const mediaLabel = isVideo ? "video" : "media";
    showToast(`Uploading ${mediaLabel} to Firebase Storage...`);

    // Priority 1: Direct Client-Side Firebase Storage Upload
    try {
      const fbResult = await uploadToFirebaseStorage(file, folder, undefined, (pct) => {
        setUploadProgress(pct);
        if (pct % 25 === 0 || pct === 100) {
          showToast(`Uploading ${mediaLabel} to Firebase: ${pct}%`);
        }
      });

      if (fbResult && fbResult.url) {
        onSuccess(fbResult.url);
        showToast(`✅ ${isVideo ? "Video" : "Photo"} stored permanently in Firebase Storage!`);
        setIsUploadingPhoto(false);
        setUploadProgress(null);
        setUploadingTargetId(null);
        return;
      }
    } catch (fbErr: any) {
      console.warn("Direct Firebase Storage upload encountered error, trying API fallback:", fbErr);
    }

    // Priority 2: Upload via Next.js server /api/upload endpoint (which also uploads to Firebase bucket)
    try {
      const fd = new FormData();
      fd.append("file", file);
      if (folder) fd.append("folder", folder);

      const token = typeof window !== "undefined" ? localStorage.getItem("techno_admin_token") : null;
      const headers: Record<string, string> = {};
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const res = await fetch("/api/upload", {
        method: "POST",
        headers,
        body: fd,
      });
      let data: any = null;
      try {
        const text = await res.text();
        data = text ? JSON.parse(text) : {};
      } catch (_) {
        data = { error: `Server upload response error (HTTP ${res.status}).` };
      }
      if (!res.ok) {
        throw new Error(data?.error || `Upload failed (HTTP ${res.status}).`);
      }
      if (!data?.url) {
        throw new Error("Server did not return a valid media URL.");
      }
      onSuccess(data.url);
      showToast(
        data.storage === "firebase"
          ? `✅ ${isVideo ? "Video" : "Photo"} stored in Firebase Storage successfully!`
          : `✅ ${isVideo ? "Video" : "Photo"} uploaded successfully!`
      );
    } catch (err: any) {
      alert(`Media upload failed: ${err.message}`);
    } finally {
      setIsUploadingPhoto(false);
      setUploadProgress(null);
      setUploadingTargetId(null);
    }
  };

  // 4. Export Clean cms-content.json for Git Repo
  const exportCmsJson = () => {
    const cleanData = {
      projects,
      services,
      team,
      blog,
      faq,
      gallery,
      recognitions,
      siteSettings,
      testimonials,
      updatedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(cleanData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "cms-content.json";
    a.click();
    showToast("Downloaded clean cms-content.json for Git repository.");
  };

  // 5. Export Full Timestamped Backup Archive
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

              {/* Persistence Status Badge */}
              {serverStorageInfo?.localDiskWritable ? (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[11px] font-mono" title="Local filesystem detected. Edits write directly to src/data/cms-content.json on disk.">
                  <ShieldCheck size={12} className="text-emerald-400" />
                  <span>Storage: <strong>Local Disk (Permanent)</strong></span>
                </div>
              ) : serverStorageInfo?.hasGitHubToken || githubTokenInput ? (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[11px] font-mono" title="GitHub Auto-Commit enabled. Edits commit directly to repository.">
                  <GitBranch size={12} className="text-emerald-400" />
                  <span>Storage: <strong>GitHub Auto-Commit</strong></span>
                </div>
              ) : serverStorageInfo?.hasUpstashKV || upstashUrlInput ? (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[11px] font-mono" title="Upstash Redis cloud KV active.">
                  <Database size={12} className="text-emerald-400" />
                  <span>Storage: <strong>Upstash Cloud KV</strong></span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setActiveTab("settings")}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-300 text-[11px] font-mono hover:bg-amber-500/25 transition-colors"
                  title="Serverless filesystem is read-only. Click to configure GitHub or Upstash in Settings for 100% permanent cloud persistence."
                >
                  <AlertCircle size={12} className="text-amber-400" />
                  <span>Storage: <strong>Temporary Memory (/tmp)</strong> ⚠️</span>
                </button>
              )}

              {/* Firebase Cloud Storage Media Badge */}
              <div
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] font-mono"
                title="Firebase Cloud Storage: technoarchitecture-7d718.firebasestorage.app. All project, team, and monograph photos upload directly to Google Firebase."
              >
                <Cloud size={12} className="text-amber-400" />
                <span>Media: <strong className="text-amber-200">Firebase Storage (Active)</strong></span>
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
                onClick={handleForceSaveCloud}
                disabled={isSyncingCloud}
                type="button"
                className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800 text-white transition-colors rounded text-xs font-medium uppercase tracking-wider shadow-sm"
                title="Force push all edits &amp; deletions directly to cloud store"
              >
                {isSyncingCloud ? (
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Save size={13} />
                )}
                <span>{isSyncingCloud ? "Saving..." : "Save All to Cloud"}</span>
              </button>

              <button
                onClick={exportCmsJson}
                type="button"
                className="flex items-center gap-1.5 px-3.5 py-2 bg-white text-black hover:bg-neutral-200 transition-colors rounded text-xs font-medium uppercase tracking-wider shadow-sm"
                title="Download clean production cms-content.json to replace in repository"
              >
                <Download size={13} />
                <span>Download cms-content.json</span>
              </button>

              <button
                onClick={exportData}
                type="button"
                className="flex items-center gap-1.5 px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/15 transition-colors rounded text-xs font-medium uppercase tracking-wider"
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

        <button
          onClick={() => {
            setActiveTab("leads");
            fetchLeads();
          }}
          className={cn(
            "flex items-center gap-1.5 px-3.5 py-2 text-xs uppercase tracking-wider font-medium transition-colors",
            activeTab === "leads"
              ? "border-b-2 border-emerald-600 text-emerald-700 font-semibold"
              : "text-neutral-500 hover:text-black"
          )}
        >
          <Inbox size={14} />
          <span>Leads {leads.length > 0 ? `(${leads.filter(l => l.status === "new").length} new)` : ""}</span>
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
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  if (confirm("Shuffle projects order across the entire portfolio? This will randomize the display sequence on the Home and Projects pages.")) {
                    const shuffled = [...projects];
                    for (let i = shuffled.length - 1; i > 0; i--) {
                      const j = Math.floor(Math.random() * (i + 1));
                      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
                    }
                    saveProjects(shuffled);
                    showToast("Projects portfolio order shuffled and saved.");
                  }
                }}
                className="inline-flex items-center gap-2 px-3.5 py-2 bg-neutral-900 text-white hover:bg-neutral-800 text-xs uppercase tracking-wider font-medium transition-colors rounded shadow-xs cursor-pointer"
                title="Randomly shuffle project display order"
              >
                <Shuffle size={14} className="text-amber-400" />
                <span>Shuffle Order</span>
              </button>
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
                      projectArchitect: "",
                      landscapeArchitect: "",
                      photography: "Shamanth Patil Photography",
                      projectLead: "",
                      team: "Techno Architecture Studio Team",
                    },
                    featured: false,
                    relatedSlugs: [],
                  };
                  saveProjects([newP, ...projects]);
                  setExpandedProjectId(newP.id);
                  showToast("New project created. Edit details below.");
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-black text-white text-xs uppercase tracking-wider font-medium hover:bg-neutral-800 transition-colors rounded shadow-sm self-start cursor-pointer"
              >
                <Plus size={14} />
                <span>Add New Project</span>
              </button>
            </div>
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
                      {/* Project Rearrangement Order Controls */}
                      <div className="flex items-center border border-neutral-300 rounded overflow-hidden bg-white shadow-2xs" title="Rearrange project position in portfolio">
                        <span className="text-[9px] font-mono uppercase px-1.5 text-neutral-400 font-semibold bg-neutral-50 border-r border-neutral-200 select-none">
                          ORDER
                        </span>
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => {
                            if (idx === 0) return;
                            const updated = [...projects];
                            const temp = updated[idx];
                            updated[idx] = updated[idx - 1];
                            updated[idx - 1] = temp;
                            saveProjects(updated);
                            showToast(`Moved "${p.title}" up to position #${idx}.`);
                          }}
                          className="p-1.5 hover:bg-neutral-100 text-neutral-700 disabled:opacity-25 disabled:hover:bg-transparent transition-colors cursor-pointer disabled:cursor-not-allowed"
                          title="Move project UP"
                        >
                          <ArrowUp size={13} />
                        </button>
                        <span className="text-[11px] font-mono px-2 text-neutral-900 font-bold select-none border-x border-neutral-200 bg-neutral-50/50">
                          #{idx + 1}
                        </span>
                        <button
                          type="button"
                          disabled={idx === projects.length - 1}
                          onClick={() => {
                            if (idx === projects.length - 1) return;
                            const updated = [...projects];
                            const temp = updated[idx];
                            updated[idx] = updated[idx + 1];
                            updated[idx + 1] = temp;
                            saveProjects(updated);
                            showToast(`Moved "${p.title}" down to position #${idx + 2}.`);
                          }}
                          className="p-1.5 hover:bg-neutral-100 text-neutral-700 disabled:opacity-25 disabled:hover:bg-transparent transition-colors cursor-pointer disabled:cursor-not-allowed"
                          title="Move project DOWN"
                        >
                          <ArrowDown size={13} />
                        </button>
                      </div>

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
                        value={
                          ["Residential", "Commercial", "Hospitality", "Interior"].includes(p.category)
                            ? p.category
                            : "Residential"
                        }
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
                    <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
                      <input
                        type="text"
                        value={p.mainImage}
                        onChange={(e) => {
                          const updated = [...projects];
                          updated[idx].mainImage = e.target.value;
                          saveProjects(updated);
                        }}
                        placeholder="Image URL or upload file below"
                        className="flex-1 w-full p-2 border border-neutral-300 rounded text-xs font-mono focus:border-black focus:outline-none"
                      />
                      <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-2 bg-black text-white rounded text-xs font-medium hover:bg-neutral-800 transition-colors shrink-0">
                        <Upload size={13} />
                        <span>Upload Photo</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              handleUploadPhoto(file, (url) => {
                                const updated = [...projects];
                                updated[idx].mainImage = url;
                                saveProjects(updated);
                              });
                            }
                          }}
                        />
                      </label>
                    </div>
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

                  {/* Prominent Project Client Testimonial Card */}
                  <div className="p-4 border border-neutral-200 bg-neutral-50/80 rounded space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <MessageSquareQuote size={15} className="text-neutral-600" />
                        <span className="text-[11px] uppercase font-mono font-semibold text-neutral-800 tracking-wider">
                          Project Client Testimonial & Review
                        </span>
                        {p.testimonial ? (
                          <span className="text-[8px] font-mono uppercase px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium">
                            Active
                          </span>
                        ) : (
                          <span className="text-[8px] font-mono uppercase px-1.5 py-0.5 rounded bg-neutral-200 text-neutral-600 font-medium">
                            None
                          </span>
                        )}
                      </div>
                      {p.testimonial ? (
                        <button
                          type="button"
                          onClick={() => {
                            const updated = [...projects];
                            delete updated[idx].testimonial;
                            saveProjects(updated);
                            showToast(`Removed testimonial from "${p.title}".`);
                          }}
                          className="text-[10px] uppercase tracking-wider font-mono text-red-600 hover:underline cursor-pointer"
                        >
                          Remove Testimonial
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            const updated = [...projects];
                            updated[idx].testimonial = {
                              quote: `Working with Techno Architecture on ${p.title} was an extraordinary experience. Their obsession with light, craftsmanship, and spatial clarity exceeded our expectations.`,
                              clientName: p.client && p.client !== "Confidential" && p.client !== "Private Client" ? p.client : "Homeowner",
                              designation: "Client",
                              company: p.title,
                            };
                            saveProjects(updated);
                            showToast(`Testimonial added to "${p.title}".`);
                          }}
                          className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider font-semibold text-black hover:underline cursor-pointer"
                        >
                          <Plus size={11} />
                          <span>+ Add Client Testimonial</span>
                        </button>
                      )}
                    </div>

                    {p.testimonial ? (
                      <div className="space-y-3 pt-2 border-t border-neutral-200 text-xs">
                        <div>
                          <label className="text-[10px] uppercase font-mono text-neutral-500 block mb-1">
                            Client Quote / Review
                          </label>
                          <textarea
                            rows={3}
                            value={p.testimonial.quote || ""}
                            onChange={(e) => {
                              const updated = [...projects];
                              if (updated[idx].testimonial) {
                                updated[idx].testimonial = { ...updated[idx].testimonial!, quote: e.target.value };
                                saveProjects(updated);
                              }
                            }}
                            placeholder="Client testimonial or reflection quote..."
                            className="w-full p-2 border border-neutral-300 rounded text-xs bg-white leading-relaxed focus:border-black focus:outline-none"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          <div>
                            <label className="text-[10px] uppercase font-mono text-neutral-500 block mb-1">
                              Client Name
                            </label>
                            <input
                              type="text"
                              value={p.testimonial.clientName || ""}
                              onChange={(e) => {
                                const updated = [...projects];
                                if (updated[idx].testimonial) {
                                  updated[idx].testimonial = { ...updated[idx].testimonial!, clientName: e.target.value };
                                  saveProjects(updated);
                                }
                              }}
                              placeholder="e.g. Suresh & Anitha Gowda"
                              className="w-full p-2 border border-neutral-300 rounded text-xs bg-white focus:border-black focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="text-[10px] uppercase font-mono text-neutral-500 block mb-1">
                              Designation / Role
                            </label>
                            <input
                              type="text"
                              value={p.testimonial.designation || ""}
                              onChange={(e) => {
                                const updated = [...projects];
                                if (updated[idx].testimonial) {
                                  updated[idx].testimonial = { ...updated[idx].testimonial!, designation: e.target.value };
                                  saveProjects(updated);
                                }
                              }}
                              placeholder="e.g. Homeowner / Founder"
                              className="w-full p-2 border border-neutral-300 rounded text-xs bg-white focus:border-black focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="text-[10px] uppercase font-mono text-neutral-500 block mb-1">
                              Company / Residence
                            </label>
                            <input
                              type="text"
                              value={p.testimonial.company || ""}
                              onChange={(e) => {
                                const updated = [...projects];
                                if (updated[idx].testimonial) {
                                  updated[idx].testimonial = { ...updated[idx].testimonial!, company: e.target.value };
                                  saveProjects(updated);
                                }
                              }}
                              placeholder="e.g. Belaku Residence"
                              className="w-full p-2 border border-neutral-300 rounded text-xs bg-white focus:border-black focus:outline-none"
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p className="text-[11px] text-neutral-500 italic">
                        No testimonial attached to this project. Click &ldquo;+ Add Client Testimonial&rdquo; above to attach a client quote.
                      </p>
                    )}
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
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
                        <div>
                          <label className="text-[10px] uppercase font-mono text-neutral-500 block mb-1">
                            Principal Architect
                          </label>
                          <input
                            type="text"
                            placeholder="Ar. Rajesh Shivaram"
                            value={p.credits?.principalArchitect || "Ar. Rajesh Shivaram"}
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
                            Project Architect
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Vikramaditya Shenoy"
                            value={p.credits?.projectArchitect || p.credits?.projectLead || ""}
                            onChange={(e) => {
                              const updated = [...projects];
                              updated[idx].credits = {
                                ...updated[idx].credits,
                                projectArchitect: e.target.value,
                                projectLead: e.target.value,
                              };
                              saveProjects(updated);
                            }}
                            className="w-full p-2 border border-neutral-300 rounded text-xs bg-white"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] uppercase font-mono text-neutral-500 block mb-1">
                            Landscape Architect
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Verdant Studio"
                            value={p.credits?.landscapeArchitect || ""}
                            onChange={(e) => {
                              const updated = [...projects];
                              updated[idx].credits = {
                                ...updated[idx].credits,
                                landscapeArchitect: e.target.value,
                              };
                              saveProjects(updated);
                            }}
                            className="w-full p-2 border border-neutral-300 rounded text-xs bg-white"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] uppercase font-mono text-neutral-500 block mb-1">
                            Photography Credit
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Shamanth Patil Photography"
                            value={p.credits?.photography || ""}
                            onChange={(e) => {
                              const updated = [...projects];
                              updated[idx].credits = {
                                ...updated[idx].credits,
                                photography: e.target.value,
                              };
                              saveProjects(updated);
                            }}
                            className="w-full p-2 border border-neutral-300 rounded text-xs bg-white"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] uppercase font-mono text-neutral-500 block mb-1">
                            Team
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Karthik Sundaram, Divya Raghavan"
                            value={p.credits?.team || ""}
                            onChange={(e) => {
                              const updated = [...projects];
                              updated[idx].credits = {
                                ...updated[idx].credits,
                                team: e.target.value,
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
                                <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
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
                                    placeholder="https://... or upload video file below"
                                    className="flex-1 w-full p-2 border border-neutral-300 rounded text-xs font-mono bg-white"
                                  />
                                  <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-2 bg-black text-white rounded text-xs font-medium hover:bg-neutral-800 transition-colors shrink-0">
                                    <Upload size={13} />
                                    <span>Upload Video</span>
                                    <input
                                      type="file"
                                      accept="video/*"
                                      className="hidden"
                                      onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                          handleUploadPhoto(file, (url) => {
                                            const updated = [...projects];
                                            if (updated[idx].videoTour) {
                                              updated[idx].videoTour = {
                                                ...updated[idx].videoTour!,
                                                url,
                                                platform: "Firebase Storage" as any,
                                              };
                                              saveProjects(updated);
                                            }
                                          }, "videos");
                                        }
                                      }}
                                    />
                                  </label>
                                  {p.videoTour.url && (
                                    <a
                                      href={p.videoTour.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="px-2.5 py-1.5 bg-neutral-200 hover:bg-neutral-300 text-neutral-800 rounded text-[11px] font-mono flex items-center gap-1 transition-colors shrink-0"
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
                                    <option value="Firebase Storage">Firebase Storage</option>
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
                        <div className="flex flex-wrap justify-between items-center gap-2">
                          <span className="text-[10px] uppercase tracking-wider font-semibold text-neutral-700">
                            Project Gallery Photography ({p.gallery?.length || 0} images)
                          </span>
                          <div className="flex items-center gap-3">
                            <label className="cursor-pointer inline-flex items-center gap-1.5 px-2.5 py-1 bg-black text-white rounded text-[10px] uppercase tracking-wider font-semibold hover:bg-neutral-800 transition-colors">
                              <Upload size={12} />
                              <span>Upload Photo File</span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    handleUploadPhoto(file, (url) => {
                                      const updated = [...projects];
                                      const newImg: ProjectImage = {
                                        url,
                                        caption: file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "),
                                        aspect: "full",
                                      };
                                      updated[idx].gallery = [...(updated[idx].gallery || []), newImg];
                                      saveProjects(updated);
                                    });
                                  }
                                }}
                              />
                            </label>
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
                                showToast("New image slot added to project gallery.");
                              }}
                              className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider font-semibold text-neutral-600 hover:text-black hover:underline"
                            >
                              <Plus size={12} />
                              <span>Add via URL</span>
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {p.gallery?.map((img, gIdx) => (
                            <div
                              key={gIdx}
                              className="p-3 bg-white border border-neutral-200 rounded flex gap-3 items-start"
                            >
                              <div className="relative w-16 h-14 bg-neutral-100 rounded overflow-hidden flex-shrink-0 group">
                                <Image
                                  src={img.url}
                                  alt={img.caption || "Gallery photo"}
                                  fill
                                  unoptimized
                                  className="object-cover"
                                />
                                <label className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                                  <Upload size={14} />
                                  <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file) {
                                        handleUploadPhoto(file, (url) => {
                                          const updated = [...projects];
                                          updated[idx].gallery[gIdx].url = url;
                                          saveProjects(updated);
                                        });
                                      }
                                    }}
                                  />
                                </label>
                              </div>
                              <div className="flex-1 space-y-1.5">
                                <div className="flex gap-1.5 items-center">
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
                                  <label className="cursor-pointer p-1 text-neutral-500 hover:text-black hover:bg-neutral-100 rounded shrink-0" title="Upload new image file">
                                    <Upload size={13} />
                                    <input
                                      type="file"
                                      accept="image/*"
                                      className="hidden"
                                      onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                          handleUploadPhoto(file, (url) => {
                                            const updated = [...projects];
                                            updated[idx].gallery[gIdx].url = url;
                                            saveProjects(updated);
                                          });
                                        }
                                      }}
                                    />
                                  </label>
                                </div>
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
                      href={`/services#${s.slug}`}
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
                      Cover Image (Upload from Laptop or URL)
                    </label>
                    <div className="flex gap-1.5 items-center">
                      <input
                        type="text"
                        value={s.image}
                        onChange={(e) => {
                          const updated = [...services];
                          updated[idx].image = e.target.value;
                          saveServices(updated);
                        }}
                        placeholder="Image URL or upload from laptop"
                        className="flex-1 min-w-0 p-2 border border-neutral-300 rounded font-mono text-xs focus:border-black focus:outline-none"
                      />
                      <label
                        title="Upload from Laptop"
                        className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-2 bg-black text-white rounded text-xs font-medium hover:bg-neutral-800 transition-colors shrink-0"
                      >
                        <Upload size={12} />
                        <span>From Laptop</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              handleUploadPhoto(file, (url) => {
                                const updated = [...services];
                                updated[idx].image = url;
                                saveServices(updated);
                              }, "services");
                            }
                          }}
                        />
                      </label>
                    </div>
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
                Manage practitioner bios, credentials, roles, photography, and presentation order using the ORDER controls.
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
                {/* Practitioner Rearrangement Order Controls & Header */}
                <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
                  <div className="flex items-center border border-neutral-300 rounded overflow-hidden bg-white shadow-2xs" title="Rearrange practitioner position">
                    <span className="text-[9px] font-mono uppercase px-1.5 text-neutral-400 font-semibold bg-neutral-50 border-r border-neutral-200 select-none">
                      ORDER
                    </span>
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => {
                        if (idx === 0) return;
                        const updated = [...team];
                        const temp = updated[idx];
                        updated[idx] = updated[idx - 1];
                        updated[idx - 1] = temp;
                        saveTeam(updated);
                        showToast(`Moved "${m.name}" up to position #${idx}.`);
                      }}
                      className="p-1 hover:bg-neutral-100 text-neutral-700 disabled:opacity-25 disabled:hover:bg-transparent transition-colors cursor-pointer disabled:cursor-not-allowed"
                      title="Move practitioner UP"
                    >
                      <ArrowUp size={12} />
                    </button>
                    <span className="text-[10px] font-mono px-2 text-neutral-900 font-bold select-none border-x border-neutral-200 bg-neutral-50/50">
                      #{idx + 1}
                    </span>
                    <button
                      type="button"
                      disabled={idx === team.length - 1}
                      onClick={() => {
                        if (idx === team.length - 1) return;
                        const updated = [...team];
                        const temp = updated[idx];
                        updated[idx] = updated[idx + 1];
                        updated[idx + 1] = temp;
                        saveTeam(updated);
                        showToast(`Moved "${m.name}" down to position #${idx + 2}.`);
                      }}
                      className="p-1 hover:bg-neutral-100 text-neutral-700 disabled:opacity-25 disabled:hover:bg-transparent transition-colors cursor-pointer disabled:cursor-not-allowed"
                      title="Move practitioner DOWN"
                    >
                      <ArrowDown size={12} />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`Remove ${m.name} from studio team?`)) {
                        saveTeam(team.filter((x) => x.id !== m.id));
                        showToast(`Removed ${m.name}.`);
                      }
                    }}
                    className="text-neutral-400 hover:text-red-500 p-1 transition-colors flex items-center gap-1"
                    title={`Remove ${m.name}`}
                  >
                    <Trash2 size={13} />
                    <span className="text-[10px] font-mono text-neutral-400 hover:text-red-500">Remove</span>
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-14 bg-neutral-100 rounded overflow-hidden flex-shrink-0 group">
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
                    {/* Hover Click-to-Upload overlay from laptop */}
                    <label
                      title="Click to upload photo from your laptop"
                      className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white cursor-pointer"
                    >
                      <Camera size={13} />
                      <span className="text-[7px] uppercase font-mono mt-0.5 tracking-tighter">
                        {uploadingTargetId === m.id ? "..." : "Change"}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setUploadingTargetId(m.id);
                            handleUploadPhoto(file, (url) => {
                              const updated = [...team];
                              updated[idx].image = url;
                              saveTeam(updated);
                            }, "team");
                          }
                        }}
                      />
                    </label>
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
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-[9px] uppercase font-mono text-neutral-500 font-medium">
                      Practitioner Photo
                    </label>
                    <span className="text-[9px] text-neutral-400 font-mono">Both options available</span>
                  </div>
                  <div className="flex gap-1.5 items-center">
                    <input
                      type="text"
                      value={m.image}
                      onChange={(e) => {
                        const updated = [...team];
                        updated[idx].image = e.target.value;
                        saveTeam(updated);
                      }}
                      placeholder="Photo URL or upload from laptop"
                      className="flex-1 min-w-0 p-1.5 border border-neutral-300 rounded text-xs font-mono focus:border-black focus:outline-none"
                    />
                    <label
                      title="Upload photo file from your laptop"
                      className={`cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 bg-black text-white rounded text-xs font-medium hover:bg-neutral-800 transition-colors shrink-0 ${
                        uploadingTargetId === m.id ? "opacity-60 pointer-events-none" : ""
                      }`}
                    >
                      {uploadingTargetId === m.id ? (
                        <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Upload size={12} />
                      )}
                      <span>{uploadingTargetId === m.id ? "Uploading..." : "From Laptop"}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setUploadingTargetId(m.id);
                            handleUploadPhoto(file, (url) => {
                              const updated = [...team];
                              updated[idx].image = url;
                              saveTeam(updated);
                            }, "team");
                          }
                        }}
                      />
                    </label>
                  </div>
                  <div className="flex items-center justify-between mt-1 text-[9px] text-neutral-400">
                    <span>Stored in Firebase Cloud Storage</span>
                    {m.image && (
                      <button
                        type="button"
                        onClick={() => {
                          const updated = [...team];
                          updated[idx].image = "";
                          saveTeam(updated);
                          showToast(`Cleared photo for ${m.name}`);
                        }}
                        className="text-neutral-400 hover:text-red-500 underline"
                      >
                        Remove photo
                      </button>
                    )}
                  </div>
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
                  imagePositionX: 50,
                  imagePositionY: 50,
                  imageScale: 1.0,
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

          <div className="space-y-6">
            {blog.map((b, idx) => (
              <div key={b.id} className="p-5 border border-neutral-200 bg-white rounded space-y-4 text-xs shadow-xs">
                <div className="flex justify-between items-center border-b border-neutral-100 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-neutral-400 uppercase">{b.category}</span>
                    <span>·</span>
                    <span className="text-[10px] font-mono text-neutral-400">{b.publishedAt}</span>
                    {b.featured && (
                      <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-800 text-[9px] font-mono uppercase rounded">
                        Featured
                      </span>
                    )}
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

                {/* Interactive Image Upload & Mouse Adjuster */}
                <ImageMouseAdjuster
                  imageUrl={b.heroImage}
                  positionX={b.imagePositionX ?? 50}
                  positionY={b.imagePositionY ?? 50}
                  scale={b.imageScale ?? 1.0}
                  label="Hero Image, Upload & Mouse Alignment"
                  onChange={({ imageUrl: newUrl, positionX, positionY, scale }) => {
                    const updated = [...blog];
                    if (newUrl !== undefined) {
                      updated[idx].heroImage = newUrl;
                    }
                    updated[idx].imagePositionX = positionX;
                    updated[idx].imagePositionY = positionY;
                    updated[idx].imageScale = scale;
                    saveBlog(updated);
                  }}
                  onToast={showToast}
                />

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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-neutral-100">
                  <div>
                    <label className="text-[10px] uppercase font-mono text-neutral-500 block mb-1">Category</label>
                    <select
                      value={b.category}
                      onChange={(e) => {
                        const updated = [...blog];
                        updated[idx].category = e.target.value as any;
                        saveBlog(updated);
                      }}
                      className="w-full p-2 border border-neutral-300 rounded text-xs bg-white"
                    >
                      <option value="Spatial Theory">Spatial Theory</option>
                      <option value="Materiality">Materiality</option>
                      <option value="Sustainability">Sustainability</option>
                      <option value="Monographs">Monographs</option>
                      <option value="Urbanism">Urbanism</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2 sm:pt-5">
                    <input
                      type="checkbox"
                      id={`featured-${b.id}`}
                      checked={b.featured}
                      onChange={(e) => {
                        const updated = [...blog];
                        updated[idx].featured = e.target.checked;
                        saveBlog(updated);
                      }}
                      className="w-4 h-4 accent-black rounded"
                    />
                    <label htmlFor={`featured-${b.id}`} className="text-xs font-medium text-neutral-700 cursor-pointer">
                      Feature as Lead Monograph
                    </label>
                  </div>
                </div>

                {/* Expand / Collapse Detailed Content & Section Images */}
                <div className="pt-2 border-t border-neutral-100">
                  <button
                    type="button"
                    onClick={() => setExpandedBlogId(expandedBlogId === b.id ? null : b.id)}
                    className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-neutral-600 hover:text-black transition-colors"
                  >
                    {expandedBlogId === b.id ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                    <span>{expandedBlogId === b.id ? "Hide Article Body & Section Images" : "Edit Article Body & Section Images"}</span>
                  </button>

                  {expandedBlogId === b.id && (
                    <div className="mt-4 pt-4 border-t border-neutral-200/80 space-y-4 bg-neutral-50/50 p-4 rounded">
                      {/* Introduction */}
                      <div>
                        <label className="text-[10px] uppercase font-mono text-neutral-500 block mb-1">
                          Article Introduction
                        </label>
                        <textarea
                          rows={3}
                          value={b.content?.introduction || ""}
                          onChange={(e) => {
                            const updated = [...blog];
                            if (!updated[idx].content) {
                              updated[idx].content = { introduction: "", sections: [], conclusion: "" };
                            }
                            updated[idx].content.introduction = e.target.value;
                            saveBlog(updated);
                          }}
                          className="w-full p-2 border border-neutral-300 rounded text-xs bg-white"
                        />
                      </div>

                      {/* Sections */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] uppercase font-mono text-neutral-600 font-semibold">
                            Article Sections ({b.content?.sections?.length || 0})
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              const updated = [...blog];
                              if (!updated[idx].content) {
                                updated[idx].content = { introduction: "", sections: [], conclusion: "" };
                              }
                              updated[idx].content.sections.push({
                                heading: "New Section",
                                body: ["Write section paragraph here..."],
                              });
                              saveBlog(updated);
                              showToast("Added new section to monograph.");
                            }}
                            className="inline-flex items-center gap-1 px-2 py-1 bg-black text-white text-[10px] uppercase font-mono rounded"
                          >
                            <Plus size={11} />
                            <span>Add Section</span>
                          </button>
                        </div>

                        {b.content?.sections?.map((sec, sIdx) => (
                          <div key={sIdx} className="p-3 border border-neutral-200 bg-white rounded space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-mono text-neutral-400">Section {sIdx + 1}</span>
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = [...blog];
                                  updated[idx].content.sections = updated[idx].content.sections.filter((_, i) => i !== sIdx);
                                  saveBlog(updated);
                                  showToast("Section removed.");
                                }}
                                className="text-neutral-400 hover:text-red-500 p-0.5"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>

                            <input
                              type="text"
                              value={sec.heading}
                              placeholder="Section Heading"
                              onChange={(e) => {
                                const updated = [...blog];
                                updated[idx].content.sections[sIdx].heading = e.target.value;
                                saveBlog(updated);
                              }}
                              className="w-full p-1.5 border border-neutral-300 rounded text-xs font-medium"
                            />

                            <textarea
                              rows={3}
                              value={sec.body?.join("\n\n") || ""}
                              placeholder="Paragraph text (separate paragraphs with blank line)"
                              onChange={(e) => {
                                const updated = [...blog];
                                updated[idx].content.sections[sIdx].body = e.target.value.split("\n\n").filter(Boolean);
                                saveBlog(updated);
                              }}
                              className="w-full p-1.5 border border-neutral-300 rounded text-xs leading-relaxed"
                            />

                            {/* Optional Section Image with Mouse Adjuster */}
                            <ImageMouseAdjuster
                              imageUrl={sec.image || ""}
                              positionX={sec.imagePositionX ?? 50}
                              positionY={sec.imagePositionY ?? 50}
                              label={`Section ${sIdx + 1} Image (Optional)`}
                              onChange={({ imageUrl: newSecImg, positionX, positionY }) => {
                                const updated = [...blog];
                                if (!updated[idx].content) {
                                  updated[idx].content = { introduction: "", sections: [], conclusion: "" };
                                }
                                if (!updated[idx].content.sections) {
                                  updated[idx].content.sections = [];
                                }
                                if (!updated[idx].content.sections[sIdx]) return;
                                if (newSecImg !== undefined) {
                                  updated[idx].content.sections[sIdx].image = newSecImg;
                                }
                                updated[idx].content.sections[sIdx].imagePositionX = positionX;
                                updated[idx].content.sections[sIdx].imagePositionY = positionY;
                                saveBlog(updated);
                              }}
                              onToast={showToast}
                            />
                          </div>
                        ))}
                      </div>

                      {/* Conclusion */}
                      <div>
                        <label className="text-[10px] uppercase font-mono text-neutral-500 block mb-1">
                          Article Conclusion
                        </label>
                        <textarea
                          rows={2}
                          value={b.content?.conclusion || ""}
                          onChange={(e) => {
                            const updated = [...blog];
                            if (!updated[idx].content) {
                              updated[idx].content = { introduction: "", sections: [], conclusion: "" };
                            }
                            updated[idx].content.conclusion = e.target.value;
                            saveBlog(updated);
                          }}
                          className="w-full p-2 border border-neutral-300 rounded text-xs bg-white"
                        />
                      </div>
                    </div>
                  )}
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
                  <div className="flex gap-1.5 items-center">
                    <input
                      type="text"
                      value={g.imageUrl}
                      onChange={(e) => {
                        const updated = [...gallery];
                        updated[idx].imageUrl = e.target.value;
                        saveGallery(updated);
                      }}
                      className="flex-1 min-w-0 p-1.5 border border-neutral-300 rounded text-[11px] font-mono focus:border-black focus:outline-none"
                      placeholder="Image URL or upload from laptop"
                    />
                    <label
                      title="Upload from Laptop"
                      className="cursor-pointer inline-flex items-center gap-1 px-2.5 py-1.5 bg-black text-white rounded text-[10px] font-medium hover:bg-neutral-800 transition-colors shrink-0"
                    >
                      <Upload size={11} />
                      <span>From Laptop</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleUploadPhoto(file, (url) => {
                              const updated = [...gallery];
                              updated[idx].imageUrl = url;
                              saveGallery(updated);
                            }, "gallery");
                          }
                        }}
                      />
                    </label>
                  </div>
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
                Manage client quotes displayed on the About Us page Testimonials section.
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

          {/* Section 0: Cloud Persistence & Permanent Version Control Integration */}
          <div className="p-6 bg-gradient-to-br from-neutral-900 to-neutral-950 text-white border border-neutral-800 rounded-lg space-y-6 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/10 gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <GitBranch size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold tracking-wide text-white uppercase">
                    Permanent Cloud Storage &amp; Git Version Control
                  </h3>
                  <p className="text-xs text-neutral-400">
                    Why changes can be temporary on Vercel: Serverless runtimes have a read-only filesystem, so saves without a cloud connection only stay in ephemeral /tmp memory.
                  </p>
                </div>
              </div>

              {/* Status Badge */}
              <div className="flex items-center gap-2">
                {serverStorageInfo?.localDiskWritable ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-emerald-500/20 text-emerald-300 text-xs font-mono font-medium border border-emerald-500/30">
                    <CheckCircle2 size={13} /> Local Disk Direct Write (Active)
                  </span>
                ) : serverStorageInfo?.hasGitHubToken || githubTokenInput ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-emerald-500/20 text-emerald-300 text-xs font-mono font-medium border border-emerald-500/30">
                    <CheckCircle2 size={13} /> GitHub Auto-Commit (Configured)
                  </span>
                ) : serverStorageInfo?.hasUpstashKV || upstashUrlInput ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-emerald-500/20 text-emerald-300 text-xs font-mono font-medium border border-emerald-500/30">
                    <CheckCircle2 size={13} /> Upstash Cloud KV (Configured)
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-amber-500/20 text-amber-300 text-xs font-mono font-medium border border-amber-500/40">
                    <AlertCircle size={13} /> Temporary Serverless Cache Only
                  </span>
                )}
              </div>
            </div>

            {/* Persistence Options Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Option A: GitHub Direct Commit */}
              <div className="p-4 bg-white/5 border border-white/10 rounded-lg space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <GitBranch size={16} className="text-emerald-400" />
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-white">
                      Option A: GitHub Direct Auto-Commit (Recommended)
                    </h4>
                  </div>
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    100% Free &amp; Permanent
                  </span>
                </div>

                <p className="text-xs text-neutral-300 leading-relaxed">
                  Every time you save in the Admin Dashboard, the CMS will commit directly to <code className="text-emerald-300 font-mono">src/data/cms-content.json</code> on your GitHub repository. Vercel automatically deploys the commit, making every edit 100% permanent across all devices.
                </p>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="text-[10px] uppercase font-mono text-neutral-400 block mb-1">
                      GitHub Personal Access Token (PAT)
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={githubTokenInput}
                        onChange={(e) => setGithubTokenInput(e.target.value)}
                        placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                        className="w-full p-2.5 bg-black/40 border border-white/20 rounded font-mono text-xs text-white placeholder-neutral-500 focus:border-emerald-400 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2.5 top-2.5 text-neutral-400 hover:text-white"
                      >
                        {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-mono text-neutral-400 block mb-1">
                      Target Repository (owner/repo)
                    </label>
                    <input
                      type="text"
                      value={githubRepoInput}
                      onChange={(e) => setGithubRepoInput(e.target.value)}
                      placeholder="Kima1011/Techno-Architecture"
                      className="w-full p-2 bg-black/40 border border-white/20 rounded font-mono text-xs text-white placeholder-neutral-500"
                    />
                  </div>

                  <div className="pt-2 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={handleSaveStorageCredentials}
                      className="px-3.5 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded text-xs font-medium transition-colors"
                    >
                      Save Token Locally
                    </button>
                    <button
                      type="button"
                      onClick={handleCommitToGitHub}
                      disabled={isCommittingGit}
                      className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800 text-white rounded text-xs font-medium transition-colors flex items-center gap-1.5"
                    >
                      {isCommittingGit ? (
                        <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <GitBranch size={13} />
                      )}
                      <span>{isCommittingGit ? "Committing..." : "Commit All Data to GitHub Now"}</span>
                    </button>
                  </div>

                  <div className="p-2.5 bg-black/30 border border-white/10 rounded text-[11px] text-neutral-400 space-y-1">
                    <span className="font-semibold text-neutral-300 block">How to get a GitHub Token in 1 minute:</span>
                    <ol className="list-decimal list-inside space-y-0.5 text-neutral-400">
                      <li>Go to github.com → Click avatar → <strong>Settings</strong></li>
                      <li>Scroll down left sidebar → <strong>Developer Settings</strong> → <strong>Personal access tokens</strong> → <strong>Tokens (classic)</strong></li>
                      <li>Click <strong>Generate new token (classic)</strong> → Check <strong>repo</strong> checkbox → Click <strong>Generate token</strong></li>
                      <li>Copy the token and paste it above!</li>
                    </ol>
                  </div>
                </div>
              </div>

              {/* Option B: Upstash KV / Vercel KV REST */}
              <div className="p-4 bg-white/5 border border-white/10 rounded-lg space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Database size={16} className="text-cyan-400" />
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-white">
                      Option B: Upstash Redis / Vercel KV (Instant Live Sync)
                    </h4>
                  </div>
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    Free Tier (10k ops/day)
                  </span>
                </div>

                <p className="text-xs text-neutral-300 leading-relaxed">
                  Upstash Redis provides instant, sub-millisecond cloud storage without waiting for Vercel rebuilds. Perfect for instant changes across multiple admin tabs or visitors.
                </p>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="text-[10px] uppercase font-mono text-neutral-400 block mb-1">
                      Upstash REST API URL
                    </label>
                    <input
                      type="text"
                      value={upstashUrlInput}
                      onChange={(e) => setUpstashUrlInput(e.target.value)}
                      placeholder="https://xxxx-xxxxx.upstash.io"
                      className="w-full p-2 bg-black/40 border border-white/20 rounded font-mono text-xs text-white placeholder-neutral-500"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-mono text-neutral-400 block mb-1">
                      Upstash REST Token
                    </label>
                    <input
                      type="password"
                      value={upstashTokenInput}
                      onChange={(e) => setUpstashTokenInput(e.target.value)}
                      placeholder="AXxx..."
                      className="w-full p-2 bg-black/40 border border-white/20 rounded font-mono text-xs text-white placeholder-neutral-500"
                    />
                  </div>

                  <div className="pt-2 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={handleSaveStorageCredentials}
                      className="px-3.5 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded text-xs font-medium transition-colors"
                    >
                      Save Upstash Credentials
                    </button>
                    <button
                      type="button"
                      onClick={exportCmsJson}
                      className="px-3.5 py-1.5 bg-white text-black hover:bg-neutral-200 rounded text-xs font-medium transition-colors flex items-center gap-1.5"
                    >
                      <Download size={13} />
                      <span>Download cms-content.json</span>
                    </button>
                  </div>

                  <div className="p-2.5 bg-black/30 border border-white/10 rounded text-[11px] text-neutral-400 space-y-1">
                    <span className="font-semibold text-neutral-300 block">How to connect Upstash in 30 seconds:</span>
                    <p className="text-neutral-400">
                      Sign up at <a href="https://upstash.com" target="_blank" rel="noopener noreferrer" className="text-cyan-400 underline">upstash.com</a> (Free forever) → Create Redis Database → Copy <strong>UPSTASH_REDIS_REST_URL</strong> and <strong>UPSTASH_REDIS_REST_TOKEN</strong> above.
                    </p>
                  </div>
                </div>
              </div>

              {/* Option C / Media Engine: Firebase Cloud Storage */}
              <div className="lg:col-span-2 p-4 bg-white/5 border border-amber-500/30 rounded-lg space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Cloud size={18} className="text-amber-400" />
                    <div>
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-white">
                        Firebase Cloud Storage — Media &amp; Asset Engine
                      </h4>
                      <p className="text-[11px] text-neutral-400">
                        High-performance Google cloud media storage for architectural photography, CAD diagrams, videos, and monograph images.
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono uppercase px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold flex items-center gap-1.5">
                    <CheckCircle2 size={11} className="text-amber-400" /> Active Cloud Storage
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 bg-black/40 border border-white/10 rounded space-y-1">
                    <span className="text-[10px] uppercase font-mono text-neutral-400 block">Storage Bucket</span>
                    <span className="font-mono text-amber-300 text-xs font-semibold break-all">
                      technoarchitecture-7d718.firebasestorage.app
                    </span>
                  </div>
                  <div className="p-3 bg-black/40 border border-white/10 rounded space-y-1">
                    <span className="text-[10px] uppercase font-mono text-neutral-400 block">Delivery Network</span>
                    <span className="font-mono text-white text-xs">Google Cloud Global CDN</span>
                  </div>
                  <div className="p-3 bg-black/40 border border-white/10 rounded space-y-1">
                    <span className="text-[10px] uppercase font-mono text-neutral-400 block">Upload Engine</span>
                    <span className="font-mono text-emerald-400 text-xs">Direct Client Resumable Stream</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-white/10">
                  <p className="text-[11px] text-neutral-300">
                    Files uploaded anywhere in the Admin Dashboard (Projects, Team, Monographs, Services) stream directly to this Firebase bucket and return permanent global CDN URLs.
                  </p>
                  <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-semibold rounded text-xs transition-colors shrink-0">
                    <Upload size={13} />
                    <span>Test Firebase Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleUploadPhoto(file, (url) => {
                            showToast(`Firebase test upload verified: ${url.slice(0, 45)}...`);
                          }, "test-uploads");
                        }
                      }}
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Feedback Alert */}
            {storageFeedback && (
              <div
                className={`p-3.5 rounded border text-xs flex items-start gap-2.5 ${
                  storageFeedback.type === "success"
                    ? "bg-emerald-950/60 border-emerald-500/50 text-emerald-200"
                    : storageFeedback.type === "error"
                    ? "bg-red-950/60 border-red-500/50 text-red-200"
                    : "bg-blue-950/60 border-blue-500/50 text-blue-200"
                }`}
              >
                {storageFeedback.type === "success" ? (
                  <CheckCircle2 size={16} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
                )}
                <span>{storageFeedback.msg}</span>
              </div>
            )}
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
                  Office No BSNL Landline
                </label>
                <input
                  type="text"
                  value={siteSettings.contact.phoneBsnl || ""}
                  onChange={(e) => {
                    saveSiteSettings({
                      ...siteSettings,
                      contact: { ...siteSettings.contact, phoneBsnl: e.target.value },
                    });
                  }}
                  className="w-full p-2 border border-neutral-300 rounded text-xs bg-white"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-mono text-neutral-500 block mb-1">
                  WhatsApp Direct Number
                </label>
                <input
                  type="text"
                  value={siteSettings.contact.whatsapp || ""}
                  onChange={(e) => {
                    saveSiteSettings({
                      ...siteSettings,
                      contact: { ...siteSettings.contact, whatsapp: e.target.value },
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

            {(siteSettings.studios || []).map((st, sIdx) => (
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

      {/* ========================================================= */}
      {/* LEADS / ENQUIRIES TAB                                     */}
      {/* ========================================================= */}
      {activeTab === "leads" && (
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-900 flex items-center gap-2">
                <Inbox size={16} className="text-emerald-600" />
                Enquiry Leads & Contact Submissions
              </h2>
              <p className="text-xs text-neutral-500 mt-1">
                All enquiries submitted via the contact form — stored permanently in Firestore.
              </p>
            </div>
            <button
              onClick={fetchLeads}
              disabled={leadsLoading}
              className="flex items-center gap-1.5 px-4 py-2 bg-neutral-900 text-white text-xs uppercase tracking-wider rounded hover:bg-neutral-700 disabled:opacity-50 transition-colors"
            >
              <RefreshCw size={12} className={leadsLoading ? "animate-spin" : ""} />
              <span>{leadsLoading ? "Loading..." : "Refresh Leads"}</span>
            </button>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 flex-wrap">
            {(["all", "new", "reviewed", "archived"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setLeadsFilter(f)}
                className={cn(
                  "px-3 py-1.5 text-[10px] uppercase tracking-widest rounded transition-colors font-medium",
                  leadsFilter === f
                    ? f === "new"
                      ? "bg-emerald-600 text-white"
                      : f === "archived"
                      ? "bg-neutral-400 text-white"
                      : "bg-black text-white"
                    : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                )}
              >
                {f === "all" ? `All (${leads.length})` : `${f} (${leads.filter((l) => l.status === f).length})`}
              </button>
            ))}
          </div>

          {/* Error state */}
          {leadsError && (
            <div className="p-4 bg-red-50 border border-red-200 rounded flex items-start gap-2 text-xs text-red-700">
              <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
              <span>{leadsError}</span>
            </div>
          )}

          {/* Empty / Loading state */}
          {leadsLoading && (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-neutral-400">
              <RefreshCw size={24} className="animate-spin" />
              <span className="text-xs uppercase tracking-widest">Fetching leads from Firestore...</span>
            </div>
          )}

          {!leadsLoading && !leadsError && leads.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-neutral-400 border border-dashed border-neutral-200 rounded">
              <Inbox size={32} strokeWidth={1} />
              <span className="text-xs uppercase tracking-widest">No enquiry leads yet</span>
              <span className="text-[11px] text-neutral-400">Submissions from the contact form will appear here.</span>
            </div>
          )}

          {/* Leads Table */}
          {!leadsLoading && leads.filter((l) => leadsFilter === "all" || l.status === leadsFilter).length > 0 && (
            <div className="space-y-3">
              {leads
                .filter((l) => leadsFilter === "all" || l.status === leadsFilter)
                .map((lead) => {
                  const isExpanded = expandedLeadId === lead.id;
                  const statusColors: Record<string, string> = {
                    new: "bg-emerald-50 text-emerald-700 border-emerald-200",
                    reviewed: "bg-blue-50 text-blue-700 border-blue-200",
                    archived: "bg-neutral-100 text-neutral-500 border-neutral-200",
                  };
                  const statusIcons: Record<string, React.ReactNode> = {
                    new: <Clock size={10} />,
                    reviewed: <CheckCheck size={10} />,
                    archived: <Archive size={10} />,
                  };

                  return (
                    <div
                      key={lead.id}
                      className={cn(
                        "border rounded-lg overflow-hidden transition-all duration-200",
                        lead.status === "new" ? "border-emerald-200 bg-emerald-50/30" : "border-neutral-200 bg-white"
                      )}
                    >
                      {/* Lead Row Header */}
                      <div
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 cursor-pointer hover:bg-neutral-50 transition-colors"
                        onClick={() => setExpandedLeadId(isExpanded ? null : lead.id)}
                      >
                        <div className="flex items-start gap-3 min-w-0">
                          {/* Status Badge */}
                          <span
                            className={cn(
                              "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] uppercase font-semibold tracking-wider border flex-shrink-0 mt-0.5",
                              statusColors[lead.status] || statusColors.new
                            )}
                          >
                            {statusIcons[lead.status]}
                            {lead.status}
                          </span>

                          <div className="min-w-0">
                            <div className="font-semibold text-xs text-neutral-900 truncate">
                              {lead.fullName || "—"}
                            </div>
                            <div className="text-[11px] text-neutral-500 mt-0.5 flex flex-wrap gap-x-3 gap-y-0.5">
                              <span className="flex items-center gap-1">
                                <Mail size={9} /> {lead.email}
                              </span>
                              {lead.phone && lead.phone !== "Not provided" && (
                                <span className="flex items-center gap-1">
                                  <Phone size={9} /> {lead.phone}
                                </span>
                              )}
                              {lead.service && lead.service !== "General Architecture & Design Enquiry" && (
                                <span className="text-neutral-400">{lead.service}</span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                          {lead.createdAt && (
                            <span className="text-[10px] text-neutral-400 font-mono hidden md:block">
                              {(() => {
                                try {
                                  const d = new Date(lead.createdAt);
                                  return isNaN(d.getTime()) ? "—" : d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
                                } catch {
                                  return "—";
                                }
                              })()}
                            </span>
                          )}
                          <ChevronRight
                            size={14}
                            className={cn(
                              "text-neutral-400 transition-transform duration-200",
                              isExpanded ? "rotate-90" : ""
                            )}
                          />
                        </div>
                      </div>

                      {/* Expanded Detail Panel */}
                      {isExpanded && (
                        <div className="px-4 pb-4 border-t border-neutral-100 space-y-4 pt-4">
                          {/* Meta Grid */}
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                            <div>
                              <span className="text-[9px] uppercase font-mono text-neutral-400 block mb-0.5">Company</span>
                              <span className="text-neutral-700">{lead.company || "—"}</span>
                            </div>
                            <div>
                              <span className="text-[9px] uppercase font-mono text-neutral-400 block mb-0.5">Budget</span>
                              <span className="text-neutral-700">{lead.budget || "Not specified"}</span>
                            </div>
                            <div>
                              <span className="text-[9px] uppercase font-mono text-neutral-400 block mb-0.5">Service Interest</span>
                              <span className="text-neutral-700">{lead.service || "—"}</span>
                            </div>
                            <div>
                              <span className="text-[9px] uppercase font-mono text-neutral-400 block mb-0.5">Received</span>
                              <span className="text-neutral-700 font-mono">
                                {(() => {
                                  if (!lead.createdAt) return "—";
                                  try {
                                    const d = new Date(lead.createdAt);
                                    return isNaN(d.getTime()) ? "—" : d.toLocaleString("en-IN");
                                  } catch {
                                    return "—";
                                  }
                                })()}
                              </span>
                            </div>
                          </div>

                          {/* Message */}
                          <div>
                            <span className="text-[9px] uppercase font-mono text-neutral-400 block mb-1.5">Message</span>
                            <div className="p-3 bg-neutral-50 border border-neutral-200 rounded text-xs text-neutral-700 leading-relaxed whitespace-pre-wrap">
                              {lead.message}
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex flex-wrap items-center gap-2 pt-1">
                            <span className="text-[10px] uppercase font-mono text-neutral-400">Mark as:</span>
                            {lead.status !== "new" && (
                              <button
                                onClick={() => updateLeadStatus(lead.id, "new")}
                                className="flex items-center gap-1 px-3 py-1 text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 rounded hover:bg-emerald-100 transition-colors uppercase tracking-wider"
                              >
                                <Clock size={10} /> New
                              </button>
                            )}
                            {lead.status !== "reviewed" && (
                              <button
                                onClick={() => updateLeadStatus(lead.id, "reviewed")}
                                className="flex items-center gap-1 px-3 py-1 text-[10px] bg-blue-50 text-blue-700 border border-blue-200 rounded hover:bg-blue-100 transition-colors uppercase tracking-wider"
                              >
                                <CheckCheck size={10} /> Reviewed
                              </button>
                            )}
                            {lead.status !== "archived" && (
                              <button
                                onClick={() => updateLeadStatus(lead.id, "archived")}
                                className="flex items-center gap-1 px-3 py-1 text-[10px] bg-neutral-100 text-neutral-600 border border-neutral-200 rounded hover:bg-neutral-200 transition-colors uppercase tracking-wider"
                              >
                                <Archive size={10} /> Archive
                              </button>
                            )}
                            <a
                              href={`mailto:${lead.email}?subject=Re: Your Architectural Enquiry — Techno Architecture&body=Dear ${lead.fullName},%0A%0AThank you for reaching out to Techno Architecture.`}
                              className="flex items-center gap-1 px-3 py-1 text-[10px] bg-black text-white rounded hover:bg-neutral-800 transition-colors uppercase tracking-wider ml-auto"
                            >
                              <Mail size={10} /> Reply via Email
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      )}
      </div>
    </div>
  );
}
