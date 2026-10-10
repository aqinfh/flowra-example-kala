import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import shop from "@/test/fixtures/e-shop.json";
import journal from "@/test/fixtures/journal.json";

// At build time Next.js runs generateStaticParams with no request, and
// draftMode() throws there. Calling it would only fail on `next build`
// (Vercel), never in a dev server, so this test makes it fail here instead.
vi.mock("next/headers", () => ({
  draftMode: () => { throw new Error("draftMode() used inside generateStaticParams"); },
  cookies: () => { throw new Error("cookies() used inside generateStaticParams"); },
}));

import { generateStaticParams as coffeeParams } from "./coffees/[slug]/page";
import { generateStaticParams as articleParams } from "./journal/[slug]/page";

describe("generateStaticParams reads the public workspace without Draft Mode", () => {
  const env = { ...process.env };
  let fetchMock: ReturnType<typeof vi.fn>;
  beforeEach(() => {
    process.env.FLOWRA_API_URL = "https://demo.example/api/v1/kala";
    process.env.FLOWRA_API_KEY = "public-key";
    fetchMock = vi.fn(async (url: string) => ({
      ok: true, status: 200, json: async () => (url.includes("/e/shop") ? shop : journal),
    }));
    vi.stubGlobal("fetch", fetchMock);
  });
  afterEach(() => { vi.unstubAllGlobals(); process.env = { ...env }; });

  it("coffees", async () => {
    const params = await coffeeParams();
    expect(params).toContainEqual({ slug: shop.data.coffees[0].slug });
    expect(fetchMock.mock.calls[0][0]).toBe("https://demo.example/api/v1/kala/e/shop");
  });

  it("journal", async () => {
    const params = await articleParams();
    expect(params).toContainEqual({ slug: journal.data[0].data.slug });
    expect(fetchMock.mock.calls[0][0]).toMatch(/^https:\/\/demo\.example\/api\/v1\/kala\/journal\?/);
  });
});
