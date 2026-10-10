import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const next = vi.hoisted(() => ({
  enable: vi.fn(),
  disable: vi.fn(),
  set: vi.fn(),
  delete: vi.fn(),
}));
vi.mock("next/headers", () => ({
  draftMode: async () => ({ isEnabled: false, enable: next.enable, disable: next.disable }),
  cookies: async () => ({ set: next.set, delete: next.delete, get: () => undefined }),
}));

import { GET, POST } from "./route";

const DASHBOARD = "https://sandbox.withflowra.com";
const W = "sb-Abc123XYZ0";
const K = `cms_${"k".repeat(43)}`;

function start(fields: Record<string, string>, headers: Record<string, string> = { origin: DASHBOARD }) {
  return POST(new Request("https://kala.withflowra.com/preview", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded", ...headers },
    body: new URLSearchParams(fields),
  }));
}

function expectNoLeak(res: Response) {
  expect(res.status).toBe(303);
  expect(res.headers.get("cache-control")).toBe("private, no-store");
  expect(res.headers.get("referrer-policy")).toBe("no-referrer");
  expect(res.headers.get("location")).not.toContain("cms_");
  expect(res.headers.get("location")).not.toContain(W);
}

function expectNothingStarted() {
  expect(next.enable).not.toHaveBeenCalled();
  expect(next.set).not.toHaveBeenCalled();
}

let fetchMock: ReturnType<typeof vi.fn>;
beforeEach(() => {
  vi.stubEnv("FLOWRA_SANDBOX_API_ORIGIN", "");
  for (const f of Object.values(next)) f.mockReset();
  fetchMock = vi.fn().mockResolvedValue({ ok: true, status: 200, json: async () => ({}) });
  vi.stubGlobal("fetch", fetchMock);
});
afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("POST /preview", () => {
  it("from the dashboard with a working key: Draft Mode on, cookie set, back to the home page", async () => {
    const x = new Date(Date.now() + 30 * 60_000).toISOString();
    const res = await start({ w: W, k: K, x });
    expectNoLeak(res);
    expect(res.headers.get("location")).toBe("/");
    expect(next.enable).toHaveBeenCalledTimes(1);
    expect(next.set).toHaveBeenCalledTimes(1);
    const [name, value, options] = next.set.mock.calls[0];
    expect(name).toBe("__Host-kala_preview");
    expect(value).toBe(`${W}.${K}`);
    expect(options).toMatchObject({ httpOnly: true, secure: true, sameSite: "lax", path: "/" });
    expect(options.maxAge).toBeGreaterThan(1790);
    expect(options.maxAge).toBeLessThanOrEqual(1800);
    expect(fetchMock.mock.calls[0][0]).toBe(`${DASHBOARD}/api/v1/${W}/_meta`);
  });

  it("the cookie never outlives an hour, whatever x says", async () => {
    await start({ w: W, k: K, x: new Date(Date.now() + 5 * 3_600_000).toISOString() });
    expect(next.set.mock.calls[0][2].maxAge).toBe(3600);
  });

  it("from any other page (or with no Origin): refused, nothing set, nothing fetched", async () => {
    for (const headers of [{ origin: "https://evil.example" }, { origin: "null" }, {} as Record<string, string>]) {
      const res = await start({ w: W, k: K }, headers);
      expectNoLeak(res);
      expect(res.headers.get("location")).toBe("/?preview=failed");
    }
    expectNothingStarted();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("malformed workspace or key: refused before any fetch", async () => {
    const cases: Record<string, string>[] = [{ w: "kala", k: K }, { w: W, k: "cms_short" }, { w: W }, {}];
    for (const fields of cases) {
      const res = await start(fields);
      expectNoLeak(res);
      expect(res.headers.get("location")).toBe("/?preview=failed");
    }
    expectNothingStarted();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("a key the sandbox rejects (expired, other workspace): refused, no cookie", async () => {
    fetchMock.mockResolvedValue({ ok: false, status: 404 });
    const res = await start({ w: W, k: K });
    expectNoLeak(res);
    expect(res.headers.get("location")).toBe("/?preview=failed");
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expectNothingStarted();
  });

  it("an unreadable body from the dashboard: refused, nothing set, nothing fetched", async () => {
    for (const headers of [
      { origin: DASHBOARD, "content-type": "multipart/form-data; boundary=x" },
      { origin: DASHBOARD, "content-type": "text/plain" },
    ]) {
      const res = await POST(new Request("https://kala.withflowra.com/preview", { method: "POST", headers, body: "garbage" }));
      expectNoLeak(res);
      expect(res.headers.get("location")).toBe("/?preview=failed");
    }
    expectNothingStarted();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("the API host cannot be steered from the request", async () => {
    await start(
      { w: W, k: K, base: "https://evil.example", origin: "https://evil.example" },
      { origin: DASHBOARD, host: "evil.example", "x-forwarded-host": "evil.example" },
    );
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls[0][0]).toBe(`${DASHBOARD}/api/v1/${W}/_meta`);
  });
});

describe("GET /preview", () => {
  async function expectExit(url: string, location: string) {
    const res = await GET(new Request(url));
    expectNoLeak(res);
    expect(res.headers.get("location")).toBe(location);
    expect(next.disable).toHaveBeenCalledTimes(1);
    expect(next.delete).toHaveBeenCalledTimes(1);
    expect(next.delete).toHaveBeenCalledWith(expect.objectContaining({ name: "__Host-kala_preview", httpOnly: true, secure: true, sameSite: "lax", path: "/" }));
    expectNothingStarted();
    expect(fetchMock).not.toHaveBeenCalled();
  }

  it("ends the preview: Draft Mode off, cookie cleared, home page", async () => {
    await expectExit("https://kala.withflowra.com/preview", "/");
  });

  it("?ended=1 also switches Draft Mode off and clears the cookie, then shows the ended notice", async () => {
    await expectExit("https://kala.withflowra.com/preview?ended=1", "/?preview=ended");
  });

  it("never starts a preview, even with credentials in the query string", async () => {
    await expectExit(`https://kala.withflowra.com/preview?w=${W}&k=${K}`, "/");
  });
});
