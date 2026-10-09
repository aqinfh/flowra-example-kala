import { sanitizeArticleHtml } from "@/lib/sanitize";

/**
 * Renders rich text from Flowra (article bodies, coffee descriptions). This is
 * the only place in the app that sets HTML directly, and it always sanitizes
 * first.
 */
export function RichText({ html, className = "" }: { html: string; className?: string }) {
  return <div className={`prose-ticket ${className}`} dangerouslySetInnerHTML={{ __html: sanitizeArticleHtml(html) }} />;
}
