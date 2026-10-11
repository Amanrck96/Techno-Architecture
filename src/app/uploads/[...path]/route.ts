import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export const dynamic = "force-dynamic";

const MIME_MAP: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".mov": "video/quicktime",
  ".pdf": "application/pdf",
};

export async function GET(
  request: Request,
  { params }: { params: { path?: string[] } }
) {
  try {
    const rawSegments = params?.path || [];
    if (!rawSegments || rawSegments.length === 0) {
      return new Response("Not found", { status: 404 });
    }

    // Sanitize path segments to prevent directory traversal
    const safeSegments = rawSegments.map((seg) => seg.replace(/[^a-zA-Z0-9._-]/g, ""));
    const uploadsRoot = path.resolve(process.cwd(), "public", "uploads");
    const filePath = path.resolve(uploadsRoot, ...safeSegments);

    // Verify it doesn't escape public/uploads
    if (!filePath.startsWith(uploadsRoot)) {
      return new Response("Forbidden", { status: 403 });
    }

    const data = await fs.readFile(filePath);
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_MAP[ext] || "application/octet-stream";

    return new Response(data, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
