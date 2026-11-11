import { initializeApp, getApps, cert, type App } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

const DEFAULT_PROJECT_ID = "technoarchitecture-7d718";
const DEFAULT_STORAGE_BUCKET = "technoarchitecture-7d718.firebasestorage.app";

/**
 * Optional local development fallback for service account credentials.
 * On Google Cloud / Firebase runtimes (App Hosting, Cloud Run, Cloud Functions),
 * Application Default Credentials (ADC) are used automatically instead.
 */
function getLocalDevServiceAccount() {
  if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    try {
      return JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
    } catch {
      // Invalid JSON syntax; skip fallback - never log keys
    }
  }

  if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
    let pk = process.env.FIREBASE_PRIVATE_KEY.trim();
    if ((pk.startsWith('"') && pk.endsWith('"')) || (pk.startsWith("'") && pk.endsWith("'"))) {
      pk = pk.slice(1, -1);
    }
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

  const bucketName =
    process.env.FIREBASE_STORAGE_BUCKET ||
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ||
    DEFAULT_STORAGE_BUCKET;

  const projectId =
    process.env.GOOGLE_CLOUD_PROJECT ||
    process.env.GCP_PROJECT ||
    process.env.FIREBASE_PROJECT_ID ||
    DEFAULT_PROJECT_ID;

  // 1. PRIMARY: On Google Cloud runtimes (Firebase App Hosting, Cloud Run, Cloud Functions),
  // initialize with native Application Default Credentials (ADC) without explicit cert.
  // The Google metadata service and attached service account automatically handle auth.
  const isGoogleRuntime = Boolean(
    process.env.K_SERVICE ||
    process.env.FUNCTION_TARGET ||
    process.env.FIREBASE_CONFIG ||
    process.env.GAE_SERVICE ||
    (!process.env.FIREBASE_CLIENT_EMAIL && !process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
  );

  if (isGoogleRuntime) {
    try {
      return initializeApp({
        projectId,
        storageBucket: bucketName,
      });
    } catch {
      // If ADC throws, fall through to dev credentials fallback
    }
  }

  // 2. OPTIONAL FALLBACK: Local development service account from .env.local
  const devCredentials = getLocalDevServiceAccount();
  if (devCredentials) {
    try {
      return initializeApp({
        credential: cert(devCredentials),
        projectId: devCredentials.projectId || projectId,
        storageBucket: bucketName,
      });
    } catch {
      // Never log credentials or private keys
    }
  }

  // 3. Fallback: Initialize with project ID and storageBucket
  try {
    return initializeApp({
      projectId,
      storageBucket: bucketName,
    });
  } catch {
    return null;
  }
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
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ||
    DEFAULT_STORAGE_BUCKET;
  return bucketName ? getStorage(app).bucket(bucketName) : getStorage(app).bucket();
}
