import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const request = vi.hoisted(() => ({ draft: false, query: "", cookies: vi.fn() }));
vi.mock("next/headers", () => ({
  draftMode: async () => ({ isEnabled: request.draft }),
  cookies: request.cookies,
}));
vi.mock("next/navigation", () => ({ useSearchParams: () => new URLSearchParams(request.query) }));

import { PreviewNotice } from "./preview-notice";
import { PreviewStrip } from "./preview-strip";

beforeEach(() => {
  request.draft = false;
  request.query = "";
  request.cookies.mockReset();
});

describe("PreviewStrip", () => {
  it("renders nothing outside preview", async () => {
    expect(await PreviewStrip()).toBeNull();
  });

  it("in preview: the line and a plain Exit link to GET /preview, without reading cookies", async () => {
    request.draft = true;
    const html = renderToStaticMarkup((await PreviewStrip())!);
    expect(html).toContain("You&#x27;re previewing your sandbox");
    expect(html).toContain('href="/preview"');
    expect(html).toContain("Exit preview");
    expect(request.cookies).not.toHaveBeenCalled();
  });
});

describe("PreviewNotice", () => {
  it("ended and failed each get their line", () => {
    request.query = "preview=ended";
    expect(renderToStaticMarkup(createElement(PreviewNotice))).toContain("Your preview ended. Start it again from the dashboard.");
    request.query = "preview=failed";
    expect(renderToStaticMarkup(createElement(PreviewNotice))).toContain("We couldn&#x27;t start your preview.");
  });

  it("anything else renders nothing (the query string is not echoed)", () => {
    for (const q of ["", "preview=<b>x</b>", "preview=ENDED", "other=ended"]) {
      request.query = q;
      expect(renderToStaticMarkup(createElement(PreviewNotice))).toBe("");
    }
  });
});
