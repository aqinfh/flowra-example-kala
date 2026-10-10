import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  decodePreviewCookie, encodePreviewCookie, isDashboardOrigin, parseStartForm, previewApiBase, previewCookieBase, previewCookieName,
  previewMaxAge, probePreview, sandboxOrigin,
} from "./preview";

const NOW = Date.parse("2026-10-10T10:00:00Z");
const W = "sb-Abc123XYZ0";
const K = `cms_${"a".repeat(40)}-_9`;
const iso = (ms: number) => new Date(ms).toISOString();
const form = (fields: Record<string, string>) => {
  const f = new FormData();
  for (const [name, value] of Object.entries(fields)) f.append(name, value);
  return f;
};

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("parseStartForm", () => {
  it("accepts a sandbox workspace and a Flowra key, with the key's remaining life", () => {
    expect(parseStartForm(form({ w: W, k: K, x: iso(NOW + 20 * 60_000) }), NOW))
      .toEqual({ ok: true, workspace: W, key: K, maxAge: 1200 });
  });

  it("rejects anything that is not a sandbox workspace", () => {
    for (const w of ["", "kala", "sb-short", "sb-Abc123XYZ01", "sb-Abc123XY_0", "sb-Abc123XYZ0/../x", " sb-Abc123XYZ0"]) {
      expect(parseStartForm(form({ w, k: K }), NOW)).toEqual({ ok: false });
    }
    expect(parseStartForm(form({ k: K }), NOW)).toEqual({ ok: false });
  });

  it("rejects anything that is not a Flowra key", () => {
    for (const k of ["", "cms_", `cms_${"a".repeat(42)}`, `cms_${"a".repeat(44)}`, `key_${"a".repeat(43)}`, `cms_${"a".repeat(42)}.`]) {
      expect(parseStartForm(form({ w: W, k }), NOW)).toEqual({ ok: false });
    }
    expect(parseStartForm(form({ w: W }), NOW)).toEqual({ ok: false });
  });

  it("rejects a key that has already expired", () => {
    expect(parseStartForm(form({ w: W, k: K, x: iso(NOW - 1000) }), NOW)).toEqual({ ok: false });
  });
});

describe("previewMaxAge", () => {
  it("never more than an hour", () => {
    expect(previewMaxAge(iso(NOW + 3 * 3_600_000), NOW)).toBe(3600);
  });
  it("missing or unreadable expiry gets the full hour", () => {
    expect(previewMaxAge(null, NOW)).toBe(3600);
    expect(previewMaxAge("not a date", NOW)).toBe(3600);
  });
  it("only ISO 8601 is read; looser date formats count as unreadable", () => {
    for (const x of ["Oct 10 2026 10:05:00 UTC", "2026-10-10", "10/10/2026", "1791626700000", "2026-10-10 10:05:00Z"]) {
      expect(previewMaxAge(x, NOW)).toBe(3600);
    }
    expect(previewMaxAge("2026-10-10T10:05:00Z", NOW)).toBe(300);
    expect(previewMaxAge("2026-10-10T10:05:00.500+00:00", NOW)).toBe(300);
    expect(previewMaxAge("2026-10-10T10:05Z", NOW)).toBe(300);
  });
});

describe("preview cookie", () => {
  it("round-trips workspace and key", () => {
    expect(decodePreviewCookie(encodePreviewCookie({ workspace: W, key: K }))).toEqual({ workspace: W, key: K });
  });
  it("anything else reads as no preview", () => {
    for (const v of [undefined, "", "garbage", `${W}.short`, `kala.${K}`, `${W}:${K}`, `${W}.${K}x`]) {
      expect(decodePreviewCookie(v)).toBeNull();
    }
  });
});

