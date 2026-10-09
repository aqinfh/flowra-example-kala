import type { Metadata } from "next";
import { PageHead } from "@/components/page-head";
import { Photo } from "@/components/photo";
import { Rail, Ticket, tiltAt } from "@/components/ticket";
import { listTeam } from "@/lib/flowra";

export const revalidate = 60;
export const metadata: Metadata = { title: "About" };

export default async function AboutPage() {
  const team = await listTeam();
  return (
    <div>
      <PageHead
        title="About"
        lede="Kala Coffee Roasters is a fictional company. These are the people behind the sample."
      />
      <h2 className="ticket-head mb-4 text-2xl">Our team</h2>
      <Rail />
      <ul className="mt-2 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {team.map((m, i) => (
          <li key={m.ref}>
            <Ticket tilt={tiltAt(i + 3)} className="h-full">
              {m.portrait && (
                <Photo
                  src={m.portrait.w400} alt={`Portrait of ${m.name}`} width={m.portrait.width} height={m.portrait.height}
                  sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
                  className="aspect-square object-cover grayscale"
                />
              )}
              <h3 className="ticket-head mt-4 text-[1.0625rem] leading-tight">{m.name}</h3>
              <p className="mt-1 text-[0.6875rem] font-semibold tracking-[0.08em] text-faint uppercase">{m.role}</p>
              <p className="mt-3 text-sm leading-relaxed text-muted">{m.bio}</p>
            </Ticket>
          </li>
        ))}
      </ul>
    </div>
  );
}
