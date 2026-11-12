import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { verifySessionToken, verifyAnyAdminToken, SESSION_COOKIE_NAME } from "@/lib/auth";
import { getFirestoreDb, getFirebaseStorageBucket } from "@/lib/firebaseAdmin";
import {
  readStore,
  writeStore,
  writeRecord,
  deleteRecord,
  getDefaultData,
  saveToGitHub,
  saveToUpstashKV,
  saveToFirebaseStorage,
  FIREBASE_STORAGE_BUCKET,
} from "@/lib/cmsServer";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function revalidatePublicPages() {
  try {
    revalidatePath("/", "layout");
    revalidatePath("/");
    revalidatePath("/about");
    revalidatePath("/projects");
    revalidatePath("/services");
    revalidatePath("/gallery");
    revalidatePath("/faq");
    revalidatePath("/recognitions");
    revalidatePath("/blog");
    revalidatePath("/contact");
    revalidatePath("/careers");
  } catch (err) {
    console.error("[Revalidation Error]:", err);
  }
}

function persistenceFailure(storageStatus: any) {
  return NextResponse.json(
    {
      success: false,
      error: storageStatus?.summaryMessage || "Changes could not be saved permanently.",
      storageStatus,
    },
    { status: 502 }
  );
}

// GET: Public endpoint for live website data hydration
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const customUpstashUrl = request.headers.get("x-upstash-url") || url.searchParams.get("upstashUrl") || undefined;
    const customUpstashToken = request.headers.get("x-upstash-token") || url.searchParams.get("upstashToken") || undefined;
    const customGithubToken = request.headers.get("x-github-token") || url.searchParams.get("githubToken") || undefined;
    const customGithubRepo = request.headers.get("x-github-repo") || url.searchParams.get("githubRepo") || undefined;

    const forceFresh =
      url.searchParams.get("fresh") === "1" ||
      Boolean(request.headers.get("authorization")) ||
      Boolean(request.headers.get("x-admin-token"));

    const entityParam = url.searchParams.get("entity");
    const idParam = url.searchParams.get("id");

    // Single-record split read
    if (entityParam && idParam) {
      const fullData = await readStore(
        customUpstashUrl,
        customUpstashToken,
        customGithubToken,
        customGithubRepo,
        forceFresh
      );
      let record = null;
      if (Array.isArray(fullData[entityParam])) {
        record = fullData[entityParam].find((item: any) => item && (item.id === idParam || item.slug === idParam));
      } else if (entityParam === "siteSettings") {
        record = fullData.siteSettings;
      }
      if (!record) {
        return NextResponse.json({ error: `Record "${idParam}" not found in "${entityParam}".` }, { status: 404 });
      }
      return NextResponse.json(record, {
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": forceFresh ? "no-store, no-cache, must-revalidate" : "public, s-maxage=60, stale-while-revalidate=300",
        },
      });
    }

    // Lightweight manifest read
    if (url.searchParams.get("manifest") === "1") {
      const fullData = await readStore(
        customUpstashUrl,
        customUpstashToken,
        customGithubToken,
        customGithubRepo,
        forceFresh
      );
      const manifest = {
        updatedAt: fullData.updatedAt || new Date().toISOString(),
        sections: {
          projects: { count: Array.isArray(fullData.projects) ? fullData.projects.length : 0 },
          services: { count: Array.isArray(fullData.services) ? fullData.services.length : 0 },
          team: { count: Array.isArray(fullData.team) ? fullData.team.length : 0 },
          blog: { count: Array.isArray(fullData.blog) ? fullData.blog.length : 0 },
          faq: { count: Array.isArray(fullData.faq) ? fullData.faq.length : 0 },
          gallery: { count: Array.isArray(fullData.gallery) ? fullData.gallery.length : 0 },
          recognitions: { count: Array.isArray(fullData.recognitions) ? fullData.recognitions.length : 0 },
          testimonials: { count: Array.isArray(fullData.testimonials) ? fullData.testimonials.length : 0 },
        },
      };
      return NextResponse.json(manifest, {
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": forceFresh ? "no-store, no-cache, must-revalidate" : "public, s-maxage=60, stale-while-revalidate=300",
        },
      });
    }

    const data = await readStore(
      customUpstashUrl,
      customUpstashToken,
      customGithubToken,
      customGithubRepo,
      forceFresh
    );

    const storageInfo = {
      isGoogleCloud: Boolean(process.env.K_SERVICE || process.env.FUNCTION_TARGET || process.env.FIREBASE_CONFIG || process.env.GOOGLE_CLOUD_PROJECT),
      isProduction: process.env.NODE_ENV === "production",
      hasFirebaseStorage: Boolean(getFirebaseStorageBucket() || FIREBASE_STORAGE_BUCKET),
      firebaseStorageBucket: FIREBASE_STORAGE_BUCKET,
      hasGitHubToken: Boolean(process.env.GITHUB_TOKEN || process.env.GH_TOKEN),
      hasUpstashKV: Boolean(process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL),
      hasFirestore: Boolean(getFirestoreDb()),
      localDiskWritable: process.env.NODE_ENV !== "production",
    };

    return NextResponse.json(
      {
        ...data,
        _storageInfo: storageInfo,
      },
      {
        headers: {
          "Cache-Control": forceFresh
            ? "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0"
            : "public, s-maxage=60, stale-while-revalidate=300",
          ...(forceFresh ? { Pragma: "no-cache" } : {}),
        },
      }
    );
  } catch (error) {
    console.error("GET /api/cms error:", error);
    return NextResponse.json(getDefaultData(), { status: 200 });
  }
}

