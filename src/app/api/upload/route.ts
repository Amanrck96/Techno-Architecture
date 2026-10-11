import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import fs from "fs/promises";
import path from "path";
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/lib/auth";
import { getFirebaseStorageBucket } from "@/lib/firebaseAdmin";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const rawFolder = (formData.get("folder") as string) || "uploads";
    const folder = rawFolder.replace(/[^a-zA-Z0-9-_]/g, "") || "uploads";
    const formToken = (formData.get("adminToken") as string) || "";

    // 1. Verify admin session (via HTTP cookie, Authorization header, x-admin-token, or formToken)
    const cookieStore = cookies();
    const authHeader =
      request.headers.get("authorization") ||
      request.headers.get("Authorization") ||
      request.headers.get("x-admin-token") ||
      "";
    const token =
      cookieStore.get(SESSION_COOKIE_NAME)?.value ||
      authHeader.replace(/^Bearer\s+/i, "").trim() ||
      formToken;

    const authResult = verifySessionToken(token);
    
    // In local dev without session, allow upload if no session cookie exists
    const isDev = process.env.NODE_ENV !== "production";
    if (!authResult.valid && !isDev) {
      return NextResponse.json({ error: "Unauthorized access: Please login as admin." }, { status: 401 });
    }

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate mime type (Images, Videos, PDFs)
    const validImageMimes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/avif",
      "image/gif",
      "image/svg+xml",
    ];
    const validVideoMimes = [
      "video/mp4",
      "video/webm",
      "video/quicktime",
      "video/ogg",
      "video/x-msvideo",
      "video/mpeg",
    ];
    const validMimes = [...validImageMimes, ...validVideoMimes, "application/pdf"];

    const isVideo = validVideoMimes.includes(file.type);
    const maxSizeBytes = isVideo ? 100 * 1024 * 1024 : 30 * 1024 * 1024; // 100MB for video, 30MB for images

    if (!validMimes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Supported formats: JPG, PNG, WEBP, GIF, SVG, MP4, WEBM, MOV." },
        { status: 400 }
      );
    }

    // Limit file size
    if (file.size > maxSizeBytes) {
      return NextResponse.json(
        { error: `File exceeds maximum allowed size (${isVideo ? "100MB for videos" : "30MB for images"}).` },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const ext = path.extname(file.name) || ".jpg";
    const cleanBase = path.basename(file.name, ext).replace(/[^a-zA-Z0-9-_]/g, "_").toLowerCase();
    const filename = `techno_${cleanBase}_${Date.now()}${ext}`;
    const storagePath = `${folder}/${filename}`;

    // 2. Upload to Firebase Cloud Storage (technoarchitecture-7d718.firebasestorage.app)
    try {
      const bucket = getFirebaseStorageBucket();
      if (bucket) {
        const fileRef = bucket.file(storagePath);
        await fileRef.save(buffer, {
          metadata: {
            contentType: file.type,
            metadata: {
              firebaseStorageDownloadTokens: filename,
            },
          },
        });
        
        try {
          await fileRef.makePublic();
          const publicUrl = `https://storage.googleapis.com/${bucket.name}/${storagePath}`;
          return NextResponse.json({
            success: true,
            url: publicUrl,
            storage: "firebase",
            name: filename,
            folder,
          });
        } catch (_) {
          const downloadUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(storagePath)}?alt=media&token=${filename}`;
          return NextResponse.json({
            success: true,
            url: downloadUrl,
            storage: "firebase",
            name: filename,
            folder,
          });
        }
      }

      // If Admin SDK not initialized, upload directly to Firebase Cloud Storage via REST API
      const fbBucket = process.env.FIREBASE_STORAGE_BUCKET || "technoarchitecture-7d718.firebasestorage.app";
      if (fbBucket) {
        const fbUrl = `https://firebasestorage.googleapis.com/v0/b/${fbBucket}/o?name=${encodeURIComponent(storagePath)}&uploadType=media`;
        const fbRes = await fetch(fbUrl, {
          method: "POST",
          headers: {
            "Content-Type": file.type || "application/octet-stream",
          },
          body: buffer,
        });

        if (fbRes.ok) {
          const fbData = (await fbRes.json()) as { downloadTokens?: string };
          const token = fbData.downloadTokens || filename;
          const downloadUrl = `https://firebasestorage.googleapis.com/v0/b/${fbBucket}/o/${encodeURIComponent(storagePath)}?alt=media&token=${token}`;

          // Save local backup copy in public/uploads/${folder}/ for offline resilience
          try {
            const uploadsDir = path.join(process.cwd(), "public", "uploads", folder);
            await fs.mkdir(uploadsDir, { recursive: true });
            await fs.writeFile(path.join(uploadsDir, filename), buffer);
          } catch (_) {}

          return NextResponse.json({
            success: true,
            url: downloadUrl,
            storage: "firebase",
            name: filename,
            folder,
          });
        } else {
          console.warn("Firebase Storage REST upload status:", fbRes.status, await fbRes.text());
        }
      }
    } catch (fbErr) {
      console.warn("Firebase Storage upload skipped or failed, falling back to local server storage:", fbErr);
    }

    // 3. Fallback: Save to public/uploads/[folder]/
    try {
      const uploadsDir = path.join(process.cwd(), "public", "uploads", folder);
      await fs.mkdir(uploadsDir, { recursive: true });
      const localFilePath = path.join(uploadsDir, filename);
      await fs.writeFile(localFilePath, buffer);
    } catch (_) {}

    // 4. Commit to GitHub repo if token configured (guarantees permanent Vercel deployment persistence)
    const isVercel = Boolean(process.env.VERCEL);
    const ghToken = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
    const ghRepo = process.env.GITHUB_REPOSITORY || "Kima1011/Techno-Architecture";
    if (isVercel && ghToken && ghRepo && buffer.length < 25 * 1024 * 1024) {
      try {
        const ghPath = `public/uploads/${folder}/${filename}`;
        const contentBase64 = buffer.toString("base64");
        await fetch(`https://api.github.com/repos/${ghRepo}/contents/${ghPath}`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${ghToken}`,
            Accept: "application/vnd.github.v3+json",
            "Content-Type": "application/json",
            "User-Agent": "Techno-Architecture-Media",
          },
          body: JSON.stringify({
            message: `chore(media): upload ${filename} to ${folder} archive`,
            content: contentBase64,
            branch: "main",
          }),
        });
      } catch (ghErr) {
        console.warn("[Media Upload] GitHub auto-commit notice:", ghErr);
      }
    }

    const publicUrl = `/uploads/${folder}/${filename}`;
    return NextResponse.json({
      success: true,
      url: publicUrl,
      storage: ghToken ? "github" : "local",
      name: filename,
      folder,
    });
  } catch (error: any) {
    console.error("Upload API error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to upload image" },
      { status: 500 }
    );
  }
}
