"use client";

import { useSearchParams } from "next/navigation";
import { previewNotice } from "@/lib/preview-notice";

/**
 * Read in the browser, not on the server: searchParams on the server would
 * make every page dynamic. The layout wraps this in <Suspense>.
 */
export function PreviewNotice() {
  const text = previewNotice(useSearchParams().get("preview"));
  if (!text) return null;
  return (
    <div role="status" className="border-t border-dotted border-paper/40 bg-ink px-4 py-2 text-center text-xs text-paper">
      <p>{text}</p>
    </div>
  );
}
