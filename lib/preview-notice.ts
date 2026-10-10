/**
 * One-line notices after a preview starts badly or ends, keyed by the
 * `?preview=` value that GET/POST /preview redirect to. No server-only import:
 * the notice renders in the browser so the home page stays static.
 */
export const PREVIEW_NOTICES = {
  ended: "Your preview ended. Start it again from the dashboard.",
  failed: "We couldn't start your preview. Start it again from the dashboard.",
} as const;

export function previewNotice(value: string | null): string | null {
  return value === "ended" || value === "failed" ? PREVIEW_NOTICES[value] : null;
}
