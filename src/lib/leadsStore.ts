import fs from "fs/promises";
import path from "path";
import { getFirestoreDb } from "@/lib/firebaseAdmin";

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
const TMP_DATA_PATH = process.env.VERCEL
  ? path.join("/tmp", "enquiries.json")
  : path.join(process.cwd(), ".next", "cache", "enquiries-tmp.json");

declare global {
  // eslint-disable-next-line no-var
  var __techno_enquiries_store__: EnquiryLead[] | undefined;
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
 * Commit leads array to GitHub repository via REST API
 */
async function saveLeadsToGitHub(leads: EnquiryLead[]): Promise<boolean> {
  const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
  const repo = process.env.GITHUB_REPOSITORY || "Amanrck96/Techno-Architecture";
  const filePath = "src/data/enquiries.json";

  if (!token) return false;

  try {
    // 1. Get current SHA if file exists
    let sha: string | undefined;
    const getRes = await fetch(`https://api.github.com/repos/${repo}/contents/${filePath}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.v3+json",
      },
      cache: "no-store",
    });

    if (getRes.ok) {
      const fileInfo = await getRes.json();
      sha = fileInfo.sha;
    }

    const contentStr = JSON.stringify(leads, null, 2);
    const contentBase64 = Buffer.from(contentStr).toString("base64");

    const putRes = await fetch(`https://api.github.com/repos/${repo}/contents/${filePath}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.v3+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: `chore(leads): sync enquiry leads via studio portal [${new Date().toISOString()}]`,
        content: contentBase64,
        sha,
      }),
    });

    return putRes.ok;
  } catch (err) {
    console.warn("[LeadsStore] GitHub commit notice:", err);
    return false;
  }
}

/**
 * Retrieve all enquiry leads from all available persistence tiers
 */
export async function getAllLeads(): Promise<EnquiryLead[]> {
  const leadMap = new Map<string, EnquiryLead>();

  // 1. Check in-memory store
  if (globalThis.__techno_enquiries_store__) {
    for (const lead of globalThis.__techno_enquiries_store__) {
      leadMap.set(lead.id, lead);
    }
  }

  // 2. Try Firestore Admin SDK (if active)
  try {
    const db = getFirestoreDb();
    if (db) {
      const snapshot = await db
        .collection("enquiries")
        .orderBy("createdAt", "desc")
        .limit(200)
        .get();

      snapshot.docs.forEach((doc) => {
        const data = doc.data() as any;
        const lead: EnquiryLead = {
          id: doc.id,
          fullName: data.fullName || "",
          email: data.email || "",
          phone: data.phone || "",
          company: data.company || "",
          service: data.service || "",
          budget: data.budget || "",
          message: data.message || "",
          status: data.status || "new",
          createdAt: data.createdAt || new Date().toISOString(),
        };
        leadMap.set(lead.id, lead);
      });
    }
  } catch (err) {
    console.warn("[LeadsStore] Firestore fetch notice:", err);
  }

  // 3. Try reading from local data file
  try {
    const raw = await fs.readFile(LOCAL_DATA_PATH, "utf-8");
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      parsed.forEach((lead: EnquiryLead) => {
        if (lead && lead.id) {
          // If already in map, preserve newer status
          if (!leadMap.has(lead.id)) {
            leadMap.set(lead.id, lead);
          }
        }
      });
    }
  } catch {}

  // 4. Try reading from serverless /tmp cache
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

  // 5. Try reading from GitHub (for production deployments on Vercel)
  if (process.env.VERCEL || process.env.NODE_ENV === "production") {
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

  let savedToDisk = false;
  let savedToTmp = false;
  let savedToFirestore = false;

  // 2. Try Firestore Admin SDK
  try {
    const db = getFirestoreDb();
    if (db) {
      await db.collection("enquiries").doc(lead.id).set(lead);
      savedToFirestore = true;
    }
  } catch (err) {
    console.warn("[LeadsStore] Firestore save notice:", err);
  }

  // 3. Try writing to local data path
  try {
    const dir = path.dirname(LOCAL_DATA_PATH);
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(LOCAL_DATA_PATH, JSON.stringify(updatedLeads, null, 2), "utf-8");
    savedToDisk = true;
  } catch {}

  // 4. Try writing to /tmp path
  try {
    const dir = path.dirname(TMP_DATA_PATH);
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(TMP_DATA_PATH, JSON.stringify(updatedLeads, null, 2), "utf-8");
    savedToTmp = true;
  } catch {}

  // 5. Commit to GitHub in background (does not block HTTP response)
  const isPermanent = savedToFirestore || savedToDisk;
  if (!savedToFirestore) {
    saveLeadsToGitHub(updatedLeads).catch((err) => {
      console.warn("[LeadsStore] Background GitHub commit notice:", err);
    });
  }

  return {
    success: true,
    persistent: isPermanent || savedToTmp,
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

  // 1. Update Firestore if active
  try {
    const db = getFirestoreDb();
    if (db) {
      await db.collection("enquiries").doc(id).set(updatedLead, { merge: true });
    }
  } catch (err) {
    console.warn("[LeadsStore] Firestore update notice:", err);
  }

  // 2. Update local disk
  try {
    await fs.writeFile(LOCAL_DATA_PATH, JSON.stringify(currentLeads, null, 2), "utf-8");
  } catch {}

  // 3. Update /tmp
  try {
    await fs.writeFile(TMP_DATA_PATH, JSON.stringify(currentLeads, null, 2), "utf-8");
  } catch {}

  // 4. Update GitHub
  saveLeadsToGitHub(currentLeads).catch(() => {});

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

  // 1. Delete from Firestore if active
  try {
    const db = getFirestoreDb();
    if (db) {
      await db.collection("enquiries").doc(id).delete();
    }
  } catch (err) {
    console.warn("[LeadsStore] Firestore delete notice:", err);
  }

  // 2. Update local disk
  try {
    await fs.writeFile(LOCAL_DATA_PATH, JSON.stringify(filtered, null, 2), "utf-8");
  } catch {}

  // 3. Update /tmp
  try {
    await fs.writeFile(TMP_DATA_PATH, JSON.stringify(filtered, null, 2), "utf-8");
  } catch {}

  // 4. Update GitHub
  saveLeadsToGitHub(filtered).catch(() => {});

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
