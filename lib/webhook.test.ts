import { createHmac } from "node:crypto";
import { describe, expect, it } from "vitest";
import { verifySignature } from "./webhook";

const secret = "s3cret";
const body = JSON.stringify({ event: "publish", productSlug: "kala", contentVersion: 2, at: "2026-10-09T00:00:00Z" });
const sign = (b: string) => `sha256=${createHmac("sha256", secret).update(b).digest("hex")}`;

describe("verifySignature", () => {
  it("accepts the exact body", () => expect(verifySignature(secret, body, sign(body))).toBe(true));
  it("rejects a changed body with the old signature", () =>
    expect(verifySignature(secret, body + " ", sign(body))).toBe(false));
  it("rejects a missing or malformed header", () => {
    expect(verifySignature(secret, body, null)).toBe(false);
    expect(verifySignature(secret, body, "md5=abc")).toBe(false);
    expect(verifySignature(secret, body, "sha256=zz")).toBe(false);
  });
  it("rejects an empty secret", () => expect(verifySignature("", body, sign(body))).toBe(false));
});
