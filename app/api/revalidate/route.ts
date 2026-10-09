import { revalidateTag } from "next/cache";
import { verifySignature } from "@/lib/webhook";

/**
 * Point your Flowra workspace's webhook here. When content is published,
 * Flowra posts to this route; a valid signature drops the "flowra" cache tag
 * so the next request fetches fresh content
 * (expire: 0 skips stale-while-revalidate).
 */
export async function POST(request: Request) {
  const secret = process.env.FLOWRA_WEBHOOK_SECRET ?? "";
  if (!secret) return Response.json({ error: "Webhook secret not configured" }, { status: 503 });
  const raw = await request.text();
  if (!verifySignature(secret, raw, request.headers.get("x-cms-signature"))) {
    return Response.json({ error: "Invalid signature" }, { status: 401 });
  }
  revalidateTag("flowra", { expire: 0 });
  return Response.json({ revalidated: true });
}
