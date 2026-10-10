/**
 * Previewing a Flowra sandbox on this site.
 *
 * The sandbox dashboard (sandbox.withflowra.com) posts a form to /preview with
 * the visitor's sandbox workspace (`w`), a temporary read-only API key (`k`)
 * and the key's expiry (`x`). The route checks them, turns on Next.js Draft
 * Mode and keeps `w` and `k` in an httpOnly cookie. While Draft Mode is on,
 * lib/flowra.ts reads from that sandbox instead of the public demo workspace.
 *
 * The key never appears in a URL: it arrives in a POST body and lives only in
 * the cookie. The API host is never taken from the request; it comes from
 * FLOWRA_SANDBOX_API_ORIGIN, so a crafted form cannot point the site at
 * another server.
 */
import "server-only";

const PREVIEW_COOKIE_BASE_NAME = "kala_preview";
/** Flowra preview keys live one hour at most, and so does the cookie. */
export const PREVIEW_MAX_AGE_SECONDS = 60 * 60;
export const DEFAULT_SANDBOX_ORIGIN = "https://sandbox.withflowra.com";
/** Where a page sends the browser when the preview can no longer be read. */
export const PREVIEW_ENDED_PATH = "/preview?ended=1";

const WORKSPACE = /^sb-[A-Za-z0-9]{10}$/;
// Flowra keys are "cms_" plus 32 random bytes in base64url (43 characters).
const KEY = /^cms_[A-Za-z0-9_-]{43}$/;
const COOKIE_VALUE = /^(sb-[A-Za-z0-9]{10})\.(cms_[A-Za-z0-9_-]{43})$/;
const PROBE_TIMEOUT_MS = 5000;
// Expiry arrives as ISO 8601 only; Date.parse alone accepts many looser formats.
const ISO_EXPIRY = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2}(\.\d{1,3})?)?(Z|[+-]\d{2}:\d{2})$/;

export type PreviewCredentials = { workspace: string; key: string };
export type PreviewStart = ({ ok: true; maxAge: number } & PreviewCredentials) | { ok: false };

/** Secure cookies (everything except local development) use the Next.js Draft Mode rule. */
function cookieIsSecure(): boolean {
  return process.env.NODE_ENV !== "development";
}

/**
 * The one name of the preview cookie. Where the cookie is Secure it carries the
 * `__Host-` prefix, so a sibling subdomain cannot plant its own with
 * `Domain=...`; browsers reject that prefix without Secure, so local
 * development keeps the plain name. Set, read and delete all go through here.
 */
export function previewCookieName(): string {
  return cookieIsSecure() ? `__Host-${PREVIEW_COOKIE_BASE_NAME}` : PREVIEW_COOKIE_BASE_NAME;
}

/**
 * Origin of the Flowra sandbox instance: the API host for preview reads and
 * the only page allowed to start a preview. Anything that is not an http(s)
 * URL falls back to the default rather than to a request value. In production
 * only https is accepted.
 */
export function sandboxOrigin(): string {
  const raw = process.env.FLOWRA_SANDBOX_API_ORIGIN?.trim();
  if (!raw) return DEFAULT_SANDBOX_ORIGIN;
  try {
    const url = new URL(raw);
    if (url.protocol === "https:") return url.origin;
    if (url.protocol === "http:" && process.env.NODE_ENV !== "production") return url.origin;
  } catch {
    // fall through to the default
  }
  return DEFAULT_SANDBOX_ORIGIN;
}

export function previewApiBase(workspace: string): string {
  // Defense in depth: never build a URL from an unchecked workspace.
  if (!WORKSPACE.test(workspace)) throw new Error("Invalid sandbox workspace");
  return `${sandboxOrigin()}/api/v1/${workspace}`;
}

/**
 * Seconds the preview cookie may live: until the key expires, never more than
 * an hour. A missing or unreadable expiry gets the full hour (the API rejects
 * an expired key anyway); an expiry in the past means there is nothing to start.
 */
export function previewMaxAge(expiresAt: string | null, now: number): number {
  if (!expiresAt || !ISO_EXPIRY.test(expiresAt)) return PREVIEW_MAX_AGE_SECONDS;
  const at = Date.parse(expiresAt);
  if (Number.isNaN(at)) return PREVIEW_MAX_AGE_SECONDS;
  return Math.min(PREVIEW_MAX_AGE_SECONDS, Math.floor((at - now) / 1000));
}

export function parseStartForm(form: FormData, now: number): PreviewStart {
  const workspace = form.get("w");
  const key = form.get("k");
  const expiresAt = form.get("x");
  if (typeof workspace !== "string" || !WORKSPACE.test(workspace)) return { ok: false };
  if (typeof key !== "string" || !KEY.test(key)) return { ok: false };
  const maxAge = previewMaxAge(typeof expiresAt === "string" ? expiresAt : null, now);
  if (maxAge <= 0) return { ok: false };
  return { ok: true, workspace, key, maxAge };
}

export function encodePreviewCookie({ workspace, key }: PreviewCredentials): string {
  return `${workspace}.${key}`;
}

export function decodePreviewCookie(value: string | undefined): PreviewCredentials | null {
  const match = value ? COOKIE_VALUE.exec(value) : null;
  return match ? { workspace: match[1], key: match[2] } : null;
}

/**
 * Only the sandbox dashboard may start a preview. Browsers always send Origin
 * on a cross-site form POST, so another site cannot plant its own sandbox in a
 * visitor's browser and show its content under this domain.
 */
export function isDashboardOrigin(origin: string | null): boolean {
  return origin !== null && origin === sandboxOrigin();
}

/** Attributes shared by setting and clearing the preview cookie. */
export function previewCookieBase() {
  return {
    httpOnly: true as const,
    // Same rule Next.js uses for its own Draft Mode cookie.
    secure: cookieIsSecure(),
    sameSite: "lax" as const,
    path: "/" as const,
  };
}

/**
 * One read before any cookie is set: the key must open this workspace right
 * now. A key that belongs to another workspace, or has already expired, never
 * starts a preview that would fail on every page.
 */
export async function probePreview({ workspace, key }: PreviewCredentials): Promise<boolean> {
  try {
    const res = await fetch(`${previewApiBase(workspace)}/_meta`, {
      headers: { Authorization: `Bearer ${key}` },
      cache: "no-store",
      signal: AbortSignal.timeout(PROBE_TIMEOUT_MS),
    });
    if (!res.ok) return false;
    // Must be JSON (an HTML page from a proxy or captive portal is not the API);
    // reading the body also releases the connection.
    await res.json();
    return true;
  } catch {
    return false;
  }
}
