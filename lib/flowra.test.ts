import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Draft Mode and the cookie jar are per request in Next.js; here each test sets them.
const request = vi.hoisted(() => ({
  draft: false,
  cookie: undefined as string | undefined,
  draftMode: vi.fn(),
  cookies: vi.fn(),
}));
vi.mock("next/headers", () => ({ draftMode: request.draftMode, cookies: request.cookies }));
vi.mock("next/navigation", () => ({
  redirect: (url: string): never => { throw new Error(`NEXT_REDIRECT:${url}`); },
}));

import meta from "@/test/fixtures/_meta.json";
import home from "@/test/fixtures/e-home.json";
import shop from "@/test/fixtures/e-shop.json";
import coffees from "@/test/fixtures/coffees.json";
import journal from "@/test/fixtures/journal.json";
import cafes from "@/test/fixtures/cafes.json";
import team from "@/test/fixtures/team.json";
import {
  findBySlug, getCoffeeBySlug, getHome, getMeta, mapArticle, mapCafe, mapCoffeeDetail, mapHome, mapList, mapMeta,
  mapShop, mapTeamMember, PUBLIC_SOURCE,
} from "./flowra";

beforeEach(() => {
  request.draft = false;
  request.cookie = undefined;
  request.draftMode.mockReset().mockImplementation(async () => ({ isEnabled: request.draft }));
  request.cookies.mockReset().mockImplementation(async () => ({
    get: (name: string) => (name === "kala_preview" && request.cookie !== undefined ? { name, value: request.cookie } : undefined),
  }));
});

describe("mappers on recorded demo responses", () => {
  it("meta", () => {
    const m = mapMeta(meta);
    expect(m.siteName).toBe("Kala Coffee Roasters");
    expect(m.allowIndexing).toBe(false);
    expect(m.ogImage?.w1200).toContain("?w=1200");
  });

  it("home", () => {
    const h = mapHome(home);
    expect(h.hero_headline.length).toBeGreaterThan(0);
    expect(h.featured_coffees.length).toBeGreaterThan(0);
    expect(h.featured_coffees[0]).toHaveProperty("slug");
  });

  it("shop coffees carry nested origin", () => {
    const s = mapShop(shop);
    expect(s.length).toBe(shop.data.coffees.length);
    expect(s[0].origin[0]).toHaveProperty("country");
  });

  it("journal list", () => {
    const list = mapList(journal, mapArticle);
    expect(list.length).toBe(journal.data.length);
    expect(list[0].body).toContain("<p>");
    expect(list[0].author[0]).toHaveProperty("title");
  });

  it("cafes and team", () => {
    expect(mapList(cafes, mapCafe)[0].opening_hours).toContain("\n");
    expect(mapList(team, mapTeamMember)[0].role.length).toBeGreaterThan(0);
  });

  it("coffee detail merges shop (origin) and coffees (description, bag photo)", () => {
    const slug = shop.data.coffees[0].slug;
    const d = mapCoffeeDetail(slug, mapShop(shop), coffees);
    expect(d?.origin[0]).toHaveProperty("country");
    expect(d?.bag_photo?.w400).toContain("?w=400");
  });

  it("findBySlug: hit and miss", () => {
    const list = mapList(journal, mapArticle);
    expect(findBySlug(list, list[0].slug)?.title).toBe(list[0].title);
    expect(findBySlug(list, "does-not-exist")).toBeNull();
  });

  it("missing optional fields do not throw", () => {
    const broken = structuredClone(journal) as unknown as { data: { data: Record<string, unknown> }[] };
    broken.data[0].data.cover_image = null;
    broken.data[0].data.author = [];
    const a = mapList(broken, mapArticle)[0];
    expect(a.cover_image).toBeNull();
    expect(a.author).toEqual([]);
    const bareHome = structuredClone(home) as unknown as { data: { homepage: Record<string, unknown> } };
    delete bareHome.data.homepage.announcement_bar;
    bareHome.data.homepage.hero_image = null;
    const h = mapHome(bareHome);
    expect(h.announcement_bar).toBeNull();
    expect(h.hero_image).toBeNull();
  });
});

describe("get() error handling", () => {
  const env = { ...process.env };
  afterEach(() => { vi.unstubAllGlobals(); process.env = { ...env }; });
  const setup = (res: Partial<Response>) => {
    process.env.FLOWRA_API_KEY = "k";
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(res));
  };

  it("throws FlowraError with status and path on non-2xx", async () => {
    setup({ ok: false, status: 503 });
    await expect(getMeta()).rejects.toMatchObject({ name: "FlowraError", status: 503, path: "/_meta" });
  });

  it("throws FlowraError naming the path when the body is not JSON", async () => {
    setup({ ok: true, status: 200, json: () => Promise.reject(new SyntaxError("bad")) });
    await expect(getMeta()).rejects.toThrow(/\/_meta.*not valid JSON/);
  });
});

