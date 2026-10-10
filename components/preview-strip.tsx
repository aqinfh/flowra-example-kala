import { draftMode } from "next/headers";

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
    <div role="status" className="border-t border-dotted border-paper/40 bg-ink px-4 py-2 text-center text-xs text-paper">
      <p>
        You&apos;re previewing your sandbox ·{" "}
        <a className="font-semibold underline underline-offset-2" href="/preview" rel="nofollow">
          Exit preview
        </a>
      </p>
    </div>
  );
}