// POST: Admin endpoint for live persistent updates
export async function POST(request: Request) {
  try {
    // 1. Verify admin session cookie OR Authorization / x-admin-token header
    const cookieStore = cookies();
    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);
    const authHeader = request.headers.get("authorization") || request.headers.get("x-admin-token");
    const tokenFromHeader = authHeader?.replace(/^Bearer\s+/i, "");

    // Check all candidate tokens — prevents an expired cookie from masking a fresh header token
    const { valid } = verifyAnyAdminToken([
      tokenFromHeader,
      request.headers.get("x-admin-token"),
      sessionCookie?.value,
    ]);

    if (!valid) {
      return NextResponse.json({ error: "Unauthorized: Invalid or expired admin session." }, { status: 401 });
    }

    // 2. Parse payload
    const body = await request.json();

    const githubToken = request.headers.get("x-github-token") || body.githubToken;
    const githubRepo = request.headers.get("x-github-repo") || body.githubRepo;
    const upstashUrl = request.headers.get("x-upstash-url") || body.upstashUrl;
    const upstashToken = request.headers.get("x-upstash-token") || body.upstashToken;

    const incomingDeletedIds: string[] = Array.isArray(body.deletedIds)
      ? body.deletedIds
      : Array.isArray(body.allData?.deletedIds)
      ? body.allData.deletedIds
      : [];

    const storageOptions = {
      githubToken: githubToken || undefined,
      githubRepo: githubRepo || undefined,
      upstashUrl: upstashUrl || undefined,
      upstashToken: upstashToken || undefined,
      forceGitHubCommit: Boolean(body.forceGitHubCommit),
      deletedIds: incomingDeletedIds,
    };

    // Action: Test credentials
    if (body.action === "test-connection") {
      const results: any = {};
      const testKey = `cms-test/test-${Date.now()}.json`;
      // Test Firebase Cloud Storage strictly via isolated test path (NEVER touch live cms/cms-content.json)
      const fbTest = await saveToFirebaseStorage(
        {
          _test: true,
          testedAt: new Date().toISOString(),
        },
        undefined,
        testKey
      );
      // Clean up test object immediately
      try {
        const bucket = getFirebaseStorageBucket();
        if (bucket) {
          await bucket.file(testKey).delete({ ignoreNotFound: true });
        }
      } catch (_) {}
      results.firebaseStorage = fbTest;

      if (githubToken) {
        const ghTest = await saveToGitHub({ _test: true }, githubToken, githubRepo);
        results.github = ghTest;
      }
      if (upstashUrl && upstashToken) {
        const upTest = await saveToUpstashKV({ _test: true }, upstashUrl, upstashToken);
        results.upstash = upTest;
      }
      return NextResponse.json({ success: true, results });
    }

    const current = await readStore(upstashUrl, upstashToken, githubToken, githubRepo);

    // Optimistic Concurrency Control: Check expectedUpdatedAt vs current.updatedAt
    if (body.expectedUpdatedAt && current?.updatedAt && body.reset !== true && !body.forceOverwrite) {
      const expectedTime = new Date(body.expectedUpdatedAt).getTime();
      const currentTime = new Date(current.updatedAt).getTime();
      // If server content is newer than client's baseline (allow 1s tolerance for micro-skews)
      if (!isNaN(expectedTime) && !isNaN(currentTime) && currentTime - expectedTime > 1000) {
        return NextResponse.json(
          {
            success: false,
            error: "Someone else saved changes first. Please reload to review the latest changes before saving.",
            serverUpdatedAt: current.updatedAt,
            expectedUpdatedAt: body.expectedUpdatedAt,
            conflict: true,
          },
          { status: 409 }
        );
      }
    }

    // Merge deletedIds into current
    const mergedDeleted = new Set<string>(Array.isArray(current.deletedIds) ? current.deletedIds : []);
    incomingDeletedIds.forEach((id) => mergedDeleted.add(id));
    current.deletedIds = Array.from(mergedDeleted);

    if (body.reset === true) {
      const defaultData = getDefaultData();
      defaultData.updatedAt = new Date().toISOString();
      delete (defaultData as any).isDefault;
      delete (defaultData as any)._storageInfo;
      const storageStatus = await writeStore(defaultData, storageOptions);
      if (!storageStatus.isPermanent) return persistenceFailure(storageStatus);
      revalidatePublicPages();
      return NextResponse.json({
        success: true,
        message: "All data reset to initial seed defaults.",
        storageStatus,
        data: defaultData,
        updatedAt: defaultData.updatedAt,
      });
    }

    // Explicit Record Deletion (projects/<id>, team/<id>, services/<id>, etc.)
    if (body.action === "delete" || body.delete) {
      const entity = String(body.entity || "");
      const recordId = String(body.recordId || body.id || "");
      const slug = String(body.slug || "");
      if (!entity || !recordId) {
        return NextResponse.json(
          { error: "Missing entity or recordId for delete action." },
          { status: 400 }
        );
      }
      const deleteResult = await deleteRecord(entity, recordId, slug, storageOptions);
      revalidatePublicPages();
      return NextResponse.json({
        success: true,
        action: "delete",
        entity,
        recordId,
        slug,
        deletedId: deleteResult.deletedId,
        durationMs: deleteResult.durationMs,
        message: `Permanently deleted record "${recordId}" from ${entity}.`,
      });
    }

    // Granular Single-Record Update (projects/<id>, team/<id>, services/<id>, etc.)
    // Note: MUST NOT match when body.data is an array (which represents whole-entity lists)
    const isSingleRecordUpdate = Boolean(
      body.record ||
      (body.recordId && body.data && !Array.isArray(body.data))
    );

    if (body.entity && isSingleRecordUpdate) {
      const entity = String(body.entity);
      const recordData = body.record || body.data;
      const recordId = String(body.recordId || recordData?.id || recordData?.slug || "");
      const expectedRecordUpdatedAt = body.expectedUpdatedAt || recordData?.expectedUpdatedAt;

      // Locate existing record in server dataset for concurrency validation
      let existingRecord: any = null;
      if (Array.isArray(current[entity])) {
        existingRecord = current[entity].find((item: any) => item && (item.id === recordId || item.slug === recordId));
      } else if (entity === "siteSettings") {
        existingRecord = current.siteSettings;
      }

      // Per-record concurrency control: 409 Conflict if server version is newer
      if (expectedRecordUpdatedAt && existingRecord?.updatedAt && !body.forceOverwrite) {
        const expectedTime = new Date(expectedRecordUpdatedAt).getTime();
        const serverTime = new Date(existingRecord.updatedAt).getTime();
        if (!isNaN(expectedTime) && !isNaN(serverTime) && serverTime - expectedTime > 1000) {
          return NextResponse.json(
            {
              success: false,
              conflict: true,
              error: `Record "${recordId}" in "${entity}" was modified by another session. Please reload before saving.`,
              serverUpdatedAt: existingRecord.updatedAt,
              expectedUpdatedAt: expectedRecordUpdatedAt,
            },
            { status: 409 }
          );
        }
      }

      const updatedTimestamp = new Date().toISOString();
      const updatedRecord = {
        ...recordData,
        updatedAt: updatedTimestamp,
      };

      const result = await writeRecord(entity, recordId, updatedRecord);

      revalidatePublicPages();
      return NextResponse.json({
        success: true,
        entity,
        recordId,
        updatedAt: updatedTimestamp,
        durationMs: result.durationMs,
        sizeBytes: result.sizeBytes,
      });
    }

    if (body.allData) {
      const mergedSiteSettings = body.allData.siteSettings
        ? {
            ...current.siteSettings,
            ...body.allData.siteSettings,
            contact: {
              ...(current.siteSettings?.contact || {}),
              ...(body.allData.siteSettings.contact || {}),
            },
          }
        : current.siteSettings;

      // Merge deletedIds from all sources
      const allDeleted = new Set<string>(current.deletedIds || []);
      if (Array.isArray(body.deletedIds)) {
        body.deletedIds.forEach((id: string) => {
          if (id && typeof id === "string") allDeleted.add(id.trim());
        });
      }
      if (Array.isArray(body.allData.deletedIds)) {
        body.allData.deletedIds.forEach((id: string) => {
          if (id && typeof id === "string") allDeleted.add(id.trim());
        });
      }
      const mergedDeletedIds = Array.from(allDeleted);

      const filterDeleted = (arr: any) =>
        Array.isArray(arr)
          ? arr.filter(
              (item: any) =>
                item &&
                !mergedDeletedIds.includes(String(item.id)) &&
                (!item.slug || !mergedDeletedIds.includes(String(item.slug)))
            )
          : arr;

      const updated = {
        ...current,
        ...body.allData,
        projects: filterDeleted(body.allData.projects || current.projects),
        services: filterDeleted(body.allData.services || current.services),
        team: filterDeleted(body.allData.team || current.team),
        blog: filterDeleted(body.allData.blog || current.blog),
        faq: filterDeleted(body.allData.faq || current.faq),
        gallery: filterDeleted(body.allData.gallery || current.gallery),
        recognitions: filterDeleted(body.allData.recognitions || current.recognitions),
        testimonials: filterDeleted(body.allData.testimonials || current.testimonials),
        siteSettings: mergedSiteSettings,
        deletedIds: mergedDeletedIds,
        updatedAt: new Date().toISOString(),
      };
      delete (updated as any).isDefault;
      delete (updated as any)._storageInfo;
      const storageStatus = await writeStore(updated, storageOptions);
      if (!storageStatus.isPermanent) return persistenceFailure(storageStatus);
      revalidatePublicPages();
      return NextResponse.json({
        success: true,
        message: storageStatus.summaryMessage,
        storageStatus,
        data: updated,
        updatedAt: updated.updatedAt,
      });
    }

    if (body.entity && body.data !== undefined) {
      // Merge any incoming deletedIds
      if (Array.isArray(body.deletedIds) && body.deletedIds.length > 0) {
        const mergedDeleted = new Set<string>(current.deletedIds || []);
        body.deletedIds.forEach((id: string) => {
          if (id && typeof id === "string") mergedDeleted.add(id.trim());
        });
        current.deletedIds = Array.from(mergedDeleted);
      }

      if (body.entity === "siteSettings") {
        current.siteSettings = {
          ...current.siteSettings,
          ...body.data,
          contact: {
            ...(current.siteSettings?.contact || {}),
            ...(body.data?.contact || {}),
          },
        };
      } else {
        const activeDeletedIds = new Set<string>(current.deletedIds || []);
        const sanitizedData = Array.isArray(body.data)
          ? body.data.filter(
              (item: any) =>
                item &&
                !activeDeletedIds.has(String(item.id)) &&
                (!item.slug || !activeDeletedIds.has(String(item.slug)))
            )
          : body.data;
        current[body.entity] = sanitizedData;
      }
      current.updatedAt = new Date().toISOString();
      delete (current as any).isDefault;
      delete (current as any)._storageInfo;
      const storageStatus = await writeStore(current, storageOptions);
      if (!storageStatus.isPermanent) return persistenceFailure(storageStatus);
      revalidatePublicPages();
      return NextResponse.json({
        success: true,
        entity: body.entity,
        data: current,
        message: storageStatus.summaryMessage,
        storageStatus,
        updatedAt: current.updatedAt,
      });
    }

    return NextResponse.json({ error: "Invalid request payload format." }, { status: 400 });
  } catch (error: any) {
    console.error("POST /api/cms error:", error);
    return NextResponse.json({ error: "Internal server error saving CMS data." }, { status: 500 });
  }
}

