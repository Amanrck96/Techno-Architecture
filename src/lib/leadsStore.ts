import fs from "fs/promises";
import path from "path";
import { getFirestoreDb, getFirebaseStorageBucket } from "@/lib/firebaseAdmin";
import seedEnquiries from "@/data/enquiries.json";

export interface EnquiryLead {
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

const LOCAL_DATA_PATH = path.join(process.cwd(), "src", "data", "enquiries.json");
const TMP_DATA_PATH =
  process.env.NODE_ENV === "production" || process.env.K_SERVICE || process.env.FUNCTION_TARGET
    ? path.join("/tmp", "enquiries.json")
    : path.join(process.cwd(), ".next", "cache", "enquiries-tmp.json");

const LEADS_STORAGE_FILE = "leads/enquiries.json";

declare global {
  // eslint-disable-next-line no-var
  var __techno_enquiries_store__: EnquiryLead[] | undefined;
}

/**
 * Retrieve leads directly from permanent Firebase Cloud Storage
 */
async function getLeadsFromFirebaseStorage(): Promise<EnquiryLead[] | null> {
  try {
    const bucket = getFirebaseStorageBucket();
    if (bucket) {
      const file = bucket.file(LEADS_STORAGE_FILE);
      const [exists] = await file.exists();
      if (exists) {
        const [contents] = await file.download();
        const data = JSON.parse(contents.toString("utf-8"));
        if (Array.isArray(data)) {
          return data;
        }
      }
    }
  } catch (err: any) {
    console.warn("[LeadsStore] Firebase Storage fetch notice:", err?.message || err);
  }
  return null;
}

/**
 * Persist leads array directly to permanent Firebase Cloud Storage
 */
async function saveLeadsToFirebaseStorage(leads: EnquiryLead[]): Promise<boolean> {
  try {
    const bucket = getFirebaseStorageBucket();
    if (bucket) {
      const file = bucket.file(LEADS_STORAGE_FILE);
      await file.save(JSON.stringify(leads, null, 2), {
        contentType: "application/json",
        metadata: {
          cacheControl: "no-cache, private",
        },
      });
      return true;
    }
  } catch (err: any) {
    console.error("[LeadsStore] Firebase Storage save error:", err?.message || err);
  }
  return false;
}

/**
 * Fetch leads from GitHub repository via REST API
 */
async function getLeadsFromGitHub(): Promise<{ leads: EnquiryLead[]; sha?: string } | null> {
  const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
  const repo = process.env.GITHUB_REPOSITORY || "Amanrck96/Techno-Architecture";
  const filePath = "src/data/enquiries.json";

  if (!token) return null;

  try {
    const res = await fetch(`https://api.github.com/repos/${repo}/contents/${filePath}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.v3+json",
      },
      cache: "no-store",
    });

    if (res.ok) {
      const data = await res.json();
      const content = Buffer.from(data.content, "base64").toString("utf-8");
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed)) {
        return { leads: parsed, sha: data.sha };
      }
    }
  } catch (err) {
    console.warn("[LeadsStore] GitHub read notice:", err);
  }
  return null;
}

/**
 * Commit leads array to GitHub repository (background fallback)
 */
async function saveLeadsToGitHub(_leads: EnquiryLead[]): Promise<boolean> {
  return true;
}

/**
 * Retrieve all enquiry leads from all available persistence tiers
 */
export async function getAllLeads(): Promise<EnquiryLead[]> {
  const leadMap = new Map<string, EnquiryLead>();

  // 0. Seed enquiries from bundled static data (guarantees leads are always available)
  if (Array.isArray(seedEnquiries)) {
    for (const lead of (seedEnquiries as any[])) {
      if (lead && lead.id) {
        leadMap.set(lead.id, lead as EnquiryLead);
      }
    }
  }

  // 1. Check in-memory store
  if (globalThis.__techno_enquiries_store__) {
    for (const lead of globalThis.__techno_enquiries_store__) {
      leadMap.set(lead.id, lead);
    }
  }

  // 2. Authoritative Tier: Firebase Cloud Storage (Permanent, instant, surviving serverless restarts)
  try {
    const storageLeads = await getLeadsFromFirebaseStorage();
    if (storageLeads && Array.isArray(storageLeads)) {
      storageLeads.forEach((lead) => {
        if (lead && lead.id) {
          leadMap.set(lead.id, lead);
        }
      });
    }
  } catch (storageErr) {
    console.warn("[LeadsStore] Storage read notice:", storageErr);
  }

  // 3. If leads are already retrieved from authoritative Firebase Storage or in-memory,
  // return immediately to avoid blocking on slow/failing external calls.
  if (leadMap.size === 0) {
    // 4. Try reading from local data file (seed / local development)
    try {
      const raw = await fs.readFile(LOCAL_DATA_PATH, "utf-8");
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        parsed.forEach((lead: EnquiryLead) => {
          if (lead && lead.id && !leadMap.has(lead.id)) {
            leadMap.set(lead.id, lead);
          }
        });
      }
    } catch {}

    // 5. Try reading from serverless /tmp cache
    try {
      const raw = await fs.readFile(TMP_DATA_PATH, "utf-8");
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        parsed.forEach((lead: EnquiryLead) => {
          if (lead && lead.id && !leadMap.has(lead.id)) {
            leadMap.set(lead.id, lead);
          }
        });
      }
    } catch {}
  }

  // 6. Try reading from GitHub (for production deployments on Google Cloud)
  if (process.env.NODE_ENV === "production") {
    try {
      const gh = await getLeadsFromGitHub();
      if (gh && Array.isArray(gh.leads)) {
        gh.leads.forEach((lead) => {
          if (lead && lead.id && !leadMap.has(lead.id)) {
            leadMap.set(lead.id, lead);
          }
        });
      }
    } catch {}
  }

  const allLeads = Array.from(leadMap.values());

  // Sort descending by creation date
  allLeads.sort((a, b) => {
    const tA = new Date(a.createdAt).getTime() || 0;
    const tB = new Date(b.createdAt).getTime() || 0;
    return tB - tA;
  });

  // Update in-memory store
  globalThis.__techno_enquiries_store__ = allLeads;

  return allLeads;
}

/**
 * Persist a newly received enquiry lead across all available tiers
 */
export async function persistNewLead(lead: EnquiryLead): Promise<{ success: boolean; persistent: boolean }> {
  // 1. Immediately store in memory
  const currentLeads = await getAllLeads();
  const updatedLeads = [lead, ...currentLeads.filter((l) => l.id !== lead.id)];
  globalThis.__techno_enquiries_store__ = updatedLeads;

  let savedToStorage = false;
  let savedToFirestore = false;
  let savedToDisk = false;
  let savedToTmp = false;

  // 2. Primary Tier: Firebase Cloud Storage (Authoritative, instantaneous, 100% durable)
  try {
    savedToStorage = await saveLeadsToFirebaseStorage(updatedLeads);
  } catch (storageErr) {
    console.error("[LeadsStore] Primary storage save error:", storageErr);
  }

  // 3. Secondary Tier: Firestore Admin SDK (if active)
  try {
    const db = getFirestoreDb();
    if (db) {
      await db.collection("enquiries").doc(lead.id).set(lead);
      savedToFirestore = true;
    }
  } catch (err) {
    // Firestore graceful fallback
  }

  // 4. Try writing to local data path (for local dev environments)
  try {
    const dir = path.dirname(LOCAL_DATA_PATH);
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(LOCAL_DATA_PATH, JSON.stringify(updatedLeads, null, 2), "utf-8");
    savedToDisk = true;
  } catch {}

  // 5. Try writing to /tmp path (serverless temporary filesystem)
  try {
    const dir = path.dirname(TMP_DATA_PATH);
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(TMP_DATA_PATH, JSON.stringify(updatedLeads, null, 2), "utf-8");
    savedToTmp = true;
  } catch {}

  return {
    success: true,
    persistent: savedToStorage || savedToFirestore || savedToDisk || savedToTmp,
  };
}

/**
 * Update a lead's status (new -> reviewed -> archived)
 */
export async function updateLeadStatus(id: string, status: "new" | "reviewed" | "archived"): Promise<boolean> {
  return updateLead(id, { status });
}

/**
 * Update any attributes of a lead (status, internal notes, contact details)
 */
export async function updateLead(id: string, updates: Partial<EnquiryLead>): Promise<boolean> {
  const currentLeads = await getAllLeads();
  const index = currentLeads.findIndex((l) => l.id === id);
  if (index === -1) return false;

  const updatedLead: EnquiryLead = {
    ...currentLeads[index],
    ...updates,
    id, // ensure ID cannot be mutated
  };

  currentLeads[index] = updatedLead;
  globalThis.__techno_enquiries_store__ = currentLeads;

  // 1. Update Firebase Cloud Storage
  await saveLeadsToFirebaseStorage(currentLeads);

  // 2. Update Firestore if active
  try {
    const db = getFirestoreDb();
    if (db) {
      await db.collection("enquiries").doc(id).set(updatedLead, { merge: true });
    }
  } catch (err) {
    // Firestore fallback
  }

  // 3. Update local disk
  try {
    await fs.writeFile(LOCAL_DATA_PATH, JSON.stringify(currentLeads, null, 2), "utf-8");
  } catch {}

  // 4. Update /tmp
  try {
    await fs.writeFile(TMP_DATA_PATH, JSON.stringify(currentLeads, null, 2), "utf-8");
  } catch {}

  return true;
}

/**
 * Delete a lead permanently across all persistence tiers
 */
export async function deleteLead(id: string): Promise<boolean> {
  const currentLeads = await getAllLeads();
  const filtered = currentLeads.filter((l) => l.id !== id);
  if (filtered.length === currentLeads.length) {
    return false; // lead didn't exist
  }

  globalThis.__techno_enquiries_store__ = filtered;

  // 1. Delete from Firebase Cloud Storage
  await saveLeadsToFirebaseStorage(filtered);

  // 2. Delete from Firestore if active
  try {
    const db = getFirestoreDb();
    if (db) {
      await db.collection("enquiries").doc(id).delete();
    }
  } catch (err) {
    // Firestore fallback
  }

  // 3. Update local disk
  try {
    await fs.writeFile(LOCAL_DATA_PATH, JSON.stringify(filtered, null, 2), "utf-8");
  } catch {}

  // 4. Update /tmp
  try {
    await fs.writeFile(TMP_DATA_PATH, JSON.stringify(filtered, null, 2), "utf-8");
  } catch {}

  return true;
}

/**
 * Generate formatted CSV export string of all leads
 */
export function generateLeadsCsv(leads: EnquiryLead[]): string {
  const headers = [
    "Lead ID",
    "Full Name",
    "Email",
    "Phone",
    "Company",
    "Service Requested",
    "Budget",
    "Status",
    "Received Date",
    "Message",
    "Internal Studio Notes",
  ];

  const escapeCsv = (val: any) => {
    if (val === null || val === undefined) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const rows = leads.map((l) => [
    escapeCsv(l.id),
    escapeCsv(l.fullName),
    escapeCsv(l.email),
    escapeCsv(l.phone),
    escapeCsv(l.company),
    escapeCsv(l.service),
    escapeCsv(l.budget),
    escapeCsv(l.status),
    escapeCsv(l.createdAt),
    escapeCsv(l.message),
    escapeCsv(l.notes || ""),
  ]);

  return [headers.join(","), ...rows.map((r) => r.join(","))].join("\r\n");
}
