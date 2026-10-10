import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import GlobalError from "./global-error";

describe("GlobalError", () => {
  it("offers a plain link out of preview, and still the retry button", () => {
    const html = renderToStaticMarkup(createElement(GlobalError, { error: new Error("x"), reset: () => {} }));
    expect(html).toContain('<a href="/preview"');
    expect(html).toContain("Exit preview");
    expect(html).toContain("Try again");
  });
});