// DELETE: Admin endpoint to explicitly purge an entity record
export async function DELETE(request: Request) {
  try {
    const cookieStore = cookies();
    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);
    const authHeader = request.headers.get("authorization") || request.headers.get("x-admin-token");
    const tokenFromHeader = authHeader?.replace(/^Bearer\s+/i, "");

    const { valid } = verifyAnyAdminToken([
      tokenFromHeader,
      request.headers.get("x-admin-token"),
      sessionCookie?.value,
    ]);

    if (!valid) {
      return NextResponse.json({ error: "Unauthorized: Invalid or expired admin session." }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const entity = searchParams.get("entity") || "";
    const recordId = searchParams.get("id") || searchParams.get("recordId") || "";
    const slug = searchParams.get("slug") || "";

    if (!entity || !recordId) {
      return NextResponse.json({ error: "Missing entity or recordId parameter." }, { status: 400 });
    }

    const deleteResult = await deleteRecord(entity, recordId, slug);
    revalidatePublicPages();
    return NextResponse.json({
      success: true,
      action: "delete",
      entity,
      recordId,
      slug,
      deletedId: deleteResult.deletedId,
      durationMs: deleteResult.durationMs,
      message: `Permanently deleted record "${recordId}" from ${entity}.`,
    });
  } catch (error: any) {
    console.error("DELETE /api/cms error:", error);
    return NextResponse.json({ error: "Internal server error deleting record." }, { status: 500 });
  }
}
