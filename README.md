# Kala Coffee Roasters

A small example site for a made-up coffee shop, built with Next.js 16. None of it is real: the shop, the beans and the people are invented. All the content (coffees, journal articles, cafes, team) comes from the public demo workspace of [Flowra](https://withflowra.com), a headless CMS, so you can see what a real site on top of it looks like.

Live site: https://kala.withflowra.com

## Run it locally

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

Then open http://localhost:3000. The `.env.example` file already has the public demo key, so there is nothing to sign up for. Other scripts are `pnpm build` and `pnpm test`.

## How it connects to Flowra

`lib/flowra.ts` is the only file that calls the API. Pages import its functions (`getHome`, `getShop`, `listJournal` and so on) and never read the env vars themselves, so the key stays on the server. The core of it is `get()`:

```ts
async function get<T = Json>(path: string): Promise<T> {
  const { base, key } = config();
  const res = await fetch(`${base}${path}`, {
    headers: { Authorization: `Bearer ${key}` },
    next: { revalidate: 60, tags: ["flowra"] },
  });
  if (!res.ok) throw new FlowraError(res.status, path);
  try {
    return (await res.json()) as T;
  } catch {
    throw new FlowraError(res.status, path, "response body was not valid JSON");
  }
}
```

Every response is cached for 60 seconds and tagged `flowra`. Lists stop at 100 entries (the API's maximum page size); paginate with `offset` if you have more. The site reads two endpoints composed in the Flowra dashboard (`/e/home` and `/e/shop`), the resource lists `/journal`, `/cafes`, `/team` and `/coffees`, and `/_meta` for SEO settings.

## Instant updates with a webhook

Without a webhook, cached responses are refreshed in the background once they are older than 60 seconds (stale-while-revalidate). The first visitor after that window may see the old copy, and later visitors get the new content. If you want edits to show up right away, add a webhook in your Flowra workspace that points to `/api/revalidate` on your deployed site, and set `FLOWRA_WEBHOOK_SECRET` to the secret Flowra shows you.

Flowra signs each request with an `x-cms-signature` header, in the form `sha256=<hex>`, where the hex value is an HMAC-SHA256 of the raw request body using that secret. The route checks it (`lib/webhook.ts`) and, if it matches, drops the `flowra` cache tag with `revalidateTag("flowra", { expire: 0 })`, so the next request after publishing gets fresh content. It answers 503 if the secret isn't set and 401 if the signature is wrong.

## Notes

- Slug fields in Flowra aren't unique addresses, so detail pages don't ask the API for "the entry with this slug". They load the list and find the slug in it (`findBySlug`).
- Flowra serves resized copies of every image, and the responses include ready-made resize URLs in the `w400` and `w1200` fields (for example `...webp?w=400`). `components/photo.tsx` uses them with `unoptimized`, so Next doesn't resize the image a second time.
- Rich text fields (journal articles, coffee descriptions) are HTML written in the dashboard. `components/rich-text.tsx` is the only place that renders HTML, and it runs everything through `lib/sanitize.ts` first: no scripts or event handlers, links over http or https only, images over https only.
- The demo key is public and read-only, and it only sees the demo workspace. It's rate limited to 60 requests per minute per IP, so a busy local session can get errors for a moment.

## Use your own workspace

Set these in `.env.local`:

```bash
FLOWRA_API_URL=https://your-host/api/v1/your-workspace
FLOWRA_API_KEY=your-key
```

The field names the site expects (`hero_headline`, `tasting_notes`, `cover_image` and so on) are mapped in `lib/flowra.ts`, so you'll need matching resources in your workspace or you'll need to change the mappers.

## License

MIT, see [LICENSE](LICENSE).
