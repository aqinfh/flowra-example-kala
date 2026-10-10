import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Photo } from "@/components/photo";
import { RichText } from "@/components/rich-text";
import { ArrowLeft } from "@/components/icons";
import { LineItem, Ticket, TicketTitle } from "@/components/ticket";
import { getCoffeeBySlug, getShop, PUBLIC_SOURCE } from "@/lib/flowra";

export const revalidate = 60;
export const dynamicParams = true;

// Build time has no request, so no Draft Mode: always the public workspace.
export async function generateStaticParams() {
  const slugs = (await getShop(PUBLIC_SOURCE)).map((c) => c.slug).filter(Boolean);
  return [...new Set(slugs)].map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const coffee = await getCoffeeBySlug(slug);
  return coffee ? { title: coffee.name, description: coffee.tasting_notes || undefined } : {};
}

export default async function CoffeePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const coffee = await getCoffeeBySlug(slug);
  if (!coffee) notFound();

  const alt = `${coffee.name} coffee bag`;
  const photo = coffee.bag_photo ? (
    <Photo
      src={coffee.bag_photo.w1200} alt={alt}
      width={coffee.bag_photo.width} height={coffee.bag_photo.height}
      aspect="aspect-square" sizes="(min-width: 1024px) 40vw, 90vw" preload
    />
  ) : coffee.image ? (
    <Photo src={coffee.image} alt={alt} aspect="aspect-square" sizes="(min-width: 1024px) 40vw, 90vw" preload />
  ) : null;

  return (
    // Hangs straight from the header rail, like the home hero.
    <article className="-mt-8">
      <div className="grid items-start gap-x-8 gap-y-10 lg:grid-cols-[1fr_1.2fr]">
        {photo && (
          <Ticket as="div" tilt={0.7} className="lg:sticky lg:top-8">
            {photo}
          </Ticket>
        )}
        <div>
          <Ticket as="div" print>
            <TicketTitle as="h1" className="text-3xl sm:text-4xl">{coffee.name}</TicketTitle>
            <p className="mt-4 font-mono text-3xl font-semibold text-thermal">{coffee.price}</p>
            <p className="mt-5 text-lg leading-relaxed">{coffee.tasting_notes}</p>
            {coffee.description && <RichText html={coffee.description} className="mt-4 text-muted" />}

            <div className="mt-8 space-y-1.5 border-t-2 border-dotted border-steel pt-6">
              {coffee.roast && <LineItem label="Roast" value={coffee.roast} />}
            </div>

            {coffee.origin.length > 0 && (
              <section aria-label={coffee.origin.length > 1 ? "Origins" : "Origin"} className="mt-6 space-y-6">
                {coffee.origin.map((o, i) => (
                  // Origin fields can be empty, so the index keeps keys unique.
                  <div key={`${i}-${o.name}`} className="space-y-1.5">
                    <LineItem label="Origin" value={<span className="font-semibold">{o.name}</span>} />
                    {o.country && <LineItem label="Country" value={o.country} />}
                    {o.region && <LineItem label="Region" value={o.region} />}
                    {o.altitude && <LineItem label="Altitude" value={o.altitude} />}
                    {o.process && <LineItem label="Process" value={o.process} />}
                  </div>
                ))}
              </section>
            )}
          </Ticket>
          <Link
            href="/coffees"
            className="mt-8 inline-flex items-center gap-1.5 text-[0.8125rem] font-semibold tracking-[0.06em] text-muted uppercase hover:text-ink"
          >
            <ArrowLeft /> All coffees
          </Link>
        </div>
      </div>
    </article>
  );
}