describe("sandboxOrigin", () => {
  it("defaults to the Flowra sandbox", () => {
    vi.stubEnv("FLOWRA_SANDBOX_API_ORIGIN", "");
    expect(sandboxOrigin()).toBe("https://sandbox.withflowra.com");
    expect(previewApiBase(W)).toBe(`https://sandbox.withflowra.com/api/v1/${W}`);
  });
  it("takes only the origin of the env value", () => {
    vi.stubEnv("FLOWRA_SANDBOX_API_ORIGIN", "http://localhost:3000/some/path/");
    expect(previewApiBase(W)).toBe(`http://localhost:3000/api/v1/${W}`);
  });
  it("refuses a workspace that is not a sandbox slug", () => {
    for (const w of ["kala", "sb-short", "sb-Abc123XYZ0/../x", "", "sb-Abc123XYZ0?x=1"]) {
      expect(() => previewApiBase(w)).toThrow();
    }
  });
  it("production accepts https only; http is for development and tests", () => {
    vi.stubEnv("FLOWRA_SANDBOX_API_ORIGIN", "http://localhost:3000");
    vi.stubEnv("NODE_ENV", "production");
    expect(sandboxOrigin()).toBe("https://sandbox.withflowra.com");
    vi.stubEnv("FLOWRA_SANDBOX_API_ORIGIN", "https://sandbox.example.test");
    expect(sandboxOrigin()).toBe("https://sandbox.example.test");
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv("FLOWRA_SANDBOX_API_ORIGIN", "http://localhost:3000");
    expect(sandboxOrigin()).toBe("http://localhost:3000");
  });
  it("an unusable env value falls back to the default", () => {
    for (const v of ["not a url", "javascript:alert(1)", "ftp://sandbox.withflowra.com"]) {
      vi.stubEnv("FLOWRA_SANDBOX_API_ORIGIN", v);
      expect(sandboxOrigin()).toBe("https://sandbox.withflowra.com");
    }
  });
});

describe("isDashboardOrigin", () => {
  it("only the sandbox origin, exactly", () => {
    vi.stubEnv("FLOWRA_SANDBOX_API_ORIGIN", "");
    expect(isDashboardOrigin("https://sandbox.withflowra.com")).toBe(true);
    for (const o of [null, "null", "https://evil.example", "https://sandbox.withflowra.com.evil.example", "http://sandbox.withflowra.com", "https://sandbox.withflowra.com/"]) {
      expect(isDashboardOrigin(o)).toBe(false);
    }
  });
});

describe("previewCookieName", () => {
  it("__Host- prefixed wherever the cookie is Secure, plain in development", () => {
    vi.stubEnv("NODE_ENV", "development");
    expect(previewCookieName()).toBe("kala_preview");
    vi.stubEnv("NODE_ENV", "production");
    expect(previewCookieName()).toBe("__Host-kala_preview");
    expect(previewCookieBase()).toMatchObject({ secure: true, path: "/" });
    expect(previewCookieBase()).not.toHaveProperty("domain");
  });
});

describe("previewCookieBase", () => {
  it("secure everywhere except development", () => {
    vi.stubEnv("NODE_ENV", "development");
    expect(previewCookieBase().secure).toBe(false);
    vi.stubEnv("NODE_ENV", "production");
    expect(previewCookieBase().secure).toBe(true);
    vi.stubEnv("NODE_ENV", "test");
    expect(previewCookieBase().secure).toBe(true);
  });
});

describe("isDashboardOrigin with a custom origin", () => {
  it("matches the exact origin including port", () => {
    vi.stubEnv("FLOWRA_SANDBOX_API_ORIGIN", "http://localhost:3005");
    expect(isDashboardOrigin("http://localhost:3005")).toBe(true);
    expect(isDashboardOrigin("http://localhost:3006")).toBe(false);
    expect(isDashboardOrigin("http://localhost")).toBe(false);
  });
});

describe("probePreview", () => {
  beforeEach(() => {
    vi.stubEnv("FLOWRA_SANDBOX_API_ORIGIN", "");
  });
  it("reads /_meta of that workspace with the key, never from cache", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, status: 200, json: async () => ({}) });
    vi.stubGlobal("fetch", fetchMock);
    expect(await probePreview({ workspace: W, key: K })).toBe(true);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe(`https://sandbox.withflowra.com/api/v1/${W}/_meta`);
    expect(init.headers).toEqual({ Authorization: `Bearer ${K}` });
    expect(init.cache).toBe("no-store");
    expect(init.next).toBeUndefined();
    expect(init.signal).toBeInstanceOf(AbortSignal);
  });
  it("a 2xx that is not JSON is a no", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      ok: true, status: 200,
      json: async () => { throw new SyntaxError("Unexpected token <"); },
    }));
    expect(await probePreview({ workspace: W, key: K })).toBe(false);
  });
  it("a 2xx with a JSON body is a yes", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, status: 200, json: async () => ({ name: "x" }) }));
    expect(await probePreview({ workspace: W, key: K })).toBe(true);
  });
  it("a rejected key or a network failure is a no", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, status: 401 }));
    expect(await probePreview({ workspace: W, key: K })).toBe(false);
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("fetch failed")));
    expect(await probePreview({ workspace: W, key: K })).toBe(false);
  });
});
