import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getFirestoreDb } from "@/lib/firebaseAdmin";

export const dynamic = "force-dynamic";

// ───── Auth helper (same logic as other admin routes) ─────
function isAdminAuthorized(request: Request): boolean {
  const cookieStore = cookies();
  const sessionCookie = cookieStore.get("techno_admin_session")?.value;
  if (sessionCookie === process.env.ADMIN_PASSWORD) return true;

  const authHeader = request.headers.get("Authorization") || "";
  const xToken = request.headers.get("x-admin-token") || "";
  const token = authHeader.replace("Bearer ", "").trim() || xToken.trim();
  return !!(token && token === process.env.ADMIN_PASSWORD);
}

export async function GET(request: Request) {
  if (!isAdminAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const db = getFirestoreDb();

    // --- Firestore Admin SDK path ---
    if (db) {
      const snapshot = await db
        .collection("enquiries")
        .orderBy("createdAt", "desc")
        .limit(200)
        .get();

      const leads = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      return NextResponse.json({ leads }, { status: 200 });
    }

    // --- REST API fallback (no service account) ---
    const projectId =
      process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "technoarchitecture-7d718";
    const apiKey =
      process.env.NEXT_PUBLIC_FIREBASE_API_KEY ||
      "AIzaSyAw8ikqz3kMoFRu3HhT1adl8ikKq5ies0I";

    const firestoreUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/enquiries?orderBy=createdAt+desc&pageSize=200&key=${apiKey}`;
    const restRes = await fetch(firestoreUrl, { cache: "no-store" });

    if (!restRes.ok) {
      const errBody = await restRes.text();
      console.warn("Firestore REST fetch error:", errBody);
      return NextResponse.json(
        { leads: [], warning: "Firestore fetch via REST returned an error." },
        { status: 200 }
      );
    }

    const restData = await restRes.json();
    const documents: any[] = restData.documents || [];

    const leads = documents.map((doc: any) => {
      const fields = doc.fields || {};
      const getId = (d: any) => d.name?.split("/").pop() || "";
      const str = (f: any) => f?.stringValue ?? "";

      return {
        id: getId(doc),
        fullName: str(fields.fullName),
        email: str(fields.email),
        phone: str(fields.phone),
        company: str(fields.company),
        service: str(fields.service),
        budget: str(fields.budget),
        message: str(fields.message),
        status: str(fields.status) || "new",
        createdAt: str(fields.createdAt),
      };
    });

    return NextResponse.json({ leads }, { status: 200 });
  } catch (err: any) {
    console.error("Leads API error:", err);
    return NextResponse.json(
      { error: "Failed to fetch leads.", detail: err?.message },
      { status: 500 }
    );
  }
}

// PATCH — update lead status (new → reviewed → archived)
export async function PATCH(request: Request) {
  if (!isAdminAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id, status } = await request.json();
    if (!id || !status) {
      return NextResponse.json(
        { error: "Missing id or status." },
        { status: 422 }
      );
    }

    const db = getFirestoreDb();
    if (db) {
      await db.collection("enquiries").doc(id).update({ status });
      return NextResponse.json({ success: true });
    }

    // REST fallback
    const projectId =
      process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "technoarchitecture-7d718";
    const apiKey =
      process.env.NEXT_PUBLIC_FIREBASE_API_KEY ||
      "AIzaSyAw8ikqz3kMoFRu3HhT1adl8ikKq5ies0I";
    const patchUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/enquiries/${id}?updateMask.fieldPaths=status&key=${apiKey}`;

    await fetch(patchUrl, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fields: { status: { stringValue: status } } }),
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Failed to update lead.", detail: err?.message },
      { status: 500 }
    );
  }
}
