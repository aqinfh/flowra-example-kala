import sanitizeHtml from "sanitize-html";

/**
 * Journal bodies are HTML written in the Flowra dashboard. Today that is our
 * own content, but in a sandboxed demo anyone could edit it, so it is cleaned
 * on the server before it is rendered: no scripts, no event handlers, links
 * over http/https only, and images over https only.
 */
export function sanitizeArticleHtml(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: [
      "p", "br", "h2", "h3", "h4", "ul", "ol", "li", "blockquote", "strong", "em", "b", "i", "u",
      "code", "pre", "a", "img", "figure", "figcaption", "table", "thead", "tbody", "tr", "th", "td", "hr",
    ],
    allowedAttributes: { a: ["href", "rel", "target"], img: ["src", "alt", "width", "height"] },
    allowedSchemes: ["https"],
    allowedSchemesByTag: { a: ["https", "http"], img: ["https"] },
    allowProtocolRelative: false,
    transformTags: { a: sanitizeHtml.simpleTransform("a", { rel: "noopener noreferrer" }) },
  });
}
