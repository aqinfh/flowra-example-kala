import { draftMode } from "next/headers";
import { PREVIEW_BAND_CLASS } from "@/lib/preview-notice";

/**
 * Shown only while a sandbox preview is on, directly under the honesty strip
 * and in the same ink band. It reads Draft Mode and nothing else, so neither
 * the workspace nor the key can end up in the page.
 *
 * Exit is a plain link to GET /preview, not <Link>: Next.js prefetches <Link>,
 * which would end the preview before anyone clicks.
 */
export async function PreviewStrip() {
  const { isEnabled } = await draftMode();
  if (!isEnabled) return null;
  return (
    <div role="status" className={PREVIEW_BAND_CLASS}>
      <p>
        You&apos;re previewing your sandbox ·{" "}
        <a className="font-semibold underline underline-offset-2" href="/preview" rel="nofollow">
          Exit preview
        </a>
      </p>
    </div>
  );
}
