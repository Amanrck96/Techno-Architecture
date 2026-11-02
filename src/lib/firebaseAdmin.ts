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
    return {
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
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
    (credentials?.projectId ? `${credentials.projectId}.firebasestorage.app` : undefined);

  if (credentials) {
    return initializeApp({
      credential: cert(credentials),
      storageBucket: bucketName,
    });
  }

  if (process.env.GOOGLE_APPLICATION_CREDENTIALS || process.env.GCP_PROJECT) {
    return initializeApp({
      storageBucket: bucketName,
    });
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
