"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import BrandLogo from "@/components/common/BrandLogo";
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
  AlertTriangle,
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
  Search,
  Copy,
  FileSpreadsheet,
  MessageCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ImageMouseAdjuster } from "@/components/admin/ImageMouseAdjuster";
import { AdminDraftInput, AdminDraftTextarea } from "@/components/admin/AdminDraftInputs";

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
  notes?: string;
  createdAt: string;
}

const STANDARD_TEAM_ROLES = [
  "Principal Architect & Founder",
  "Partner & Director",
  "Associate Architect",
  "Senior Project Architect",
  "Project Architect",
  "Architect",
  "Junior Architect",
  "Lead Interior Architect",
  "Interior Architect",
  "Interior Architect & Space Planner",
  "Interior & Materials Specialist",
  "Senior Interior Designer",
  "Interior Designer",
  "Senior Architect & Design Research",
  "Computational Design & Project Architect",
  "Architectural Designer & Visualization Lead",
  "Sustainable Design & Landscape Coordinator",
  "Architectural Designer",
  "Technical Architect & Site Coordinator",
  "Lead 3D Visualizer & Architect",
  "Visualization Specialist & Architect",
  "3D Visualizer & BIM Modeler",
  "BIM Coordinator",
  "Landscape Architect",
  "Office Administrator & HR",
  "Studio Manager",
  "Senior Associate",
  "Intern Architect",
] as const;

