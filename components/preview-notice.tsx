"use client";

import { useSearchParams } from "next/navigation";
import { PREVIEW_BAND_CLASS, previewNotice } from "@/lib/preview-notice";

/**
 * Read in the browser, not on the server: searchParams on the server would
 * make every page dynamic. The layout wraps this in <Suspense>, inside an
 * always-present live region, so the text is announced when it appears and
 * the empty wrapper takes no space.
 */
export function PreviewNotice() {
  const text = previewNotice(useSearchParams().get("preview"));
  if (!text) return null;
  return (
    <div className={PREVIEW_BAND_CLASS}>
      <p>{text}</p>
    </div>
  );
}
