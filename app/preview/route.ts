import { cookies, draftMode } from "next/headers";
import {
  encodePreviewCookie, isDashboardOrigin, parseStartForm, PREVIEW_COOKIE, previewCookieBase, probePreview,
} from "@/lib/preview";

/**
 * POST /preview starts a sandbox preview; GET /preview ends one.
 *
 * Start is a form POST from the Flowra sandbox dashboard (fields `w`, `k`,
 * `x`), never a link: the key must not end up in browser history, in a
 * Referer header or in request logs. GET never reads credentials; it only
 * clears them, so an old link carrying a key in its query string does nothing.
 */
export const dynamic = "force-dynamic";

const HOME = "/";
const START_FAILED = "/?preview=failed";
const ENDED = "/?preview=ended";

// No caching anywhere, and no Referer from the page this redirect lands on.
function seeOther(location: string): Response {
  return new Response(null, {
    status: 303,
    headers: { Location: location, "Cache-Control": "private, no-store", "Referrer-Policy": "no-referrer" },
  });
}

export async function POST(request: Request): Promise<Response> {
  if (!isDashboardOrigin(request.headers.get("origin"))) return seeOther(START_FAILED);
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return seeOther(START_FAILED);
  }
  const start = parseStartForm(form, Date.now());
  if (!start.ok) return seeOther(START_FAILED);
  if (!(await probePreview(start))) return seeOther(START_FAILED);

  (await draftMode()).enable();
  (await cookies()).set(PREVIEW_COOKIE, encodePreviewCookie(start), { ...previewCookieBase(), maxAge: start.maxAge });
  return seeOther(HOME);
}

export async function GET(request: Request): Promise<Response> {
  const ended = new URL(request.url).searchParams.get("ended") === "1";
  (await draftMode()).disable();
  (await cookies()).delete({ name: PREVIEW_COOKIE, ...previewCookieBase() });
  return seeOther(ended ? ENDED : HOME);
}