const STANDARD_TEAM_DISCIPLINES = [
  "Leadership",
  "Architecture",
  "Interiors",
  "Office Administration",
  "Research & Sustainability",
  "BIM & Technical",
  "Landscape Architecture",
  "Urban Design",
] as const;

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
    deletedIds,
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
    refetchFromServer,
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
    const [savingEntityId, setSavingEntityId] = useState<string | null>(null);

  const handleSaveItem = async (id: string, label: string) => {
    setSavingEntityId(id);
    try {
      const res = await saveAllToCloud();
      const isSaved = res && (res.success || res.storageStatus?.firebaseStorage || res.storageStatus?.isPermanent);
      if (isSaved) {
        showToast(`Saved "${label}" to Cloud Archive ✅`);
      } else {
        const errorMsg =
          res?.error?.error ||
          res?.error?.message ||
          (typeof res?.error === "string" ? res.error : null) ||
          res?.message ||
          res?.storageStatus?.summaryMessage ||
          "Save failed: Changes were NOT saved permanently. Please sign in again.";
        showToast(`Save failed for "${label}": ${errorMsg}`);
      }
    } catch (err: any) {
      showToast(`Failed to save "${label}": ${err?.message || "Network error"}`);
    } finally {
      setSavingEntityId(null);
    }
  };

  // Tab & Notification states
  const [activeTab, setActiveTab] = useState<AdminTab>("projects");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [expandedProjectId, setExpandedProjectId] = useState<string | null>(null);
  const [expandedBlogId, setExpandedBlogId] = useState<string | null>(null);
  const [autoSaveStatus, setAutoSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [autoSaveErrorMessage, setAutoSaveErrorMessage] = useState<string | null>(null);
  const [serverConnectionWarning, setServerConnectionWarning] = useState<string | null>(null);
  const [sessionExpiredWarning, setSessionExpiredWarning] = useState<string | null>(null);
  // UI-side watchdog: if "saving" spinner stays for >28s without resolution, force it to "error"
  const autoSaveWatchdogRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleStatus = (e: any) => {
      if (e.detail?.status) {
        const status = e.detail.status as "saving" | "saved" | "error" | "idle";
        setAutoSaveStatus(status);
        if (status === "error") {
          setAutoSaveErrorMessage(e.detail?.error || "Sync failed");
        } else if (status === "saved") {
          setAutoSaveErrorMessage(null);
        }

        // Clear any previous watchdog
        if (autoSaveWatchdogRef.current) {
          clearTimeout(autoSaveWatchdogRef.current);
          autoSaveWatchdogRef.current = null;
        }

        if (status === "saving") {
          // If still showing "saving" after 28s — something is definitely hung
          autoSaveWatchdogRef.current = setTimeout(() => {
            autoSaveWatchdogRef.current = null;
            setAutoSaveStatus("error");
            setAutoSaveErrorMessage("Save timed out (28s). Please click 'Save All to Cloud' to retry.");
            setTimeout(() => setAutoSaveStatus("idle"), 6000);
          }, 28000);
        } else if (status === "saved") {
          setTimeout(() => setAutoSaveStatus("idle"), 3500);
        } else if (status === "error") {
          setTimeout(() => setAutoSaveStatus("idle"), 8000);
        }
      }
    };
    const handleExpired = (e: any) => {
      setSessionExpiredWarning(e.detail?.message || "Admin session expired. Please sign in again.");
      showToast("⚠️ Admin session expired. Please log in to save changes permanently.");
    };
    window.addEventListener("techno_cms_autosave_status", handleStatus);
    window.addEventListener("techno_admin_auth_expired", handleExpired);
    return () => {
      window.removeEventListener("techno_cms_autosave_status", handleStatus);
      window.removeEventListener("techno_admin_auth_expired", handleExpired);
      if (autoSaveWatchdogRef.current) clearTimeout(autoSaveWatchdogRef.current);
    };
  }, []);

  // Leads CRM state
  const [leads, setLeads] = useState<EnquiryLead[]>([]);
  const [leadsLoading, setLeadsLoading] = useState(false);
  const [leadsError, setLeadsError] = useState<string | null>(null);
  const [expandedLeadId, setExpandedLeadId] = useState<string | null>(null);
  const [leadsFilter, setLeadsFilter] = useState<"all" | "new" | "reviewed" | "archived">("all");
  const [leadsSearchQuery, setLeadsSearchQuery] = useState<string>("");
  const [deletingLeadId, setDeletingLeadId] = useState<string | null>(null);
  const [editingNoteLeadId, setEditingNoteLeadId] = useState<string | null>(null);
  const [leadNoteInput, setLeadNoteInput] = useState<string>("");
  const [savingNote, setSavingNote] = useState<boolean>(false);
  const [showAddLeadModal, setShowAddLeadModal] = useState<boolean>(false);
  const [isSubmittingManualLead, setIsSubmittingManualLead] = useState<boolean>(false);
  const [newLeadForm, setNewLeadForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    company: "",
    service: "General Architecture & Design Enquiry",
    budget: "",
    message: "",
    notes: "",
    status: "new" as "new" | "reviewed" | "archived",
  });

  // File import ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 1. Verify Session on Mount via Server
  const checkAuthSession = useCallback(async () => {
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
      let data: any = null;
      try {
        data = await res.json();
      } catch (_) {
        data = null;
      }

      if (res.ok && data?.authenticated) {
        setIsAuthenticated(true);
        setCurrentAdminUser(data.username || "admin");
        setServerConnectionWarning(null);
        if (data.token) {
          try {
            localStorage.setItem("techno_admin_token", data.token);
            sessionStorage.setItem("techno_admin_token", data.token);
          } catch (_) {}
        }
        // Fetch leads immediately on auth so sidebar/badge counts update right away
        fetchLeads();
      } else {
        setIsAuthenticated(false);
      }
    } catch (err: any) {
      console.warn("[Admin Verify] Network error verifying session:", err?.message);
      const hadToken = typeof window !== "undefined" && Boolean(localStorage.getItem("techno_admin_token"));
      if (hadToken) {
        setIsAuthenticated(true);
        setCurrentAdminUser("admin");
        setServerConnectionWarning("The server is temporarily restarting or redeploying. Loaded local cached studio data.");
      } else {
        setIsAuthenticated(false);
      }
    } finally {
      setIsVerifying(false);
    }
  }, []);

  useEffect(() => {
    checkAuthSession();
  }, [checkAuthSession]);

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
      const res = await fetch("/api/admin/leads", { headers, credentials: "include", cache: "no-store" });
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
        credentials: "include",
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

  const handleDeleteLead = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!confirm("Are you sure you want to permanently delete this enquiry lead? This action cannot be undone.")) return;
    setDeletingLeadId(id);
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
      const res = await fetch(`/api/admin/leads?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
        headers,
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to delete lead from server.");
      setLeads((prev) => prev.filter((l) => l.id !== id));
      if (expandedLeadId === id) setExpandedLeadId(null);
      showToast("Enquiry lead deleted permanently ✅");
    } catch (err: any) {
      showToast("Delete failed: " + (err?.message || "Unknown error"));
    } finally {
      setDeletingLeadId(null);
    }
  };

  const handleSaveLeadNote = async (id: string) => {
    setSavingNote(true);
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
        credentials: "include",
        body: JSON.stringify({ id, notes: leadNoteInput }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to save note.");
      setLeads((prev) =>
        prev.map((l) => (l.id === id ? { ...l, notes: leadNoteInput } : l))
      );
      setEditingNoteLeadId(null);
      showToast("Studio internal note saved ✅");
    } catch (err: any) {
      showToast("Failed to save note: " + (err?.message || "Unknown error"));
    } finally {
      setSavingNote(false);
    }
  };

  const handleExportLeadsCsv = () => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("techno_admin_token") ||
          sessionStorage.getItem("techno_admin_token")
        : null;
    const url = token
      ? `/api/admin/leads?format=csv&token=${encodeURIComponent(token)}`
      : `/api/admin/leads?format=csv`;
    window.open(url, "_blank");
    showToast("Exporting leads to CSV... 📊");
  };

  const handleCreateManualLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeadForm.fullName.trim()) {
      showToast("Please enter lead full name.");
      return;
    }
    setIsSubmittingManualLead(true);
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
        method: "POST",
        headers,
        credentials: "include",
        body: JSON.stringify(newLeadForm),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to create manual lead.");
      if (data?.lead) {
        setLeads((prev) => [data.lead, ...prev]);
      } else {
        await fetchLeads();
      }
      setShowAddLeadModal(false);
      setNewLeadForm({
        fullName: "",
        email: "",
        phone: "",
        company: "",
        service: "General Architecture & Design Enquiry",
        budget: "",
        message: "",
        notes: "",
        status: "new",
      });
      showToast("New enquiry lead created successfully ✅");
    } catch (err: any) {
      showToast("Failed to create lead: " + (err?.message || "Unknown error"));
    } finally {
      setIsSubmittingManualLead(false);
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
        fetchLeads();
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

          if (syncRes.ok && syncData?.token) {
            setIsAuthenticated(true);
            setCurrentAdminUser(syncData.username || user.email || usernameInput);
            try {
              localStorage.setItem("techno_admin_token", syncData.token);
              sessionStorage.setItem("techno_admin_token", syncData.token);
            } catch (_) {}
            setPasswordInput("");
            setAuthError("");
            fetchLeads();
            showToast(`Welcome, ${user.email}! Authenticated via Firebase.`);
            return;
          } else {
            throw new Error(syncData?.error || "Firebase authentication was rejected by the server.");
          }
        } catch (fbErr: any) {
          console.warn("Firebase Email Login attempt:", fbErr);
          throw new Error(fbErr?.message || "Firebase Email Login failed.");
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

      if (res.ok && data?.token) {
        setIsAuthenticated(true);
        setCurrentAdminUser(data.username || user.email || user.displayName || "Google Admin");
        try {
          localStorage.setItem("techno_admin_token", data.token);
          sessionStorage.setItem("techno_admin_token", data.token);
        } catch (_) {}
        setPasswordInput("");
        setAuthError("");
        fetchLeads();
        showToast(`Welcome, ${user.displayName || user.email}! Signed in via Google.`);
      } else {
        throw new Error(data?.error || "Google Sign-In was not authorized by the server.");
      }
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
      if (res && res.success && res.storageStatus?.isPermanent !== false) {
        showToast(res.message || "All changes saved & synced permanently.");
      } else {
        const errorMsg =
          (Array.isArray(res?.error?.errorDetails) && res.error.errorDetails.length > 0
            ? res.error.errorDetails.join(" | ")
            : null) ||
          res?.error?.error ||
          res?.error?.message ||
          (typeof res?.error === "string" ? res.error : null) ||
          res?.message ||
          (Array.isArray(res?.storageStatus?.errorDetails) && res.storageStatus.errorDetails.length > 0
            ? res.storageStatus.errorDetails.join(" | ")
            : null) ||
          res?.storageStatus?.summaryMessage ||
          "Save failed: Changes were NOT saved permanently. Please verify cloud credentials.";
        showToast("Save failed: " + errorMsg);
      }
    } catch (e: any) {
      showToast("Save failed: Network error reaching server.");
    } finally {
      setIsSyncingCloud(false);
    }
  };

  const [isCommittingGitHub, setIsCommittingGitHub] = useState(false);
  const handleCommitToGitHub = async () => {
    if (!confirm("Commit all current studio content to GitHub repo (triggers production rebuild)? Proceed?")) {
      return;
    }
    setIsCommittingGitHub(true);
    try {
      const res = await saveAllToCloud({ forceGitHubCommit: true });
      if (res && res.success) {
        showToast("Committed to GitHub successfully. Production redeployment started.");
      } else {
        showToast("GitHub commit notice: " + (res?.error || "Commit completed"));
      }
    } catch (e: any) {
      showToast("GitHub commit error: " + e?.message);
    } finally {
      setIsCommittingGitHub(false);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
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
    setUploadProgress(10);
    const isVideo = file.type.startsWith("video/");
    const mediaLabel = isVideo ? "video" : "photo";
    showToast(`Processing ${mediaLabel} for upload...`);

    try {
      // 1. Client-Side Image Optimization (Canvas resize to max 1200px at 85% quality)
      let fallbackDataUrl = "";
      let uploadFile: File | Blob = file;

      if (!isVideo && typeof window !== "undefined") {
        try {
          const compressed = await new Promise<{ blob: Blob; dataUrl: string }>((resolve) => {
            let finished = false;
            const timer = setTimeout(() => {
              if (finished) return;
              finished = true;
              const r = new FileReader();
              r.onload = () => resolve({ blob: file, dataUrl: (r.result as string) || "" });
              r.onerror = () => resolve({ blob: file, dataUrl: "" });
              r.readAsDataURL(file);
            }, 2500);

            const reader = new FileReader();
            reader.onload = (e) => {
              const img = document.createElement("img");
              img.onload = () => {
                if (finished) return;
                finished = true;
                clearTimeout(timer);
                const maxDim = 1200;
                let w = img.width;
                let h = img.height;
                if (w > maxDim || h > maxDim) {
                  if (w > h) {
                    h = Math.round((h * maxDim) / w);
                    w = maxDim;
                  } else {
                    w = Math.round((w * maxDim) / h);
                    h = maxDim;
                  }
                }
                const canvas = document.createElement("canvas");
                canvas.width = w;
                canvas.height = h;
                const ctx = canvas.getContext("2d");
                if (ctx) {
                  ctx.drawImage(img, 0, 0, w, h);
                  const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
                  canvas.toBlob(
                    (b) => {
                      resolve({ blob: b || file, dataUrl });
                    },
                    "image/jpeg",
                    0.85
                  );
                } else {
                  const dataUrl = e.target?.result as string;
                  resolve({ blob: file, dataUrl });
                }
              };
              img.onerror = () => {
                if (finished) return;
                finished = true;
                clearTimeout(timer);
                const dataUrl = e.target?.result as string;
                resolve({ blob: file, dataUrl });
              };
              img.src = e.target?.result as string;
            };
            reader.onerror = () => {
              if (finished) return;
              finished = true;
              clearTimeout(timer);
              resolve({ blob: file, dataUrl: "" });
            };
            reader.readAsDataURL(file);
          });

          fallbackDataUrl = compressed.dataUrl;
          if (compressed.blob) {
            uploadFile = new File([compressed.blob], file.name.replace(/\.[^/.]+$/, ".jpg"), {
              type: "image/jpeg",
            });
          }
        } catch (compErr) {
          console.debug("Canvas optimization notice:", compErr);
        }
      }

      setUploadProgress(25);

      // 2. Direct Upload to Firebase Cloud Storage (technoarchitecture-7d718.firebasestorage.app)
      // Uploading directly from client to Firebase Storage completely bypasses Vercel Origin,
      // saving Fast Origin Transfer and Fluid Active CPU hours.
      try {
        const fbResult = await uploadToFirebaseStorage(
          uploadFile,
          folder,
          undefined,
          (pct) => setUploadProgress(25 + Math.round(pct * 0.7))
        );
        if (fbResult?.url) {
          setUploadProgress(100);
          onSuccess(fbResult.url);
          showToast("✅ " + (isVideo ? "Video" : "Photo") + " uploaded to Firebase Storage successfully!");
          return;
        }
      } catch (fbErr) {
        console.warn("Direct Firebase Storage client upload error, attempting server fallback:", fbErr);
      }

      // 3. Fallback: Upload via Next.js server /api/upload endpoint with full authentication & cookies
      try {
        const fd = new FormData();
        fd.append("file", uploadFile);
        if (folder) fd.append("folder", folder);

        const token =
          typeof window !== "undefined"
            ? localStorage.getItem("techno_admin_token") ||
              sessionStorage.getItem("techno_admin_token")
            : null;

        const headers: Record<string, string> = {};
        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
          headers["x-admin-token"] = token;
          fd.append("adminToken", token);
        }

        const res = await fetch("/api/upload", {
          method: "POST",
          credentials: "include",
          headers,
          body: fd,
        });

        if (res.ok) {
          const data = await res.json();
          if (data?.url) {
            setUploadProgress(100);
            onSuccess(data.url);
            showToast(`✅ ${isVideo ? "Video" : "Photo"} uploaded and saved successfully!`);
            return;
          }
        } else {
          console.warn("/api/upload responded with status", res.status);
        }
      } catch (uploadErr) {
        console.warn("Direct /api/upload error, falling back to client-saved dataUrl:", uploadErr);
      }

      // 3. Resilient Fallback: If server upload had any issue, apply the optimized dataUrl immediately
      if (fallbackDataUrl) {
        setUploadProgress(100);
        onSuccess(fallbackDataUrl);
        showToast(`✅ Photo saved directly into studio archive!`);
        return;
      }

      throw new Error("Could not process photo file.");
    } catch (err: any) {
      alert(`Media upload failed: ${err.message || "Unknown error"}`);
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
                className="block group focus:outline-none"
              >
                <BrandLogo
                  theme="dark"
                  priority
                  className="w-44 sm:w-56 md:w-64"
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
              <div
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[11px] font-mono"
                title="Permanent Firebase Cloud Storage active (technoarchitecture-7d718.firebasestorage.app)"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <Cloud size={12} className="text-emerald-400" />
                <span>Storage: <strong>Firebase Cloud Storage (Permanent)</strong></span>
              </div>

              {/* Studio Cloud Archive Media Badge */}
              <div
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[11px] font-mono"
                title="Studio Cloud Archive: All project, team, and monograph photos upload and persist seamlessly."
              >
                <Cloud size={12} className="text-emerald-400" />
                <span>Media: <strong className="text-emerald-200">Studio Archive (Active)</strong></span>
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
              {/* Live Cloud Auto-Sync Indicator */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                {autoSaveStatus === "saving" && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[10px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse">
                    <RefreshCw size={11} className="animate-spin" />
                    Auto-syncing to cloud...
                  </span>
                )}
                {autoSaveStatus === "saved" && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    <Check size={11} />
                    Auto-saved to Cloud Storage
                  </span>
                )}
                {autoSaveStatus === "error" && (
                  <span
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[10px] font-mono bg-red-500/20 text-red-300 border border-red-500/40"
                    title={autoSaveErrorMessage || "Sync issue"}
                  >
                    ⚠️ Sync: {autoSaveErrorMessage || "Check session"}
                  </span>
                )}
              </div>
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
                onClick={handleCommitToGitHub}
                disabled={isCommittingGitHub}
                type="button"
                className="flex items-center gap-1.5 px-3.5 py-2 bg-white/10 hover:bg-white/20 disabled:opacity-50 text-white border border-white/15 transition-colors rounded text-xs font-medium uppercase tracking-wider cursor-pointer"
                title="Commit content directly to GitHub repository & trigger production redeployment"
              >
                {isCommittingGitHub ? (
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <GitBranch size={13} />
                )}
                <span>{isCommittingGitHub ? "Committing..." : "Commit to GitHub"}</span>
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

      {/* Session Expired Warning Banner */}
      {sessionExpiredWarning && (
        <div className="p-4 bg-red-600 text-white text-xs flex items-center justify-between rounded shadow-lg animate-fadeIn border border-red-700">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm">⚠️</span>
            <span>{sessionExpiredWarning}</span>
          </div>
          <button
            onClick={() => {
              setIsAuthenticated(false);
              setSessionExpiredWarning(null);
            }}
            className="px-3 py-1 bg-white text-red-700 font-semibold rounded text-xs hover:bg-neutral-100 transition-colors uppercase tracking-wider cursor-pointer"
          >
            Sign In Again
          </button>
        </div>
      )}

      {/* Server Redeploy / Temporary Connection Warning Banner with Retry */}
      {serverConnectionWarning && (
        <div className="p-4 bg-amber-950/80 border border-amber-600/70 text-amber-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded shadow-md animate-fadeIn">
          <div className="flex items-center gap-2.5">
            <AlertTriangle size={16} className="text-amber-400 shrink-0" />
            <span>{serverConnectionWarning}</span>
          </div>
          <button
            type="button"
            onClick={() => {
              setServerConnectionWarning(null);
              checkAuthSession();
              refetchFromServer();
              showToast("Re-checking server connection...");
            }}
            className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white font-semibold rounded text-xs transition-colors self-start sm:self-auto shrink-0 cursor-pointer shadow-xs"
          >
            Retry Connection
          </button>
        </div>
      )}

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
                            const resequenced = updated.map((item, i) => ({
                              ...item,
                              sortOrder: i + 1,
                            }));
                            saveProjects(resequenced);
                            showToast(`Moved "${p.title}" up to position #${idx}. Click Save to persist.`);
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
                            const resequenced = updated.map((item, i) => ({
                              ...item,
                              sortOrder: i + 1,
                            }));
                            saveProjects(resequenced);
                            showToast(`Moved "${p.title}" down to position #${idx + 2}. Click Save to persist.`);
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
                        type="button"
                        onClick={() => handleSaveItem(p.id, p.title)}
                        disabled={savingEntityId === p.id}
                        className="px-2.5 py-1 text-xs bg-black text-white hover:bg-neutral-800 disabled:opacity-60 rounded transition-colors flex items-center gap-1 font-medium cursor-pointer shadow-2xs"
                        title={`Save "${p.title}" to Cloud Archive`}
                      >
                        {savingEntityId === p.id ? (
                          <>
                            <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
                            <span>Saving...</span>
                          </>
                        ) : (
                          <>
                            <Save size={12} />
                            <span>Save</span>
                          </>
                        )}
                      </button>
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
                      <AdminDraftInput
                        type="text"
                        value={p.title}
                        onCommit={(val) => {
                          const updated = projects.map((item, i) =>
                            i === idx ? { ...item, title: val } : item
                          );
                          saveProjects(updated);
                        }}
                        className="w-full p-2 border border-neutral-300 rounded text-xs focus:border-black focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-mono text-neutral-500 block mb-1">
                        Slug (URL)
                      </label>
                      <AdminDraftInput
                        type="text"
                        value={p.slug}
                        onCommit={(val) => {
                          const sanitizedSlug = val
                            .trim()
                            .toLowerCase()
                            .replace(/[\s_]+/g, "-")
                            .replace(/[^a-z0-9-]/g, "");
                          const finalSlug = sanitizedSlug || val;
                          const updated = projects.map((item, i) =>
                            i === idx ? { ...item, slug: finalSlug } : item
                          );
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
                          const val = e.target.value as any;
                          const updated = projects.map((item, i) =>
                            i === idx ? { ...item, category: val } : item
                          );
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
                          const val = e.target.value as any;
                          const updated = projects.map((item, i) =>
                            i === idx ? { ...item, status: val } : item
                          );
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
                          const val = e.target.value;
                          const updated = projects.map((item, i) =>
                            i === idx ? { ...item, mainImage: val } : item
                          );
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
                                const updated = projects.map((item, i) =>
                                  i === idx ? { ...item, mainImage: url } : item
                                );
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
                    <AdminDraftTextarea
                      rows={2}
                      value={p.description}
                      onCommit={(val) => {
                        const updated = projects.map((item, i) =>
                          i === idx ? { ...item, description: val } : item
                        );
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
                            const updated = projects.map((item, i) => {
                              if (i === idx) {
                                const copy = { ...item };
                                delete copy.testimonial;
                                return copy;
                              }
                              return item;
                            });
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
                            const updated = projects.map((item, i) =>
                              i === idx
                                ? {
                                    ...item,
                                    testimonial: {
                                      quote: `Working with Techno Architecture on ${p.title} was an extraordinary experience. Their obsession with light, craftsmanship, and spatial clarity exceeded our expectations.`,
                                      clientName: p.client && p.client !== "Confidential" && p.client !== "Private Client" ? p.client : "Homeowner",
                                      designation: "Client",
                                      company: p.title,
                                    },
                                  }
                                : item
                            );
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
                          <AdminDraftTextarea
                            rows={3}
                            value={p.testimonial.quote || ""}
                            onCommit={(val) => {
                              const updated = projects.map((item, i) =>
                                i === idx && item.testimonial
                                  ? { ...item, testimonial: { ...item.testimonial, quote: val } }
                                  : item
                              );
                              saveProjects(updated);
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
                            <AdminDraftInput
                              type="text"
                              value={p.testimonial.clientName || ""}
                              onCommit={(val) => {
                                const updated = projects.map((item, i) =>
                                  i === idx && item.testimonial
                                    ? { ...item, testimonial: { ...item.testimonial, clientName: val } }
                                    : item
                                );
                                saveProjects(updated);
                              }}
                              placeholder="e.g. Suresh & Anitha Gowda"
                              className="w-full p-2 border border-neutral-300 rounded text-xs bg-white focus:border-black focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="text-[10px] uppercase font-mono text-neutral-500 block mb-1">
                              Designation / Role
                            </label>
                            <AdminDraftInput
                              type="text"
                              value={p.testimonial.designation || ""}
                              onCommit={(val) => {
                                const updated = projects.map((item, i) =>
                                  i === idx && item.testimonial
                                    ? { ...item, testimonial: { ...item.testimonial, designation: val } }
                                    : item
                                );
                                saveProjects(updated);
                              }}
                              placeholder="e.g. Homeowner / Founder"
                              className="w-full p-2 border border-neutral-300 rounded text-xs bg-white focus:border-black focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="text-[10px] uppercase font-mono text-neutral-500 block mb-1">
                              Company / Residence
                            </label>
                            <AdminDraftInput
                              type="text"
                              value={p.testimonial.company || ""}
                              onCommit={(val) => {
                                const updated = projects.map((item, i) =>
                                  i === idx && item.testimonial
                                    ? { ...item, testimonial: { ...item.testimonial, company: val } }
                                    : item
                                );
                                saveProjects(updated);
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
                          <AdminDraftInput
                            type="text"
                            value={p.location}
                            onCommit={(val) => {
                              const updated = projects.map((item, i) =>
                                i === idx ? { ...item, location: val } : item
                              );
                              saveProjects(updated);
                            }}
                            className="w-full p-2 border border-neutral-300 rounded text-xs bg-white"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] uppercase font-mono text-neutral-500 block mb-1">
                            Year
                          </label>
                          <AdminDraftInput
                            type="number"
                            value={p.year}
                            onCommit={(val) => {
                              const intVal = parseInt(val) || 2024;
                              const updated = projects.map((item, i) =>
                                i === idx ? { ...item, year: intVal } : item
                              );
                              saveProjects(updated);
                            }}
                            className="w-full p-2 border border-neutral-300 rounded text-xs bg-white"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] uppercase font-mono text-neutral-500 block mb-1">
                            Built-Up Area
                          </label>
                          <AdminDraftInput
                            type="text"
                            value={p.area}
                            onCommit={(val) => {
                              const updated = projects.map((item, i) =>
                                i === idx ? { ...item, area: val } : item
                              );
                              saveProjects(updated);
                            }}
                            className="w-full p-2 border border-neutral-300 rounded text-xs bg-white"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] uppercase font-mono text-neutral-500 block mb-1">
                            Client
                          </label>
                          <AdminDraftInput
                            type="text"
                            value={p.client}
                            onCommit={(val) => {
                              const updated = projects.map((item, i) =>
                                i === idx ? { ...item, client: val } : item
                              );
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
                        <AdminDraftTextarea
                          rows={3}
                          value={p.processNarrative}
                          onCommit={(val) => {
                            const updated = projects.map((item, i) =>
                              i === idx ? { ...item, processNarrative: val } : item
                            );
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
                          <AdminDraftInput
                            type="text"
                            placeholder="Ar. Rajesh Shivaram"
                            value={p.credits?.principalArchitect || "Ar. Rajesh Shivaram"}
                            onCommit={(val) => {
                              saveProjects(projects.map((item, i) =>
                                i === idx ? { ...item, credits: { ...item.credits, principalArchitect: val } } : item
                              ));
                            }}
                            className="w-full p-2 border border-neutral-300 rounded text-xs bg-white"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] uppercase font-mono text-neutral-500 block mb-1">
                            Project Architect
                          </label>
                          <AdminDraftInput
                            type="text"
                            placeholder="e.g. Vikramaditya Shenoy"
                            value={p.credits?.projectArchitect || p.credits?.projectLead || ""}
                            onCommit={(val) => {
                              saveProjects(projects.map((item, i) =>
                                i === idx ? {
                                  ...item,
                                  credits: {
                                    ...item.credits,
                                    projectArchitect: val,
                                    projectLead: val,
                                  }
                                } : item
                              ));
                            }}
                            className="w-full p-2 border border-neutral-300 rounded text-xs bg-white"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] uppercase font-mono text-neutral-500 block mb-1">
                            Landscape Architect
                          </label>
                          <AdminDraftInput
                            type="text"
                            placeholder="e.g. Verdant Studio"
                            value={p.credits?.landscapeArchitect || ""}
                            onCommit={(val) => {
                              saveProjects(projects.map((item, i) =>
                                i === idx ? { ...item, credits: { ...item.credits, landscapeArchitect: val } } : item
                              ));
                            }}
                            className="w-full p-2 border border-neutral-300 rounded text-xs bg-white"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] uppercase font-mono text-neutral-500 block mb-1">
                            Photography Credit
                          </label>
                          <AdminDraftInput
                            type="text"
                            placeholder="e.g. Shamanth Patil Photography"
                            value={p.credits?.photography || ""}
                            onCommit={(val) => {
                              saveProjects(projects.map((item, i) =>
                                i === idx ? { ...item, credits: { ...item.credits, photography: val } } : item
                              ));
                            }}
                            className="w-full p-2 border border-neutral-300 rounded text-xs bg-white"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] uppercase font-mono text-neutral-500 block mb-1">
                            Team
                          </label>
                          <AdminDraftInput
                            type="text"
                            placeholder="e.g. Karthik Sundaram, Divya Raghavan"
                            value={p.credits?.team || ""}
                            onCommit={(val) => {
                              saveProjects(projects.map((item, i) =>
                                i === idx ? { ...item, credits: { ...item.credits, team: val } } : item
                              ));
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
                                  saveProjects(projects.map((item, i) =>
                                    i === idx ? { ...item, featured: e.target.checked } : item
                                  ));
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
                                  saveProjects(projects.map((item, i) => {
                                    if (i !== idx) return item;
                                    const copy = { ...item };
                                    delete copy.videoTour;
                                    return copy;
                                  }));
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
                                saveProjects(projects.map((item, i) =>
                                  i === idx ? {
                                    ...item,
                                    videoTour: {
                                      title: `${p.title} | Architectural House Tour`,
                                      url: "https://www.youtube.com/results?search_query=" + encodeURIComponent(p.title + " Techno Architecture House Tour"),
                                      platform: "YouTube",
                                      actionText: "Watch Video Tour →",
                                    }
                                  } : item
                                ));
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
                                    saveProjects(projects.map((item, i) =>
                                      i === idx && item.videoTour ? {
                                        ...item,
                                        videoTour: { ...item.videoTour, title: e.target.value }
                                      } : item
                                    ));
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
                                      saveProjects(projects.map((item, i) =>
                                        i === idx && item.videoTour ? {
                                          ...item,
                                          videoTour: { ...item.videoTour, url: e.target.value }
                                        } : item
                                      ));
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
                                            saveProjects(projects.map((item, i) =>
                                              i === idx && item.videoTour ? {
                                                ...item,
                                                videoTour: {
                                                  ...item.videoTour,
                                                  url,
                                                  platform: "Firebase Storage" as any,
                                                }
                                              } : item
                                            ));
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
                                      saveProjects(projects.map((item, i) =>
                                        i === idx && item.videoTour ? {
                                          ...item,
                                          videoTour: { ...item.videoTour, platform: e.target.value as any }
                                        } : item
                                      ));
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
                                      saveProjects(projects.map((item, i) =>
                                        i === idx && item.videoTour ? {
                                          ...item,
                                          videoTour: { ...item.videoTour, actionText: e.target.value }
                                        } : item
                                      ));
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
                                      const newImg: ProjectImage = {
                                        url,
                                        caption: file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "),
                                        aspect: "full",
                                      };
                                      saveProjects(projects.map((item, i) =>
                                        i === idx ? { ...item, gallery: [...(item.gallery || []), newImg] } : item
                                      ));
                                    });
                                  }
                                }}
                              />
                            </label>
                            <button
                              type="button"
                              onClick={() => {
                                const newImg: ProjectImage = {
                                  url: "/projects/aikya/elevation-evening.jpg",
                                  caption: "New interior photograph",
                                  aspect: "full",
                                };
                                const updated = projects.map((item, i) =>
                                  i === idx
                                    ? { ...item, gallery: [...(item.gallery || []), newImg] }
                                    : item
                                );
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
                                          const updated = projects.map((item, i) =>
                                            i === idx
                                              ? {
                                                  ...item,
                                                  gallery: (item.gallery || []).map((g, gi) =>
                                                    gi === gIdx ? { ...g, url } : g
                                                  ),
                                                }
                                              : item
                                          );
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
                                      const val = e.target.value;
                                      const updated = projects.map((item, i) =>
                                        i === idx
                                          ? {
                                              ...item,
                                              gallery: (item.gallery || []).map((g, gi) =>
                                                gi === gIdx ? { ...g, url: val } : g
                                              ),
                                            }
                                          : item
                                      );
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
                                            const updated = projects.map((item) => item.id === p.id ? { ...item, gallery: (item.gallery || []).map((g, gi) => gi === gIdx ? { ...g, url } : g) } : item);
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
                                    const val = e.target.value;
                                    const updated = projects.map((item, i) =>
                                      i === idx
                                        ? {
                                            ...item,
                                            gallery: (item.gallery || []).map((g, gi) =>
                                              gi === gIdx ? { ...g, caption: val } : g
                                            ),
                                          }
                                        : item
                                    );
                                    saveProjects(updated);
                                  }}
                                  placeholder="Photo caption"
                                  className="w-full p-1 border border-neutral-300 rounded text-[11px]"
                                />
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = projects.map((item, i) =>
                                    i === idx
                                      ? {
                                          ...item,
                                          gallery: (item.gallery || []).filter((_, gi) => gi !== gIdx),
                                        }
                                      : item
                                  );
                                  saveProjects(updated);
                                  showToast("Removed photo from gallery.");
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

                      {/* Project Card Bottom Save Bar */}
                      <div className="pt-4 border-t border-neutral-200 flex items-center justify-between">
                        <span className="text-[11px] font-mono text-neutral-400">
                          Editing Project: <strong className="text-neutral-700">{p.title}</strong>
                        </span>
                        <button
                          type="button"
                          onClick={() => handleSaveItem(p.id, p.title)}
                          disabled={savingEntityId === p.id}
                          className="inline-flex items-center gap-1.5 px-4 py-2 bg-black text-white hover:bg-neutral-800 disabled:opacity-60 text-xs font-semibold rounded transition-colors shadow-xs cursor-pointer"
                        >
                          {savingEntityId === p.id ? (
                            <>
                              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              <span>Saving to Cloud...</span>
                            </>
                          ) : (
                            <>
                              <Save size={13} />
                              <span>Save Project Changes</span>
                            </>
                          )}
                        </button>
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
                onClick={() => handleSaveItem("services-header", "Services Header Settings")}
                disabled={savingEntityId === "services-header"}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-black text-white text-xs uppercase tracking-wider font-medium hover:bg-neutral-800 disabled:opacity-60 transition-colors rounded self-start sm:self-auto cursor-pointer"
              >
                {savingEntityId === "services-header" ? (
                  <>
                    <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save size={12} />
                    <span>Save Header</span>
                  </>
                )}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="text-[10px] uppercase font-mono text-neutral-500 block mb-1">
                  Primary Page Topic / Heading
                </label>
                <AdminDraftInput
                  type="text"
                  value={siteSettings.servicesHeader?.title ?? "Services"}
                  onCommit={(val) => {
                    const currentHeader = siteSettings.servicesHeader || {
                      title: "Services",
                      subtitle: "PRACTICE DISCIPLINES & SCOPE",
                      description: "We provide integrated design services for new buildings and interior environments. Each appointment is structured around the project's scale, stage and specific requirements.",
                    };
                    saveSiteSettings({
                      ...siteSettings,
                      servicesHeader: { ...currentHeader, title: val },
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
                <AdminDraftInput
                  type="text"
                  value={siteSettings.servicesHeader?.subtitle ?? "PRACTICE DISCIPLINES & SCOPE"}
                  onCommit={(val) => {
                    const currentHeader = siteSettings.servicesHeader || {
                      title: "Services",
                      subtitle: "PRACTICE DISCIPLINES & SCOPE",
                      description: "We provide integrated design services for new buildings and interior environments. Each appointment is structured around the project's scale, stage and specific requirements.",
                    };
                    saveSiteSettings({
                      ...siteSettings,
                      servicesHeader: { ...currentHeader, subtitle: val },
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
                <AdminDraftTextarea
                  rows={2}
                  value={
                    siteSettings.servicesHeader?.description ??
                    "We provide integrated design services for new buildings and interior environments. Each appointment is structured around the project's scale, stage and specific requirements."
                  }
                  onCommit={(val) => {
                    const currentHeader = siteSettings.servicesHeader || {
                      title: "Services",
                      subtitle: "PRACTICE DISCIPLINES & SCOPE",
                      description: "We provide integrated design services for new buildings and interior environments. Each appointment is structured around the project's scale, stage and specific requirements.",
                    };
                    saveSiteSettings({
                      ...siteSettings,
                      servicesHeader: { ...currentHeader, description: val },
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
                    <AdminDraftInput
                      type="text"
                      value={s.title}
                      onCommit={(val) => {
                        const updated = services.map((item, i) =>
                          i === idx ? { ...item, title: val } : item
                        );
                        saveServices(updated);
                      }}
                      className="font-display text-base font-semibold text-neutral-900 border-b border-transparent hover:border-neutral-300 focus:border-black focus:outline-none px-1"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    {/* ORDER CONTROLS */}
                    <div className="inline-flex items-center border border-neutral-200 rounded overflow-hidden bg-white shadow-2xs mr-1">
                      <span className="text-[9px] font-mono uppercase px-1.5 text-neutral-400 font-semibold bg-neutral-50 border-r border-neutral-200 select-none">
                        ORDER
                      </span>
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => {
                          if (idx === 0) return;
                          const updated = [...services];
                          const temp = updated[idx];
                          updated[idx] = updated[idx - 1];
                          updated[idx - 1] = temp;
                          const resequenced = updated.map((item, i) => ({
                            ...item,
                            sortOrder: i + 1,
                          }));
                          saveServices(resequenced);
                          showToast(`Moved "${s.title}" up to position #${idx}. Click Save to persist.`);
                        }}
                        className="p-1 hover:bg-neutral-100 text-neutral-700 disabled:opacity-25 disabled:hover:bg-transparent transition-colors cursor-pointer disabled:cursor-not-allowed"
                        title="Move discipline UP"
                      >
                        <ArrowUp size={12} />
                      </button>
                      <span className="text-[10px] font-mono px-2 text-neutral-900 font-bold select-none border-x border-neutral-200 bg-neutral-50/50">
                        #{idx + 1}
                      </span>
                      <button
                        type="button"
                        disabled={idx === services.length - 1}
                        onClick={() => {
                          if (idx === services.length - 1) return;
                          const updated = [...services];
                          const temp = updated[idx];
                          updated[idx] = updated[idx + 1];
                          updated[idx + 1] = temp;
                          const resequenced = updated.map((item, i) => ({
                            ...item,
                            sortOrder: i + 1,
                          }));
                          saveServices(resequenced);
                          showToast(`Moved "${s.title}" down to position #${idx + 2}. Click Save to persist.`);
                        }}
                        className="p-1 hover:bg-neutral-100 text-neutral-700 disabled:opacity-25 disabled:hover:bg-transparent transition-colors cursor-pointer disabled:cursor-not-allowed"
                        title="Move discipline DOWN"
                      >
                        <ArrowDown size={12} />
                      </button>
                    </div>

                    <Link
                      href={`/services#${s.slug}`}
                      target="_blank"
                      className="text-neutral-500 hover:text-black text-xs font-mono px-2 py-1 border border-neutral-200 rounded"
                    >
                      View Live →
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleSaveItem(s.id, s.title)}
                      disabled={savingEntityId === s.id}
                      className="px-2.5 py-1 text-xs bg-black text-white hover:bg-neutral-800 disabled:opacity-60 rounded transition-colors flex items-center gap-1 font-medium cursor-pointer shadow-2xs"
                      title={`Save service "${s.title}"`}
                    >
                      {savingEntityId === s.id ? (
                        <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Save size={12} />
                      )}
                      <span>Save</span>
                    </button>
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
                    <AdminDraftInput
                      type="text"
                      value={s.slug}
                      onCommit={(val) => {
                        saveServices(services.map((item, i) => i === idx ? { ...item, slug: val } : item));
                      }}
                      className="w-full p-2 border border-neutral-300 rounded font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-mono text-neutral-500 block mb-1">
                      Cover Image (Upload from Laptop or URL)
                    </label>
                    <div className="flex gap-1.5 items-center">
                      <AdminDraftInput
                        type="text"
                        value={s.image}
                        onCommit={(val) => {
                          saveServices(services.map((item, i) => i === idx ? { ...item, image: val } : item));
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
                                saveServices(services.map((item, i) => i === idx ? { ...item, image: url } : item));
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
                  <AdminDraftInput
                    type="text"
                    value={s.shortDescription}
                    onCommit={(val) => {
                      saveServices(services.map((item, i) => i === idx ? { ...item, shortDescription: val } : item));
                    }}
                    className="w-full p-2 border border-neutral-300 rounded text-xs"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-mono text-neutral-500 block mb-1">
                    Detailed Scope Description
                  </label>
                  <AdminDraftTextarea
                    rows={3}
                    value={s.detailedDescription}
                    onCommit={(val) => {
                      saveServices(services.map((item, i) => i === idx ? { ...item, detailedDescription: val } : item));
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
                        saveServices(services.map((item, i) =>
                          i === idx ? { ...item, deliverables: [...(item.deliverables || []), "New deliverable scope item"] } : item
                        ));
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
                            saveServices(services.map((item, i) => {
                              if (i !== idx) return item;
                              const deliverables = [...(item.deliverables || [])];
                              deliverables[dIdx] = e.target.value;
                              return { ...item, deliverables };
                            }));
                          }}
                          className="flex-1 bg-transparent text-xs focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            saveServices(services.map((item, i) => {
                              if (i !== idx) return item;
                              return {
                                ...item,
                                deliverables: (item.deliverables || []).filter((_, dI) => dI !== dIdx),
                              };
                            }));
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
                        const nextStepNum = String((s.process?.length || 0) + 1).padStart(2, "0");
                        const newStep = {
                          step: nextStepNum,
                          title: `New Phase ${nextStepNum}`,
                          description: "Comprehensive deliverables, technical drawings, and coordination protocols.",
                        };
                        saveServices(services.map((item, i) =>
                          i === idx ? { ...item, process: [...(item.process || []), newStep] } : item
                        ));
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
                                saveServices(services.map((item, i) => {
                                  if (i !== idx) return item;
                                  const process = (item.process || []).map((p, pI) =>
                                    pI === pIdx ? { ...p, step: e.target.value } : p
                                  );
                                  return { ...item, process };
                                }));
                              }}
                              className="w-14 p-1 border border-neutral-300 rounded font-mono text-xs bg-white text-center font-bold"
                              placeholder="01"
                            />
                            <input
                              type="text"
                              value={phase.title}
                              onChange={(e) => {
                                saveServices(services.map((item, i) => {
                                  if (i !== idx) return item;
                                  const process = (item.process || []).map((p, pI) =>
                                    pI === pIdx ? { ...p, title: e.target.value } : p
                                  );
                                  return { ...item, process };
                                }));
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
                                  saveServices(services.map((item, i) => {
                                    if (i !== idx) return item;
                                    const process = [...(item.process || [])];
                                    const temp = process[pIdx - 1];
                                    process[pIdx - 1] = process[pIdx];
                                    process[pIdx] = temp;
                                    return { ...item, process };
                                  }));
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
                                  saveServices(services.map((item, i) => {
                                    if (i !== idx) return item;
                                    const process = [...(item.process || [])];
                                    const temp = process[pIdx + 1];
                                    process[pIdx + 1] = process[pIdx];
                                    process[pIdx] = temp;
                                    return { ...item, process };
                                  }));
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
                                  saveServices(services.map((item, i) => {
                                    if (i !== idx) return item;
                                    return {
                                      ...item,
                                      process: (item.process || []).filter((_, pI) => pI !== pIdx),
                                    };
                                  }));
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
                            saveServices(services.map((item, i) => {
                              if (i !== idx) return item;
                              const process = (item.process || []).map((p, pI) =>
                                pI === pIdx ? { ...p, description: e.target.value } : p
                              );
                              return { ...item, process };
                            }));
                          }}
                          placeholder="Phase deliverables, milestones, and scope summary"
                          className="w-full p-2 border border-neutral-300 rounded text-xs bg-white leading-relaxed"
                        />
                      </div>
                    ))}
                  </div>

                  {/* Service Card Bottom Save Bar */}
                  <div className="pt-3 border-t border-neutral-200 flex items-center justify-between">
                    <span className="text-[11px] font-mono text-neutral-400">0{idx + 1} · {s.title}</span>
                    <button
                      type="button"
                      onClick={() => handleSaveItem(s.id, s.title)}
                      disabled={savingEntityId === s.id}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-black text-white hover:bg-neutral-800 disabled:opacity-60 text-xs font-semibold rounded transition-colors cursor-pointer"
                    >
                      {savingEntityId === s.id ? (
                        <>
                          <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
                          <span>Saving...</span>
                        </>
                      ) : (
                        <>
                          <Save size={13} />
                          <span>Save Service</span>
                        </>
                      )}
                    </button>
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
                        const resequenced = updated.map((item, i) => ({
                          ...item,
                          sortOrder: i + 1,
                        }));
                        saveTeam(resequenced);
                        showToast(`Moved "${m.name}" up to position #${idx}. Click Save to persist.`);
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
                        const resequenced = updated.map((item, i) => ({
                          ...item,
                          sortOrder: i + 1,
                        }));
                        saveTeam(resequenced);
                        showToast(`Moved "${m.name}" down to position #${idx + 2}. Click Save to persist.`);
                      }}
                      className="p-1 hover:bg-neutral-100 text-neutral-700 disabled:opacity-25 disabled:hover:bg-transparent transition-colors cursor-pointer disabled:cursor-not-allowed"
                      title="Move practitioner DOWN"
                    >
                      <ArrowDown size={12} />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleSaveItem(m.id, m.name)}
                    disabled={savingEntityId === m.id}
                    className="px-2 py-1 text-xs bg-black text-white hover:bg-neutral-800 disabled:opacity-60 rounded transition-colors flex items-center gap-1 font-medium cursor-pointer shadow-2xs"
                    title={`Save practitioner "${m.name}"`}
                  >
                    {savingEntityId === m.id ? (
                      <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Save size={11} />
                    )}
                    <span>Save</span>
                  </button>
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
                              const updated = team.map((item) =>
                                item.id === m.id ? { ...item, image: url } : item
                              );
                              saveTeam(updated);
                            }, "team");
                          }
                          e.target.value = "";
                        }}
                      />
                    </label>
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <div>
                      <label className="text-[9px] uppercase font-mono text-neutral-400 block mb-0.5">
                        Practitioner Full Name
                      </label>
                      <AdminDraftInput
                        type="text"
                        value={m.name || ""}
                        placeholder="e.g. Ar. Rajesh Shivaram"
                        onCommit={(val) => {
                          const updated = team.map((item) =>
                            item.id === m.id ? { ...item, name: val } : item
                          );
                          saveTeam(updated);
                        }}
                        className="w-full font-semibold text-xs border border-neutral-300 rounded p-1.5 focus:border-black focus:outline-none bg-white text-neutral-900"
                      />
                    </div>
                  </div>
                </div>

                {/* Designation & Discipline Selectors with Dual Dropdown + Custom Input */}
                {(() => {
                  const currentRole = (m.role || "").trim();
                  const matchedRole = STANDARD_TEAM_ROLES.find(
                    (r) => r.toLowerCase() === currentRole.toLowerCase()
                  );
                  const selectRoleValue = matchedRole || currentRole || "";

                  const currentDisc = (m.discipline || "").trim();
                  const matchedDisc = STANDARD_TEAM_DISCIPLINES.find(
                    (d) => d.toLowerCase() === currentDisc.toLowerCase()
                  );
                  const selectDiscValue = matchedDisc || currentDisc || "Architecture";

                  return (
                    <>
                      <div className="space-y-1">
                        <div className="flex justify-between items-center">
                          <label className="text-[9px] uppercase font-mono text-neutral-500 font-semibold block">
                            Designation / Role
                          </label>
                          <span className="text-[8px] font-mono text-neutral-400 uppercase">Dropdown + Custom</span>
                        </div>
                        <select
                          value={selectRoleValue}
                          onChange={(e) => {
                            const selected = e.target.value;
                            if (selected === "__custom__") {
                              const inputEl = document.getElementById(`role-input-${m.id}`) as HTMLInputElement;
                              if (inputEl) {
                                inputEl.focus();
                                inputEl.select();
                              }
                              return;
                            }
                            if (selected) {
                              const updated = team.map((item) =>
                                item.id === m.id ? { ...item, role: selected } : item
                              );
                              saveTeam(updated);
                            }
                          }}
                          className="w-full p-1.5 border border-neutral-300 rounded text-xs bg-white focus:border-black focus:outline-none cursor-pointer font-medium text-neutral-800"
                        >
                          <option value="" disabled>-- Select Designation --</option>
                          {STANDARD_TEAM_ROLES.map((role) => (
                            <option key={role} value={role}>{role}</option>
                          ))}
                          {!matchedRole && currentRole && (
                            <option value={currentRole}>{currentRole} (Current)</option>
                          )}
                          <option value="__custom__">+ Custom / Type your own below...</option>
                        </select>
                        <input
                          id={`role-input-${m.id}`}
                          type="text"
                          value={m.role || ""}
                          placeholder="Type or customize designation..."
                          onChange={(e) => {
                            const val = e.target.value;
                            const updated = team.map((item) =>
                              item.id === m.id ? { ...item, role: val } : item
                            );
                            saveTeam(updated);
                          }}
                          className="w-full text-xs text-neutral-800 p-1.5 border border-neutral-200 rounded focus:border-black focus:outline-none bg-neutral-50/50 font-medium"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <div className="flex justify-between items-center mb-0.5">
                            <label className="text-[9px] uppercase font-mono text-neutral-500 font-semibold block">Discipline</label>
                            <span className="text-[8px] font-mono text-neutral-400 uppercase">Dropdown + Custom</span>
                          </div>
                          <select
                            value={selectDiscValue}
                            onChange={(e) => {
                              const selected = e.target.value;
                              if (selected === "__custom__") {
                                const inputEl = document.getElementById(`disc-input-${m.id}`) as HTMLInputElement;
                                if (inputEl) {
                                inputEl.focus();
                                inputEl.select();
                              }
                              return;
                            }
                            if (selected) {
                              const updated = team.map((item) =>
                                item.id === m.id ? { ...item, discipline: selected } : item
                              );
                              saveTeam(updated);
                            }
                          }}
                          className="w-full p-1.5 border border-neutral-300 rounded text-xs bg-white focus:border-black focus:outline-none cursor-pointer font-medium text-neutral-800 mb-1"
                        >
                          <option value="" disabled>-- Select Discipline --</option>
                          {STANDARD_TEAM_DISCIPLINES.map((disc) => (
                            <option key={disc} value={disc}>{disc}</option>
                          ))}
                          {!matchedDisc && currentDisc && (
                            <option value={currentDisc}>{currentDisc} (Current)</option>
                          )}
                          <option value="__custom__">+ Custom / Type your own below...</option>
                        </select>
                        <AdminDraftInput
                          id={`disc-input-${m.id}`}
                          type="text"
                          value={m.discipline || ""}
                          placeholder="Type custom discipline..."
                          onCommit={(val) => {
                            const updated = team.map((item) =>
                              item.id === m.id ? { ...item, discipline: val } : item
                            );
                            saveTeam(updated);
                          }}
                          className="w-full text-xs text-neutral-800 p-1 border border-neutral-200 rounded focus:border-black focus:outline-none bg-neutral-50/50 font-medium"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] uppercase font-mono text-neutral-500 font-semibold block mb-0.5">Credentials</label>
                        <AdminDraftInput
                          type="text"
                          value={m.credentials || ""}
                          placeholder="e.g. B.Arch, COA"
                          onCommit={(val) => {
                            const updated = team.map((item) =>
                              item.id === m.id ? { ...item, credentials: val } : item
                            );
                            saveTeam(updated);
                          }}
                          className="w-full p-1.5 border border-neutral-300 rounded text-xs bg-white focus:border-black focus:outline-none"
                        />
                      </div>
                      </div>
                    </>
                  );
                })()}

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
                      value={m.image || ""}
                      onChange={(e) => {
                        const updated = team.map((item) =>
                          item.id === m.id ? { ...item, image: e.target.value } : item
                        );
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
                              const updated = team.map((item) =>
                                item.id === m.id ? { ...item, image: url } : item
                              );
                              saveTeam(updated);
                            }, "team");
                          }
                          e.target.value = "";
                        }}
                      />
                    </label>
                  </div>
                  <div className="flex items-center justify-between mt-1 text-[9px] text-neutral-400">
                    <span>Saved to Studio Cloud Archive</span>
                    {m.image && (
                      <button
                        type="button"
                        onClick={() => {
                          const updated = team.map((item) =>
                            item.id === m.id ? { ...item, image: "" } : item
                          );
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
                  <AdminDraftTextarea
                    rows={3}
                    value={m.bio || ""}
                    onCommit={(val) => {
                      const updated = team.map((item) =>
                        item.id === m.id ? { ...item, bio: val } : item
                      );
                      saveTeam(updated);
                    }}
                    className="w-full p-2 border border-neutral-300 rounded text-xs leading-relaxed"
                  />
                </div>

                {/* Team Card Bottom Save Bar */}
                <div className="pt-2 flex items-center justify-between border-t border-neutral-100">
                  <span className="text-[10px] font-mono text-neutral-500 font-medium">{m.discipline || "Architecture"} · #{m.sortOrder || idx + 1}</span>
                  <button
                    type="button"
                    onClick={() => handleSaveItem(m.id, m.name)}
                    disabled={savingEntityId === m.id}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-black text-white hover:bg-neutral-800 disabled:opacity-60 text-xs font-semibold rounded transition-colors cursor-pointer"
                  >
                    {savingEntityId === m.id ? (
                      <>
                        <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Save size={12} />
                        <span>Save Member</span>
                      </>
                    )}
                  </button>
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
                      type="button"
                      onClick={() => handleSaveItem(b.id, b.title)}
                      disabled={savingEntityId === b.id}
                      className="px-2.5 py-0.5 text-xs bg-black text-white hover:bg-neutral-800 disabled:opacity-60 rounded transition-colors flex items-center gap-1 font-medium cursor-pointer shadow-2xs"
                      title={`Save monograph "${b.title}"`}
                    >
                      {savingEntityId === b.id ? (
                        <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Save size={11} />
                      )}
                      <span>Save</span>
                    </button>
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
                    <AdminDraftInput
                      type="text"
                      value={b.title}
                      onCommit={(val) => {
                        saveBlog(blog.map((item, i) => i === idx ? { ...item, title: val } : item));
                      }}
                      className="w-full p-2 border border-neutral-300 rounded font-medium"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-mono text-neutral-500 block mb-1">Slug</label>
                    <AdminDraftInput
                      type="text"
                      value={b.slug}
                      onCommit={(val) => {
                        saveBlog(blog.map((item, i) => i === idx ? { ...item, slug: val } : item));
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
                    saveBlog(blog.map((item, i) => {
                      if (i !== idx) return item;
                      return {
                        ...item,
                        ...(newUrl !== undefined ? { heroImage: newUrl } : {}),
                        imagePositionX: positionX,
                        imagePositionY: positionY,
                        imageScale: scale,
                      };
                    }));
                  }}
                  onToast={showToast}
                />

                <div>
                  <label className="text-[10px] uppercase font-mono text-neutral-500 block mb-1">Excerpt</label>
                  <AdminDraftTextarea
                    rows={2}
                    value={b.excerpt}
                    onCommit={(val) => {
                      saveBlog(blog.map((item, i) => i === idx ? { ...item, excerpt: val } : item));
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
                        saveBlog(blog.map((item, i) => i === idx ? { ...item, category: e.target.value as any } : item));
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
                        saveBlog(blog.map((item, i) => i === idx ? { ...item, featured: e.target.checked } : item));
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
                        <AdminDraftTextarea
                          rows={3}
                          value={b.content?.introduction || ""}
                          onCommit={(val) => {
                            saveBlog(blog.map((item, i) => {
                              if (i !== idx) return item;
                              const content = item.content || { introduction: "", sections: [], conclusion: "" };
                              return { ...item, content: { ...content, introduction: val } };
                            }));
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
                              saveBlog(blog.map((item, i) => {
                                if (i !== idx) return item;
                                const content = item.content || { introduction: "", sections: [], conclusion: "" };
                                const sections = [...(content.sections || []), {
                                  heading: "New Section",
                                  body: ["Write section paragraph here..."],
                                }];
                                return { ...item, content: { ...content, sections } };
                              }));
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
                                  saveBlog(blog.map((item, i) => {
                                    if (i !== idx) return item;
                                    const content = item.content || { introduction: "", sections: [], conclusion: "" };
                                    const sections = (content.sections || []).filter((_, i2) => i2 !== sIdx);
                                    return { ...item, content: { ...content, sections } };
                                  }));
                                  showToast("Section removed.");
                                }}
                                className="text-neutral-400 hover:text-red-500 p-0.5"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>

                            <AdminDraftInput
                              type="text"
                              value={sec.heading}
                              placeholder="Section Heading"
                              onCommit={(val) => {
                                saveBlog(blog.map((item, i) => {
                                  if (i !== idx) return item;
                                  const content = item.content || { introduction: "", sections: [], conclusion: "" };
                                  const sections = (content.sections || []).map((secItem, sI) =>
                                    sI === sIdx ? { ...secItem, heading: val } : secItem
                                  );
                                  return { ...item, content: { ...content, sections } };
                                }));
                              }}
                              className="w-full p-1.5 border border-neutral-300 rounded text-xs font-medium"
                            />

                            <AdminDraftTextarea
                              rows={3}
                              value={sec.body?.join("\n\n") || ""}
                              placeholder="Paragraph text (separate paragraphs with blank line)"
                              onCommit={(val) => {
                                const newBody = val.split("\n\n");
                                saveBlog(blog.map((item, i) => {
                                  if (i !== idx) return item;
                                  const content = item.content || { introduction: "", sections: [], conclusion: "" };
                                  const sections = (content.sections || []).map((secItem, sI) =>
                                    sI === sIdx ? { ...secItem, body: newBody } : secItem
                                  );
                                  return { ...item, content: { ...content, sections } };
                                }));
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
                                saveBlog(blog.map((item, i) => {
                                  if (i !== idx) return item;
                                  const content = item.content || { introduction: "", sections: [], conclusion: "" };
                                  const sections = (content.sections || []).map((secItem, sI) => {
                                    if (sI !== sIdx) return secItem;
                                    return {
                                      ...secItem,
                                      ...(newSecImg !== undefined ? { image: newSecImg } : {}),
                                      imagePositionX: positionX,
                                      imagePositionY: positionY,
                                    };
                                  });
                                  return { ...item, content: { ...content, sections } };
                                }));
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
                        <AdminDraftTextarea
                          rows={2}
                          value={b.content?.conclusion || ""}
                          onCommit={(val) => {
                            saveBlog(blog.map((item, i) => {
                              if (i !== idx) return item;
                              const content = item.content || { introduction: "", sections: [], conclusion: "" };
                              return { ...item, content: { ...content, conclusion: val } };
                            }));
                          }}
                          className="w-full p-2 border border-neutral-300 rounded text-xs bg-white"
                        />
                      </div>

                      {/* Monograph Card Bottom Save Bar */}
                      <div className="pt-3 border-t border-neutral-200 flex items-center justify-between">
                        <span className="text-[11px] font-mono text-neutral-400">
                          Monograph: <strong className="text-neutral-700">{b.title}</strong>
                        </span>
                        <button
                          type="button"
                          onClick={() => handleSaveItem(b.id, b.title)}
                          disabled={savingEntityId === b.id}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-black text-white hover:bg-neutral-800 disabled:opacity-60 text-xs font-semibold rounded transition-colors cursor-pointer"
                        >
                          {savingEntityId === b.id ? (
                            <>
                              <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
                              <span>Saving...</span>
                            </>
                          ) : (
                            <>
                              <Save size={13} />
                              <span>Save Post Changes</span>
                            </>
                          )}
                        </button>
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
                    <AdminDraftInput
                      type="text"
                      value={item.question}
                      onCommit={(val) => {
                        const updated = faq.map((f, i) =>
                          i === idx ? { ...f, question: val } : f
                        );
                        saveFaq(updated);
                      }}
                      className="w-full p-1 font-semibold text-neutral-900 border-b border-transparent hover:border-neutral-300 focus:border-black focus:outline-none"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    {/* ORDER CONTROLS */}
                    <div className="inline-flex items-center border border-neutral-200 rounded overflow-hidden bg-white shadow-2xs mr-1">
                      <span className="text-[9px] font-mono uppercase px-1.5 text-neutral-400 font-semibold bg-neutral-50 border-r border-neutral-200 select-none">
                        ORDER
                      </span>
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => {
                          if (idx === 0) return;
                          const updated = [...faq];
                          const temp = updated[idx];
                          updated[idx] = updated[idx - 1];
                          updated[idx - 1] = temp;
                          const resequenced = updated.map((f, i) => ({
                            ...f,
                            sortOrder: i + 1,
                          }));
                          saveFaq(resequenced);
                          showToast(`Moved FAQ up to position #${idx}. Click Save to persist.`);
                        }}
                        className="p-1 hover:bg-neutral-100 text-neutral-700 disabled:opacity-25 disabled:hover:bg-transparent transition-colors cursor-pointer disabled:cursor-not-allowed"
                        title="Move FAQ UP"
                      >
                        <ArrowUp size={12} />
                      </button>
                      <span className="text-[10px] font-mono px-2 text-neutral-900 font-bold select-none border-x border-neutral-200 bg-neutral-50/50">
                        #{idx + 1}
                      </span>
                      <button
                        type="button"
                        disabled={idx === faq.length - 1}
                        onClick={() => {
                          if (idx === faq.length - 1) return;
                          const updated = [...faq];
                          const temp = updated[idx];
                          updated[idx] = updated[idx + 1];
                          updated[idx + 1] = temp;
                          const resequenced = updated.map((f, i) => ({
                            ...f,
                            sortOrder: i + 1,
                          }));
                          saveFaq(resequenced);
                          showToast(`Moved FAQ down to position #${idx + 2}. Click Save to persist.`);
                        }}
                        className="p-1 hover:bg-neutral-100 text-neutral-700 disabled:opacity-25 disabled:hover:bg-transparent transition-colors cursor-pointer disabled:cursor-not-allowed"
                        title="Move FAQ DOWN"
                      >
                        <ArrowDown size={12} />
                      </button>
                    </div>

                    <select
                      value={item.category}
                      onChange={(e) => {
                        const updated = faq.map((f, i) =>
                          i === idx ? { ...f, category: e.target.value as any } : f
                        );
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
                      type="button"
                      onClick={() => handleSaveItem(item.id, `FAQ Q${idx + 1}`)}
                      disabled={savingEntityId === item.id}
                      className="px-2 py-1 text-xs bg-black text-white hover:bg-neutral-800 disabled:opacity-60 rounded transition-colors flex items-center gap-1 font-medium shrink-0 cursor-pointer shadow-2xs"
                      title="Save this FAQ to Cloud"
                    >
                      {savingEntityId === item.id ? (
                        <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Save size={11} />
                      )}
                      <span>Save</span>
                    </button>
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
                <AdminDraftTextarea
                  rows={3}
                  value={item.answer}
                  onCommit={(val) => {
                    saveFaq(faq.map((f, i) => i === idx ? { ...f, answer: val } : f));
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
                      saveGallery(gallery.map((item, i) => i === idx ? { ...item, title: e.target.value } : item));
                    }}
                    className="w-full p-1.5 border border-neutral-300 rounded font-semibold text-xs"
                    placeholder="Photo title"
                  />
                  <input
                    type="text"
                    value={g.caption}
                    onChange={(e) => {
                      saveGallery(gallery.map((item, i) => i === idx ? { ...item, caption: e.target.value } : item));
                    }}
                    className="w-full p-1.5 border border-neutral-300 rounded text-xs"
                    placeholder="Caption"
                  />
                  <div className="flex gap-1.5 items-center">
                    <input
                      type="text"
                      value={g.imageUrl}
                      onChange={(e) => {
                        saveGallery(gallery.map((item, i) => i === idx ? { ...item, imageUrl: e.target.value } : item));
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
                              saveGallery(gallery.map((item, i) => i === idx ? { ...item, imageUrl: url } : item));
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
                      saveGallery(gallery.map((item, i) => i === idx ? { ...item, category: e.target.value as any } : item));
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
                      saveGallery(gallery.map((item, i) => i === idx ? { ...item, projectTitle: e.target.value } : item));
                    }}
                    placeholder="Associated Project"
                    className="p-1 border border-neutral-300 rounded text-[10px]"
                  />
                </div>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => handleSaveItem(g.id, g.title || "Gallery Photo")}
                    disabled={savingEntityId === g.id}
                    className="w-full inline-flex items-center justify-center gap-1.5 py-1.5 bg-black text-white hover:bg-neutral-800 disabled:opacity-60 text-[11px] font-semibold rounded transition-colors cursor-pointer shadow-2xs"
                    title="Save this photo to Cloud"
                  >
                    {savingEntityId === g.id ? (
                      <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Save size={11} />
                    )}
                    <span>Save Photo</span>
                  </button>
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
                  <div className="flex items-center space-x-2">
                    {/* ORDER CONTROLS */}
                    <div className="inline-flex items-center border border-neutral-200 rounded overflow-hidden bg-white shadow-2xs mr-1">
                      <span className="text-[9px] font-mono uppercase px-1.5 text-neutral-400 font-semibold bg-neutral-50 border-r border-neutral-200 select-none">
                        ORDER
                      </span>
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => {
                          if (idx === 0) return;
                          const updated = [...recognitions];
                          const temp = updated[idx];
                          updated[idx] = updated[idx - 1];
                          updated[idx - 1] = temp;
                          const resequenced = updated.map((item, i) => ({
                            ...item,
                            sortOrder: i + 1,
                          }));
                          saveRecognitions(resequenced);
                          showToast(`Moved "${r.title}" up to position #${idx}. Click Save to persist.`);
                        }}
                        className="p-1 hover:bg-neutral-100 text-neutral-700 disabled:opacity-25 disabled:hover:bg-transparent transition-colors cursor-pointer disabled:cursor-not-allowed"
                        title="Move citation UP"
                      >
                        <ArrowUp size={12} />
                      </button>
                      <span className="text-[10px] font-mono px-2 text-neutral-900 font-bold select-none border-x border-neutral-200 bg-neutral-50/50">
                        #{idx + 1}
                      </span>
                      <button
                        type="button"
                        disabled={idx === recognitions.length - 1}
                        onClick={() => {
                          if (idx === recognitions.length - 1) return;
                          const updated = [...recognitions];
                          const temp = updated[idx];
                          updated[idx] = updated[idx + 1];
                          updated[idx + 1] = temp;
                          const resequenced = updated.map((item, i) => ({
                            ...item,
                            sortOrder: i + 1,
                          }));
                          saveRecognitions(resequenced);
                          showToast(`Moved "${r.title}" down to position #${idx + 2}. Click Save to persist.`);
                        }}
                        className="p-1 hover:bg-neutral-100 text-neutral-700 disabled:opacity-25 disabled:hover:bg-transparent transition-colors cursor-pointer disabled:cursor-not-allowed"
                        title="Move citation DOWN"
                      >
                        <ArrowDown size={12} />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleSaveItem(r.id, r.title)}
                      disabled={savingEntityId === r.id}
                      className="px-2.5 py-1 text-xs bg-black text-white hover:bg-neutral-800 disabled:opacity-60 rounded transition-colors flex items-center gap-1 font-medium cursor-pointer shadow-2xs"
                      title="Save this recognition citation to Cloud"
                    >
                      {savingEntityId === r.id ? (
                        <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Save size={11} />
                      )}
                      <span>Save</span>
                    </button>
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
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="text-[10px] uppercase font-mono text-neutral-400 block mb-0.5">Award / Citation Title</label>
                    <input
                      type="text"
                      value={r.title}
                      onChange={(e) => {
                        const updated = recognitions.map((item, i) =>
                          i === idx ? { ...item, title: e.target.value } : item
                        );
                        saveRecognitions(updated);
                      }}
                      className="w-full p-1.5 border border-neutral-300 rounded font-semibold text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-mono text-neutral-400 block mb-0.5">Conferred By (Organization)</label>
                    <input
                      type="text"
                      value={r.organization}
                      onChange={(e) => {
                        const updated = recognitions.map((item, i) =>
                          i === idx ? { ...item, organization: e.target.value } : item
                        );
                        saveRecognitions(updated);
                      }}
                      className="w-full p-1.5 border border-neutral-300 rounded text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 border-t border-neutral-100">
                  <div>
                    <label className="text-[10px] uppercase font-mono text-neutral-400 block mb-0.5">Year</label>
                    <input
                      type="number"
                      value={r.year || 2024}
                      onChange={(e) => {
                        const updated = recognitions.map((item, i) =>
                          i === idx ? { ...item, year: parseInt(e.target.value) || 2024 } : item
                        );
                        saveRecognitions(updated);
                      }}
                      className="w-full p-1.5 border border-neutral-300 rounded text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-mono text-neutral-400 block mb-0.5">Category</label>
                    <select
                      value={r.category || "Award"}
                      onChange={(e) => {
                        const updated = recognitions.map((item, i) =>
                          i === idx ? { ...item, category: e.target.value as any } : item
                        );
                        saveRecognitions(updated);
                      }}
                      className="w-full p-1.5 border border-neutral-300 rounded text-xs bg-white focus:border-black focus:outline-none cursor-pointer"
                    >
                      <option value="Award">Award</option>
                      <option value="Publication">Publication</option>
                      <option value="Certification">Certification</option>
                      <option value="Biennale / Exhibition">Biennale / Exhibition</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-mono text-neutral-400 block mb-0.5">Badge / Honor</label>
                    <input
                      type="text"
                      value={r.badge || ""}
                      placeholder="e.g. Gold Medalist"
                      onChange={(e) => {
                        const updated = recognitions.map((item, i) =>
                          i === idx ? { ...item, badge: e.target.value } : item
                        );
                        saveRecognitions(updated);
                      }}
                      className="w-full p-1.5 border border-neutral-300 rounded text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-mono text-neutral-400 block mb-0.5">Associated Project</label>
                    <input
                      type="text"
                      value={r.projectAssociated || ""}
                      placeholder="e.g. AIKYA"
                      onChange={(e) => {
                        const updated = recognitions.map((item, i) =>
                          i === idx ? { ...item, projectAssociated: e.target.value } : item
                        );
                        saveRecognitions(updated);
                      }}
                      className="w-full p-1.5 border border-neutral-300 rounded text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] uppercase font-mono text-neutral-400 block mb-0.5">Award Summary & Citation</label>
                  <textarea
                    rows={2}
                    value={r.description}
                    onChange={(e) => {
                      const updated = recognitions.map((item, i) =>
                        i === idx ? { ...item, description: e.target.value } : item
                      );
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
                  <div className="flex items-center space-x-2">
                    {/* ORDER CONTROLS */}
                    <div className="inline-flex items-center border border-neutral-200 rounded overflow-hidden bg-white shadow-2xs mr-1">
                      <span className="text-[9px] font-mono uppercase px-1.5 text-neutral-400 font-semibold bg-neutral-50 border-r border-neutral-200 select-none">
                        ORDER
                      </span>
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => {
                          if (idx === 0) return;
                          const updated = [...testimonials];
                          const temp = updated[idx];
                          updated[idx] = updated[idx - 1];
                          updated[idx - 1] = temp;
                          const resequenced = updated.map((item, i) => ({
                            ...item,
                            sortOrder: i + 1,
                          }));
                          saveTestimonials(resequenced);
                          showToast(`Moved "${t.clientName}" up to position #${idx}. Click Save to persist.`);
                        }}
                        className="p-1 hover:bg-neutral-100 text-neutral-700 disabled:opacity-25 disabled:hover:bg-transparent transition-colors cursor-pointer disabled:cursor-not-allowed"
                        title="Move testimonial UP"
                      >
                        <ArrowUp size={12} />
                      </button>
                      <span className="text-[10px] font-mono px-2 text-neutral-900 font-bold select-none border-x border-neutral-200 bg-neutral-50/50">
                        #{idx + 1}
                      </span>
                      <button
                        type="button"
                        disabled={idx === testimonials.length - 1}
                        onClick={() => {
                          if (idx === testimonials.length - 1) return;
                          const updated = [...testimonials];
                          const temp = updated[idx];
                          updated[idx] = updated[idx + 1];
                          updated[idx + 1] = temp;
                          const resequenced = updated.map((item, i) => ({
                            ...item,
                            sortOrder: i + 1,
                          }));
                          saveTestimonials(resequenced);
                          showToast(`Moved "${t.clientName}" down to position #${idx + 2}. Click Save to persist.`);
                        }}
                        className="p-1 hover:bg-neutral-100 text-neutral-700 disabled:opacity-25 disabled:hover:bg-transparent transition-colors cursor-pointer disabled:cursor-not-allowed"
                        title="Move testimonial DOWN"
                      >
                        <ArrowDown size={12} />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleSaveItem(t.id, t.clientName)}
                      disabled={savingEntityId === t.id}
                      className="px-2.5 py-1 text-xs bg-black text-white hover:bg-neutral-800 disabled:opacity-60 rounded transition-colors flex items-center gap-1 font-medium cursor-pointer shadow-2xs"
                      title="Save this testimonial to Cloud"
                    >
                      {savingEntityId === t.id ? (
                        <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Save size={11} />
                      )}
                      <span>Save</span>
                    </button>
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
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div>
                    <label className="text-[10px] uppercase font-mono text-neutral-400 block mb-0.5">Client Name</label>
                    <AdminDraftInput
                      type="text"
                      value={t.clientName}
                      onCommit={(val) => {
                        const updated = testimonials.map((item, i) =>
                          i === idx ? { ...item, clientName: val } : item
                        );
                        saveTestimonials(updated);
                      }}
                      className="w-full p-1.5 border border-neutral-300 rounded font-medium text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-mono text-neutral-400 block mb-0.5">Designation</label>
                    <AdminDraftInput
                      type="text"
                      value={t.designation}
                      placeholder="e.g. Homeowner / Founder"
                      onCommit={(val) => {
                        const updated = testimonials.map((item, i) =>
                          i === idx ? { ...item, designation: val } : item
                        );
                        saveTestimonials(updated);
                      }}
                      className="w-full p-1.5 border border-neutral-300 rounded text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-mono text-neutral-400 block mb-0.5">Company / Residence</label>
                    <AdminDraftInput
                      type="text"
                      value={t.company || ""}
                      placeholder="e.g. Private Residence"
                      onCommit={(val) => {
                        const updated = testimonials.map((item, i) =>
                          i === idx ? { ...item, company: val } : item
                        );
                        saveTestimonials(updated);
                      }}
                      className="w-full p-1.5 border border-neutral-300 rounded text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-mono text-neutral-400 block mb-0.5">Associated Project</label>
                    <AdminDraftInput
                      type="text"
                      value={t.projectAssociated}
                      placeholder="e.g. AIKYA"
                      onCommit={(val) => {
                        const updated = testimonials.map((item, i) =>
                          i === idx ? { ...item, projectAssociated: val } : item
                        );
                        saveTestimonials(updated);
                      }}
                      className="w-full p-1.5 border border-neutral-300 rounded text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] uppercase font-mono text-neutral-400 block mb-0.5">Client Quote</label>
                  <AdminDraftTextarea
                    rows={3}
                    value={t.quote}
                    onCommit={(val) => {
                      const updated = testimonials.map((item, i) =>
                        i === idx ? { ...item, quote: val } : item
                      );
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
              onClick={() => handleSaveItem("settings-top", "Studio Settings")}
              disabled={savingEntityId === "settings-top"}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-black text-white text-xs uppercase tracking-wider font-medium hover:bg-neutral-800 disabled:opacity-60 transition-colors rounded shadow-sm cursor-pointer"
            >
              {savingEntityId === "settings-top" ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save size={13} />
                  <span>Save Settings</span>
                </>
              )}
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
                <AdminDraftInput
                  type="text"
                  value={siteSettings.name}
                  onCommit={(val) => {
                    saveSiteSettings({ ...siteSettings, name: val });
                  }}
                  className="w-full p-2 border border-neutral-300 rounded text-xs bg-white"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-mono text-neutral-500 block mb-1">
                  Tagline
                </label>
                <AdminDraftInput
                  type="text"
                  value={siteSettings.tagline}
                  onCommit={(val) => {
                    saveSiteSettings({ ...siteSettings, tagline: val });
                  }}
                  className="w-full p-2 border border-neutral-300 rounded text-xs bg-white"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-mono text-neutral-500 block mb-1">
                  Founded Year
                </label>
                <AdminDraftInput
                  type="number"
                  value={siteSettings.foundedYear}
                  onCommit={(val) => {
                    saveSiteSettings({ ...siteSettings, foundedYear: parseInt(val) || 2006 });
                  }}
                  className="w-full p-2 border border-neutral-300 rounded text-xs bg-white"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-mono text-neutral-500 block mb-1">
                  Business Hours
                </label>
                <AdminDraftInput
                  type="text"
                  value={siteSettings.operatingHours}
                  onCommit={(val) => {
                    saveSiteSettings({ ...siteSettings, operatingHours: val });
                  }}
                  className="w-full p-2 border border-neutral-300 rounded text-xs bg-white"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-[10px] uppercase font-mono text-neutral-500 block mb-1">
                  Sitewide Short Statement (Footer Copy)
                </label>
                <AdminDraftInput
                  type="text"
                  value={siteSettings.shortDescription}
                  onCommit={(val) => {
                    saveSiteSettings({ ...siteSettings, shortDescription: val });
                  }}
                  className="w-full p-2 border border-neutral-300 rounded text-xs bg-white"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-[10px] uppercase font-mono text-neutral-500 block mb-1">
                  Long Introduction Statement (Homepage & About)
                </label>
                <AdminDraftTextarea
                  rows={3}
                  value={siteSettings.longDescription}
                  onCommit={(val) => {
                    saveSiteSettings({ ...siteSettings, longDescription: val });
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
                <AdminDraftInput
                  type="email"
                  value={siteSettings.contact.email}
                  onCommit={(val) => {
                    saveSiteSettings({
                      ...siteSettings,
                      contact: { ...siteSettings.contact, email: val },
                    });
                  }}
                  className="w-full p-2 border border-neutral-300 rounded text-xs bg-white"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-mono text-neutral-500 block mb-1">
                  Direct Office Phone
                </label>
                <AdminDraftInput
                  type="text"
                  value={siteSettings.contact.phone}
                  onCommit={(val) => {
                    saveSiteSettings({
                      ...siteSettings,
                      contact: { ...siteSettings.contact, phone: val },
                    });
                  }}
                  className="w-full p-2 border border-neutral-300 rounded text-xs bg-white"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-mono text-neutral-500 block mb-1">
                  Office No BSNL Landline
                </label>
                <AdminDraftInput
                  type="text"
                  value={siteSettings.contact.phoneBsnl || ""}
                  onCommit={(val) => {
                    saveSiteSettings({
                      ...siteSettings,
                      contact: { ...siteSettings.contact, phoneBsnl: val },
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
                      const updated = (siteSettings.studios || []).map((s, i) =>
                        i === sIdx ? { ...s, city: e.target.value } : s
                      );
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
                      const updated = (siteSettings.studios || []).map((s, i) =>
                        i === sIdx ? { ...s, address: e.target.value } : s
                      );
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
              onClick={() => handleSaveItem("settings-bottom", "All Studio Settings")}
              disabled={savingEntityId === "settings-bottom"}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-black text-white text-xs uppercase tracking-widest font-medium hover:bg-neutral-800 disabled:opacity-60 transition-colors rounded shadow cursor-pointer"
            >
              {savingEntityId === "settings-bottom" ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save size={14} />
                  <span>Save & Publish All Settings</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* LEADS / ENQUIRIES CRM TAB                                  */}
      {/* ========================================================= */}
      {activeTab === "leads" && (
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-900 flex items-center gap-2">
                <Inbox size={16} className="text-emerald-600" />
                Enquiry Leads CRM & Studio Pipeline ({leads.length})
              </h2>
              <p className="text-xs text-neutral-500 mt-1">
                Full-featured CRM for architectural enquiries, intake tracking, and studio follow-ups.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setShowAddLeadModal(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 text-white text-xs uppercase tracking-wider font-semibold rounded hover:bg-emerald-700 transition-colors shadow-sm"
              >
                <Plus size={13} />
                <span>Add Lead</span>
              </button>
              <button
                type="button"
                onClick={handleExportLeadsCsv}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-neutral-900 text-white text-xs uppercase tracking-wider font-semibold rounded hover:bg-neutral-800 transition-colors shadow-sm"
              >
                <FileSpreadsheet size={13} className="text-emerald-400" />
                <span>Export CSV</span>
              </button>
              <button
                type="button"
                onClick={fetchLeads}
                disabled={leadsLoading}
                className="flex items-center gap-1.5 px-3 py-2 bg-neutral-100 text-neutral-700 text-xs uppercase tracking-wider rounded hover:bg-neutral-200 disabled:opacity-50 transition-colors border border-neutral-300"
              >
                <RefreshCw size={12} className={leadsLoading ? "animate-spin" : ""} />
                <span>{leadsLoading ? "Syncing..." : "Refresh"}</span>
              </button>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between bg-white p-3 border border-neutral-200 rounded-lg shadow-sm">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="Search leads by name, email, phone, company, service or message..."
                value={leadsSearchQuery}
                onChange={(e) => setLeadsSearchQuery(e.target.value)}
                className="w-full pl-9 pr-8 py-2 text-xs border border-neutral-200 rounded focus:outline-none focus:border-black bg-neutral-50/50"
              />
              {leadsSearchQuery && (
                <button
                  type="button"
                  onClick={() => setLeadsSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700"
                >
                  <X size={13} />
                </button>
              )}
            </div>

            {/* Status Filter Tabs */}
            <div className="flex gap-1.5 flex-wrap">
              {(["all", "new", "reviewed", "archived"] as const).map((f) => {
                const count =
                  f === "all"
                    ? leads.length
                    : leads.filter((l) => l.status === f).length;
                return (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setLeadsFilter(f)}
                    className={cn(
                      "px-3 py-1.5 text-[11px] uppercase tracking-wider rounded font-medium transition-colors",
                      leadsFilter === f
                        ? f === "new"
                          ? "bg-emerald-600 text-white shadow-sm"
                          : f === "archived"
                          ? "bg-neutral-700 text-white shadow-sm"
                          : "bg-black text-white shadow-sm"
                        : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                    )}
                  >
                    {f} ({count})
                  </button>
                );
              })}
            </div>
          </div>

          {/* Error state */}
          {leadsError && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2 text-xs text-red-700">
              <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
              <span>{leadsError}</span>
            </div>
          )}

          {/* Empty / Loading state */}
          {leadsLoading && (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-neutral-400">
              <RefreshCw size={24} className="animate-spin text-neutral-700" />
              <span className="text-xs uppercase tracking-widest font-mono">Syncing CRM records from cloud store...</span>
            </div>
          )}

          {!leadsLoading && !leadsError && leads.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-neutral-400 border border-dashed border-neutral-300 rounded-lg bg-neutral-50/50">
              <Inbox size={32} strokeWidth={1} />
              <span className="text-xs uppercase tracking-widest font-semibold text-neutral-700">No enquiry leads yet</span>
              <span className="text-[11px] text-neutral-500">Submissions from the website contact form or manual entries will appear here.</span>
              <button
                type="button"
                onClick={() => setShowAddLeadModal(true)}
                className="mt-2 px-3 py-1.5 bg-black text-white text-xs uppercase tracking-wider rounded hover:bg-neutral-800"
              >
                + Create First Lead
              </button>
            </div>
          )}

          {/* Filtered Leads List */}
          {!leadsLoading && (() => {
            const query = leadsSearchQuery.toLowerCase().trim();
            const filtered = leads.filter((lead) => {
              const matchesFilter = leadsFilter === "all" || lead.status === leadsFilter;
              if (!matchesFilter) return false;
              if (!query) return true;
              return (
                (lead.fullName || "").toLowerCase().includes(query) ||
                (lead.email || "").toLowerCase().includes(query) ||
                (lead.phone || "").toLowerCase().includes(query) ||
                (lead.company || "").toLowerCase().includes(query) ||
                (lead.service || "").toLowerCase().includes(query) ||
                (lead.budget || "").toLowerCase().includes(query) ||
                (lead.message || "").toLowerCase().includes(query) ||
                (lead.notes || "").toLowerCase().includes(query)
              );
            });

            if (filtered.length === 0 && leads.length > 0) {
              return (
                <div className="py-12 text-center text-xs text-neutral-500 border border-dashed border-neutral-200 rounded-lg">
                  No leads matching search query &quot;{leadsSearchQuery}&quot; under &quot;{leadsFilter}&quot; filter.
                  <button
                    type="button"
                    onClick={() => {
                      setLeadsSearchQuery("");
                      setLeadsFilter("all");
                    }}
                    className="block mx-auto mt-2 text-neutral-900 underline font-semibold"
                  >
                    Clear Filters
                  </button>
                </div>
              );
            }

            return (
              <div className="space-y-3">
                {filtered.map((lead) => {
                  const isExpanded = expandedLeadId === lead.id;
                  const statusColors: Record<string, string> = {
                    new: "bg-emerald-50 text-emerald-700 border-emerald-200",
                    reviewed: "bg-blue-50 text-blue-700 border-blue-200",
                    archived: "bg-neutral-100 text-neutral-600 border-neutral-300",
                  };
                  const statusIcons: Record<string, React.ReactNode> = {
                    new: <Clock size={10} />,
                    reviewed: <CheckCheck size={10} />,
                    archived: <Archive size={10} />,
                  };

                  const cleanDigits = (lead.phone || "").replace(/\D/g, "");
                  const whatsappPhone = cleanDigits.length === 10 ? `91${cleanDigits}` : cleanDigits;

                  const handleCopyDetails = (e: React.MouseEvent) => {
                    e.stopPropagation();
                    const text = `*Techno Architecture Lead Details*\nName: ${lead.fullName}\nEmail: ${lead.email}\nPhone: ${lead.phone}\nCompany: ${lead.company}\nService: ${lead.service}\nBudget: ${lead.budget}\nMessage:\n${lead.message}\nReceived: ${lead.createdAt}`;
                    navigator.clipboard.writeText(text);
                    showToast("Lead details copied to clipboard 📋");
                  };

                  return (
                    <div
                      key={lead.id}
                      className={cn(
                        "border rounded-lg overflow-hidden transition-all duration-200 bg-white",
                        lead.status === "new" ? "border-emerald-200 shadow-sm" : "border-neutral-200",
                        isExpanded ? "ring-1 ring-neutral-300" : ""
                      )}
                    >
                      {/* Lead Row Header */}
                      <div
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 cursor-pointer hover:bg-neutral-50/70 transition-colors"
                        onClick={() => setExpandedLeadId(isExpanded ? null : lead.id)}
                      >
                        <div className="flex items-start gap-3 min-w-0 flex-1">
                          {/* Status Badge */}
                          <span
                            className={cn(
                              "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] uppercase font-bold tracking-wider border flex-shrink-0 mt-0.5",
                              statusColors[lead.status] || statusColors.new
                            )}
                          >
                            {statusIcons[lead.status]}
                            {lead.status}
                          </span>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-bold text-xs text-neutral-900 truncate">
                                {lead.fullName || "—"}
                              </span>
                              {lead.company && lead.company !== "Not provided" && (
                                <span className="text-[10px] px-1.5 py-0.5 bg-neutral-100 text-neutral-600 rounded font-medium">
                                  {lead.company}
                                </span>
                              )}
                              {lead.notes && (
                                <span className="text-[9px] px-1.5 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded font-semibold uppercase">
                                  Has Notes
                                </span>
                              )}
                            </div>

                            <div className="text-[11px] text-neutral-500 mt-1 flex flex-wrap gap-x-4 gap-y-1 items-center">
                              {lead.email && lead.email !== "Not provided" && (
                                <a
                                  href={`mailto:${lead.email}`}
                                  onClick={(e) => e.stopPropagation()}
                                  className="flex items-center gap-1 hover:text-black transition-colors"
                                  title="Send email"
                                >
                                  <Mail size={10} className="text-neutral-400" /> {lead.email}
                                </a>
                              )}
                              {lead.phone && lead.phone !== "Not provided" && (
                                <a
                                  href={`tel:${lead.phone}`}
                                  onClick={(e) => e.stopPropagation()}
                                  className="flex items-center gap-1 hover:text-black transition-colors font-mono"
                                  title="Click to call"
                                >
                                  <Phone size={10} className="text-neutral-400" /> {lead.phone}
                                </a>
                              )}
                              {whatsappPhone && whatsappPhone.length >= 10 && (
                                <a
                                  href={`https://wa.me/${whatsappPhone}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={(e) => e.stopPropagation()}
                                  className="flex items-center gap-1 text-emerald-700 hover:text-emerald-800 font-semibold text-[10px] bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200"
                                  title="Chat on WhatsApp"
                                >
                                  <MessageCircle size={10} /> WhatsApp
                                </a>
                              )}
                              {lead.service && lead.service !== "General Architecture & Design Enquiry" && (
                                <span className="text-neutral-400 text-[10px]">{lead.service}</span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Right header controls */}
                        <div className="flex items-center gap-2 flex-shrink-0 self-end sm:self-center">
                          {lead.createdAt && (
                            <span className="text-[10px] text-neutral-400 font-mono hidden md:block">
                              {(() => {
                                try {
                                  const d = new Date(lead.createdAt);
                                  return isNaN(d.getTime())
                                    ? "—"
                                    : d.toLocaleDateString("en-IN", {
                                        day: "2-digit",
                                        month: "short",
                                        year: "numeric",
                                      });
                                } catch {
                                  return "—";
                                }
                              })()}
                            </span>
                          )}

                          <button
                            type="button"
                            onClick={handleCopyDetails}
                            title="Copy lead details"
                            className="p-1.5 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded transition-colors"
                          >
                            <Copy size={12} />
                          </button>

                          <button
                            type="button"
                            onClick={(e) => handleDeleteLead(lead.id, e)}
                            disabled={deletingLeadId === lead.id}
                            title="Delete lead permanently"
                            className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                          >
                            <Trash2 size={12} className={deletingLeadId === lead.id ? "animate-spin" : ""} />
                          </button>

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
                        <div className="px-4 pb-4 border-t border-neutral-100 space-y-4 pt-4 bg-neutral-50/30">
                          {/* Meta Grid */}
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-white p-3 rounded-lg border border-neutral-100">
                            <div>
                              <span className="text-[9px] uppercase font-mono text-neutral-400 block mb-0.5">Company</span>
                              <span className="text-neutral-800 font-medium">{lead.company || "—"}</span>
                            </div>
                            <div>
                              <span className="text-[9px] uppercase font-mono text-neutral-400 block mb-0.5">Budget</span>
                              <span className="text-neutral-800 font-medium">{lead.budget || "Not specified"}</span>
                            </div>
                            <div>
                              <span className="text-[9px] uppercase font-mono text-neutral-400 block mb-0.5">Service Interest</span>
                              <span className="text-neutral-800 font-medium">{lead.service || "—"}</span>
                            </div>
                            <div>
                              <span className="text-[9px] uppercase font-mono text-neutral-400 block mb-0.5">Received At</span>
                              <span className="text-neutral-800 font-mono text-[11px]">
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

                          {/* Client Message */}
                          <div>
                            <span className="text-[9px] uppercase font-mono text-neutral-400 block mb-1">Client Enquiry Message</span>
                            <div className="p-3 bg-white border border-neutral-200 rounded text-xs text-neutral-700 leading-relaxed whitespace-pre-wrap font-sans">
                              {lead.message || "No message body provided."}
                            </div>
                          </div>

                          {/* Internal Studio Follow-up Notes */}
                          <div className="p-3 bg-amber-50/60 border border-amber-200 rounded-lg">
                            <div className="flex justify-between items-center mb-1.5">
                              <span className="text-[10px] uppercase font-bold text-amber-800 tracking-wider flex items-center gap-1.5">
                                📝 Studio Internal Notes & Follow-up Log
                              </span>
                              {editingNoteLeadId !== lead.id && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingNoteLeadId(lead.id);
                                    setLeadNoteInput(lead.notes || "");
                                  }}
                                  className="text-[10px] text-amber-900 underline font-semibold hover:text-black"
                                >
                                  {lead.notes ? "Edit Note" : "+ Add Note"}
                                </button>
                              )}
                            </div>

                            {editingNoteLeadId === lead.id ? (
                              <div className="space-y-2 mt-2">
                                <textarea
                                  value={leadNoteInput}
                                  onChange={(e) => setLeadNoteInput(e.target.value)}
                                  placeholder="E.g., Called Ar. Rajesh regarding 1200 sqft layout. Scheduled in-person studio consultation for next Tuesday."
                                  rows={3}
                                  className="w-full p-2 text-xs border border-amber-300 rounded focus:outline-none focus:border-amber-600 bg-white"
                                />
                                <div className="flex gap-2 justify-end">
                                  <button
                                    type="button"
                                    onClick={() => setEditingNoteLeadId(null)}
                                    className="px-2.5 py-1 text-[11px] bg-neutral-100 text-neutral-600 rounded hover:bg-neutral-200"
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleSaveLeadNote(lead.id)}
                                    disabled={savingNote}
                                    className="px-3 py-1 text-[11px] bg-neutral-900 text-white rounded hover:bg-black font-semibold disabled:opacity-50"
                                  >
                                    {savingNote ? "Saving..." : "Save Note"}
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="text-xs text-neutral-700 italic">
                                {lead.notes ? (
                                  lead.notes
                                ) : (
                                  <span className="text-neutral-400 not-italic text-[11px]">
                                    No internal notes yet. Click &quot;+ Add Note&quot; to log consultation outcomes or next steps.
                                  </span>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Action Footer */}
                          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-neutral-200">
                            <span className="text-[10px] uppercase font-mono text-neutral-500">Status:</span>
                            {lead.status !== "new" && (
                              <button
                                type="button"
                                onClick={() => updateLeadStatus(lead.id, "new")}
                                className="flex items-center gap-1 px-3 py-1 text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 rounded hover:bg-emerald-100 transition-colors uppercase tracking-wider font-semibold"
                              >
                                <Clock size={10} /> Mark New
                              </button>
                            )}
                            {lead.status !== "reviewed" && (
                              <button
                                type="button"
                                onClick={() => updateLeadStatus(lead.id, "reviewed")}
                                className="flex items-center gap-1 px-3 py-1 text-[10px] bg-blue-50 text-blue-700 border border-blue-200 rounded hover:bg-blue-100 transition-colors uppercase tracking-wider font-semibold"
                              >
                                <CheckCheck size={10} /> Mark Reviewed
                              </button>
                            )}
                            {lead.status !== "archived" && (
                              <button
                                type="button"
                                onClick={() => updateLeadStatus(lead.id, "archived")}
                                className="flex items-center gap-1 px-3 py-1 text-[10px] bg-neutral-100 text-neutral-600 border border-neutral-300 rounded hover:bg-neutral-200 transition-colors uppercase tracking-wider font-semibold"
                              >
                                <Archive size={10} /> Archive
                              </button>
                            )}

                            <div className="ml-auto flex items-center gap-2">
                              {lead.phone && lead.phone !== "Not provided" && (
                                <a
                                  href={`tel:${lead.phone}`}
                                  className="flex items-center gap-1 px-3 py-1 text-[10px] bg-neutral-100 text-neutral-800 border border-neutral-300 rounded hover:bg-neutral-200 transition-colors uppercase tracking-wider font-semibold"
                                >
                                  <Phone size={10} /> Call Client
                                </a>
                              )}
                              <a
                                href={`mailto:${lead.email}?subject=Re: Your Architectural Enquiry — Techno Architecture&body=Dear ${lead.fullName},%0A%0AThank you for reaching out to Techno Architecture.`}
                                className="flex items-center gap-1 px-3 py-1 text-[10px] bg-black text-white rounded hover:bg-neutral-800 transition-colors uppercase tracking-wider font-semibold"
                              >
                                <Mail size={10} /> Reply via Email
                              </a>
                              <button
                                type="button"
                                onClick={(e) => handleDeleteLead(lead.id, e)}
                                disabled={deletingLeadId === lead.id}
                                className="flex items-center gap-1 px-2.5 py-1 text-[10px] text-red-600 hover:bg-red-50 rounded border border-transparent hover:border-red-200 uppercase tracking-wider font-semibold transition-colors"
                              >
                                <Trash2 size={10} /> Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })()}

          {/* Add Manual Lead Modal */}
          {showAddLeadModal && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white rounded-xl shadow-2xl border border-neutral-200 max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-neutral-100">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900 flex items-center gap-2">
                    <Plus size={16} className="text-emerald-600" />
                    Record New Enquiry Lead (Manual Intake)
                  </h3>
                  <button
                    type="button"
                    onClick={() => setShowAddLeadModal(false)}
                    className="text-neutral-400 hover:text-neutral-700"
                  >
                    <X size={16} />
                  </button>
                </div>

                <form onSubmit={handleCreateManualLead} className="space-y-3.5">
                  <div>
                    <label className="block text-[10px] uppercase font-mono text-neutral-500 mb-1">
                      Client Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., Rajesh Mehta"
                      value={newLeadForm.fullName}
                      onChange={(e) => setNewLeadForm({ ...newLeadForm, fullName: e.target.value })}
                      className="w-full p-2 text-xs border border-neutral-300 rounded focus:outline-none focus:border-black"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] uppercase font-mono text-neutral-500 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        placeholder="client@example.com"
                        value={newLeadForm.email}
                        onChange={(e) => setNewLeadForm({ ...newLeadForm, email: e.target.value })}
                        className="w-full p-2 text-xs border border-neutral-300 rounded focus:outline-none focus:border-black"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-mono text-neutral-500 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={newLeadForm.phone}
                        onChange={(e) => setNewLeadForm({ ...newLeadForm, phone: e.target.value })}
                        className="w-full p-2 text-xs border border-neutral-300 rounded focus:outline-none focus:border-black"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] uppercase font-mono text-neutral-500 mb-1">
                        Company / Organization
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., Residential or Developer Corp"
                        value={newLeadForm.company}
                        onChange={(e) => setNewLeadForm({ ...newLeadForm, company: e.target.value })}
                        className="w-full p-2 text-xs border border-neutral-300 rounded focus:outline-none focus:border-black"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-mono text-neutral-500 mb-1">
                        Estimated Budget
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., ₹1.5 Cr — ₹2 Cr"
                        value={newLeadForm.budget}
                        onChange={(e) => setNewLeadForm({ ...newLeadForm, budget: e.target.value })}
                        className="w-full p-2 text-xs border border-neutral-300 rounded focus:outline-none focus:border-black"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] uppercase font-mono text-neutral-500 mb-1">
                        Service Requested
                      </label>
                      <select
                        value={newLeadForm.service}
                        onChange={(e) => setNewLeadForm({ ...newLeadForm, service: e.target.value })}
                        className="w-full p-2 text-xs border border-neutral-300 rounded focus:outline-none focus:border-black bg-white"
                      >
                        <option value="General Architecture & Design Enquiry">General Architecture &amp; Design</option>
                        <option value="Residential Architecture & Villa Design">Residential Architecture &amp; Villa Design</option>
                        <option value="Commercial & Office Architecture">Commercial &amp; Office Architecture</option>
                        <option value="Hospitality & Resort Design">Hospitality &amp; Resort Design</option>
                        <option value="Interior Architecture & Space Planning">Interior Architecture &amp; Space Planning</option>
                        <option value="Sustainable Architecture & Consultation">Sustainable Architecture &amp; Consultation</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-mono text-neutral-500 mb-1">
                        Initial Lead Status
                      </label>
                      <select
                        value={newLeadForm.status}
                        onChange={(e) => setNewLeadForm({ ...newLeadForm, status: e.target.value as any })}
                        className="w-full p-2 text-xs border border-neutral-300 rounded focus:outline-none focus:border-black bg-white"
                      >
                        <option value="new">New (Needs Follow-up)</option>
                        <option value="reviewed">Reviewed (In Discussion)</option>
                        <option value="archived">Archived</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-mono text-neutral-500 mb-1">
                      Enquiry Requirements / Notes
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Details discussed during phone call or studio walk-in..."
                      value={newLeadForm.message}
                      onChange={(e) => setNewLeadForm({ ...newLeadForm, message: e.target.value })}
                      className="w-full p-2 text-xs border border-neutral-300 rounded focus:outline-none focus:border-black font-sans"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-mono text-neutral-500 mb-1">
                      Internal Studio Notes (Private)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Referred by Ar. Rajesh, wants proposal by Friday"
                      value={newLeadForm.notes}
                      onChange={(e) => setNewLeadForm({ ...newLeadForm, notes: e.target.value })}
                      className="w-full p-2 text-xs border border-neutral-300 rounded focus:outline-none focus:border-black"
                    />
                  </div>

                  <div className="flex gap-2 justify-end pt-3 border-t border-neutral-100">
                    <button
                      type="button"
                      onClick={() => setShowAddLeadModal(false)}
                      className="px-4 py-2 text-xs bg-neutral-100 text-neutral-700 rounded hover:bg-neutral-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmittingManualLead}
                      className="px-5 py-2 text-xs bg-emerald-600 text-white font-semibold rounded hover:bg-emerald-700 disabled:opacity-50 transition-colors uppercase tracking-wider"
                    >
                      {isSubmittingManualLead ? "Saving Lead..." : "Save Lead to CRM"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
      </div>
    </div>
  );
}
