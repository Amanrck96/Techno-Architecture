import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import fs from "fs/promises";
import path from "path";
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/lib/auth";
import { getFirebaseStorageBucket } from "@/lib/firebaseAdmin";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    // 1. Verify admin session
    const cookieStore = cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    const authResult = verifySessionToken(token);
    
    // In local dev without session, allow upload if no session cookie exists
    const isDev = process.env.NODE_ENV !== "production";
    if (!authResult.valid && !isDev) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate mime type
    const validMimes = ["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif"];
    if (!validMimes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Please upload a JPG, PNG, WEBP, or GIF image." },
        { status: 400 }
      );
    }

    // Limit file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File exceeds 10MB limit." },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const ext = path.extname(file.name) || ".jpg";
    const cleanBase = path.basename(file.name, ext).replace(/[^a-zA-Z0-9-_]/g, "_").toLowerCase();
    const filename = `techno_${cleanBase}_${Date.now()}${ext}`;

    // 2. Try uploading to Firebase Storage if configured
    try {
      const bucket = getFirebaseStorageBucket();
      if (bucket) {
        const fileRef = bucket.file(`projects/${filename}`);
        await fileRef.save(buffer, {
          metadata: {
            contentType: file.type,
            metadata: {
              firebaseStorageDownloadTokens: filename,
            },
          },
        });
        
        // Make public or generate public URL
        try {
          await fileRef.makePublic();
          const publicUrl = `https://storage.googleapis.com/${bucket.name}/projects/${filename}`;
          return NextResponse.json({
            success: true,
            url: publicUrl,
            storage: "firebase",
            name: filename,
          });
        } catch (_) {
          // Alternatively standard Firebase media link
          const downloadUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(`projects/${filename}`)}?alt=media&token=${filename}`;
          return NextResponse.json({
            success: true,
            url: downloadUrl,
            storage: "firebase",
            name: filename,
          });
        }
      }
    } catch (fbErr) {
      console.warn("Firebase Storage upload skipped or failed, falling back to local:", fbErr);
    }

    // 3. Fallback: Save to public/uploads/
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadsDir, { recursive: true });
    const localFilePath = path.join(uploadsDir, filename);
    await fs.writeFile(localFilePath, buffer);

    const publicUrl = `/uploads/${filename}`;
    return NextResponse.json({
      success: true,
      url: publicUrl,
      storage: "local",
      name: filename,
    });
  } catch (error: any) {
    console.error("Upload API error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to upload image" },
      { status: 500 }
    );
  }
}
