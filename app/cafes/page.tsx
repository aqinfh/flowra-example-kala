import type { Metadata } from "next";
import { PageHead } from "@/components/page-head";
import { Photo } from "@/components/photo";
import { Rail, Ticket, TicketMeta, tiltAt } from "@/components/ticket";
import { listCafes } from "@/lib/flowra";

export const revalidate = 60;
export const metadata: Metadata = { title: "Cafés" };

export default async function CafesPage() {
  const cafes = await listCafes();
  return (
    <div>
      <PageHead title="Cafés" />
      <Rail />
      <ul className="mt-2 grid gap-x-6 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
        {cafes.map((c, i) => (
          <li key={c.ref}>
            <Ticket tilt={tiltAt(i)} className="h-full">
              {c.photo && (
                <Photo
                  src={c.photo.w1200} alt={`${c.name} café`} width={c.photo.width} height={c.photo.height}
                  sizes="(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 90vw"
                  className="aspect-[4/5] object-cover"
                />
              )}
              <h2 className="ticket-head mt-4 text-xl leading-tight">{c.name}</h2>
              <div className="mt-4 space-y-4">
                <div>
                  <TicketMeta>Address</TicketMeta>
                  <p className="mt-1 leading-relaxed whitespace-pre-line">{c.address}</p>
                </div>
                <div>
                  <TicketMeta>Opening hours</TicketMeta>
                  <p className="mt-1 font-mono text-[0.8125rem] leading-relaxed whitespace-pre-line">{c.opening_hours}</p>
                </div>
              </div>
            </Ticket>
          </li>
        ))}
      </ul>
    </div>
  );
}