describe("where reads go", () => {
  const W = "sb-Abc123XYZ0";
  const K = `cms_${"p".repeat(43)}`;
  const env = { ...process.env };
  let fetchMock: ReturnType<typeof vi.fn>;
  beforeEach(() => {
    process.env.FLOWRA_API_URL = "https://demo.example/api/v1/kala";
    process.env.FLOWRA_API_KEY = "public-key";
    delete process.env.FLOWRA_SANDBOX_API_ORIGIN;
    fetchMock = vi.fn().mockResolvedValue({ ok: true, status: 200, json: async () => home });
    vi.stubGlobal("fetch", fetchMock);
  });
  afterEach(() => { vi.unstubAllGlobals(); process.env = { ...env }; });

  it("public: the demo workspace, cached 60 s and tagged, and the cookie jar is never opened", async () => {
    request.cookie = `${W}.${K}`; // a stale preview cookie alone changes nothing
    await getHome();
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://demo.example/api/v1/kala/e/home");
    expect(init.headers).toEqual({ Authorization: "Bearer public-key" });
    expect(init.next).toEqual({ revalidate: 60, tags: ["flowra"] });
    expect(init.cache).toBeUndefined();
    expect(request.cookies).not.toHaveBeenCalled();
  });

  it("preview: the sandbox from the cookie, with its key, never cached or tagged", async () => {
    request.draft = true;
    request.cookie = `${W}.${K}`;
    await getHome();
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe(`https://sandbox.withflowra.com/api/v1/${W}/e/home`);
    expect(init.headers).toEqual({ Authorization: `Bearer ${K}` });
    expect(init.cache).toBe("no-store");
    expect(init.next).toBeUndefined();
  });

  it("preview host comes only from FLOWRA_SANDBOX_API_ORIGIN, never from FLOWRA_API_URL", async () => {
    process.env.FLOWRA_SANDBOX_API_ORIGIN = "http://localhost:3000";
    request.draft = true;
    request.cookie = `${W}.${K}`;
    await getHome();
    expect(fetchMock.mock.calls[0][0]).toBe(`http://localhost:3000/api/v1/${W}/e/home`);
  });

  it("preview: both reads of a coffee detail go to the sandbox", async () => {
    request.draft = true;
    request.cookie = `${W}.${K}`;
    fetchMock.mockImplementation(async (url: string) => ({
      ok: true, status: 200, json: async () => (url.includes("/e/shop") ? shop : coffees),
    }));
    await getCoffeeBySlug(shop.data.coffees[0].slug);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    for (const [url, init] of fetchMock.mock.calls) {
      expect(url.startsWith(`https://sandbox.withflowra.com/api/v1/${W}/`)).toBe(true);
      expect(init.cache).toBe("no-store");
    }
  });

  it("Draft Mode without a readable preview cookie leaves preview before any read", async () => {
    request.draft = true;
    for (const cookie of [undefined, "garbage", `${W}.short`]) {
      request.cookie = cookie;
      await expect(getHome()).rejects.toThrow("NEXT_REDIRECT:/preview?ended=1");
    }
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("preview answered 401 (key expired, sandbox reset): leave preview with a notice", async () => {
    request.draft = true;
    request.cookie = `${W}.${K}`;
    fetchMock.mockResolvedValue({ ok: false, status: 401 });
    await expect(getHome()).rejects.toThrow("NEXT_REDIRECT:/preview?ended=1");
  });

  it("other preview failures are ordinary FlowraErrors (error page, preview stays on)", async () => {
    request.draft = true;
    request.cookie = `${W}.${K}`;
    fetchMock.mockResolvedValue({ ok: false, status: 503 });
    await expect(getHome()).rejects.toMatchObject({ name: "FlowraError", status: 503, path: "/e/home" });
  });

  it("a public 401 is an error, not a preview exit", async () => {
    fetchMock.mockResolvedValue({ ok: false, status: 401 });
    await expect(getHome()).rejects.toMatchObject({ name: "FlowraError", status: 401 });
  });

  it("PUBLIC_SOURCE skips Draft Mode entirely (generateStaticParams has no request)", async () => {
    request.draftMode.mockImplementation(() => { throw new Error("draftMode() outside a request"); });
    await getHome(PUBLIC_SOURCE);
    expect(request.draftMode).not.toHaveBeenCalled();
    expect(fetchMock.mock.calls[0][0]).toBe("https://demo.example/api/v1/kala/e/home");
  });
});
