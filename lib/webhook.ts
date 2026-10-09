import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Flowra signs every webhook: header `x-cms-signature: sha256=<hex>`, an
 * HMAC-SHA256 of the raw request body with the workspace's webhook secret.
 * Always verify against the raw body; re-serialising parsed JSON changes the bytes.
 */
export function verifySignature(secret: string, rawBody: string, header: string | null): boolean {
  if (!secret || !header) return false;
  const match = /^sha256=([0-9a-f]{64})$/.exec(header);
  if (!match) return false;
  const expected = createHmac("sha256", secret).update(rawBody).digest();
  const given = Buffer.from(match[1], "hex");
  return given.length === expected.length && timingSafeEqual(given, expected);
}
