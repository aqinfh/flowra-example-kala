import { getMeta, listCafes } from "@/lib/flowra";

/** The last ticket on the rail: where to find Kala, and what this site is. */
export async function SiteFooter() {
  const [{ siteName }, cafes] = await Promise.all([getMeta(), listCafes()]);
  return (
    <footer className="mt-24 bg-ink text-paper">
      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-12 sm:px-8 md:grid-cols-[1.4fr_1fr]">
        <div>
          <p className="ticket-head text-xl">{siteName}</p>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-paper/75">
            {siteName} is a fictional company. Everything on this site, from the coffees to the
            journal, is served from the{" "}
            <a className="underline underline-offset-2" href="https://withflowra.com">
              Flowra
            </a>{" "}
            demo workspace.
          </p>
        </div>
        {cafes.length > 0 && (
          <ul className="space-y-1 text-sm text-paper/80">
            {cafes.map((c) => (
              <li key={c.ref}>{c.name}</li>
            ))}
          </ul>
        )}
      </div>
    </footer>
  );
}
