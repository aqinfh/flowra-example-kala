import { describe, expect, it } from "vitest";
import { sanitizeArticleHtml } from "./sanitize";

describe("sanitizeArticleHtml", () => {
  it("keeps legitimate article markup", () => {
    const html = '<h2>Title</h2><p>Text <strong>bold</strong> <em>it</em> <a href="https://x.com">link</a></p><blockquote>q</blockquote><ul><li>a</li></ul>';
    const out = sanitizeArticleHtml(html);
    expect(out).toContain("<h2>Title</h2>");
    expect(out).toContain('<a href="https://x.com"');
    expect(out).toContain("<blockquote>q</blockquote>");
    expect(out).toContain("<li>a</li>");
  });
  it("drops scripts, event handlers, javascript: links and iframes", () => {
    const out = sanitizeArticleHtml(
      '<p onclick="x()">ok</p><script>alert(1)</script><img src="https://i.test/a.webp" onerror="x()"><a href="javascript:alert(1)">bad</a><iframe src="https://evil.test"></iframe>',
    );
    expect(out).toContain("<p>ok</p>");
    expect(out).not.toMatch(/script|onclick|onerror|javascript:|iframe/i);
    expect(out).toContain('src="https://i.test/a.webp"');
  });
  it("rejects non-https images and links get rel noopener", () => {
    const out = sanitizeArticleHtml('<img src="http://i.test/a.png"><a href="https://x.com">x</a>');
    expect(out).not.toContain("http://i.test");
    expect(out).toContain('rel="noopener noreferrer"');
  });
  it("keeps http links", () => {
    expect(sanitizeArticleHtml('<a href="http://x.test/a">h</a>')).toContain('href="http://x.test/a"');
  });
  it("drops the href of mailto links", () => {
    const out = sanitizeArticleHtml('<a href="mailto:a@b.test">m</a>');
    expect(out).not.toContain("mailto:");
    expect(out).not.toContain("href");
  });
  it("drops data: image sources", () => {
    const out = sanitizeArticleHtml('<img src="data:image/png;base64,iVBORw0KGgo=" alt="x">');
    expect(out).not.toContain("data:");
    expect(out).not.toContain("src");
  });
  it("overrides author rel on links", () => {
    const out = sanitizeArticleHtml('<a href="https://x.com" target="_blank" rel="opener">x</a>');
    expect(out).toContain('rel="noopener noreferrer"');
    expect(out).not.toContain('rel="opener"');
  });
});
