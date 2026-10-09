import Link from "next/link";
import { ArticleCard } from "@/components/article-card";
import { ArrowRight } from "@/components/icons";
import { Photo } from "@/components/photo";
import { LineItem, Rail, Ticket, TicketMeta, TicketTitle, tiltAt } from "@/components/ticket";
import { getHome, listCafes, listJournal } from "@/lib/flowra";

export const revalidate = 60;

function SectionHead({ id, children, href, linkLabel }: { id: string; children: string; href?: string; linkLabel?: string }) {
  return (
    <div className="mb-4 flex items-end justify-between gap-4">
      <h2 id={id} className="ticket-head text-2xl sm:text-3xl">{children}</h2>
      {href && linkLabel && (
        <Link
          href={href}
          className="flex items-center gap-1.5 text-[0.8125rem] font-semibold tracking-[0.06em] whitespace-nowrap text-muted uppercase hover:text-ink"
        >
          {linkLabel} <ArrowRight />
        </Link>
      )}
    </div>
  );
}

export default async function HomePage() {
  const [home, articles, cafes] = await Promise.all([getHome(), listJournal(3), listCafes()]);
  return (
    <div className="flex flex-col gap-20 sm:gap-24">
      {/* The hero ticket hangs from the header rail and prints out once on load. */}
      <section aria-labelledby="hero-heading" className="-mt-10">
        <Ticket as="div" clip={false} print>
          <div className="grid items-center gap-8 lg:grid-cols-[1.35fr_1fr] lg:gap-12">
            <div className="py-2 lg:py-6">
              <h1 id="hero-heading" className="ticket-head text-[2rem] leading-[1.02] sm:text-[2.75rem] lg:text-[3.1rem]">
                {home.hero_headline}
              </h1>
              <p className="mt-6 max-w-[34rem] text-lg leading-relaxed text-muted">{home.hero_subheading}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/coffees"
                  className="flex items-center gap-2 rounded-[3px] bg-ink px-5 py-3 text-[0.8125rem] font-semibold tracking-[0.06em] text-paper uppercase transition-colors hover:bg-ink-hover"
                >
                  Browse our coffees <ArrowRight />
                </Link>
                <Link
                  href="/cafes"
                  className="rounded-[3px] border border-ink px-5 py-3 text-[0.8125rem] font-semibold tracking-[0.06em] uppercase transition-colors hover:bg-ink hover:text-paper"
                >
                  Find a café
                </Link>
              </div>
              {home.announcement_bar && (
                <p className="mt-8 border-t-2 border-dotted border-steel pt-4 font-mono text-xs leading-relaxed text-thermal uppercase">
                  *** {home.announcement_bar} ***
                </p>
              )}
            </div>
            {home.hero_image && (
              <Photo
                src={home.hero_image} alt="" aspect="aspect-[4/3] lg:aspect-[5/6]"
                sizes="(min-width: 1024px) 45vw, 90vw" preload
              />
            )}
          </div>
        </Ticket>
      </section>

      {/* Featured coffees are printed as line items, prices as the heroes. */}
      {home.featured_coffees.length > 0 && (
        <section aria-labelledby="featured-heading">
          <SectionHead id="featured-heading" href="/coffees" linkLabel="All coffees">Featured coffees</SectionHead>
          <Rail />
          <Ticket as="div" tilt={-0.3} className="mt-2">
            <ul className="divide-y-2 divide-dotted divide-rule">
              {home.featured_coffees.map((c) => (
                <li key={c.slug} className="relative flex items-center gap-4 py-4 first:pt-1 last:pb-1 sm:gap-6">
                  {c.image && (
                    <div className="w-16 shrink-0 sm:w-24">
                      <Photo src={c.image} alt="" aspect="aspect-square" sizes="96px" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <TicketTitle className="sm:text-xl">
                      <Link href={`/coffees/${c.slug}`} className="after:absolute after:inset-0 hover:underline">
                        {c.name}
                      </Link>
                    </TicketTitle>
                    <p className="mt-1 text-sm leading-relaxed text-muted">{c.tasting_notes}</p>
                    {/* On narrow screens the price prints under the notes instead of crowding the name. */}
                    <p className="mt-2 font-mono text-lg font-semibold sm:hidden">{c.price}</p>
                  </div>
                  <span aria-hidden className="leader hidden md:block" />
                  <p className="hidden shrink-0 text-right font-mono text-2xl font-semibold sm:block lg:text-[1.75rem]">{c.price}</p>
                </li>
              ))}
            </ul>
          </Ticket>
        </section>
      )}

      {articles.length > 0 && (
        <section aria-labelledby="journal-heading">
          <SectionHead id="journal-heading" href="/journal" linkLabel="The journal">From the journal</SectionHead>
          <Rail />
          <ul className="rail-stack mt-2 grid gap-y-10 md:grid-cols-3">
            {articles.map((a, i) => (
              <li key={a.ref} className="relative" style={{ zIndex: articles.length - i }}>
                <ArticleCard article={a} tilt={tiltAt(i + 2)} />
              </li>
            ))}
          </ul>
        </section>
      )}

      {cafes.length > 0 && (
        <section aria-labelledby="cafes-heading">
          <SectionHead id="cafes-heading" href="/cafes" linkLabel="Opening hours">Our cafés</SectionHead>
          <Rail />
          <div className="mt-2 max-w-2xl">
            <Ticket as="div" tilt={-0.4}>
              <TicketMeta>{cafes.length === 1 ? "1 café" : `${cafes.length} cafés`}</TicketMeta>
              <div className="mt-4 space-y-3">
                {cafes.map((c) => (
                  <LineItem
                    key={c.ref}
                    stack
                    label={<span className="font-semibold text-ink">{c.name}</span>}
                    value={c.address.split("\n").pop() ?? ""}
                  />
                ))}
              </div>
            </Ticket>
          </div>
        </section>
      )}
    </div>
  );
}
