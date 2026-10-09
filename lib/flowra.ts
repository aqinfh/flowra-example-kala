/**
 * The only module that talks to Flowra. Every page calls these functions;
 * nothing else reads FLOWRA_API_URL or FLOWRA_API_KEY, so the key never
 * reaches the browser.
 *
 * Responses are cached for 60 seconds and tagged "flowra". With the webhook
 * set up, publishing in the dashboard calls /api/revalidate and the next
 * request gets fresh content. Without it, cached responses refresh in the
 * background after 60 seconds (stale-while-revalidate): the first visitor
 * after that window may see the old copy, later visitors get the new content.
 *
 * Lists stop at 100 entries (the API's maximum page size); paginate with
 * `offset` if you have more.
 */
import "server-only";


// width/height are present on entry images but absent on the images in /_meta.
export type FlowraImage = { url: string; w400: string; w1200: string; width?: number; height?: number };
export type Ref = { ref: string; title: string };
export type Meta = {
  siteName: string; baseUrl: string | null; metaTitle: string | null; metaDescription: string | null;
  allowIndexing: boolean; ogImage: FlowraImage | null; favicon: FlowraImage | null;
};
export type Origin = { name: string; country: string; region: string; altitude: string; process: string };
export type ShopCoffee = {
  name: string; slug: string; origin: Origin[]; tasting_notes: string; roast: string; price: string; image: string | null;
};
export type Home = {
  hero_headline: string; hero_subheading: string; hero_image: string | null; announcement_bar: string | null;
  featured_coffees: { name: string; slug: string; tasting_notes: string; price: string; image: string | null }[];
};
export type CoffeeDetail = ShopCoffee & { description: string | null; bag_photo: FlowraImage | null };
export type Article = {
  ref: string; publishedAt: string; title: string; slug: string; author: Ref[]; category: string;
  cover_image: FlowraImage | null; excerpt: string; body: string;
};
export type Cafe = { ref: string; name: string; address: string; opening_hours: string; photo: FlowraImage | null };
export type TeamMember = { ref: string; name: string; role: string; portrait: FlowraImage | null; bio: string };

export class FlowraError extends Error {
  constructor(public status: number, public path: string, detail?: string) {
    super(`Flowra request failed: ${status} ${path}${detail ? ` (${detail})` : ""}`);
    this.name = "FlowraError";
  }
}

type Json = Record<string, unknown>;
type ListItem = { ref: string; publishedAt: string; data: Json };

const str = (v: unknown): string => (typeof v === "string" ? v : "");
const strOrNull = (v: unknown): string | null => (typeof v === "string" && v !== "" ? v : null);
const arr = <T>(v: unknown): T[] => (Array.isArray(v) ? (v as T[]) : []);
const image = (v: unknown): FlowraImage | null =>
  v && typeof v === "object" && typeof (v as Json).url === "string" ? (v as FlowraImage) : null;

function config() {
  const base = process.env.FLOWRA_API_URL ?? "https://demo.withflowra.com/api/v1/kala";
  const key = process.env.FLOWRA_API_KEY;
  if (!key) throw new Error("FLOWRA_API_KEY is not set. Copy .env.example to .env.local.");
  return { base: base.replace(/\/$/, ""), key };
}

async function get<T = Json>(path: string): Promise<T> {
  const { base, key } = config();
  const res = await fetch(`${base}${path}`, {
    headers: { Authorization: `Bearer ${key}` },
    next: { revalidate: 60, tags: ["flowra"] },
  });
  if (!res.ok) throw new FlowraError(res.status, path);
  try {
    return (await res.json()) as T;
  } catch {
    throw new FlowraError(res.status, path, "response body was not valid JSON");
  }
}

// ---- pure mappers (unit-tested against recorded responses) ----

export function mapMeta(json: unknown): Meta {
  const d = ((json as Json).data ?? {}) as Json;
  return {
    siteName: str(d.siteName),
    baseUrl: strOrNull(d.baseUrl),
    metaTitle: strOrNull(d.metaTitle),
    metaDescription: strOrNull(d.metaDescription),
    allowIndexing: d.allowIndexing === true,
    ogImage: image(d.ogImage),
    favicon: image(d.favicon),
  };
}

