import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type Auth,
  type User,
  type UserCredential,
} from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  type FirebaseStorage,
} from "firebase/storage";

// Client-side Firebase Configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "technoarchitecture-7d718.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "technoarchitecture-7d718",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "technoarchitecture-7d718.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "361435214203",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:361435214203:web:27a627d1dac7458d7e4dde",
};

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let googleProvider: GoogleAuthProvider | null = null;

// Initialize Firebase client safely on browser side
export function getFirebaseApp(): FirebaseApp | null {
  if (typeof window === "undefined") {
    return null;
  }
  if (!app) {
    if (getApps().length > 0) {
      app = getApp();
    } else if (firebaseConfig.apiKey || firebaseConfig.projectId) {
      app = initializeApp(firebaseConfig);
    }
  }
  return app;
}

export function getFirebaseAuth(): Auth | null {
  const firebaseApp = getFirebaseApp();
  if (!firebaseApp) return null;
  if (!auth) {
    auth = getAuth(firebaseApp);
  }
  return auth;
}

export function getFirebaseDb(): Firestore | null {
  const firebaseApp = getFirebaseApp();
  if (!firebaseApp) return null;
  if (!db) {
    db = getFirestore(firebaseApp);
  }
  return db;
}

export function getGoogleProvider(): GoogleAuthProvider {
  if (!googleProvider) {
    googleProvider = new GoogleAuthProvider();
    googleProvider.setCustomParameters({
      prompt: "select_account",
    });
  }
  return googleProvider;
}

// Authentication Helpers
export async function loginWithEmail(email: string, pass: string): Promise<UserCredential> {
  const clientAuth = getFirebaseAuth();
  if (!clientAuth) throw new Error("Firebase Auth is not initialized.");
  return await signInWithEmailAndPassword(clientAuth, email, pass);
}

export async function registerWithEmail(email: string, pass: string): Promise<UserCredential> {
  const clientAuth = getFirebaseAuth();
  if (!clientAuth) throw new Error("Firebase Auth is not initialized.");
  return await createUserWithEmailAndPassword(clientAuth, email, pass);
}

export async function loginWithGoogle(): Promise<UserCredential> {
  const clientAuth = getFirebaseAuth();
  if (!clientAuth) throw new Error("Firebase Auth is not initialized.");
  const provider = getGoogleProvider();
  return await signInWithPopup(clientAuth, provider);
}

export async function logout(): Promise<void> {
  const clientAuth = getFirebaseAuth();
  if (!clientAuth) return;
  return await firebaseSignOut(clientAuth);
}

export function onAuthUserChanged(callback: (user: User | null) => void): (() => void) | undefined {
  const clientAuth = getFirebaseAuth();
  if (!clientAuth) return undefined;
  return onAuthStateChanged(clientAuth, callback);
}

// -------------------------------------------------------------
// Firebase Storage Client Helpers
// -------------------------------------------------------------
let storage: FirebaseStorage | null = null;

export function getFirebaseStorage(): FirebaseStorage | null {
  const firebaseApp = getFirebaseApp();
  if (!firebaseApp) return null;
  if (!storage) {
    storage = getStorage(firebaseApp);
  }
  return storage;
}

export async function uploadToFirebaseStorage(
  file: File | Blob,
  folder: string = "uploads",
  customFilename?: string,
  onProgress?: (progressPercent: number) => void
): Promise<{ url: string; fullPath: string; name: string }> {
  const clientStorage = getFirebaseStorage();
  if (!clientStorage) {
    throw new Error("Firebase Storage client is not initialized.");
  }

  const cleanFolder = folder.replace(/[^a-zA-Z0-9-_]/g, "") || "uploads";
  const originalName = file instanceof File ? file.name : "upload.bin";
  const ext = originalName.includes(".") ? originalName.slice(originalName.lastIndexOf(".")) : "";
  const cleanBase = originalName.replace(ext, "").replace(/[^a-zA-Z0-9-_]/g, "_").toLowerCase();
  const filename = customFilename || `techno_${cleanBase}_${Date.now()}${ext}`;
  const fullPath = `${cleanFolder}/${filename}`;

  const storageRef = ref(clientStorage, fullPath);
  const uploadTask = uploadBytesResumable(storageRef, file, {
    contentType: file.type || "application/octet-stream",
  });

  return new Promise((resolve, reject) => {
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        if (snapshot.totalBytes > 0 && onProgress) {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          onProgress(Math.round(progress));
        }
      },
      (error) => {
        reject(error);
      },
      async () => {
        try {
          const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
          resolve({
            url: downloadUrl,
            fullPath,
            name: filename,
          });
        } catch (err) {
          reject(err);
        }
      }
    );
  });
}

export { app, auth, db, storage, googleProvider };
