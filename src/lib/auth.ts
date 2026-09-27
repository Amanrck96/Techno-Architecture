import crypto from "crypto";

export const SESSION_COOKIE_NAME = "techno_admin_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

function getSecretKey(): string {
  return (
    process.env.ADMIN_SESSION_SECRET ||
    process.env.ADMIN_PASSWORD ||
    "techno-architecture-secure-session-key-fallback-2026"
  );
}

export function createSessionToken(username: string): string {
  const secret = getSecretKey();
  const timestamp = Date.now();
  const payload = `${username}:${timestamp}`;
  const hmac = crypto.createHmac("sha256", secret).update(payload).digest("hex");
  return `${payload}:${hmac}`;
}

export function verifySessionToken(token: string | undefined | null): { valid: boolean; username?: string } {
  if (!token) return { valid: false };

  const parts = token.split(":");
  if (parts.length !== 3) return { valid: false };

  const [username, timestampStr, signature] = parts;
  const timestamp = parseInt(timestampStr, 10);
  if (isNaN(timestamp)) return { valid: false };

  // Check 7-day expiration
  const now = Date.now();
  if (now - timestamp > SESSION_MAX_AGE_SECONDS * 1000) {
    return { valid: false };
  }

  const secret = getSecretKey();
  const expectedPayload = `${username}:${timestamp}`;
  const expectedHmac = crypto.createHmac("sha256", secret).update(expectedPayload).digest("hex");

  const sigBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedHmac);

  if (sigBuffer.length !== expectedBuffer.length) {
    return { valid: false };
  }

  if (crypto.timingSafeEqual(sigBuffer, expectedBuffer)) {
    return { valid: true, username };
  }

  return { valid: false };
}
