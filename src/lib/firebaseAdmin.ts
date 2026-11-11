import { initializeApp, getApps, cert, type App } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

function getServiceAccount() {
  if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    try {
      return JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
    } catch (e) {
      console.warn("Invalid FIREBASE_SERVICE_ACCOUNT_KEY JSON:", e);
    }
  }

  if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
    let pk = process.env.FIREBASE_PRIVATE_KEY.trim();
    // Strip wrapping double or single quotes if copied directly from a JSON file or .env
    if ((pk.startsWith('"') && pk.endsWith('"')) || (pk.startsWith("'") && pk.endsWith("'"))) {
      pk = pk.slice(1, -1);
    }
    // Convert literal \n escape sequences into real newlines
    pk = pk.replace(/\\n/g, "\n");

    return {
      projectId: process.env.FIREBASE_PROJECT_ID.trim(),
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL.trim(),
      privateKey: pk,
    };
  }

  return null;
}

export function initFirebaseAdmin(): App | null {
  const existingApps = getApps();
  if (existingApps.length > 0) {
    return existingApps[0]!;
  }

  const credentials = getServiceAccount();
  const bucketName =
    process.env.FIREBASE_STORAGE_BUCKET ||
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ||
    (credentials?.projectId ? `${credentials.projectId}.firebasestorage.app` : "technoarchitecture-7d718.firebasestorage.app");

  if (credentials) {
    try {
      return initializeApp({
        credential: cert(credentials),
        storageBucket: bucketName,
      });
    } catch (err: any) {
      console.warn("[Firebase Admin] Service account cert init note:", err?.message);
    }
  }

  // On Google Cloud (Cloud Run / Cloud Functions / GAE), Application Default Credentials (ADC)
  // are automatically provided by the environment metadata service without explicit env vars.
  try {
    return initializeApp({
      projectId: process.env.GOOGLE_CLOUD_PROJECT || process.env.GCP_PROJECT || "technoarchitecture-7d718",
      storageBucket: bucketName,
    });
  } catch (err: any) {
    console.warn("[Firebase Admin] Native ADC initialization note:", err?.message);
  }

  return null;
}

export function getFirestoreDb(): Firestore | null {
  const app = initFirebaseAdmin();
  if (!app) return null;
  return getFirestore(app);
}

export function getFirebaseStorageBucket(explicitBucket?: string) {
  const app = initFirebaseAdmin();
  if (!app) return null;
  const bucketName =
    explicitBucket ||
    process.env.FIREBASE_STORAGE_BUCKET ||
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
  return bucketName ? getStorage(app).bucket(bucketName) : getStorage(app).bucket();
}
