import { afterEach, describe, expect, it, vi } from "vitest";
import meta from "@/test/fixtures/_meta.json";
import home from "@/test/fixtures/e-home.json";
import shop from "@/test/fixtures/e-shop.json";
import coffees from "@/test/fixtures/coffees.json";
import journal from "@/test/fixtures/journal.json";
import cafes from "@/test/fixtures/cafes.json";
import team from "@/test/fixtures/team.json";
import {
  findBySlug, getMeta, mapArticle, mapCafe, mapCoffeeDetail, mapHome, mapList, mapMeta, mapShop, mapTeamMember,
} from "./flowra";

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