export function mapHome(json: unknown): Home {
  const h = (((json as Json).data ?? {}) as Json).homepage as Json ?? {};
  return {
    hero_headline: str(h.hero_headline),
    hero_subheading: str(h.hero_subheading),
    hero_image: strOrNull(h.hero_image),
    announcement_bar: strOrNull(h.announcement_bar),
    featured_coffees: arr<Json>(h.featured_coffees).map((c) => ({
      name: str(c.name), slug: str(c.slug), tasting_notes: str(c.tasting_notes),
      price: str(c.price), image: strOrNull(c.image),
    })),
  };
}

function mapShopCoffee(c: Json): ShopCoffee {
  return {
    name: str(c.name), slug: str(c.slug),
    origin: arr<Json>(c.origin).map((o) => ({
      name: str(o.name), country: str(o.country), region: str(o.region),
      altitude: str(o.altitude), process: str(o.process),
    })),
    tasting_notes: str(c.tasting_notes), roast: str(c.roast), price: str(c.price), image: strOrNull(c.image),
  };
}

export function mapShop(json: unknown): ShopCoffee[] {
  const d = ((json as Json).data ?? {}) as Json;
  return arr<Json>(d.coffees).map(mapShopCoffee);
}

export function mapList<T>(json: unknown, mapItem: (item: ListItem) => T): T[] {
  return arr<ListItem>((json as Json).data).map(mapItem);
}

export const mapArticle = (i: ListItem): Article => ({
  ref: i.ref, publishedAt: i.publishedAt,
  title: str(i.data.title), slug: str(i.data.slug), author: arr<Ref>(i.data.author),
  category: str(i.data.category), cover_image: image(i.data.cover_image),
  excerpt: str(i.data.excerpt), body: str(i.data.body),
});

export const mapCafe = (i: ListItem): Cafe => ({
  ref: i.ref, name: str(i.data.name), address: str(i.data.address),
  opening_hours: str(i.data.opening_hours), photo: image(i.data.photo),
});

export const mapTeamMember = (i: ListItem): TeamMember => ({
  ref: i.ref, name: str(i.data.name), role: str(i.data.role),
  portrait: image(i.data.portrait), bio: str(i.data.bio),
});

export function findBySlug<T extends { slug: string }>(items: T[], slug: string): T | null {
  return items.find((x) => x.slug === slug) ?? null;
}

/**
 * The composed /e/shop endpoint carries each coffee's full origin; the
 * /coffees resource carries the description and the bag photo with its
 * Flowra resize URLs. A detail page needs both, matched by slug.
 */
export function mapCoffeeDetail(slug: string, shop: ShopCoffee[], coffeesJson: unknown): CoffeeDetail | null {
  const base = findBySlug(shop, slug);
  if (!base) return null;
  const raw = arr<ListItem>((coffeesJson as Json).data).find((i) => str(i.data.slug) === slug);
  return {
    ...base,
    description: raw ? strOrNull(raw.data.description) : null,
    bag_photo: raw ? image(raw.data.bag_photo) : null,
  };
}

// ---- data functions used by pages ----

export async function getMeta(): Promise<Meta> { return mapMeta(await get("/_meta")); }
export async function getHome(): Promise<Home> { return mapHome(await get("/e/home")); }
export async function getShop(): Promise<ShopCoffee[]> { return mapShop(await get("/e/shop")); }

export async function getCoffeeBySlug(slug: string): Promise<CoffeeDetail | null> {
  const [shop, coffees] = await Promise.all([getShop(), get("/coffees?limit=100")]);
  return mapCoffeeDetail(slug, shop, coffees);
}

// Explicit sort on journal: the default changes if an editor turns on manual ordering.
export async function listJournal(limit = 100): Promise<Article[]> {
  return mapList(await get(`/journal?limit=${limit}&sort=publishedAt&order=desc`), mapArticle);
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  // Flowra slug fields are not unique addresses, so look the slug up in the list.
  return findBySlug(await listJournal(), slug);
}

export async function listCafes(): Promise<Cafe[]> { return mapList(await get("/cafes"), mapCafe); }
export async function listTeam(): Promise<TeamMember[]> { return mapList(await get("/team"), mapTeamMember); }
